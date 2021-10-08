import { createElement } from 'lwc';
import latestExchangeRates from 'c/latestExchangeRates';
// import server side apex class method 
import exchangeRates from'@salesforce/apex/ExchangeRatesCallout.makeGetExchangeRatesCallout';
import { registerApexTestWireAdapter  } from '@salesforce/sfdx-lwc-jest';

// Realistic data with a map of rates
const EXCHANGE_RATES_LIST = require('./data/getExchangeRates.json');
const getEchangeRatesDataAdapter = registerApexTestWireAdapter(exchangeRates);

describe('c-latest-exchange-rates', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    it('renders without any records as default', () => {
        const element = createElement('c-latest-exchange-rates', {
            is: latestExchangeRates
        });

        document.body.appendChild(element);

        // Query for rendered list items
        const datatable = element.shadowRoot.querySelector('lightning-datatable');
        expect(datatable.data.length).toBe(0);
    });

    it('renders data of one record', () => {
        const USER_INPUT = 'AUD';

        // Create initial element
        const element = createElement('c-latest-exchange-rates', {
            is: latestExchangeRates
        });
        document.body.appendChild(element);

        getEchangeRatesDataAdapter.emit(EXCHANGE_RATES_LIST);

        // Select input field for simulating user input
        const inputEl = element.shadowRoot.querySelector('lightning-input');
        inputEl.value = USER_INPUT;
        inputEl.dispatchEvent(new CustomEvent('change'));
        
        // Select button for executing Apex call
        const buttonEl = element.shadowRoot.querySelector('lightning-button');
        buttonEl.click();


        // Select elements for validation
        return Promise.resolve().then(()=>{
            const datatable = element.shadowRoot.querySelector('lightning-datatable');            
            const rows = datatable.data;                 
            expect(rows[0].rate).toBe(EXCHANGE_RATES_LIST[USER_INPUT]);                   
        });
    });
});
