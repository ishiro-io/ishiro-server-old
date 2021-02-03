import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { IshiroContext } from "@ishiro/libs/shared/interfaces/Context";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext<IshiroContext>();

    return !!ctx.req.session.user;
  }
}
