@isTest
private class OpportunityController_Test {
    @testSetup
    static void setup(){
        
        Account acc = new Account(Name = 'Test Account');
        insert acc;
        
        // insert 250 opportunities
        List<Opportunity> opportunities = new List<Opportunity>();
        for (Integer i=0; i<250; i++) {          
            opportunities.add(new Opportunity(Name = 'Test Opportunity_' + i, StageName = 'Prospecting', CloseDate = Date.today(), AccountId = acc.Id));
        }
        insert opportunities;    
        
        List<Opportunity> opportunitiesWrongStage = new List<Opportunity>();
        opportunities.add(new Opportunity(Name = 'Test Opportunity', StageName = 'WrongStage', CloseDate = Date.today(), AccountId = acc.Id));
        insert opportunitiesWrongStage;    
    }

    
    @isTest
    private static void testFetchOpportunityData() {
        Map <String, List<Opportunity>> opportunities;
        Test.startTest();       
        opportunities = OpportunityController.fetchOpportunityData();        
        Test.stopTest();

        // assert records were fetched properly        
        System.assertEquals(1, opportunities.keySet().size());
        System.assertEquals(250, opportunities.get('Prospecting').size());
    }    

    private static void testFetchOpportunityDataNonExistingStage() {
        Map <String, List<Opportunity>> opportunities;
        Test.startTest();       
        opportunities = OpportunityController.fetchOpportunityData();        
        Test.stopTest();

        // assert records were fetched properly        
        System.assertEquals(1, opportunities.keySet().size());
        System.assertEquals(0, opportunities.get('WrongStage').size());
    }    
}