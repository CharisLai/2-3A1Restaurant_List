// Load mongoose
const mongoose = require('mongoose')

// Load model
const restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json').results

//set online to mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
  
  restaurant.create(restaurantList)
    .then(() => {
      console.log('restaurantSeeder done!')
      db.close()
    })
    .catch(err => console.log (err))
})