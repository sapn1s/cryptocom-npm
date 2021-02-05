# Cryptocom

A wrapper for the Crypto.com REST API. Uses promises. For more information on the API and parameters for requests visit https://exchange-docs.crypto.com

# Usage/Example


##Initialisation

```js
const cryptocom = require("cryptocom");

const cdc = new cryptocom(API_KEY, API_SECRET); //const cdc = new cryptocom(); for only public endpoints
```

## Public Endpoints


#### get_instruments()
##### Provides information on all supported symbols (e.g. BTC_USDT)

```js
cdc.get_instruments().then().catch();
```

#### get_book(symbol, depth) 
##### Fetches the public order book for a particular symbol and depth

| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| symbol | string | Y | e.g. BTC_USDT, ETH_CRO, etc. |
| depth | number | N | Number of bids and asks to return (up to 150) |

```js
cdc.get_book("BTC_USDT", 10).then().catch();
```

#### get_ticker(symbol) 
##### Fetches the public tickers for an symbol (e.g. BTC_USDT).
##### symbol can be omitted to show tickers for all symbol

| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| symbol | string | N | e.g. BTC_USDT, ETH_CRO, etc. |

```js
cdc.get_ticker("BTC_USDT").then().catch();
```

#### get_candlestick(interval, symbol) 
##### Retrieves candlesticks (k-line data history) over a given period for an instrument (e.g. BTC_USDT)

| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| interval | string | Y | See below* |
| symbol | string | Y | e.g. BTC_USDT, ETH_CRO, etc. |

###### *Period can be:

1m : one minute
5m : five minutes
15m : 15 minutes
30m: 30 minutes
1h : one hour
4h : 4 hours
6h : 6 hours
12h : 12 hours
1D : one day
7D : one week
14D : two weeks
1M : one month

```js
cdc.get_candlestick("5m", "BTC_USDT").then().catch();
```

#### get_trades(symbol) 
##### Fetches the public trades for a particular symbol
##### symbol can be omitted to show tickers for all symbol

| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| symbol | string | N | e.g. BTC_USDT, ETH_CRO, etc. |

```js
cdc.get_trades("BTC_USDT").then().catch();
```

#### create_withdrawal(currency, amount, address, options) 
##### Creates a withdrawal request. Withdrawal setting must be enabled for your API Key
##### If you do not see the option when viewing your API Key, this feature is not yet available for you.

| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| currency | string | Y | e.g. BTC, CRO |
| amount | decimal | Y | amount to withdraw |
| address | string | Y | withdrawal address |
| options | object | N | see table below |

*Withdrawal addresses must first be whitelisted in your account’s Withdrawal Whitelist page.
*Withdrawal fees and minimum withdrawal amount can be found on the Fees & Limits page on the Exchange website.

##### Options:
| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| client_wid | string | N | Client withdrawal ID |
| address_tag | string | N | Secondary address identifier for coins like XRP, XLM etc. Also known as memo or tags. |

```js
let options = {
    client_wid: "my_withdrawal_002",
    address_tag: "1234567"
}
cdc.create_withdrawal("XRP", 10, "0x23...", options).then().catch();
```


#### get_withdrawal_history(options) 
##### Fetches withdrawal history. Withdrawal setting must be enabled for your API Key
##### If you do not see the option when viewing your API Key, this feature is not yet available for you.

| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| options | object | N | see table below |

*Withdrawal addresses must first be whitelisted in your account’s Withdrawal Whitelist page.
*Withdrawal fees and minimum withdrawal amount can be found on the Fees & Limits page on the Exchange website.

##### Options:
| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| currency | string | N | E.g. BTC, CRO |
| start_ts | long | N | timestamp is in milliseconds. Default is 90 days from current timestamp |
| end_ts | string | N | timestamp is in milliseconds. Default is current timestamp |
| page_size | int | N | Page size (Default: 20, Max: 200) |
| page | int | N | Page number (0-based) |
| status | string | N | e.g. "0" (see below*) |

###### *Available Statuses:
0 - Pending
1 - Processing
2 - Rejected
3 - Payment In-progress
4 - Payment Failed
5 - Completed
6 - Cancelled 


```js
let options = {
    currency: "CRO",
    page: "3",
    status: "5"
}
cdc.get_withdrawal_history(options).then().catch();
```

## Private Endpoints

### Spot Trading

