// require packages used in the project
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser') // Load body-parser
const methodOverride = require('method-override') // Load method-override
const flash = require('connect-flash')
const exphbs = require('express-handlebars') // require express-handlebars here

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const routes = require('./routes')
const usePassport = require('./config/passport')
const app = express()
const port = process.env.PORT

app.engine('handlebars', exphbs({ defaultLayout: 'main' })) // setting template engine
app.set('view engine', 'handlebars')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method')) // setting methodOverride
usePassport(app)
app.use(flash())
app.use(express.static('public'))// setting static files
require('./config/mongoose') // refactor mongoose config
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error = req.flash('errors')
  next()
})
app.use(routes)

// start and listen on the Express sever
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
