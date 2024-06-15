import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Container, Grid, IconButton, Toolbar, Typography } from "@mui/material";
import { Session, createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserGoals, deleteUserGoal } from "../Components/Api";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import FlagIcon from '@mui/icons-material/Flag';
import { GetGoalInterface } from "../Components/Interfaces";
import dayjs from "dayjs";
import ResourceMenu from "../Components/ResourceMenu";
import getAuth from "../Components/Authentication";

function Dashboard() {
    const [session, setSession] = useState<Session | null>(null)
    const [goals, setGoals] = useState<GetGoalInterface[]>([]);
    const navigate = useNavigate()

    const handleDelete = async (goalId: number) => {
        await deleteUserGoal(session, goalId)
        setGoals((prevGoals) => prevGoals.filter(card => card.goal_id !== goalId));
    }


    useEffect(() => {
        getAuth().auth.getSession().then(({ data: { session } }) => {
            setSession(session)

        })

        const {
            data: { subscription },
        } = getAuth().auth.onAuthStateChange((_event, session) => {
            setSession(session)

            if (!session) {
                navigate("/login")
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
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => navigate("/")}><Typography variant="h5" sx={{ textTransform: 'none' }}><FlagIcon />ProjectQ1</Typography></Button>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
                    <ResourceMenu />
                    <Button onClick={async () => await getAuth().auth.signOut()}><Typography variant="h6" sx={{ textTransform: 'none' }}>Sign Out</Typography></Button>
                </Box>

            </Toolbar>
            <Grid container spacing={2} >
                <Grid item xs={6}>
                    <Card sx={{ maxWidth: 500, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: "100%" }} onClick={() => navigate("/dashboard/create")}>
                        <CardActionArea sx={{ height: "100%" }}>
                            <CardContent>
                                <AddCircleOutlineIcon color="primary" style={{ fontSize: 60, height: "100%" }} />
                                <Typography color="primary" variant="h5" component="div">
                                    Create new goal
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
                {goals.map((card: GetGoalInterface, index) => (
                    <Grid item xs={6} key={index}>
                        <Card sx={{ height: "100%", position: 'relative' }} >
                            <IconButton
                                aria-label="delete"
                                sx={{ position: 'absolute', top: 10, right: 10, color: 'white', zIndex: 2000, background: "#FF7043", borderRadius: "4px", '&:hover': { background: "maroon" } }}
                                onClick={() => handleDelete(card.goal_id)}
                                color="primary"
                            >
                                <DeleteIcon />
                            </IconButton>


                            <CardActionArea onClick={() => navigate(`/dashboard/update/${card.goal_id}`)}>
                                <CardContent>
                                    <Typography color="primary" gutterBottom variant="h5" component="div">
                                        {card.outcome}
                                    </Typography>
                                    <Typography variant="h6" component="div">
                                        Complete by: {dayjs(card.end_date_epoch).format('ddd DD/MM/YY')}
                                    </Typography>
                                    <Typography variant="h6" component="div">
                                        Most Recent Update:  {dayjs(card.start_date_epoch).format('DD/MM/YY')}
                                    </Typography>
                                    <Typography variant="h6" component="div">
                                        {card.update_ids.length} Progress Updates
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