#### account(currency) 
##### Returns the account balance of a user for a particular token

| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| currency | string | N | Specific currency, e.g. CRO. Omit for 'all' |

```js
cdc.account("CRO").then().catch();
```

#### limit_buy(symbol, price, quantity, options) and limit_sell(symbol, price, quantity, options) 
##### Create Limit buy and sell orders
*This call is asynchronous, so the response is simply a confirmation of the request.

| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| symbol | string | Y | e.g., ETH_CRO, BTC_USDT |
| price | number | Y | Unit price |
| quantity | number | Y | Order Quantity to buy |
| options | object | N | see table below |

##### Options:
| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| client_oid | string | N | Client order ID |
| time_in_force | string | N | GOOD_TILL_CANCEL (Default)/ FILL_OR_KILL / IMMEDIATE_OR_CANCEL |
| exec_inst | string | N | POST_ONLY / leave empty |

```js
let options = {
    client_oid: "my_order_01"
}
cdc.limit_buy("CRO_USDT", "0.06466", 5000, options).then().catch(); // Will buy 5000 CRO IF price reaches 0.06466 USDT

let options_2 = {
    client_oid: "my_order_02",
    time_in_force: "FILL_OR_KILL"
}

cdc.limit_sell("CRO_USDT", "0.06766", 5000, options_2).then().catch(); // Will sell 5000 CRO IF price reaches 0.06766 USDT

```


#### market_buy(symbol, notional, options)
##### Create market buy order
*This call is asynchronous, so the response is simply a confirmation of the request.

| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| symbol | string | Y | e.g., ETH_CRO, BTC_USDT |
| notional | number | Y | Amount to spend |
| client_oid | string | N | Client order ID |

```js
cdc.market_buy("CRO_USDT", 20, "my_order").then().catch(); // Buys CRO for 20 USDT at current market price
```

#### market_sell(symbol, quantity, options)
##### Create market sell order
*This call is asynchronous, so the response is simply a confirmation of the request.

| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| symbol | string | Y | e.g., ETH_CRO, BTC_USDT |
| quantity | number | Y | Quantity to be Sold |
| client_oid | string | N | Client order ID |

```js
cdc.market_sell("CRO_USDT", 5000, "my_order").then().catch(); // Sells 5000 CRO at current market price
```

#### stop_loss_buy(symbol, notional, trigger_price, client_oid)
##### Create stop-loss market buy order
*This call is asynchronous, so the response is simply a confirmation of the request.

| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| symbol | string | Y | e.g., ETH_CRO, BTC_USDT |
| notional | number | Y | Amount to spend |
| trigger_price | number | Y | Dictates when order will be triggered |
| client_oid | string | N | Client order ID |

```js
cdc.stop_loss_buy("CRO_USDT", 20, "0.00009", "my_order").then().catch(); // Buys CRO usding 20 USDT at current market price IF CRO price reaches 0.00009 USDT
```

#### stop_loss_sell(symbol, quantity, trigger_price, client_oid)
##### Create stop-loss market sell order
*This call is asynchronous, so the response is simply a confirmation of the request.

| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| symbol | string | Y | e.g., ETH_CRO, BTC_USDT |
| quantity | number | Y | Quantity to be Sold |
| trigger_price | number | Y | Dictates when order will be triggered |
| client_oid | string | N | Client order ID |

```js
cdc.stop_loss_buy("CRO_USDT", 5000, "0.00009", "my_order").then().catch(); // Sells 5000 CRO at current market price IF CRO price reaches 0.00009 USDT
```

#### stop_limit_buy(symbol, price, quantity, trigger_price, options) and stop_limit_sell(symbol, price, quantity, trigger_price, options)
##### Create stop-loss limit buy or sell order
*This call is asynchronous, so the response is simply a confirmation of the request.

| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| symbol | string | Y | e.g., ETH_CRO, BTC_USDT |
| price | number | Y | Unit price |
| quantity | number | Y | Quantity to Buy |
| trigger_price | number | Y | Dictates when order will be triggered |
| options | object | N | see table below |

##### Options:
| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| client_oid | string | N | Client order ID |
| time_in_force | string | N | GOOD_TILL_CANCEL (Default)/ FILL_OR_KILL / IMMEDIATE_OR_CANCEL |
| exec_inst | string | N | POST_ONLY / leave empty |

