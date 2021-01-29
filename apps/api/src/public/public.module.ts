import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

import HelloModule from "./hello/hello.module";

@Module({
  imports: [
    HelloModule,
    GraphQLModule.forRoot({
      include: [HelloModule],
      autoSchemaFile: "public-schema.gql",
      path: "/",
      introspection: true,
      playground: true,
    }),
  ],
})
export class PublicModule {}
