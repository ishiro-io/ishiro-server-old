import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import parsePhoneNumber from "libphonenumber-js";
import * as ms from "ms";
import * as twilio from "twilio";
import { Repository } from "typeorm";

import { PHONE_NUMBER_CONFIRMATION_PREFIX } from "@ishiro/api/constants/redisPrefixes";
import { redisClient } from "@ishiro/api/redis/client";
import { User, UserPhoneAuth } from "@ishiro/libs/database/entities";
import { IshiroContext } from "@ishiro/libs/shared/interfaces/Context";

import { ConnectInput, RegisterInput } from "./phone-auth.input";
import { ConnectOutput } from "./phone-auth.output";

@Injectable()
export class PhoneAuthService {
  constructor(
    @InjectRepository(UserPhoneAuth)
    private readonly userPhoneAuthRepository: Repository<UserPhoneAuth>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  private readonly logger = new Logger();

  private readonly twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  async askConfirmationCode(phoneNumber: string): Promise<boolean> {
    try {
      const code = await this.createConfirmationCode(
        phoneNumber,
        PHONE_NUMBER_CONFIRMATION_PREFIX
      );

      await this.sendSMSNotification(code, phoneNumber);
    } catch (error) {
      this.logger.error(error);

      return false;
    }

    return true;
  }

  async checkConfirmationCode(
    phoneNumber: string,
    code: string
  ): Promise<boolean> {
    const storedPhoneNumber = await redisClient.get(
      PHONE_NUMBER_CONFIRMATION_PREFIX + code
    );

    return phoneNumber === storedPhoneNumber;
  }

  async connect(
    { phoneNumber, code }: ConnectInput,
    ctx: IshiroContext
  ): Promise<ConnectOutput | null> {
    const check = await this.checkConfirmationCode(phoneNumber, code);

    if (!check) return null;

    const auth = await this.userPhoneAuthRepository.findOne({
      where: { phoneNumber },
      relations: ["user"],
    });

    ctx.req.session.user = auth.user;

    return { user: auth?.user };
  }

  async register(
    { username, phoneNumber, code }: RegisterInput,
    ctx: IshiroContext
  ): Promise<User | null> {
    const check = await this.checkConfirmationCode(phoneNumber, code);

    if (!check) return null;

    const user = await this.userRepository.create({ username }).save();

    await this.userPhoneAuthRepository.create({ phoneNumber, user }).save();

    ctx.req.session.user = user;

    return user;
  }

  async logout(ctx: IshiroContext): Promise<boolean> {
    return new Promise((resolve, reject) => {
      ctx.req.session.destroy((err) => {
        if (err) {
          this.logger.error(err);
          return reject(err);
        }

        ctx.res.clearCookie("iid");

        return resolve(true);
      });
    });
  }

  async createConfirmationCode(data: any, prefix: string): Promise<string> {
    // ? On créé un token fais de 6 chiffres
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    // ? On enregistre l'id du user dans Redis avec le token prefixé pendant 7 jours
    await redisClient.set(prefix + token, data, "ex", ms("7d"));

    return token;
  }

  async sendSMSNotification(code: string, phoneNumber: string) {
    const body = `Ishiro : votre code de confirmation est : ${code}. Il expire dans 7 jours.`;

    const parsedPhoneNumber = parsePhoneNumber(phoneNumber, "FR");

    if (parsedPhoneNumber) {
      if (process.env.NODE_ENV === "production") {
        const message = await this.twilioClient.messages.create({
          body,
          from: process.env.TWILIO_ALPHANUMERIC_SENDER_ID,
          to: parsedPhoneNumber.number.toString(),
        });

        this.logger.log("SMS envoyé");
        this.logger.log({ message });
      } else {
        this.logger.log(`SMS envoyé au ${phoneNumber}`);
        this.logger.log({ body });
      }
    } else throw new Error("Invalid phone number");
  }
}
