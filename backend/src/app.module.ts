import { Module } from "@nestjs/common";
import { GoalsModule } from "./goals/goals.module";

@Module({
  imports: [
    GoalsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
