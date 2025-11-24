if (!Object.hasOwn) {
    Object.hasOwn = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
}

const express = require('express')
const cors = require('cors')
const { users, scores } = require('./data')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body)
    next()
})

app.post('/login', (req, res) => {
    const { username } = req.body
    const user = users.find(u => u.username === username) || { id: 999, username }
    res.json({
        success: true,
        access_token: 'mock-token',
        user
    })
})

app.post('/getScores', (req, res) => {
    res.json(scores)
})

app.post('/addScore', (req, res) => {
    res.json({ success: true })
})

app.get('/getUsers', (req, res) => {
    res.json(users)
})

app.get('/getTitle', (req, res) => {
    res.json({ title: 'WordleWise (Mock)' })
})

app.listen(PORT, () => {
    console.log(`Mock server running on http://localhost:${PORT}`)
})
