const mongoose = require('mongoose')
if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config()
}
const url = process.env.MONGODB_URI

mongoose.connect(url, { useMongoClient: true })
mongoose.Promise = global.Promise

const Person = mongoose.model('Person', {
    name: String,
    number: Number
})

module.exports = Person