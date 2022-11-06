const express = require('express')

const router = express.Router()

const Restaurant = require('../../models/restaurant') // Load model

// routes function_Search>>name&category
router.get('/search', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  return Restaurant.find()
    .lean()
    .then((restaurant) => {
      const Search = restaurant.filter((data) => {
        return data.name.toLowerCase().includes(keyword) || data.category.includes(keyword)
      })
      res.render('index', { restaurants: Search, keyword })
      console.log(keyword)
    })
    .catch(error => {
      console.error(error)
      res.render('error')
    })
})

// routes setting -index
router.get('/', (req, res) => {
  const userId = req.user._id
  // past the restaurant data into 'index' partial template
  Restaurant.find({ userId })
    .lean()
    .then(restaurants => res.render('index', { restaurants }
    ))
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

module.exports = router
