import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { Anime, Episode } from "@ishiro/libs/database/entities";

import { CreateEpisodeInput, UpdateEpisodeInput } from "../inputs";
import { AnimeService } from "./anime.service";

@Injectable()
export class EpisodeService {
  constructor(
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
    @Inject(forwardRef(() => AnimeService))
    private readonly animeService: AnimeService
  ) {}

  findAll(): Promise<Episode[]> {
    return this.episodeRepository.find();
  }

  findById(id: number): Promise<Episode> {
    return this.episodeRepository.findOneOrFail({
      id,
    });
  }

  findByIds(ids: number[]): Promise<Episode[]> {
    return this.episodeRepository.find({
      where: { id: In(ids) },
    });
  }

  async createEpisode(data: CreateEpisodeInput): Promise<Episode> {
    const episode = await this.episodeRepository.create(data);

    const anime = await this.animeService.findById(data.animeId);

    episode.anime = anime;

    return episode.save();
  }

  async updateEpisode(id: number, data: UpdateEpisodeInput): Promise<Episode> {
    await this.episodeRepository.update(id, data);

    const episode = await this.episodeRepository.findOneOrFail({ id });

    return episode.save();
  }

  async setAnime(ids: number[], anime: Anime) {
    await this.episodeRepository
      .createQueryBuilder("episode")
      .update()
      .set({ anime })
      .whereInIds(ids)
      .execute();
  }
}
