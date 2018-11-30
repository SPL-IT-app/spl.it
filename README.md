<h1 align="center">$ P L / I T</h1>

<div align="center">
<img width="200" height="200" src="https://bit.ly/2TXwoEv" alt="$PL/IT logo">

![version](https://img.shields.io/badge/version-1.0.0-blue.svg?maxAge=2592000)
<a href="https://twitter.com/intent/tweet?text=Look%20at%20this%20awesome%20tab%20splitting%20app%20I%20found!%20https://github.com/SPL-IT-app/spl.it">
    <img src="https://img.shields.io/twitter/url/https/github.com/angular-medellin/meetup.svg?style=social" alt="Tweet">
</a>

</div>

---
🔪 $PL/IT is a mobile tab splitting app for friends who go out to eat but have different spending habits. iOS and Android users can upload photos of their receipts and claim ownership of each item in that receipt. Once the event is closed, each user is shown how much they should pay or charge other users in the event.

## Development
This was built using Google's [Cloud Vision API](https://cloud.google.com/vision/docs/ocr), with a front end in [React Native](https://facebook.github.io/react-native/) and a back-end in [Firebase](https://firebase.google.com/). 

We wrote a custom algorithm to parse the results from Cloud Vision's API into line items which we store in Firebase's real-time database. Firebase supports not only our apps' database and authentication, but also user interaction. With Firebase, we learned how to use a non-relational database and how to set up subscriptions to an SDK to handle queries in real-time.

### To get started:
1. Clone the repository to your local computer
2. Run `npm install`
3. Have at it

## Contributors
* [Brittany Hill](https://github.com/ibrittanyhill)
* [Julianne Crawford](https://github.com/juliannemarik)
* [Lotus Tan](https://github.com/lotust)
* [Mustafa Dane](https://github.com/mustafadane)
