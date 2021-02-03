import {
  Args,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";

import { Anime } from "@ishiro/libs/database/entities";
import { PaginationInput } from "@ishiro/libs/shared/inputs";
import { SearchAnimesInput } from "@ishiro/libs/shared/inputs/anime.input";
import { AnimesOutput } from "@ishiro/libs/shared/outputs";
import Arc from "@ishiro/libs/shared/outputs/anime.output";
import { AnimeService } from "@ishiro/libs/shared/services";

@Resolver(() => Anime)
export class AnimeResolver {
  constructor(private readonly animeService: AnimeService) {}

  @Query(() => Anime, {
    name: "anime",
    nullable: true,
  })
  getAnime(@Args("id") id?: number): Promise<Anime | undefined> {
    return this.animeService.findById(id);
  }

  @Query(() => AnimesOutput, {
    name: "animes",
  })
  getAnimes(
    @Args("options", { defaultValue: { limit: 20, offset: 0 } })
    options: PaginationInput,
    @Args("categoryId", { nullable: true }) categoryId?: number
  ): Promise<AnimesOutput> {
    return this.animeService.getPaginatedAnimes(options, categoryId);
  }

  @Query(() => AnimesOutput, { nullable: true })
  searchAnimes(
    @Args("options", { defaultValue: { limit: 20, offset: 0 } })
    options: PaginationInput,
    @Args("input") input: SearchAnimesInput
  ): Promise<AnimesOutput> {
    return this.animeService.searchAnimes(options, input);
  }

  @ResolveField(() => Int)
  episodeCount(@Parent() anime: Anime): number {
    return anime.episodes.length;
  }

  @ResolveField(() => [Arc], { name: "arcs", nullable: true })
  getArcs(@Parent() anime: Anime): Promise<Arc[]> {
    return this.animeService.getArcs(anime);
  }
}
