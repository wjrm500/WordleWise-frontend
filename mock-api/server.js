if (!Object.hasOwn) {
    Object.hasOwn = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
}

const express = require('express')
const cors = require('cors')
const initialData = require('./data')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// In-memory state
let users = JSON.parse(JSON.stringify(initialData.users))
let scores = JSON.parse(JSON.stringify(initialData.scores))
let groups = JSON.parse(JSON.stringify(initialData.groups))

// Helper to find user by token (mocked)
const getUserFromRequest = (req) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return null
    const token = authHeader.split(' ')[1]
    if (!token) return null
    // In this mock, the token is just the username for simplicity, or we decode it if it was a real JWT.
    // Let's assume the mock login returns a token that is "mock-token-<username>"
    if (token.startsWith('mock-token-')) {
        const username = token.replace('mock-token-', '')
        return users.find(u => u.username === username)
    }
    return null
}

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body)
    next()
})

// --- Auth ---

app.post('/login', (req, res) => {
    const { username, password } = req.body
    const user = users.find(u => u.username === username && u.password === password)

    if (user) {
        res.json({
            success: true,
            access_token: `mock-token-${user.username}`,
            user: { id: user.id, username: user.username, forename: user.forename }
        })
    } else {
        res.json({ success: false, error: 'Invalid credentials' })
    }
})

app.post('/register', (req, res) => {
    const { username, password, forename } = req.body
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ success: false, error: 'Username already exists' })
    }
    const newUser = { id: users.length + 1, username, password, forename }
    users.push(newUser)
    res.json({
        success: true,
        access_token: `mock-token-${newUser.username}`,
        user: { id: newUser.id, username: newUser.username, forename: newUser.forename }
    })
})

// --- Groups ---

