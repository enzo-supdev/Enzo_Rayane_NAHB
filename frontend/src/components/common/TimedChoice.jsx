import React, { useState, useEffect } from 'react';
import './TimedChoice.css';

const TimedChoice = ({ choices, timeLimit, onChoiceSelect, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (timeLimit <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          if (onTimeout) {
            onTimeout();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimit, onTimeout]);

  const getTimerColor = () => {
    const percentage = (timeLeft / timeLimit) * 100;
    if (percentage > 50) return '#4ade80';
    if (percentage > 20) return '#fbbf24';
    return '#ef4444';
  };

  const getUrgencyClass = () => {
    const percentage = (timeLeft / timeLimit) * 100;
    if (percentage <= 20) return 'urgent';
    if (percentage <= 50) return 'warning';
    return '';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`timed-choice-container ${getUrgencyClass()}`}>
      <div className="timer-display">
        <div className="timer-icon">⏱️</div>
        <div className="timer-info">
          <span className="timer-label">Temps restant</span>
          <span className="timer-value" style={{ color: getTimerColor() }}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className="timer-bar">
          <div
            className="timer-bar-fill"
            style={{
              width: `${(timeLeft / timeLimit) * 100}%`,
              backgroundColor: getTimerColor()
            }}
          />
        </div>
      </div>

      <div className="choices-container">
        {choices.map((choice, index) => (
          <button
            key={choice._id || index}
            className={`choice-button ${isExpired ? 'disabled' : ''}`}
            onClick={() => !isExpired && onChoiceSelect(choice)}
            disabled={isExpired}
          >
            <span className="choice-number">{index + 1}</span>
            <span className="choice-text">{choice.text}</span>
            {choice.itemRequired && (
              <span className="choice-requirement">🔑 {choice.itemRequired}</span>
            )}
          </button>
        ))}
      </div>

      {isExpired && (
        <div className="timeout-message">
          ⏰ Temps écoulé ! La décision a été prise pour vous...
        </div>
      )}
    </div>
  );
};

export default TimedChoice;
