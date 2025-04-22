const express = require('express');
const cors = require('cors');
const { supabase } = require('./config/supabase');
const managersRoutes = require('./routes/managers');
const demandesCongeRoutes = require('./routes/demandes_conges');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 3000; // Utiliser le port dynamique de Render ou 3000 en local

// Configuration CORS pour accepter les requêtes venant de ton frontend déployé sur Render
const corsOptions = {
  origin: ['https://leave-request-app-1.onrender.com'], // URL de ton frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // Entêtes autorisés
};

app.use(cors(corsOptions)); // Utilisation de la configuration CORS
app.use(express.json()); // Pour parser le corps des requêtes en JSON

// Routes
app.use('/managers', managersRoutes);
app.use('/demandes_conges', demandesCongeRoutes);
app.use('/auth', authRoutes);

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`); // Affiche ce message si en local, sinon utilise l'URL de Render
});
