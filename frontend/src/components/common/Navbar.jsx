import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthor, isAdmin } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            <span className="logo-icon">🏰</span>
            <span className="logo-text">NAHB</span>
          </Link>

          <div className="navbar-links">
            <Link to="/stories" className="nav-link">
              📚 Histoires
            </Link>

            {user ? (
              <>
                {isAuthor && (
                  <Link to="/author/dashboard" className="nav-link">
                    ✍️ Mes Créations
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" className="nav-link">
                    ⚔️ Administration
                  </Link>
                )}
                <div className="navbar-user">
                  <span className="user-name">⚜️ {user.username}</span>
                  <button onClick={logout} className="btn-logout">
                    Déconnexion
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Connexion
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
