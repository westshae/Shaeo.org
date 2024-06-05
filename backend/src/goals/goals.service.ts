import { Injectable, UnauthorizedException } from "@nestjs/common";
import { createClient } from "@supabase/supabase-js";

@Injectable()
export class GoalsService {
    async authenticateUser(session){
        const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', process.env.SUPABASE_ANON_API_KEY);
        const user = await supabase.auth.getUser(session.access_token);
        if(user.data.user.id === session.user.id){
            return true
        }
        return false;
    }

    async getUserGoals(session) {
        if(!this.authenticateUser(session)) throw new UnauthorizedException("Authentication Failed");
        const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', process.env.SUPABASE_ANON_API_KEY);

        const goals = supabase.from("goals").select("*").eq("user_uuid", session.user.id);
        return goals;
    }

    async getUserUpdates(session) {

    }

    async addUserGoal(session, goal) {
        if(!this.authenticateUser(session)) throw new UnauthorizedException("Authentication Failed");
        const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', process.env.SUPABASE_ANON_API_KEY);
        const result = await supabase
        .from('goals')
        .insert(
          { 
            goal_id: Math.floor(Math.random()*1000), 
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

    async updateUserGoal(session, goal){
        if(!this.authenticateUser(session)) throw new UnauthorizedException("Authentication Failed");
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

    async addUserUpdate(session) {

    }

    async deleteUserGoal(session) {

    }

    async deleteUserUpdate(session) {

    }

}