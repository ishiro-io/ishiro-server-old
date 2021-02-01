import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";

import { DatabaseModule } from "@ishiro/libs/database/database.module";

import HelloModule from "./modules/hello/hello.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    HelloModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      path: "/",
      introspection: true,
      playground: true,
    }),
  ],
})
export class AppModule {}
