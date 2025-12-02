const users = [
    { id: 1, username: 'wjrm500', forename: 'Will', password: 'password' },
    { id: 2, username: 'kjem500', forename: 'Kate', password: 'password' }
]

const scores = [
    {
        start_of_week: '2023-01-01',
        data: {
            '2023-01-01': { kjem500: 3, wjrm500: 4 },
            '2023-01-02': { kjem500: 4, wjrm500: 3 },
            '2023-01-03': { kjem500: 5, wjrm500: 5 },
            '2023-01-04': { kjem500: 2, wjrm500: 6 },
            '2023-01-05': { kjem500: 6, wjrm500: 2 },
            '2023-01-06': { kjem500: 3, wjrm500: 4 },
            '2023-01-07': { kjem500: 4, wjrm500: 3 }
        }
    },
    {
        start_of_week: '2023-01-08',
        data: {
            '2023-01-08': { kjem500: 5, wjrm500: 5 },
            '2023-01-09': { kjem500: 4, wjrm500: 4 },
            '2023-01-10': { kjem500: 3, wjrm500: 3 },
            '2023-01-11': { kjem500: 6, wjrm500: 2 },
            '2023-01-12': { kjem500: 2, wjrm500: 6 },
            '2023-01-13': { kjem500: 5, wjrm500: 5 },
            '2023-01-14': { kjem500: 4, wjrm500: 4 }
        }
    }
]

const groups = [
    {
        id: 1,
        name: 'Test Group',
        invite_code: 'TESTCODE',
        include_historical_data: true,
        created_at: '2023-01-01T00:00:00.000Z',
        members: [
            { id: 1, username: 'wjrm500', forename: 'Will', role: 'admin', joined_at: '2023-01-01T00:00:00.000Z' },
            { id: 2, username: 'kjem500', forename: 'Kate', role: 'member', joined_at: '2023-01-01T00:00:00.000Z' }
        ]
    }
]

module.exports = { users, scores, groups }
