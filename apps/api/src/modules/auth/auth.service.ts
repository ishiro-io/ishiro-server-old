import { Injectable, Logger } from "@nestjs/common";

import { IshiroContext } from "@ishiro/libs/shared/interfaces/Context";

@Injectable()
export class AuthService {
  private readonly logger = new Logger();

  async logout(ctx: IshiroContext): Promise<boolean> {
    return new Promise((resolve, reject) => {
      ctx.req.session.destroy((err) => {
        if (err) {
          this.logger.error(err);
          return reject(err);
        }

        ctx.res.clearCookie("iid");

        return resolve(true);
      });
    });
  }
}
