import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MyData from './pages/MyData';
import Breadcrumbs from '@mui/material/Breadcrumbs';

function App() {
  return (
    <Router>
      {/* <Breadcrumbs sx={{ p: 2 }}>
        <Link to="/">Dashboard</Link>
        <Link to="/mydata">MyData</Link>
      </Breadcrumbs> */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/mydata" element={<MyData />} />
      </Routes>
    </Router>
  );
}

export default App;