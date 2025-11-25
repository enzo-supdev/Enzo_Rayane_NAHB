import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StoryList from './pages/StoryList';
import StoryReader from './pages/StoryReader';
import StoryCreate from './pages/StoryCreate';
import AuthorDashboard from './pages/AuthorDashboard';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Routes protégées */}
          <Route
            path="/stories"
            element={
              <ProtectedRoute>
                <StoryList />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/stories/:id/read"
            element={
              <ProtectedRoute>
                <StoryReader />
              </ProtectedRoute>
            }
          />
          
          {/* Routes auteur */}
          <Route
            path="/author/dashboard"
            element={
              <ProtectedRoute roles={['author', 'admin']}>
                <AuthorDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/stories/create"
            element={
              <ProtectedRoute roles={['author', 'admin']}>
                <StoryCreate />
              </ProtectedRoute>
            }
          />
          
          {/* Erreurs */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;