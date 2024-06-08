import { Box, FormControl, InputLabel, Select, MenuItem, TextField, TextareaAutosize, Button } from "@mui/material"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { createClient, Session } from "@supabase/supabase-js"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { CreateGoalInterface, GetGoalInterface } from "../Components/Interfaces"
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs"
import { addUserGoal, getUserGoal, updateUserGoal } from "../Components/Api"


const supabase = createClient('https://teuvryyebtvpsbdghdxa.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRldXZyeXllYnR2cHNiZGdoZHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc1NDc5ODAsImV4cCI6MjAzMzEyMzk4MH0.7R6tDYRLEkpBbLEZkPVq0_0_uDYNmfeCrYZ53I0ZwBU')


function Update() {
    const { goal_id } = useParams();

  const [session, setSession] = useState<Session | null>(null)

  const [formValues, setFormValues] = useState<CreateGoalInterface>({
    category_id: 0,
    start_date_epoch: 0,
    end_date_epoch: 0,
    outcome: '',
    measureable_type: '',
    measurement_count: 0,
    achievable: '',
    update_ids: [],
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

            setFormValues(prevFormValues => ({
                ...prevFormValues,
                achievable: data.achievable,
                category_id: data.category_id,
                end_date_epoch: data.end_date_epoch,
                measureable_type: data.measureable_type,
                measurement_count: data.measurement_count,
                outcome: data.outcome,
                start_date_epoch: data.start_date_epoch,
                update_ids: data.update_ids
            }));
        });
    }
}, [session])

  const handleChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleDateChange = (name: string, value: Date | undefined) => {
    const newValue = value ? value.getTime() : null;
    setFormValues({
      ...formValues,
      [name]: newValue,
    });
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // addUserGoal(session, formValues)
    if(goal_id){
        updateUserGoal(session, parseInt(goal_id), formValues)
        navigate("/dashboard")    
    }
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <h1>Update</h1>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            name="category_id"
            value={formValues.category_id}
            onChange={handleChange}
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
          value={dayjs(formValues.end_date_epoch)}
        />

        <TextareaAutosize
          minRows={4}
          placeholder="Outcome"
          name="outcome"
          value={formValues.outcome}
          onChange={handleChange}
          style={{ width: '100%', padding: '10px' }}
        />

        <Box sx={{ display: 'flex', gap: 2 }}>
        <InputLabel htmlFor="measurement-count">Measurement Count</InputLabel>

          <TextField
            id="measurement-count"
            type="number"
            name="measurement_count"
            onChange={handleChange}
            value={formValues.measurement_count}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Measurable Type"
            name="measureable_type"
            onChange={handleChange}
            value={formValues.measureable_type}
            sx={{ flex: 1 }}
          />
        </Box>

        <TextareaAutosize
          minRows={4}
          placeholder="Achievable"
          name="achievable"
          onChange={handleChange}
          value={formValues.achievable}
          style={{ width: '100%', padding: '10px' }}
        />

        <Button type="submit" variant="contained">Submit</Button>
      </Box>
    </LocalizationProvider>

  )
}

export default Update;
