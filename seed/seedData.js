const { randomColor } = require('randomcolor');

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
      friends: { Ul5MOGufA2eYLCMq0CDD8Juojz92: true },
      groups: {},
      events: {},
    },
  },
  {
    Jwll5FbAMKgBhvJellkPGt1Mrv02: {
      firstName: 'me',
      lastName: 'mememe',
      email: 'me@me.com',
      phone: '111-111-1111',
      friends: {},
      groups: {},
      events: {},
    },
  },
];

const profiles = [
  {
    Ul5MOGufA2eYLCMq0CDD8Juojz92: {
      username: 'codyPug',
      imageUrl: 'https://bit.ly/2q1fzuM',
      color: randomColor({
        luminosity: 'light',
        hue: 'random',
      }).toString(),
    },
  },
  {
    QUYamusOQnMkQxJaxZVetUgY66D3: {
      username: 'pugCody',
      imageUrl: 'https://bit.ly/2A52oxA',
      color: randomColor({
        luminosity: 'light',
        hue: 'random',
      }).toString(),
    },
  },
  {
    v143uyYUOEPrIsOKLRN3gbSCtkw1: {
      username: 'memememe',
      imageUrl:
        'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      color: randomColor({
        luminosity: 'light',
        hue: 'random',
      }).toString(),
    },
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
    status: true,
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
