import { Box, Button, Container, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { Session, createClient } from "@supabase/supabase-js";
import FlagIcon from '@mui/icons-material/Flag';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ResourceMenu from "../../Components/ResourceMenu";
const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRldXZyeXllYnR2cHNiZGdoZHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc1NDc5ODAsImV4cCI6MjAzMzEyMzk4MH0.7R6tDYRLEkpBbLEZkPVq0_0_uDYNmfeCrYZ53I0ZwBU')


function GoalSetting() {
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
                <Button onClick={() => navigate("/")}><Typography variant="h5" sx={{ textTransform: 'none' }}><FlagIcon />ProjectQ1</Typography></Button>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
                    <ResourceMenu/>
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
            <Container>
                <Box>
                    <Typography variant="h4" sx={{ textTransform: 'none' }}>Goal Setting: Making achievable goals.</Typography>
                    <br/>
                    <Typography variant="h5" sx={{ textTransform: 'none' }}>Introduction</Typography>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        There are so many ways to set goals that can't be achieved, and set you back more than they help you. S.M.A.R.T goals are a great start,
                        but honestly, I think the R is a waste, and the rest generally aren't explained well, so I'll explain them here.
                    </Typography>
                    <Typography variant="h5" sx={{ textTransform: 'none' }}>Being Specific</Typography>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        When it comes to setting goals, one of the first steps people fail at is being specific.
                        Lets use the prime example of "Getting Healthier". If someone tells you that "They want to get healthier",
                        you're probably wondering what that even means to them.
                    </Typography>
                    <br/>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        To me, I look at that statement, and I wonder if they want to start running marathons, or if they want to start eating healthier (same trap), 
                        or if they want to get more vitamens, or even if they just care about losing weight.
                    </Typography>
                    <br/>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        On top of that, I wonder how they think they're going to achieve something so vague. If being healthier is losing weight, how much do they have to lose?
                        10kg, 40kg, 7 tonnes? If it's eating better, is that the same as wanting to lose weight, or do they only want whole foods, or do they just feel bad
                        for binge eating snacks?
                    </Typography>
                    <br/>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        Who knows. All I know is, the only goals that work are ones that you have a well defined success criteria. Set multiple goals if you have to.
                        Tell me "I want to lose weight", "I want to be able to run longer", "I want to eat less food", not "I want to be healthier"
                    </Typography>
                    <Typography variant="h5" sx={{ textTransform: 'none' }}>Measuring The Right Metrics</Typography>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        Right, so we've set a specific goal, but now we need to figure out what metrics to follow. Using "losing weight" as the example again,
                        we already know that the "metric" of losing weight is either pounds, or kilograms, but that doesn't actually help us achieve our goals 
                        any more than before. Why? because it's not an action.
                    </Typography>
                    <br/>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        It'd be better to measure the goals with a combination of "calories eaten" and "miles ran", as these are the inputs required for losing weight,
                        and also allows you to build better habits. For example, if you set a goal to "lose weight", you might struggle, or not hit it even though you ate less
                        than normal, and worked out more than normal.
                    </Typography>
                    <br/>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        Instead, if you work on working out more, and eating less, then after a month or so of having the habit, you can increase the amount of running you hope
                        to achieve, or decrease the amount of food you want to eat, or even set a restriction on the type of food you want to eat.
                    </Typography>
                    <Typography variant="h5" sx={{ textTransform: 'none' }}>Goals Need To Be Achievable</Typography>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        We discussed achievability briefly when it comes to setting metrics, but we also need to set goals that are guaranteed to be achievable no matter
                        what happens. Lets say you play college basketball, and you want to improve. 
                    </Typography>
                    <br/>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        Some might set a goal like "I want to win all of my basketball games this season", but you already know they're going to fail.
                        Why? because they have almost no control over winning all the games in the season. Maybe they're ill one game, maybe their teammates fall behind,
                        maybe your competition is just insanely skilled so you have zero chance of beating them. So many different factors out of your control, you'll
                        likely fail, and not gain from your goal.
                    </Typography>
                    <br/>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        How do we fix this? We once again figure out the inputs required to achieve the objective you want. You make the goals personal to you.
                        Maybe your goal is "I want to practice 7 hours a week", "I want to practice 1000 basketball shots a week" or any other specific action you
                        can take to improve your chances of reaching that out of reach objective.
                    </Typography>
                    <br/>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        To give you an understanding of goals like this, as they can be hard to spot, avoid goals like this. "I want to start a business that makes $1million per year",
                        "I want to get 1000 new clients this year", "I want to be the first person at work everyday", "I want to become friends with Joe Blog".
                    </Typography>
                    <Typography variant="h5" sx={{ textTransform: 'none' }}>The Time of Deadlines</Typography>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        It's time that we get to time (ha). Assuming all other aspects of your goals are right, time can be the factor that ensures you succeed, or rather fail.
                        Why?
                    </Typography>
                    <br/>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        So, when it comes to figuring out your goal's deadline, you need to pick the right amount of time that gives a sense of urgency, but also wiggle room.
                        If you gave yourself a year to make a business plan, you'll spend the first 6 months wasting your time, and you'll spend the second half thinking 
                        "why bother", or better yet, you'll forget you had the goal in the first place.
                    </Typography>
                    <br/>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        If you set the goal to be finished by tomorrow, anything could pop up to ruin your goal. Maybe you have an emergency pop up, or 
                        you forget that it's date night tomorrow, or even that the goal simply isn't possible in that time frame, like losing 10kg by tomorrow.
                    </Typography>
                    <br/>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        I look at it in a few steps. First, I think of the shortest possible amount of time it would take to achieve this goal. If I'm trying to lose weight,
                        I know that losing any more than 1kg a week is dangerous for most people, let alone 0.75kg. So if I'm wanting to lose 10kg, I'd set the minimum amount
                        of time to 10 weeks.
                    </Typography>
                    <br/>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        Next, I'd consider how hard I want the goal to be to achieve. Losing 1kg per week is going to suck, but losing 75% of that is much more manageable.
                        Lets change the time to 15 weeks to lose 10kg. We're not done yet though.
                    </Typography>
                    <br/>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        I know that sometimes stuff pops up that I don't want to miss out on. I don't want to lose out on the enjoyment of going out to dinner with
                        friends or family, maybe a friends birthday is coming up, that you would hate to refuse cake at. Maybe it's as simple as having a treat meal
                        once a week. Either way, you should give yourself a bit more time, say 10-20% of the time, on top, to make the goal easier to endure.
                    </Typography>
                    <br/>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        Now we're at 18 weeks to lose 10kg, which is a reasonable time frame to reach the goal, but now we run into the issue that the goal is going to 
                        take 4.5 months to achieve. It's hard to keep going that long without achieving your goal, so what we do is cut out goal in half. We're going to
                        lose 5kg in 9 weeks. Now we have something closer to achieve, and it's still more than achievable.
                    </Typography>
                    <br/>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        Remember, you don't have to wait 9 weeks to achieve your goal, you need to complete the goal by then. That means, if you're feeling extra motivated one 
                        week, you can push harder and potentially succeed a week early, or more. Now they're achievable, but you can still push more if you want.
                    </Typography>
                    <Typography variant="h5" sx={{ textTransform: 'none' }}>Conclusion</Typography>
                    <Typography variant="body1" sx={{ textTransform: 'none' }}>
                        So now you know a bit more about setting goals you can succeed at easier, so why not give it a try. Put all these steps into practice and just wait for
                        the results.
                    </Typography>
                    <br/>
                </Box>
            </Container>
        </Box>
    )
}

export default GoalSetting;
