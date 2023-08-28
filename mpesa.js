const Mpesa = require('./mpesa-lib.js'); // Path to the mpesa.js file you created

// Your M-Pesa API credentials and configuration
const mpesaConfig = {
    public_key: 'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAmptSWqV7cGUUJJhUBxsMLonux24u+FoTlrb+4Kgc6092JIszmI1QUoMohaDDXSVueXx6IXwYGsjjWY32HGXj1iQhkALXfObJ4DqXn5h6E8y5/xQYNAyd5bpN5Z8r892B6toGzZQVB7qtebH4apDjmvTi5FGZVjVYxalyyQkj4uQbbRQjgCkubSi45Xl4CGtLqZztsKssWz3mcKncgTnq3DHGYYEYiKq0xIj100LGbnvNz20Sgqmw/cH+Bua4GJsWYLEqf/h/yiMgiBbxFxsnwZl0im5vXDlwKPw+QnO2fscDhxZFAwV06bgG0oEoWm9FnjMsfvwm0rUNYFlZ+TOtCEhmhtFp+Tsx9jPCuOd5h2emGdSKD8A6jtwhNa7oQ8RtLEEqwAn44orENa1ibOkxMiiiFpmmJkwgZPOG/zMCjXIrrhDWTDUOZaPx/lEQoInJoE2i43VN/HTGCCw8dKQAwg0jsEXau5ixD0GUothqvuX3B9taoeoFAIvUPEq35YulprMM7ThdKodSHvhnwKG82dCsodRwY428kg2xM/UjiTENog4B6zzZfPhMxFlOSFX4MnrqkAS+8Jamhy1GgoHkEMrsT5+/ofjCx0HjKbT5NuA2V/lmzgJLl3jIERadLzuTYnKGWxVJcGLkWXlEPYLbiaKzbJb2sYxt+Kt5OxQqC1MCAwEAAQ==',
    api_host: 'api.sandbox.vm.co.mz',
    api_key: '6c6ymqhdffbi7eine7pixsn0tnmd1vgj',
    origin: 'developer.mpesa.vm.co.mz',
    service_provider_code: '171717',
    initiator_identifier: 'FenixBot',
    security_credential: '<Security Credential>'
};

// Initialize the Mpesa object with your configuration
const mpesa = new Mpesa(mpesaConfig);


const paymentData = {
    amount: '100',
    msisdn: '258844236139', 
    reference: 'Yannick Compras',
    third_party_reference: '5',
};

// Call the c2b method to make the payment
mpesa.c2b(paymentData)
    .then(response => {
        console.log('Payment successful:', response);
    })
    .catch(error => {
        console.error('Payment failed:', error);
    });
