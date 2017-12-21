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
        DASH: 100,
        EOS: 10, 
        ETH: 10 , 
        ICN: 10 , 
        LTC: 10 , 
        MLN: 10 ,  
        BTC: 1
    } , 
    yobit : {
        USD: 1000,
        DASH: 100,
        EOS: 10, 
        ETH: 10 , 
        ICOIN: 10 , 
        LTC: 100 , 
        MLN: 100 , 
        REPUB: 100 , 
        BTC: 1
    } , 
    tidex : {
        USD: 1000,
        DASH: 100,
        EOS: 10, 
        ETH: 10 , 
        ICN: 10 , 
        LTC: 10 , 
        MLN: 10 , 
        REP: 10 , 
        BTC: 1
    } , 
    exmo : {
        //eth dash waves ltc xrp zec doge btc usd
        USD: 1000,
        DASH: 10,
        ETH: 10 , 
        ICN: 10 , 
        LTC: 10 , 
        XRP: 10 , 
        ZEC: 10 , 
        BTC: 1
    } , 
    kraken : {
        USD: 1000,
        DASH: 10,
        EOS: 10, 
        ETC: 10, 
        ETH: 10 , 
        ICN: 10 , 
        LTC: 10 , 
        MLN: 10 , 
        REP: 10 , 
        DOGE: 10 , 
        XLM: 10 , 
        XMR: 10 , 
        XRP: 10 , 
        ZEC: 10 , 
        BTC: 1
    }
}

