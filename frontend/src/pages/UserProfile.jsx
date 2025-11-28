import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Achievements from '../components/common/Achievements';
import Library from '../components/common/Library';
import ProfileCustomizer from '../components/common/ProfileCustomizer';
import './UserProfile.css';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('library');

  return (
    <>
      <Navbar />
      <div className="user-profile-page">
      <div className="profile-tabs">
        <button
          className={activeTab === 'library' ? 'active' : ''}
          onClick={() => setActiveTab('library')}
        >
          📚 My Library
        </button>
        <button
          className={activeTab === 'achievements' ? 'active' : ''}
          onClick={() => setActiveTab('achievements')}
        >
          🏆 Achievements
        </button>
        <button
          className={activeTab === 'customize' ? 'active' : ''}
          onClick={() => setActiveTab('customize')}
        >
          🎨 Customize Profile
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'library' && <Library />}
        {activeTab === 'achievements' && <Achievements />}
        {activeTab === 'customize' && <ProfileCustomizer />}
      </div>
    </div>
    </>
  );
};

export default UserProfile;
