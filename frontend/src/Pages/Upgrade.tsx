import { Box, Button, Card, CardActionArea, CardContent, Container, Grid, IconButton, Toolbar, Typography } from "@mui/material";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FlagIcon from '@mui/icons-material/Flag';
import ResourceMenu from "../Components/ResourceMenu";
import getAuth from "../Components/Authentication";
import { getPaymentLink } from "../Components/Api";

function Upgrade() {
    const [session, setSession] = useState<Session | null>(null)
    const [paymentLink, setPaymentLink] = useState<string | null>(null);
    const navigate = useNavigate()

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
        if (session) {
            getPaymentLink(session).then((result) => {
                setPaymentLink(result.data)
            });
        }
    }, [session])

    return (
        <Container>
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
            <br />
            <Typography variant="h4" sx={{ textTransform: 'none' }} color="primary">Upgrade Page</Typography>
            <br />
            <Box>
                <Card sx={{ width: "100%", textAlign: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center', height: "100%" }}>
                    <CardContent sx={{ width: "50%" }}>
                        <Typography variant="h5" sx={{ textTransform: 'none' }}>
                            {' '}                   <Typography variant="h5" component="span" color="primary">
                                Free
                            </Typography>
                            {' '} Tier
                        </Typography>
                        <Typography variant="h6" sx={{ textTransform: 'none' }}>
                            - Access to
                            {' '}<Typography variant="h6" component="span" color="primary">
                                1
                            </Typography>
                            {' '} concurrent goal
                        </Typography>
                        <Typography variant="h6" sx={{ textTransform: 'none' }}>
                            - {' '}
                            <Typography variant="h6" component="span" color="primary">
                                Unlimited
                            </Typography>
                            {' '} access to resources
                        </Typography>
                        <Typography variant="h6" sx={{ textTransform: 'none' }}>
                            - {' '}
                            <Typography variant="h6" component="span" color="primary">
                                Unlimited
                            </Typography>
                            {' '} progress updates on your goal
                        </Typography>
                    </CardContent>
                    <CardContent sx={{ width: "50%" }}>
                        <Typography variant="h5" sx={{ textTransform: 'none' }}>
                            {' '}                   <Typography variant="h5" component="span" color="primary">
                                $30
                            </Typography>
                            {' '} Annual Access
                        </Typography>
                        <Typography variant="h6" sx={{ textTransform: 'none' }}>
                            - Access to {' '}
                            <Typography variant="h6" component="span" color="primary">
                                Unlimited
                            </Typography>
                            {' '} concurrent goal
                        </Typography>
                        <Typography variant="h6" sx={{ textTransform: 'none' }}>
                            - {' '}
                            <Typography variant="h6" component="span" color="primary">
                                Unlimited
                            </Typography>
                            {' '} access to resources
                        </Typography>
                        <Typography variant="h6" sx={{ textTransform: 'none' }}>
                            - {' '}
                            <Typography variant="h6" component="span" color="primary">
                                Unlimited
                            </Typography>
                            {' '}progress updates on your goal
                        </Typography>
                        {paymentLink != null &&
                            <Button variant="contained" onClick={() => window.open(paymentLink)} sx={{ marginLeft: '0.5rem' }}>
                                <Typography variant="h5" color="#121212" sx={{ textTransform: 'none' }}>Buy Annual Access Here</Typography>
                            </Button>
                        }
                    </CardContent>
                </Card>
            </Box>
            <br />


        </Container>
    )
}

export default Upgrade;
