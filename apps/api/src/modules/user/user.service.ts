import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "@ishiro/libs/database/entities";
import { AnimeViewStatus } from "@ishiro/libs/shared/enums";

import { AnimeViewService } from "./anime-view/anime-view.service";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AnimeViewService))
    private readonly animeViewService: AnimeViewService
  ) {}

  findById(id: number): Promise<User> {
    return this.userRepository.findOneOrFail({
      id,
    });
  }

  async updateUsername(id: number, username: string): Promise<User> {
    const user = await this.userRepository.findOne({ id });
    user.username = username;

    await user.save();

    return user;
  }

  async getAnimeSeenCount(user: User): Promise<number> {
    const views = await this.animeViewService.getByStatus(
      user,
      AnimeViewStatus.FINISHED,
      { limit: 0, offset: 0 }
    );

    return views.total;
  }
}
