import React from 'react';
import './Inventory.css';

const Inventory = ({ items = [], onItemClick }) => {
  if (!items || items.length === 0) {
    return (
      <div className="inventory-container empty">
        <h3>📦 Inventaire</h3>
        <p className="empty-message">Votre inventaire est vide</p>
      </div>
    );
  }

  return (
    <div className="inventory-container">
      <h3>📦 Inventaire</h3>
      <div className="inventory-grid">
        {items.map((item, index) => (
          <div
            key={index}
            className="inventory-item"
            onClick={() => onItemClick && onItemClick(item)}
            title={item}
          >
            <span className="item-icon">{getItemIcon(item)}</span>
            <span className="item-name">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get item icons
const getItemIcon = (itemName) => {
  const icons = {
    'épée': '⚔️',
    'sword': '⚔️',
    'bouclier': '🛡️',
    'shield': '🛡️',
    'potion': '🧪',
    'clé': '🔑',
    'key': '🔑',
    'carte': '🗺️',
    'map': '🗺️',
    'torche': '🔦',
    'torch': '🔦',
    'gemme': '💎',
    'gem': '💎',
    'livre': '📖',
    'book': '📖',
    'parchemin': '📜',
    'scroll': '📜',
    'amulette': '🪬',
    'amulet': '🪬',
    'nourriture': '🍖',
    'food': '🍖',
    'cristal': '🔮',
    'crystal': '🔮'
  };
  
  const lowerItem = itemName.toLowerCase();
  return icons[lowerItem] || '📦';
};

export default Inventory;
