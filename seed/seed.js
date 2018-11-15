const makeRef = require('../server/firebaseconfig')
const { users, profiles, groups } = require('./seedData')

function seed() {
    makeRef('/').set({})

    const profilesRef = makeRef('/profiles')
    profiles.forEach(profile => {
        profilesRef.push().set(profile)
    })

    const usersRef = makeRef('/users')
    users.forEach(user => {
        usersRef.push().set(user)
    })

    const groupsRef = makeRef('/groups')
    groups.forEach(group => {
        groupsRef.push().set(group)
    })
    console.log('Database seeded!')
}
seed()
