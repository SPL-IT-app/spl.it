const makeRef = require('../server/firebaseconfig');
const {
  users,
  profiles,
  groups,
  lineItems,
  events,
  receipts,
} = require('./seedData');

function seed() {
  makeRef('/').set({});

  const profilesRef = makeRef('/profiles');
  profiles.forEach(profile => {
    profilesRef.push().set(profile);
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
