import { Body, Controller, Get, Post, Query, Req, Res } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import Stripe from "stripe";

@Controller("stripe")
export class StripeController {
  private stripe: Stripe;

  constructor(private readonly stripeService: StripeService) {
    this.stripe = new Stripe(process.env.STRIPE_TEST_KEY);
  }


  @Post("getPaymentLink")
  async getPaymentLink(@Body() body){
    if(!body.session) return;
    const result = await this.stripeService.createPaymentLink(body.session)
    return result;
  }

  @Post("webhook")
  async handleWebhook(@Req() request) {

    const type = request.body.type;
    const metadata = request.body.data.object.metadata;
    const paymentStatus = request.body.data.object.payment_status;

    if(type == "checkout.session.completed" && paymentStatus == "paid" && metadata.product_id && metadata.product_id == "goal_annual"){
        this.stripeService.addUserToPayments(metadata);
    }
  }

  @Get("isUserPremium")
  async isUserPremium(@Query() query) {
    if(!query.session) return;
    const result = await this.stripeService.isUserPremium(query.session);
    return result;
  }


}
