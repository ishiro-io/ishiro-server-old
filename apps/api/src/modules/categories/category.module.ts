import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Category } from "@ishiro/libs/database/entities";
import { CategoryService } from "@ishiro/libs/shared/services";

import AnimeModule from "../animes/anime.module";
import { CategoryResolver } from "./category.resolver";

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    forwardRef(() => AnimeModule),
  ],
  providers: [CategoryService, CategoryResolver],
  exports: [CategoryService],
})
export default class CategoryModule {}
