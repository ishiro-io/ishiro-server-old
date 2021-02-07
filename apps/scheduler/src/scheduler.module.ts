import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DatabaseModule } from "@ishiro/libs/database/database.module";
import { Anime, Category, Episode } from "@ishiro/libs/database/entities";
import { ExternalApiService } from "@ishiro/libs/external-api/external-api.service";
import {
  AnimeService,
  CategoryService,
  EpisodeService,
} from "@ishiro/libs/shared/services";

import { CalendarTask } from "./tasks/calendar.task";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
    TypeOrmModule.forFeature([Anime, Category, Episode]),
  ],
  providers: [
    ExternalApiService,
    AnimeService,
    CategoryService,
    EpisodeService,
    CalendarTask,
  ],
})
export class SchedulerModule {}
