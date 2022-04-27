const request = require("request");
const moment = require("moment");

class Mpesa {
  constructor({
    shortcode,
    passkey,
    transactiontype,
    businessshortcode,
    amount,
    phone,
    callbackurl,
    accountreference,
    transactiondesc,
    mpesaauth,
    environment,
  }) {
    if (
      !shortcode ||
      !passkey ||
      !transactiontype ||
      !businessshortcode ||
      !amount ||
      !phone ||
      !callbackurl ||
      !accountreference ||
      !transactiondesc ||
      !mpesaauth ||
      !environment
    ) {
      return {
        status: 400,
        message: "Please provide all the required parameters",
      };
    }

    this.shortcode = shortcode;
    this.passkey = passkey;
    this.transactiontype = transactiontype;
    this.businessshortcode = businessshortcode;
    this.amount = amount;
    this.phone = phone;
    this.callbackurl = callbackurl;
    this.accountreference = accountreference;
    this.transactiondesc = transactiondesc;
    this.mpesaauth = mpesaauth;
    this.environment = environment;
  }

  sendMoney() {
    const passkey = this.passkey;
    const shortcode = this.shortcode;
    const transactiontype = this.transactiontype;
    const businessshortcode = this.businessshortcode;
    const amount = this.amount;
    const phone = this.phone;
    const callbackurl = this.callbackurl;
    const accountreference = this.accountreference;
    const transactiondesc = this.transactiondesc;
    const mpesaauth = this.mpesaauth;
    const environment = this.environment;
    let timestamp = moment().format("YYYYMMDDHHmmss");
    const password = new Buffer.from(
      `${shortcode}${passkey}${timestamp}`
    ).toString("base64");
    return new Promise((resolve, reject) => {
      let access_token = "";
      let auth = new Buffer.from(mpesaauth).toString("base64");
      let url =
        environment === "production"
          ? "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
          : "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

      request(
        {
          url: url,
          headers: {
            Authorization: "Basic " + auth,
          },
        },
        (error, _response, body) => {
          if (error) {
            return error;
          } else {
            access_token = JSON.parse(body).access_token;

            let auth = `Bearer ${access_token}`;
            let endpoint =
              environment === "production"
                ? "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
                : "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

            request(
              {
                url: endpoint,
                method: "POST",
                headers: {
                  Authorization: auth,
                },
                json: {
                  BusinessShortCode: businessshortcode,
                  Password: password,
                  Timestamp: timestamp,
                  TransactionType: transactiontype,
                  Amount: amount,
                  PartyA: phone,
                  PartyB: shortcode,
                  PhoneNumber: phone,
                  CallBackURL: callbackurl,
                  AccountReference: accountreference,
                  TransactionDesc: transactiondesc,
                },
              },
              (error, response, body) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(body);
                }
              }
            );
          }
        }
      );
    });
  }
}

module.exports = Mpesa;
