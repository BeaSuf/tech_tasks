@isTest
global class ExchangeRatesCalloutMock implements HttpCalloutMock {
    global HttpResponse respond(HttpRequest request){
        // Create a fake response
        HttpResponse response = new HttpResponse();
        response.setHeader('Content-Type', 'application/json');
        response.setBody('{"success":true, "timestamp":1632918544, "base":"EUR","date":"2021-09-29",' +
                            '"rates":{"USD":1.165848, "AUD":1.611609, "CAD":1.480685, "PLN":4.627786, "MXN":23.759089}}');
        response.setStatusCode(200);
        return response; 
    }
}
