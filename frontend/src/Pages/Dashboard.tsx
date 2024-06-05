import { Button } from "@mui/material";
import { Session, createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserGoals, addUserGoal, updateUserGoal, deleteUserGoal, getUserUpdates, addUserUpdates, updateUserUpdate, deleteUserUpdate } from "../Components/api_access";
const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRldXZyeXllYnR2cHNiZGdoZHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc1NDc5ODAsImV4cCI6MjAzMzEyMzk4MH0.7R6tDYRLEkpBbLEZkPVq0_0_uDYNmfeCrYZ53I0ZwBU')


function Dashboard() {
    const [session, setSession] = useState<Session | null>(null)
    const navigate = useNavigate()


    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)

        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)

            if (!session) {
                navigate("/")
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    return (
        <div>
            <h1>Dashboard</h1>
            {session &&
                <div>

                    <Button onClick={async () => await supabase.auth.signOut()}>Log out</Button>

                    <Button onClick={async () => await getUserGoals(session)}>getUserGoals</Button>
                    <Button onClick={async () => await addUserGoal(session)}>addUserGoal</Button>
                    <Button onClick={async () => await updateUserGoal(session)}>updateUserGoal</Button>
                    <Button onClick={async () => await deleteUserGoal(session)}>deleteUserGoal</Button>
                    <Button onClick={async () => await getUserUpdates(session)}>getUserUpdates</Button>
                    <Button onClick={async () => await addUserUpdates(session)}>addUserUpdates</Button>
                    <Button onClick={async () => await updateUserUpdate(session)}>updateUserUpdate</Button>
                    <Button onClick={async () => await deleteUserUpdate(session)}>deleteUserUpdate</Button>
                </div>
            }
        </div>
    )
}

export default Dashboard;