let startingValue = 0.25

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
        let secondaryCurrencyA = results[0].coinPair.split('_')[1]
        let sellPosition = position[bidMarket][primaryCurrency]
        let buyPosition = position[askMarket][secondaryCurrencyA]
        // if ((sellPosition-parseFloat(results[0].volume)) > 0 && (buyPosition-parseFloat(results[0].volume) * parseFloat(results[0].askMarket.ask)) > 0 && initiatingTrades !== true) {
        console.log('initiating trades')
        initiatingTrades = true
        setTimeout(()=> {initiatingTrades = false}, 3000)
        //initiate transaction

        let tempBidPosPrimaryCurrency = position[bidMarket][primaryCurrency] - parseFloat(results[0].volume)
        if ( tempBidPosPrimaryCurrency > 0 ) {
            //do trade if greater than zero
            console.log('initiating bid market arbitrage at book vol')
            position[bidMarket][secondaryCurrencyA] += parseFloat(results[0].volume) * parseFloat(results[0].bidMarket.bid) * (1 - shortPositionFee)
            position[bidMarket][primaryCurrency] -= parseFloat(results[0].volume)
            console.log('new position for ' + bidMarket + ' ' + secondaryCurrencyA + ' ' + position[bidMarket][secondaryCurrencyA])
            console.log('new position for ' + bidMarket + ' ' + primaryCurrency + ' ' + position[bidMarket][primaryCurrency])
        }
        if ( tempBidPosPrimaryCurrency <= 0 ) {
            //trade remainder in acct
            if (parseFloat(position[bidMarket][primaryCurrency]) !== 0 ) {
                console.log('initiating bid market arbitrage at portfolio vol')
                position[bidMarket][secondaryCurrencyA] += position[bidMarket][primaryCurrency] * parseFloat(results[0].bidMarket.bid) * (1 - shortPositionFee)
                position[bidMarket][primaryCurrency] = 0 
                console.log('new secondary currency position for ' + bidMarket + ' ' + secondaryCurrencyA + ' ' + position[bidMarket][secondaryCurrencyA])
                console.log('new position for ' + bidMarket + ' ' + primaryCurrency + ' ' + position[bidMarket][primaryCurrency])
            }
            //sell secondary currency B for primary
            if (secondaryCurrencyA === 'USD' && primaryCurrency !== 'BTC' ) {
                let secondaryCurrencyB = 'BTC'
                if ( position[bidMarket][secondaryCurrencyB] > 0 ) {                 
                    console.log('reloading')
                    let tempBidPosSecondaryCurrencyB = position[bidMarket][secondaryCurrencyB] - coin_prices[primaryCurrency + '_BTC'][bidMarket].ask.volume * coin_prices[primaryCurrency + '_BTC'][bidMarket].ask.price
                    if (tempBidPosSecondaryCurrencyB > 0 ) {
                        //sell at book vol
                        console.log('reloading primary currency in bid market at book vol with btc')
                        position[bidMarket][primaryCurrency] += coin_prices[primaryCurrency + '_BTC'][bidMarket].ask.volume * ( 1 - coin_prices[primaryCurrency + '_BTC'][bidMarket].fees.maker )
                        position[bidMarket][secondaryCurrencyB] -= coin_prices[primaryCurrency + '_BTC'][bidMarket].ask.volume * coin_prices[primaryCurrency + '_BTC'][bidMarket].ask.price
                        console.log('new position for ' + bidMarket + ' ' + secondaryCurrencyB + ' ' + position[bidMarket][secondaryCurrencyB])
                        console.log('new position for ' + bidMarket + ' ' + primaryCurrency + ' ' + position[bidMarket][primaryCurrency])
                    }
                    if (tempBidPosSecondaryCurrencyB <= 0 ) {
                        console.log('reloading primary currency in bid market at portfolio vol with btc')
                        //sell at portfolio vol
                        position[bidMarket][primaryCurrency] += position[bidMarket][secondaryCurrencyB] * (1 / coin_prices[primaryCurrency + '_BTC'][bidMarket].ask.price) * ( 1 - coin_prices[primaryCurrency + '_BTC'][bidMarket].fees.maker )
                        position[bidMarket][secondaryCurrencyB] = 0
                        console.log('new position for ' + bidMarket + ' ' + secondaryCurrencyB + ' ' + position[bidMarket][secondaryCurrencyB])
                        console.log('new position for ' + bidMarket + ' ' + primaryCurrency + ' ' + position[bidMarket][primaryCurrency])
                    }
                }

            }   
            if (secondaryCurrencyA === 'USD' && primaryCurrency === 'BTC') {
                
            } 
        }        
        let tempAskPosSecondaryCurrency = position[askMarket][secondaryCurrencyA] - parseFloat(results[0].volume) * parseFloat(results[0].askMarket.ask) * (1 - shortPositionFee)
        if (  tempAskPosSecondaryCurrency > 0 ) {
            //do trade if greater than zero
            console.log('initiating ask market arbitrage at book vol')
            position[askMarket][primaryCurrency] += parseFloat(results[0].volume) 
            position[askMarket][secondaryCurrencyA] -= parseFloat(results[0].volume) * parseFloat(results[0].askMarket.ask) * (1 - shortPositionFee)
            console.log('new position for ' + askMarket + ' ' + secondaryCurrencyA + ' ' + position[askMarket][secondaryCurrencyA])
            console.log('new position for ' + askMarket + ' ' + primaryCurrency + ' ' + position[askMarket][primaryCurrency])
        }
        if ( tempAskPosSecondaryCurrency <= 0 ) {
            //trade remainder in acct
            if (parseFloat(position[askMarket][secondaryCurrencyA]) !== 0 ) {
                console.log('initiating ask market arbitrage at portfolio vol')
                position[askMarket][primaryCurrency] += position[askMarket][secondaryCurrencyA]  * (1 / parseFloat(results[0].askMarket.ask)) * (1 - shortPositionFee)
                position[askMarket][secondaryCurrencyA] = 0
                console.log('new secondary currency position for ' + askMarket + ' ' + secondaryCurrencyA + ' ' + position[askMarket][secondaryCurrencyA])
                console.log('new position for ' + askMarket + ' ' + primaryCurrency + ' ' + position[askMarket][primaryCurrency])
            }
            console.log(secondaryCurrencyA)
            //sell secondary currency B for primary
            if (secondaryCurrencyA === 'USD' && primaryCurrency !== 'BTC' ) {
                let secondaryCurrencyB = 'BTC'
                if ( position[askMarket][secondaryCurrencyB] > 0 ) {                    
                    console.log('reloading')
                    let tempBidPosSecondaryCurrencyB = position[askMarket][secondaryCurrencyB] - coin_prices['BTC_USD'][askMarket].bid.volume 
                    if (tempBidPosSecondaryCurrencyB > 0 ) {
                        //sell at book vol
                        console.log('reloading secondary currency in ask market at book vol with BTC')
                        position[askMarket][secondaryCurrencyA] += parseFloat(coin_prices['BTC_USD'][askMarket].bid.volume * coin_prices['BTC_USD'][askMarket].bid.price * ( 1 - coin_prices['BTC_USD'][askMarket].fees.maker ))
                        position[askMarket][secondaryCurrencyB] -= parseFloat(coin_prices['BTC_USD'][askMarket].bid.volume)
                        console.log('new position for ' + askMarket + ' ' + secondaryCurrencyB + ' ' + position[askMarket][secondaryCurrencyB])
                        console.log('new position for ' + askMarket + ' ' + secondaryCurrencyA + ' ' + position[askMarket][secondaryCurrencyA])
                    }
                    if (tempBidPosSecondaryCurrencyB <= 0 ) {
                        console.log('reloading secondary currency in ask market at portfolio vol with btc')
                        //sell at portfolio vol
                        position[askMarket][secondaryCurrencyA] += parseFloat(position[askMarket][secondaryCurrencyB] * (coin_prices['BTC_USD'][askMarket].bid.price) * ( 1 - coin_prices['BTC_USD'][askMarket].fees.maker ))
                        position[askMarket][secondaryCurrencyB] = 0
                        console.log('new position for ' + askMarket + ' ' + secondaryCurrencyB + ' ' + position[askMarket][secondaryCurrencyB])
                        console.log('new position for ' + askMarket + ' ' + secondaryCurrencyA + ' ' + position[askMarket][secondaryCurrencyA])
                    }
                }
            } 
            if (secondaryCurrencyA === 'USD' && primaryCurrency === 'BTC') {
                
            } 
        }

    } else {
        console.log('no profitable positions')
    }

    let currentValue = 0
    for (let marketPosition in position) {
        for (let coinPosition in position[marketPosition]) {
            if (coinPosition === 'BTC') currentValue += parseFloat(position[marketPosition][coinPosition])
            else {
                if (coinPosition === 'USD' && coin_prices['BTC_USD'][marketPosition] !== undefined) {
                    currentValue += parseFloat(position[marketPosition][coinPosition]/ coin_prices['BTC_USD'][marketPosition].ask.price) 
                } else {
                    if (coin_prices[coinPosition + '_BTC'] !== undefined && coin_prices[coinPosition + '_BTC'][marketPosition] !== undefined && coin_prices[coinPosition + '_BTC'][marketPosition].bid !== undefined){
                        currentValue += parseFloat(position[marketPosition][coinPosition] * coin_prices[coinPosition + '_BTC'][marketPosition].bid.price)
                    }
                }
            }
        }

    }   

    // NOTE : Trades sorta fail when arbitrage is btwn USD and BTC and
    // we run out of either or when the arbitrage deltas are 
    // Fix by adding other currencies 
    
    console.log('current portfolio value: ' + currentValue)
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
