const express = require('express');
const router = express.Router();
const Categorie = require('../models/categorie');

// Afficher toutes les catégories (triées par _id décroissant)
router.get('/', async (req, res) => {
  try {
    const categories = await Categorie.find().sort({ _id: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer une catégorie
router.post('/', async (req, res) => {
  const { nomcategorie, imagecategorie } = req.body;
  try {
    const newCategorie = new Categorie({ nomcategorie, imagecategorie });
    await newCategorie.save();
    res.status(201).json(newCategorie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Chercher une catégorie par ID
router.get('/:id', async (req, res) => {
  try {
    const categorie = await Categorie.findById(req.params.id);
    if (!categorie) return res.status(404).json({ message: "Catégorie non trouvée" });
    res.status(200).json(categorie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Modifier une catégorie
router.put('/:id', async (req, res) => {
  try {
    const updatedCategorie = await Categorie.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedCategorie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer une catégorie
router.delete('/:id', async (req, res) => {
  try {
    await Categorie.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Catégorie supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;