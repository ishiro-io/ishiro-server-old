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

import idsMALList from "@ishiro/admin/data/mal-ids-list";
import { Anime } from "@ishiro/libs/database/entities";
import { CreateAnimeInput, UpdateAnimeInput } from "@ishiro/libs/shared/inputs";
import { FixNullPrototypePipe } from "@ishiro/libs/shared/pipes/fix-null-prototype.pipe";
import { AnimeService, EpisodeService } from "@ishiro/libs/shared/services";
import { ExternalAPIService } from "@ishiro/libs/shared/services/external-api.service";
import { delay } from "@ishiro/libs/utils";

import { PopulateAnimesInput, PopulatedAnimesOutput } from "./anime.input";

@Resolver(() => Anime)
export class AnimeResolver {
  constructor(
    private readonly animeService: AnimeService,
    @Inject(forwardRef(() => ExternalAPIService))
    private readonly externalAPIService: ExternalAPIService,
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
  ): Promise<PopulatedAnimesOutput | null> {
    const startTime = Date.now();

    const idsMAL = idsMALList.slice(offset, animeAmount + offset);

    const inputs = await mapSeries<any, CreateAnimeInput>(
      idsMAL,
      async (id) => {
        await delay(5000);
        return this.externalAPIService.buildNewAnimeInput(
          id,
          doTranslateDescription
        );
      }
    );

    const animes = await mapSeries<any, Anime>(inputs, async (input) => {
      const anime = await this.animeService.createAnime(input);
      return anime;
    });

    if (doPopulateEpisodes) {
      await mapSeries(animes, async (a) => {
        const episodeInputs = await this.externalAPIService.buildAnimeEpisodesInput(
          a.idMAL,
          a.id
        );

        await mapSeries(episodeInputs, async (input) => {
          const episode = await this.episodeService.createEpisode(input);

          return episode;
        });
      });
    }

    const fields = await mapSeries<Anime, Anime>(animes, async (a) => {
      return this.animeService.findById(a.id);
    });

    const endTime = Date.now();

    return {
      timeToPopulate: format(endTime - startTime, "mm:ss"),
      fields,
    };
  }

  @ResolveField(() => Int)
  episodeCount(@Parent() anime: Anime): number {
    return anime.episodes.length;
  }
}
