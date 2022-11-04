const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant') // Load model

// new layout
router.get('/new', (req, res) => {
  res.render('new')
})

// routes -edit
router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.error(error))
})

// routes show
router.get('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})

// Create NewRestaurantData
router.post('/', (req, res) => {
  const userId = req.user._id
  return Restaurant.create({ ...req.body, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// routes -edit-save
router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOneAndUpdate({ _id, userId }, req.body)
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})

// routes -delete
router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Restaurant.findOneAndDelete({ _id, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

module.exports = router
