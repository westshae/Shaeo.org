import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Pages/Landing';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Create from './Pages/Create';
import Update from './Pages/Update';
import View from './Pages/View';
import { ThemeProvider } from '@emotion/react';
import { theme } from './Components/Theme';
import { CssBaseline } from '@mui/material';

function App() {
  document.title = "WLR Coffee"
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/create" element={<Create />} />
          <Route path="/dashboard/update/:goal_id" element={<Update />} />
          <Route path="/dashboard/view/:goal_id" element={<View />} />
        </Routes>
      </Router>
    </ThemeProvider>

  );
}

export default App;
