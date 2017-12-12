const axios = require('axios');
const config = require('./config');
const login = require('facebook-chat-api');
const moment = require('moment');
const yargs = require('yargs');

// var config = {
//     email: process.env.FB_EMAIL,
//     password: process.env.FB_PASSWORD
//     thread: process.env.FB_THREAD
// }

const cryptoOptions = {
  alias: 'crypto',
  default: 'BTC',
  describe: 'Choose BTC or ETH for the cryptocurreny',
  type: 'string'
};

const amountOptions = {
  alias: 'amount',
  default: 0,
  describe: 'Select a specific spend amount',
  type: 'number'
};

const argv = yargs
  .command('chart', 'Chart the arbitrage difference', {
    'c': cryptoOptions,
    'a': amountOptions,
  })
  .command('info', 'Show info for the currency', {
    'c': cryptoOptions,
    'a': amountOptions,
  })
  .command('track', 'Send facebook chat messages', {
    'c': cryptoOptions,
    'a': amountOptions,
    'r': {
      alias: 'rate',
      default: 10,
      describe: 'Set the seconds for chatbot checking',
      type: 'number'
    }
  })
  .help()
  .argv;

let rate = argv.r * 1000 || 10000;
let command = argv._[0] || 'info';

let lastMessageTime = moment().unix() - 601;

const btcmarketsUrl = `https://api.btcmarkets.net/market/${argv.c}/AUD/tick`;
const geminiUrl = `https://api.gemini.com/v1/pubticker/${argv.c}usd`;
const fixerUrl = 'https://api.fixer.io/latest?base=AUD';

function getGemini() {
  return axios.get(geminiUrl).then((response) => {
    return response.data.last;
  });
}

function getBtcmarkets() {
  return axios.get(btcmarketsUrl).then((response) => {
    return response.data.lastPrice;
  });;
}

function getExchange() {
  return axios.get(fixerUrl).then((response) => {
    return response.data.rates.USD;
  });;
}

function getInfo(amount) {
  return axios.all([getGemini(), getBtcmarkets(), getExchange()])
    .then(axios.spread(function (gemini, btcmarkets, exchangeRate) {
      const currUSD = gemini;
      const currAu = btcmarkets;
      const exchange = exchangeRate;
      const currAuUSD = currAu * exchange;
      const currDiff = currAuUSD - currUSD;
      const percentDiff = (currDiff / currUSD * 100).toFixed(2);

      return {
        currUSD,
        currAu,
        exchange,
        currAuUSD,
        currDiff,
        percentDiff
      };

    })
  );
}

function showInfo(currency, amount) {
  getInfo(amount).then((data) => {
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
  getInfo().then((data) => {
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
  login({email: config.email, password: config.password}, (err, api) => {
      if(err) return console.error(err);

      setInterval(() => {
        getInfo().then((data) => {
          const { percentDiff } = data;

          let message = `The current arbitrage percentage is ${percentDiff}%`

          let sendNewMessage = (moment().unix() - lastMessageTime) > 600;

          if (percentDiff > 8 && sendNewMessage) {
            lastMessageTime = moment().unix();
            console.log(message);
            api.sendMessage(message, config.thread);
          }

        });
      }, rate);

  });
}
