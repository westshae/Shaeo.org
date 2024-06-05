import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { GoalsService } from "./goals.service";
import { createClient } from '@supabase/supabase-js'

@Controller("goals")
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get("getAllGoals")
  async getAllGoals(@Query() query) {
    const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', process.env.SUPABASE_ANON_API_KEY)

    const { data, error } = await supabase
      .from('goals')
      .select()
    
    return data;
  }

  @Post("postGoal")
  postGoal(@Body() body) {
    let content = body.json;

    const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', process.env.SUPABASE_ANON_API_KEY)
    const respond = supabase
      .from('goals')
      .insert(
        { 
          goal_id: Math.floor(Math.random()*1000), 
          user_uuid: 'dcce6637-7fa4-49ca-8b99-a48d74f58546',
          category_id: 1,
          start_date_epoch: 123123123,
          end_date_epoch: 123123123,
          outcome: "outcome",
          measureable_type: "measurement_type",
          measurement_count: 123,
          achievable: "yes",
          update_ids: null
        }
      )
    console.log(respond)
    return respond
  }
}
