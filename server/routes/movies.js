const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Op } = require('sequelize');
const Movie = require('../models/Movie');
const { auth } = require('../middleware/auth');

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: './server/uploads/',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// @route   GET api/movies
router.get('/', async (req, res) => {
  const { search, category } = req.query;
  let where = {};
  if (search) where.title = { [Op.like]: `%${search}%` };
  if (category) where.category = category;

  try {
    const movies = await Movie.findAll({ where });
    res.json(movies);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   GET api/movies/:id
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/movies
router.post('/', [auth, upload.single('video')], async (req, res) => {
  const { title, description, category, videoUrl, isExternal } = req.body;
  try {
    const movie = await Movie.create({
      title,
      description,
      category,
      videoUrl: isExternal === 'true' ? videoUrl : null,
      videoPath: req.file ? `/uploads/${req.file.filename}` : null,
      isExternal: isExternal === 'true',
      userId: req.user.id,
    });
    res.json(movie);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
