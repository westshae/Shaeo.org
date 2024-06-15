import axios from "axios"
import { CreateGoalInterface, CreateUpdateInterface } from "./Interfaces"

const getUserGoals = async (session: any) =>{
    const result = await axios.get(process.env.REACT_APP_BACKEND_URL + "/goals/getUserGoals",{params:{session}})
    return result
}

const getUserGoal = async (session: any, goal_id: number) => {
    const result = await axios.get(process.env.REACT_APP_BACKEND_URL + "/goals/getUserGoal",{params:{session: session, goal_id: goal_id}})
    return result
}

const addUserGoal = async (session: any, goal: CreateGoalInterface) =>{
    const result = await axios.post(process.env.REACT_APP_BACKEND_URL + "/goals/addUserGoal",{
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

const updateUserGoal = async (session: any, goal_id:number, goal: CreateGoalInterface) => {
    const result = await axios.post(process.env.REACT_APP_BACKEND_URL + "/goals/updateUserGoal",{
        session:session,
        goal: {
            goal_id: goal_id,
            category_id: goal.category_id,
            start_date_epoch: goal.start_date_epoch,
            end_date_epoch: goal.end_date_epoch,
            outcome: goal.outcome,
            measureable_type: goal.measureable_type,
            measurement_count: goal.measurement_count,
            achievable: goal.achievable,
            update_ids: goal.update_ids
        }

    })
    return result
}

const deleteUserGoal = async (session: any, goalId: number) => {
    const result = await axios.delete(process.env.REACT_APP_BACKEND_URL + "/goals/deleteUserGoal",{
        data: {
            session:session,
            goal_id: goalId
        }
    })
    return result
}

const getUserUpdates = async (session: any) => {
    const result = await axios.get(process.env.REACT_APP_BACKEND_URL + "/goals/getUserUpdates",{params:{session}})
    return result
}

const getGoalUpdates = async (session: any, goal_id: number) => {
    const result = await axios.get(process.env.REACT_APP_BACKEND_URL + "/goals/getGoalUpdates",{params:{session, goal_id}})
    return result
}

const addUserUpdates = async (session: any, formValues: CreateUpdateInterface) => {
    const result = await axios.post(process.env.REACT_APP_BACKEND_URL + "/goals/addUserUpdate",{
        session:session,
        update: {
            goal_id: formValues.goal_id,
            update_date_epoch: formValues.update_date_epoch,
            update_measurement: formValues.update_measurement, 
            update_text: formValues.update_text
        }

    })
    return result

}

const updateUserUpdate = async (session: any) => {
    const result = await axios.post(process.env.REACT_APP_BACKEND_URL + "/goals/updateUserUpdate",{
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
    const result = await axios.delete(process.env.REACT_APP_BACKEND_URL + "/goals/deleteUserUpdate",{
        data: {
            session:session,
            update_id: 457
        }
    })
    return result
}

const getPaymentLink = async (session: any) => {
    const result = await axios.post(process.env.REACT_APP_BACKEND_URL + "/stripe/getPaymentLink",{
        session:session,
    })
    return result;
}

const getIsUserPremium = async (session: any) => {
    const result = await axios.get(process.env.REACT_APP_BACKEND_URL + "/stripe/isUserPremium",{params:{session}})
    return result
}

export {getUserGoals, getUserGoal, getUserUpdates, addUserGoal, addUserUpdates, updateUserGoal, updateUserUpdate, deleteUserGoal, deleteUserUpdate, getGoalUpdates, getPaymentLink, getIsUserPremium}