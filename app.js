// require packages used in the project
const express = require('express')
const bodyParser = require('body-parser') // Load body-parser
const methodOverride = require('method-override') // Load method-override
const exphbs = require('express-handlebars') // require express-handlebars here
const routes = require('./routes')

const app = express()
const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' })) // setting template engine
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method')) // setting methodOverride
app.use(express.static('public'))// setting static files
require('./config/mongoose') // refactor mongoose config
app.use(routes)

// start and listen on the Express sever
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
