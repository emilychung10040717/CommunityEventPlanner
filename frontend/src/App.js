import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';      //update
import Events from './pages/Events';
import ViewEvent from './pages/ViewEvent';
import EditEvent from './components/EditEvent';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/events" element={<Events />} />
        <Route path="/" element={<Login />} />
        <Route path="/viewevent" element={<ViewEvent/>} />
        <Route path="/edit-event/:id" element={<EditEvent />} />
      </Routes>
    </Router>
  );
}

export default App;
