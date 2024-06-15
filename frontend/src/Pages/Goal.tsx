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
import ResourceMenu from "../Components/ResourceMenu"
import getAuth from "../Components/Authentication"

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

  const areGoalFormValuesEmpty = () => {
    let isEmpty = false;
    if (formGoalValues.achievable == '') isEmpty = true;
    if (formGoalValues.outcome == '') isEmpty = true;
    if (formGoalValues.measureable_type == '') isEmpty = true;
    if (formGoalValues.measurement_count == 0) isEmpty = true;
    return isEmpty;
  }

  const areUpdateFormValuesEmpty = () => {
    let isEmpty = false;
    if (formUpdateValues.update_measurement == 0) isEmpty = true;
    if (formUpdateValues.update_text == '') isEmpty = true;
    return isEmpty;
  }


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
      setSecondPhaseStatus(1)
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
          <ResourceMenu />
          <Button onClick={() => navigate("/dashboard")}><Typography variant="h6" sx={{ textTransform: 'none' }}>Dashboard</Typography></Button>
          <Button onClick={async () => await getAuth().auth.signOut()}><Typography variant="h6" sx={{ textTransform: 'none' }}>Sign Out</Typography></Button>
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
        <Container>
          <Typography variant="h5" sx={{ textTransform: 'none' }}>
            I want to ...
            <TextField
              placeholder="Outcome"
              name="outcome"
              value={formGoalValues.outcome}
              onChange={handleGoalChange}
              onBlur={handleFirstPhase}
              style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}
              variant="standard"
            />
            <Button>Confirm</Button>
          </Typography>
        </Container>
        {firstPhaseStatus == 1 &&
          <Container>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Based on the length of your message, your goal isn't specific enough.</Typography>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Try make your outcome a short goal.</Typography>
          </Container>
        }

        {secondPhaseStatus == 1 &&
          <Container>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Time to make our outcome Measurable.</Typography>
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
                sx={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}
                variant="standard"
              />
              <Button>Confirm</Button>
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
                sx={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}
                variant="standard"
              />
              {formGoalValues.measureable_type}
              <Button>Confirm</Button>
            </Typography>
          </Container>
        }

        {thirdPhaseStatus == 1 &&
          <Container>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>It's time for Time (ha) and Achievability</Typography>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Goals are achieved, or failed, purely based on the deadline you set.</Typography>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Losing 10kg in a day won't succeed, but losing it in a year likely will.</Typography>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Or even better, losing 1kg this month.</Typography>
          </Container>
        }

        {(actionMode == "update" || thirdPhaseStatus == 1 || thirdPhaseStatus == 2 || thirdPhaseStatus == 3) &&
          <Container>
            <Typography variant="h5" sx={{ textTransform: 'none' }}>My deadline will be...
              <DatePicker
              sx={{padding: 'none'}}
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
            <Typography variant="h5" sx={{ textTransform: 'none' }}>Time to make sure your goal is Achievable</Typography>
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
              <TextField
                multiline
                placeholder="Achievable"
                name="achievable"
                value={formGoalValues.achievable}
                onChange={handleGoalChange}
                onBlur={handleFourthPhase}
                style={{ width: '100%' }}
                variant="standard"
              />
              <Button>Confirm</Button>

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
        {!areGoalFormValuesEmpty() && hasFieldsUpdated && fourthPhaseStatus == 3 &&
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
                <AddCircleOutlineIcon color="primary" style={{ fontSize: 60, height: "100%" }} />
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
              <Typography variant="h5" sx={{ textTransform: 'none' }}>
                My progress is...
                <TextareaAutosize
                  placeholder="Progress Notes"
                  name="update_text"
                  value={formUpdateValues.update_text}
                  onChange={handleUpdateChange}
                  style={{ width: '60%' }}
                />
              </Typography>
              <Typography variant="h5" sx={{ textTransform: 'none' }}>
                I've managed to complete
                <TextField
                  type="number"
                  name="update_measurement"
                  onChange={handleUpdateChange}
                  value={formUpdateValues.update_measurement}
                  sx={{ width: '60%' }}
                />
                {goal.measureable_type} so far
              </Typography>

              {!areUpdateFormValuesEmpty() &&
                <Button type="submit" variant="contained">Submit New Update</Button>
              }

            </Box>
          </LocalizationProvider>
        }

        {updates && updates.map((update) => (
          <Card key={update.update_date_epoch} sx={{ width: "100%", textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: "100%" }}>
            <CardContent>
              <Typography variant="h5" component="div" >
                On {' '}
                <Typography variant="h5" component="span" color="primary">
                  {dayjs(update.update_date_epoch).format("dddd DD/MM/YY")}
                </Typography>
                {' '}I managed to achieve{' '}
                <Typography variant="h5" component="span" color="primary">
                  {update.update_measurement} {goal.measureable_type}
                </Typography>
              </Typography>
              <Typography variant="h5" component="div">
                Notes: "{update.update_text}"
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </LocalizationProvider>
  )
}

export default Goal;
