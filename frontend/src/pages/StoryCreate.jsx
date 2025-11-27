import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import storyService from '../services/storyService';
import './StoryCreate.css';

function StoryCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [coverPreview, setCoverPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    synopsis: '',
    theme: 'fantasy',
    tags: '',
    difficulty: 'medium',
    estimatedDuration: 30
  });

  const [coverFile, setCoverFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation frontend
      if (formData.title.trim().length < 3) {
        setError('Le titre doit contenir au moins 3 caractères');
        setLoading(false);
        return;
      }
      
      if (formData.description.trim().length < 10) {
        setError('La description doit contenir au moins 10 caractères');
        setLoading(false);
        return;
      }

      // Convertir les tags en tableau (le backend attend une string)
      const tagsString = formData.tags.trim();

      // Préparer les données en ne gardant que les champs acceptés par le backend
      const storyData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        theme: formData.theme,
        difficulty: formData.difficulty,
        estimatedDuration: parseInt(formData.estimatedDuration),
        tags: tagsString // Envoyer comme string, le backend fera le split
      };

      console.log('Sending story data:', storyData);

      // Créer l'histoire
      const response = await storyService.createStory(storyData);
      const createdStory = response.data;

      console.log('Created story:', createdStory);

      // Upload de la couverture si présente
      if (coverFile && createdStory._id) {
        await storyService.uploadCover(createdStory._id, coverFile);
      }

      // Rediriger vers l'éditeur de pages
      navigate(`/author/edit/${createdStory._id}`);
    } catch (err) {
      const errorMsg = err.response?.data?.errors 
        ? err.response.data.errors.map(e => e.msg).join(', ')
        : err.response?.data?.message || err.message || 'Erreur lors de la création';
      setError(errorMsg);
      console.error('Error creating story:', err);
      console.error('Error response:', err.response?.data);
      console.error('Sent data:', { ...formData, tags: formData.tags.split(',').map(t => t.trim()).filter(t => t) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="story-create-page">
      <div className="container">
        <div className="page-header">
          <h1>✍️ Créer une Nouvelle Histoire</h1>
          <p>Commencez votre aventure interactive</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="story-form">
          {/* Informations de base */}
          <div className="form-section">
            <h2>📖 Informations de Base</h2>
            
            <div className="form-group">
              <label htmlFor="title">
                Titre de l'Histoire <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ex: La Quête du Dragon d'Or"
                maxLength={100}
              />
              <small>{formData.title.length}/100 caractères</small>
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Description <span className="required">*</span>
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                minLength={10}
                placeholder="Décrivez votre histoire en quelques phrases (min 10 caractères)"
                maxLength={1000}
              />
              <small>{formData.description.length}/1000 caractères (min 10)</small>
            </div>

            <div className="form-group">
              <label htmlFor="synopsis">
                Synopsis Détaillé (optionnel)
              </label>
              <textarea
                id="synopsis"
                name="synopsis"
                value={formData.synopsis}
                onChange={handleChange}
                rows={6}
                placeholder="Ajoutez plus de détails sur votre univers, les personnages, les enjeux..."
                maxLength={2000}
              />
              <small>{formData.synopsis.length}/1000 caractères</small>
            </div>
          </div>

          {/* Catégorie et Thème */}
          <div className="form-section">
            <h2>🎭 Catégorie et Ambiance</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="theme">
                  Thème <span className="required">*</span>
                </label>
                <select
                  id="theme"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  required
                >
                  <option value="fantasy">🧙 Fantasy</option>
                  <option value="historical">⚔️ Historique</option>
                  <option value="horror">👻 Horreur</option>
                  <option value="adventure">🗺️ Aventure</option>
                  <option value="mystery">🔍 Mystère</option>
                  <option value="sci-fi">🚀 Science-Fiction</option>
                  <option value="romance">💕 Romance</option>
                  <option value="other">📚 Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="difficulty">
                  Difficulté <span className="required">*</span>
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  required
                >
                  <option value="easy">🟢 Facile</option>
                  <option value="medium">🟡 Moyen</option>
                  <option value="hard">🔴 Difficile</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="estimatedDuration">
                  Durée Estimée (min)
                </label>
                <input
                  type="number"
                  id="estimatedDuration"
                  name="estimatedDuration"
                  value={formData.estimatedDuration}
                  onChange={handleChange}
                  min={5}
                  max={300}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tags">
                Tags (séparés par des virgules)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Ex: magie, dragons, quête, exploration"
              />
              <small>Ajoutez des mots-clés pour aider les lecteurs à trouver votre histoire</small>
            </div>
          </div>

          {/* Image de Couverture */}
          <div className="form-section">
            <h2>🖼️ Image de Couverture</h2>
            
            <div className="cover-upload">
              <div className="cover-preview">
                {coverPreview ? (
                  <img src={coverPreview} alt="Aperçu de la couverture" />
                ) : (
                  <div className="cover-placeholder">
                    <span className="cover-icon">📜</span>
                    <p>Aucune image sélectionnée</p>
                  </div>
                )}
              </div>

              <div className="cover-controls">
                <input
                  type="file"
                  id="cover"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleCoverChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="cover" className="btn btn-secondary">
                  📷 Choisir une Image
                </label>
                {coverPreview && (
                  <button
                    type="button"
                    className="btn btn-tertiary"
                    onClick={() => {
                      setCoverFile(null);
                      setCoverPreview(null);
                    }}
                  >
                    🗑️ Supprimer
                  </button>
                )}
                <small>Format: JPG, PNG ou WebP - Max 5MB</small>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-tertiary"
              onClick={() => navigate('/author/dashboard')}
              disabled={loading}
            >
              ❌ Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '⏳ Création...' : '✨ Créer l\'Histoire'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StoryCreate;
