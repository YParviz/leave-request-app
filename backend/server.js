const express = require('express');
const cors = require('cors');
const { supabase } = require('./config/supabase');
const managersRoutes = require('./routes/managers');
const demandesCongeRoutes = require('./routes/demandes_conges');
const authRoutes = require('./routes/auth');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/managers', managersRoutes);
app.use('/demandes_conges', demandesCongeRoutes);
app.use('/auth', authRoutes);

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
