//require packages used in the project
const express = require('express')
const app = express()
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
  res.render('index', { restaurants: restaurantList.results });
})

//routes show
app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', { restaurant })
})
//routes function_Search
app.get('/search', (req, res) => {
  console.log('req.keyword', req.query.keyword)
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter((restaurant) => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurants: restaurants })
})


//start and listen on the Express sever
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})