import { Request, Response } from "express";
import { Session } from "express-session";

import { User } from "@ishiro/libs/database/entities";

export interface IshiroContext {
  req: Request & {
    session: Session & {
      user?: User;
    };
  };
  res: Response;
}
