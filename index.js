/**
 * Created by Sap#7777.
 */
var axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/json';

const crypto = require("crypto-js");
const baseURL = `https://api.crypto.com/v2/`

var intervals = ["1m", "5m", "15m", "30m", "1h", "4h", "6h", "12h", "1D", "7D", "14D", "1M"];
/**
 * Creates a new Cryptocom instance
 * @class
 */
class Cryptocom {
    /**
     * @param {String} APIKEY - API key https://crypto.com/exchange/personal/api-management
     * @param {String} APISECRET - API secret https://crypto.com/exchange/personal/api-management
     */
    constructor(api_key, api_secret) {
        this.api_key = api_key
        this.api_secret = api_secret;
    }

    /**
     * @return {String}
     */
    signRequest = (request, apiKey, apiSecret) => {
        const { id, method, params, nonce } = request;
        const paramsString =
            params == null
                ? ""
                : Object.keys(params)
                    .sort()
                    .reduce((a, b) => {
                        return a + b + params[b];
                    }, "");
        const sigPayload = method + id + apiKey + paramsString + nonce;
        request.sig = crypto
            .HmacSHA256(sigPayload, apiSecret)
            .toString(crypto.enc.Hex);

        return request;
    };


    //Market APIs
    async get_instruments() {
        return new Promise((resolve, reject) => {
            this.getRequest("public/get-instruments").then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }

    async get_book(symbol, depth) {
        return new Promise((resolve, reject) => {
            this.getRequest("public/get-book", {
                instrument_name: symbol,
                depth: depth,
            }).then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }

    async get_ticker(symbol) {
        return new Promise((resolve, reject) => {
            this.getRequest("public/get-ticker", { symbol: symbol }).then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }

    async get_candlestick(interval, symbol) {
        return new Promise((resolve, reject) => {
            if (!intervals.includes(interval)) return reject("Invalid interval specified, available intervals:\n" + intervals)
            this.getRequest("public/get-candlestick", {
                instrument_name: symbol,
                timeframe: interval,
            }).then(response => {
                return resolve(response);
            }).catch(e => { throw e })

        })
    }

    async get_trades(symbol) {
        return new Promise((resolve, reject) => {
            this.getRequest("public/get-trades", {
                instrument_name: symbol
            }).then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }

    /**
     * @return {Promise}
     */


    async create_withdrawal(currency, amount, address, options) {
        return new Promise((resolve, reject) => {
            this.postRequest("private/create-withdrawal", {
                currency: currency,
                amount: amount,
                address: address,
                ...options
            }).then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }

    async get_withdrawal_history(options) {
        return new Promise((resolve, reject) => {
            this.postRequest("private/get-withdrawal-history", options).then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }

    //Spot Trading
    async account(currency) {
        return new Promise((resolve, reject) => {
            this.postRequest("private/get-account-summary", { currency: currency }).then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }

    async limit_buy(symbol, price, quantity, options) {
        return new Promise((resolve, reject) => {
            this.postRequest("private/create-order", {
                instrument_name: symbol,
                side: 'BUY',
                type: "LIMIT",
                price: price,
                quantity: quantity,
                ...options
            }).then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }

    async limit_sell(symbol, price, quantity, options) {
        return new Promise((resolve, reject) => {
            this.postRequest("private/create-order", {
                instrument_name: symbol,
                side: 'SELL',
                type: "LIMIT",
                price: price,
                quantity: quantity,
                ...options
            }).then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }

    async market_buy(symbol, notional, client_oid) {
        return new Promise((resolve, reject) => {
            this.postRequest("private/create-order", {
                instrument_name: symbol,
                side: 'BUY',
                type: "MARKET",
                notional: notional,
                client_oid: client_oid
            }).then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }

    async market_sell(symbol, quantity, client_oid) {
        return new Promise((resolve, reject) => {
            this.postRequest("private/create-order", {
                instrument_name: symbol,
                side: 'SELL',
                type: "MARKET",
                quantity: quantity,
                client_oid: client_oid
            }).then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }

    async stop_loss_buy(symbol, notional, trigger_price, client_oid) {
        return new Promise((resolve, reject) => {
            this.postRequest("private/create-order", {
                instrument_name: symbol,
                side: 'BUY',
                type: "STOP_LOSS",
                notional: notional,
                trigger_price, trigger_price,
                client_oid: client_oid
            }).then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }

    async stop_loss_sell(symbol, quantity, trigger_price, client_oid) {
        return new Promise((resolve, reject) => {
            this.postRequest("private/create-order", {
                instrument_name: symbol,
                side: 'SELL',
                type: "STOP_LOSS",
                quantity: quantity,
                trigger_price: trigger_price,
                client_oid: client_oid
            }).then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }


    async stop_limit_buy(symbol, price, quantity, trigger_price, options) {
        return new Promise((resolve, reject) => {
            this.postRequest("private/create-order", {
                instrument_name: symbol,
                side: 'BUY',
                type: "STOP_LIMIT",
                price: price,
                quantity: quantity,
                trigger_price, trigger_price,
                ...options
            }).then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }

    async stop_limit_sell(symbol, price, quantity, trigger_price, options) {
        return new Promise((resolve, reject) => {
            this.postRequest("private/create-order", {
                instrument_name: symbol,
                side: 'SELL',
                type: "STOP_LIMIT",
                price: price,
                quantity: quantity,
                trigger_price, trigger_price,
                ...options
            }).then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }

    async cancel_order(symbol, order_id) {
        return new Promise((resolve, reject) => {
            this.postRequest("private/cancel-order", {
                 symbol: symbol,
                 order_id: order_id
                 }).then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }

    async cancel_all_orders(symbol) {
        return new Promise((resolve, reject) => {
            this.postRequest("private/cancel-all-orders", {
                 symbol: symbol
                 }).then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }

    async get_order_history(options) {
        return new Promise((resolve, reject) => {
            this.postRequest("private/get-order-history", options).then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }

    async get_open_orders(options) {
        return new Promise((resolve, reject) => {
            this.postRequest("private/get-open-orders", options).then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }

    async get_order_details(order_id) {
        return new Promise((resolve, reject) => {
            this.postRequest("private/get-order-detail", {order_id: order_id}).then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }

    async get_trades(options) {
        return new Promise((resolve, reject) => {
            this.postRequest("private/get-trades", options).then(response => {
                return resolve(response);
            }).catch(e => { return reject(e) })
        })
    }
    /**
     * @param {String} endpoint
     * @return {Promise}
     */

    async getRequest(endpoint, params) {
        return new Promise((resolve, reject) => {
            axios.get(baseURL + endpoint, {
                params: {
                    ...params
                }
            })
                .then(function (response) {
                    resolve(response.data)
                })
                .catch(function (error) {
                    reject(error);
                })
        });
    }

    async postRequest(endpoint, params) {
        let time = new Date().getTime();
        let apiKey = this.api_key;
        let apiSecret = this.api_secret;
        let request = {
            id: time,
            method: endpoint,
            api_key: apiKey,
            params: {
                ...params
            },
            nonce: time,
        };
        return new Promise((resolve, reject) => {
            let requestBody = JSON.stringify(this.signRequest(request, apiKey, apiSecret));
            axios.post(baseURL + endpoint, requestBody
            )
                .then(function (response) {
                    resolve(response.data)
                })
                .catch(function (error) {
                    reject(error);
                })
        });
    }
}


module.exports = Cryptocom;
