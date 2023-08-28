var axios = require("axios");
var NodeRSA = require("node-rsa");

module.exports = function (e) {
    this._public_key = e.public_key || "";
    this._api_host = e.api_host || "api.sandbox.vm.co.mz";
    this._api_key = e.api_key || "";
    this._origin = e.origin || "";
    this._service_provider_code = e.service_provider_code || "";
    this._initiator_identifier = e.initiator_identifier || "";
    this._security_credential = e.security_credential || "";
    this._validMSISDN;

    this._isValidMSISDN = function (e) {
        this._validMSISDN = "";
        isValid = false;

        if (typeof parseInt(e) === "number") {
            if (e.length === 12 && e.substring(0, 3) === "258") {
                buffer = e.substring(3, 5);
                if (buffer === "84" || buffer === "85") {
                    this._validMSISDN = e;
                    isValid = true;
                }
            } else if (e.length === 9) {
                buffer = e.substring(0, 2);
                if (buffer === "84" || buffer === "85") {
                    this._validMSISDN = "258" + e;
                    isValid = true;
                }
            }
        }

        return isValid;
    };

    this._validateAmount = function (e) {
        return !e || e === "" || isNaN(parseFloat(e)) || parseFloat(e) <= 0;
    };

    this.validation_errors;

    this._isValidated = function (e, i) {
        this.validation_errors = [];

        switch (e) {
            case "config":
                if (!this._api_host || this._api_host === "") this.validation_errors.push(" API Host");
                if (!this._api_key || this._api_key === "") this.validation_errors.push(" API Key");
                if (!this._service_provider_code || this._service_provider_code === "") this.validation_errors.push(" Service provider code ");
                if (!this._origin || this._origin === "") this.validation_errors.push(" Origin");
                if (!this._public_key || this._public_key === "") this.validation_errors.push(" Public key");
                break;

            case "c2b":
                if (this._validateAmount(i.amount)) this.validation_errors.push(" C2B Amount");
                if (i.msisdn === "" || !this._isValidMSISDN(i.msisdn)) this.validation_errors.push(" C2B MSISDN");
                if (i.reference === "") this.validation_errors.push(" C2B Reference");
                if (i.third_party_reference === "") this.validation_errors.push(" C2B 3rd-party Reference");
                break;

            // Add cases for 'query' and 'reversal' here

            default:
                break;
        }

        return this.validation_errors.length === 0;
    };

    this._getBearerToken = function () {
        if (this._isValidated("config", {})) {
            certificate = "-----BEGIN PUBLIC KEY-----\n" + this._public_key + "\n-----END PUBLIC KEY-----";
            public_key = new NodeRSA();
            public_key.setOptions({ encryptionScheme: "pkcs1" });
            public_key.importKey(Buffer.from(certificate), "public");
            token = public_key.encrypt(Buffer.from(this._api_key));
            return "Bearer " + Buffer.from(token).toString("base64");
        }

        throw new Error("Missing or invalid configuration parameters: " + this.validation_errors.toString());
    };

    this._request_headers = {};

    this._requestAsPromiseFrom = function (e) {
        return new Promise(function (i, r) {
            axios(e)
                .then(function (e) {
                    i(e.data);
                })
                .catch(function (e) {
                    r(e.toJSON());
                });
        });
    };

    // Add other API operation functions here

    if (!this._isValidated("config", {})) {
        throw new Error("Missing or invalid configuration parameters: " + this.validation_errors.toString());
    }

    this._request_headers = {
        "Content-Type": "application/json",
        Origin: this._origin,
        Authorization: this._getBearerToken(),
    };

    this.c2b = function (transaction_data) {
        if (this._isValidated('c2b', transaction_data)) {
          request = {
            method: 'post',
            url:
              'https://' +
              this._api_host +
              ':18352/ipg/v1x/c2bPayment/singleStage/',
            data: {
              input_ServiceProviderCode: this._service_provider_code,
              input_CustomerMSISDN: this._validMSISDN,
              input_Amount: parseFloat(transaction_data.amount).toFixed(2),
              input_TransactionReference: transaction_data.reference,
              input_ThirdPartyReference: transaction_data.third_party_reference
            },
            headers: this._request_headers
          }
    
          return this._requestAsPromiseFrom(request)
        } else {
          throw new Error(
            'Missing or invalid C2B parameters:' + this.validation_errors.toString()
          )
        }
      }
};
