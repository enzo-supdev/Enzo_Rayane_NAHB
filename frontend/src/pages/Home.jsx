import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import './Home.css';

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home-container">
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title glow-title">
                🏰 Not Another Hero's Book
              </h1>
              <p className="hero-subtitle">
                Écrivez ou vivez des aventures médiévales interactives
              </p>
              <p className="hero-description">
                Plongez dans des histoires dont vous êtes le héros, où chaque choix façonne votre destin. 
                Lancez les dés, explorez des chemins multiples et découvrez des fins épiques !
              </p>
              <div className="hero-buttons">
                <Link to="/stories" className="btn btn-primary btn-large">
                  ⚔️ Explorer les Histoires
                </Link>
                <Link to="/register" className="btn btn-secondary btn-large">
                  ✍️ Devenir Auteur
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="container">
            <h2 className="section-title">⚜️ Caractéristiques</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎲</div>
                <h3>Système de Dés</h3>
                <p>
                  Lancez les dés pour déterminer l'issue de vos actions. 
                  D4, D6, D8, D10, D12 et D20 disponibles !
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🗺️</div>
                <h3>Choix Multiples</h3>
                <p>
                  Chaque décision compte. Explorez des chemins différents 
                  et découvrez toutes les fins possibles.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🖼️</div>
                <h3>Images Interactives</h3>
                <p>
                  Cliquez sur des zones interactives dans les illustrations 
                  pour débloquer des passages secrets.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📖</div>
                <h3>Création d'Histoires</h3>
                <p>
                  Devenez auteur et créez vos propres aventures avec un 
                  éditeur puissant et intuitif.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Statistiques</h3>
                <p>
                  Suivez vos parcours, débloquez des fins et comparez 
                  vos choix avec d'autres joueurs.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">⭐</div>
                <h3>Notation & Avis</h3>
                <p>
                  Partagez votre avis sur les histoires et aidez les auteurs 
                  à s'améliorer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta">
          <div className="container">
            <div className="cta-content card">
              <h2>🎭 Prêt pour l'Aventure ?</h2>
              <p>
                Rejoignez notre communauté de conteurs et d'aventuriers. 
                Votre légende commence ici !
              </p>
              <Link to="/register" className="btn btn-primary btn-large">
                S'inscrire Maintenant
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <p>© 2025 NAHB - Not Another Hero's Book | Tous droits réservés</p>
            <p className="footer-tagline">
              "Dans chaque livre, une nouvelle aventure. Dans chaque choix, un nouveau destin."
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
