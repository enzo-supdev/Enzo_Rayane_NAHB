const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./config/database');
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

// Gestionnaire d'erreurs (doit être après les routes)
app.use(errorHandler);

// Connexion MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 Serveur démarré sur le port', PORT);
});
