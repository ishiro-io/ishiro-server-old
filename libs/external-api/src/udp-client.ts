import dgram from "dgram";

import { Logger } from "@nestjs/common";

class UDPClient {
  private readonly logger: Logger = new Logger("AniDB UDP Client");

  public up: Promise<boolean>;

  public sessionId: string;

  public jobs: Array<Job> = [];

  private options: ConnectionOptions;

  private socket: dgram.Socket;

  constructor(auth: Auth) {
    this.options = {
      port: 9000,
      url: "api.anidb.net",
    };

    this.socket = dgram.createSocket("udp4");

    this.up = new Promise((resolve, reject) => {
      this.jobs.push({
        request: `AUTH user=${auth.username}&pass=${auth.password}&protover=${auth.protover}&client=${auth.client}&clientver=${auth.clientver}&enc=UTF-8`,
        callback: (msg: string) => {
          const res = msg.split(" ");

          const statusCode = res[0];

          if (statusCode === "200") {
            this.sessionId = res[1];

            resolve(true);
          } else {
            const e = new Error("Auth error check credentials or anidb status");

            reject(e);
          }
        },
      });
    });
  }

  public callRequest(request: string, callback: Function) {
    this.socket.once("message", (msg) => {
      const data = msg.toString();
      this.logger.log(`Received from server: ${data}`);

      callback(data, null);
    });

    this.socket.send(request, this.options.port, this.options.url, (error) => {
      this.logger.log(`Sent Request: ${request}`);

      if (error) callback(null, error);
    });
  }

  public logout(): Promise<boolean> {
    return new Promise((resolve) => {
      this.jobs.push({
        request: `LOGOUT s=${this.sessionId}`,
        callback: () => {
          this.logger.log("Logged Out");

          this.sessionId = undefined;
          this.socket.close(() => this.logger.log("Socket closed"));

          resolve(true);
        },
      });
    });
  }
}

export default UDPClient;

interface ConnectionOptions {
  url: string;
  port: number;
}

interface Auth {
  username: string;
  password: string;
  protover: number;
  client: string;
  clientver: number;
}

interface Job {
  request: string;
  callback?: Function;
}
