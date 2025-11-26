const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes de base
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API NAHB en ligne' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/pages', require('./routes/pages')); 
app.use('/api/choices', require('./routes/choices'));
app.use('/api/game', require('./routes/game'));     
app.use('/api/admin', require('./routes/admin'));

// Gestionnaire d'erreurs (doit être après les routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 Serveur démarré sur le port', PORT);
});
