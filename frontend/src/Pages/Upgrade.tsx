import { Box, Button, Card, CardActionArea, CardContent, Container, Grid, IconButton, Toolbar, Typography } from "@mui/material";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FlagIcon from '@mui/icons-material/Flag';
import getAuth from "../Components/Authentication";
import { getPaymentLink, getIsUserPremium } from "../Components/Api";

function Upgrade() {
    const isMobile = /Mobile|Android|iP(hone|od|ad)/i.test(navigator.userAgent);
    const [session, setSession] = useState<Session | null>(null)
    const [paymentLink, setPaymentLink] = useState<string | null>(null);
    const [isUserPremium, setIsUserPremium] = useState<boolean>(false);

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
                getIsUserPremium(session).then((result) => {
                    setIsUserPremium(result.data)
                })
            });
        }
    }, [session])

    return (
        <Box>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', padding: '0' }}>
                {isMobile &&
                    <Button onClick={() => navigate("/")}><FlagIcon /></Button>
                }
                {!isMobile &&
                    <Button onClick={() => navigate("/")}><Typography variant="h5" sx={{ textTransform: 'none' }}><FlagIcon />Shaeo.org</Typography></Button>
                }
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
                    <Button onClick={() => navigate("/resource")}><Typography variant="h6" sx={{ textTransform: 'none' }}>Resources</Typography></Button>
                    {session &&
                        <Button onClick={() => navigate("/dashboard")}><Typography variant="h6" sx={{ textTransform: 'none' }}>Dashboard</Typography></Button>
                    }
                    {!session &&
                        <Button onClick={() => navigate("/login")}><Typography variant="h6" sx={{ textTransform: 'none' }}>Login</Typography></Button>
                    }
                    {session &&
                        <Button onClick={async () => await getAuth().auth.signOut()}><Typography variant="h6" sx={{ textTransform: 'none' }}>Logout</Typography></Button>
                    }
                </Box>
            </Toolbar>
            <br />
            <Typography variant="h4" sx={{ textTransform: 'none' }} color="primary">Upgrade Page</Typography>
            <br />
            <Box>
                <Card sx={{ width: "100%", textAlign: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center', height: "100%" }}>
                    <CardContent>
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
                    </Card>
                    <Card sx={{ width: "100%", textAlign: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center', height: "100%" }}>

                    <CardContent>
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
                        {paymentLink != null && !isUserPremium &&
                            <Button variant="contained" onClick={() => window.open(paymentLink)} sx={{ marginLeft: '0.5rem' }}>
                                <Typography variant="h5" color="#121212" sx={{ textTransform: 'none' }}>Buy Annual Access Here</Typography>
                            </Button>
                        }
                    </CardContent>
                </Card>
            </Box>
            <br />
            {isUserPremium &&
                <Typography variant="h5" color="primary" sx={{ textTransform: 'none' }}>Thank you for purchasing premium</Typography>
            }



        </Box>
    )
}

export default Upgrade;
