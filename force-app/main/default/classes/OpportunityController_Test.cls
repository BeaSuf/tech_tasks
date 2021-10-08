@isTest
private class OpportunityController_Test {
    @testSetup
    static void setup(){
        
        Account acc = new Account(Name = 'Test Account');
        insert acc;
        
        // insert 500 opportunities
        List<Opportunity> opportunities = new List<Opportunity>();
        for (Integer i=0; i<500; i++) {   
            if(i < 250){
                opportunities.add(new Opportunity(Name = 'Test Opportunity_' + i, StageName = 'Prospecting', CloseDate = Date.today(), AccountId = acc.Id));
            } else {
                opportunities.add(new Opportunity(Name = 'Test Opportunity_' + i, StageName = 'Closed Won', CloseDate = Date.today(), AccountId = acc.Id));
            }
        }
        insert opportunities;    
        
        List<Opportunity> opportunitiesWrongStage = new List<Opportunity>();
        opportunities.add(new Opportunity(Name = 'Test Opportunity', StageName = 'WrongStage', CloseDate = Date.today(), AccountId = acc.Id));
        insert opportunitiesWrongStage;    
    }

    
    @isTest
    private static void testGetOpportunitiesByStage() {
        Map <String, List<Opportunity>> opportunities;
        Test.startTest();       
        opportunities = OpportunityController.getOpportunitiesByStage('Prospecting');        
        Test.stopTest();

        // assert records were fetched properly        
        System.assertEquals(1, opportunities.keySet().size());
        System.assertEquals(250, opportunities.get('Prospecting').size());
    }    

    @isTest
    private static void testGetOpportunitiesByStageNonExistingStage() {
        Map <String, List<Opportunity>> opportunities;
        Test.startTest();       
        opportunities = OpportunityController.getOpportunitiesByStage('WrongStage');        
        Test.stopTest();

        // assert records were fetched properly        
        System.assertEquals(0, opportunities.keySet().size());
        System.assertEquals(null, opportunities.get('WrongStage'));
    }    

    @isTest
    private static void testGetAllOpportunities() {
        Map <String, List<Opportunity>> opportunities;
        Test.startTest();       
        opportunities = OpportunityController.getOpportunitiesByStage('All');        
        Test.stopTest();

        // assert records were fetched properly        
        System.assertEquals(2, opportunities.keySet().size());
        System.assertEquals(250, opportunities.get('Prospecting').size());
        System.assertEquals(250, opportunities.get('Closed Won').size());
    }    

}
