import { Module } from "@nestjs/common";
import { GoalsModule } from "./goals/goals.module";
import { StripeModule } from "./stripe/stripe.module";

@Module({
  imports: [
    GoalsModule,
    StripeModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
