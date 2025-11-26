import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import storyService from '../services/storyService';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';

export default function AuthorDashboard() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, draft, published

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'AUTHOR' && user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchStories();
  }, [user, isAuthenticated, navigate]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await storyService.getMyStories();
      setStories(response.data?.stories || response.stories || []);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors du chargement de vos histoires');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (storyId) => {
    if (!window.confirm('Êtes-vous sûr ? Cette action est irréversible.')) return;

    try {
      await storyService.deleteStory(storyId);
      setStories(stories.filter(s => s.id !== storyId));
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const filteredStories = stories.filter(story => {
    if (filter === 'draft') return story.status === 'DRAFT';
    if (filter === 'published') return story.status === 'PUBLISHED';
    return true;
  });

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>👨‍✍️ Mes Histoires</h1>
          <p>Bienvenue, {user?.pseudo || 'Auteur'}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="dashboard-actions">
          <Link to="/stories/create" className="btn-primary">
            + Créer une nouvelle histoire
          </Link>
        </div>

        {/* Filtres */}
        <div className="filter-bar">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Toutes ({stories.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'draft' ? 'active' : ''}`}
            onClick={() => setFilter('draft')}
          >
            Brouillons ({stories.filter(s => s.status === 'DRAFT').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'published' ? 'active' : ''}`}
            onClick={() => setFilter('published')}
          >
            Publiées ({stories.filter(s => s.status === 'PUBLISHED').length})
          </button>
        </div>

        {loading ? (
          <div className="loading">Chargement de vos histoires...</div>
        ) : filteredStories.length === 0 ? (
          <div className="empty-state">
            <h2>Aucune histoire pour le moment</h2>
            <p>Créez votre première histoire interactive !</p>
            <Link to="/stories/create" className="btn-primary">
              Créer une histoire
            </Link>
          </div>
        ) : (
          <div className="stories-dashboard-grid">
            {filteredStories.map(story => (
              <div key={story.id} className="story-dashboard-card">
                <div className="card-header">
                  <h3>{story.title}</h3>
                  <span className={`status-badge ${story.status.toLowerCase()}`}>
                    {story.status === 'DRAFT' ? '📝 Brouillon' : '📖 Publié'}
                  </span>
                </div>

                <p className="card-description">{story.description}</p>

                <div className="card-stats">
                  <div className="stat">
                    <span className="stat-value">
                      {story.pages?.length || 0}
                    </span>
                    <span className="stat-label">Pages</span>
                  </div>
                </div>

                <div className="card-actions">
                  <Link 
                    to={`/stories/${story.id}/edit`}
                    className="btn-small btn-primary"
                  >
                    ✏️ Éditer
                  </Link>
                  {story.status === 'PUBLISHED' && (
                    <Link 
                      to={`/stories/${story.id}/stats`}
                      className="btn-small"
                    >
                      📊 Stats
                    </Link>
                  )}
                  <button 
                    className="btn-small btn-danger"
                    onClick={() => handleDelete(story.id)}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
