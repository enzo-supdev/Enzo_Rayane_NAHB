import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import storyService from '../services/storyService';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';

export default function StoryCreate() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Valider les champs requis
      if (!formData.title.trim()) {
        setError('Le titre est requis');
        setLoading(false);
        return;
      }

      if (!formData.description.trim()) {
        setError('La description est requise');
        setLoading(false);
        return;
      }

      // Parser les tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Créer l'histoire
      const response = await storyService.createStory({
        title: formData.title.trim(),
        description: formData.description.trim(),
        tags: tags
      });

      // Rediriger vers l'édition de la page de départ
      if (response.story) {
        navigate(`/stories/${response.story.id}/edit`, {
          state: { newStory: true }
        });
      }
    } catch (err) {
      console.error('Erreur création histoire:', err);
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== 'AUTHOR' && user.role !== 'ADMIN')) {
    return (
      <>
        <Navbar />
        <div className="page-container error-container">
          <h1>Accès refusé</h1>
          <p>Seuls les auteurs peuvent créer des histoires.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>📝 Créer une nouvelle histoire</h1>
          <p>Commencez votre aventure interactive</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="story-create-form">
          <div className="form-group">
            <label htmlFor="title">Titre *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ex: L'Aventure Fantastique"
              maxLength={100}
              required
            />
            <small>{formData.title.length}/100</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Décrivez votre histoire en quelques lignes..."
              rows={5}
              maxLength={500}
              required
            />
            <small>{formData.description.length}/500</small>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (optionnel)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="Ex: fantastique, aventure, mystère (séparés par des virgules)"
            />
            <small>Séparez les tags par des virgules</small>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Création en cours...' : 'Créer l\'histoire'}
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate('/stories')}
              disabled={loading}
            >
              Annuler
            </button>
          </div>
        </form>

        <div className="info-box">
          <h3>💡 Conseils</h3>
          <ul>
            <li>Donnez un titre accrocheur à votre histoire</li>
            <li>La description apparaîtra dans la liste publique</li>
            <li>Ajoutez des tags pour faciliter la recherche</li>
            <li>Vous pourrez ajouter des pages et des choix après création</li>
            <li>Vous pouvez tester votre histoire avant de la publier</li>
          </ul>
        </div>
      </div>
    </>
  );
}
