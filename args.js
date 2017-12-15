const yargs = require('yargs');

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

const frequencyOptions = {
  alias: 'frequency',
  default: 10,
  describe: 'Set the seconds for chatbot checking the arbitrage percentage',
  type: 'number'
};

const rateOptions = {
  alias: 'rate',
  default: 8,
  describe: 'Set the arbitrage rate for the chatbot to send alerts for',
  type: 'number'
};

const timeOptions = {
  alias: 'time',
  default: 10,
  describe: 'Set the time (in minutes) for how often the chatbot should messages',
  type: 'number'
};


module.exports = yargs
  .command('chart', 'Chart the arbitrage difference', {
    'c': cryptoOptions,
    'f': { ...frequencyOptions,
      'default': 1,
      describe: 'Set how often to chart the arbitrage rate in seconds',
    },
  })
  .command('info', 'Show info for the currency', {
    'a': amountOptions,
    'c': cryptoOptions,
  })
  .command('track', 'Send facebook chat messages', {
    'c': cryptoOptions,
    'f': frequencyOptions,
    'r': rateOptions,
    't': timeOptions,
  })
  .help()
  .argv;
