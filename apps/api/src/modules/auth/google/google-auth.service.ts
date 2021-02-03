import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User, UserGoogleAuth } from "@ishiro/libs/database/entities";
import { IshiroContext } from "@ishiro/libs/shared/interfaces/Context";

import { GoogleConnectInput, GoogleRegisterInput } from "./google-auth.input";
import { GoogleConnectOutput } from "./google-auth.output";

@Injectable()
export class GoogleAuthService {
  constructor(
    @InjectRepository(UserGoogleAuth)
    private readonly userGoogleAuthRepository: Repository<UserGoogleAuth>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async connect(
    { accountId }: GoogleConnectInput,
    ctx: IshiroContext
  ): Promise<GoogleConnectOutput> {
    const auth = await this.userGoogleAuthRepository.findOne({
      where: { accountId },
      relations: ["user"],
    });

    ctx.req.session.user = auth?.user;

    return { user: auth?.user };
  }

  async register(
    { username, accountId }: GoogleRegisterInput,
    ctx: IshiroContext
  ): Promise<User> {
    const user = await this.userRepository.create({ username }).save();

    await this.userGoogleAuthRepository.create({ accountId, user }).save();

    ctx.req.session.user = user;

    return user;
  }
}
