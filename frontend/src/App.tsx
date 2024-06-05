import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './Pages/Landing';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Create from './Pages/Create';
import Update from './Pages/Update';

function App() {
  document.title = "WLR Coffee"
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/create" element={<Create />} />
        <Route path="/dashboard/update" element={<Update />} />
      </Routes>
    </Router>
  );
}

export default App;
