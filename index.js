/**
 * Created by Sap#7777.
 */
var axios = require('axios');
const querystring = require('querystring');

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


var SHA256 = require("crypto-js/sha256");
const baseURL = `https://api.crypto.com/v1/`

const periods = {
    "1min": 1,
    "5min": 5,
    "15min": 15,
    "30min": 30,
    "1hour": 60,
    "1day": 1440,
    "1week": 10080,
    "1month": 43200
    
}

const depths = ["step0", "step1", "step2"]

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
        if (!api_key || !api_secret) throw new Error('You need to provide an API Key and Secret from https://crypto.com/exchange/personal/api-management');
        this.api_key = api_key
        this.api_secret = api_secret;
    }

    /**
     * @return {String}
     */
    getSignature(time, params){
        let messageNotEncoded = "";
        for(var key in params) {
            messageNotEncoded += key;
            messageNotEncoded += params[key];
        }
        console.log(messageNotEncoded)
        return SHA256("api_key" + this.api_key + "time" + time + messageNotEncoded + this.api_secret).toString()
    }

    //---------------------------MARKET APIs
    async symbols() {
        return new Promise((resolve, reject) => {
            this.getRequest("symbols").then(response =>{
                return resolve(response);
            }).catch(e => {return reject(e)})
        })
    }

    async ticker(symbol) {
        return new Promise((resolve, reject) => {
            this.getRequest("ticker", {symbol: symbol}).then(response =>{
                return resolve(response);
            }).catch(e => {return reject(e)})
        })
    }

    async klines(period, symbol) {
        period = periods[period];
        return new Promise((resolve, reject) => {
            if(!period) return reject("Invalid period for klines() specified. Available periods are - 1min, 5min, 15min, 30min, 1hour, 1day, 1week, 1month");
            this.getRequest("klines", {
                symbol: symbol, 
                period: period
            }).then(response => {
                return resolve(response);
            }).catch(e => {return reject(e)})
           
        })
    }

    async trades(symbol) {
        return new Promise((resolve, reject) => {
            this.getRequest("trades", {
                symbol: symbol
            }).then(response => {
                return resolve(response);
            }).catch(e => {return reject(e)})
        })
    }

    async tickerPrice() {
        return new Promise((resolve, reject) => {
            this.getRequest("ticker/price").then(response => {
                return resolve(response);
            }).catch(e => {return reject(e)})
        })
    }

    async depth(symbol, type) {
        return new Promise((resolve, reject) => {
            if(!depths.includes(type)) return reject("Invalid depth for depth() type specified. Available types are - step0, step1, step2. step0 has the highest accuracy");
            this.getRequest("depth", {
                symbol: symbol,
                type: type
            }).then(response => {
                return resolve(response);
            }).catch(e => {return reject(e)})
        })
    }
    //---------------------------USER APIs
    /**
     * @return {Promise}
     */

    async account() {
        return new Promise((resolve, reject) => {
            this.postRequest("account").then(response =>{
                    return resolve(response);
                }).catch(e => {return reject(e)})
        })
    }

    /*
    Purchase quantity (Polysemy, multiplexing fields) 
    type=1: 
        represents the quantity of sales and purchases
    type=2: 
        buy means the total price
        Selling represents the total number

        Limit
            How many coins
        Market
            Buying - how much of NEEDED <symbol> will you spend
            Selling - how much of OWNED <symbol> will you sell
    */
    async limitBuy(price, symbol, quantity) {
        return new Promise((resolve, reject) => {
            this.postRequest("order",{
                price: price,
                symbol: symbol,
                side: "BUY",
                type: 1,
                volume: quantity
            }).then(response =>{
                    return resolve(response);
                }).catch(e => {return reject(e)})
        })
    }

    async marketBuy(symbol, quantity) {
        return new Promise((resolve, reject) => {
            this.postRequest("order",{
                symbol: symbol,
                side: "BUY",
                type: 2,
                volume: quantity
            }).then(response =>{
                    return resolve(response);
                }).catch(e => {return reject(e)})
        })
    }

    async openOrders(symbol, params) {
        return new Promise((resolve, reject) => {
            this.postRequest("openOrders",{
                symbol: symbol,
                ...params
            }).then(response =>{
                    return resolve(response);
                }).catch(e => {return reject(e)})
        })
    }
    /**
     * @param {String} endpoint
     * @return {Promise}
     */

    async getRequest(endpoint, params){
        return new Promise((resolve, reject) => {
            axios.get(baseURL + endpoint,{
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

    async postRequest(endpoint, params){
        return new Promise((resolve, reject) => {
            let time = new Date().getTime();
            axios.post(baseURL + endpoint, querystring.stringify({
                    api_key: this.api_key,
                    time : time,
                    sign : this.getSignature(time, params),
                    ...params
                }))
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
