import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>🎭 NAHB</h1>
        <p className="subtitle">Not Another Hero's Book</p>
        <p className="description">
          Plongez dans des histoires interactives où chaque choix compte
        </p>
      </header>

      <div className="home-actions">
        {isAuthenticated ? (
          <>
            <Link to="/stories" className="btn-primary">
              Explorer les histoires
            </Link>
            {(user?.role === 'author' || user?.role === 'admin') && (
              <Link to="/author/dashboard" className="btn-secondary">
                Mon espace auteur
              </Link>
            )}
          </>
        ) : (
          <>
            <Link to="/register" className="btn-primary">
              Commencer l'aventure
            </Link>
            <Link to="/login" className="btn-secondary">
              Se connecter
            </Link>
          </>
        )}
      </div>

      <div className="features">
        <div className="feature">
          <h3>📚 Histoires interactives</h3>
          <p>Découvrez des récits où vos choix façonnent l'histoire</p>
        </div>
        <div className="feature">
          <h3>✍️ Devenez auteur</h3>
          <p>Créez vos propres histoires et partagez-les</p>
        </div>
        <div className="feature">
          <h3>📊 Suivez vos progrès</h3>
          <p>Collectionnez les fins et consultez vos statistiques</p>
        </div>
      </div>
    </div>
  );
};

export default Home;