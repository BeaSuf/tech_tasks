import { LightningElement, track, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
// import server side apex class methods
import opportunitiesByStage from'@salesforce/apex/OpportunityController.getOpportunitiesByStage';
import stagesData from'@salesforce/apex/OpportunityController.getStages';
// import standard toast event 
import {ShowToastEvent} from 'lightning/platformShowToastEvent'


const COLS = [
    { label: 'Stage', fieldName: 'StageName', type: 'text' },
    { label: 'Name', fieldName: 'Name', type: 'text' }    ,
    { label: 'Account Name', fieldName: 'AccountName', type: 'text' }
];

export default class WiredOpportunities extends LightningElement {
    @track empty;
    @track filtered = [];
    
    opportunitiesPerStage = [];
    selectedValue = '';
    stage = '';
    cols = COLS;
    options = [];
    wiredActivities;
  
    @wire(stagesData)
    getStagesData({data, error}){
        if(data) { 
            this.options = data.map(stage =>{
                console.log(stage);  
                return {label: stage, value: stage};
            })
          
            this.options.push({ label: 'All', value: 'All' });   
            console.log(this.options);             
        } 
        else if(error) {
            const event = new ShowToastEvent({
                title: 'Error',
                variant: 'error',
                message: error.body.message,
            });
            this.dispatchEvent(event);
        }
    }
   
    @wire(opportunitiesByStage, {stage: '$stage'})    
    getOpportunitiesByStage(value){
        // Hold on to the provisioned value so it will be refreshed later.
        this.wiredOpps = value; // track the provisioned value        
        const {data, error} = value; //destructure the provisioned value        
        if(data) {                          
            for(let key in data) {                
                // Preventing unexcepted data
                if (Object.prototype.hasOwnProperty.call(data, key)) {                    
                    let opps = data[key].map(row => {
                        return {Id: row.Id, StageName: row.StageName, Name: row.Name, AccountName: row.Account.Name}
                    });
                    this.opportunitiesPerStage.push(...opps);                              
                }
            }
            this.filtered = this.opportunitiesPerStage;

            console.log("filtered: " + JSON.stringify(this.filtered));
            
            this.empty = Object.keys(data).length === 0 && data.constructor === Object;
        }
        else if(error) {
            this.empty = true;
            const event = new ShowToastEvent({
                title: 'Error',
                variant: 'error',
                message: error.body.message,
            });
            this.dispatchEvent(event);
        } 
    }    

    // update filter var when combobox field value change
    handleChange(event) {     
        this.selectedValue = event.detail.value;
        this.filtered = [];    
        
        this.stage = this.selectedValue;
        this.opportunitiesPerStage = [];             
        // Use the this.wiredOpps value to refresh getOpportunitiesByStage().
        refreshApex(this.wiredOpps); 
    }    
}
