import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { mapSeries } from "async";
import { format } from "date-fns";
import { Repository } from "typeorm";

import { Episode, User, UserEpisodeView } from "@ishiro/libs/database/entities";
import { EpisodeService } from "@ishiro/libs/shared/services";

import { AnimeViewService } from "../anime-view/anime-view.service";
import {
  NewEpisodeView,
  SetUserAnimeEpisodesStatusInput,
} from "./episode-view.input";
import EpisodeWithStatus from "./episode-view.output";

@Injectable()
export class EpisodeViewService {
  constructor(
    @InjectRepository(UserEpisodeView)
    private readonly userEpisodeViewRepository: Repository<UserEpisodeView>,
    @Inject(forwardRef(() => AnimeViewService))
    private readonly animeViewService: AnimeViewService,
    @Inject(forwardRef(() => EpisodeService))
    private readonly episodeService: EpisodeService
  ) {}

  async getAnimeEpisodesStatus(
    user: User,
    animeId: number
  ): Promise<EpisodeWithStatus[]> {
    const animeView = await this.animeViewService.getByAnimeId(user, animeId);

    const episodes = await this.episodeService.findAllFromAnime(animeId);
    if (!episodes) return null;

    const episodesStatus = await mapSeries<Episode, EpisodeWithStatus>(
      episodes,
      async (episode): Promise<EpisodeWithStatus> => {
        if (!animeView) return { episode, view: undefined };

        const view = await this.userEpisodeViewRepository.findOne({
          where: { episode, animeView },
          relations: ["animeView", "episode"],
        });

        return { episode, view };
      }
    );

    return episodesStatus;
  }

  async setAnimeEpisodesStatus(
    user: User,
    { animeId, newEpisodeViews }: SetUserAnimeEpisodesStatusInput
  ): Promise<UserEpisodeView[]> {
    const newEpisodeStatusWithoutDuplicates = newEpisodeViews.filter(
      (item, index) =>
        index ===
        newEpisodeViews.findIndex(
          (i) =>
            i.episodeNumber === item.episodeNumber && i.toSeen === item.toSeen
        )
    );

    const animeView = await this.animeViewService.getByAnimeId(user, animeId);

    const episodesViews = (
      await mapSeries<NewEpisodeView, UserEpisodeView>(
        newEpisodeStatusWithoutDuplicates,
        async (newEpisodeView): Promise<UserEpisodeView> => {
          const episode = await Episode.findOneOrFail({
            where: { number: newEpisodeView.episodeNumber, anime: animeId },
          });

          let episodeView = await this.userEpisodeViewRepository.findOne({
            where: [{ animeView, episode }],
            relations: ["animeView", "episode"],
          });

          // ? Si il n'existe pas, en créé un nouveau
          if (!episodeView) {
            episodeView = new UserEpisodeView();
            episodeView.animeView = animeView;
            episodeView.episode = await this.episodeService.findById(
              episode.id
            );
          }

          if (episodeView.hasBeenSeen === newEpisodeView.toSeen) return null;

          episodeView.hasBeenSeen = newEpisodeView.toSeen;
          return episodeView;
        }
      )
    ).filter((ues) => ues !== null);

    animeView.updatedAt = format(Date.now(), "yyyy-MM-dd hh:mm:ss");
    await animeView.save();

    return this.userEpisodeViewRepository.save(episodesViews);
  }
}
