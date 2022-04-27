# Introduction

A package that simplifies mpesa payments through stk push.

# Installation

```npm install mpesa-stk-push```

# Usage

```js
const Mpesa = require("mpesa-stk-push");

//send an stk push for c2b payments

const mpesa = new Mpesa({
  shortcode: "174379",  //you passkey obtained from pesa daraja 
  passkey: "xscdds-------------aggafa", //your passkey obtained from pesa daraja 
  transactiontype: "CustomerPayBillOnline", //eg.customerpaybillonline 
  businessshortcode: "174379",
  amount: "1",
  phone: "2547xxxxx9", //customer phone number in 254 format
  callbackurl: "https://example.com/callback", //callback url where response will be sent
  accountreference: "", //eg. patakenya limited 
  transactiondesc: "Test transaction", //abc tv payment 
  mpesaauth: "gveF-------------------XTMLLGMd", //mpesa auth from mpesa daraja api 
  environment:"sandbox",  //either production or sandbox
});

mpesa.sendMoney().then((response) => {
  console.log(response);
  //something with the response
});

//Example response
{
  MerchantRequestID: '3201-9121900-1',
  CheckoutRequestID: 'ws_CO_2704202217362331144871229',
  ResponseCode: '0',
  ResponseDescription: 'Success. Request accepted for processing',
  CustomerMessage: 'Success. Request accepted for processing'
}
```