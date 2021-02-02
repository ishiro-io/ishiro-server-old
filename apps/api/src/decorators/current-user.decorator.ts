import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { IshiroContext } from "@ishiro/libs/shared/interfaces/Context";

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context).getContext<IshiroContext>();

    return ctx.req.session.user;
  }
);
