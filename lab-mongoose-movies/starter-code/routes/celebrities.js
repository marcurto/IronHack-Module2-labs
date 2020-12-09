const express = require('express');
const Celebrity = require('../models/celebrity');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
    Celebrity.find()
    .then(allCelebrities => {
        console.log('All celebrities are retrieved', allCelebrities);
        res.render('celebrities', {celebrityArr: allCelebrities}); // Si no fico res, em pilla el fitxer index de dintre la carpeta celebrities
    })
    .catch(error => {
        next();
        console.log('Error');
    })
});

router.get('/:id', (req, res, next) => {
    Celebrity.findById(req.params.id)
    .then(allInfo => {
      res.render('celebrities/show', {celebritiesDetails: allInfo}); // Com no es index, aquí li indico quin fitxer
    })
    .catch(error => {
        next();
      console.log('Error', error)
    })
  });

  router.get('/new', (req, res, next) => {
      res.render('celebrities/new'); // Com no es index, aquí li indico quin fitxer
    });

    router.post('/', (req, res, next) => {
        const { name, occupation, catchPhrase } = req.body;
        const newCelebrity = new Celebrity({ name, occupation, catchPhrase });
        newCelebrity.save()
        .then((editCelebrity) => {
          res.redirect('/celebrities');
        })
        .catch((error) => {
            res.redirect('/new');
        })
      });

      router.post('/:id/delete', (req, res, next) => {
        Celebrity.findByIdAndRemove(req.params.id)
        .then((removedCelebrity) => {
          res.redirect('/celebrities');
        })
        .catch((error) => {
            next();
        })
      });
  



module.exports = router;
