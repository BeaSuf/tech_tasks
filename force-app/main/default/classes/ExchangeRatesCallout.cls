public class ExchangeRatesCallout {
    @AuraEnabled(cacheable =true)
    public static Map<String, Object> makeGetExchangeRatesCallout() {
        Map<String, Object> rates;
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('http://data.fixer.io/api/latest?access_key=1c422579ed06b2ef40ed6c6d032e0ca9');
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        // If the request is successful, return the response body.
        if(response.getStatusCode() == 200) {
            // Deserializes the JSON string into collections of primitive data types.
            Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            System.debug(results.get('rates'));
            // Cast the values in the 'rates' key as a list
            rates = (Map<String, Object>) results.get('rates');
            System.debug('Received the following rates:');
            for(String rate: rates.keySet()) {
                System.debug(rate + '=' + rates.get(rate));
            }
        }
        return rates;
    }     
}
