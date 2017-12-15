# BTC Tracker

The BTC Tracker measures the arbitrage rate for BTC and ETH between
Gemini.com in the US and btcmarkets.net in Australia.

It works by getting the last price for the selected currency from the
exchanges' respective APIs. It also uses the latest USDAUD exchange
rate by making another API call.

## Setup

### Requirements

You must be running a version of Node equal to or greater than v8 in
order to take advantage of the ES6 features used in this app.

### Installation

Clone this repo and `cd` into the directory.

Run:

```
npm install
```

to get required npm packages.

### Config file

If you want to use the chatbot features of this app, then you need
to add a `config.js` file to the top level of this directory. The
config file should look like this:

```
module.exports = {
  email: 'yourfacebookemail@email.com',
  password: 'yourfacebookP@ssw0rd',
  thread: '###########' // this is the id of your chat
}
```

In order to find the chat id of your conversation, go to
messenger.com and click on a conversation, the end of the url is the
chat id.

E.g. `https://www.messenger.com/t/1975635834462648`, `1975635834462648`
is the thread id. You need to be a part of the conversation to send messages.

## Running the app

From the app directory, run

```
node app --help
```

to see a list of available commands.

Run `--help` after a command to see further options.

```
node app info --help
```

## Example commands and outputs

### info

```
node app info -c ETH -a 1000
```

Will return the current price of ETH in USD on each exchange, as well as
the amount of ETH that can be purchased for $1,000. It will also show the
arbitrage percentage difference and the USD difference.

```
1.45772595 | USD: 1000 | ETH: 686.00 | ETH: 1059.3006717201165 | Diff: 59.3006717201165 | Percent: 5.93%
```

#### Available options

Crypto: `-c` or `-crypto`, provide with `BTC` or `ETH` (default: `BTC`)

Amount: `-a` or `-amount`, provide a number of USD with which to see the
number of coins that can be purchased (default: none);

### chart

```
node app chart -c BTC -f 1
```

Will return a graph of the current arbitrage rate for the provided currency
as well as the current price, at a default of once every second. This will continue
to run until it it stopped by pressing `ctrl + c` (`^C`).

```
########################################## | BTC 4.22% $17720.02
########################################## | BTC 4.22% $17720.02
######################################### | BTC 4.10% $17739.62
######################################### | BTC 4.10% $17739.62
########################################## | BTC 4.22% $17720.01
```

#### Available options

Crypto: `-c` or `-crypto`, provide with `BTC` or `ETH` (default: `BTC`)

Frequency: `-f` or `-frequency`, provide how often in seconds the app
should chart the arbitrage rate (default: `1` second).

### track

```
node app track -c ETH -r 3 -t 5 -f 20
```

This will login into your facebook account (using the details you
provide in `config.js`) and then send you a message every `-t` minutes
if the arbitrage rate goes over `-r`. It will check the rate every `-f`
seconds. It will also log the message in the console. This will continue
to run until it it stopped by pressing `ctrl + c` (`^C`).

```
info login Logging in...
info login Logged in
info login Request to reconnect
info login Request to pull 1
info login Request to pull 2
info login Request to thread_sync
info login Done logging in.
The current ETH arbitrage percentage is 4.58%
```

#### Available options

Crypto: `-c` or `-crypto`, provide with `BTC` or `ETH` (default: `BTC`)

Frequency: `-f` or `-frequency`, provide how often in seconds the app
should check the arbitrage rate (default: `10` seconds).

Rate: `-r` or `-rate`, provide the arbitrage rate at which you would like
to be alerted. Alerts will come for all rates greater than that provided
(default: `8` %).

Time: `-t` or `-time`, provide how often to send facebook messages if
the rate is above the chosen rate (default: `10` minutes).
