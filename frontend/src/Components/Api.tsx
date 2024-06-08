import axios from "axios"
import { CreateGoalInterface } from "./Interfaces"

const getUserGoals = async (session: any) =>{
    const result = await axios.get("http://localhost:5000/goals/getUserGoals",{params:{session}})
    return result
}

const addUserGoal = async (session: any, goal: CreateGoalInterface) =>{
    const result = await axios.post("http://localhost:5000/goals/addUserGoal",{
        session:session,
        goal: {
            category_id: goal.category_id,
            start_date_epoch: goal.start_date_epoch,
            end_date_epoch: goal.end_date_epoch,
            outcome: goal.outcome,
            measureable_type: goal.measureable_type,
            measurement_count: goal.measurement_count,
            achievable: goal.achievable,
            update_ids: []
        }
    })
    return result
}

const updateUserGoal = async (session: any) => {
    const result = await axios.post("http://localhost:5000/goals/updateUserGoal",{
        session:session,
        goal: {
            goal_id: 1,
            category_id: 1,
            start_date_epoch: 123123123,
            end_date_epoch: 123123123,
            outcome: "updated",
            measureable_type: "measurement_type",
            measurement_count: 123,
            achievable: "yes",
            update_ids: null
        }

    })
    return result
}

const deleteUserGoal = async (session: any, goalId: number) => {
    const result = await axios.delete("http://localhost:5000/goals/deleteUserGoal",{
        data: {
            session:session,
            goal_id: goalId
        }
    })
    return result
}

const getUserUpdates = async (session: any) => {
    const result = await axios.get("http://localhost:5000/goals/getUserUpdates",{params:{session}})
    return result
}

const addUserUpdates = async (session: any) => {
    const result = await axios.post("http://localhost:5000/goals/addUserUpdate",{
        session:session,
        update: {
            goal_id: 635,
            update_date_epoch: 123123123,
            update_measurement: 234, 
            update_text: "update_text"

        }

    })
    return result

}

const updateUserUpdate = async (session: any) => {
    const result = await axios.post("http://localhost:5000/goals/updateUserUpdate",{
        session:session,
        update: {
            update_id: 457,
            update_measurement: 567, 
            update_text: "bro this got updated"
        }

    })
    return result
}

const deleteUserUpdate = async (session: any) => {
    const result = await axios.delete("http://localhost:5000/goals/deleteUserUpdate",{
        data: {
            session:session,
            update_id: 457
        }
    })
    return result
}

export {getUserGoals, getUserUpdates, addUserGoal, addUserUpdates, updateUserGoal, updateUserUpdate, deleteUserGoal, deleteUserUpdate}