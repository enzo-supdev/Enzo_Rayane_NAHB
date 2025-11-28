import { useState, useEffect } from 'react';
import ChoiceForm from './ChoiceForm';
import './PageForm.css';

function PageForm({ storyId, page = null, pages = [], story = null, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    isEnding: false,
    endingType: 'neutral',
    endingName: '',
    choices: []
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showChoiceForm, setShowChoiceForm] = useState(false);

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title || '',
        content: page.content || '',
        imageUrl: page.imageUrl || '',
        isEnding: page.isEnding || false,
        endingType: page.endingType || 'neutral',
        endingName: page.endingName || '',
        choices: page.choices || []
      });
      if (page.imageUrl) {
        setImagePreview(`http://localhost:5000${page.imageUrl}`);
      }
    }
  }, [page]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, imageFile });
  };

  const handleAddChoice = (choiceData) => {
    setFormData(prev => ({
      ...prev,
      choices: [...prev.choices, choiceData]
    }));
    setShowChoiceForm(false);
  };

  const handleRemoveChoice = (index) => {
    setFormData(prev => ({
      ...prev,
      choices: prev.choices.filter((_, i) => i !== index)
    }));
  };

  // Filtrer les pages disponibles (exclure la page actuelle)
  const availablePages = pages.filter(p => p._id !== page?._id);

  return (
    <form onSubmit={handleSubmit} className="page-form">
      <div className="form-group">
        <label htmlFor="title">
          Titre de la Page <span className="required">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Ex: Le Carrefour Mystérieux"
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">
          Contenu <span className="required">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={10}
          placeholder="Racontez ce qui se passe sur cette page..."
        />
        <small>{formData.content.length} caractères</small>
      </div>

      {/* Image */}
      <div className="form-group">
        <label>Image de la Page</label>
        <div className="image-upload">
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Aperçu" />
            </div>
          )}
          <div className="upload-controls">
            <input
              type="file"
              id="pageImage"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="pageImage" className="btn btn-secondary btn-sm">
              📷 {imagePreview ? 'Changer' : 'Ajouter'} l'Image
            </label>
            {imagePreview && (
              <button
                type="button"
                className="btn btn-tertiary btn-sm"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                  setFormData(prev => ({ ...prev, imageUrl: '' }));
                }}
              >
                🗑️ Supprimer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Ending Options */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isEnding"
            checked={formData.isEnding}
            onChange={handleChange}
          />
          <span>🏁 Cette page est une fin de l'histoire</span>
        </label>
      </div>

      {formData.isEnding && (
        <div className="ending-options">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="endingType">Type de Fin</label>
              <select
                id="endingType"
                name="endingType"
                value={formData.endingType}
                onChange={handleChange}
              >
                <option value="good">👑 Bonne</option>
                <option value="neutral">⚖️ Neutre</option>
                <option value="bad">💀 Mauvaise</option>
                <option value="secret">✨ Secrète</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="endingName">Nom de la Fin</label>
              <input
                type="text"
                id="endingName"
                name="endingName"
                value={formData.endingName}
                onChange={handleChange}
                placeholder="Ex: Le Héros Triomphant"
              />
            </div>
          </div>
        </div>
      )}

      {/* Choices Section */}
      {!formData.isEnding && (
        <div className="choices-section">
          <div className="choices-header">
            <h3>🔀 Choix</h3>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowChoiceForm(!showChoiceForm)}
              disabled={availablePages.length === 0}
            >
              {showChoiceForm ? '❌ Annuler' : '➕ Ajouter un Choix'}
            </button>
          </div>

          {availablePages.length === 0 && (
            <div className="alert alert-info">
              ℹ️ Créez d'abord d'autres pages pour pouvoir ajouter des choix
            </div>
          )}

          {showChoiceForm && availablePages.length > 0 && (
            <ChoiceForm
              pages={availablePages}
              story={story}
              onSave={handleAddChoice}
              onCancel={() => setShowChoiceForm(false)}
            />
          )}

          {formData.choices.length > 0 && (
            <div className="choices-list">
              {formData.choices.map((choice, index) => (
                <div key={index} className="choice-item">
                  <div className="choice-content">
                    <strong>{choice.text}</strong>
                    {choice.diceRequired && (
                      <span className="badge badge-dice">
                        🎲 {choice.diceRequired.type} ≥ {choice.diceRequired.minValue}
                      </span>
                    )}
                    <p className="choice-target">
                      → {pages.find(p => p._id === choice.nextPage)?.title || 'Page supprimée'}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveChoice(index)}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="form-actions">
        <button type="button" className="btn btn-tertiary" onClick={onCancel}>
          ❌ Annuler
        </button>
        <button type="submit" className="btn btn-primary">
          💾 Enregistrer
        </button>
      </div>
    </form>
  );
}

export default PageForm;
