import { useState } from 'react';
import './ChoiceForm.css';

function ChoiceForm({ pages, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    text: '',
    nextPage: '',
    hasDiceRequirement: false,
    diceRequired: {
      type: 'd20',
      minValue: 10
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('dice.')) {
      const diceField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        diceRequired: {
          ...prev.diceRequired,
          [diceField]: diceField === 'minValue' ? parseInt(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const choiceData = {
      text: formData.text,
      nextPage: formData.nextPage,
      ...(formData.hasDiceRequirement && { diceRequired: formData.diceRequired })
    };
    onSave(choiceData);
  };

  return (
    <form onSubmit={handleSubmit} className="choice-form">
      <h3>➕ Ajouter un Choix</h3>

      <div className="form-group">
        <label htmlFor="text">
          Texte du Choix <span className="required">*</span>
        </label>
        <input
          type="text"
          id="text"
          name="text"
          value={formData.text}
          onChange={handleChange}
          required
          placeholder="Ex: Ouvrir la porte mystérieuse"
        />
      </div>

      <div className="form-group">
        <label htmlFor="nextPage">
          Page de Destination <span className="required">*</span>
        </label>
        <select
          id="nextPage"
          name="nextPage"
          value={formData.nextPage}
          onChange={handleChange}
          required
        >
          <option value="">-- Sélectionnez une page --</option>
          {pages.map(page => (
            <option key={page._id} value={page._id}>
              {page.title} {page.isEnding ? '🏁' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="hasDiceRequirement"
            checked={formData.hasDiceRequirement}
            onChange={handleChange}
          />
          <span>🎲 Nécessite un jet de dés</span>
        </label>
      </div>

      {formData.hasDiceRequirement && (
        <div className="dice-options">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="diceType">Type de Dé</label>
              <select
                id="diceType"
                name="dice.type"
                value={formData.diceRequired.type}
                onChange={handleChange}
              >
                <option value="d4">🎲 D4 (1-4)</option>
                <option value="d6">🎲 D6 (1-6)</option>
                <option value="d8">🎲 D8 (1-8)</option>
                <option value="d10">🎲 D10 (1-10)</option>
                <option value="d12">🎲 D12 (1-12)</option>
                <option value="d20">🎲 D20 (1-20)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="minValue">Valeur Minimale</label>
              <input
                type="number"
                id="minValue"
                name="dice.minValue"
                value={formData.diceRequired.minValue}
                onChange={handleChange}
                min={1}
                max={20}
              />
            </div>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="btn btn-tertiary btn-sm" onClick={onCancel}>
          ❌ Annuler
        </button>
        <button type="submit" className="btn btn-primary btn-sm">
          ✅ Ajouter
        </button>
      </div>
    </form>
  );
}

export default ChoiceForm;
