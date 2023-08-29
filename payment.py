import requests

url = 'http://127.0.0.1:3000/pay'




def pay(amount, msisdn, reference, third_party_reference):
    payment_data = {
    "amount": amount,
    "msisdn": msisdn,
    "reference": reference,
    "third_party_reference": third_party_reference
    }
    response = requests.post(url, json=payment_data)

    if response.status_code == 200:
        data = response.json()
        if data.get("success"):
            res = "Payment successful"
            return res, data
        else:
            res = "Payment failed"
            return res, data
    else:
        res = "Request failed"
        return res, data