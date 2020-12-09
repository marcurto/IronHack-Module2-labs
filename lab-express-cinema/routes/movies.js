const express = require('express');
const Movie = require('../models/movies');
const router  = express.Router();

router.get('/', (req, res, next) => {
    Movie.find()
    .then(allMovies => {
        console.log('All movies are retrieved', allMovies);
        res.render('movies', {movieArr: allMovies}); // Si no fico res, em pilla el fitxer index de dintre la carpeta celebrities
    })
    .catch(error => {
        next();
        console.log('Error');
    })
});

router.get('/:id', (req, res, next) => {
    Movie.findById(req.params.id)
    .then(allInfo => {
      res.render('seemore', {moviesDetails: allInfo}); // Com no es index, aquí li indico quin fitxer
    })
    .catch(error => {
        next();
      console.log('Error', error)
    })
  });


module.exports = router;