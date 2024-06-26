import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

@Injectable()
export class StripeService {
    private stripe: Stripe;
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_KEY)
    }

    async authenticateUser(session) {
        const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', process.env.SUPABASE_PRIV_API_KEY);
        const user = await supabase.auth.getUser(session.access_token);
        if (user.data.user.id === session.user.id) {
            return true
        }
        return false;
    }

    async createPaymentLink(session): Promise<string> {
        try {
            if (!this.authenticateUser(session)) throw new UnauthorizedException("Authentication Failed");
            const product = await this.stripe.products.create({
                name: "One year access to premium goals",
            });

            const price = await this.stripe.prices.create({
                unit_amount: 3000,
                currency: 'usd',
                product: product.id,
            });

            const paymentLink = await this.stripe.paymentLinks.create({
                line_items: [
                    {
                        price: price.id,
                        quantity: 1,
                    },
                ],
                metadata: {
                    user_uuid: session.user.id,
                    product_id: "goal_annual"
                },

            });

            return paymentLink.url;
        } catch (error) {
            console.error('Error creating Stripe payment link:', error);
            throw new InternalServerErrorException('Failed to create Stripe payment link');
        }
    }

    async addUserToPayments(metadata) {
        const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', process.env.SUPABASE_PRIV_API_KEY);
        const currentDate = new Date();
        const futureDate = new Date(currentDate);
        futureDate.setFullYear(currentDate.getFullYear() + 1);
        const futureEpoch = futureDate.getTime();

        const result = await supabase
            .from('payments')
            .insert(
                {
                    user_uuid: metadata.user_uuid,
                    expiration_epoch: futureEpoch
                }
            )

    }

    async isUserPremium(session) {
        if (!this.authenticateUser(session)) throw new UnauthorizedException("Authentication Failed");
        const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', process.env.SUPABASE_PRIV_API_KEY);
    
        const goal = await supabase.from("payments").select("*").eq("user_uuid", session.user.id).single();
        if(goal.status != 200){
            return false;
        }
        const expirationEpoch = goal.data.expiration_epoch;
        const currentDate = new Date().getTime();
        return !(currentDate > expirationEpoch)
    }

}