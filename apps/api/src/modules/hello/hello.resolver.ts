import { Query, Resolver } from "@nestjs/graphql";

@Resolver()
class HelloResolver {
  @Query(() => String)
  hello(): string {
    return "Hello";
  }
}

export default HelloResolver;
