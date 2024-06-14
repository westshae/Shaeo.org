import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Pages/Landing';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Goal from "./Pages/Goal"
import { ThemeProvider } from '@emotion/react';
import { theme } from './Components/Theme';
import { Box, CssBaseline } from '@mui/material';
import Outcomes from './Pages/Resources/Outcomes';
import Measurements from './Pages/Resources/Measurements';
import Deadlines from './Pages/Resources/Deadlines';
import Achievability from './Pages/Resources/Achievability';

function App() {
  document.title = "WLR Coffee"
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{mx:"20%", my: "1rem"}}>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/:action/:goal_id" element={<Goal />} />
            <Route path="/dashboard/:action" element={<Goal />} />
            <Route path="/resources/outcomes" element={<Outcomes />} />
            <Route path="/resources/measurements" element={<Measurements />} />
            <Route path="/resources/deadlines" element={<Deadlines />} />
            <Route path="/resources/achievability" element={<Achievability />} />

          </Routes>
        </Router>
      </Box>

    </ThemeProvider>

  );
}

export default App;
