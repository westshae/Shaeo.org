import { Box, InputLabel, TextField, TextareaAutosize, Button, Card, CardActionArea, CardContent, Typography, Toolbar, Stack, Container } from "@mui/material"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { createClient, Session } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { CreateGoalInterface, CreateUpdateInterface } from "../Components/Interfaces"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs"
import { addUserGoal, addUserUpdates, getGoalUpdates, getUserGoal, updateUserGoal } from "../Components/Api"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FlagIcon from '@mui/icons-material/Flag';


const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRldXZyeXllYnR2cHNiZGdoZHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc1NDc5ODAsImV4cCI6MjAzMzEyMzk4MH0.7R6tDYRLEkpBbLEZkPVq0_0_uDYNmfeCrYZ53I0ZwBU')


function Goal() {
  const { action, goal_id } = useParams();

  const [session, setSession] = useState<Session | null>(null)
  const [hasFieldsUpdated, setHasFieldsUpdated] = useState<boolean>(false);
  const [actionMode, setActionMode] = useState<string>(action!);
  const [hasInitOnce, setHasInitOnce] = useState<boolean>(false);
  const [updates, setUpdates] = useState<CreateUpdateInterface[]>([])
  const [goal, setGoal] = useState<CreateGoalInterface>({
    category_id: 0,
    start_date_epoch: dayjs().toDate().getTime(),
    end_date_epoch: dayjs().toDate().getTime(),
    outcome: '',
    measureable_type: '',
    measurement_count: 0,
    achievable: '',
    update_ids: [],
  })

  const [formGoalValues, setFormGoalValues] = useState<CreateGoalInterface>(goal);
  const [addProgress, setAddProgress] = useState<Boolean>(false)

  const [formUpdateValues, setFormUpdateValues] = useState<CreateUpdateInterface>({
    goal_id: goal_id ? parseInt(goal_id) : undefined,
    update_date_epoch: dayjs().toDate().getTime(),
    update_measurement: 0,
    update_text: '',
  });

  const [firstPhaseStatus, setFirstPhaseStatus] = useState<number>(0);
  const [secondPhaseStatus, setSecondPhaseStatus] = useState<number>(0);
  const [thirdPhaseStatus, setThirdPhaseStatus] = useState<number>(0);
  const [fourthPhaseStatus, setFourthPhaseStatus] = useState<number>(0);

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
        navigate("/login")
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (hasInitOnce) return;
    if (session && action == "create") {
      handleCreateMode();
      setHasInitOnce(true)
    } else if (session && goal_id && action == "update") {
      getUserGoal(session, parseInt(goal_id!)).then((result) => {
        const data = result.data.data;
        setGoal(data);
      });
      getGoalUpdates(session, parseInt(goal_id!)).then((result) => {
        const data = result.data.data;
        setUpdates(data);
      })
      setHasInitOnce(true)

    }
  }, [session])

  useEffect(() => {
    if (session && !goal_id) {
      handleCreateMode();
    } else if (session && goal_id) {
      handleUpdateMode();
    }

  }, [goal])


  const handleGoalChange = (event: { target: { name: any; value: any } }) => {
    setHasFieldsUpdated(true)
    const { name, value } = event.target;
    setFormGoalValues({
      ...formGoalValues,
      [name]: value,
    });
  };

  const handleDateChange = (name: string, value: Date | undefined) => {
    const newValue = value ? value.getTime() : null;
    setFormGoalValues({
      ...formGoalValues,
      [name]: newValue,
    });
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (goal_id && actionMode == "update") {
      updateUserGoal(session, parseInt(goal_id), formGoalValues)
      navigate("/dashboard")
    } else if (actionMode == "create") {
      addUserGoal(session, formGoalValues)
      navigate("/dashboard")
    }
  }

  const handleUpdateSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (goal_id && actionMode == "update") {
      addUserUpdates(session, formUpdateValues)
      setUpdates([...updates, formUpdateValues])
      setAddProgress(false)
      setFormUpdateValues({
        goal_id: parseInt(goal_id!),
        update_date_epoch: dayjs().toDate().getTime(),
        update_measurement: 0,
        update_text: '',
      });
    } else {
      console.error("error: no goal_id to update")
    }
  };

  const handleUpdateChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setFormUpdateValues({
      ...formUpdateValues,
      [name]: value,
    });
  };

  const handleUpdateMode = () => {
    setHasFieldsUpdated(false)
    setActionMode("update")
    if (goal) {
      setFormGoalValues(goal);
    }
  }

  const handleCreateMode = () => {
    setActionMode("create")
    setFormGoalValues({
      category_id: 0,
      start_date_epoch: dayjs().toDate().getTime(),
      end_date_epoch: dayjs().toDate().getTime(),
      outcome: '',
      measureable_type: '',
      measurement_count: 0,
      achievable: '',
      update_ids: [],
    })
  }

  const handleFirstPhase = (event: any) => {
    const input: string = event.target.value;
    if (input.length > 200 && input.length < 8) {
      setFirstPhaseStatus(1);
    } else {

      setFirstPhaseStatus(2);
      // setTimeout(() => {
      setSecondPhaseStatus(1)
      // }, 7000);
    }
  }

  const handleSecondPhase = (event: any) => {
    const input: string = event.target.value;
    if (input.length > 0) {
      setSecondPhaseStatus(2);
    }
  }

  const handleThirdPhase = (event: any) => {
    if (event.target && event.target.value.length > 0) {
      setThirdPhaseStatus(1)
    } else {
      const deadline = event;
      const threeMonthsInTheFuture = dayjs().add(3, 'month');
      const oneWeekInTheFuture = dayjs().add(1, 'week');
      const currentTime = dayjs();
      const isAfterTodayAndWithinThreeMonths = deadline.isBefore(threeMonthsInTheFuture) && deadline.isAfter(oneWeekInTheFuture);
      if (isAfterTodayAndWithinThreeMonths) {
        setFourthPhaseStatus(1)
        setThirdPhaseStatus(3)
      } else {
        setThirdPhaseStatus(2)
      }
    }
  }

  const handleFourthPhase = (event: any) => {
    if (event.target.value.length < 50 && event.target.value.length != 0) {
      setFourthPhaseStatus(2)
    } else if (event.target.value.length > 0) {
      setFourthPhaseStatus(3)
    }
  }


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={() => navigate("/")}><Typography variant="h5" sx={{ textTransform: 'none' }}><FlagIcon />ProjectQ1</Typography></Button>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
          <Button onClick={() => navigate("/dashboard")}><Typography variant="h6" sx={{ textTransform: 'none' }}>Dashboard</Typography></Button>
          <Button onClick={async () => await supabase.auth.signOut()}><Typography variant="h6" sx={{ textTransform: 'none' }}>Sign Out</Typography></Button>
          {actionMode == "update" && hasFieldsUpdated &&
            <Button onClick={handleUpdateMode}><Typography variant="h6" sx={{ textTransform: 'none' }}>Reset Fields</Typography></Button>

          }
        </Box>
      </Toolbar>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {actionMode != "update" && firstPhaseStatus == 0 &&
          <Container>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Well, since you're here, you must be wanting to set some half-decent goals.</Typography>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>So, what outcome do you want to achieve?</Typography>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Make sure they're specific, like "I want to lose weight."</Typography>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Not "I want to be healthy"</Typography>
          </Container>
        }

        <Typography variant="h5" sx={{ textTransform: 'none' }}>
          I want to ...
          <TextareaAutosize
            placeholder="Outcome"
            name="outcome"
            value={formGoalValues.outcome}
            onChange={handleGoalChange}
            onBlur={handleFirstPhase}
            style={{ width: '70%', marginLeft: '0.5rem' }}
          />
        </Typography>
        {firstPhaseStatus == 1 &&
          <Container>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Based on the length of your message, your goal isn't specific enough.</Typography>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Try make your outcome a short goal.</Typography>
          </Container>
        }

        {secondPhaseStatus == 1 &&
          <Container>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Time to make our outcome <b>M</b>easurable.</Typography>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Great measurements are an amount of something you can do.</Typography>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>"Kilograms lost", "Videos uploaded" or "3 Pointers in a row"</Typography>
          </Container>
        }
        {(actionMode == "update" || secondPhaseStatus == 1 || secondPhaseStatus == 2) &&
          <Container>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>My measurement is...
              <TextField
                name="measureable_type"
                onChange={handleGoalChange}
                value={formGoalValues.measureable_type}
                onBlur={handleSecondPhase}
                sx={{ flex: 1 }}
              />
            </Typography>

          </Container>
        }
        {(actionMode == "update" || secondPhaseStatus == 2) &&
          <Container>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>To be proud of the outcome, I will achieve
              <TextField
                type="number"
                name="measurement_count"
                onChange={handleGoalChange}
                onBlur={handleThirdPhase}
                value={formGoalValues.measurement_count}
                sx={{ flex: 1 }}
              />
              {formGoalValues.measureable_type}
            </Typography>
          </Container>
        }

        {thirdPhaseStatus == 1 &&
          <Container>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>It's time for <b>T</b>ime (ha) and <b>A</b>chievability</Typography>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Goals are achieved, or failed, purely based on the deadline you set.</Typography>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Losing 10kg in a day won't succeed, but losing it in a year likely will.</Typography>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Or even better, losing 1kg this month.</Typography>
          </Container>
        }

        {(actionMode == "update" || thirdPhaseStatus == 1 || thirdPhaseStatus == 2 || thirdPhaseStatus == 3) &&
          <Container>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>My deadline will be...
              <DatePicker
                label="Goal End Date"
                onChange={(value) => handleDateChange("end_date_epoch", value?.toDate())}
                onAccept={handleThirdPhase}
                value={dayjs(formGoalValues.end_date_epoch)}
              />
            </Typography>
          </Container>
        }

        {thirdPhaseStatus == 2 &&
          <Container>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Deadlines should be within the range of 1 week, to 3 months away.</Typography>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Try and shorten your deadline, 24kg in a year can be 2kg this month.</Typography>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>You can always set the same goal next month too.</Typography>
          </Container>
        }

        {fourthPhaseStatus == 1 &&
          <Container>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Time to make sure your goal is <b>A</b>chievable</Typography>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>How much leeway do you have? If you miss a day, will you fail your goal?</Typography>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Is success based on external factors, like a competition judge, or your genetics?</Typography>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Is your goal actually possible? Losing 10kg by tomorrow is an example of impossibility.</Typography>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Write below why, assuming you aren't hit by a meteor tomorrow, you are guaranteed to succeed.</Typography>
          </Container>
        }
        {(actionMode == "update" || fourthPhaseStatus == 1 || fourthPhaseStatus == 2 || fourthPhaseStatus == 3) &&
          <Container>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>
              I am guaranteed to succeed at this because...
              <TextareaAutosize
                placeholder="Achievable"
                name="achievable"
                value={formGoalValues.achievable}
                onChange={handleGoalChange}
                onBlur={handleFourthPhase}
                style={{ width: '70%' }}
              />
            </Typography>
          </Container>
        }
        {fourthPhaseStatus == 2 &&
          <Container>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>
              I'm not sure your reasoning is detailed enough to guarantee success. Write as if you're giving yourself zero chance of failure.
            </Typography>
          </Container>

        }
        {hasFieldsUpdated && fourthPhaseStatus == 3 &&
          <Container>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>
              Congrats! You've set a goal that has a much higher chance of success!
            </Typography>
            <Button type="submit" variant="contained" disabled={!hasFieldsUpdated}>Save your goal</Button>
          </Container>
        }

      </Box>
      <Stack sx={{ gap: "1rem", marginTop: "1rem" }}>
        {!addProgress && actionMode == "update" &&
          <Card sx={{ width: "100%", textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: "100%" }} onClick={() => setAddProgress(!addProgress)}>
            <CardActionArea sx={{ height: "100%" }}>
              <CardContent>
                <AddCircleOutlineIcon style={{ fontSize: 60, color: 'gray', height: "100%" }} />
                <Typography variant="h5" component="div">
                  Add New Progress
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        }
        {addProgress && actionMode == "update" &&
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box component="form" onSubmit={handleUpdateSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextareaAutosize
                minRows={4}
                placeholder="Progress Notes"
                name="update_text"
                value={formUpdateValues.update_text}
                onChange={handleUpdateChange}
                style={{ width: '100%', padding: '10px' }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <InputLabel htmlFor="update_measurement">Measurement Count</InputLabel>

                <TextField
                  id="update_measurement"
                  type="number"
                  name="update_measurement"
                  onChange={handleUpdateChange}
                  value={formUpdateValues.update_measurement}
                  sx={{ flex: 1 }}
                />
              </Box>

              <Button type="submit" variant="contained">Submit New Update</Button>
            </Box>
          </LocalizationProvider>
        }

        {updates && updates.map((update) => (
          <Card key={update.update_date_epoch} sx={{ width: "100%", textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: "100%" }}>
            <CardActionArea sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {update.update_date_epoch}
                </Typography>
                <Typography variant="h5" component="div">
                  {update.update_measurement}
                </Typography>
                <Typography variant="h5" component="div">
                  {update.update_text}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </LocalizationProvider>
  )
}

export default Goal;
