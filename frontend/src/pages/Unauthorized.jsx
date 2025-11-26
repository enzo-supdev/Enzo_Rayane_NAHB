import React from 'react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="unauthorized">
      <h1>401 - Accès non autorisé</h1>
      <p>Vous n'avez pas accès à cette ressource.</p>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
}
