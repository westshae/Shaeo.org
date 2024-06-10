import { Box, FormControl, InputLabel, Select, MenuItem, TextField, TextareaAutosize, Button, Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { createClient, Session } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { CreateGoalInterface, CreateUpdateInterface, GetGoalInterface } from "../Components/Interfaces"
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs"
import { addUserGoal, addUserUpdates, getGoalUpdates, getUserGoal, updateUserGoal } from "../Components/Api"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRldXZyeXllYnR2cHNiZGdoZHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc1NDc5ODAsImV4cCI6MjAzMzEyMzk4MH0.7R6tDYRLEkpBbLEZkPVq0_0_uDYNmfeCrYZ53I0ZwBU')


function Goal() {
  const { goal_id } = useParams();

  const [session, setSession] = useState<Session | null>(null)
  const [updateMode, setUpdateMode] = useState<boolean>(false)
  const [createMode, setCreateMode] = useState<boolean>(false)
  const [viewMode, setViewMode] = useState<boolean>(true);
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
    goal_id: parseInt(goal_id!),
    update_date_epoch: dayjs().unix(),
    update_measurement: 0,
    update_text: '',
  });

  const navigate = useNavigate()

  const categories = [
    { id: 0, name: 'None' },
    { id: 1, name: 'Gym' },
    { id: 2, name: 'Business' },
    { id: 3, name: 'Diet' },
  ];


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
    if (session && goal_id) {
      getUserGoal(session, parseInt(goal_id)).then((result) => {
        const data = result.data.data;
        setGoal(data);
      });
      getGoalUpdates(session, parseInt(goal_id)).then((result) => {
        const data = result.data.data;
        setUpdates(data);
        console.log(data);
      })
    }
  }, [session])

  useEffect(() => {
    handleViewMode();
  }, [goal])


  const handleGoalChange = (event: { target: { name: any; value: any } }) => {
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
      if (updateMode) {
        updateUserGoal(session, parseInt(goal_id), formGoalValues)
        navigate("/dashboard")
      } else if (createMode) {
        addUserGoal(session, formGoalValues)
        navigate("/dashboard")
      }
    } else {
      console.error("error: no goal_id to update")
    }
  };

  const resetFormValues = () => {
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

  const setFormGoalValuesFromGoal = () => {
    setFormGoalValues(prevFormValues => ({
      ...prevFormValues,
      achievable: goal.achievable,
      category_id: goal.category_id,
      end_date_epoch: goal.end_date_epoch,
      measureable_type: goal.measureable_type,
      measurement_count: goal.measurement_count,
      outcome: goal.outcome,
      start_date_epoch: goal.start_date_epoch,
      update_ids: goal.update_ids
    }));
  }

  const handleUpdateSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (goal_id && viewMode) {
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
    setUpdateMode(true);
    setCreateMode(false);
    setViewMode(false)
    setFormGoalValuesFromGoal();
  }
  const handleCreateMode = () => {
    setUpdateMode(false);
    setCreateMode(true);
    setViewMode(false)
    resetFormValues();
  }
  const handleViewMode = () => {
    setUpdateMode(false);
    setCreateMode(false);
    setViewMode(true)
    setFormGoalValuesFromGoal();
  }


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Button onClick={handleUpdateMode}>Toggle Update</Button>
      <Button onClick={handleCreateMode}>Toggle Create</Button>
      <Button onClick={handleViewMode}>Toggle View</Button>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            name="category_id"
            value={formGoalValues.category_id}
            onChange={handleGoalChange}
            disabled={viewMode}
          >
            {categories.map((category: { id: any; name: any }) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <DatePicker
          label="Goal End Date"
          onChange={(value) => handleDateChange("end_date_epoch", value?.toDate())}
          value={dayjs(formGoalValues.end_date_epoch)}
          disabled={viewMode}
        />

        <TextareaAutosize
          minRows={4}
          placeholder="Outcome"
          name="outcome"
          value={formGoalValues.outcome}
          onChange={handleGoalChange}
          style={{ width: '100%', padding: '10px' }}
          disabled={viewMode}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
          <InputLabel htmlFor="measurement-count">Measurement Count</InputLabel>

          <TextField
            id="measurement-count"
            type="number"
            name="measurement_count"
            onChange={handleGoalChange}
            value={formGoalValues.measurement_count}
            sx={{ flex: 1 }}
            disabled={viewMode}
          />
          <TextField
            label="Measurable Type"
            name="measureable_type"
            onChange={handleGoalChange}
            value={formGoalValues.measureable_type}
            sx={{ flex: 1 }}
            disabled={viewMode}
          />
        </Box>

        <TextareaAutosize
          minRows={4}
          placeholder="Achievable"
          name="achievable"
          onChange={handleGoalChange}
          value={formGoalValues.achievable}
          style={{ width: '100%', padding: '10px' }}
          disabled={viewMode}
        />
        {!viewMode &&
          <Button type="submit" variant="contained" disabled={viewMode}>Submit</Button>
        }



      </Box>
      {!addProgress && viewMode &&
        <Grid item xs={6}>
          <Card sx={{ maxWidth: 500, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: "100%" }} onClick={() => setAddProgress(!addProgress)}>
            <CardActionArea sx={{ height: "100%" }}>
              <CardContent>
                <AddCircleOutlineIcon style={{ fontSize: 60, color: 'gray', height: "100%" }} />
                <Typography variant="h5" component="div">
                  Add New Progress
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

      }
      {updates.map((update) => (
                <Grid item xs={6}>
                <Card sx={{ maxWidth: 500, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: "100%" }} onClick={() => setAddProgress(!addProgress)}>
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
              </Grid>
      
      ))}

      {addProgress && viewMode &&
        <Grid item xs={6}>
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

        </Grid>

      }

    </LocalizationProvider>
  )
}

export default Goal;
