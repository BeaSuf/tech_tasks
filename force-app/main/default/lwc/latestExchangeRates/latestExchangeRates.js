import { LightningElement, track, wire } from 'lwc';
// import server side apex class method 
import exchangeRates from'@salesforce/apex/ExchangeRatesCallout.makeGetExchangeRatesCallout';
// import standard toast event 
import {ShowToastEvent} from 'lightning/platformShowToastEvent'

export default class LatestExchangeRates extends LightningElement {
    @track currencyRate = [];

    currency = '';
    ratesValues = new Map();

    @wire(exchangeRates)    
    getExchangeRatesData({data, error}){
        if(data) {
            for(let key in data) {
                // Preventing unexcepted data
                if (data.hasOwnProperty(key)) { // Filtering the data according to search term
                    this.ratesValues.set(key, data[key]);
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
            // reset ratesValues
            this.ratesValues = null;
        }
    }

    handleSearchCurrency() {
        this.currencyRate = [];
        if (this.currency !== '') {
            let value = this.ratesValues.get(this.currency);
            if(value != undefined) {
                this.currencyRate.push({key:this.currency, value:value});                         
            } else {
                // fire toast event if input field is blank
                const event = new ShowToastEvent({
                    variant: 'error',
                    message: 'Currency code' + this.currency + ' is not found.',
                });
                this.dispatchEvent(event);
            }
        } else {
            // fire toast event if input field is blank
            const event = new ShowToastEvent({
                variant: 'error',
                message: 'Search currency missing...',
            });
            this.dispatchEvent(event);
        }
    }
    
    // update currency var when input field value change
    searchCurrency(event) { 
        this.currency = event.target.value;   
    }
}