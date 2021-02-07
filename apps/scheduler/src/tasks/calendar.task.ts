import { Inject, Injectable, Logger, forwardRef } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { mapSeries } from "async";

import { Anime } from "@ishiro/libs/database/entities";
import { ExternalApiService } from "@ishiro/libs/external-api/external-api.service";
import { AnimeService, EpisodeService } from "@ishiro/libs/shared/services";

@Injectable()
export class CalendarTask {
  constructor(
    @Inject(forwardRef(() => ExternalApiService))
    private readonly externalAPIService: ExternalApiService,
    @Inject(forwardRef(() => AnimeService))
    private readonly animeService: AnimeService,
    @Inject(forwardRef(() => EpisodeService))
    private readonly episodeService: EpisodeService
  ) {
    this.handleCron();
  }

  private readonly logger = new Logger(CalendarTask.name);

  @Cron("0 0 12 1/2 * *")
  async handleCron() {
    await this.externalAPIService.isUDPClientUp();

    this.logger.debug("Start recovering new data from calendar");

    const fields = await this.externalAPIService.getCalendarFields();

    const ids = fields.map((f) => f.aid);

    await mapSeries<any, Anime>(ids, async (id) => {
      const input = await this.externalAPIService.buildNewAnimeInput(
        id,
        true,
        true
      );

      if (!input) return null;

      const anime = await this.animeService.createAnime(input.animeInput);

      if (input.episodeInputs) {
        const inputs = input.episodeInputs.map((i) => {
          return { ...i, animeId: anime.id };
        });

        await this.episodeService.createEpisodes(inputs, anime.id);
      }

      return anime;
    });

    this.logger.debug("Finished recovering new data from calendar");
  }
}
