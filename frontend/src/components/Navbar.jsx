import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#7D5A94] text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold" color='black'>Community Event Planner</Link>
      <div>
        {user ? (
          <>
            <Link to="/Events" className="mr-4">New</Link>
            <Link to="/ViewEvent" className="mr-4">List</Link>
            <Link to="/profile" className="mr-4">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-400 px-4 py-2 rounded-2xl hover:bg-red-700"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link
              to="/register"
              className="bg-blue-400 px-4 py-2 rounded hover:bg-blue-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
