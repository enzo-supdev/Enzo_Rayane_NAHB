import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import profileService from '../../services/profileService';
import './ProfileCustomizer.css';

const avatarStyles = [
  'default', 'wizard', 'warrior', 'shield', 'crown', 'archer', 'sword', 'wand', 
  'dragon', 'lion', 'eagle', 'wolf', 'snake', 'bat', 'owl', 'boar',
  'lightning', 'fire', 'ice', 'star', 'skull', 'ghost', 'mask', 'tent'
];
const avatarIcons = {
  'default': '👤',
  'wizard': '🧙',
  'warrior': '⚔️',
  'shield': '🛡️',
  'crown': '👑',
  'archer': '🏹',
  'sword': '🗡️',
  'wand': '🪄',
  'dragon': '🐉',
  'lion': '🦁',
  'eagle': '🦅',
  'wolf': '🐺',
  'snake': '🐍',
  'bat': '🦇',
  'owl': '🦉',
  'boar': '🐗',
  'lightning': '⚡',
  'fire': '🔥',
  'ice': '❄️',
  'star': '🌟',
  'skull': '💀',
  'ghost': '👻',
  'mask': '🎭',
  'tent': '🎪'
};
const avatarColors = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', 
  '#14b8a6', '#f97316', '#06b6d4', '#84cc16', '#eab308', '#f43f5e',
  '#a855f7', '#6366f1', '#d946ef', '#0ea5e9', '#22c55e', '#fb923c'
];
const avatarFrames = ['none', 'bronze', 'silver', 'gold', 'diamond', 'legendary'];
const profileThemes = ['light', 'dark', 'fantasy', 'scifi', 'horror', 'mystery'];

const ProfileCustomizer = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState('default');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [selectedFrame, setSelectedFrame] = useState('none');
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [selectedTitle, setSelectedTitle] = useState('Novice Reader');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getMyProfile(token);
      setProfile(data.profile);
      setSelectedAvatar(data.profile.avatarStyle);
      setSelectedColor(data.profile.avatarColor);
      setSelectedFrame(data.profile.avatarFrame);
      setSelectedTheme(data.profile.profileTheme);
      setSelectedTitle(data.profile.title);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await profileService.updateProfile({
        avatarStyle: selectedAvatar,
        avatarColor: selectedColor,
        avatarFrame: selectedFrame,
        profileTheme: selectedTheme,
        title: selectedTitle
      }, token);
      alert('Profile updated successfully!');
      loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (!profile) return <div>Error loading profile</div>;

  return (
    <div className="profile-customizer">
      <h2>🎨 Customize Your Profile</h2>

      <div className="customizer-grid">
        {/* Avatar Preview */}
        <div className="preview-section">
          <h3>Preview</h3>
          <div className={`avatar-preview frame-${selectedFrame}`}>
            <div
              className={`avatar`}
              style={{ background: selectedColor }}
            >
              {avatarIcons[selectedAvatar] || '👤'}
            </div>
          </div>
          <div className="preview-info">
            <h4>{profile.user?.username}</h4>
            <p className="title-badge">{selectedTitle}</p>
            <div className="level-info">
              <span className="level">Level {profile.level}</span>
              <div className="xp-bar">
                <div
                  className="xp-fill"
                  style={{ width: `${(profile.xp / (profile.level * 100)) * 100}%` }}
                ></div>
              </div>
              <span className="xp-text">{profile.xp} / {profile.level * 100} XP</span>
            </div>
          </div>
        </div>

        {/* Customization Options */}
        <div className="options-section">
          <div className="option-group">
            <h3>Avatar Style</h3>
            <div className="avatar-options">
              {avatarStyles.map((style) => (
                <div
                  key={style}
                  className={`avatar-option ${selectedAvatar === style ? 'selected' : ''}`}
                  onClick={() => setSelectedAvatar(style)}
                >
                  <div className={`avatar-mini`} style={{ background: selectedColor }}>
                    {avatarIcons[style] || '👤'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="option-group">
            <h3>Color</h3>
            <div className="color-options">
              {avatarColors.map((color) => (
                <div
                  key={color}
                  className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                  style={{ background: color }}
                  onClick={() => setSelectedColor(color)}
                ></div>
              ))}
            </div>
          </div>

          <div className="option-group">
            <h3>Frame</h3>
            <div className="frame-options">
              {avatarFrames.map((frame) => (
                <button
                  key={frame}
                  className={`frame-option ${selectedFrame === frame ? 'selected' : ''}`}
                  onClick={() => setSelectedFrame(frame)}
                >
                  {frame === 'none' ? 'None' : frame}
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <h3>Title</h3>
            <select
              value={selectedTitle}
              onChange={(e) => setSelectedTitle(e.target.value)}
              className="title-select"
            >
              {profile.unlockedTitles.map((title) => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>
          </div>

          <div className="option-group">
            <h3>Theme</h3>
            <div className="theme-options">
              {profileThemes.map((theme) => (
                <button
                  key={theme}
                  className={`theme-option ${selectedTheme === theme ? 'selected' : ''}`}
                  onClick={() => setSelectedTheme(theme)}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <button
            className="save-button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCustomizer;
