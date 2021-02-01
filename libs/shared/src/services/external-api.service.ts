import { v2 } from "@google-cloud/translate";
import { Inject, Injectable, Logger, forwardRef } from "@nestjs/common";
import { mapSeries } from "async";
import { formatDuration } from "date-fns";
import { fr } from "date-fns/locale";
import { gql, rawRequest } from "graphql-request";
import Jikan from "jikants";

import { AnimeStatus, AnimeType } from "@ishiro/libs/database/enums";

import unusedCategoryName from "../data/unused-category-name";
import { CreateAnimeInput, CreateEpisodeInput } from "../inputs";
import { CategoryService } from "./category.service";

const { Translate } = v2;
const translate = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });

@Injectable()
export class ExternalAPIService {
  constructor(
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService
  ) {}

  private readonly logger = new Logger(ExternalAPIService.name);

  async buildNewAnimeInput(idMAL: number, doTranslateDescription: boolean) {
    const AniListMedia = gql`
      query AniListMedia($idMal: Int!) {
        Media(idMal: $idMal) {
          coverImage {
            large
            extraLarge
          }
          bannerImage
          isAdult
        }
      }
    `;

    const jikanAnime = await Jikan.Anime.byId(idMAL);

    if (!jikanAnime) throw new Error(`Cannot find anime (id MAL: ${idMAL})`);

    const { data: aniListData } = await rawRequest(
      "https://graphql.anilist.co",
      AniListMedia,
      {
        idMal: idMAL,
      }
    );

    const { title } = jikanAnime;
    const titleEnglish = jikanAnime.title_english;
    const titleJapanese = jikanAnime.title_japanese;

    const posterImage =
      aniListData.Media.coverImage.extraLarge ??
      aniListData.Media.coverImage.extraLarge;
    const bannerImage = aniListData.Media.bannerImage ?? posterImage;

    const synopsis = jikanAnime.synopsis
      .replace("(Source: MAL Rewrite)", "")
      .replace("[Written by MAL Rewrite]", "")
      .replace("(Source: ANN)", "")
      .trim();

    const [description] = doTranslateDescription
      ? await translate.translate(
          `${synopsis}\n[Description traduite automatiquement]`,
          "fr"
        )
      : [synopsis];

    const MALRating = jikanAnime.score;
    const status = this.getAnimeStatusFromJikanStatus(jikanAnime.status);
    const type = this.getAnimeTypeFromJikanType(jikanAnime.type);

    const { isAdult } = aniListData.Media;

    const releaseDate = jikanAnime.aired.from as any;
    const endDate = jikanAnime.aired.to as any;

    const durationString = jikanAnime.duration;

    let duration: string;

    if (durationString.includes("hr")) {
      const times = durationString
        .replace(" hr ", ":")
        .replace(" min", "")
        .split(":");

      const hours = Number.parseInt(times[0], 10);
      const minutes = Number.parseInt(times[1], 10);

      duration = formatDuration({ minutes, hours }, { locale: fr });
    } else {
      const minutes = Number.parseInt(
        durationString.replace("min", "").replace(" per ep", ""),
        10
      );

      duration = formatDuration({ minutes }, { locale: fr });
    }

    const categoriesIdsWithDuplicates = await mapSeries<any, number>(
      jikanAnime.genres,
      async ({ name }) => {
        const id = await this.getCategoryIdFromJikanName(name);

        return id;
      }
    );

    const categoriesIds = categoriesIdsWithDuplicates.filter(
      (item: number, index: number) =>
        categoriesIdsWithDuplicates.indexOf(item) === index && item !== 0
    );

    const input: CreateAnimeInput = {
      idMAL,
      title,
      titleEnglish,
      titleJapanese,
      posterImage,
      bannerImage,
      description,
      MALRating,
      type,
      isAdult,
      releaseDate,
      endDate,
      duration,
      status,
      categoriesIds,
    };

    return input;
  }

  async buildAnimeEpisodesInput(idMAL: number, animeId: number) {
    const lastPage =
      (await Jikan.Anime.episodes(idMAL, 1))?.episodes_last_page || 1;

    const pages = new Array(lastPage).fill(null).map((_, index) => index + 1);

    const inputs = (
      await mapSeries<any, CreateEpisodeInput>(pages, async (index) => {
        const page = await Jikan.Anime.episodes(idMAL, index);

        return page.episodes.map((e) => {
          const input: CreateEpisodeInput = {
            animeId,
            title: e.title,
            number: e.episode_id,
            airedDate: e.aired as any,
          };

          return input;
        });
      })
    ).flat();

    return inputs;
  }

  async getCategoryIdFromJikanName(name: string): Promise<number> {
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
        return this.categoryService.findIdFromName("Vie à l'école");

      case "Drama":
        return this.categoryService.findIdFromName("Drame");

      case "Adventure":
        return this.categoryService.findIdFromName("Aventure");

      case "Slice of Life":
        return this.categoryService.findIdFromName("Tranche de vie");

      case "Shoujo":
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
        if (!unusedCategoryName.find((n) => n === name))
          this.logger.warn(`Category not found - ${name}`);
        return 0;
    }
  }

  getAnimeStatusFromJikanStatus(status: string): AnimeStatus {
    switch (status) {
      case "Not yet aired":
        return AnimeStatus.COMING_SOON;

      case "Currently Airing":
        return AnimeStatus.ONGOING;

      case "Finished Airing":
        return AnimeStatus.FINISHED;

      default:
        this.logger.warn(`Anime status not found => ${status}`);
        return AnimeStatus.ONGOING;
    }
  }

  getAnimeTypeFromJikanType(type: string): AnimeType {
    switch (type) {
      case "TV":
        return AnimeType.TV;

      case "OVA":
        return AnimeType.OVA;

      case "Movie":
        return AnimeType.MOVIE;

      case "Special":
        return AnimeType.TV_SPECIAL;

      case "ONA":
        return AnimeType.ONA;

      case "Music":
        return AnimeType.MUSIC;

      default:
        this.logger.warn(`Anime type not found => ${type}`);
        return AnimeType.TV;
    }
  }
}
