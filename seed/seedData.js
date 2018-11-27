const { randomColor } = require('randomcolor');

const users = [
  {
    Ul5MOGufA2eYLCMq0CDD8Juojz92: {
      firstName: 'cody',
      lastName: 'pugman',
      email: 'cody@email.com',
      phone: '555-555-5555',
      expoToken: "ExponentPushToken[v6g53lGNr1QFmkiIeOn1_J]",
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
      expoToken: "ExponentPushToken[v6g53lGNr1QFmkiIeOn1_J]",
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
      expoToken: "ExponentPushToken[v6g53lGNr1QFmkiIeOn1_J]",
      friends: {},
      groups: {},
      events: {},
    },
  },
  {
    l5Ckru5l4EbNqsRNCohQXpgUNmj2: {
      firstName: 'Julianne',
      lastName: 'Crawford',
      email: 'julianne@email.com',
      phone: '111-111-1111',
      expoToken: "ExponentPushToken[v6g53lGNr1QFmkiIeOn1_J]",
      friends: {},
      groups: {},
      events: {},
    },
  },
  {
    uJeuLwsE8XNcfWYtMt2zDtqCjZH2: {
      firstName: 'Lotus',
      lastName: 'Tan',
      email: 'lotus@email.com',
      phone: '222-222-2222',
      expoToken: "ExponentPushToken[v6g53lGNr1QFmkiIeOn1_J]",
      friends: {},
      groups: {},
      events: {},
    },
  },
  {
    MFnAx1YAzneSfy9stSDhIWbWygg1: {
      firstName: 'Mustafa',
      lastName: 'Dane',
      email: 'mustafa@email.com',
      phone: '333-333-3333',
      expoToken: "ExponentPushToken[v6g53lGNr1QFmkiIeOn1_J]",
      friends: {},
      groups: {},
      events: {},
    },
  },
  {
    dOQJVPAdwLXl8UbxtaSbDdbeGiQ2: {
      firstName: 'Brittany',
      lastName: 'Hill',
      email: 'brittany@email.com',
      phone: '444-444-4444',
      expoToken: "ExponentPushToken[v6g53lGNr1QFmkiIeOn1_J]",
      friends: {},
      groups: {},
      events: {},
    },
  },
  {
    '5TL5kwr0m4coy9WpncZdiyknuLu1': {
      firstName: 'Collin',
      lastName: 'Miller',
      email: 'collin@email.com',
      phone: '555-555-5555',
      expoToken: "ExponentPushToken[v6g53lGNr1QFmkiIeOn1_J]",
      friends: {},
      groups: {},
      events: {},
    },
  },
  {
    kWdrASnnEZWQ29MK7u0uO7FDvIP2: {
      firstName: 'Ben',
      lastName: 'Wilhelm',
      email: 'ben@email.com',
      phone: '666-666-6666',
      expoToken: "ExponentPushToken[v6g53lGNr1QFmkiIeOn1_J]",
      friends: {},
      groups: {},
      events: {},
    },
  },
  {
    owZenwd8cGbPeW6scHFbfqfgpdD2: {
      firstName: 'Finn',
      lastName: 'Terdal',
      email: 'finn@email.com',
      phone: '777-777-7777',
      expoToken: "ExponentPushToken[v6g53lGNr1QFmkiIeOn1_J]",
      friends: {},
      groups: {},
      events: {},
    },
  },
  {
    LYbFZlww7NhFABx1V492EjHCVJ42: {
      firstName: 'Priti',
      lastName: 'Patel',
      email: 'priti@email.com',
      phone: '888-888-8888',
      expoToken: "ExponentPushToken[v6g53lGNr1QFmkiIeOn1_J]",
      friends: {},
      groups: {},
      events: {},
    },
  },
];

const profilePictures = [
  'https://bit.ly/2q1fzuM',
  'https://bit.ly/2A52oxA',
  'https://pbs.twimg.com/profile_images/1046968391389589507/_0r5bQLl.jpg',
  'https://media.licdn.com/dms/image/C5603AQGfbDyRLQO6jQ/profile-displayphoto-shrink_800_800/0?e=1548288000&v=beta&t=oKuOflIcONQDaO2Usf-_uvMzOlo_QUnNv38nZ9pjnEk',
  'https://media.licdn.com/dms/image/C4E03AQGzt7hdcVzcgQ/profile-displayphoto-shrink_800_800/0?e=1548288000&v=beta&t=GAinuzrTk8NfdHwTREdOf9FYWKBV0o1-GtQAXofBSJY',
  'https://media.licdn.com/dms/image/C4E03AQEvrycsOIYx-g/profile-displayphoto-shrink_800_800/0?e=1548892800&v=beta&t=PLTvDpusV0sxk6ds605NrLlcuafikNuwDfAGzHHrOSU',
  'https://media.licdn.com/dms/image/C4E03AQET2S41uyB6HA/profile-displayphoto-shrink_800_800/0?e=1548288000&v=beta&t=i_3aeTBTgkATA4UnUYi8L1KhRG7tD_YL7gL62CMgkao',
  'https://cloud.fullstackacademy.com/colllin-miller-instructor.jpg?mtime=20180122152631',
  'https://cloud.fullstackacademy.com/ben-wilhelm-instructor.jpg?mtime=20180122152630',
  'https://cloud.fullstackacademy.com/finn-terdal-min.jpg?mtime=20180618121640',
  'https://cloud.fullstackacademy.com/priti-patel-instructor.jpg?mtime=20180503134058',
];

