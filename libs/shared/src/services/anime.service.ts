import { Inject, Injectable, Logger, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Fuse from "fuse.js";
import ms from "ms";
import { In, Repository } from "typeorm";

import { Anime } from "@ishiro/libs/database/entities";
import { ExternalApiService } from "@ishiro/libs/external-api/external-api.service";

import { CreateAnimeInput, PaginationInput, UpdateAnimeInput } from "../inputs";
import { SearchAnimesInput } from "../inputs/anime.input";
import { AnimesOutput } from "../outputs";
import Arc from "../outputs/anime.output";
import { CategoryService } from "./category.service";
import { EpisodeService } from "./episode.service";

@Injectable()
export class AnimeService {
  constructor(
    @InjectRepository(Anime)
    private readonly animeRepository: Repository<Anime>,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => EpisodeService))
    private readonly episodeService: EpisodeService,
    @Inject(forwardRef(() => ExternalApiService))
    private readonly externalAPIService: ExternalApiService
  ) {}

  private readonly logger = new Logger(AnimeService.name);

  findAll(): Promise<Anime[]> {
    return this.animeRepository.find({ relations: ["categories", "episodes"] });
  }

  findById(id: number): Promise<Anime> {
    return this.animeRepository.findOneOrFail(
      {
        id,
      },
      { relations: ["categories", "episodes"] }
    );
  }

  findByIds(ids: number[]): Promise<Anime[]> {
    return this.animeRepository.find({
      where: { id: In(ids), relations: ["categories", "episodes"] },
    });
  }

  async getPaginatedAnimes(
    options: PaginationInput,
    categoryId?: number
  ): Promise<AnimesOutput> {
    const total = await this.animeRepository.count();

    const queryBuilder = this.animeRepository
      .createQueryBuilder("anime")
      .leftJoinAndSelect("anime.categories", "category")
      .leftJoinAndSelect("anime.episodes", "episodes")
      .where("anime.aniDBRating IS NOT NULL")
      .take(options.limit + 1)
      .skip(options.offset)
      .orderBy("anime.aniDBRating", "DESC");

    if (categoryId)
      queryBuilder.andWhere("category.id = :categoryId", {
        categoryId,
      });

    const fields = await queryBuilder.getMany();

    return {
      total,
      hasMore: fields.length === options.limit + 1,
      fields: fields.slice(0, options.limit),
    };
  }

  async searchAnimes(
    options: PaginationInput,
    input: SearchAnimesInput
  ): Promise<AnimesOutput> {
    const animes = await Anime.find({
      order: { aniDBRating: "DESC" },
      cache: ms("1d"),
    });

    const fuse = new Fuse(animes, {
      keys: ["title", "titleEnglish", "titleRomaji", "titleKanji"],
      threshold: 0.35,
    });

    const searchedFields = fuse.search(input.textSearchField);

    const fields = searchedFields
      .slice(options.offset, options.limit + options.offset + 1)
      .map((s) => s.item);

    return {
      fields: fields.slice(0, options.limit),
      total: searchedFields.length,
      hasMore: fields.length === options.limit + 1,
    };
  }

  async createAnime(data: CreateAnimeInput): Promise<Anime> {
    this.logger.debug(`Create anime ${data.title} (aid: ${data.idAniDB})`);
    let anime = await this.animeRepository.findOne({
      where: { idAniDB: data.idAniDB },
    });

    // ? L'anime existe déja en base de donnée
    // ? on le met à jour
    if (anime) {
      const updateData = { ...data };
      delete updateData.categoriesIds;
      delete updateData.description;
      await this.animeRepository.update(anime.id, updateData);

      anime = await this.animeRepository.findOne({
        where: { title: data.title },
      });
    } else {
      anime = await this.animeRepository.create(data);
    }

    if (data.categoriesIds?.length > 0) {
      const categories = await Promise.all(
        data.categoriesIds.map((id) => this.categoryService.findById(id))
      );

      anime.categories = categories;
    }

    return anime.save();
  }

  async updateAnime(id: number, data: UpdateAnimeInput): Promise<Anime> {
    await this.animeRepository.update(id, data);

    const anime = await this.animeRepository.findOneOrFail({ id });

    return anime;
  }

  async populateAnime(
    aid: number,
    doPopulateEpisodes = true,
    doTranslateDescription = true
  ) {
    const input = await this.externalAPIService.buildNewAnimeInput(
      aid,
      doPopulateEpisodes,
      doTranslateDescription
    );

    if (!input) return null;

    const anime = await this.createAnime(input.animeInput);

    if (input.episodeInputs) {
      const inputs = input.episodeInputs.map((i) => {
        return { ...i, animeId: anime.id };
      });

      await this.episodeService.createEpisodes(inputs, anime.id);
    }

    return anime;
  }

  async getArcs(anime: Anime) {
    const episodes = await this.episodeService.findAllFromAnime(anime.id);

    if (episodes.length <= 0) return null;

    const arcs = episodes.reduce<Arc[]>((previousValue, currentValue) => {
      let arc = previousValue.find((arc) => arc.title === currentValue.arcName);

      if (arc) {
        arc.lastEpisodeNumber = currentValue.number;
        return [...previousValue.filter((p) => p.title !== arc.title), arc];
      }

      arc = {
        title: currentValue.arcName,
        firstEpisodeNumber: currentValue.number,
        lastEpisodeNumber: currentValue.number,
      };

      return [...previousValue, arc];
    }, []);

    return arcs;
  }
}
