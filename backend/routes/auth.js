const express = require('express');
const { supabase } = require('../config/supabase');

const router = express.Router();

// Route API pour la connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Connexion via Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  const userId = data.user?.id;

  if (!userId) {
    return res.status(400).json({ error: 'Connexion échouée.' });
  }

  // Aller chercher le rôle dans la table 'profils'
  const { data: profil, error: profilError } = await supabase
    .from('profils')
    .select('role')
    .eq('id', userId)
    .single();

  if (profilError || !profil) {
    return res.status(500).json({ error: 'Erreur de récupération du profil.' });
  }

  // Retourner le rôle de l'utilisateur
  res.json({ role: profil.role });
});

// Route API pour récupérer la liste des managers
router.get('/managers', async (req, res) => {
  const { data, error } = await supabase
    .from('profils')
    .select('email, nom')
    .eq('role', 'manager');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Route API pour l'inscription d'un utilisateur
router.post('/signup', async (req, res) => {
  const { nom, email, password, manager } = req.body;

  // Inscription de l'utilisateur via Supabase Auth
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });

  if (signUpError) {
    return res.status(400).json({ error: signUpError.message });
  }

  // Insertion du profil dans la table 'profils'
  const userId = signUpData.user?.id;
  const { error: insertError } = await supabase
    .from('profils')
    .insert([{ id: userId, nom, email, manager, role: 'employe' }]);

  if (insertError) {
    return res.status(400).json({ error: insertError.message });
  }

  res.status(201).json({ message: 'Utilisateur inscrit avec succès.' });
});

module.exports = router;
