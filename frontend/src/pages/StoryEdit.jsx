import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import storyService from '../services/storyService';
import pageService from '../services/pageService';
import PageForm from '../components/author/PageForm';
import ChoiceForm from '../components/author/ChoiceForm';
import './StoryEdit.css';

function StoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [story, setStory] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pages'); // 'pages' ou 'story'

  useEffect(() => {
    loadStoryData();
  }, [id]);

  const loadStoryData = async () => {
    try {
      setLoading(true);
      const [storyData, pagesData] = await Promise.all([
        storyService.getStory(id),
        pageService.getPagesByStory(id)
      ]);
      setStory(storyData);
      setPages(pagesData);
    } catch (err) {
      setError('Erreur lors du chargement');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStory = async (updatedData) => {
    try {
      await storyService.updateStory(id, updatedData);
      setStory({ ...story, ...updatedData });
      alert('Histoire mise à jour !');
    } catch (err) {
      alert('Erreur lors de la mise à jour');
      console.error(err);
    }
  };

  const handleTogglePublish = async () => {
    try {
      const updated = await storyService.updateStory(id, {
        isPublished: !story.isPublished
      });
      setStory(updated);
    } catch (err) {
      alert('Erreur lors de la publication');
    }
  };

  const handleCreatePage = async (pageData) => {
    try {
      const newPage = await pageService.createPage(id, pageData);
      setPages([...pages, newPage]);
      setSelectedPage(newPage);
      alert('Page créée !');
    } catch (err) {
      alert('Erreur lors de la création');
      console.error(err);
    }
  };

  const handleUpdatePage = async (pageId, pageData) => {
    try {
      const updated = await pageService.updatePage(pageId, pageData);
      setPages(pages.map(p => p._id === pageId ? updated : p));
      setSelectedPage(updated);
      alert('Page mise à jour !');
    } catch (err) {
      alert('Erreur lors de la mise à jour');
      console.error(err);
    }
  };

  const handleDeletePage = async (pageId) => {
    if (!confirm('Supprimer cette page ?')) return;
    
    try {
      await pageService.deletePage(pageId);
      setPages(pages.filter(p => p._id !== pageId));
      if (selectedPage?._id === pageId) {
        setSelectedPage(null);
      }
      alert('Page supprimée !');
    } catch (err) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleSetFirstPage = async (pageId) => {
    try {
      await storyService.updateStory(id, { firstPage: pageId });
      setStory({ ...story, firstPage: pageId });
      alert('Page de départ définie !');
    } catch (err) {
      alert('Erreur');
    }
  };

  if (loading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }

  if (error || !story) {
    return (
      <div className="container">
        <div className="alert alert-error">{error || 'Histoire introuvable'}</div>
      </div>
    );
  }

  return (
    <div className="story-edit-page">
      <div className="editor-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>✍️ {story.title}</h1>
              <p className="story-status">
                {story.isPublished ? (
                  <span className="badge badge-success">📢 Publié</span>
                ) : (
                  <span className="badge badge-warning">📝 Brouillon</span>
                )}
                <span className="page-count">📄 {pages.length} page{pages.length > 1 ? 's' : ''}</span>
              </p>
            </div>
            <div className="header-actions">
              <button
                className="btn btn-secondary"
                onClick={handleTogglePublish}
              >
                {story.isPublished ? '📥 Mettre en Brouillon' : '📢 Publier'}
              </button>
              <button
                className="btn btn-tertiary"
                onClick={() => navigate('/author/dashboard')}
              >
                🏠 Retour
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="editor-container">
        <div className="container">
          <div className="editor-tabs">
            <button
              className={`tab ${activeTab === 'pages' ? 'active' : ''}`}
              onClick={() => setActiveTab('pages')}
            >
              📄 Pages & Choix
            </button>
            <button
              className={`tab ${activeTab === 'story' ? 'active' : ''}`}
              onClick={() => setActiveTab('story')}
            >
              ⚙️ Paramètres de l'Histoire
            </button>
          </div>

          {activeTab === 'pages' ? (
            <div className="editor-layout">
              {/* Liste des pages */}
              <div className="pages-sidebar">
                <div className="sidebar-header">
                  <h3>📚 Pages</h3>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setSelectedPage('new')}
                  >
                    ➕ Nouvelle
                  </button>
                </div>

                <div className="pages-list">
                  {pages.length === 0 ? (
                    <div className="empty-state">
                      <p>Aucune page</p>
                      <small>Créez votre première page</small>
                    </div>
                  ) : (
                    pages.map(page => (
                      <div
                        key={page._id}
                        className={`page-item ${selectedPage?._id === page._id ? 'active' : ''}`}
                        onClick={() => setSelectedPage(page)}
                      >
                        <div className="page-item-header">
                          <h4>{page.title}</h4>
                          {story.firstPage === page._id && (
                            <span className="badge badge-primary">🚀 Départ</span>
                          )}
                          {page.isEnding && (
                            <span className="badge badge-success">🏁 Fin</span>
                          )}
                        </div>
                        <p className="page-item-meta">
                          {page.choices?.length || 0} choix
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Éditeur de page */}
              <div className="page-editor">
                {selectedPage === 'new' ? (
                  <PageForm
                    storyId={id}
                    pages={pages}
                    onSave={handleCreatePage}
                    onCancel={() => setSelectedPage(null)}
                  />
                ) : selectedPage ? (
                  <div>
                    <div className="editor-toolbar">
                      <h2>📝 {selectedPage.title}</h2>
                      <div className="toolbar-actions">
                        {story.firstPage !== selectedPage._id && (
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleSetFirstPage(selectedPage._id)}
                          >
                            🚀 Définir comme Départ
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-tertiary"
                          onClick={() => handleDeletePage(selectedPage._id)}
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>

                    <PageForm
                      storyId={id}
                      page={selectedPage}
                      pages={pages}
                      onSave={(data) => handleUpdatePage(selectedPage._id, data)}
                      onCancel={() => setSelectedPage(null)}
                    />

                    {/* Choix existants */}
                    {selectedPage.choices && selectedPage.choices.length > 0 && (
                      <div className="choices-section">
                        <h3>🔀 Choix de cette page</h3>
                        <div className="choices-list">
                          {selectedPage.choices.map((choice, idx) => (
                            <div key={idx} className="choice-card">
                              <div className="choice-header">
                                <strong>{choice.text}</strong>
                                {choice.diceRequired && (
                                  <span className="badge badge-info">
                                    🎲 {choice.diceRequired.type} ≥ {choice.diceRequired.minValue}
                                  </span>
                                )}
                              </div>
                              <p className="choice-meta">
                                → {pages.find(p => p._id === choice.nextPage)?.title || 'Page inconnue'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="empty-state large">
                    <span className="empty-icon">📄</span>
                    <h3>Sélectionnez une page</h3>
                    <p>Ou créez-en une nouvelle pour commencer</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="story-settings">
              <div className="settings-form">
                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={story.title}
                    onChange={(e) => setStory({ ...story, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    value={story.description}
                    onChange={(e) => setStory({ ...story, description: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Synopsis</label>
                  <textarea
                    rows={6}
                    value={story.synopsis}
                    onChange={(e) => setStory({ ...story, synopsis: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Thème</label>
                    <select
                      value={story.theme}
                      onChange={(e) => setStory({ ...story, theme: e.target.value })}
                    >
                      <option value="fantasy">Fantasy</option>
                      <option value="historical">Historique</option>
                      <option value="horror">Horreur</option>
                      <option value="adventure">Aventure</option>
                      <option value="mystery">Mystère</option>
                      <option value="sci-fi">Science-Fiction</option>
                      <option value="romance">Romance</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Difficulté</label>
                    <select
                      value={story.difficulty}
                      onChange={(e) => setStory({ ...story, difficulty: e.target.value })}
                    >
                      <option value="easy">Facile</option>
                      <option value="medium">Moyen</option>
                      <option value="hard">Difficile</option>
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleUpdateStory({
                      title: story.title,
                      description: story.description,
                      synopsis: story.synopsis,
                      theme: story.theme,
                      difficulty: story.difficulty
                    })}
                  >
                    💾 Enregistrer les Modifications
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StoryEdit;
