import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gameService from '../services/gameService';
import Navbar from '../components/common/Navbar';
import Inventory from '../components/common/Inventory';
import PlayerStats from '../components/common/PlayerStats';
import InteractiveZones from '../components/common/InteractiveZones';
import TimedChoice from '../components/common/TimedChoice';
import './StoryReader.css';

const StoryReader = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [makingChoice, setMakingChoice] = useState(false);
  const [diceRoll, setDiceRoll] = useState(null);
  const [showDiceAnimation, setShowDiceAnimation] = useState(false);

  useEffect(() => {
    fetchGame();
  }, [gameId]);

  const fetchGame = async () => {
    try {
      setLoading(true);
      const data = await gameService.getGame(gameId);
      setGame(data.data);
      setCurrentPage(data.data.currentPage);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger la partie');
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = async (choice) => {
    if (makingChoice) return;

    // Check if item is required
    if (choice.itemRequired && !game.inventory?.includes(choice.itemRequired)) {
      setError(`Vous avez besoin de: ${choice.itemRequired}`);
      return;
    }

    // Check if dice roll is required
    if (choice.requiresDice && !diceRoll) {
      setError('Vous devez lancer les dés avant de faire ce choix !');
      return;
    }

    try {
      setMakingChoice(true);
      setError('');

      const response = await gameService.makeChoice(gameId, choice._id, diceRoll?.result);
      
      // Handle dice roll failure
      if (response.success === false) {
        setError(response.message || 'Le jet de dés a échoué');
        setDiceRoll(null);
        return;
      }

      // Success - update game state
      if (response.data) {
        setGame(response.data);
        setCurrentPage(response.data.currentPage);
        setDiceRoll(null); // Reset dice after choice

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Erreur lors du choix');
    } finally {
      setMakingChoice(false);
    }
  };

  const handleRollDice = async (diceType) => {
    try {
      setShowDiceAnimation(true);
      const data = await gameService.rollDice(gameId, diceType);
      
      // Simulate dice rolling animation
      setTimeout(() => {
        setDiceRoll(data.data);
        setShowDiceAnimation(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du lancer de dés');
      setShowDiceAnimation(false);
    }
  };

  const handleRestart = () => {
    navigate(`/stories/${game.story._id}`);
  };

  const handleInteractiveZone = async (zone) => {
    if (!zone.targetPage) return;
    
    try {
      // This would need a specific backend endpoint for zone navigation
      console.log('Navigating via interactive zone to:', zone.targetPage);
      // For now, we'll just show which zone was clicked
      alert(`Zone cliquée: ${zone.description || 'Zone interactive'}`);
    } catch (err) {
      console.error('Error navigating via zone:', err);
    }
  };

  const handleTimedChoiceTimeout = () => {
    // Select first choice automatically or handle timeout
    if (currentPage?.choices && currentPage.choices.length > 0) {
      setError('⏰ Temps écoulé ! Choix automatique...');
      setTimeout(() => {
        handleChoice(currentPage.choices[0]);
      }, 1000);
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

  if (error && !game) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="container">
            <div className="alert alert-error">{error}</div>
          </div>
        </div>
      </>
    );
  }

  const isEnding = currentPage?.isEnding;
  const hasChoices = currentPage?.choices && currentPage.choices.length > 0;

  return (
    <>
      <Navbar />
      <div className="reader-container">
        <div className="container">
          {/* Story Header */}
          <div className="reader-header">
            <div className="story-info-small">
              <h2 className="story-title-small">📖 {game?.story?.title}</h2>
              <div className="progress-info">
                <span>🎮 Étape {game?.path?.length || 1}</span>
                {game?.status === 'completed' && <span className="badge-success">✅ Terminé</span>}
              </div>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Player Stats and Inventory */}
          <div className="game-status-row">
            {game?.playerStats && (
              <PlayerStats stats={game.playerStats} />
            )}
            {game?.inventory && game.story?.hasInventory && (
              <Inventory items={game.inventory} />
            )}
          </div>

          {/* Current Page */}
          <div className="page-content card">
            {currentPage?.image && (
              currentPage.interactiveZones && currentPage.interactiveZones.length > 0 ? (
                <InteractiveZones 
                  imageUrl={`http://localhost:5000${currentPage.image}`}
                  zones={currentPage.interactiveZones}
                  onZoneClick={handleInteractiveZone}
                />
              ) : (
                <div className="page-image">
                  <img
                    src={`http://localhost:5000${currentPage.image}`}
                    alt="Scene"
                    className="scene-image"
                  />
                </div>
              )
            )}

            <div className="page-text">
              {currentPage?.title && (
                <h1 className="page-title">{currentPage.title}</h1>
              )}
              
              <div className="page-content-text">
                {currentPage?.content}
              </div>

              {isEnding && (
                <div className="ending-badge">
                  <div className="ending-icon">🏆</div>
                  <h3>Fin Atteinte</h3>
                  {currentPage.endingLabel && (
                    <p className="ending-label">{currentPage.endingLabel}</p>
                  )}
                  {currentPage.endingType && (
                    <span className="ending-type">{getEndingTypeIcon(currentPage.endingType)} {currentPage.endingType}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Dice Section */}
          {!isEnding && hasChoices && currentPage.choices.some(c => c.requiresDice) && (
            <div className="dice-section card-dark">
              <h3>🎲 Lancer de Dés</h3>
              <p>Certains choix nécessitent un lancer de dés</p>
              
              <div className="dice-buttons">
                {['d4', 'd6', 'd8', 'd10', 'd12', 'd20'].map((diceType) => (
                  <button
                    key={diceType}
                    onClick={() => handleRollDice(diceType)}
                    disabled={showDiceAnimation}
                    className="btn btn-secondary dice-btn"
                  >
                    🎲 {diceType.toUpperCase()}
                  </button>
                ))}
              </div>

              {showDiceAnimation && (
                <div className="dice-animation">
                  <div className="dice-rolling">🎲</div>
                  <p>Lancer en cours...</p>
                </div>
              )}

              {diceRoll && !showDiceAnimation && (
                <div className="dice-result">
                  <div className="dice-value">{diceRoll.result}</div>
                  <p>Résultat : {diceRoll.result} sur {diceRoll.diceType.toUpperCase()}</p>
                </div>
              )}
            </div>
          )}

          {/* Choices */}
          {!isEnding && hasChoices && (
            <>
              {/* Check if any choice has a time limit */}
              {currentPage.choices.some(c => c.timeLimit) ? (
                <TimedChoice
                  choices={currentPage.choices}
                  timeLimit={currentPage.choices.find(c => c.timeLimit)?.timeLimit || 30}
                  onChoiceSelect={handleChoice}
                  onTimeout={handleTimedChoiceTimeout}
                />
              ) : (
                <div className="choices-section">
                  <h3 className="choices-title">⚔️ Que faites-vous ?</h3>
                  <div className="choices-list">
                    {currentPage.choices.map((choice, index) => {
                      const needsDice = choice.requiresDice;
                      const hasCondition = choice.diceCondition;
                      const meetsCondition = !needsDice || (diceRoll && 
                        diceRoll.result >= (hasCondition?.minValue || 0) &&
                        diceRoll.result <= (hasCondition?.maxValue || 999));
                      const hasRequiredItem = !choice.itemRequired || game.inventory?.includes(choice.itemRequired);

                      return (
                        <button
                          key={choice._id || `choice-${index}`}
                          onClick={() => handleChoice(choice)}
                          disabled={makingChoice || (needsDice && !meetsCondition) || !hasRequiredItem}
                          className={`choice-btn ${needsDice ? 'choice-dice' : ''} ${(!meetsCondition && needsDice) || !hasRequiredItem ? 'choice-locked' : ''}`}
                        >
                          <span className="choice-text">{choice.text}</span>
                          {choice.itemRequired && (
                            <span className={`choice-requirement ${hasRequiredItem ? 'requirement-met' : ''}`}>
                              🔑 {choice.itemRequired} {!hasRequiredItem && '🔒'}
                            </span>
                          )}
                          {choice.itemGiven && (
                            <span className="choice-reward">
                              🎁 +{choice.itemGiven}
                            </span>
                          )}
                          {(choice.statsModifier?.health || choice.statsModifier?.attack || choice.statsModifier?.defense || choice.statsModifier?.magic) && (
                            <span className="choice-stats">
                              {choice.statsModifier.health && `❤️${choice.statsModifier.health > 0 ? '+' : ''}${choice.statsModifier.health} `}
                              {choice.statsModifier.attack && `⚔️${choice.statsModifier.attack > 0 ? '+' : ''}${choice.statsModifier.attack} `}
                              {choice.statsModifier.defense && `🛡️${choice.statsModifier.defense > 0 ? '+' : ''}${choice.statsModifier.defense} `}
                              {choice.statsModifier.magic && `✨${choice.statsModifier.magic > 0 ? '+' : ''}${choice.statsModifier.magic}`}
                            </span>
                          )}
                          {needsDice && (
                            <span className="choice-requirement">
                              🎲 {hasCondition?.diceType?.toUpperCase() || 'Dés'} 
                              {hasCondition && ` (${hasCondition.minValue}-${hasCondition.maxValue})`}
                              {!meetsCondition && ' 🔒'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Ending Actions */}
          {isEnding && (
            <div className="ending-actions">
              <button onClick={handleRestart} className="btn btn-primary btn-large">
                🔄 Recommencer l'Aventure
              </button>
              <button
                onClick={() => navigate('/stories')}
                className="btn btn-secondary btn-large"
              >
                📚 Explorer d'autres Histoires
              </button>
            </div>
          )}

          {/* No Choices - Dead End */}
          {!isEnding && !hasChoices && (
            <div className="dead-end card">
              <h3>⚠️ Impasse</h3>
              <p>Cette page n'a pas de suite... L'histoire semble incomplète.</p>
              <button onClick={handleRestart} className="btn btn-secondary">
                🔄 Recommencer
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const getEndingTypeIcon = (type) => {
  const icons = {
    heroic: '🏆',
    tragic: '💔',
    mysterious: '🔮',
    neutral: '⚖️',
    comic: '😄',
    dark: '🌑',
  };
  return icons[type] || '🎭';
};

export default StoryReader;
