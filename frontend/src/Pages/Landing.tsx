import { Button } from "@mui/material";
import { Session, createClient } from "@supabase/supabase-js";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserGoals, addUserGoal, updateUserGoal, deleteUserGoal, getUserUpdates, addUserUpdates, updateUserUpdate, deleteUserUpdate } from "../Components/Api";
const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRldXZyeXllYnR2cHNiZGdoZHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc1NDc5ODAsImV4cCI6MjAzMzEyMzk4MH0.7R6tDYRLEkpBbLEZkPVq0_0_uDYNmfeCrYZ53I0ZwBU')


function Landing() {
    const [session, setSession] = useState<Session | null>(null)


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
                </div>
            }
        </div>
    )
}

export default Landing;