const profiles = users.map((user, idx) => {
  const uid = Object.keys(user)[0];
  return {
    [uid]: {
      username: `${user[uid].firstName}${user[uid].lastName}`,
      imageUrl: profilePictures[idx],
      color: randomColor({
        luminosity: 'light',
        hue: 'random',
      }).toString(),
    },
  };
});

const groups = [
  {
    name: 'Fullstack Instructors',
    members: {
      '5TL5kwr0m4coy9WpncZdiyknuLu1': true,
      kWdrASnnEZWQ29MK7u0uO7FDvIP2: true,
      owZenwd8cGbPeW6scHFbfqfgpdD2: true,
      LYbFZlww7NhFABx1V492EjHCVJ42: true,
    },
  },
  {
    name: 'Fullstack 1809',
    members: {
      l5Ckru5l4EbNqsRNCohQXpgUNmj2: true,
      uJeuLwsE8XNcfWYtMt2zDtqCjZH2: true,
      MFnAx1YAzneSfy9stSDhIWbWygg1: true,
      dOQJVPAdwLXl8UbxtaSbDdbeGiQ2: true,
    },
  },
];

const events = [
  {
    date: new Date('November 2, 2018').toString(),
    title: 'Night Out with the Guys',
    status: true,
    receipts: {},
    members: {},
  },
  {
    date: new Date('December 17, 2018').toString(),
    title: "Trip to Portland",
    status: true,
    receipts: {},
    members: {},
  },
];

const portlandReceipts = [
  {
    dateCreated: new Date('December 17, 2018').toString(),
    imageUrl: 'https://s.aolcdn.com/hss/storage/midas/9aec80daba3fd25da5a71151d6808a6e/205038461/display.jpg',
    creator: 'QUYamusOQnMkQxJaxZVetUgY66D3',
    tipPercent: 10,
  },
  {
    dateCreated: new Date('December 17, 2018').toString(),
    imageUrl: 'https://d85ecz8votkqa.cloudfront.net/support/help_center/Print_Payment_Receipt.JPG',
    creator: 'Ul5MOGufA2eYLCMq0CDD8Juojz92',
    tipPercent: 25,
  },
  {
    dateCreated: new Date('December 18, 2018').toString(),
    imageUrl: 'http://farm4.static.flickr.com/3071/2939575317_912c3a179f.jpg',
    creator: 'QUYamusOQnMkQxJaxZVetUgY66D3',
    tipPercent: 15,
  },
  {
    dateCreated: new Date('December 19, 2018').toString(),
    imageUrl: 'https://i0.wp.com/johanjohansen.dk/wp-content/uploads/2017/03/noma-dinner-bill.jpg?resize=1020%2C1020',
    creator: 'Ul5MOGufA2eYLCMq0CDD8Juojz92',
    tipPercent: 0,
  },
];

const nightOutReceipts = [
  {
    dateCreated: new Date('November 2, 2018').toString(),
    imageUrl: 'https://farm5.static.flickr.com/4231/34950943814_a9d4c0e337_b.jpg',
    creator: 'Ul5MOGufA2eYLCMq0CDD8Juojz92',
    tipPercent: 10,
  },
  {
    dateCreated: new Date('November 2, 2018').toString(),
    imageUrl: 'https://media-cdn.tripadvisor.com/media/photo-s/04/d0/50/1d/del-frisco-s.jpg',
    creator: 'QUYamusOQnMkQxJaxZVetUgY66D3',
    tipPercent: 25,
  },
];

const lineItems = [
  {
    name: 'cheese pizza',
    price: 45,
    // users: {
    //   Ul5MOGufA2eYLCMq0CDD8Juojz92: true,
    //   QUYamusOQnMkQxJaxZVetUgY66D3: true,
    // },
  },
  {
    name: 'creamed spinach',
    price: 5,
    // users: { QUYamusOQnMkQxJaxZVetUgY66D3: true },
  },
  {
    name: 'Cheese Curds',
    price: 7,
    users: {},
  },
  {
    name: 'Pepperoni Pizza with Olives, Spinach, and Onions',
    price: 15.0,
    users: {},
  },
  {
    name: 'Pad Thai with Tofu',
    price: 18.0,
    users: {},
  },
  {
    name: 'Red Curry with Rice',
    price: 20.0,
    users: {},
  },
  {
    name: 'French Fries',
    price: 4.5,
    users: {},
  },
  {
    name: 'Burger',
    price: 14,
    users: {},
  },
  {
    name: 'Thanksgiving Cranberries',
    price: 12,
    users: {},
  },
  {
    name: 'Burrito with black beans and rice',
    price: 17,
    users: {},
  },
];

module.exports = {
  groups,
  profiles,
  users,
  events,
  lineItems,
  nightOutReceipts,
  portlandReceipts,
};
