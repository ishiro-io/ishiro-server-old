import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { Category } from "@ishiro/libs/database/entities";

import { CreateCategoryInput, UpdateCategoryInput } from "../inputs";
import CategoryPreview from "../outputs/category.output";
import { AnimeService } from "./anime.service";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @Inject(forwardRef(() => AnimeService))
    private readonly animeService: AnimeService
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  findById(id: number): Promise<Category> {
    return this.categoryRepository.findOneOrFail({
      id,
    });
  }

  async getPreviewById(id: number): Promise<CategoryPreview> {
    const category = await this.findById(id);

    const paginatedAnimes = await this.animeService.getPaginatedAnimes(
      { limit: 10, offset: 0 },
      category.id
    );

    return {
      id: category.id,
      name: category.name,
      animes: paginatedAnimes?.fields,
    };
  }

  async findIdFromName(name: string): Promise<number> {
    const category = await Category.findOne({ where: { name } });

    return category.id ?? 0;
  }

  findByIds(ids: number[]): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { id: In(ids) },
    });
  }

  async createCategory(data: CreateCategoryInput): Promise<Category> {
    const category = await this.categoryRepository.create(data).save();

    return category;
  }

  async updateCategory(
    id: number,
    data: UpdateCategoryInput
  ): Promise<Category> {
    await this.categoryRepository.update(id, data);

    const category = await this.categoryRepository.findOneOrFail({ id });

    return category;
  }
}
