import { Box, FormControl, InputLabel, Select, MenuItem, TextField, TextareaAutosize, Button, Card, CardActionArea, CardContent, Grid, Typography, Toolbar, Stack } from "@mui/material"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { createClient, Session } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { CreateGoalInterface, CreateUpdateInterface, GetGoalInterface } from "../Components/Interfaces"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs"
import { addUserGoal, addUserUpdates, getGoalUpdates, getUserGoal, updateUserGoal } from "../Components/Api"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


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
    start_date_epoch: 0,
    end_date_epoch: 0,
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
    update_date_epoch: dayjs().unix(),
    update_measurement: 0,
    update_text: '',
  });

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
        navigate("/")
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if(hasInitOnce) return;
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
    if (goal_id) {
      if (actionMode == "update") {
        updateUserGoal(session, parseInt(goal_id), formGoalValues)
        navigate("/dashboard")
      } else if (actionMode == "create") {
        addUserGoal(session, formGoalValues)
        navigate("/dashboard")
      }
    } else {
      console.error("error: no goal_id to update")
    }
  };

  const handleUpdateSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (goal_id && actionMode == "update") {
      addUserUpdates(session, formUpdateValues)
      setUpdates([...updates, formUpdateValues])
      setAddProgress(false)
      setFormUpdateValues({
        goal_id: parseInt(goal_id!),
        update_date_epoch: dayjs().unix(),
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
      start_date_epoch: 0,
      end_date_epoch: 0,
      outcome: '',
      measureable_type: '',
      measurement_count: 0,
      achievable: '',
      update_ids: [],
    })
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'left' }}>
        <Button onClick={() => navigate("/")}><Typography>ProjectQ1</Typography></Button>
        <Button onClick={() => navigate("/dashboard")}><Typography>Dashboard</Typography></Button>
        <Button onClick={async () => await supabase.auth.signOut()}><Typography>Sign Out</Typography></Button>
        {actionMode == "update" && hasFieldsUpdated &&
          <Button onClick={handleUpdateMode}><Typography>Reset Fields</Typography></Button>

        }
      </Toolbar>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <DatePicker
          label="Goal End Date"
          onChange={(value) => handleDateChange("end_date_epoch", value?.toDate())}
          value={dayjs(formGoalValues.end_date_epoch)}
        />

        <TextareaAutosize
          minRows={4}
          placeholder="Outcome"
          name="outcome"
          value={formGoalValues.outcome}
          onChange={handleGoalChange}
          style={{ width: '100%', padding: '10px' }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            type="number"
            label="Measurement Count"
            name="measurement_count"
            onChange={handleGoalChange}
            value={formGoalValues.measurement_count}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Measurable Type"
            name="measureable_type"
            onChange={handleGoalChange}
            value={formGoalValues.measureable_type}
            sx={{ flex: 1 }}
          />
        </Box>

        <TextareaAutosize
          minRows={4}
          placeholder="Achievable"
          name="achievable"
          onChange={handleGoalChange}
          value={formGoalValues.achievable}
          style={{ width: '100%', padding: '10px' }}
        />
        {hasFieldsUpdated &&
          <Button type="submit" variant="contained" disabled={!hasFieldsUpdated}>Submit</Button>
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
