import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gameService from '../services/gameService';
import Navbar from '../components/common/Navbar';

const StoryReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [currentPage, setCurrentPage] = useState(null);
  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    startGame();
  }, [id]);

  const startGame = async () => {
    try {
      setLoading(true);
      const data = await gameService.startGame(id);
      setStory(data.story);
      setCurrentPage(data.currentPage);
      setChoices(data.choices);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du démarrage');
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = async (choiceId) => {
    try {
      setLoading(true);
      const data = await gameService.makeChoice(choiceId);
      setCurrentPage(data.currentPage);
      setChoices(data.choices);
      setIsEnd(data.isEnd);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du choix');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !currentPage) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="loading">Chargement de l'histoire...</div>
        </div>
      </>
    );
  }

  if (error && !currentPage) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="error-message">{error}</div>
          <button onClick={() => navigate('/stories')} className="btn-primary">
            Retour aux histoires
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="reader-container">
          {story && (
            <div className="story-header">
              <h1>{story.title}</h1>
            </div>
          )}

          <div className="page-content">
            <p>{currentPage?.content}</p>
          </div>

          {isEnd ? (
            <div className="end-section">
              <h2>🎉 Fin de l'histoire</h2>
              <p>Vous avez atteint une fin !</p>
              <div className="end-actions">
                <button
                  onClick={startGame}
                  className="btn-primary"
                >
                  Recommencer
                </button>
                <button
                  onClick={() => navigate('/stories')}
                  className="btn-secondary"
                >
                  Autres histoires
                </button>
              </div>
            </div>
          ) : (
            <div className="choices-section">
              <h3>Que faites-vous ?</h3>
              <div className="choices-list">
                {choices.map((choice) => (
                  <button
                    key={choice._id}
                    onClick={() => handleChoice(choice._id)}
                    className="choice-button"
                    disabled={loading}
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </>
  );
};

export default StoryReader;