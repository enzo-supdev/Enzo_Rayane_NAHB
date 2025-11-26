import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🎭 NAHB
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/stories" className="navbar-link">
                Histoires
              </Link>

              {(user?.role === 'author' || user?.role === 'admin') && (
                <>
                  <Link to="/dashboard" className="navbar-link">
                    Dashboard
                  </Link>
                  <Link to="/stories/create" className="navbar-link">
                    Créer une histoire
                  </Link>
                </>
              )}

              {user?.role === 'admin' && (
                <Link to="/admin" className="navbar-link">
                  Admin
                </Link>
              )}

              <div className="navbar-user">
                <span className="navbar-username">{user?.pseudo}</span>
                <button onClick={handleLogout} className="navbar-logout">
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Connexion
              </Link>
              <Link to="/register" className="navbar-link navbar-link-register">
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;