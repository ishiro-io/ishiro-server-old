import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";

import { Episode } from "@ishiro/libs/database/entities";
import {
  CreateEpisodeInput,
  UpdateEpisodeInput,
} from "@ishiro/libs/shared/inputs";
import { FixNullPrototypePipe } from "@ishiro/libs/shared/pipes/fix-null-prototype.pipe";
import { EpisodeService } from "@ishiro/libs/shared/services";

@Resolver(() => Episode)
export class EpisodeResolver {
  constructor(private readonly episodeService: EpisodeService) {}

  @Query(() => [Episode], { name: "episodes", nullable: false })
  async getEpisodes(): Promise<Episode[]> {
    return this.episodeService.findAll();
  }

  @Query(() => Episode, { name: "episode", nullable: true })
  async getEpisodeById(
    @Args({ name: "id", type: () => Int }) id: number
  ): Promise<Episode> {
    return this.episodeService.findById(id);
  }

  @Mutation(() => Episode, { name: "createEpisode" })
  async createEpisode(
    @Args("input") input: CreateEpisodeInput
  ): Promise<Episode> {
    return this.episodeService.createEpisode(input);
  }

  @Mutation(() => Episode, { name: "updateEpisode" })
  async updateEpisode(
    @Args("id", { type: () => Int }) id: number,
    @Args("input", FixNullPrototypePipe) input: UpdateEpisodeInput
  ): Promise<Episode> {
    return this.episodeService.updateEpisode(id, input);
  }
}
