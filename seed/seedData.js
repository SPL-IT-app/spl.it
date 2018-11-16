const users = [
  {
    Ul5MOGufA2eYLCMq0CDD8Juojz92: {
      firstName: 'cody',
      lastName: 'pugman',
      email: 'cody@email.com',
      phone: '555-555-5555',
      friends: {},
      groups: {},
      events: {},
    },
  },
  {
    QUYamusOQnMkQxJaxZVetUgY66D3: {
      firstName: 'pug',
      lastName: 'codyman',
      email: 'pug@email.com',
      phone: '333-333-3333',
      friends: {},
      groups: {},
      events: {},
    },
  },
];

const profiles = [
  {
    username: 'codyPug',
    imageUrl: 'https://bit.ly/2q1fzuM',
  },
  {
    username: 'maaaary',
    imageUrl: 'https://bit.ly/2RXPGbi',
  },
];

const groups = [
  {
    name: '',
    members: {},
  },
];

const events = [
  {
    date: 'nov 15',
    title: 'first date',
    status: false,
    receipts: {},
    members: {},
  },
];

const receipts = [
  {
    imageUrl: 'fakeURL',
    creator: 'Ul5MOGufA2eYLCMq0CDD8Juojz92',
    tipPercent: 10,
    lineItems: {},
  },
  {
    imageUrl: 'secondreceiptfakeurl',
    creator: 'QUYamusOQnMkQxJaxZVetUgY66D3',
    tipPercent: 25,
    lineItems: {},
  },
];

const lineItems = [
  {
    name: 'cheese pizza',
    price: 45,
    users: {
      Ul5MOGufA2eYLCMq0CDD8Juojz92: true,
      QUYamusOQnMkQxJaxZVetUgY66D3: true,
    },
  },
  {
    name: 'creamed spinach',
    price: 5,
    users: { QUYamusOQnMkQxJaxZVetUgY66D3: true },
  },
];

module.exports = {
  groups,
  profiles,
  users,
  events,
  lineItems,
  receipts,
};
