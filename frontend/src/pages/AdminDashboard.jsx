import { useState, useEffect } from 'react';
import adminService from '../services/adminService';
import statisticsService from '../services/statisticsService';
import Navbar from '../components/common/Navbar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stories, setStories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, storiesData, statsData] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllStories(),
        statisticsService.getGlobalStatistics(),
      ]);
      setUsers(usersData.data || []);
      setStories(storiesData.data || []);
      setStats(statsData.data);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, isBanned) => {
    try {
      if (isBanned) {
        await adminService.unbanUser(userId);
      } else {
        await adminService.banUser(userId);
      }
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'opération');
    }
  };

  const handleSuspendStory = async (storyId, isSuspended) => {
    try {
      if (isSuspended) {
        await adminService.unsuspendStory(storyId);
      } else {
        await adminService.suspendStory(storyId);
      }
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'opération');
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm('Supprimer définitivement cette histoire ?')) return;
    
    try {
      await adminService.deleteStory(storyId);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression');
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

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="container">
          <h1>⚔️ Panneau d'Administration</h1>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Tabs */}
          <div className="admin-tabs">
            <button
              className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
              onClick={() => setActiveTab('stats')}
            >
              📊 Statistiques
            </button>
            <button
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              👥 Utilisateurs ({users.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'stories' ? 'active' : ''}`}
              onClick={() => setActiveTab('stories')}
            >
              📚 Histoires ({stories.length})
            </button>
          </div>

          {/* Stats Tab */}
          {activeTab === 'stats' && stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalUsers || 0}</div>
                  <div className="stat-label">Utilisateurs</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✍️</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalAuthors || 0}</div>
                  <div className="stat-label">Auteurs</div>
                </div>
              </div>

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
                  <div className="stat-value">{stats.totalGames || 0}</div>
                  <div className="stat-label">Parties Jouées</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.completedGames || 0}</div>
                  <div className="stat-label">Complétées</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalRatings || 0}</div>
                  <div className="stat-label">Notes</div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Histoires</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <strong>{user.username}</strong>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge role-${user.role}`}>
                          {user.role === 'admin' && '⚔️'}
                          {user.role === 'author' && '✍️'}
                          {user.role === 'reader' && '📖'}
                          {' '}{user.role}
                        </span>
                      </td>
                      <td>{user.createdStories?.length || 0}</td>
                      <td>
                        {user.isBanned ? (
                          <span className="status-badge-banned">🚫 Banni</span>
                        ) : (
                          <span className="status-badge-active">✅ Actif</span>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleBanUser(user._id, user.isBanned)}
                          className={`btn btn-sm ${user.isBanned ? 'btn-secondary' : 'btn-danger'}`}
                        >
                          {user.isBanned ? 'Débannir' : 'Bannir'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Stories Tab */}
          {activeTab === 'stories' && (
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Auteur</th>
                    <th>Statut</th>
                    <th>Parties</th>
                    <th>Note</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stories.map((story) => (
                    <tr key={story._id}>
                      <td>
                        <strong>{story.title}</strong>
                      </td>
                      <td>{story.author?.username || 'Inconnu'}</td>
                      <td>
                        <span className={`status-badge status-${story.status}`}>
                          {story.status === 'published' && '✅'}
                          {story.status === 'draft' && '📝'}
                          {story.status === 'suspended' && '🚫'}
                          {' '}{story.status}
                        </span>
                      </td>
                      <td>{story.totalPlays || 0}</td>
                      <td>⭐ {story.averageRating?.toFixed(1) || 'N/A'}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleSuspendStory(story._id, story.status === 'suspended')}
                            className={`btn btn-sm ${story.status === 'suspended' ? 'btn-secondary' : 'btn-danger'}`}
                          >
                            {story.status === 'suspended' ? 'Réactiver' : 'Suspendre'}
                          </button>
                          <button
                            onClick={() => handleDeleteStory(story._id)}
                            className="btn btn-sm btn-danger"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
