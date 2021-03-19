import { Injectable } from "@nestjs/common";
import { Telegraf } from "telegraf";

@Injectable()
export class TelegrafService {
  public bot: Telegraf;

  constructor() {
    this.bot = new Telegraf(process.env.TELEGRAF_TOKEN);
    this.bot.launch();
  }
}
