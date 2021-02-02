import { registerEnumType } from "@nestjs/graphql";

export enum AnimeStatus {
  COMING_SOON = "COMING_SOON",
  ONGOING = "ONGOING",
  FINISHED = "FINISHED",
  CANCELLED = "CANCELLED",
}

registerEnumType(AnimeStatus, {
  name: "AnimeStatus",
});
