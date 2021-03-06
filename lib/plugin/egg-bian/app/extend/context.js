
'use strict';
const async = require("async")
const binance = require('./node-binance-api.js');
binance.options({
    'APIKEY': '9Jz5altbEIS2f0IPiVrYNosmzijUtezUfC44EW406o5FewnQK0rwYq7Ndl4ssV5x',
    'APISECRET': 'HLtF2z2Yx9NzFV2kyQUOrFUZz57ui94sOv4ZxVPCJXudmS4Tc23P4SUmgrFTCudT'
});
var val = {};
module.exports = {
    bian: {
        reset24hr(markets, fn) {
            console.log("egg-bian.reset24hr begin");
            let _this = this;
            async.series({
                s1: function (cb) {
                    _this.reset24hrticker(markets, cb);
                }, s2: function (cb) {
                    cb();
                }
            }, function (err) {
                console.log("egg-bian.reset24hr end");
                return fn();
            });
        },
        reset24hrticker(markets, fn) {
            console.log("egg-bian.reset24hrticker begin");
            const _this = this;
            async.eachLimit(markets, 2, function (market, cb) {
                binance.prevDay(_this.adapterSymbol(market), function (error, ticker) {
                    if (error) {
                        console.log("egg-bian.reset24hrticker error", market, error.body);
                        return cb();
                    }
                    if (val[market] == null) {
                        val[market] = {};
                    }
                    // console.log(ticker);
                    let lastPrice = '';
                    if(market == 'DOGEUSD'){
                      lastPrice = ticker.lastPrice;
                    }else{
                      lastPrice = parseFloat(ticker.lastPrice).toFixed(2);
                    }
                    val[market] = {
                        count: ticker.count * ((parseFloat(ticker.highPrice) + parseFloat(ticker.lowPrice) / 2)),//此数据为计算数据 不真实
                        priceChange: _this.adapterPriceFormat(ticker.priceChange),
                        priceChangePercent: parseFloat(ticker.priceChangePercent).toFixed(2) + "%",
                        lastPrice: lastPrice,
                    };
                    return cb();
                });
            }, function (err) {
                console.log("egg-bian.reset24hrticker end");
                return fn();
            });

        },
        adapterPriceFormat(price) {
            return "$" + Math.abs(parseFloat(price).toFixed(4) );
        },
        adapterSymbol(market) {
            return market + "T";
        }, getLmitTime(h) {
            return new Date().getTime() - 1000 * 60 * 60 * h;
        },get24hr() {
            let keys = Object.keys(val);
            let res = [];
            for (var i = 0; i < keys.length; i++) {
                let t = val[keys[i]]
                if (t.lastPrice == null ||
                    t.priceChange == null ||
                    t.priceChangePercent == null ||
                    t.count == null) {
                    continue;
                }
                t.symbol = keys[i];
                res.push(t);
            }
            return res;
        }
    }
};












