public with sharing class AssignContactToAccountsByState implements Database.Batchable<sObject>, Database.Stateful{
    private Contact contact;
    private String state;


    public AssignContactToAccountsByState(Contact contact){
        this.contact = contact;
        this.state = contact.MailingState;
    }

    public Database.QueryLocator start(Database.BatchableContext bc) {
        // collect the batches of records or objects to be passed to execute
        String query = 'SELECT Id, Name, BillingState FROM Account WHERE BillingState = :state';
        return Database.getQueryLocator(query);
    }

    public void execute(Database.BatchableContext bc, List<Account> records){
        // process each batch of records
        List<AccountContactRelation> accContactRels = new List<AccountContactRelation>();
        
        // Set primary account
        List<Contact> contacts = new List<Contact>();
        
        contact.AccountId = records.get(0).Id;
        contacts.add(contact);
        update contacts;
       
        // Add contact to the rest of accounts
        for (Integer i = 1; i < records.size(); i++){
            // add AccountId and ContactIdto list to be updated
            AccountContactRelation accCntRel= new AccountContactRelation(AccountId = records.get(i).Id, ContactId = this.contact.Id);                      
            accContactRels.add(accCntRel);
        }
       
        insert accContactRels;
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
