/**
 * Created by Manu Masson on 6/27/2017.
 *
 */

'use strict';

console.log('Starting app...');

const request = require('request'), Promise = require("bluebird"); //request for pulling JSON from api. Bluebird for Promises.

const express = require('express'),
    _ = require('underscore'), 
    app = express(),
    helmet = require('helmet'),
    http = require('http').Server(app),
    io = require('socket.io')(http); // For websocket server functionality

app.use(helmet.hidePoweredBy({setTo: 'PHP/5.4.0'}));

const port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/docs'));

http.listen(port, function () {
    console.log('listening on', port);
});


require('./settings.js')(); //Includes settings file.
// let db = require('./db.js'); //Includes db.js


let coinNames = [];
io.on('connection', function (socket) {
    socket.emit('coinsAndMarkets', [marketNames, coinNames]);
    socket.emit('results', results);
});

// coin_prices is an object with data on price differences between markets. = {BTC : {market1 : 2000, market2: 4000, p : 2}, } (P for percentage difference)
// results is a 2D array with coin name and percentage difference, sorted from low to high.
let coin_prices = {}, numberOfRequests = 0, results = []; // GLOBAL variables to get pushed to browser.

function getMarketData(options, coin_prices, callback) {   //GET JSON DATA
    return new Promise(function (resolve, reject) {
        request(options.URL, function (error, response, body) {
            try {
                let data = JSON.parse(body);
                console.log('options: ' + options.fees)
                data.fees = options.fees
                console.log("Success", options.marketName);
                if (options.marketName) {

                    let newCoinPrices = options.last(data, coin_prices, options.toBTCURL);
                    numberOfRequests++;
                    if (numberOfRequests >= 1) computePrices(coin_prices);
                    resolve(newCoinPrices);

                }
                else {

                    coin_.fees = options.fees
                    resolve(data);
                }

            } catch (error) {
                console.log("Error getting JSON response from", options.URL, error); //Throws error
                reject(error);
            }

        });


    });
}

async function computePrices(data) {
    results = [];
    function loopData() {
        return new Promise(function (resolve, reject) {

            if (numberOfRequests >= 2) {

                for (let coin in data) {

                    if (Object.keys(data[coin]).length > 1) {
                        if (coinNames.includes(coin) == false) coinNames.push(coin);
                        let arr = [];
                        for (let market in data[coin]) {
                            let fees
                            markets.filter(a => {
                                if (a.marketName === market) {
                                    fees = a.fees
                                }

                            })
                            arr.push([data[coin][market], market, fees]);
                        }
                        arr.sort(function (a, b) {
                            return a[0] - b[0];
                        });
                        for (let i = 0; i < arr.length; i++) {
                            for (let j = i + 1; j < arr.length; j++) {
                                if((arr[i][1] === 'kraken' && arr[i][0] > arr[j][0]) || (arr[j][1] === 'kraken' && arr[j][0] > arr[i][0])){
                                    if (arr[i][0]>arr[j][0]){
                                        results.push({
                                            coin: coin,
                                            spread: arr[i][0] / arr[j][0],
                                            profit: arr[i][0] * (1 - arr[i][2].seller) - (arr[j][0] * (1 + arr[j][2].buyer)), 
                                            market2: {
                                                name: arr[i][1],
                                                last: arr[i][0]
                                            },
                                            market1: {
                                                name: arr[j][1],
                                                last: arr[j][0]
                                            }
    
                                        })
                                    }
                                    if (arr[j][0]>arr[i][0]){
                                        results.push({//TODO, shouldnt have to create duplicate object for same markets
                                            coin: coin,
                                            spread: arr[j][0] / arr[i][0],
                                            profit: arr[j][0] * (1 - arr[j][2].seller) - (arr[i][0] * (1 + arr[i][2].buyer)), 
                                            market2: {
                                                name: arr[j][1],
                                                last: arr[j][0]
                                            },
                                            market1: {
                                                name: arr[i][1],
                                                last: arr[i][0]
                                            }
    
                                        })
                                    }
                                }
                                // db.insert({
                                //     coin: coin,
                                //     lastSpread: arr[i][0] / arr[j][0],
                                //     market1: {
                                //         name: arr[i][1],
                                //         last: arr[i][0]
                                //     },
                                //     market2: {
                                //         name: arr[j][1],
                                //         last: arr[j][0]
                                //     }
                                // })

                            }
                        }

                    }
                }

                results.sort(function (a, b) {
                    return a.spread - b.spread;
                });

                console.log('Finishing function...');
                resolve();
            }
        })
    }

    await loopData();



    console.log("Emitting Results...")

    io.emit('results', results);
}


(async function main() {
    let arrayOfRequests = [];

    for (let i = 0; i < markets.length; i++) {
        arrayOfRequests.push(getMarketData(markets[i], coin_prices));
    }

    await Promise.all(arrayOfRequests.map(p => p.catch(e => e)))

        .then(results => {computePrices(coin_prices)
            })

        .catch(e => console.log(e));

    setTimeout(main, 10000);
})();
