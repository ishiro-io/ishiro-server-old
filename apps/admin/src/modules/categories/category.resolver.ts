import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { mapSeries } from "async";

import { Category } from "@ishiro/libs/database/entities";
import categoriesList from "@ishiro/libs/shared/data/categories-list";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@ishiro/libs/shared/inputs";
import { FixNullPrototypePipe } from "@ishiro/libs/shared/pipes/fix-null-prototype.pipe";
import { CategoryService } from "@ishiro/libs/shared/services";

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [Category], { name: "categories", nullable: false })
  async getCategories(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Query(() => Category, { name: "category", nullable: true })
  async getCategoryById(
    @Args({ name: "id", type: () => Int }) id: number
  ): Promise<Category> {
    return this.categoryService.findById(id);
  }

  @Mutation(() => Category, { name: "createCategory" })
  async createCategory(
    @Args("input") input: CreateCategoryInput
  ): Promise<Category> {
    return this.categoryService.createCategory(input);
  }

  @Mutation(() => Category, { name: "updateCategory" })
  async updateCategory(
    @Args("id", { type: () => Int }) id: number,
    @Args("input", FixNullPrototypePipe) input: UpdateCategoryInput
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, input);
  }

  @Mutation(() => [Category], { nullable: true })
  async populateCategories(): Promise<Category[] | null> {
    const categories = await mapSeries<any, Category>(
      categoriesList,
      async ({ name }) => {
        return this.categoryService.createCategory({ name });
      }
    );

    return categories;
  }
}
