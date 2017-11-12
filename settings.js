//
// let boilerPlateMarket =
// {
//     marketName: '',
//     URL: '', //URL To Fetch API From.
//     toBTCURL: false, //URL, if needed for an external bitcoin price api.
//     last: function (data, coin_prices) { //Get the last price of coins in JSON data
//         return new Promise(function (res, rej) {
//             try {
//                 for (x in / of data) {
//                     price = ...;
//                     coin_prices[coinName][marketName] = price;
//                 }
//                 res(coin_prices);
//             }
//             catch (err) {
//                 rej(err);
//             }
//
//         })
//     },
//
//
// }

const util = require('util')

let markets = [

    // {
    //     marketName: 'cryptowatchAPI',
    //     URL: 'https://api.cryptowat.ch/markets/summaries', //URL To Fetch API From.
    //     toBTCURL: false, //URL, if needed for an external bitcoin price api.
    //
    //     last: function (data, coin_prices, toBTCURL) { //Where to find the last price of coin in JSON data
    //         return new Promise(function (res, rej) {
    //             try {
    //                 data = data.result;
    //                 for (let key in data) {
    //                     let marketPair = key.split(':');
    //                     let market = marketPair[0], pair = marketPair[1];
    //                     let indexOfBTC = pair.indexOf('btc');
    //                     if (indexOfBTC > 0 && !pair.includes('future') && !market.includes('qryptos') && !market.includes('quoine') && !market.includes('poloniex')) {
    //                         if(marketNames.indexOf(market) === -1 ){
    //                             marketNames.push([[market], ['']]);
    //                             console.log(marketNames);
    //                         }
    //                         let coin = pair.replace(/btc/i, '').toUpperCase();
    //                         let price = data[key].price.last;
    //                         if(price > 0) {
    //                             if (!coin_prices[coin]) coin_prices[coin] = {};
    //                             coin_prices[coin][market] = price;
    //
    //                         }
    //                     }
    //                 }
    //                 res(coin_prices);
    //             }
    //             catch (err) {
    //                 console.log(err);
    //                 rej(err)
    //             }
    //         })
    //     }
    //
    // },
 //    {
 //        marketName: 'bittrex',
 //        fees: {
 //        	buyer: 	0.0025, 
 //        	seller: 0.0025
 //        }, 
 //        URL: 'https://bittrex.com/api/v1.1/public/getmarketsummaries',
 //        toBTCURL: false,
 //        pairURL : '',
 //        last: function (data, coin_prices) { //Where to find the last price of coin in JSON data
 //            return new Promise(function (res, rej) {
 //                try {
 //                    for (let obj of data.result) {
 //                        if(obj["MarketName"].includes('BTC-')) {
 //                            let coinName = obj["MarketName"].replace("BTC-", '');
 //                            if (!coin_prices[coinName]) coin_prices[coinName] = {};
 //                            coin_prices[coinName].bittrex = obj.Last;
 //                        }
 //                    }
 //                    res(coin_prices);
 //                }
 //                catch (err) {
 //                    console.log(err);
 //                    rej(err);
 //                }

 //            })
 //        },

 //    },

 //    {
 //        marketName: 'btc38',
 //        URL: 'http://api.btc38.com/v1/ticker.php?c=all&mk_type=cny',
 //        fees: {
 //        	buyer: 0.001, 
 //        	seller: 0.001
 //        }, 
 //        toBTCURL: false,
 //        pairURL : '',
 //        last: function (data, coin_prices, toBTCURL) { //Where to find the last price of coin in JSON data
 //            return new Promise(function (res, rej) {
 //                let priceOfBTC = data.btc.ticker.last;
 //                try {
 //                    for (let key in data) {
 //                        let coinName = key.toUpperCase();
 //                        let price = data[key]['ticker'].last;
 //                        if (!coin_prices[coinName]) coin_prices[coinName] = {};

 //                        coin_prices[coinName]["btc38"] = data[key]['ticker'].last / priceOfBTC;
 //                    }
 //                    res(coin_prices);
 //                }

 //                catch (err) {
 //                    console.log(err);
 //                    rej(err)
 //                }
 //            })
 //        }
 //    },

 //    {
 //        marketName: 'jubi',
 //        URL: 'https://www.jubi.com/api/v1/allticker/', //URL To Fetch API From.
 //        fees: {
 //        	buyer: 0.001, 
 //        	seller: 0.001
 //        }, 
 //        toBTCURL: false, //URL, if needed for an external bitcoin price api.
 //        pairURL : '',
 //        last: function (data, coin_prices, toBTCURL) { //Where to find the last price of coin in JSON data
 //            return new Promise(function (res, rej) {
 //                let priceOfBTC = data.btc.last;
 //                console.log(priceOfBTC);
 //                try {
 //                    for (let key in data) {
 //                        let coinName = key.toUpperCase();
 //                        let price = data[key].last;
 //                        if (!coin_prices[coinName]) coin_prices[coinName] = {};

 //                        coin_prices[coinName]["jubi"] = data[key].last / priceOfBTC;
 //                    }
 //                    res(coin_prices);
 //                }

 //                catch (err) {
 //                    console.log(err);
 //                    rej(err)
 //                }
 //            })
 //        }

 //    },


 //    {
 //        marketName: 'poloniex',
	// 	fees: {
 //        	seller: 0.0015, 
 //        	buyer: 0.0025
 //        }, 
 //        URL: 'https://poloniex.com/public?command=returnTicker',
 //        toBTCURL: false,
 //        pairURL : '',
 //        last: function (data, coin_prices) { //Where to find the last price of coin in JSON data
 //            return new Promise(function (res, rej) {
 //                try {
 //                    for (var obj in data) {
 //                        if(obj.includes('BTC_')&&obj!=="BTC_EMC2") {
 //                            let coinName = obj.replace("BTC_", '');
 //                            if (!coin_prices[coinName]) coin_prices[coinName] = {};
 //                            coin_prices[coinName].poloniex = data[obj].last;
 //                        }
 //                    }
 //                    res(coin_prices);
 //                }
 //                catch (err) {
 //                    console.log(err);
 //                    rej(err);
 //                }

 //            })
 //        },

 //    },
    
 //    {
	// 	marketName: 'cryptopia',
	// 	fees: {
 //        	seller: 0.002, 
 //        	buyer: 0.002
 //        }, 
	// 	URL: 'https://www.cryptopia.co.nz/api/GetMarkets/BTC', //URL To Fetch API From.
	// 	toBTCURL: false, //URL, if needed for an external bitcoin price api.
 //        pairURL : '',
 //        last: function (data, coin_prices) { //Get the last price of coins in JSON data
	// 		return new Promise(function (res, rej) {
	// 			try {
	// 				for (let obj of data.Data) {
	// 					if(obj["Label"].includes('/BTC')) {
	// 						let coinName = obj["Label"].replace("/BTC", '');
	// 						if (!coin_prices[coinName]) coin_prices[coinName] = {};
	// 						coin_prices[coinName].cryptopia = obj.LastPrice;
 //                        }
 //                    }
 //                    res(coin_prices);
					
 //                }
 //                catch (err) {
 //                    console.log(err);
 //                    rej(err);
 //                }

 //            })
	// 	},
	// },
    
 //    {
 //        marketName: 'bleutrade',        
 //        fees: {
 //            seller: 0.0025, 
 //            buyer: 0.0025
 //        }, 
 //        URL: 'https://bleutrade.com/api/v2/public/getmarketsummaries', //URL To Fetch API From.
 //        toBTCURL: false, //URL, if needed for an external bitcoin price api.
 //        pairURL : '',
 //        last: function (data, coin_prices) { //Get the last price of coins in JSON data
 //            return new Promise(function (res, rej) {
 //                try {
 //                    for (let obj of data.result) {
 //                        if(obj["MarketName"].includes('_BTC')) {
 //                            let coinName = obj["MarketName"].replace("_BTC", '');
 //                            if (!coin_prices[coinName]) coin_prices[coinName] = {};
 //                            coin_prices[coinName].bleutrade = obj.Last;
 //                        }
 //                    }
 //                    res(coin_prices);
                    
 //                }
 //                catch (err) {
 //                    console.log(err);
 //                    rej(err);
 //                }

 //            })
 //        },
 //    },
    
    {
        marketName: 'liqui',        
        fees: {
            seller: 0.001, 
            buyer: 0.001
        }, 
        URL: 'https://api.liqui.io/api/3/depth/dash_btc-eos_btc-gno_btc-eth_btc-icn_btc-ltc_btc-mln_btc-rep_btc?limit=1&ignore_invalid=1', //URL To Fetch API From.
        toBTCURL: false, //URL, if needed for an external bitcoin price api.
        pairURL : '',
        last: function (data, coin_prices) { //Get the last price of coins in JSON data
            return new Promise(function (res, rej) {
                try {
                    let coinName , bidPrice , bidVolume , askPrice , askVolume;
                    Object.keys(data).forEach(function(key,index) {
                        if (data.hasOwnProperty(key)) {
                            coinName = key.toUpperCase()
                            if (!coin_prices[coinName]) coin_prices[coinName] = {}
                            if (data[key].asks !== undefined) {
                                askPrice = data[key].asks.toString().split(',')[0] 
                                askVolume = data[key].asks.toString().split(',')[1]
                            } else {
                                askPrice = 0
                                askVolume = 0
                            }
                            if (data[key].bids !== undefined) {
                                bidPrice = data[key].bids.toString().split(',')[0]
                                bidVolume = data[key].bids.toString().split(',')[1]
                            } else {
                                bidPrice = 0 
                                bidVolume = 0
                            }
                            coin_prices[coinName].liqui = {
                                ask: {
                                    price: askPrice, 
                                    volume: askVolume
                                }, 
                                bid: {
                                    price: bidPrice, 
                                    volume: bidVolume

                                }
                            }
                        }
                    })
                    res(coin_prices);
                    
                }
                catch (err) {
                    console.log(err);
                    rej(err);
                }

            })
        },
    },
    {
        marketName: 'yobit',        
        fees: {
            seller: 0.002, 
            buyer: 0.002
        }, 
        URL: 'https://yobit.net/api/3/depth/dash_btc-eos_btc-gno_btc-eth_btc-icn_btc-ltc_btc-mln_btc-rep_btc-btc_usd-dash_usd-eos_usd-gno_usd-eth_usd-icn_usd-ltc_usd-mln_usd-rep_usd?limit=1&ignore_invalid=1', //URL To Fetch API From.
        toBTCURL: false, //URL, if needed for an external bitcoin price api.
        pairURL : '',
        last: function (data, coin_prices) { //Get the last price of coins in JSON data
            return new Promise(function (res, rej) {
                try {
                    let coinName , bidPrice , bidVolume , askPrice , askVolume;
                    Object.keys(data).forEach(function(key,index) {
                        if (data.hasOwnProperty(key))
                            if (data[key].asks !== undefined ) {
                                askPrice = data[key].asks.toString().split(',')[0]
                                askVolume = data[key].asks.toString().split(',')[1]
                            } else {
                                askPrice = 0 
                                askVolume = 0
                            }
                            if (data[key].bids !== undefined ) {
                                bidPrice = data[key].bids.toString().split(',')[0]
                                bidVolume = data[key].bids.toString().split(',')[1]
                            } else {
                                bidPrice = 0
                                bidVolume = 0
                            }
                            if (key.includes('_btc')) {
                                coinName = key.replace("_btc", '').toUpperCase()
                                if (coinName === 'REP') coinName = 'REPUB'
                                if (coinName === 'ICN') coinName = 'ICOIN'
                                coinName = coinName + '_BTC'
                                if (!coin_prices[coinName]) coin_prices[coinName] = {}
                                coin_prices[coinName].yobit = {
                                    ask : {
                                        price: askPrice , 
                                        volume : askVolume
                                    } , 
                                    bid : {
                                        price: bidPrice , 
                                        volume : bidVolume
                                    }
                                }
                            }
                            if (key.includes('_usd')) {
                                let coinName = key.replace("_usd", '').toUpperCase()
                                if (coinName === 'REP') coinName = 'REPUB'
                                if (coinName === 'ICN') coinName = 'ICOIN'
                                coinName = coinName + '_USD'
                                if (!coin_prices[coinName]) coin_prices[coinName] = {}
                                coin_prices[coinName].yobit = {
                                    ask : {
                                        price: bidPrice , 
                                        volume : bidVolume
                                    } , 
                                    bid : {
                                        price: bidPrice , 
                                        volume : bidVolume
                                    }
                                }
                            }
                    })
                    // for (let obj of data) {
                    //     console.log('liqui data: ' + obj)
                    //     if(obj["MarketName"].includes('_BTC')) {
                    //         let coinName = obj["MarketName"].replace("_BTC", '');
                    //         if (!coin_prices[coinName]) coin_prices[coinName] = {};
                    //         coin_prices[coinName].bleutrade = obj.Last;
                    //     }
                    // }
                    res(coin_prices);
                    
                }
                catch (err) {
                    console.log(err);
                    rej(err);
                }

            })
        },
    },
    {
        marketName: 'tidex',        
        fees: {
            seller: 0.000001, 
            buyer: 0.000001
        },  
        URL: 'https://api.tidex.com/api/3/depth/dash_btc-eos_btc-gno_btc-eth_btc-icn_btc-ltc_btc-mln_btc-rep_btc-btc_usd-dash_usd-eos_usd-gno_usd-eth_usd-icn_usd-ltc_usd-mln_usd-rep_usd?limit=1&ignore_invalid=1', //URL To Fetch API From.
        toBTCURL: false, //URL, if needed for an external bitcoin price api.
        pairURL : '',
        last: function (data, coin_prices) { //Get the last price of coins in JSON data
            return new Promise(function (res, rej) {
                try {
                    let coinName , bidPrice , bidVolume , askPrice , askVolume;
                    Object.keys(data).forEach(function(key,index) {
                        if (data.hasOwnProperty(key))
                            coinName = key.toUpperCase()
                            if (data[key].asks !== undefined) {
                                askPrice = data[key].asks[0][0]
                                askVolume = data[key].asks[0][1]
                            } else {
                                askPrice = 0
                                askVolume = 0
                            }
                            if (data[key].bids !== undefined) {
                                bidPrice = data[key].bids[0][0]
                                bidVolume = data[key].bids[0][1]
                            } else {
                                bidPrice = 0
                                bidVolume = 0
                            }
                            if (!coin_prices[coinName]) coin_prices[coinName] = {}
                            coin_prices[coinName].tidex = {
                                ask: {
                                    price: askPrice, 
                                    volume: askVolume
                                } , 
                                bid: {
                                    price: bidPrice, 
                                    volume: bidVolume
                                }
                            }
                    })
                    // for (let obj of data) {
                    //     console.log('liqui data: ' + obj)
                    //     if(obj["MarketName"].includes('_BTC')) {
                    //         let coinName = obj["MarketName"].replace("_BTC", '');
                    //         if (!coin_prices[coinName]) coin_prices[coinName] = {};
                    //         coin_prices[coinName].bleutrade = obj.Last;
                    //     }
                    // }
                    res(coin_prices);
                    
                }
                catch (err) {
                    console.log(err);
                    rej(err);
                }

            })
        },
    },
    {
        marketName: 'exmo',        
        fees: {
            seller: 0.002, 
            buyer: 0.002
        }, 
        URL: 'https://api.exmo.com/v1/order_book/?limit=1&pair=ETH_BTC,DASH_BTC,WAVES_BTC,LTC_BTC,XRP_BTC,ZEC_BTC,DOGE_BTC,BTC_USD,ETH_USD,DASH_USD,WAVES_USD,LTC_USD,XRP_USD,ZEC_USD,DOGE_USD', //URL To Fetch API From.
        toBTCURL: false, //URL, if needed for an external bitcoin price api.
        pairURL : '',
        last: function (data, coin_prices) { //Get the last price of coins in JSON data
            return new Promise(function (res, rej) {
                try {
                    let coinName , bidPrice , bidVolume , askPrice , askVolume
                    Object.keys(data).forEach(function(key,index) {
                        if (data.hasOwnProperty(key)) {                        
                            coinName = key 
                            if (!coin_prices[coinName]) coin_prices[coinName] = {}
                            if (data[key].ask !== null && data[key].ask !== undefined) {    
                                askPrice = data[key].ask[0][0]
                                askVolume = data[key].ask[0][1]
                            } else {
                                askPrice = 0
                                askVolume = 0
                            }
                            if (data[key].bid !== null && data[key].bid !== undefined) {
                                bidPrice = data[key].bid[0][0]
                                bidVolume = data[key].bid[0][1]
                            } else {
                                bidPrice = 0
                                bidVolume = 0
                            }
                            coin_prices[coinName].exmo = {
                                ask: {
                                    price: askPrice , 
                                    volume: askVolume
                                }, 
                                bid: {
                                    price: bidPrice , 
                                    volume: bidVolume

                                }
                            }
                        }
                    })
                    // for (let obj of data) {
                    //     console.log('liqui data: ' + obj)
                    //     if(obj["MarketName"].includes('_BTC')) {
                    //         let coinName = obj["MarketName"].replace("_BTC", '');
                    //         if (!coin_prices[coinName]) coin_prices[coinName] = {};
                    //         coin_prices[coinName].bleutrade = obj.Last;
                    //     }
                    // }
                    res(coin_prices);
                    
                }
                catch (err) {
                    console.log(err);
                    rej(err);
                }

            })
        },
    },
	
    {

        marketName: 'kraken', // kraken has no one size fits all market summery so each pair has to be entered as param in GET - will need to add new coins as they are added to exchange
        fees: {
            seller: 0.0016, 
            buyer: 0.0016
        }, 
        URL: 'https://api.kraken.com/0/public/Ticker?pair=DASHXBT,EOSXBT,GNOXBT,ETCXBT,ETHXBT,ICNXBT,LTCXBT,MLNXBT,REPXBT,XDGXBT,XLMXBT,XMRXBT,XRPXBT,ZECXBT,XBTUSD,DASHUSD,ETCUSD,ETHUSD,LTCUSD,XMRUSD,XRPUSD,ZECUSD', //URL To Fetch API From.
        toBTCURL: false, //URL, if needed for an external bitcoin price api.
        pairURL : '',
        last: function (data, coin_prices) { //Get the last price of coins in JSON data
            return new Promise(function (res, rej) {
                try {
                    for (let key in data.result) {  
                        let matchedName              
                        let arr = key.match(/DASH|EOS|GNO|ETC|ETH|ICN|LTC|MLN|REP|XDG|XLM|XMR|XRP|ZEC/); // matching real names to weird kraken api coin pairs like "XETCXXBT" etc 
                        let name = key;
                        if (arr !== null)
                            matchedName = arr[0];
                        if (matchedName === "XDG") { //kraken calls DOGE "XDG" for whatever reason
                            let matchedName = "DOGE";
                            var coinName = matchedName
                        } else {
                            var coinName = matchedName 
                        }
                        if (coinName === undefined) {
                            coinName = 'BTC_USD'
                        } else {
                            if (key.match(/XBT$/)) {  
                                coinName = coinName + '_BTC'
                            }
                            if (key.match(/USD$/)) {    
                                coinName = coinName + '_USD'
                            }
                        }

                        if (!coin_prices[coinName]) coin_prices[coinName] = {};
                        let askPrice , askVolume , bidPrice , bidVolume
                        if (data.result[name].a !== null) {
                            askPrice = data.result[name].a[0] 
                            askVolume = data.result[name].a[2] 
                        } else {
                            askPrice = 0 
                            askVolume = 0
                        } 
                        if (data.result[name].b !== null) {
                            bidPrice = data.result[name].b[0]
                            bidVolume = data.result[name].b[2] 
                        } else {
                            bidPrice = 0
                            bidVolume = 0
                        }

                        coin_prices[coinName].kraken = {
                            ask: {
                                price: askPrice,
                                volume: askVolume
                            }, 
                            bid: {
                                price: bidPrice, 
                                volume: bidVolume
                            }
                        }

                    }
                    res(coin_prices);

                }
                catch (err) {
                    console.log(err);
                    rej(err);
                }

            })
        },
    },

];

let marketNames = [];
for(let i = 0; i < markets.length; i++) { // Loop except cryptowatch
    marketNames.push([[markets[i].marketName], [markets[i].pairURL]]);
}
console.log("Markets:", marketNames);
module.exports = function () {
    this.markets = markets;
    this.marketNames = marketNames;
};
