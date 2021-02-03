import { NestFactory } from "@nestjs/core";

import { AdminModule } from "./admin.module";
import { AuthGuard } from "./guard/auth.guard";

async function bootstrap() {
  const app = await NestFactory.create(AdminModule);

  app.useGlobalGuards(new AuthGuard());

  await app.listen(process.env.PORT || 5000);
}

bootstrap();
