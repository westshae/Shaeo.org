import { Box, Button, Toolbar, Typography } from "@mui/material";
import { Session, createClient } from "@supabase/supabase-js";
import FlagIcon from '@mui/icons-material/Flag';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRldXZyeXllYnR2cHNiZGdoZHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc1NDc5ODAsImV4cCI6MjAzMzEyMzk4MH0.7R6tDYRLEkpBbLEZkPVq0_0_uDYNmfeCrYZ53I0ZwBU')


function Landing() {
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
        })

        return () => subscription.unsubscribe()


    }, [])


    return (
        <Box>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => navigate("/")}><Typography variant="h5" sx={{ textTransform: 'none' }}><FlagIcon/>ProjectQ1</Typography></Button>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
                    
                {session &&
                        <Button onClick={() => navigate("/dashboard")}><Typography variant="h6" sx={{ textTransform: 'none' }}>Dashboard</Typography></Button>
                    }
                    {!session &&
                        <Button onClick={() => navigate("/login")}><Typography variant="h6" sx={{ textTransform: 'none' }}>Sign in</Typography></Button>
                    }
                    {session &&
                        <Button onClick={async () => await supabase.auth.signOut()}><Typography variant="h6" sx={{ textTransform: 'none' }}>Sign Out</Typography></Button>
                    }
                </Box>
            </Toolbar>
        </Box>
    )
}

export default Landing;
