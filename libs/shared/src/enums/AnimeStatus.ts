import { registerEnumType } from "@nestjs/graphql";

export enum AnimeStatus {
  COMING_SOON = "COMING_SOON",
  ONGOING = "ONGOING",
  FINISHED = "FINISHED",
}

registerEnumType(AnimeStatus, {
  name: "AnimeStatus",
});
