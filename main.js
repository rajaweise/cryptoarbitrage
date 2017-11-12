/**
 * Created by Manu Masson on 6/27/2017.
 *
 */

'use strict';

console.log('Starting app...');

const request = require('request'), Promise = require("bluebird"); //request for pulling JSON from api. Bluebird for Promises.

const express = require('express'),
    util = require('util'), 
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
let position = {
    liqui : {
        USD: 500,
        DASH: 1000,
        EOS: 2, 
        ETC: 2, 
        ETH: 2 , 
        ICN: 2 , 
        LTC: 2 , 
        MLN: 2 , 
        REP: 2 , 
        DOGE: 2 , 
        XLM: 2 , 
        XMR: 2 , 
        XRP: 2 , 
        ZEC: 2 , 
        BTC: 2
    } , 
    yobit : {
        USD: 500,
        DASH: 1000,
        EOS: 2, 
        ETC: 2, 
        ETH: 2 , 
        ICN: 2 , 
        LTC: 2 , 
        MLN: 2 , 
        REP: 2 , 
        DOGE: 2 , 
        XLM: 2 , 
        XMR: 2 , 
        XRP: 2 , 
        ZEC: 2 , 
        BTC: 2
    } , 
    tidex : {
        USD: 500,
        DASH: 1000,
        EOS: 2, 
        ETC: 2, 
        ETH: 2 , 
        ICN: 2 , 
        LTC: 2 , 
        MLN: 2 , 
        REP: 2 , 
        DOGE: 2 , 
        XLM: 2 , 
        XMR: 2 , 
        XRP: 2 , 
        ZEC: 2 , 
        BTC: 2
    } , 
    exmo : {
        USD: 500,
        DASH: 1000,
        EOS: 2, 
        ETC: 2, 
        ETH: 2 , 
        ICN: 2 , 
        LTC: 2 , 
        MLN: 2 , 
        REP: 2 , 
        DOGE: 2 , 
        XLM: 2 , 
        XMR: 2 , 
        XRP: 2 , 
        ZEC: 2 , 
        BTC: 2
    } , 
    kraken : {
        USD: 500,
        DASH: 1000,
        EOS: 2, 
        ETC: 2, 
        ETH: 2 , 
        ICN: 2 , 
        LTC: 2 , 
        MLN: 2 , 
        REP: 2 , 
        DOGE: 2 , 
        XLM: 2 , 
        XMR: 2 , 
        XRP: 2 , 
        ZEC: 2 , 
        BTC: 2
    }
}
io.on('connection', function (socket) {
    socket.emit('coinsAndMarkets', [marketNames, coinNames]);
    socket.emit('results', results);
});

// coin_prices is an object with data on price differences between markets. = {BTC : {market1 : 2000, market2: 4000, p : 2}, } (P for percentage difference)
// results is a 2D array with coin name and percentage difference, sorted from low to high.
let coin_prices = {} , numberOfRequests = 0, results = [], totalProfit = 0, totalRequiredCash = 0 , initiatingTrades = false , longPositionFee = 0 , shortPositionFee = 0; // GLOBAL variables to get pushed to browser.

