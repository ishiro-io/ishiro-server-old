import "@ishiro/libs/utils/env";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as connectRedis from "connect-redis";
import * as session from "express-session";
import * as ms from "ms";

import { redisClient } from "@ishiro/api/redis/client";

import { AppModule } from "./api.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // * Session & redis
  const RedisStore = connectRedis(session);

  const sessionOption: session.SessionOptions = {
    store: new RedisStore({
      client: redisClient,
    }),
    name: "iid",
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // TODO : Dès que le serveur prod est en HTTPS -> secure: process.env.NODE_ENV === "production",
      secure: false,
      maxAge: ms("7y"),
      // TODO : Dès que le serveur prod est en HTTPS -> sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      sameSite: "lax",
    },
  };

  app.use(session(sessionOption));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(process.env.PORT || 5000);
}

bootstrap();
