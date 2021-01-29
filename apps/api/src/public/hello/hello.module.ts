import { Module } from "@nestjs/common";

import HelloResolver from "./hello.resolver";

@Module({
  providers: [HelloResolver],
})
class HelloModule {}

export default HelloModule;
