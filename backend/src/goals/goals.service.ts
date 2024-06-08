import { Injectable, UnauthorizedException } from "@nestjs/common";
import { createClient } from "@supabase/supabase-js";

@Injectable()
export class GoalsService {
  async authenticateUser(session) {
    const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', process.env.SUPABASE_ANON_API_KEY);
    const user = await supabase.auth.getUser(session.access_token);
    if (user.data.user.id === session.user.id) {
      return true
    }
    return false;
  }

  async getUserGoals(session) {
    if (!this.authenticateUser(session)) throw new UnauthorizedException("Authentication Failed");
    const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', process.env.SUPABASE_ANON_API_KEY);

    const goals = supabase.from("goals").select("*").eq("user_uuid", session.user.id);
    
    return goals;
  }
  
  async getUserGoal(session, goal_id) {
    if (!this.authenticateUser(session)) throw new UnauthorizedException("Authentication Failed");
    const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', process.env.SUPABASE_ANON_API_KEY);

    const goal = supabase.from("goals").select("*").eq("goal_id", goal_id).eq("user_uuid", session.user.id).single();
    return goal;
  }


  async addUserGoal(session, goal) {
    if (!this.authenticateUser(session)) throw new UnauthorizedException("Authentication Failed");
    const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', process.env.SUPABASE_ANON_API_KEY);
    const result = await supabase
      .from('goals')
      .insert(
        {
          goal_id: Math.floor(Math.random() * 1000),
          user_uuid: session.user.id,
          category_id: goal.category_id,
          start_date_epoch: goal.start_date_epoch,
          end_date_epoch: goal.end_date_epoch,
          outcome: goal.outcome,
          measureable_type: goal.measureable_type,
          measurement_count: goal.measurement_count,
          achievable: goal.achievable,
          update_ids: goal.update_ids
        }
      )

  }

  async updateUserGoal(session, goal) {
    if (!this.authenticateUser(session)) throw new UnauthorizedException("Authentication Failed");
    const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', process.env.SUPABASE_ANON_API_KEY);
    const result = await supabase
      .from('goals')
      .update({
        category_id: goal.category_id,
        end_date_epoch: goal.end_date_epoch,
        outcome: goal.outcome,
        measureable_type: goal.measureable_type,
        measurement_count: goal.measurement_count,
        achievable: goal.achievable
      })
      .eq('goal_id', goal.goal_id)
      .eq('user_uuid', session.user.id)
  }


  async deleteUserGoal(session, goal_id) {
    if (!this.authenticateUser(session)) throw new UnauthorizedException("Authentication Failed");
    const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', process.env.SUPABASE_ANON_API_KEY);
    const result = await supabase
      .from('goals')
      .delete()
      .eq('goal_id', goal_id)
      .eq('user_uuid', session.user.id)
    console.log(result)
  }

  async getUserUpdates(session) {
    if (!this.authenticateUser(session)) throw new UnauthorizedException("Authentication Failed");
    const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', process.env.SUPABASE_ANON_API_KEY);
    const result = await supabase
      .from('updates')
      .select()
      .eq('user_uuid', session.user.id)
    return result
  }

  async addUserUpdate(session, update) {
    if (!this.authenticateUser(session)) throw new UnauthorizedException("Authentication Failed");
    const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', process.env.SUPABASE_ANON_API_KEY);
    let id = Math.floor(Math.random() * 1000);
    const result = await supabase
      .from('updates')
      .insert(
        {
          update_id: id,
          user_uuid: session.user.id,
          goal_id: update.goal_id,
          update_date_epoch: update.update_date_epoch,
          update_measurement: update.update_measurement,
          update_text: update.update_text
        }
      )
      .select()

    let goal: any = await supabase
      .from('goals')
      .select()
      .eq("goal_id", update.goal_id)

    if (goal.data.update_ids == null) {
      goal.data.update_ids = { id }
    } else {
      goal.data.update_ids.push(id)
    }
    await supabase
      .from('goals')
      .update(
        {
          update_ids: goal.data.update_ids
        }
      )
      .eq("goal_id", update.goal_id)


  }

  async updateUserUpdate(session, update) {
    if (!this.authenticateUser(session)) throw new UnauthorizedException("Authentication Failed");
    const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', process.env.SUPABASE_ANON_API_KEY);
    const result = await supabase
      .from('updates')
      .update({
        update_measurement: update.update_measurement,
        update_text: update.update_text
      })
      .eq('update_id', update.update_id)
      .eq('user_uuid', session.user.id)
  }

  async deleteUserUpdate(session, update_id) {
    if (!this.authenticateUser(session)) throw new UnauthorizedException("Authentication Failed");
    const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', process.env.SUPABASE_ANON_API_KEY);
    const result = await supabase
      .from('updates')
      .delete()
      .eq('update_id', update_id)
      .eq('user_uuid', session.user.id)

  }

}