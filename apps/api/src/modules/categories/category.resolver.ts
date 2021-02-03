import { Args, Int, Query, Resolver } from "@nestjs/graphql";

import { Category } from "@ishiro/libs/database/entities";
import CategoryPreview from "@ishiro/libs/shared/outputs/category.output";
import { CategoryService } from "@ishiro/libs/shared/services";

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => Category, { name: "category", nullable: true })
  async getCategoryById(
    @Args({ name: "id", type: () => Int }) id: number
  ): Promise<Category> {
    return this.categoryService.findById(id);
  }

  @Query(() => [Category], { name: "categories", nullable: false })
  async getCategories(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Query(() => CategoryPreview, { name: "categoryPreview", nullable: true })
  async getCategoryPreviewById(
    @Args({ name: "id", type: () => Int }) id: number
  ): Promise<CategoryPreview> {
    return this.categoryService.getPreviewById(id);
  }
}
