const express = require('express')

const router = express.Router()

const Restaurant = require('../../models/restaurant') // Load model

// routes setting -index
router.get('/', (req, res) => {
  // past the restaurant data into 'index' partial template
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})
module.exports = router
