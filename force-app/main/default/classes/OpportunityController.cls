public with sharing class OpportunityController {
    @AuraEnabled(cacheable=true)
    public static Map <String, List<Opportunity>> fetchOpportunityData() {        
        Map <String, List<Opportunity>> mapStageOpps = new Map <String, List<Opportunity>>();
        List<String> stages = getStages();
        
        for(OppORtunity opp : [SELECT Id, StageName, Name, Account.Name FROM OppORtunity 
                                WHERE StageName IN :stages]){
            List<Opportunity> opps = (mapStageOpps.containsKey(opp.StageName)) ? mapStageOpps.get(opp.StageName) : new List<Opportunity>();
            opps.add(opp);
            mapStageOpps.put(opp.StageName, opps);                    
        }          
        
        return mapStageOpps;
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getStages(){
        List<String> stages = new List<String>();
        
        Schema.DescribeFieldResult fieldResult = opportunity.StageName.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for (Schema.PicklistEntry stage : ple) {
            stages.add(stage.getValue());
        }
       
        return stages;
    }
}
