import { AppBar, Box, Button, Card, CardActionArea, CardContent, CardMedia, Container, Grid, IconButton, Link, Toolbar, Typography, keyframes } from "@mui/material";
import { Session, createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserGoals, deleteUserGoal } from "../Components/Api";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { GetGoalInterface } from "../Components/Interfaces";

const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRldXZyeXllYnR2cHNiZGdoZHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc1NDc5ODAsImV4cCI6MjAzMzEyMzk4MH0.7R6tDYRLEkpBbLEZkPVq0_0_uDYNmfeCrYZ53I0ZwBU')


function Dashboard() {
    const [session, setSession] = useState<Session | null>(null)
    const [deleteMode, setDeleteMode] = useState<Boolean>(false)
    const [goals, setGoals] = useState<GetGoalInterface[]>([]);
    const navigate = useNavigate()

    const handleDelete = async (goalId: number) => {
        await deleteUserGoal(session, goalId)
        setGoals((prevGoals) => prevGoals.filter(card => card.goal_id !== goalId));
    }


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
        if (session && goals.length == 0) {
            getUserGoals(session).then((result) => {
                setGoals(result.data.data)
            });
        }
    }, [session])

    return (
        <Container>
            <Toolbar sx={{ display: 'flex', justifyContent: 'left' }}>
                <Button onClick={() => navigate("/")}><Typography>ProjectQ1</Typography></Button>
                <Button onClick={async () => await supabase.auth.signOut()}><Typography>Sign Out</Typography></Button>
                <Button onClick={() => setDeleteMode(!deleteMode)}><Typography>Toggle Deletion</Typography></Button>
            </Toolbar>
            <Grid container spacing={4} >
                <Grid item xs={6}>
                    <Card sx={{ maxWidth: 500, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: "100%" }} onClick={() => navigate("/dashboard/goal/create")}>
                        <CardActionArea sx={{ height: "100%" }}>
                            <CardContent>
                                <AddCircleOutlineIcon style={{ fontSize: 60, color: 'gray', height: "100%" }} />
                                <Typography variant="h5" component="div">
                                    Create new goal
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                {goals.map((card, index) => (
                    <Grid item xs={6} key={index}>
                        <Card sx={{ maxWidth: 500, position: 'relative' }} >
                            {deleteMode &&
                                <IconButton
                                    aria-label="delete"
                                    sx={{ position: 'absolute', top: 10, right: 10, color: 'white', zIndex: 2000, background: "red", borderRadius: "4px", '&:hover': { background: "maroon" } }}
                                    onClick={() => handleDelete(card.goal_id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            }

                            <CardActionArea onClick={() => navigate(`/dashboard/update/${card.goal_id}`)}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={"https://ssl.gstatic.com/calendar/images/eventillustrations/v1/img_gym_1x.jpg"}
                                    alt={`Image of ${card.title}`}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {card.outcome} {card.goal_id}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>

                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export default Dashboard;
