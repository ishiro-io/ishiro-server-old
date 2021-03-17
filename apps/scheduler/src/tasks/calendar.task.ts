import { Inject, Injectable, Logger, forwardRef } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { mapSeries } from "async";

import { Anime } from "@ishiro/libs/database/entities";
import { ExternalApiService } from "@ishiro/libs/external-api/external-api.service";
import { AnimeService } from "@ishiro/libs/shared/services";

@Injectable()
export class CalendarTask {
  constructor(
    @Inject(forwardRef(() => ExternalApiService))
    private readonly externalAPIService: ExternalApiService,
    @Inject(forwardRef(() => AnimeService))
    private readonly animeService: AnimeService
  ) {}

  private readonly logger = new Logger(CalendarTask.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    await this.externalAPIService.isUDPClientUp();

    this.logger.debug("Start recovering new data from calendar");

    const fields = await this.externalAPIService.getCalendarFields();

    const ids = fields.map((f) => f.aid);

    await mapSeries<any, Anime>(ids, async (id) => {
      return this.animeService.populateAnime(id);
    });

    this.logger.debug("Finished recovering new data from calendar");
  }
}
