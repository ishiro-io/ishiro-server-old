import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Category } from "@ishiro/libs/database/entities";
import { CategoryService } from "@ishiro/libs/shared/services";

import { CategoryResolver } from "./category.resolver";

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoryService, CategoryResolver],
  exports: [CategoryService],
})
export class CategoryModule {}
