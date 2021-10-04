@isTest
private class AssignContactToAccountsByState_Test {
    @testSetup
    static void setup(){
        List<Contact> contacts = new List<Contact>();
        contacts.add(new Contact(FirstName='first', LastName='last', MailingState='CA'));
        insert contacts;

        List<Account> accounts = new List<Account>();
        // insert 200 contacts, number of records inserted is less than or equal to the batch size of 200 because test methods can execute only one batch
        for (Integer i=0; i<200; i++) {
            accounts.add(new Account(Name='TestAccount' + i, BillingState='CA'));
        }
        insert accounts;
    }

    
    @isTest
    private static void testAssignContactToAccountsByState() {
        Contact createdContact = [SELECT Id, MailingState FROM Contact];

        Test.startTest();       
        AssignContactToAccountsByState actabs = new AssignContactToAccountsByState(createdContact);
        Id batchId = Database.executeBatch(actabs);
        Test.stopTest();

        // assert records were updated properly
        System.assertEquals(200, [SELECT count() FROM AccountContactRelation WHERE ContactId =: createdContact.Id]);
    }    

}
