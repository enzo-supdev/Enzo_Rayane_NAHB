import { useState } from 'react';
import './ChoiceForm.css';

function ChoiceForm({ pages, onSave, onCancel, story }) {
  const [formData, setFormData] = useState({
    text: '',
    nextPage: '',
    hasDiceRequirement: false,
    diceRequired: {
      type: 'd20',
      minValue: 10
    },
    actionType: 'none',
    actionEffects: {
      healthChange: 0,
      attackChange: 0,
      defenseChange: 0,
      magicChange: 0
    },
    actionDescription: ''
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
    } else if (name.startsWith('effect.')) {
      const effectField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        actionEffects: {
          ...prev.actionEffects,
          [effectField]: parseInt(value) || 0
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
      ...(formData.hasDiceRequirement && { diceRequired: formData.diceRequired }),
      actionType: formData.actionType,
      ...(formData.actionType !== 'none' && { 
        actionEffects: formData.actionEffects,
        actionDescription: formData.actionDescription
      })
    };
    onSave(choiceData);
  };

  return (
    <div className="choice-form">
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

      {/* Effets de Combat */}
      {story?.combatSystem?.enabled && (
        <div className="combat-effects-section">
          <h4>⚔️ Effets de Combat</h4>
          
          <div className="form-group">
            <label htmlFor="actionType">Type d'Action</label>
            <select
              id="actionType"
              name="actionType"
              value={formData.actionType}
              onChange={handleChange}
            >
              <option value="none">Aucun effet</option>
              <option value="damage">💥 Dégâts (perte de HP)</option>
              <option value="heal">💚 Soin (gain de HP)</option>
              <option value="attack">⚔️ Attaque (modification attaque)</option>
              <option value="defend">🛡️ Défense (modification défense)</option>
              <option value="buff">✨ Buff (amélioration stats)</option>
              <option value="debuff">💀 Debuff (réduction stats)</option>
            </select>
          </div>

          {formData.actionType !== 'none' && (
            <>
              <div className="form-group">
                <label htmlFor="actionDescription">Description de l'Action</label>
                <input
                  type="text"
                  id="actionDescription"
                  name="actionDescription"
                  value={formData.actionDescription}
                  onChange={handleChange}
                  placeholder="Ex: Vous perdez 20 HP dans le combat"
                  maxLength={200}
                />
                <small>Décrit l'effet pour les joueurs</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="healthChange">
                    HP ({formData.actionEffects.healthChange >= 0 ? '+' : ''}{formData.actionEffects.healthChange})
                  </label>
                  <input
                    type="number"
                    id="healthChange"
                    name="effect.healthChange"
                    value={formData.actionEffects.healthChange}
                    onChange={handleChange}
                    placeholder="Négatif = dégâts, Positif = soin"
                  />
                  <small>{formData.actionEffects.healthChange < 0 ? '❤️ Perte de HP' : formData.actionEffects.healthChange > 0 ? '💚 Soin' : 'Aucun effet'}</small>
                </div>

                <div className="form-group">
                  <label htmlFor="attackChange">
                    Attaque ({formData.actionEffects.attackChange >= 0 ? '+' : ''}{formData.actionEffects.attackChange})
                  </label>
                  <input
                    type="number"
                    id="attackChange"
                    name="effect.attackChange"
                    value={formData.actionEffects.attackChange}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="defenseChange">
                    Défense ({formData.actionEffects.defenseChange >= 0 ? '+' : ''}{formData.actionEffects.defenseChange})
                  </label>
                  <input
                    type="number"
                    id="defenseChange"
                    name="effect.defenseChange"
                    value={formData.actionEffects.defenseChange}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="magicChange">
                    Magie ({formData.actionEffects.magicChange >= 0 ? '+' : ''}{formData.actionEffects.magicChange})
                  </label>
                  <input
                    type="number"
                    id="magicChange"
                    name="effect.magicChange"
                    value={formData.actionEffects.magicChange}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="btn btn-tertiary btn-sm" onClick={onCancel}>
          ❌ Annuler
        </button>
        <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit}>
          ✅ Ajouter
        </button>
      </div>
    </div>
  );
}

export default ChoiceForm;
