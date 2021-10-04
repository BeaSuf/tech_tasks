public with sharing class UpdatePreferredContactMethod implements Database.Batchable<sObject>{
    
    public Database.QueryLocator start(Database.BatchableContext bc) {
        // collect the batches of records or objects to be passed to execute
        String query = 'SELECT Id, Preferred_Contact_Method__c FROM Contact';
        return Database.getQueryLocator(query);
    }

    public void execute(Database.BatchableContext bc, List<Contact> records){
        // process each batch of records
        List<Contact> contacts = new List<Contact>();
       
        for (Contact contact : records) {
            contact.Preferred_Contact_Method__c = 'Mobile';
            // add contact to list to be updated
            contacts.add(contact);
        }
       
        update contacts;
    }
    
    public void finish(Database.BatchableContext bc){
        AsyncApexJob job = [SELECT Id, Status, NumberOfErrors,
        JobItemsProcessed,
        TotalJobItems, CreatedBy.Email
        FROM AsyncApexJob
        WHERE Id = :bc.getJobId()];
        
        System.debug('job' + job);
    }
}
