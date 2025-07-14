const express = require('express');
const router = express.Router();
const Scategorie = require('../models/scategorie');

// Afficher toutes les sous-catégories avec population de categorieID
router.get('/', async (req, res) => {
  try {
    const scategories = await Scategorie.find()
      .sort({ _id: -1 })
      .populate('categorieID');
    res.status(200).json(scategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer une sous-catégorie
router.post('/', async (req, res) => {
  try {
    const newScategorie = new Scategorie(req.body);
    await newScategorie.save();
    res.status(201).json(newScategorie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Chercher une sous-catégorie par ID
router.get('/:id', async (req, res) => {
  try {
    const scategorie = await Scategorie.findById(req.params.id);
    if (!scategorie) return res.status(404).json({ message: "Sous-catégorie non trouvée" });
    res.status(200).json(scategorie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Modifier une sous-catégorie
router.put('/:id', async (req, res) => {
  try {
    const updatedScategorie = await Scategorie.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedScategorie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer une sous-catégorie
router.delete('/:id', async (req, res) => {
  try {
    await Scategorie.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Sous-catégorie supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Chercher les sous-catégories d'une catégorie spécifique
router.get('/cat/:categorieID', async (req, res) => {
  try {
    const scategories = await Scategorie.find({ categorieID: req.params.categorieID });
    res.status(200).json(scategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;