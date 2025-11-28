import React, { useState } from 'react';
import './InteractiveZones.css';

const InteractiveZones = ({ imageUrl, zones = [], onZoneClick }) => {
  const [hoveredZone, setHoveredZone] = useState(null);

  const handleZoneClick = (zone) => {
    if (onZoneClick) {
      onZoneClick(zone);
    }
  };

  const getZoneStyle = (zone) => {
    const baseStyle = {
      position: 'absolute',
      left: `${zone.x}%`,
      top: `${zone.y}%`,
      width: `${zone.width}%`,
      height: `${zone.height}%`,
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    };

    if (zone.shape === 'circle') {
      baseStyle.borderRadius = '50%';
    } else if (zone.shape === 'polygon') {
      // For polygon, we'll use a more complex approach if needed
      baseStyle.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
    }

    return baseStyle;
  };

  return (
    <div className="interactive-zones-container">
      <div className="image-wrapper">
        <img src={imageUrl} alt="Interactive scene" className="interactive-image" />
        
        <div className="zones-overlay">
          {zones.map((zone, index) => (
            <div
              key={index}
              className={`zone ${hoveredZone === index ? 'hovered' : ''}`}
              style={getZoneStyle(zone)}
              onClick={() => handleZoneClick(zone)}
              onMouseEnter={() => setHoveredZone(index)}
              onMouseLeave={() => setHoveredZone(null)}
            >
              {hoveredZone === index && zone.description && (
                <div className="zone-tooltip">
                  {zone.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {zones.length > 0 && (
        <div className="zones-hint">
          🖱️ Cliquez sur les zones interactives de l'image pour explorer
        </div>
      )}
    </div>
  );
};

export default InteractiveZones;
