import { Logger } from "@nestjs/common";
import { AxiosInstance } from "axios";
import { RedisStore, setup } from "axios-cache-adapter";
import ms from "ms";
import redis from "redis";

import ADBAnime from "./types/ADBAnime";

const MAX_RETRY = 5;

class HTTPClient {
  private readonly logger: Logger = new Logger("AniDB HTTP Client");

  public jobs: Array<Job> = [];

  private api: AxiosInstance;

  private auth: Auth;

  private retryCount: number = 0;

  constructor(auth: Auth) {
    this.auth = auth;

    const redisClient = redis.createClient({
      url: process.env.REDIS_URL,
    });

    const store = new RedisStore(redisClient);

    this.api = setup({
      baseURL: "http://api.anidb.net:9001/httpapi",
      cache: {
        maxAge: ms("2w"),
        store,
        clearOnError: false,
        exclude: {
          query: false,
        },
        key: (req) => {
          const serialized =
            req.params instanceof URLSearchParams
              ? req.params.toString()
              : JSON.stringify(req.params) || "";
          return req.url + serialized;
        },
      },
    });
  }

  public async callRequest(job: Job) {
    try {
      const response = await this.api({
        method: "GET",
        url: `?request=${job.request}`,
        params: { ...job.params, ...this.auth, protover: 1 },
      });
      if (response.data.includes("<error"))
        throw new Error(`AniDB returned an error ${response.data}`);

      this.retryCount = 0;

      job.callback(response.data);
    } catch (error) {
      this.logger.error(error);

      if (error.message.includes("banned")) return;

      if (this.retryCount <= MAX_RETRY) {
        this.logger.warn("Retrying request...");

        this.retryCount += 1;
        this.callRequest(job);
      } else {
        this.retryCount = 0;
        throw new Error("Cannot request anidb http server.");
      }
    }
  }

  public getAnimeById(id: number): Promise<ADBAnime> {
    return new Promise((resolve) => {
      this.jobs.push({
        request: "anime",
        params: { aid: id },
        callback: async (data: string) => {
          const anime = new ADBAnime();
          await anime.init(data);

          resolve(anime);
        },
      });
    });
  }
}

export default HTTPClient;

interface Auth {
  client: string;
  clientver: number;
}

interface Job {
  request: string;
  params: any;
  callback?: Function;
}
