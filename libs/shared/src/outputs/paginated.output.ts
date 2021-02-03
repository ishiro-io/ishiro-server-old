import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ClassType } from "type-graphql";

export function PaginatedOutput<TItem>(TItemClass: ClassType<TItem>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field()
    hasMore: boolean;

    @Field(() => Int)
    total: number;

    @Field(() => [TItemClass])
    fields: TItem[];
  }
  return PaginatedResponseClass;
}