function getMarketData(options, coin_prices, callback) {   //GET JSON DATA
    return new Promise(function (resolve, reject) {
        request(options.URL, function (error, response, body) {
            try {
                let data = JSON.parse(body);
                data.fees = options.fees
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
                    if (Object.keys(data[coin]).length > 1 && data[coin] !== 'volume') {
                        if (coinNames.includes(coin) == false) coinNames.push(coin);
                        let arr = [];
                        for (let market in data[coin]) {
                            console.log(market)
                            if (market !== 'volume') {                            
                                let fees , position
                                for (let i = 0 ; i < markets.length ; i++) {
                                    if (markets[i].marketName === market) {
                                        fees = markets[i].fees
                                        position = market[i].position
                                    }
                                }
                                arr.push([data[coin][market], market, fees, position]);
                            }
                        }
                        arr.sort(function (a, b) {
                            return a[0] - b[0];
                        });
                        for (let i = 0; i < arr.length; i++) {
                            for (let j = i + 1; j < arr.length; j++) {
                                let maxVol , requiredCash , profitPercentage , totalProfit , marketSpread, marketFees
                                    if (arr[i][0].bid.price>arr[j][0].ask.price) {  
                                        if (arr[i][0].bid.volume > arr[j][0].ask.volume)
                                            maxVol = arr[j][0].ask.volume * 0.7
                                        else 
                                            maxVol = arr[i][0].bid.volume * 0.7
                                        if (coin.split('_')[1] === 'USD')
                                            requiredCash = maxVol * (parseFloat(arr[i][0].bid.price) + parseFloat(arr[j][0].ask.price)) 
                                        if (coin.split('_')[1] === 'BTC')
                                            requiredCash = maxVol * (parseFloat(arr[i][0].bid.price) + parseFloat(arr[j][0].ask.price)) * 4300

                                        marketSpread = arr[i][0].bid.price - arr[j][0].ask.price
                                        marketFees = arr[i][0].bid.price * arr[i][2].seller + arr[j][0].ask.price * arr[j][2].buyer
                                        totalProfit = (marketSpread - marketFees) * maxVol   
                                        profitPercentage = totalProfit/requiredCash                        
                                        results.push({
                                            coinPair: coin,
                                            spread: arr[i][0].bid.price / arr[j][0].ask.price,
                                            profitPercentage: profitPercentage, 
                                            totalProfit: totalProfit,
                                            requiredCash : requiredCash , 
                                            bidMarket: {
                                                name: arr[i][1],
                                                bid: arr[i][0].bid.price, 
                                                volume: arr[i][0].bid.volume, 
                                                fee: arr[i][2].seller
                                            },
                                            askMarket: {
                                                name: arr[j][1],
                                                ask: arr[j][0].ask.price, 
                                                volume: arr[j][0].ask.volume, 
                                                fee: arr[j][2].buyer
                                            }, 
                                            fees: marketFees, 
                                            volume: maxVol
                                        })
                                    }
                                    if (arr[j][0].bid.price>arr[i][0].ask.price){ 
                                        if (arr[j][0].bid.volume > arr[i][0].ask.volume)
                                            maxVol = arr[i][0].ask.volume * 0.7
                                        else 
                                            maxVol = arr[j][0].bid.volume  * 0.7
                                        if (coin.split('_')[1] === 'USD')
                                            requiredCash = maxVol * (parseFloat(arr[j][0].bid.price) + parseFloat(arr[i][0].ask.price)) 
                                        if (coin.split('_')[1] === 'BTC')
                                            requiredCash = maxVol * (parseFloat(arr[j][0].bid.price) + parseFloat(arr[i][0].ask.price)) * 4300  
                                        marketSpread = arr[j][0].bid.price - arr[i][0].ask.price;
                                        marketFees = arr[j][0].bid.price * arr[j][2].seller + arr[i][0].ask.price * arr[i][2].buyer;
                                        totalProfit = (marketSpread - marketFees) * maxVol 
                                        profitPercentage = totalProfit/requiredCash

                                        //secondaryCurrency.price[USD]
                                        //results[i].coinPair === 'SecondaryCurrency_USD'
                                        //results[i].market === 'kraken'
                                        //results[i].
                                        results.push({
                                            coinPair: coin,
                                            spread: arr[j][0].bid.price / arr[i][0].ask.price,
                                            profitPercentage: profitPercentage, 
                                            totalProfit: totalProfit,
                                            requiredCash : requiredCash , 
                                            bidMarket: {
                                                name: arr[j][1],
                                                bid: arr[j][0].bid.price, 
                                                volume: arr[j][0].bid.volume , 
                                                fee: arr[j][2].seller
                                            },
                                            askMarket: {
                                                name: arr[i][1],
                                                ask: arr[i][0].ask.price, 
                                                volume: arr[i][0].ask.volume , 
                                                fee: arr[i][2].buyer
                                            }, 
                                            fees: marketFees, 
                                            volume: maxVol
                                        })
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
                    return b.profitPercentage - a.profitPercentage;
                });
                resolve();
            }
        })
    }

    await loopData();



    if (results[0].profitPercentage > 0.0035){
        let bidMarket = results[0].bidMarket.name
        let askMarket = results[0].askMarket.name
        shortPositionFee = results[0].bidMarket.fee
        longPositionFee = results[0].askMarket.fee
        let primaryCurrency = results[0].coinPair.split('_')[0]
        let secondaryCurrency = results[0].coinPair.split('_')[1]
        let sellPosition = position[bidMarket][primaryCurrency]
        let buyPosition = position[askMarket][secondaryCurrency]
        // if ((sellPosition-parseFloat(results[0].volume)) > 0 && (buyPosition-parseFloat(results[0].volume) * parseFloat(results[0].askMarket.ask)) > 0 && initiatingTrades !== true) {
        console.log('initiating trades')
        initiatingTrades = true
        setTimeout(()=> {initiatingTrades = false}, 3000)
        //initiate transaction
            position[bidMarket][secondaryCurrency] += parseFloat(results[0].volume) * parseFloat(results[0].bidMarket.bid) * (1 - shortPositionFee)
            position[bidMarket][primaryCurrency] -= parseFloat(results[0].volume)
            position[askMarket][secondaryCurrency] -= parseFloat(results[0].volume) * parseFloat(results[0].askMarket.ask)
            position[askMarket][primaryCurrency] += parseFloat(results[0].volume)   * (1 - longPositionFee)
            console.log('new position for ' + bidMarket + ' ' + primaryCurrency + ' ' + position[bidMarket][primaryCurrency])
            console.log('new position for ' + bidMarket + ' ' + secondaryCurrency + ' ' + position[bidMarket][secondaryCurrency])
            console.log('new position for ' + askMarket + ' ' + primaryCurrency + ' ' + position[askMarket][primaryCurrency])
            console.log('new position for ' + askMarket + ' ' + secondaryCurrency + ' ' + position[askMarket][secondaryCurrency])
            totalProfit += results[0].totalProfit
            console.log('total profit: ' + totalProfit);
            console.log(secondaryCurrency)
            console.log(results[0].volume)
            totalRequiredCash += results[0].requiredCash
            console.log('total minimum required $$: ' + totalRequiredCash )
        // } else {
        //     if (initiatingTrades !== true) {
        //         shortPositionFee = results[0].bidMarket.fee
        //         longPositionFee = results[0].askMarket.fee
        //         console.log('reloading a position')
        //         if ((sellPosition-parseFloat(results[0].volume)) <= 0) {
        //             console.log('loading short position')
        //             initiatingTrades = true
        //             setTimeout(()=> {initiatingTrades = false}, 3000)
        //             let secondaryCurrencyB
        //             if (secondaryCurrency === 'BTC') 
        //                 secondaryCurrencyB = 'USD'
        //             else 
        //                 secondaryCurrencyB = 'BTC'
        //             // if ()
        //             let conversionCurrencies = primaryCurrency + '_' + secondaryCurrencyB
        //             position[bidMarket][secondaryCurrencyB] -= coin_prices[conversionCurrencies][bidMarket].ask.price * coin_prices[conversionCurrencies][bidMarket].ask.volume
        //             position[bidMarket][primaryCurrency] += coin_prices[conversionCurrencies][bidMarket].ask.volume * (1 - shortPositionFee)
        //             console.log('new position: ' + bidMarket + ' ' + primaryCurrency + position[bidMarket][primaryCurrency] )
        //             console.log('new position: ' + bidMarket + ' ' + secondaryCurrencyB + position[bidMarket][secondaryCurrencyB] )
        //         }
        //         if ((buyPosition-parseFloat(results[0].volume) * parseFloat(results[0].askMarket.ask)) <= 0 ) {
        //             console.log('rates : ' + util.inspect(coin_prices.BTC_USD[askMarket]))
        //             console.log('loading long position')
        //             initiatingTrades = true
        //             setTimeout(()=> {initiatingTrades = false}, 3000)
        //             let secondaryCurrencyB , conversionPrice , conversionVolume
        //             if (secondaryCurrency === 'BTC') 
        //                 secondaryCurrencyB = 'USD'
        //             else 
        //                 secondaryCurrencyB = 'BTC'
        //             let conversionCurrencies = 'BTC_USD' 

        //             conversionPrice = coin_prices[conversionCurrencies][askMarket].ask.price
        //             conversionVolume = coin_prices[conversionCurrencies][askMarket].ask.volume
        //             console.log('new secondary currency: ' + conversionVolume * conversionPrice  * (1 - longPositionFee))
        //             console.log('secondaryCurrencyB: ' + secondaryCurrencyB)
        //             if (secondaryCurrencyB === 'BTC') {
        //                 position[bidMarket][secondaryCurrencyB] -= conversionVolume
        //                 position[bidMarket][secondaryCurrency] += conversionPrice * conversionVolume * (1 - longPositionFee)
        //             } else {
        //                 position[bidMarket][secondaryCurrencyB] -= conversionVolume * conversionPrice 
        //                 position[bidMarket][secondaryCurrency] += conversionVolume * (1 - longPositionFee)
                        
        //             }
        //             console.log('new position: ' + askMarket + ' ' + secondaryCurrency +  ' ' + position[bidMarket][secondaryCurrency] )
        //             console.log('new position: ' + askMarket + ' ' + secondaryCurrencyB + ' ' + position[bidMarket][secondaryCurrencyB] )
        //         }
        //     }
        // }

    } else {
        console.log('no profitable positions')
    }



    io.emit('results', results);
}


(async function main() {
    let arrayOfRequests = [];

    for (let i = 0; i < markets.length; i++) {
        arrayOfRequests.push(getMarketData(markets[i], coin_prices));
    }

    await Promise.all(arrayOfRequests.map(p => p.catch(e => e)))

        .then(results => {computePrices(coin_prices)})

        .catch(e => console.log(e));

    setTimeout(main, 2000);
})();
