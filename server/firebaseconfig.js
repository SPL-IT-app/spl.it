// const firebase = require('firebase');
import * as firebase from 'firebase';
require('../secrets');

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'spl-it-91619.firebaseapp.com',
  databaseURL: 'https://spl-it-91619.firebaseio.com',
  projectId: 'spl-it-91619',
  storageBucket: 'spl-it-91619.appspot.com',
};
export default (!firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app());

export const makeRef = path => {
  return firebase.database().ref(path);
};
