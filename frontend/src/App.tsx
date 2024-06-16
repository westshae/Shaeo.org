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
const updateMeta = () => {
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", "This is the new description");
  } else {
    const newMetaDescription = document.createElement('meta');
    newMetaDescription.name = "description";
    newMetaDescription.content = "This is the new description";
    document.head.appendChild(newMetaDescription);
  }

}
function App() {
  document.title = "Shaeo.org"
  const metaContent = document.querySelector('meta[name="content"]')?.setAttribute("content", "This is content")
  const metaContentTest = document.querySelector('meta[name="description"]')?.setAttribute("content", "This is description")

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
            <Route path="/resources/goalsetting" element={<GoalSetting />} />
            <Route path="/upgrade" element={<Upgrade/>}/>
          </Routes>
        </Router>
      </Box>

    </ThemeProvider>

  );
}

export default App;
