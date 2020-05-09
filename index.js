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
    getSignature(time){
        return SHA256("api_key" + this.api_key + "time" + time + this.api_secret).toString()
    }

    //Market APIs
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
            if(!period) return reject("Invalid period specified. Available periods are - 1min, 5min, 15min, 30min, 1hour, 1day, 1week, 1month");
            this.getRequest("klines", {
                symbol: symbol, 
                period: period
            }).then(response => {
                return resolve(response);
            }).catch(e => {throw e})
           
    })
    }
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

    async postRequest(endpoint){
        return new Promise((resolve, reject) => {
            let time = new Date().getTime();
            axios.post(baseURL + endpoint, querystring.stringify({
                    api_key: this.api_key,
                    time : time,
                    sign : this.getSignature(time)
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
