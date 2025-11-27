import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import storyService from '../services/storyService';
import Navbar from '../components/common/Navbar';
import './StoryList.css';

const StoryList = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState('all');

  useEffect(() => {
    fetchStories();
  }, [theme]);

  const fetchStories = async (searchTerm = '') => {
    try {
      setLoading(true);
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (theme !== 'all') filters.theme = theme;
      
      const data = await storyService.getStories(filters);
      const storiesArray = data.data || [];
      setStories(storiesArray);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des histoires');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStories(search);
  };

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="container">
          <div className="page-header">
            <h1>📚 Bibliothèque d'Aventures</h1>
            <p>Explorez notre collection d'histoires médiévales interactives</p>
          </div>

          {/* Filters */}
          <div className="story-filters">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="🔍 Rechercher une histoire..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="btn btn-primary">
                Rechercher
              </button>
            </form>

            <div className="theme-filters">
              <button
                className={`theme-btn ${theme === 'all' ? 'active' : ''}`}
                onClick={() => setTheme('all')}
              >
                Tous
              </button>
              <button
                className={`theme-btn ${theme === 'fantasy' ? 'active' : ''}`}
                onClick={() => setTheme('fantasy')}
              >
                🧙 Fantasy
              </button>
              <button
                className={`theme-btn ${theme === 'medieval' ? 'active' : ''}`}
                onClick={() => setTheme('medieval')}
              >
                ⚔️ Médiéval
              </button>
              <button
                className={`theme-btn ${theme === 'horror' ? 'active' : ''}`}
                onClick={() => setTheme('horror')}
              >
                👻 Horreur
              </button>
              <button
                className={`theme-btn ${theme === 'adventure' ? 'active' : ''}`}
                onClick={() => setTheme('adventure')}
              >
                🗺️ Aventure
              </button>
            </div>
          </div>

          {/* Stories Grid */}
          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="loader"></div>
          ) : stories.length === 0 ? (
            <div className="empty-state card">
              <p className="empty-icon">📖</p>
              <h3>Aucune histoire trouvée</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="stories-grid">
              {stories.map((story) => (
                <div key={story._id} className="story-card">
                  <Link to={`/stories/${story._id}`} className="story-card-link">
                    <div className="story-cover">
                      {story.coverImage ? (
                        <img
                          src={`http://localhost:5000${story.coverImage}`}
                          alt={story.title}
                        />
                      ) : (
                        <div className="story-cover-placeholder">
                          <span className="cover-icon">📜</span>
                        </div>
                      )}
                    </div>

                    <div className="story-content">
                      <h3 className="story-title">{story.title}</h3>
                      
                      <p className="story-description">
                        {story.description?.substring(0, 150)}
                        {story.description?.length > 150 ? '...' : ''}
                      </p>

                      <div className="story-meta">
                        <span className="story-author">
                          ✍️ {story.author?.username || 'Anonyme'}
                        </span>
                        <span className="story-theme">
                          {getThemeIcon(story.theme)} {story.theme}
                        </span>
                      </div>

                      <div className="story-stats">
                        <span>⭐ {story.averageRating?.toFixed(1) || 'N/A'}</span>
                        <span>🎮 {story.totalPlays || 0} parties</span>
                        <span>✅ {story.totalCompletions || 0} fins</span>
                      </div>

                      {story.tags && story.tags.length > 0 && (
                        <div className="story-tags">
                          {story.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
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

export default StoryList;
