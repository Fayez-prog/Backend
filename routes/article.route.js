const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const Scategorie = require('../models/scategorie');

// Afficher tous les articles avec population de scategorieID
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find()
      .sort({ _id: -1 })
      .populate('scategorieID');
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Pagination des articles
router.get('/art/pagination', async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Numéro de page (par défaut: 1)
  const limit = parseInt(req.query.limit) || 10; // Articles par page (par défaut: 10)

  try {
    // Calculer le nombre total d'articles et de pages
    const totalArticles = await Article.countDocuments();
    const totalPages = Math.ceil(totalArticles / limit);

    // Récupérer les articles paginés
    const articles = await Article.find()
      .sort({ '_id': -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("scategorieID")
      .exec();

    res.status(200).json({
      articles,
      totalPages,
      currentPage: page,
      totalArticles
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// Créer un article
router.post('/', async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    await newArticle.save();
    
    // Retourne l'article avec scategorieID peuplé
    const article = await Article.findById(newArticle._id).populate('scategorieID');
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Chercher un article par ID
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate('scategorieID');
    if (!article) return res.status(404).json({ message: "Article non trouvé" });
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Modifier un article
router.put('/:id', async (req, res) => {
  try {
    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('scategorieID');
    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer un article
router.delete('/:id', async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Article supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Chercher les articles d'une sous-catégorie
router.get('/scat/:scategorieID', async (req, res) => {
  try {
    const articles = await Article.find({ scategorieID: req.params.scategorieID });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Chercher les articles d'une catégorie
router.get('/cat/:categorieID', async (req, res) => {
  try {
    // 1. Trouver toutes les sous-catégories de la catégorie
    const sousCategories = await Scategorie.find({ categorieID: req.params.categorieID });
    
    // 2. Extraire les IDs des sous-catégories
    const sousCategorieIDs = sousCategories.map(sc => sc._id);
    
    // 3. Trouver les articles correspondants
    const articles = await Article.find({ scategorieID: { $in: sousCategorieIDs } })
      .populate('scategorieID');
    
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;