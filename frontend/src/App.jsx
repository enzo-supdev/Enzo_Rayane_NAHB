import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StoryList from './pages/StoryList';
import StoryDetails from './pages/StoryDetails';
import StoryReader from './pages/StoryReader';

// Author Pages
import AuthorDashboard from './pages/AuthorDashboard';
import StoryCreate from './pages/StoryCreate';
import StoryEdit from './pages/StoryEdit';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';

// User Profile Pages
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/stories" element={<StoryList />} />
            <Route path="/stories/:id" element={<StoryDetails />} />

            {/* Protected Routes - Game */}
            <Route
              path="/play/:gameId"
              element={
                <ProtectedRoute>
                  <StoryReader />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - User Profile */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Author */}
            <Route
              path="/author/dashboard"
              element={
                <ProtectedRoute requireAuthor>
                  <AuthorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/author/create"
              element={
                <ProtectedRoute requireAuthor>
                  <StoryCreate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/author/edit/:id"
              element={
                <ProtectedRoute requireAuthor>
                  <StoryEdit />
                </ProtectedRoute>
              }
            />

            <Route
              path="/author/stats/:id"
              element={
                <ProtectedRoute requireAuthor>
                  <div className="container" style={{ padding: '2rem' }}>
                    <h1>📊 Statistiques de l'Histoire</h1>
                    <p>Statistiques détaillées en construction...</p>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
