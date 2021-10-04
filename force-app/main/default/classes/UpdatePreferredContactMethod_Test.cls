@isTest
private class UpdatePreferredContactMethod_Test {
    @testSetup
    static void setup(){
        List<Contact> contacts = new List<Contact>();
        // insert 200 contacts, number of records inserted is less than or equal to the batch size of 200 because test methods can execute only one batch
        for (Integer i=0; i<200; i++) {
            contacts.add(new Contact(firstname='first' + i, lastname='last' + i));
        }
        insert contacts;
    }

    
    @isTest
    private static void testUpdatePrefferedContactMethod() {
        Test.startTest();
        UpdatePreferredContactMethod upcm = new UpdatePreferredContactMethod();
        Id batchId = Database.executeBatch(upcm);
        Test.stopTest();
        
        // assert records were updated properly
        System.assertEquals(200, [SELECT count() FROM Contact WHERE Preferred_Contact_Method__c = 'Mobile']);
        System.assertEquals(0, [SELECT count() FROM Contact WHERE Preferred_Contact_Method__c != 'Mobile']);
    }    
}
