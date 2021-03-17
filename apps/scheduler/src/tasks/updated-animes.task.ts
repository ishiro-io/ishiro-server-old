import { Inject, Injectable, Logger, forwardRef } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { mapSeries } from "async";

import { Anime } from "@ishiro/libs/database/entities";
import { ExternalApiService } from "@ishiro/libs/external-api/external-api.service";
import { AnimeService } from "@ishiro/libs/shared/services";

@Injectable()
export class UpdatedAnimesTask {
  constructor(
    @Inject(forwardRef(() => ExternalApiService))
    private readonly externalAPIService: ExternalApiService,
    @Inject(forwardRef(() => AnimeService))
    private readonly animeService: AnimeService
  ) {}

  private readonly logger = new Logger(UpdatedAnimesTask.name);

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async handleCron() {
    await this.externalAPIService.isUDPClientUp();

    this.logger.debug("Start recovering updated animes");

    const ids = await this.externalAPIService.getUpdatedAnimeIds();

    await mapSeries<any, Anime>(ids, async (id) => {
      return this.animeService.populateAnime(id);
    });

    this.logger.debug("Finished recovering updated animes");
  }
}
