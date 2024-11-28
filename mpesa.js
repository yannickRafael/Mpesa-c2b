
const bodyParser = require('body-parser')
const Mpesa = require('./mpesa-lib.js'); // Path to the mpesa.js file you created
const express = require('express');
const app = express();
const dotenv = require("dotenv");

dotenv.config();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);


// Your M-Pesa API credentials and configuration
const mpesaConfig = {
    public_key: process.env.PUBLIC_KEY,
    api_host: process.env.API_HOST,
    api_key: process.env.API_KEY,
    origin: process.env.ORIGIN,
    service_provider_code: process.env.SERVICE_PROVIDER,
    initiator_identifier: process.env.INITIATOR_IDENTIFIER,
    security_credential: process.env.SECURITY_CREDENTIAL
};

// Initialize the Mpesa object with your configuration
const mpesa = new Mpesa(mpesaConfig);




// // Call the c2b method to make the payment
// mpesa.c2b(paymentData)
//     .then(response => {
//         console.log('Payment successful:', response);
//     })
//     .catch(error => {
//         console.error('Payment failed:', error);
//     });

// Endpoint for making c2b payments
app.post('/pay', (req, res) => {
    //const paymentData = req.body;

    paymentData = {
        amount: '100',
        msisdn: '258844236139', 
        reference: 'Yannick Compras',
        third_party_reference: '15',
    };

    
    console.log(req.body)
    
    mpesa.c2b(req.body)
        .then(response => {
            res.json({ success: true, response });
        })
        .catch(error => {
            res.status(500).json({ success: false, error });
        });
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});

