
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthProvider } from './context/AuthContext';
import { AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
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
import Reviews from './pages/Reviews';
import Students from './pages/Students';
import MyTutors from './pages/MyTutors';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';

const getDashboardPath = (role) => (role === 'admin' ? '/admin-dashboard' : '/dashboard');

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 text-gray-500">
    Loading...
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

const PublicAuthRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to={getDashboardPath(user.role)} replace />;

  return children;
};

const LandingRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to={getDashboardPath(user.role)} replace />;

  return <Home />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <Routes>
          <Route path="/" element={<PublicAuthRoute><Login /></PublicAuthRoute>} />
          <Route path="/home" element={<LandingRoute />} />
          <Route path="/login" element={<PublicAuthRoute><Login /></PublicAuthRoute>} />
          <Route path="/register" element={<PublicAuthRoute><Register /></PublicAuthRoute>} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="find-tutors" element={<FindTutors />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="messages" element={<Messages />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="students" element={<Students />} />
            <Route path="my-tutors" element={<MyTutors />} />
            <Route path="settings" element={<Settings />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="earnings" element={<Earnings />} />
            <Route path="admin-dashboard" element={<AdminDashboard />} />
            <Route path="admin-users" element={<AdminUsers />} />
          </Route>
        </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
