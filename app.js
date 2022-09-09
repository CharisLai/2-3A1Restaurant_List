//require packages used in the project
const express = require('express')
// Load mongoose
const mongoose = require('mongoose')
// Load body-parser
const bodyParser = require('body-parser')
// Load model
const Restaurant = require('./models/restaurant')

const app = express()

//set online to mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

const port = 3000
//require express-handlebars here
const exphbs = require('express-handlebars')
//setting restaurant.json
const restaurantList = require('./restaurant.json')

//setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))

//setting static files
app.use(express.static('public'))

//routes setting -index
app.get('/', (req, res) => {
  //past the restaurant data into 'index' partial template
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

//new layout
app.get("/restaurants/new", (req, res) => {
  res.render("new")
})

//routes -edit
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.error(error))
})

//routes show
app.get('/restaurants/:id', (req, res) => {
  console.log('===')
  const { id } = req.params
  Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})



//routes function_Search>>name&category
app.get('/search', (req, res) => {
  console.log('req.keyword', req.query.keyword)
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter((restaurant) => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.includes(keyword)
  })
  res.render('index', { restaurants, keyword })
})


//Create NewRestaurantData
app.post('/restaurants', (req, res) => {
  const object = req.body
  Restaurant.create({ object })
    .then(() => res.redirect("/"))
    .catch(error => console.error(error))
})

//routes -save
app.post('/restaurants/:id/edit', (req, res) => {
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

//start and listen on the Express sever
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})