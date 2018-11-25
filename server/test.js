const firebase = require('firebase')
// const { makeRef } = require('./firebaseconfig')

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: 'spl-it-91619.firebaseapp.com',
    databaseURL: 'https://spl-it-91619.firebaseio.com',
    projectId: 'spl-it-91619',
    storageBucket: 'spl-it-91619.appspot.com',
}

firebase.initializeApp(firebaseConfig)

const makeRef = path => {
    return firebase.database().ref(path)
}

const searchStr = 'c'
const profileRef = makeRef('/profiles')
profileRef.orderByChild('username').startAt(searchStr).endAt(searchStr+"\uf8ff").on('value', snapshot => {
    // console.log(Object.values(snapshot.val()))
    // console.log(Object.entries(snapshot.val()))
    console.log(snapshot.val())
})

