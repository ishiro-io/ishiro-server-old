import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "@ishiro/libs/database/entities";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
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
}
