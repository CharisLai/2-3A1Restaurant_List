//require packages used in the project
const express = require('express')
// Load mongoose
const mongoose = require('mongoose')

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



//routes show
app.get('/restaurants/:id', (req, res) => {
  const {id} = req.params
  Restaurant.findById(id)
  .lean()
  .then( restaurants => res.render('show', { restaurants }))
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


//start and listen on the Express sever
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})