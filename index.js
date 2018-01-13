const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
morgan.token('uusi', function (req, res) { return res, JSON.stringify(req.body) })

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())
app.use(morgan(':method :url :uusi :status :res[content-length] - :response-time ms'))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Lea Kutvonen",
      "number": "040-123456",
      "id": 4
    }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info', (req, res) => {
    const puhInfo = `<p> yhteensä ${persons.length} henkilön yhteystiedot</p>`
    console.log(puhInfo)
    res.send(puhInfo + Date())
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if ( person ) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)

response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const newPerson = request.body
    var errorMessage = ''
    if (persons.filter(person => person.name === newPerson.name).length > 0) {
        response.status(400).json({error: 'name must be unique'})
        return
    }
    if (newPerson.name === undefined) {
        errorMessage += `<p> name is missing </p>`
    }
    if (newPerson.number === undefined) {
        errorMessage += `<p> number is missing </p>`
    }
    if (errorMessage.length > 1) {
        response.status(400).json({error: errorMessage})
    } else {
        newPerson.id = Math.floor(Math.random()*100000)
        persons = persons.concat(newPerson)
        response.json(newPerson)
    }
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
