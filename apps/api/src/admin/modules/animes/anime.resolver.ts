import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";

import { Anime } from "@ishiro/libs/database/entities";
import { CreateAnimeInput, UpdateAnimeInput } from "@ishiro/libs/shared/inputs";
import { FixNullPrototypePipe } from "@ishiro/libs/shared/pipes/fixNullPrototype.pipe";
import { AnimeService } from "@ishiro/libs/shared/services";

@Resolver(() => Anime)
export class AnimeResolver {
  constructor(private readonly animeService: AnimeService) {}

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

  @ResolveField(() => Int)
  episodeCount(@Parent() anime: Anime): number {
    return anime.episodes.length;
  }
}
