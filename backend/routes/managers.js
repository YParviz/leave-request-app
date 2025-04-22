const express = require('express');
const { supabase } = require('../config/supabase');

const router = express.Router();

// Route API pour récupérer les managers
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('profils')
    .select('*')
    .eq('role', 'manager');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Route API pour supprimer un manager
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // Suppression du manager dans la table 'profils'
  const { error: profilsError } = await supabase
    .from('profils')
    .delete()
    .eq('id', id);

  if (profilsError) {
    return res.status(500).json({ error: profilsError.message });
  }

  // Suppression de l'utilisateur dans Supabase Auth
  const { error: userDeleteError } = await supabase.auth.api.deleteUser(id);

  if (userDeleteError) {
    return res.status(500).json({ error: userDeleteError.message });
  }

  res.status(200).json({ message: 'Manager supprimé avec succès' });
});

// Route API pour ajouter un manager
router.post('/', async (req, res) => {
  const { email, password, nom } = req.body;

  // Création d'un utilisateur dans Supabase Auth
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });

  if (signUpError) {
    return res.status(400).json({ error: signUpError.message });
  }

  const userId = signUpData.user?.id;

  // Insertion du manager dans la table 'profils'
  const { error: insertError } = await supabase
    .from('profils')
    .insert([{
      id: userId,
      nom: nom,
      email: email,
      role: 'manager'
    }]);

  if (insertError) {
    return res.status(400).json({ error: insertError.message });
  }

  res.status(201).json({ message: 'Manager créé avec succès' });
});

module.exports = router;
