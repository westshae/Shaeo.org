import { useEffect, useState } from 'react';
import { Session, createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useNavigate } from 'react-router-dom';
import getAuth from '../Components/Authentication';

function Login() {
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
      if (session) {
        navigate("/Dashboard")
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (<Auth supabaseClient={getAuth()} appearance={{ theme: ThemeSupa }} />)


}

export default Login;
