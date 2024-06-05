import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { GoalsService } from "./goals.service";
import { createClient } from '@supabase/supabase-js'
import { query } from "express";

@Controller("goals")
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get("getUserGoals")
  async getUserGoals(@Query() query) {
    const result = await this.goalsService.getUserGoals(query.session);
    return result;
  }

  @Post("addUserGoal")
  async addUserGoal(@Body() body){
    const result = await this.goalsService.addUserGoal(body.session, body.goal)
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
}
