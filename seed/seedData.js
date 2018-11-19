const users = [
  {
    firstName: 'cody',
    lastName: 'pugman',
    email: 'cody@email.com',
    phone: '555-555-5555',
    friends: {Ul5MOGufA2eYLCMq0CDD8Juojz92: true},
    groups: {},
    events: {},
  },
  {
    firstName: 'mary',
    lastName: 'maryman',
    email: 'mary@email.com',
    phone: '333-333-3333',
    friends: {},
    groups: {},
    events: {},
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
    creator: { '-LRODPdw3f2DZZ3v51lp': true },
    tipPercent: 10,
    lineItems: {},
  },
  {
    imageUrl: 'secondreceiptfakeurl',
    creator: { '-LRODPdv6yPBGCXhZYdE': true },
    tipPercent: 25,
    lineItems: {},
  },
];

const lineItems = [
  {
    name: 'cheese pizza',
    price: 45,
    users: { '-LRODPdv6yPBGCXhZYdE': true, '-LRODPdw3f2DZZ3v51lp': true },
  },
  {
    name: 'creamed spinach',
    price: 5,
    users: { '-LRODPdv6yPBGCXhZYdE': true, '-LRODPdw3f2DZZ3v51lp': true },
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
