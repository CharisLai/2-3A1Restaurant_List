const express = require('express')

const router = express.Router()

const Restaurant = require('../../models/restaurant') // Load model

// routes setting -index
router.get('/', (req, res) => {
  const userId = req.user._id
  // past the restaurant data into 'index' partial template
  Restaurant.find({ userId })
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

router.get('/sortby', (req, res) => {
  const sortby = req.query.sort
  if (sortby === 'name') {
    return Restaurant.find()
      .lean()
      .sort({ name: 'asc' })
      .then(restaurants => res.render('index', { restaurants }))
      .catch(error => console.error(error))
  } else if (sortby === 'name-deasc') {
    return Restaurant.find()
      .lean()
      .sort({ name: 'desc' })
      .then(restaurants => res.render('index', { restaurants }))
  } else if (sortby === 'category') {
    return Restaurant.find()
      .lean()
      .sort({ location: 'asc' })
      .then(restaurants => res.render('index', { restaurants }))
      .catch(error => console.error(error))
  } else if (sortby === 'location') {
    return Restaurant.find()
      .lean()
      .sort({ location: 'asc' })
      .then(restaurants => res.render('index', { restaurants }))
      .catch(error => console.error(error))
  }
})
// routes function_Search>>name&category
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase()
  Restaurant.find()
    .lean()
    .then(restaurants => {
      const Restaurants = restaurants.filter(restaurant => {
        const NameMatched = restaurants.name.toLowerCase().includes(keyword)
        const CategoryMatched = restaurants.category.toLowerCase().includes(keyword)
        return (NameMatched || CategoryMatched)
      })
    })
    .then(res.render('index', { restaurant, keyword }))
    .catch(error => console.error(error))
})
module.exports = router
