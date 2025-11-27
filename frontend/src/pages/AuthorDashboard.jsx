import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import storyService from '../services/storyService';
import statisticsService from '../services/statisticsService';
import Navbar from '../components/common/Navbar';
import './AuthorDashboard.css';

const AuthorDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [stories, setStories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && !authLoading) {
      fetchData();
    }
  }, [user, authLoading]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [storiesData, statsData] = await Promise.all([
        storyService.getMyStories(),
        statisticsService.getAuthorStatistics(user.id),
      ]);
      setStories(storiesData.data || []);
      setStats(statsData.data);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette histoire ?')) {
      return;
    }

    try {
      await storyService.deleteStory(storyId);
      setStories(stories.filter((s) => s._id !== storyId));
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression');
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="loader"></div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="container">
            <div className="alert alert-error">Vous devez être connecté</div>
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
          <div className="dashboard-header">
            <h1>✍️ Mon Atelier d'Auteur</h1>
            <Link to="/author/create" className="btn btn-primary">
              ➕ Nouvelle Histoire
            </Link>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Statistics Overview */}
          {stats && (
            <div className="stats-overview">
              <div className="stat-card">
                <div className="stat-icon">📚</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalStories || 0}</div>
                  <div className="stat-label">Histoires</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🎮</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalPlays || 0}</div>
                  <div className="stat-label">Parties Jouées</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalCompletions || 0}</div>
                  <div className="stat-label">Complétées</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.averageRating?.toFixed(1) || 'N/A'}</div>
                  <div className="stat-label">Note Moyenne</div>
                </div>
              </div>
            </div>
          )}

          {/* Stories List */}
          <div className="stories-section">
            <h2>📖 Mes Histoires</h2>

            {stories.length === 0 ? (
              <div className="empty-state card">
                <p className="empty-icon">✍️</p>
                <h3>Aucune histoire créée</h3>
                <p>Commencez votre première aventure !</p>
                <Link to="/author/create" className="btn btn-primary">
                  Créer une Histoire
                </Link>
              </div>
            ) : (
              <div className="author-stories-grid">
                {stories.map((story) => (
                  <div key={story._id} className="author-story-card card-dark">
                    <div className="story-card-header">
                      <h3>{story.title}</h3>
                      <span className={`status-badge status-${story.status}`}>
                        {story.status === 'published' ? '✅ Publié' : '📝 Brouillon'}
                      </span>
                    </div>

                    <p className="story-description-short">
                      {story.description?.substring(0, 100)}
                      {story.description?.length > 100 ? '...' : ''}
                    </p>

                    <div className="story-mini-stats">
                      <span>🎮 {story.totalPlays || 0}</span>
                      <span>✅ {story.totalCompletions || 0}</span>
                      <span>⭐ {story.averageRating?.toFixed(1) || 'N/A'}</span>
                      <span>📖 {story.pages?.length || 0} pages</span>
                    </div>

                    <div className="story-actions">
                      <Link
                        to={`/author/edit/${story._id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        ✏️ Éditer
                      </Link>
                      <Link
                        to={`/author/stats/${story._id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        📊 Stats
                      </Link>
                      <Link
                        to={`/stories/${story._id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        👁️ Voir
                      </Link>
                      <button
                        onClick={() => handleDeleteStory(story._id)}
                        className="btn btn-danger btn-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthorDashboard;
