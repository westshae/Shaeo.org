import { createClient, Session } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"


function Create() {
    const [session, setSession] = useState<Session | null>(null)
    const navigate = useNavigate()
    const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRldXZyeXllYnR2cHNiZGdoZHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc1NDc5ODAsImV4cCI6MjAzMzEyMzk4MH0.7R6tDYRLEkpBbLEZkPVq0_0_uDYNmfeCrYZ53I0ZwBU')


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
            <h1>Create</h1>
        </div>
    )
}

export default Create;
