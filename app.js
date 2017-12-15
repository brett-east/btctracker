const axios = require('axios');
const login = require('facebook-chat-api');
const moment = require('moment');
const yargs = require('yargs');

const config = require('./config');
const api = require('./api');
const argv = require('./args');

// uncomment to use environment variables at runtime
// var config = {
//     email: process.env.FB_EMAIL,
//     password: process.env.FB_PASSWORD
//     thread: process.env.FB_THREAD
// }

// set argument defaults
let frequency = argv.f * 1000 || 10000;
let command = argv._[0] || 'info';

let lastMessageTime = moment().unix() - 601;

function showInfo(currency, amount) {
  api.getInfo(amount).then((data) => {
    let { currUSD, currAuUSD, currDiff, percentDiff } = data;
    let message = '';
    if (amount > 0) {
      let unit = amount / currUSD;
      currAuUSD = currAuUSD*unit;
      currDiff = currAuUSD - amount;
      message += `${unit.toFixed(8)} | USD: ${amount} | `;
    }

    message += `${currency}: ${currUSD} | ${currency}: ${currAuUSD} | ` +
      `Diff: ${currDiff} | Percent: ${percentDiff}%`;

    console.log(message);
  });
}

function showChart(currency) {
  api.getInfo().then((data) => {
    const { percentDiff, currUSD } = data;

    const symbolPercent = Math.floor((percentDiff * 10)) + 1; // add one because join Array is inbetween array values
    const symbolPrint = Array(symbolPercent).join('#');

    console.log(`${symbolPrint} | ${currency} ${percentDiff}% $${currUSD}`);
  });
}

if (command === 'info') {
  showInfo(argv.c, argv.a);
}

if (command === 'chart') {
  setInterval(showChart, 1000, argv.c);
}

if (command === 'track') {
  login({email: config.email, password: config.password}, (err, chatApi) => {
      if(err) return console.error(err);

      setInterval(() => {
        api.getInfo().then((data) => {
          const { percentDiff } = data;

          let message = `The current arbitrage percentage is ${percentDiff}%`

          let sendNewMessage = (moment().unix() - lastMessageTime) > 600;

          if (percentDiff > arg.r && sendNewMessage) {
            lastMessageTime = moment().unix();
            console.log(message);
            chatApi.sendMessage(message, config.thread);
          }

        });
      }, frequency);

  });
}
