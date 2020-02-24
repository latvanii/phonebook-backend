const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :response-time :body'))


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]


app.get('/', (req, res) => {
    res.send('<h1>Phonebook backend</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.get('/info', (req, res) => {
    const n_keys = Object.keys(persons).length
    const timestamp = new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' })
    res.send(`<p>Phonebook has info for ${n_keys} people</p><p>${timestamp}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generateId = () => {
    let newId = 0
    while (persons.map(person => person.id).includes(newId)) {
        newId = Math.floor(Math.random() * 1e9)
    }
    return newId
}


app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }
    if (persons.map(person => person.name).includes(body.name)) {
        return response.status(400).json({
            error: `person named ${body.name} exists already in phonebook`
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    console.log(`Adding ${person.name} to phonebook`)
    persons = persons.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
