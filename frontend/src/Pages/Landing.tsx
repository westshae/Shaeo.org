import { Box, Button, Card, CardActionArea, CardContent, Container, Grid, Toolbar, Typography } from "@mui/material";
import { Session, createClient } from "@supabase/supabase-js";
import FlagIcon from '@mui/icons-material/Flag';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ResourceMenu from "../Components/ResourceMenu";
import getAuth from "../Components/Authentication";

function Landing() {
    const [session, setSession] = useState<Session | null>(null)
    const navigate = useNavigate()


    useEffect(() => {
        getAuth().auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const {
            data: { subscription },
        } = getAuth().auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()


    }, [])


    return (
        <Box>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => navigate("/")}><Typography variant="h5" sx={{ textTransform: 'none' }}><FlagIcon />ProjectQ1</Typography></Button>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
                    <ResourceMenu />
                    {session &&
                        <Button onClick={() => navigate("/dashboard")}><Typography variant="h6" sx={{ textTransform: 'none' }}>Dashboard</Typography></Button>
                    }
                    {!session &&
                        <Button onClick={() => navigate("/login")}><Typography variant="h6" sx={{ textTransform: 'none' }}>Sign in</Typography></Button>
                    }
                    {session &&
                        <Button onClick={async () => await getAuth().auth.signOut()}><Typography variant="h6" sx={{ textTransform: 'none' }}>Sign Out</Typography></Button>
                    }
                </Box>
            </Toolbar>
            <Container>
                <Box>
                    <Typography variant="h2" sx={{ textTransform: 'none', textAlign: 'center' }}>Helping set goals you'll actually achieve</Typography>
                </Box>
                <br />
                <Box
                    display="flex"
                    flexDirection={"column"}
                    justifyContent="center"
                    alignItems="center"
                >
                    <Card sx={{ width: "50%", textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: "100%" }}>
                        <CardContent>
                            <Typography variant="h5" sx={{ textTransform: 'none' }}>
                                No More...
                            </Typography>
                            <Typography variant="h6" sx={{ textTransform: 'none' }}>
                                Unspecific Goals
                            </Typography>
                            <Typography variant="h6" sx={{ textTransform: 'none' }}>
                                Bad Metrics
                            </Typography>
                            <Typography variant="h6" sx={{ textTransform: 'none' }}>
                                Impssible to achieve goals
                            </Typography>
                            <Typography variant="h6" sx={{ textTransform: 'none' }}>
                                Deadlines that make it harder to succeed
                            </Typography>
                        </CardContent>
                    </Card>
                    <br />

                    <Typography variant="h5">Goals achieved in weeks, not never.</Typography>
                </Box>
                <br />
                <Box>
                    <Card sx={{ width: "100%", textAlign: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center', height: "100%" }}>
                        <CardContent sx={{ width: "50%" }}>
                            <Typography variant="h5" sx={{ textTransform: 'none' }}>
                                Who am I?
                            </Typography>
                            <Typography variant="h6" sx={{ textTransform: 'none' }}>
                                I've been working on self-improvement for the past 5 years, more recently focusing on giving advice to people based on what
                                I've learnt.
                            </Typography>
                        </CardContent>
                        <CardContent sx={{ width: "50%" }}>
                            <Typography variant="h5" sx={{ textTransform: 'none' }}>
                                What people fail on?
                            </Typography>
                            <Typography variant="h6" sx={{ textTransform: 'none' }}>
                                Goals always seem to lack specificity, solid metrics, a good timeline, and a guaranteed achievement.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
                <br/>
                <Box>
                    <Card sx={{ width: "100%", textAlign: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center', height: "100%" }}>
                        <CardContent sx={{ width: "50%" }}>
                            <Typography variant="h5" sx={{ textTransform: 'none' }}>
                                Free Tier
                            </Typography>
                            <Typography variant="h6" sx={{ textTransform: 'none' }}>
                                - Access to 1 concurrent goal
                            </Typography>
                            <Typography variant="h6" sx={{ textTransform: 'none' }}>
                                - Unlimited access to resources
                            </Typography>
                            <Typography variant="h6" sx={{ textTransform: 'none' }}>
                                - Unlimited progress updates on your goal
                            </Typography>
                        </CardContent>
                        <CardContent sx={{ width: "50%" }}>
                            <Typography variant="h5" sx={{ textTransform: 'none' }}>
                                $30 Annual Access
                            </Typography>
                            <Typography variant="h6" sx={{ textTransform: 'none' }}>
                                - Access to unlimited concurrent goal
                            </Typography>
                            <Typography variant="h6" sx={{ textTransform: 'none' }}>
                                - Unlimited access to resources
                            </Typography>
                            <Typography variant="h6" sx={{ textTransform: 'none' }}>
                                - Unlimited progress updates on your goal
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
                <br/>
                <Box sx={{display: 'flex'}}>
                    <Typography variant="h5" sx={{ textTransform: 'none' }}>If you're interested...</Typography>
                    <Button variant="contained" onClick={() => navigate("/dashboard")} sx={{ marginLeft: '0.5rem' }}>
                        <Typography variant="h5" sx={{ textTransform: 'none' }}>Get Started Free</Typography>
                    </Button>
                </Box>
            </Container>
        </Box>
    )
}

export default Landing;
