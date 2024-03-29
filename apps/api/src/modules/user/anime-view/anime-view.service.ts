import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Episode, User, UserAnimeView } from "@ishiro/libs/database/entities";
import { AnimeViewStatus } from "@ishiro/libs/shared/enums";
import { PaginationInput } from "@ishiro/libs/shared/inputs";
import { AnimeService, EpisodeService } from "@ishiro/libs/shared/services";

import { UserService } from "../user.service";
import { UserAnimeViewsByStatusOutput } from "./anime-view.output";

@Injectable()
export class AnimeViewService {
  constructor(
    @InjectRepository(UserAnimeView)
    private readonly userAnimeViewRepository: Repository<UserAnimeView>,
    @Inject(forwardRef(() => AnimeService))
    private readonly animeService: AnimeService,
    @Inject(forwardRef(() => EpisodeService))
    private readonly episodeService: EpisodeService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  async getAll(user: User): Promise<UserAnimeView[]> {
    const views = await this.userAnimeViewRepository.find({
      where: { user },
      relations: ["anime", "episodeViews", "episodeViews.episode"],
      order: { updatedAt: "DESC" },
    });

    return views;
  }

  async getByStatus(
    user: User,
    status: AnimeViewStatus,
    { limit, offset }: PaginationInput
  ): Promise<UserAnimeViewsByStatusOutput> {
    const total = await this.userAnimeViewRepository.count({
      where: { user, status },
    });
    const fields = await this.userAnimeViewRepository.find({
      where: { user, status },
      relations: ["anime", "episodeViews", "episodeViews.episode"],
      order: { updatedAt: "DESC" },
      take: limit + 1,
      skip: offset,
    });

    return {
      hasMore: fields.length === limit + 1,
      total,
      fields: fields.slice(0, limit),
    };
  }

  async getByAnimeId(user: User, animeId: number): Promise<UserAnimeView> {
    return this.userAnimeViewRepository.findOne({
      where: { user, anime: animeId },
      relations: ["anime", "episodeViews", "episodeViews.episode"],
    });
  }

  async setStatus(user: User, animeId: number, status: AnimeViewStatus) {
    let userAnime = await this.userAnimeViewRepository.findOne({
      where: { user, anime: animeId },
      relations: ["anime", "episodeViews", "episodeViews.episode"],
    });

    if (!userAnime) {
      userAnime = new UserAnimeView();
      userAnime.user = await this.userService.findById(user.id);
      userAnime.anime = await this.animeService.findById(animeId);
      userAnime.episodeViews = [];
    }

    userAnime.status = status;

    return userAnime.save();
  }

  async getLastEpisodeSeen(userAnimeView: UserAnimeView): Promise<Episode> {
    if (!userAnimeView.episodeViews.length) return undefined;

    const sortedEpisodesStatus = userAnimeView.episodeViews.sort(
      (a, b) => a.episode.number - b.episode.number
    );

    const filteredEpisodesStatus = sortedEpisodesStatus.filter(
      (e) => e.hasBeenSeen
    );

    return filteredEpisodesStatus[filteredEpisodesStatus.length - 1].episode;
  }

  async getNextEpisodeToSee(userAnimeView: UserAnimeView): Promise<Episode> {
    const episodeCount = await this.episodeService.getCount(
      userAnimeView.anime.id
    );
    if (episodeCount <= 1) return undefined;

    const lastEpisodeSeen = await this.getLastEpisodeSeen(userAnimeView);

    const possibleNextEpisodeNumber = lastEpisodeSeen
      ? lastEpisodeSeen.number + 1
      : 1;

    return Episode.findOne({
      where: { anime: userAnimeView.anime, number: possibleNextEpisodeNumber },
    });
  }
}
