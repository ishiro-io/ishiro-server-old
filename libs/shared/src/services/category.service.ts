import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { Category } from "@ishiro/libs/database/entities";

import { CreateCategoryInput, UpdateCategoryInput } from "../inputs";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  findById(id: number): Promise<Category> {
    return this.categoryRepository.findOneOrFail({
      id,
    });
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
