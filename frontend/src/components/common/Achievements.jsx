import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import achievementService from '../../services/achievementService';
import './Achievements.css';

const Achievements = () => {
  const { token } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const data = await achievementService.getMyAchievements(token);
      setAchievements(data.achievements);
      setUnlockedCount(data.unlockedCount);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: '#9ca3af',
      rare: '#3b82f6',
      epic: '#a855f7',
      legendary: '#f59e0b'
    };
    return colors[rarity] || colors.common;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      reader: '📚',
      author: '✍️',
      social: '💬',
      explorer: '🧭',
      completionist: '🎯',
      special: '⭐'
    };
    return icons[category] || '🏆';
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return achievement.unlocked;
    if (filter === 'locked') return !achievement.unlocked;
    return achievement.category === filter;
  });

  if (loading) {
    return <div className="achievements-loading">Loading achievements...</div>;
  }

  const progressPercent = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <div className="achievements-container">
      <div className="achievements-header">
        <h2>🏆 Achievements</h2>
        <div className="achievements-progress">
          <div className="progress-stats">
            <span className="unlocked-count">{unlockedCount}</span>
            <span className="separator">/</span>
            <span className="total-count">{totalCount}</span>
            <span className="label">Unlocked</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="progress-percent">{Math.round(progressPercent)}%</div>
        </div>
      </div>

      <div className="achievements-filters">
        <button 
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={filter === 'unlocked' ? 'active' : ''}
          onClick={() => setFilter('unlocked')}
        >
          Unlocked ({unlockedCount})
        </button>
        <button 
          className={filter === 'locked' ? 'active' : ''}
          onClick={() => setFilter('locked')}
        >
          Locked ({totalCount - unlockedCount})
        </button>
        <button 
          className={filter === 'reader' ? 'active' : ''}
          onClick={() => setFilter('reader')}
        >
          📚 Reader
        </button>
        <button 
          className={filter === 'author' ? 'active' : ''}
          onClick={() => setFilter('author')}
        >
          ✍️ Author
        </button>
        <button 
          className={filter === 'social' ? 'active' : ''}
          onClick={() => setFilter('social')}
        >
          💬 Social
        </button>
        <button 
          className={filter === 'completionist' ? 'active' : ''}
          onClick={() => setFilter('completionist')}
        >
          🎯 Completionist
        </button>
      </div>

      <div className="achievements-grid">
        {filteredAchievements.map((achievement) => (
          <div 
            key={achievement._id} 
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'} ${achievement.rarity}`}
            style={{ borderColor: getRarityColor(achievement.rarity) }}
          >
            <div className="achievement-icon">
              {achievement.unlocked ? achievement.icon : '🔒'}
            </div>
            <div className="achievement-info">
              <div className="achievement-header-row">
                <h3 className="achievement-name">
                  {achievement.unlocked ? achievement.name : '???'}
                </h3>
                <span 
                  className={`achievement-rarity ${achievement.rarity}`}
                  style={{ color: getRarityColor(achievement.rarity) }}
                >
                  {achievement.rarity}
                </span>
              </div>
              <p className="achievement-description">
                {achievement.unlocked ? achievement.description : 'Complete the requirement to unlock'}
              </p>
              <div className="achievement-category">
                {getCategoryIcon(achievement.category)} {achievement.category}
              </div>
              {achievement.unlocked ? (
                <div className="achievement-unlocked-info">
                  <span className="xp-reward">+{achievement.xpReward} XP</span>
                  <span className="unlocked-date">
                    Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </span>
                </div>
              ) : (
                <div className="achievement-progress-container">
                  <div className="progress-bar small">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {achievement.currentValue} / {achievement.targetValue}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="no-achievements">
          <p>No achievements found for this filter.</p>
        </div>
      )}
    </div>
  );
};

export default Achievements;
