import { Args, Int, Query, Resolver } from "@nestjs/graphql";

import { Episode } from "@ishiro/libs/database/entities";
import { EpisodeService } from "@ishiro/libs/shared/services";

@Resolver(() => Episode)
export class EpisodeResolver {
  constructor(private readonly episodeService: EpisodeService) {}

  @Query(() => Episode, { name: "episode", nullable: true })
  async getEpisodeById(
    @Args({ name: "id", type: () => Int }) id: number
  ): Promise<Episode> {
    return this.episodeService.findById(id);
  }

  @Query(() => [Episode], { name: "episodes", nullable: false })
  async getEpisodes(@Args("animeId") animeId: number): Promise<Episode[]> {
    return this.episodeService.findAllFromAnime(animeId);
  }
}
