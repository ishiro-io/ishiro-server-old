import { ObjectType } from "@nestjs/graphql";

import { UserAnimeView } from "@ishiro/libs/database/entities";
import { PaginatedOutput } from "@ishiro/libs/shared/outputs";

@ObjectType()
export class UserAnimeViewsByStatusOutput extends PaginatedOutput(
  UserAnimeView
) {}
