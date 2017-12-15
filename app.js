const argv = require('./args');
const { showInfo, showChart, sendMessage } = require('./logger');

// set argument defaults and variable names
let frequency = argv.f * 1000;
let time = argv.t * 60;
let currency = argv.c;
let amount = argv.a;
let rate = argv.r;
let command = argv._[0] || 'info';

if (command === 'info') {
  showInfo(currency, amount);
}

if (command === 'chart') {
  showChart(frequency, currency);
}

if (command === 'track') {
  sendMessage(frequency, currency, rate, time);
}
