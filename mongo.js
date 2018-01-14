const mongoose = require('mongoose')
require('console.table');


if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config()
}

const url = process.env.MONGODB_URI

// voit tarkistaa mongoosen version tiedostosta package.json
// jos käytössäsi on mongoosen versio 4.x seuraava rivi tulee antaa muodossa
// mongoose.connect(url, { useMongoClient: true })

mongoose.connect(url, { useMongoClient: true })
mongoose.Promise = global.Promise;

const Person = mongoose.model('Person', {
  name: String,
  number: Number
})
function compareStrings(a, b) {
    a.toLowerCase()
    b.toLowerCase()
    return (a < b) ? -1 : (a > b) ? 1 : 0;
}
if (process.argv.length < 4) {
    var values = []

    Person
        .find({})
        .then(result => {
        result.sort(function(a, b) {
            return compareStrings(a.name, b.name)
        })
        result.forEach(person => {
            values = values.concat([[person.name, person.number]])
        })
        console.table(['name','number'], values)
        mongoose.connection.close()
    })
} else {

    const person = new Person({
        name: process.argv[2],
        number: process.argv[3]
    })

    person
        .save()
        .then(response => {
        console.log(`lisätään henkilö ${process.argv[2]} numero ${process.argv[3]} luetteloon` )
    mongoose.connection.close()
})

}

