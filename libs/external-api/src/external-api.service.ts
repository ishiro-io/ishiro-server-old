import { v2 } from "@google-cloud/translate";
import { Inject, Injectable, Logger, forwardRef } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { mapSeries } from "async";
import axios from "axios";
import axiosRetry from "axios-retry";
import { gql, rawRequest } from "graphql-request";
import ms from "ms";

import { AnimeType, RelationSource } from "@ishiro/libs/shared/enums";
import {
  CreateAnimeInput,
  CreateEpisodeInput,
} from "@ishiro/libs/shared/inputs";
import { CategoryService, TelegrafService } from "@ishiro/libs/shared/services";
import sleep from "@ishiro/libs/utils/sleep";

import HTTPClient from "./http-client";
import ADBEpisode from "./types/ADBEpisodes";
import UDPClient from "./udp-client";

const { Translate } = v2;
const translate = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });

@Injectable()
export class ExternalApiService {
  private readonly logger = new Logger(ExternalApiService.name);

  public udpClient: UDPClient;

  public httpClient: HTTPClient;

  constructor(
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => TelegrafService))
    private readonly telegrafService: TelegrafService
  ) {
    this.udpClient = new UDPClient({
      username: process.env.ANIDB_USERNAME,
      password: process.env.ANIDB_PASSWORD,
      client: process.env.ANIDB_UDP_CLIENT_NAME,
      clientver: Number(process.env.ANIDB_UDP_CLIENT_VERSION),
      protover: 3,
    });

    this.httpClient = new HTTPClient(
      {
        client: process.env.ANIDB_HTTP_CLIENT_NAME,
        clientver: Number(process.env.ANIDB_HTTP_CLIENT_VERSION),
      },
      this.telegrafService.bot
    );
  }

  @Cron("*/5 * * * * *")
  handleJobs() {
    const udpJob = this.udpClient.jobs.shift();
    if (udpJob) this.udpClient.callRequest(udpJob.request, udpJob.callback);

    const httpJob = this.httpClient.jobs.shift();
    if (httpJob) this.httpClient.callRequest(httpJob);
  }

  isUDPClientUp() {
    return this.udpClient.up;
  }

  async getRelationIds(id: number, source: RelationSource) {
    axiosRetry(axios, { retries: 5 });

    const response = await axios.get(
      `${process.env.RELATIONS_API_ENDPOINT}?source=${source}&id=${id}`
    );

    return response.data;
  }

  async buildNewAnimeInput(
    aid: number,
    doPopulateEpisodes = false,
    doTranslateDescription = false
  ): Promise<NewAnimeInputs> {
    const adbAnime = await this.httpClient.getAnimeById(aid);

    this.logger.debug(`Build new anime input (aid: ${aid})`);

    if (!adbAnime.anilistid) {
      this.logger.error(`Cannot find anilist id for (aid: ${aid})`);
      return null;
    }

    const aniListData = await this.getAniListData(adbAnime.anilistid);

    const descText =
      aniListData?.Media?.description?.replace(/(<([^>]+)>)/gi, "") || "";

    const [description] =
      doTranslateDescription &&
      descText !== "" &&
      process.env.NODE_ENV === "production"
        ? await translate.translate(
            `${descText}\n[Description traduite automatiquement]`,
            "fr"
          )
        : [descText];

    const categories = aniListData
      ? [
          ...aniListData?.Media?.genres,
          ...aniListData?.Media?.tags?.map((t) => t.name),
        ]
      : [];

    const categoriesIds = (
      await mapSeries<any, number>(categories, async (tag) => {
        const category = this.getCategoryId(tag);

        return category;
      })
    ).filter(
      (item: number, index: number, array: number[]) =>
        array.indexOf(item) === index && item !== 0
    );

    const animeInput: CreateAnimeInput = {
      idAniDB: adbAnime.aid,
      title: aniListData?.Media?.title?.userPreferred,
      titleFrench: adbAnime.titleFrench,
      titleEnglish: aniListData?.Media?.title?.english,
      titleRomaji: aniListData?.Media?.title?.romaji,
      titleKanji: aniListData?.Media?.title?.native,
      posterImage:
        aniListData?.Media?.coverImage?.extraLarge ||
        aniListData?.Media?.coverImage?.large,
      bannerImage: aniListData?.Media?.bannerImage,
      description,
      aniDBRating: adbAnime.rating,
      type: this.getType(adbAnime.type),
      releaseDate: adbAnime.startDate,
      endDate: adbAnime.endDate,
      isAdult: adbAnime.restricted,
      categoriesIds,
    };

    let episodeInputs: CreateEpisodeInput[];
    if (doPopulateEpisodes && adbAnime.episodes?.length > 0) {
      if (animeInput.type === AnimeType.MOVIE) {
        const completeMovie = adbAnime.episodes.find(
          (e) => e.title === "Complete Movie"
        );

        if (completeMovie) {
          episodeInputs = [this.buildEpisodeInput(completeMovie)];
        } else {
          episodeInputs = adbAnime.episodes.map<CreateEpisodeInput>((e) =>
            this.buildEpisodeInput(e)
          );
        }
      } else {
        episodeInputs = adbAnime.episodes.map<CreateEpisodeInput>((e) =>
          this.buildEpisodeInput(e)
        );
      }
    }

    return { animeInput, episodeInputs };
  }

  buildEpisodeInput(adbEpisode: ADBEpisode): CreateEpisodeInput {
    const input: CreateEpisodeInput = {
      animeId: -1,
      number: adbEpisode.epno,
      title: adbEpisode.title,
      airedDate: adbEpisode.date,
      length: adbEpisode.length,
    };

    return input;
  }

  async getAniListData(id: number) {
    const AniListMedia = gql`
      query AniListMedia($id: Int!) {
        Media(id: $id, type: ANIME) {
          title {
            romaji
            english
            native
            userPreferred
          }
          description
          coverImage {
            large
            extraLarge
          }
          bannerImage
          genres
          tags {
            name
          }
        }
      }
    `;

    try {
      const { data } = await rawRequest(
        "https://graphql.anilist.co",
        AniListMedia,
        {
          id,
        }
      );

      return data;
    } catch (error) {
      this.logger.error(error);

      await sleep(ms("10s"));

      return this.getAniListData(id);
    }
  }

  getCalendarFields() {
    return this.udpClient.getCalendar();
  }

  getUpdatedAnimeIds() {
    return this.udpClient.getUpdatedAnimeIds();
  }

  private async getCategoryId(name: string): Promise<number> {
    switch (name) {
      case "Comedy":
        return this.categoryService.findIdFromName("Comédie");

      case "Fantasy":
        return this.categoryService.findIdFromName("Fantasy");

      case "Romance":
        return this.categoryService.findIdFromName("Romance");

      case "Action":
        return this.categoryService.findIdFromName("Action");

      case "School":
      case "School Life":
      case "School Club":
        return this.categoryService.findIdFromName("Vie à l'école");

      case "Drama":
        return this.categoryService.findIdFromName("Drame");

      case "Adventure":
        return this.categoryService.findIdFromName("Aventure");

      case "Slice of Life":
        return this.categoryService.findIdFromName("Tranche de vie");

      case "Shoujo":
      case "Mahou Shoujo":
        return this.categoryService.findIdFromName("Shojo");

      case "Sci-Fi":
      case "Space":
        return this.categoryService.findIdFromName("Science-fiction");

      case "Yaoi":
      case "Shounen Ai":
        return this.categoryService.findIdFromName("Yaoi");

      case "Shoujo Ai":
        return this.categoryService.findIdFromName("Yuri");

      case "Ecchi":
        return this.categoryService.findIdFromName("Ecchi");

      case "Sports":
        return this.categoryService.findIdFromName("Sports");

      case "Historical":
        return this.categoryService.findIdFromName("Historique");

      case "Thriller":
        return this.categoryService.findIdFromName("Thriller");

      case "Harem":
      case "Reverse Harem":
        return this.categoryService.findIdFromName("Harem");

      case "Mystery":
        return this.categoryService.findIdFromName("Mystère");

      case "Magic":
        return this.categoryService.findIdFromName("Magie");

      case "Horror":
        return this.categoryService.findIdFromName("Horreur");

      case "Music":
        return this.categoryService.findIdFromName("Musique");

      case "Mecha":
        return this.categoryService.findIdFromName("Mecha");

      case "Psychological":
        return this.categoryService.findIdFromName("Psychologique");

      case "Shounen":
        return this.categoryService.findIdFromName("Shonen");

      case "Martial Arts":
        return this.categoryService.findIdFromName("Arts martiaux");

      case "Super Power":
        return this.categoryService.findIdFromName("Super pouvoir");

      case "Supernatural":
        return this.categoryService.findIdFromName("Surnaturel");

      case "Military":
        return this.categoryService.findIdFromName("Militaire");

      case "Seinen":
        return this.categoryService.findIdFromName("Seinen");

      case "Police":
      case "Detective":
        return this.categoryService.findIdFromName("Policier");

      case "Josei":
        return this.categoryService.findIdFromName("Josei");

      case "Food":
      case "Cooking":
        return this.categoryService.findIdFromName("Cuisine");

      default:
        return 0;
    }
  }

  private getType(type: string): AnimeType {
    switch (type) {
      case "TV Series":
        return AnimeType.TV;

      case "OVA":
        return AnimeType.OVA;

      case "Movie":
        return AnimeType.MOVIE;

      case "TV Special":
        return AnimeType.TV_SPECIAL;

      case "ONA":
        return AnimeType.ONA;

      case "Music":
        return AnimeType.MUSIC;

      case "Web":
        return AnimeType.WEB;

      default:
        this.logger.warn(`Anime type not found => ${type}`);
        return AnimeType.TV;
    }
  }
}

interface NewAnimeInputs {
  animeInput: CreateAnimeInput;
  episodeInputs?: CreateEpisodeInput[];
}
