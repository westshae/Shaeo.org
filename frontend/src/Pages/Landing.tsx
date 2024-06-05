import { Button } from "@mui/material";
import { Session, createClient } from "@supabase/supabase-js";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRldXZyeXllYnR2cHNiZGdoZHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc1NDc5ODAsImV4cCI6MjAzMzEyMzk4MH0.7R6tDYRLEkpBbLEZkPVq0_0_uDYNmfeCrYZ53I0ZwBU')


function Landing() {
    const [session, setSession] = useState<Session | null>(null)

    const getUserGoals = async () =>{
        const result = await axios.get("http://localhost:5000/goals/getUserGoals",{params:{session}})
        console.log(result.data.data)
    }

    const addUserGoal = async () =>{
        const result = await axios.post("http://localhost:5000/goals/addUserGoal",{
            session:session,
            goal: {
                category_id: 1,
                start_date_epoch: 123123123,
                end_date_epoch: 123123123,
                outcome: "outcome",
                measureable_type: "measurement_type",
                measurement_count: 123,
                achievable: "yes",
                update_ids: null
            }
  
        })
        console.log(result)
    }

    const updateUserGoal = async () => {
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
        console.log(result)
    }

    const deleteUserGoal = async () => {
        const result = await axios.delete("http://localhost:5000/goals/deleteUserGoal",{
            data: {
                session:session,
                goal_id: 1
            }
        })
        console.log(result)
    }


    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()


    }, [])
    

    return (
        <div>
            <h1>Landing</h1>
            {!session &&
                <Link to="/login">
                    <Button>Login</Button>
                </Link>
            }
            {session &&
                <div>
                    <Link to="/dashboard">
                        <Button>Dashboard</Button>
                    </Link>
                    <Button onClick={async () => await supabase.auth.signOut()}>Log out</Button>
                    <Button onClick={async () => await getUserGoals()}>getUserGoals</Button>
                    <Button onClick={async () => await addUserGoal()}>addUserGoal</Button>
                    <Button onClick={async () => await updateUserGoal()}>updateUserGoal</Button>
                    <Button onClick={async () => await deleteUserGoal()}>deleteUserGoal</Button>

                </div>
            }
        </div>
    )
}

export default Landing;
