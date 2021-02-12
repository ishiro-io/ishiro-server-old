import { Inject, forwardRef } from "@nestjs/common";
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { mapSeries } from "async";
import { format } from "date-fns";

import { Anime } from "@ishiro/libs/database/entities";
import animeIds from "@ishiro/libs/external-api/data/anime-ids";
import { ExternalApiService } from "@ishiro/libs/external-api/external-api.service";
import { CreateAnimeInput, UpdateAnimeInput } from "@ishiro/libs/shared/inputs";
import { FixNullPrototypePipe } from "@ishiro/libs/shared/pipes/fix-null-prototype.pipe";
import { AnimeService, EpisodeService } from "@ishiro/libs/shared/services";

import { PopulateAnimesInput } from "./anime.input";
import { PopulatedAnimesOutput } from "./anime.output";

@Resolver(() => Anime)
export class AnimeResolver {
  constructor(
    private readonly animeService: AnimeService,
    @Inject(forwardRef(() => ExternalApiService))
    private readonly externalAPIService: ExternalApiService,
    @Inject(forwardRef(() => EpisodeService))
    private readonly episodeService: EpisodeService
  ) {}

  @Query(() => [Anime], { name: "animes", nullable: false })
  async getAnimes(): Promise<Anime[]> {
    return this.animeService.findAll();
  }

  @Query(() => Anime, { name: "anime", nullable: true })
  async getAnimeById(
    @Args({ name: "id", type: () => Int }) id: number
  ): Promise<Anime> {
    return this.animeService.findById(id);
  }

  @Mutation(() => Anime, { name: "createAnime" })
  async createAnime(@Args("input") input: CreateAnimeInput): Promise<Anime> {
    return this.animeService.createAnime(input);
  }

  @Mutation(() => Anime, { name: "updateAnime" })
  async updateAnime(
    @Args("id", { type: () => Int }) id: number,
    @Args("input", FixNullPrototypePipe) input: UpdateAnimeInput
  ): Promise<Anime> {
    return this.animeService.updateAnime(id, input);
  }

  @Mutation(() => PopulatedAnimesOutput, { nullable: true })
  async populateAnimes(
    @Args("input")
    {
      animeAmount,
      offset,
      doPopulateEpisodes,
      doTranslateDescription,
    }: PopulateAnimesInput
  ): Promise<PopulatedAnimesOutput> {
    const startTime = Date.now();

    const ids = animeIds.slice(offset, animeAmount + offset);

    const animes = (
      await mapSeries<any, Anime>(ids, async (id) => {
        return this.animeService.populateAnime(
          id,
          doPopulateEpisodes,
          doTranslateDescription
        );
      })
    ).filter((a) => a !== null);

    const fields = await mapSeries<Anime, Anime>(animes, async (a) => {
      return this.animeService.findById(a.id);
    });

    const endTime = Date.now();

    return {
      timeToPopulate: format(endTime - startTime, "mm:ss"),
      fields,
    };
  }

  @Mutation(() => Anime, { nullable: true })
  async populateAnime(
    @Args("aid")
    aid: number
  ): Promise<Anime> {
    return this.animeService.populateAnime(aid);
  }

  @ResolveField(() => Int)
  episodeCount(@Parent() anime: Anime): number {
    return anime.episodes.length;
  }
}
