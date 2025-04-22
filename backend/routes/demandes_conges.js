const express = require('express');
const { supabase } = require('../config/supabase');

const router = express.Router();

// Route API pour soumettre une demande de congé
router.post('/', async (req, res) => {
  const { userId, debut, fin, type, commentaire } = req.body;

  // Récupérer l'email du manager depuis le profil de l'utilisateur
  const { data: profil, error: profilError } = await supabase
    .from('profils')
    .select('manager')
    .eq('id', userId)
    .single();

  if (profilError) {
    return res.status(500).json({ error: 'Erreur profil: ' + profilError.message });
  }

  // Insérer la demande de congé dans la table 'demandes_conges'
  const { error: insertError } = await supabase
    .from('demandes_conges')
    .insert([{
      nom: userId,  
      debut,
      fin,
      type_conge: type,
      commentaire,
      manager: profil.manager // On envoie la demande au manager spécifié dans le profil
    }]);

  if (insertError) {
    return res.status(500).json({ error: 'Erreur insertion : ' + insertError.message });
  }

  res.status(201).json({ message: 'Demande de congé envoyée avec succès' });
});

// Route API pour changer le statut d'une demande de congé
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  // Mettre à jour le statut de la demande de congé
  const { error } = await supabase
    .from('demandes_conges')
    .update({ statut })
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: 'Erreur lors de la mise à jour du statut : ' + error.message });
  }

  res.status(200).json({ message: 'Statut de la demande mis à jour avec succès' });
});

module.exports = router;
