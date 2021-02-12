import { Inject, Injectable, Logger, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { mapSeries } from "async";
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

  private readonly logger = new Logger(EpisodeService.name);

  findAll(): Promise<Episode[]> {
    return this.episodeRepository.find();
  }

  findAllFromAnime(animeId: number): Promise<Episode[]> {
    return this.episodeRepository.find({
      where: { anime: animeId },
      order: { number: "ASC" },
    });
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
    this.logger.debug(
      `Create episode ${data.number} (anime.id: ${data.animeId})`
    );

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

  async createEpisodes(
    data: CreateEpisodeInput[],
    animeId: number
  ): Promise<Episode[]> {
    this.logger.debug(`Create ${data.length} episodes (anime.id: ${animeId})`);

    const anime = await this.animeService.findById(animeId);

    const episodes = (
      await mapSeries<CreateEpisodeInput, Episode>(data, async (input) => {
        let episode = await this.episodeRepository.findOne({
          where: { number: input.number, anime: animeId },
          relations: ["anime"],
        });

        if (episode) {
          const updateInput = { ...input };
          delete updateInput.animeId;
          await this.episodeRepository.update(episode.id, updateInput);

          episode = await this.episodeRepository.findOne({
            where: { number: input.number, anime: animeId },
            relations: ["anime"],
          });
        } else {
          episode = await this.episodeRepository.create(input);
          episode.anime = anime;
        }

        return episode;
      })
    ).filter((e) => e !== undefined);

    await Episode.save(episodes);

    const fields = episodes.sort((a, b) => a.number - b.number);

    return fields;
  }

  async updateEpisode(id: number, data: UpdateEpisodeInput): Promise<Episode> {
    await this.episodeRepository.update(id, data);

    const episode = await this.episodeRepository.findOneOrFail({ id });

    return episode.save();
  }
}
