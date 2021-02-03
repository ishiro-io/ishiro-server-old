import { registerEnumType } from "@nestjs/graphql";

export enum AnimeViewStatus {
  NONE = "NONE",
  IN_PROGRESS = "IN_PROGRESS",
  TO_SEE = "TO_SEE",
  FINISHED = "FINISHED",
  ABANDONED = "ABANDONED",
}

registerEnumType(AnimeViewStatus, {
  name: "AnimeViewStatus",
});
