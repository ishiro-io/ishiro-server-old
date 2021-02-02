import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";

import { DatabaseModule } from "@ishiro/libs/database/database.module";

import AuthModule from "./modules/auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      path: "/",
      introspection: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
})
export class AppModule {}