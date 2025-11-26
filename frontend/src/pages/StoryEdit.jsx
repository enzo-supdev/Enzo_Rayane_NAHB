import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import storyService from '../services/storyService';
import pageService from '../services/pageService';
import choiceService from '../services/choiceService';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';

export default function StoryEdit() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [story, setStory] = useState(null);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPageForm, setShowPageForm] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: ''
  });
  const [pageForm, setPageForm] = useState({
    content: '',
    isEnd: false
  });

  useEffect(() => {
    fetchStory();
  }, [storyId]);

  const fetchStory = async () => {
    try {
      setLoading(true);
      const response = await storyService.getStoryById(storyId);
      setStory(response.story);
      setFormData({
        title: response.story.title,
        description: response.story.description,
        tags: (Array.isArray(response.story.tags) ? response.story.tags : []).join(', ')
      });
      
      // Fetch pages
      const pagesResponse = await pageService.getPagesByStory(storyId);
      setPages(pagesResponse.pages || []);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors du chargement de l\'histoire');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePageFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPageForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddPage = async (e) => {
    e.preventDefault();
    
    if (!pageForm.content.trim()) {
      setError('Le contenu de la page est requis');
      return;
    }

    try {
      const newPage = await pageService.createPage({
        storyId,
        content: pageForm.content,
        isEnd: pageForm.isEnd,
        order: pages.length
      });

      setPages([...pages, newPage.page]);
      setPageForm({ content: '', isEnd: false });
      setShowPageForm(false);

      // Si c'est la première page, la définir comme page de départ
      if (pages.length === 0) {
        await storyService.updateStory(storyId, { startPageId: newPage.page.id });
        setStory(prev => ({ ...prev, startPageId: newPage.page.id }));
      }
    } catch (err) {
      console.error('Erreur création page:', err);
      setError('Erreur lors de la création de la page');
    }
  };

  const handlePublish = async () => {
    if (pages.length === 0) {
      setError('Vous devez créer au moins une page avant de publier');
      return;
    }

    try {
      await storyService.publishStory(storyId);
      setStory(prev => ({ ...prev, status: 'PUBLISHED' }));
      navigate('/dashboard', { state: { message: 'Histoire publiée avec succès!' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la publication');
    }
  };

  const handleDeletePage = async (pageId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) {
      try {
        await pageService.deletePage(pageId);
        setPages(pages.filter(p => p.id !== pageId));
      } catch (err) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  if (loading) return <div className="loading">Chargement...</div>;
  if (!story) return <div className="error-message">Histoire non trouvée</div>;

  if (user?.id !== story.authorId && user?.role !== 'ADMIN') {
    return (
      <>
        <Navbar />
        <div className="page-container error-container">
          <h1>Accès refusé</h1>
          <p>Vous n'avez pas la permission d'éditer cette histoire.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1>✏️ Éditer: {story.title}</h1>
          <p>Status: <strong>{story.status}</strong></p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Section pages */}
        <div className="story-edit-section">
          <h2>Pages ({pages.length})</h2>
          
          {pages.length === 0 ? (
            <p className="empty-message">Aucune page créée. Créez votre première page pour commencer!</p>
          ) : (
            <div className="pages-list">
              {pages.map((page, index) => (
                <div key={page.id} className="page-item">
                  <div className="page-header-mini">
                    <strong>Page {index + 1}</strong>
                    {page.isEnd && <span className="badge-end">FIN</span>}
                    {story.startPageId === page.id && <span className="badge-start">DÉPART</span>}
                  </div>
                  <p>{page.content.substring(0, 100)}...</p>
                  <div className="page-actions">
                    <button 
                      className="btn-small"
                      onClick={() => navigate(`/pages/${page.id}/edit`)}
                    >
                      Éditer
                    </button>
                    <button 
                      className="btn-small btn-danger"
                      onClick={() => handleDeletePage(page.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showPageForm ? (
            <form onSubmit={handleAddPage} className="page-form">
              <div className="form-group">
                <label htmlFor="content">Contenu de la page *</label>
                <textarea
                  id="content"
                  name="content"
                  value={pageForm.content}
                  onChange={handlePageFormChange}
                  placeholder="Écrivez le contenu de cette page..."
                  rows={6}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="isEnd"
                    checked={pageForm.isEnd}
                    onChange={handlePageFormChange}
                  />
                  Ceci est une page de fin
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Créer la page
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowPageForm(false);
                    setPageForm({ content: '', isEnd: false });
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <button 
              className="btn-primary"
              onClick={() => setShowPageForm(true)}
            >
              + Ajouter une page
            </button>
          )}
        </div>

        {/* Section actions */}
        <div className="story-actions">
          {story.status === 'DRAFT' && pages.length > 0 && (
            <button 
              className="btn-success"
              onClick={handlePublish}
            >
              🚀 Publier l'histoire
            </button>
          )}
          <button 
            className="btn-secondary"
            onClick={() => navigate('/dashboard')}
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    </>
  );
}
