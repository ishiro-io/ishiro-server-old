import { eachSeries } from "async";
import axios from "axios";
import axiosRetry from "axios-retry";
import { parseStringPromise } from "xml2js";

import { RelationSource } from "@ishiro/libs/shared/enums";

import ADBEpisode from "./ADBEpisodes";

class ADBAnime {
  aid: number;

  anilistid: number;

  titleFrench: string;

  type: string;

  startDate: string;

  endDate: string;

  rating: number;

  restricted: boolean;

  episodes: ADBEpisode[];

  async init(data: string): Promise<ADBAnime> {
    const { anime } = await parseStringPromise(data);

    const episodes = anime.episodes?.[0].episode
      .filter((e) => !Number.isNaN(Number(e.epno?.[0]._)))
      .sort((a, b) => Number(a.epno?.[0]._) - Number(b.epno?.[0]._))
      .map((e) => new ADBEpisode(e));

    const titleFrench = anime?.titles?.[0]?.title.find(
      (t) => t?.$["xml:lang"] === "fr"
    )?._;

    this.aid = anime?.$?.id;
    this.titleFrench = titleFrench;
    this.type = anime?.type?.[0];
    this.startDate = anime?.startdate?.[0];
    this.endDate = anime?.enddate?.[0];
    this.rating = anime?.ratings?.[0]?.permanent?.[0]._;
    this.restricted = anime?.$?.restricted;
    this.episodes = episodes;

    const aniDbRelationId = await this.getAniListId(
      this.aid,
      RelationSource.anidb
    );

    if (aniDbRelationId) {
      this.anilistid = aniDbRelationId;
    } else {
      const malResource = anime.resources?.[0].resource.find(
        (r) => r.$.type === "2"
      );

      await eachSeries(malResource?.externalentity, async (entity: any) => {
        const malRelationId = await this.getAniListId(
          entity.identifier,
          RelationSource.myanimelist
        );

        if (malRelationId) this.anilistid = malRelationId;
      });
    }

    return this;
  }

  private async getAniListId(id: number, source: RelationSource) {
    axiosRetry(axios, { retries: 5 });

    const response = await axios.get(
      `${process.env.RELATIONS_API_ENDPOINT}?source=${source}&id=${id}`
    );

    return response?.data?.anilist;
  }
}

export default ADBAnime;
