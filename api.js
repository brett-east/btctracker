const axios = require('axios');

const argv = require('./args');

const btcmarketsUrl = `https://api.btcmarkets.net/market/${argv.c}/AUD/tick`;
const geminiUrl = `https://api.gemini.com/v1/pubticker/${argv.c}usd`;
const fixerUrl = 'https://api.fixer.io/latest?base=AUD';

function _getGemini() {
  return axios.get(geminiUrl).then((response) => {
    return response.data.last;
  });
}

function _getBtcmarkets() {
  return axios.get(btcmarketsUrl).then((response) => {
    return response.data.lastPrice;
  });;
}

function _getExchange() {
  return axios.get(fixerUrl).then((response) => {
    return response.data.rates.USD;
  });;
}

function getInfo(amount) {
  return axios.all([_getGemini(), _getBtcmarkets(), _getExchange()])
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

module.exports = {
  getInfo,
};
