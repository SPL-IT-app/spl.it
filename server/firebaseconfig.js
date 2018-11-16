const firebase = require('firebase');
// import * as firebase from 'firebase';
require('../secrets');

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'spl-it-91619.firebaseapp.com',
  databaseURL: 'https://spl-it-91619.firebaseio.com',
  projectId: 'spl-it-91619',
  storageBucket: 'spl-it-91619.appspot.com',
};

firebase.initializeApp(firebaseConfig);

const makeRef = path => {
  return firebase.database().ref(path);
};

module.exports = makeRef;
