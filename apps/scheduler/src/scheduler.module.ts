import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
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
import { UpdatedAnimesTask } from "./tasks/updated-animes.task";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    UpdatedAnimesTask,
  ],
})
export class SchedulerModule {}
