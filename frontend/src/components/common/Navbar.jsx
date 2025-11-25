import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🎭 NAHB
        </Link>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/stories" className="nav-link">
                Histoires
              </Link>

              {(user?.role === 'author' || user?.role === 'admin') && (
                <>
                  <Link to="/author/dashboard" className="nav-link">
                    Mes histoires
                  </Link>
                  <Link to="/stories/create" className="nav-link">
                    Créer
                  </Link>
                </>
              )}

              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="nav-link">
                  Admin
                </Link>
              )}

              <div className="navbar-user">
                <span className="user-name">{user?.pseudo}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Connexion
              </Link>
              <Link to="/register" className="btn-primary">
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