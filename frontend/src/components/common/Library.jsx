import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import libraryService from '../../services/libraryService';
import './Library.css';

const Library = () => {
  const { token } = useAuth();
  const [library, setLibrary] = useState(null);
  const [activeTab, setActiveTab] = useState('inProgress');
  const [loading, setLoading] = useState(true);
  const [showCreateList, setShowCreateList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    try {
      const data = await libraryService.getMyLibrary(token);
      setLibrary(data.library);
    } catch (error) {
      console.error('Error loading library:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (storyId) => {
    try {
      await libraryService.toggleFavorite(storyId, token);
      loadLibrary();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    try {
      await libraryService.createReadingList(
        { name: newListName, description: newListDescription },
        token
      );
      setNewListName('');
      setNewListDescription('');
      setShowCreateList(false);
      loadLibrary();
    } catch (error) {
      console.error('Error creating reading list:', error);
    }
  };

  const handleDeleteList = async (listId) => {
    if (!confirm('Are you sure you want to delete this reading list?')) return;
    try {
      await libraryService.deleteReadingList(listId, token);
      loadLibrary();
    } catch (error) {
      console.error('Error deleting reading list:', error);
    }
  };

  if (loading) {
    return <div className="library-loading">Loading your library...</div>;
  }

  if (!library) {
    return <div className="library-error">Error loading library</div>;
  }

  return (
    <div className="library-container">
      <div className="library-header">
        <h2>📚 My Library</h2>
        <div className="library-stats">
          <div className="stat">
            <span className="stat-value">{library.favorites.length}</span>
            <span className="stat-label">Favorites</span>
          </div>
          <div className="stat">
            <span className="stat-value">{library.inProgress.length}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat">
            <span className="stat-value">{library.completed.length}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat">
            <span className="stat-value">{library.readingLists.length}</span>
            <span className="stat-label">Lists</span>
          </div>
        </div>
      </div>

      <div className="library-tabs">
        <button
          className={activeTab === 'inProgress' ? 'active' : ''}
          onClick={() => setActiveTab('inProgress')}
        >
          📖 In Progress ({library.inProgress.length})
        </button>
        <button
          className={activeTab === 'completed' ? 'active' : ''}
          onClick={() => setActiveTab('completed')}
        >
          ✅ Completed ({library.completed.length})
        </button>
        <button
          className={activeTab === 'favorites' ? 'active' : ''}
          onClick={() => setActiveTab('favorites')}
        >
          ❤️ Favorites ({library.favorites.length})
        </button>
        <button
          className={activeTab === 'lists' ? 'active' : ''}
          onClick={() => setActiveTab('lists')}
        >
          📋 Lists ({library.readingLists.length})
        </button>
      </div>

      <div className="library-content">
        {activeTab === 'inProgress' && (
          <div className="stories-grid">
            {library.inProgress.length === 0 ? (
              <div className="empty-state">
                <p>No stories in progress</p>
                <Link to="/stories" className="browse-btn">Browse Stories</Link>
              </div>
            ) : (
              library.inProgress.map((item) => (
                <div key={item._id} className="story-card">
                  {item.story?.coverImage && (
                    <img src={item.story.coverImage} alt={item.story.title} className="story-cover" />
                  )}
                  <div className="story-info">
                    <h3>{item.story?.title || 'Untitled'}</h3>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${item.progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">{item.progressPercent}% complete</div>
                    <div className="story-meta">
                      <span>Last played: {new Date(item.lastPlayedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="story-actions">
                      <Link to={`/stories/${item.story?._id}/play`} className="btn-primary">
                        Continue Reading
                      </Link>
                      <button
                        className="btn-icon"
                        onClick={() => handleToggleFavorite(item.story?._id)}
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="stories-grid">
            {library.completed.length === 0 ? (
              <div className="empty-state">
                <p>No completed stories yet</p>
                <Link to="/stories" className="browse-btn">Browse Stories</Link>
              </div>
            ) : (
              library.completed.map((item) => (
                <div key={item._id} className="story-card completed">
                  {item.story?.coverImage && (
                    <img src={item.story.coverImage} alt={item.story.title} className="story-cover" />
                  )}
                  <div className="completion-badge">✅ Completed</div>
                  <div className="story-info">
                    <h3>{item.story?.title || 'Untitled'}</h3>
                    {item.endingReached && (
                      <div className="ending-badge">
                        🎯 Ending: {item.endingReached}
                      </div>
                    )}
                    <div className="story-meta">
                      <span>Completed: {new Date(item.completedAt).toLocaleDateString()}</span>
                      {item.readingTime > 0 && (
                        <span>Time: {item.readingTime} min</span>
                      )}
                      {item.rating && (
                        <span>Rating: {'⭐'.repeat(item.rating)}</span>
                      )}
                    </div>
                    <div className="story-actions">
                      <Link to={`/stories/${item.story?._id}`} className="btn-secondary">
                        View Details
                      </Link>
                      <button
                        className="btn-icon"
                        onClick={() => handleToggleFavorite(item.story?._id)}
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="stories-grid">
            {library.favorites.length === 0 ? (
              <div className="empty-state">
                <p>No favorites yet</p>
                <Link to="/stories" className="browse-btn">Browse Stories</Link>
              </div>
            ) : (
              library.favorites.map((item) => (
                <div key={item._id} className="story-card">
                  {item.story?.coverImage && (
                    <img src={item.story.coverImage} alt={item.story.title} className="story-cover" />
                  )}
                  <div className="story-info">
                    <h3>{item.story?.title || 'Untitled'}</h3>
                    <p className="story-description">{item.story?.description}</p>
                    {item.story?.averageRating > 0 && (
                      <div className="rating">
                        ⭐ {item.story.averageRating.toFixed(1)} ({item.story.ratingsCount} ratings)
                      </div>
                    )}
                    <div className="story-actions">
                      <Link to={`/stories/${item.story?._id}`} className="btn-primary">
                        View Story
                      </Link>
                      <button
                        className="btn-icon active"
                        onClick={() => handleToggleFavorite(item.story?._id)}
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'lists' && (
          <div className="reading-lists">
            <div className="lists-header">
              <h3>My Reading Lists</h3>
              <button className="btn-create" onClick={() => setShowCreateList(!showCreateList)}>
                + Create List
              </button>
            </div>

            {showCreateList && (
              <form onSubmit={handleCreateList} className="create-list-form">
                <input
                  type="text"
                  placeholder="List name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Description (optional)"
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                />
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Create</button>
                  <button type="button" className="btn-secondary" onClick={() => setShowCreateList(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {library.readingLists.length === 0 ? (
              <div className="empty-state">
                <p>No reading lists yet</p>
              </div>
            ) : (
              <div className="lists-grid">
                {library.readingLists.map((list) => (
                  <div key={list._id} className="reading-list-card">
                    <div className="list-header">
                      <h4>{list.name}</h4>
                      <button className="btn-delete" onClick={() => handleDeleteList(list._id)}>
                        🗑️
                      </button>
                    </div>
                    {list.description && <p className="list-description">{list.description}</p>}
                    <div className="list-stats">
                      <span>{list.stories.length} stories</span>
                      {list.isPublic && <span className="public-badge">Public</span>}
                    </div>
                    {list.stories.length > 0 && (
                      <div className="list-stories">
                        {list.stories.slice(0, 3).map((story) => (
                          <div key={story._id} className="mini-story">
                            {story.coverImage && (
                              <img src={story.coverImage} alt={story.title} />
                            )}
                            <span>{story.title}</span>
                          </div>
                        ))}
                        {list.stories.length > 3 && (
                          <div className="more-stories">+{list.stories.length - 3} more</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
