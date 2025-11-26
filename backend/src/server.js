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
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/endings', require('./routes/endings'));
app.use('/api/author', require('./routes/author'));
app.use('/api/statistics', require('./routes/statistics'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/tree', require('./routes/tree'));
app.use('/api/interactive', require('./routes/interactive'));
app.use('/api/journey', require('./routes/journey'));
app.use('/api/images', require('./routes/images'));
app.use('/api/dice', require('./routes/dice'));

// Gestionnaire d'erreurs (doit être après les routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 Serveur démarré sur le port', PORT);
});