```js
let options = {
    client_oid: "my_order_02",
    time_in_force: "FILL_OR_KILL"
}

cdc.stop_limit_buy("CRO_USDT", "0.06579", 5000, "0.06579", options).then().catch(); // Buys 5000 CRO at 0.06579 or cheaper price IF CRO price is greater or equal to 0.06579 USDT

let options_2 = {
    client_oid: "my_order_02",
    time_in_force: "FILL_OR_KILL"
}

cdc.stop_limit_sell("CRO_USDT", "0.06579", 5000, "0.06579", options_2).then().catch(); // Sells 5000 CRO at 0.06579 or higher price IF CRO price is smaller or equal to 0.06579 USDT
```

#### cancel_order(symbol, order_id)
##### Cancels an existing order on the Exchange (asynchronous)
*This call is asynchronous, so the response is simply a confirmation of the request.

| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| symbol | string | Y | e.g., ETH_CRO, BTC_USDT |
| order_id | string | Y | ID of order to be cancelled |


```js
cdc.cancel_order("CRO_USDT", "1164074220874569090").then().catch();
```

#### cancel_all_orders(symbol)
##### Cancels all orders for a particular instrument/pair (asynchronous)
*This call is asynchronous, so the response is simply a confirmation of the request.

| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| symbol | string | Y | e.g., ETH_CRO, BTC_USDT |


```js
cdc.cancel_all_orders("CRO_USDT").then().catch();
```

#### get_order_history(options)
##### Gets the order history for a particular instrument

| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| options | object | N | see table below  |

##### Options:
| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| instrument_name | string | N | e.g. ETH_CRO, BTC_USDT. Omit for 'all' |
| start_ts	 | long | N | Start timestamp (milliseconds since the Unix epoch) - defaults to 24 hours ago |
| end_ts | long | N | End timestamp (milliseconds since the Unix epoch) - defaults to 'now' |
| page_size	 | int | N | Page size (Default: 20, max: 200) |
| page | int | N | Page number (0-based) |

```js
cdc.get_order_history().then().catch();//with defaults

let options = {
    instrument_name: "CRO_USDT",
    start_ts: "1612529644978",
    page: 2
}
cdc.get_order_history(options).then().catch(); //with options
```
*The maximum duration between start_ts and end_ts is 24 hours.
You will receive an INVALID_DATE_RANGE error if the difference exceeds the maximum duration.
For users looking to pull longer historical order data, users can create a loop to make a request for each 24-period from the desired start to end time.

#### get_open_orders(options)
##### Gets all open orders for a particular instrument

| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| options | object | N | see table below  |

##### Options:
| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| instrument_name | string | N | e.g. ETH_CRO, BTC_USDT. Omit for 'all' |
| page_size	 | int | N | Page size (Default: 20, max: 200) |
| page | int | N | Page number (0-based) |

```js
cdc.get_open_orders().then().catch();//get all oopen orders

let options = {
    instrument_name: "CRO_USDT",
}
cdc.get_order_history(options).then().catch(); //get open orders for CRO_USDT pair
```

#### get_order_details(order_id)
##### Gets details on a particular order ID

| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| order_id | string | Y | Order ID  |

```js
cdc.get_order_details("1164074220874569090").then().catch();
```

#### get_trades(options)
##### Gets all executed trades for a particular instrument.

| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| options | object | N | see table below  |

##### Options:
| Param | Type | Required | Description |  
| --- | --- | --- | --- |
| instrument_name | string | N | e.g. ETH_CRO, BTC_USDT. Omit for 'all' |
| start_ts	 | long | N | Start timestamp (milliseconds since the Unix epoch) - defaults to 24 hours ago |
| end_ts | long | N | End timestamp (milliseconds since the Unix epoch) - defaults to 'now' |
| page_size	 | int | N | Page size (Default: 20, max: 200) |
| page | int | N | Page number (0-based) |

```js
cdc.get_trades().then().catch();//with defaults

let options = {
    instrument_name: "CRO_USDT",
    page: 3
}
cdc.get_trades(options).then().catch(); //get excuted trades for CRO_USDT pair
```

*The maximum duration between start_ts and end_ts is 24 hours.
You will receive an INVALID_DATE_RANGE error if the difference exceeds the maximum duration.
For users looking to pull longer historical trade data, users can create a loop to make a request for each 24-period from the desired start to end time.