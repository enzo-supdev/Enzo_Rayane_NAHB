import React from 'react';
import './PlayerStats.css';

const PlayerStats = ({ stats = {} }) => {
  const { health = 100, attack = 10, defense = 5, magic = 0 } = stats;

  const getHealthColor = (value) => {
    if (value > 70) return '#4ade80';
    if (value > 30) return '#fbbf24';
    return '#ef4444';
  };

  const getHealthStatus = (value) => {
    if (value > 70) return 'En bonne santé';
    if (value > 30) return 'Blessé';
    if (value > 0) return 'Gravement blessé';
    return 'KO';
  };

  return (
    <div className="player-stats-container">
      <h3>⚔️ Statistiques</h3>
      
      <div className="stat-group">
        <div className="stat-item health">
          <div className="stat-header">
            <span className="stat-label">❤️ Santé</span>
            <span className="stat-value">{health}/100</span>
          </div>
          <div className="stat-bar">
            <div 
              className="stat-bar-fill" 
              style={{ 
                width: `${Math.max(0, Math.min(100, health))}%`,
                backgroundColor: getHealthColor(health)
              }}
            />
          </div>
          <span className="stat-status">{getHealthStatus(health)}</span>
        </div>

        <div className="stat-row">
          <div className="stat-item">
            <span className="stat-icon">⚔️</span>
            <div className="stat-info">
              <span className="stat-label">Attaque</span>
              <span className="stat-value">{attack}</span>
            </div>
          </div>

          <div className="stat-item">
            <span className="stat-icon">🛡️</span>
            <div className="stat-info">
              <span className="stat-label">Défense</span>
              <span className="stat-value">{defense}</span>
            </div>
          </div>

          <div className="stat-item">
            <span className="stat-icon">✨</span>
            <div className="stat-info">
              <span className="stat-label">Magie</span>
              <span className="stat-value">{magic}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
