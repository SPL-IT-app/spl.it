const {
  users,
  profiles,
  groups,
  lineItems,
  events,
  nightOutReceipts,
  portlandReceipts,
} = require('./seedData');
const firebase = require('firebase');
require('../secrets');

// INITIALIZE FIREBASE
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

// SEED FUNCTION
function seed() {
  // RE-INITIALIZE DATABASE
  makeRef('/').set({});

  // RANDOMIZE SEED DATA FUNCTION
  function shuffle(array) {
    var m = array.length,
      t,
      i;
    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
  }

  // SEED USER DATA
  users.forEach(user => {
    const usersRefIndiv = makeRef(`/users/${Object.keys(user)[0]}`);
    usersRefIndiv.set(user[Object.keys(user)[0]]);

    const userFriendRef = makeRef(`users/${Object.keys(user)[0]}/friends`)
    const randomFriends = shuffle(users.filter(friend => friend !== user)).slice(0, 5)
    randomFriends.forEach(friend => {
      const friendId = Object.keys(friend)[0]
      userFriendRef.update({[friendId]: true})
    })
  });

  // SEED PROFILE DATA
  profiles.forEach(profile => {
    const profRefIndiv = makeRef(`/profiles/${Object.keys(profile)[0]}`);
    profRefIndiv.set(profile[Object.keys(profile)[0]]);
  });

  // SEED GROUP DATA
  const groupsRef = makeRef('/groups');
  groups.forEach(group => {
    groupsRef.push().set(group);
  });

  // SEED EVENT DATA
  const eventsRef = makeRef('/events');
  events.forEach(event => {
    const newEventRef = eventsRef.push();
    const eventId = newEventRef.key;
    newEventRef.set(event);

    const update = { [eventId]: true };

    users.slice(0, 2).forEach(user => {
      const usersRefIndiv = makeRef(`/users/${Object.keys(user)[0]}`);
      usersRefIndiv.child('events').update({ ...update });
      const membersRef = makeRef(`/events/${eventId}/members`);
      membersRef.update(user);
    });

    const receiptsRef = makeRef(`/events/${eventId}/receipts`);
    const receipts = event.title === 'Trip to Portland' ? portlandReceipts : nightOutReceipts;
    receipts.forEach(receipt => {
      const newReceipt = receiptsRef.push();
      const receiptID = newReceipt.key;
      newReceipt.set(receipt);

      const randomLineItems = shuffle(lineItems).slice(0, 5)
      const lineItemsRef = makeRef(`/events/${eventId}/receipts/${receiptID}`);
      randomLineItems.forEach(item => {
        lineItemsRef.push().set(item);
      });
    });
  });

  console.log('Database seeded!');
}
seed();
