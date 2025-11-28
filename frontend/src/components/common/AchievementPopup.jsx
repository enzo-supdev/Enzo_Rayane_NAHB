import React, { useEffect, useState } from 'react';
import './AchievementPopup.css';

const AchievementPopup = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);

    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
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

  return (
    <div className={`achievement-popup ${isVisible ? 'visible' : ''}`}>
      <div 
        className={`popup-content ${achievement.rarity}`}
        style={{ borderColor: getRarityColor(achievement.rarity) }}
      >
        <div className="popup-header">
          <span className="achievement-unlocked-text">🎉 Achievement Unlocked!</span>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        <div className="popup-body">
          <div className="popup-icon">{achievement.icon}</div>
          <div className="popup-info">
            <h3 className="popup-name" style={{ color: getRarityColor(achievement.rarity) }}>
              {achievement.name}
            </h3>
            <p className="popup-description">{achievement.description}</p>
            <div className="popup-reward">
              <span className="xp-badge">+{achievement.xpReward} XP</span>
              <span className="rarity-badge" style={{ color: getRarityColor(achievement.rarity) }}>
                {achievement.rarity.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementPopup;
