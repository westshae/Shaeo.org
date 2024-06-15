import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { GoalsService } from "./goals.service";
import { createClient } from '@supabase/supabase-js'
import { query } from "express";
import { StripeService } from "src/stripe/stripe.service";

@Controller("goals")
export class GoalsController {
  constructor(private readonly goalsService: GoalsService, private readonly stripeService: StripeService) {}

  @Get("getUserGoals")
  async getUserGoals(@Query() query) {
    const result = await this.goalsService.getUserGoals(query.session);
    return result;
  }

  @Get("getUserGoal")
  async getUserGoal(@Query() query) {
    const result = await this.goalsService.getUserGoal(query.session, query.goal_id);
    return result;
  }

  @Post("addUserGoal")
  async addUserGoal(@Body() body){
    const isUserPremium = await this.stripeService.isUserPremium(body.session);
    const result = await this.goalsService.addUserGoal(body.session, body.goal, isUserPremium)
    return result;
  }

  @Post("updateUserGoal")
  async updateUserGoal(@Body() body){
    const result = await this.goalsService.updateUserGoal(body.session, body.goal)
    return result
  }

  @Delete("deleteUserGoal")
  async deleteUserGoal(@Body() body){
    const result = await this.goalsService.deleteUserGoal(body.session, body.goal_id)
    return result;
  }

  @Get("getUserUpdates")
  async getUserUpdates(@Query() query) {
    const result = await this.goalsService.getUserUpdates(query.session);
    return result;
  }

  @Get("getGoalUpdates")
  async getGoalUpdates(@Query() query) {
    const result = await this.goalsService.getGoalUpdates(query.session, query.goal_id);
    return result;
  }


  @Post("addUserUpdate")
  async addUserUpdate(@Body() body){
    const result = await this.goalsService.addUserUpdate(body.session, body.update)
    return result;
  }

  @Post("updateUserUpdate")
  async updateUserUpdate(@Body() body){
    const result = await this.goalsService.updateUserUpdate(body.session, body.update)
    return result
  }

  @Delete("deleteUserUpdate")
  async deleteUserUpdate(@Body() body){
    const result = await this.goalsService.deleteUserUpdate(body.session, body.update_id)
    return result;
  }
}
