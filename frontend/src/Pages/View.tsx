import { Paper, Grid, Typography, Button } from "@mui/material"
import { createClient, Session } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { GetGoalInterface } from "../Components/Interfaces"
import { getUserGoal } from "../Components/Api"
const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRldXZyeXllYnR2cHNiZGdoZHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc1NDc5ODAsImV4cCI6MjAzMzEyMzk4MH0.7R6tDYRLEkpBbLEZkPVq0_0_uDYNmfeCrYZ53I0ZwBU')


function View() {
    const { goal_id } = useParams();

    const [session, setSession] = useState<Session | null>(null)
    const [goal, setGoal] = useState<GetGoalInterface | null>(null);
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

    useEffect(() => {
        if (session && goal == null && goal_id) {
            getUserGoal(session, parseInt(goal_id)).then((result) => {
                setGoal(result.data.data)
            });
        }
    }, [session])


    return (
        <div>
            {goal != null &&
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5" align="center">{goal?.outcome}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <img src={goal.image} alt={goal.image} />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Achievable: {goal.achievable}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2">Category ID: {goal.category_id}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Button onClick={() => navigate(`/dashboard/update/${goal_id}`)}>Update</Button>
                    </Grid>

                </Grid>
            }
        </div>
    )
}

export default View;
