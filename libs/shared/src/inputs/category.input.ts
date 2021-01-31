import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateCategoryInput {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  coverImage?: string;
}

@InputType()
export class UpdateCategoryInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  coverImage?: string;
}
