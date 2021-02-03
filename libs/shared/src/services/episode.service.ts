import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { Episode } from "@ishiro/libs/database/entities";

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

  findAllFromAnime(animeId: number): Promise<Episode[]> {
    return this.episodeRepository.find({ where: { anime: animeId } });
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
    const check = await this.episodeRepository.findOne({
      where: { number: data.number, anime: data.animeId },
      relations: ["anime"],
    });

    if (check) return check;

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
}
