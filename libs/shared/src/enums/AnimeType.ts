import { registerEnumType } from "@nestjs/graphql";

export enum AnimeType {
  TV = "TV",
  TV_SPECIAL = "TV_SPECIAL",
  MOVIE = "MOVIE",
  OVA = "OVA",
  ONA = "ONA",
  MUSIC = "MUSIC",
}

registerEnumType(AnimeType, {
  name: "AnimeType",
});
