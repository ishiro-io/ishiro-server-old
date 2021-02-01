import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";

import { Anime } from "@ishiro/libs/database/entities";

import { CreateAnimeInput, UpdateAnimeInput } from "../inputs";
import { CategoryService } from "./category.service";

@Injectable()
export class AnimeService {
  constructor(
    @InjectRepository(Anime)
    private readonly animeRepository: Repository<Anime>,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService
  ) {}

  findAll(): Promise<Anime[]> {
    return this.animeRepository.find({ relations: ["categories", "episodes"] });
  }

  findById(id: number): Promise<Anime> {
    return this.animeRepository.findOneOrFail(
      {
        id,
      },
      { relations: ["categories", "episodes"] }
    );
  }

  findByIds(ids: number[]): Promise<Anime[]> {
    return this.animeRepository.find({
      where: { id: In(ids), relations: ["categories", "episodes"] },
    });
  }

  async createAnime(data: CreateAnimeInput): Promise<Anime> {
    const check = await this.animeRepository.findOne({
      where: { title: data.title },
    });

    if (check) return check;

    const anime = await this.animeRepository.create(data);

    if (data.categoriesIds?.length > 0) {
      const categories = await Promise.all(
        data.categoriesIds.map((id) => this.categoryService.findById(id))
      );

      anime.categories = categories;
    }

    return anime.save();
  }

  async updateAnime(id: number, data: UpdateAnimeInput): Promise<Anime> {
    await this.animeRepository.update(id, data);

    const anime = await this.animeRepository.findOneOrFail({ id });

    return anime;
  }
}
