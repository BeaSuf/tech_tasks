@isTest
private class ExchangeRatesCalloutTest {
    @isTest
    static void testMakeGetExchangeRatesCallout() {
        // Set mock callout class 
        Test.setMock(HttpCalloutMock.class, new ExchangeRatesCalloutMock()); 
        // This causes a fake response to be sent from the class that implements HttpCalloutMock. 
        Map<String, Object> rates = ExchangeRatesCallout.makeGetExchangeRatesCallout();
        // Verify mock response is not null
        System.assertNotEquals(null, rates, 'The callout returned a null.');             
        // Verify the map contains 5 items     
        System.assertEquals(5, rates.keySet().size(), 'The map should only contain 5 items.');
    }
}
