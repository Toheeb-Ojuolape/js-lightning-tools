<p align="center">
  <img width="100%" src="docs/Header.png">
</p>

# Lightning Web SDK

An npm package that provides useful and common tools and helpers to build lightning web applications.

## 🚀 Quick Start

```
npm install alby-tools
```
or
```
yarn add alby-tools
```

## 🤙 Usage

### Lightning Address

The `LightningAddress` class provides helpers to work with lightning addresses

```js
import { LightningAddress } from "alby-tools";

const ln = new LightningAddress("hello@getalby.com");

// fetch the LNURL data
await ln.fetch();

// get the LNURL-pay data:
console.log(ln.lnurlpData); // returns a [LNURLPayResponse](https://github.com/getAlby/alby-tools/blob/master/src/types.ts#L1-L15)
// get the keysend data:
console.log(ln.keysendData);

```

#### Get an invoice:

```js
import { LightningAddress } from "alby-tools";

const ln = new LightningAddress("hello@getalby.com");

await ln.fetch();
// request an invoice for 1000 satoshis
// this returns a new `Invoice` class that can also be used to validate the payment
const invoice = await ln.requestInvoice({satoshi: 1000}); 

console.log(invoice.paymentRequest); // print the payment request
console.log(invoice.paymentHash); // print the payment hash
```

#### Verify a payment

```js
import { LightningAddress } from "alby-tools";
const ln = new LightningAddress("hello@getalby.com");
await ln.fetch();

const invoice = await ln.requestInvoice({satoshi: 1000});

// if the LNURL providers supports LNURL-verify:
const paid = await invoice.verifyPayment(); // returns true of false
if (paid) {
  console.log(invoice.preimage);
}

// if you have the preimage for example in a WebLN context
await window.webln.enable();
const response = await window.webln.sendPayment(invoice.paymentRequest);
const paid = invoice.validatePreimage(response.preimage); // returns true or false
if (paid) {
  console.log('paid');
}

// or use the convenenice method: 
await invoice.isPaid();

```

It is also possible to manually initialize the `Invoice`

```js
const { Invoice } = require("alby-tools");

const invoice = new Invoice({paymentRequest: pr, preimage: preimage});
await invoice.isPaid();
```

#### Boost a LN address:

You can also attach additional metadata information like app name, version, name of the podcast which is boosted etc. to the keysend payment.

```js
import { LightningAddress } from "alby-tools";
const ln = new LightningAddress("hello@getalby.com");
await ln.fetch();

const boost = {
  action: "boost",
  value_msat: 21000,
  value_msat_total: 21000,
  app_name: "Podcastr",
  app_version: "v2.1",
  feedId: "21",
  podcast: "random podcast",
  episode: "1",
  ts: 2121,
  name: "Satoshi",
  sender_name: "Alby",
}
await ln.boost(boost);
```

#### Zapping a LN address on Nostr:

Nostr is a simple, open protocol that enables truly censorship-resistant and global value-for-value publishing on the web. Nostr integrates deeply with Lightning. [more info](https://nostr.how/)

alby-tools provides helpers to create [zaps](https://github.com/nostr-protocol/nips/blob/master/57.md).

Please note users need an extension that implements [NIP-07](https://github.com/nostr-protocol/nips/blob/master/07.md) (to sign the zap request) and [WebLN](webln.guide) (to pay the invoice) for seamless zapping.

```js
import { LightningAddress } from "alby-tools";
const ln = new LightningAddress("hello@getalby.com");
await ln.fetch();

if (!ln.nostrPubkey) {
  alert('No nostr pubkey available'); // seems the lightning address is no NIP05 address
}

const zapArgs = {
  satoshi: 1000,
  comment: "Awesome post",
  relays: ["wss://relay.damus.io"],
  e: "44e1827635450ebb3c5a7d12c1f8e7b2b514439ac10a67eef3d9fd9c5c68e245" // optional, omit to zap profile directly
}

// in one go with WebLN (https://www.webln.guide) (easiest for web apps)
const response = await ln.zap(zapArgs); // signs zap request event, generates invoice and pays it
console.log(response.preimage); // print the preimage

// or manually (create an invoice and give it to the user to pay)
const invoice = await ln.zapInvoice(zapArgs); // generates a zap invoice
console.log(invoice.paymentRequest); // print the payment request
await invoice.isPaid(); // check the payment status as descibed above
```

#### Zapping a LN address on Nostr using Nostr Wallet Connect:

See [examples/zaps-nwc](examples/zaps-nwc.js)


### 💵 Fiat conversions
Helpers to convert sats values to fiat and fiat values to sats.

##### getFiatValue(satoshi: number, currency: string): number
Returns the fiat value for a specified currrency of a satoshi amount

##### getSatoshiValue(amount: number, currency: string): number
Returns the satoshi value for a specified amount (in the smallest denomination) and currency

##### getFormattedFiatValue(satoshi: number, currency: string, locale: string): string
Like `getFiatValue` but returns a formatted string for a given locale using JavaScript's `toLocaleString`

#### Examples

```js
await getFiatValue(satoshi: 2100, currency: 'eur');
await getSatoshiValue(amount: 100, currency: 'eur'); // for 1 EUR
await getFormattedFiatValue(stoshi: 2100, currency: 'usd', locale: 'en')
```

### 🤖 Lightning Address Proxy
alby-tools uses a [proxy](https://github.com/getAlby/lightning-address-details-proxy) to simplify requests to lightning providers.

- Many ln addresses don't support CORS, which means fetching the data directly in a browser environment will not always work.
- Two requests are required to retrieve lnurlp and keysend data for a lightning address. The proxy will do these for you with a single request.

You can disable the proxy by explicitly setting the proxy to false when initializing a lightning address:

```
const lightningAddress = new LightningAddress("hello@getalby.com", {proxy: false});
```

## Full usage examples

You can find examples in the [examples/](examples/) directory.

## fetch
This library relies on a global fetch object which will only work in newer browsers and versions of node. You can manually install a global fetch option or polyfill if needed.

For example:
```js
import fetch from "cross-fetch"; // or "@inrupt/universal-fetch"
globalThis.fetch = fetch;

// or as a polyfill:
import 'cross-fetch/polyfill';
```

## 🛠 Development

```
yarn install
yarn run build
```

## Need help?

We are happy to help, please contact us or create an issue.

* [Twitter: @getAlby](https://twitter.com/getAlby)
* [Telegram group](https://t.me/getAlby)
* support at getalby.com
* [bitcoin.design](https://bitcoin.design/) Discord community (find us on the #alby channel)
* Read the [Alby developer guide](https://guides.getalby.com/overall-guide/alby-for-developers/getting-started) to better understand how Alby packages and APIs can be used to power your app.

## License

MIT
