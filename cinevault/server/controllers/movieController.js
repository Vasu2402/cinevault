const { Movie, Show, Theatre } = require('../models');

exports.getAllMovies = async (req, res) => {
  try {
    const { genre } = req.query;
    const where = genre && genre !== 'All' ? { genre } : {};
    const movies = await Movie.findAll({ where, order: [['createdAt', 'DESC']] });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id, {
      include: [{ model: Show, as: 'shows', include: [{ model: Theatre, as: 'theatre' }] }],
    });
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getShows = async (req, res) => {
  try {
    const shows = await Show.findAll({
      where: { movieId: req.params.movieId },
      include: [{ model: Theatre, as: 'theatre' }],
      order: [['date', 'ASC'], ['time', 'ASC']],
    });
    res.json(shows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
