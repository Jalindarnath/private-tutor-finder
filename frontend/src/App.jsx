
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import FindTutors from './pages/FindTutors';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import Sessions from './pages/Sessions';
import Earnings from './pages/Earnings';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="find-tutors" element={<FindTutors />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<Settings />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="admin-users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
