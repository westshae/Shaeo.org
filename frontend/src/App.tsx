import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Pages/Landing';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Goal from "./Pages/Goal"
import { ThemeProvider } from '@emotion/react';
import { theme } from './Components/Theme';
import { Box, CssBaseline } from '@mui/material';
import GoalSetting from './Pages/Resources/GoalSetting';
import Upgrade from './Pages/Upgrade';
import { Helmet } from 'react-helmet';
function App() {
  document.title = "Shaeo.org"

  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>My Title</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>

      <CssBaseline />
      <Box sx={{ mx: "20%", my: "1rem" }}>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/:action/:goal_id" element={<Goal />} />
            <Route path="/dashboard/:action" element={<Goal />} />
            <Route path="/resources/goalsetting" element={<GoalSetting />} />
            <Route path="/upgrade" element={<Upgrade />} />
          </Routes>
        </Router>
      </Box>

    </ThemeProvider>

  );
}

export default App;