app.get('/groups', (req, res) => {
    const user = getUserFromRequest(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const userGroups = groups.filter(g => g.members.some(m => m.id === user.id))
    const result = userGroups.map(g => {
        const membership = g.members.find(m => m.id === user.id)
        return {
            id: g.id,
            name: g.name,
            member_count: g.members.length,
            role: membership.role,
            include_historical_data: g.include_historical_data,
            is_default: false // Mock default group logic if needed
        }
    })
    res.json(result)
})

app.post('/groups', (req, res) => {
    const user = getUserFromRequest(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const { name, include_historical_data } = req.body
    const newGroup = {
        id: groups.length + 1,
        name,
        invite_code: `INV-${Date.now()}`,
        include_historical_data: !!include_historical_data,
        created_at: new Date().toISOString(),
        members: [{
            id: user.id,
            username: user.username,
            forename: user.forename,
            role: 'admin',
            joined_at: new Date().toISOString()
        }]
    }
    groups.push(newGroup)
    res.json({ success: true, group: newGroup })
})

app.get('/groups/:id', (req, res) => {
    const user = getUserFromRequest(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const group = groups.find(g => g.id === parseInt(req.params.id))
    if (!group) return res.status(404).json({ error: 'Group not found' })

    const membership = group.members.find(m => m.id === user.id)
    if (!membership) return res.status(403).json({ error: 'Not a member' })

    res.json({
        ...group,
        current_user_role: membership.role
    })
})

app.put('/groups/:id', (req, res) => {
    const user = getUserFromRequest(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const group = groups.find(g => g.id === parseInt(req.params.id))
    if (!group) return res.status(404).json({ error: 'Group not found' })

    // Mock admin check
    const membership = group.members.find(m => m.id === user.id)
    if (membership?.role !== 'admin') return res.status(403).json({ error: 'Admin required' })

    if (req.body.name) group.name = req.body.name
    if (req.body.include_historical_data !== undefined) group.include_historical_data = req.body.include_historical_data

    res.json({ success: true })
})

app.delete('/groups/:id', (req, res) => {
    const user = getUserFromRequest(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const index = groups.findIndex(g => g.id === parseInt(req.params.id))
    if (index === -1) return res.status(404).json({ error: 'Group not found' })

    groups.splice(index, 1)
    res.json({ success: true })
})

app.post('/groups/join', (req, res) => {
    const user = getUserFromRequest(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const { invite_code } = req.body
    const group = groups.find(g => g.invite_code === invite_code)
    if (!group) return res.status(400).json({ success: false, error: 'Invalid code' })

    if (group.members.find(m => m.id === user.id)) {
        return res.status(400).json({ success: false, error: 'Already a member' })
    }

    group.members.push({
        id: user.id,
        username: user.username,
        forename: user.forename,
        role: 'member',
        joined_at: new Date().toISOString()
    })

    res.json({ success: true, group: { id: group.id, name: group.name } })
})

app.post('/groups/:id/leave', (req, res) => {
    const user = getUserFromRequest(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const group = groups.find(g => g.id === parseInt(req.params.id))
    if (!group) return res.status(404).json({ error: 'Group not found' })

    const index = group.members.findIndex(m => m.id === user.id)
    if (index !== -1) {
        group.members.splice(index, 1)
        res.json({ success: true })
    } else {
        res.status(400).json({ success: false, error: 'Not a member' })
    }
})

app.delete('/groups/:id/members/:mid', (req, res) => {
    const user = getUserFromRequest(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const group = groups.find(g => g.id === parseInt(req.params.id))
    if (!group) return res.status(404).json({ error: 'Group not found' })

    const index = group.members.findIndex(m => m.id === parseInt(req.params.mid))
    if (index !== -1) {
        group.members.splice(index, 1)
        res.json({ success: true })
    } else {
        res.status(400).json({ success: false, error: 'Member not found' })
    }
})

app.put('/groups/:id/members/:mid', (req, res) => {
    const user = getUserFromRequest(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const group = groups.find(g => g.id === parseInt(req.params.id))
    if (!group) return res.status(404).json({ error: 'Group not found' })

    const member = group.members.find(m => m.id === parseInt(req.params.mid))
    if (member) {
        member.role = req.body.role
        res.json({ success: true })
    } else {
        res.status(400).json({ success: false, error: 'Member not found' })
    }
})

app.post('/groups/:id/regenerate-code', (req, res) => {
    const user = getUserFromRequest(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const group = groups.find(g => g.id === parseInt(req.params.id))
    if (!group) return res.status(404).json({ error: 'Group not found' })

    group.invite_code = `INV-${Date.now()}`
    res.json({ success: true, invite_code: group.invite_code })
})

// --- Scores ---

app.get('/scores', (req, res) => {
    const user = getUserFromRequest(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    // In a real app, we'd filter by scope/group. 
    // For mock, we'll just return all scores, but maybe filter keys if needed?
    // The frontend expects the nested structure.
    res.json(scores)
})

app.post('/scores', (req, res) => {
    const user = getUserFromRequest(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const { date, score } = req.body

    // Find the week for this date
    // Simple mock logic: just find if the date exists in any week, or create a new week block
    // For simplicity, let's just add it to the first block or find the matching block

    // We need to find the start of the week for the given date to place it correctly, 
    // but for the mock we can just be lazy and put it in a catch-all or existing block if it matches.

    let added = false
    for (let week of scores) {
        if (week.data[date] !== undefined || Object.keys(week.data).length < 7) {
            if (score === null) {
                delete week.data[date][user.username]
            } else {
                if (!week.data[date]) week.data[date] = {}
                week.data[date][user.username] = score
            }
            added = true
            break
        }
    }

    if (!added && score !== null) {
        // Create new block
        scores.push({
            start_of_week: date, // Simplified
            data: {
                [date]: { [user.username]: score }
            }
        })
    }

    res.json('')
})

// --- Users ---

app.get('/users', (req, res) => {
    const user = getUserFromRequest(req)
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    res.json(users.map(u => ({ id: u.id, username: u.username, forename: u.forename })))
})

app.get('/user/default-scope', (req, res) => {
    res.json({ type: 'personal', groupId: null })
})

app.put('/user/default-scope', (req, res) => {
    res.json({ success: true })
})


// --- Wordle ---

app.get('/wordle/answer', (req, res) => {
    res.json({
        success: true,
        answer: 'mocked',
        playable_url: 'https://www.thewordfinder.com/wordle-maker/?game=mocked'
    })
})

app.listen(PORT, () => {
    console.log(`Mock server running on http://localhost:${PORT}`)
})
