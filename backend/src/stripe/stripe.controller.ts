import { Body, Controller, Post } from "@nestjs/common";
import { StripeService } from "./stripe.service";

@Controller("stripe")
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post("getPaymentLink")
  async getPaymentLink(@Body() body){
    const result = await this.stripeService.createPaymentLink(body.session)
    return result;
  }
}
