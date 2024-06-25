import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Pages/Landing';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Goal from "./Pages/Goal"
import { ThemeProvider } from '@emotion/react';
import { theme } from './Components/Theme';
import { Box, CssBaseline } from '@mui/material';
import Upgrade from './Pages/Upgrade';
import Resource from './Pages/Resource';



function App() {
  const isMobile = /Mobile|Android|iP(hone|od|ad)/i.test(navigator.userAgent);
  const normalStyle = {mx: "20%", my: "1rem"}
  const mobileStyle = {mx: "0", my: "1rem"}
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={isMobile ? mobileStyle : normalStyle}>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/:action/:goal_id" element={<Goal />} />
            <Route path="/dashboard/:action" element={<Goal />} />
            <Route path="/resource" element={<Resource />} />
            <Route path="/upgrade" element={<Upgrade />} />
          </Routes>
        </Router>
      </Box>

    </ThemeProvider>

  );
}

export default App;
