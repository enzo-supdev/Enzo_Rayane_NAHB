import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './CommentsSection.css';

const CommentsSection = ({ storyId, commentService }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchComments();
  }, [storyId, page]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentService.getStoryComments(storyId, page);
      setComments(response.comments);
      setTotalPages(response.totalPages);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des commentaires');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      await commentService.createComment(storyId, {
        content: newComment,
        rating: rating > 0 ? rating : null
      });
      setNewComment('');
      setRating(0);
      setPage(1);
      await fetchComments();
    } catch (err) {
      setError('Erreur lors de la création du commentaire');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (commentId) => {
    if (!editText.trim()) return;

    try {
      await commentService.updateComment(commentId, { content: editText });
      setEditingComment(null);
      setEditText('');
      await fetchComments();
    } catch (err) {
      setError('Erreur lors de la modification du commentaire');
      console.error(err);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) return;

    try {
      await commentService.deleteComment(commentId);
      await fetchComments();
    } catch (err) {
      setError('Erreur lors de la suppression du commentaire');
      console.error(err);
    }
  };

  const handleLike = async (commentId) => {
    try {
      await commentService.toggleLike(commentId);
      await fetchComments();
    } catch (err) {
      console.error('Erreur lors du like:', err);
    }
  };

  const startEdit = (comment) => {
    setEditingComment(comment._id);
    setEditText(comment.content);
  };

  const renderStars = (currentRating, interactive = false, onRate = null) => {
    return (
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= currentRating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="comments-section">
      <h3>💬 Commentaires ({comments.length})</h3>

      {error && <div className="error-message">{error}</div>}

      {user && (
        <form className="comment-form" onSubmit={handleSubmit}>
          <div className="rating-input">
            <label>Note l'histoire:</label>
            {renderStars(rating, true, setRating)}
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Partagez votre avis sur cette histoire..."
            rows={4}
            required
          />
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Envoi...' : 'Publier le commentaire'}
          </button>
        </form>
      )}

      <div className="comments-list">
        {loading && comments.length === 0 ? (
          <div className="loading">Chargement...</div>
        ) : comments.length === 0 ? (
          <div className="no-comments">Aucun commentaire pour le moment. Soyez le premier à commenter !</div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <div className="comment-author">
                  <strong>{comment.author?.username || 'Utilisateur'}</strong>
                  {comment.rating && renderStars(comment.rating)}
                </div>
                <div className="comment-date">
                  {formatDate(comment.createdAt)}
                  {comment.isEdited && <span className="edited-tag">(modifié)</span>}
                </div>
              </div>

              {editingComment === comment._id ? (
                <div className="edit-form">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={3}
                  />
                  <div className="edit-actions">
                    <button onClick={() => handleEdit(comment._id)} className="save-btn">
                      Enregistrer
                    </button>
                    <button onClick={() => setEditingComment(null)} className="cancel-btn">
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <p className="comment-content">{comment.content}</p>
              )}

              <div className="comment-actions">
                <button onClick={() => handleLike(comment._id)} className="like-btn">
                  {comment.likes?.includes(user?._id) ? '❤️' : '🤍'} {comment.likes?.length || 0}
                </button>
                {user && comment.author?._id === user._id && !editingComment && (
                  <>
                    <button onClick={() => startEdit(comment)} className="edit-btn">
                      ✏️ Modifier
                    </button>
                    <button onClick={() => handleDelete(comment._id)} className="delete-btn">
                      🗑️ Supprimer
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="page-btn"
          >
            ← Précédent
          </button>
          <span className="page-info">
            Page {page} sur {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="page-btn"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
