import { NestFactory } from "@nestjs/core";

import { SchedulerModule } from "./scheduler.module";

async function bootstrap() {
  const app = await NestFactory.create(SchedulerModule);

  await app.listen(process.env.SCHEDULER_PORT || 4001);
}
bootstrap();
