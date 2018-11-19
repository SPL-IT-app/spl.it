// const { makeRef } = require('../server/firebaseconfig');
//import {makeRef} from '../server/firebaseconfig'

const {
  users,
  profiles,
  groups,
  lineItems,
  events,
  receipts,
} = require('./seedData');

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

function seed() {
  makeRef('/').set({});

  // const profilesRef = makeRef('/profiles');
  profiles.forEach(profile => {
    const profRefIndiv = makeRef(`/profiles/${Object.keys(profile)[0]}`);
    profRefIndiv.set(profile[Object.keys(profile)[0]]);
  });

  // const usersRef = makeRef('/users');
  users.forEach(user => {
    const usersRefIndiv = makeRef(`/users/${Object.keys(user)[0]}`);
    usersRefIndiv.set(user[Object.keys(user)[0]]);
  });

  const eventsRef = makeRef('/events');
  events.forEach(event => {
    const newEventRef = eventsRef.push();
    const eventId = newEventRef.key;
    newEventRef.set(event);

    const update = { [eventId]: true };

    users.forEach(user => {
      if (Object.keys(user)[0] !== 'v143uyYUOEPrIsOKLRN3gbSCtkw1') {
        const usersRefIndiv = makeRef(`/users/${Object.keys(user)[0]}`);
        usersRefIndiv.child('events').update({ ...update });
      }
    });

    const receiptsRef = makeRef(`/events/${eventId}/receipts`);
    receipts.forEach(receipt => {
      const newReceipt = receiptsRef.push();
      const receiptID = newReceipt.key;
      newReceipt.set(receipt);

      const lineItemsRef = makeRef(
        `/events/${eventId}/receipts/${receiptID}/lineItems/`
      );
      lineItems.forEach(item => {
        lineItemsRef.push().set(item);
      });
    });
  });

  const groupsRef = makeRef('/groups');
  groups.forEach(group => {
    groupsRef.push().set(group);
  });
  console.log('Database seeded!');
}
seed();
