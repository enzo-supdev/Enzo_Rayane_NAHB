import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import storyService from '../services/storyService';
import gameService from '../services/gameService';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/common/Navbar';
import './StoryDetails.css';

const StoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startingGame, setStartingGame] = useState(false);

  useEffect(() => {
    fetchStory();
  }, [id]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const data = await storyService.getStory(id);
      setStory(data.data);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger cette histoire');
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setStartingGame(true);
      const data = await gameService.startGame(id);
      navigate(`/play/${data.data._id}`);
    } catch (err) {
      console.error(err);
      setError('Impossible de démarrer la partie');
    } finally {
      setStartingGame(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="loader"></div>
        </div>
      </>
    );
  }

  if (error || !story) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="container">
            <div className="alert alert-error">{error || 'Histoire introuvable'}</div>
            <Link to="/stories" className="btn btn-secondary">
              ← Retour aux histoires
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="container">
          <div className="story-details">
            {/* Header */}
            <div className="story-header">
              <div className="story-cover-large">
                {story.coverImage ? (
                  <img
                    src={`http://localhost:5000${story.coverImage}`}
                    alt={story.title}
                  />
                ) : (
                  <div className="story-cover-placeholder-large">
                    <span className="cover-icon-large">📜</span>
                  </div>
                )}
              </div>

              <div className="story-info">
                <h1 className="story-title-large">{story.title}</h1>

                <div className="story-meta-large">
                  <span className="meta-item">
                    ✍️ Par <strong>{story.author?.username || 'Anonyme'}</strong>
                  </span>
                  <span className="meta-item">
                    {getThemeIcon(story.theme)} {story.theme}
                  </span>
                </div>

                <div className="story-stats-large">
                  <div className="stat-item">
                    <span className="stat-value">
                      ⭐ {story.averageRating?.toFixed(1) || 'N/A'}
                    </span>
                    <span className="stat-label">Note</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">🎮 {story.totalPlays || 0}</span>
                    <span className="stat-label">Parties</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">✅ {story.totalCompletions || 0}</span>
                    <span className="stat-label">Complétées</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">📖 {story.pages?.length || 0}</span>
                    <span className="stat-label">Scènes</span>
                  </div>
                </div>

                {story.tags && story.tags.length > 0 && (
                  <div className="story-tags-large">
                    {story.tags.map((tag, idx) => (
                      <span key={idx} className="tag-large">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="story-actions">
                  <button
                    onClick={handleStartGame}
                    disabled={startingGame}
                    className="btn btn-primary btn-large"
                  >
                    {startingGame ? '⏳ Démarrage...' : '⚔️ Commencer l\'Aventure'}
                  </button>
                  <Link to="/stories" className="btn btn-secondary">
                    ← Retour
                  </Link>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="story-description-section card">
              <h2>📖 Synopsis</h2>
              <p className="story-description-full">{story.description}</p>
            </div>

            {/* Author Info */}
            {story.author && (
              <div className="author-section card">
                <h3>✍️ À propos de l'auteur</h3>
                <div className="author-info">
                  {story.author.avatar && (
                    <img
                      src={`http://localhost:5000${story.author.avatar}`}
                      alt={story.author.username}
                      className="author-avatar"
                    />
                  )}
                  <div>
                    <h4>{story.author.username}</h4>
                    {story.author.bio && <p>{story.author.bio}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const getThemeIcon = (theme) => {
  const icons = {
    fantasy: '🧙',
    medieval: '⚔️',
    horror: '👻',
    adventure: '🗺️',
    mystery: '🔍',
    scifi: '🚀',
  };
  return icons[theme] || '📖';
};

export default StoryDetails;
