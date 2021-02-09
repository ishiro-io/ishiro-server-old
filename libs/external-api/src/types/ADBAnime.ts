import { parseString } from "xml2js";

import ADBEpisode from "./ADBEpisodes";

class ADBAnime {
  aid: number;

  type: string;

  startDate: string;

  endDate: string;

  rating: number;

  restricted: boolean;

  episodes: ADBEpisode[];

  constructor(data: string) {
    parseString(data, (_, { anime }) => {
      const episodes = anime.episodes?.[0].episode
        .filter((e) => !Number.isNaN(Number(e.epno?.[0]._)))
        .sort((a, b) => Number(a.epno?.[0]._) - Number(b.epno[0]._))
        .map((e) => new ADBEpisode(e));

      this.aid = anime?.$?.id;
      this.type = anime?.type?.[0];
      this.startDate = anime?.startdate?.[0];
      this.endDate = anime?.enddate?.[0];
      this.rating = anime?.ratings?.[0]?.permanent?.[0]._;
      this.restricted = anime?.$?.restricted;
      this.episodes = episodes;
    });
  }
}

export default ADBAnime;
