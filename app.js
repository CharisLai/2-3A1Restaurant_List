// require packages used in the project
const express = require('express')

const bodyParser = require('body-parser') // Load body-parser
const methodOverride = require('method-override') // Load method-override

const routes = require('./routes')
require('./config/mongoose') // refactor mongoose config
const app = express()
const port = 3000
// require express-handlebars here
const exphbs = require('express-handlebars')
// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('_method')) // setting methodOverride

app.use(express.static('public'))// setting static files
app.use(routes)

// start and listen on the Express sever
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
