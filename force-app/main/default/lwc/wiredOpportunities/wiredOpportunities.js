import { LightningElement, track, wire } from 'lwc';
// import server side apex class method 
import opportunitiesData from'@salesforce/apex/OpportunityController.fetchOpportunityData';
import stagesData from'@salesforce/apex/OpportunityController.getStages';
// import standard toast event 
import {ShowToastEvent} from 'lightning/platformShowToastEvent'
const COLS = [
    { label: 'Stage', fieldName: 'StageName', type: 'text' },
    { label: 'Name', fieldName: 'Name', type: 'text' }    ,
    { label: 'Account Name', fieldName: 'AccountName', type: 'text' }
];

export default class WiredOpportunities extends LightningElement {
    @track fillteredOpps = [];
    @track empty;

    opportunitiesPerStage = new Map();
    all = [];
    cols = COLS;
    value;
    options;

    // connectedCallback(){
    //     stagesData()
    //         .then(data => {
    //             this.options = data.map(stage => {
    //                 return {label: stage, value: stage}
    //             });
    //             this.options.push({ label: 'All', value: 'All' });    
    //         })
    //         .catch(error => {
    //             const event = new ShowToastEvent({
    //                 title: 'Error',
    //                 variant: 'error',
    //                 message: error.body.message,
    //             });
    //             this.dispatchEvent(event);
    //         });
    // }

    @wire(stagesData)
    getStagesData({data, error}){
        if(data) {
            window.console.log(data);
            this.options = data.map(stage => {
                return {label: stage, value: stage}
            });
            this.options.push({ label: 'All', value: 'All' });    
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
    
    get options() {
        return this.options;
    }
    
    @wire(opportunitiesData)    
        getOpportunitiesData({data, error}){
            if(data) {                
                for(let key in data) {
                    // Preventing unexcepted data
                    if (data.hasOwnProperty(key)) { // Filtering the data according to search term
                        let d = data[key].map(row => {
                            return {...row, AccountName: row.Account.Name}
                        })
                        this.opportunitiesPerStage.set(key, d);                    
                        d.forEach(opp => {
                            this.all.push(opp);                        
                        });                                                         
                    }
                }
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

    // update filter var when combobox field value change
    handleChange(event) {        
        this.fillteredOpps = [];
        this.value = event.detail.value;  
                
        if (this.value !== 'All') {   
            let opp = this.opportunitiesPerStage.get(this.value);
            if(opp != undefined){
                this.fillteredOpps = this.opportunitiesPerStage.get(this.value);
                this.empty = false;
            } else {
                this.empty = true;
                this.fillteredOpps = [];
            }
        } else {
            //all
            this.fillteredOpps = this.all;
            this.empty = false;
        }        
    }
}