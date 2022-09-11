// require packages used in the project
const express = require('express')
const mongoose = require('mongoose') // Load mongoose
const bodyParser = require('body-parser') // Load body-parser
const methodOverride = require('method-override') // Load method-override
const Restaurant = require('./models/restaurant') // Load model
const app = express()

// set online to mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

const port = 3000
// require express-handlebars here
const exphbs = require('express-handlebars')
// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('_method')) // setting methodOverride
app.use(express.static('public'))// setting static files

// routes setting -index
app.get('/', (req, res) => {
  // past the restaurant data into 'index' partial template
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

// new layout
app.get('/restaurants/new', (req, res) => {
  res.render('new')
})

// routes -edit
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.error(error))
})

// routes show
app.get('/restaurants/:id', (req, res) => {
  const { id } = req.params
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})

// routes function_Search>>name&category
app.get('/search', (req, res) => {
  console.log('req.keyword', req.query.keyword)
  const keyword = req.query.keyword.trim().toLowerCase()
  return Restaurant.find()
    .lean()
    .then(restaurant => {
      const Search = restaurant.filter((restaurant) => {
        return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword)
      })
      res.render('index', { restaurants: Search, keyword })
    })
})

// Create NewRestaurantData
app.post('/restaurants', (req, res) => {
  Restaurant.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

// routes -edit-save
app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = name
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// routes -delete
app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant =>
      restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// start and listen on the Express sever
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
