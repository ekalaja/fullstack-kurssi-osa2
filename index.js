const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('uusi', function (req, res) { return res, JSON.stringify(req.body) })

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())
app.use(morgan(':method :url :uusi :status :res[content-length] - :response-time ms'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})


app.get('/api/persons', (request, response) => {
    Person
    .find({})
    .then(persons => {
    response.json(persons.map(formatPerson))
    })
    .catch(error => {
        console.log(error)
        response.status(404).end()

    })
})


app.get('/info', (req, res) => {
    Person
    .find({})
    .then(persons => {
    persons.map(formatPerson)
    const puhInfo = `<p> yhteensä ${persons.length} henkilön yhteystiedot</p>`
    res.send(puhInfo + Date())
    })
    .catch(error => {
        console.log(error)
        res.status(404).end()
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person
    .findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(formatPerson(person))
        } else {
            response.status(404).end()
        }
    })
    .catch(error => {
        console.log(error)
        response.status(400).send({error: 'malformatted id'})
    })

})

app.delete('/api/persons/:id', (request, response) => {
    Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => {
        response.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (request, response) => {
    const newPerson = request.body
    var errorMessage = ''
    console.log("new post call with body", newPerson)
    if (newPerson.name === undefined) {
        errorMessage += `<p> name is missing </p>`
    }
    if (newPerson.number === undefined) {
        errorMessage += `<p> number is missing </p>`
    }
    if (errorMessage.length > 1) {
        response.status(400).json({error: errorMessage})
    } else {
        const person = new Person({
            name: newPerson.name,
            number: newPerson.number
        })
        person
            .save()
            .then(savedPerson => {
                response.json(formatPerson(savedPerson))
            })
            .catch(error => {
                response.status(400).send({ error: 'something went wrong' })
            })
    }
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }

    Person
    .findByIdAndUpdate(request.params.id, person, { new: true } )
    .then(updatedPerson => {
        response.json(formatPerson(updatedPerson))
    })
    .catch(error => {
        console.log(error)
    response.status(400).send({ error: 'malformatted id' })
    })
})


const formatPerson = (person) => {
    return {
        name: person.name,
        number: person.number,
        id: person._id
    }
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
