import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import storyService from '../services/storyService';
import Navbar from '../components/common/Navbar';

const StoryList = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async (searchTerm = '') => {
    try {
      setLoading(true);
      const filters = searchTerm ? { search: searchTerm } : {};
      const data = await storyService.getPublishedStories(filters);
      // Parser les tags depuis JSON si nécessaire
      const storiesWithParsedTags = data.data.stories.map(story => {
        let parsedTags = [];
        
        if (story.tags) {
          if (typeof story.tags === 'string') {
            try {
              parsedTags = JSON.parse(story.tags);
            } catch (e) {
              parsedTags = [];
            }
          } else if (Array.isArray(story.tags)) {
            parsedTags = story.tags;
          }
        }
        
        return {
          ...story,
          tags: Array.isArray(parsedTags) ? parsedTags : []
        };
      });
      setStories(storiesWithParsedTags);
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
        <div className="page-header">
          <h1>📚 Histoires disponibles</h1>
          
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Rechercher une histoire..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn-primary">
              Rechercher
            </button>
          </form>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <div className="stories-grid">
            {stories.length === 0 ? (
              <p className="no-stories">Aucune histoire disponible</p>
            ) : (
              stories.map((story) => (
                <div key={story.id} className="story-card">
                  <h3>{story.title}</h3>
                  <p className="story-description">{story.description}</p>
                  
                  {story.tags && story.tags.length > 0 && (
                    <div className="story-tags">
                      {story.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="story-footer">
                    <span className="story-author">
                      Par {story.author?.pseudo || 'Anonyme'}
                    </span>
                    <Link
                      to={`/stories/${story.id}/read`}
                      className="btn-primary"
                    >
                      Lire
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default StoryList;