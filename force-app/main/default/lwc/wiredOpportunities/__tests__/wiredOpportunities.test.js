import { createElement } from 'lwc';
import wiredOpportunities from 'c/wiredOpportunities';
import opportunitiesByStage from'@salesforce/apex/OpportunityController.getOpportunitiesByStage';
import { registerApexTestWireAdapter  } from '@salesforce/sfdx-lwc-jest';
  

// Realistic data with a list of contacts
const OPPORTUNITIES_LIST = require('./data/getOpportunitiesList.json');
const NO_OPPORTUNITIES_LIST = require('./data/getOpportunitiesNoRecords.json');
const getOpportunitiesDataAdapter = registerApexTestWireAdapter(opportunitiesByStage);

// Mock getContactList Apex wire adapter
jest.mock(
    '@salesforce/apex/OpportunityController.getStages',
    () => {
        const {
            createApexTestWireAdapter
        } = require('@salesforce/sfdx-lwc-jest');
        return {
            default: createApexTestWireAdapter(jest.fn())
        };
    },
    { virtual: true }
);

describe('c-wired-opportunities', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    it('called with stage filter from combobox', () => {
        const USER_INPUT = 'Prospecting';
        const SEARCH_TERM = { stage: USER_INPUT };

        // Create the leadList element
        const element = createElement('c-wired-opportunities', {
            is: wiredOpportunities
        });
        document.body.appendChild(element);

        // Simulate user input
        const comboboxEl = element.shadowRoot.querySelector('lightning-combobox');
        comboboxEl.dispatchEvent(new CustomEvent('change', {
            detail: {
                value: USER_INPUT
            }
        }));
             
        // Return a promise to wait for asynchronous results
        // and fail if promise is rejected
        return Promise.resolve().then(() => {
            expect(getOpportunitiesDataAdapter.getLastConfig()).toEqual(SEARCH_TERM);
        });
    });

    it('renders opportunities data filtered by user input through combobox', () => {     
        const USER_INPUT = 'Prospecting';
        
        const element = createElement('c-wired-opportunities', {
            is: wiredOpportunities 
        });
        document.body.appendChild(element);
        
        // Simulate user input
        const comboboxEl = element.shadowRoot.querySelector('lightning-combobox');
        comboboxEl.dispatchEvent(new CustomEvent('change', {
            detail: {
                value: USER_INPUT
            }
        }));
        
        
        getOpportunitiesDataAdapter.emit(OPPORTUNITIES_LIST);
        

        return Promise.resolve().then(() => {
            // select some elements that would be rendered if it succeeded
            const datatable = element.shadowRoot.querySelector('lightning-datatable');
            const rows = datatable.data;     
            expect(datatable.data.length).toBe(OPPORTUNITIES_LIST[USER_INPUT].length);
            expect(rows[0].Name).toBe(OPPORTUNITIES_LIST[USER_INPUT][0].Name);
       });
    });

    it('renders no opportunities data when no opportunities record available', () => {
        const USER_INPUT = '';
        
        const element = createElement('c-wired-opportunities', {
            is: wiredOpportunities 
        });
        document.body.appendChild(element);
        
        // Simulate user input
        const comboboxEl = element.shadowRoot.querySelector('lightning-combobox');
        comboboxEl.dispatchEvent(new CustomEvent('change', {
            detail: {
                value: USER_INPUT
            }
        }));
              
        getOpportunitiesDataAdapter.emit(NO_OPPORTUNITIES_LIST);

        return Promise.resolve().then(() => {
            // select some elements that would be rendered if it succeeded
            const datatable = element.shadowRoot.querySelector('lightning-datatable');             
            expect(datatable.data.length).toBe(getOpportunitiesDataAdapter.length);  
            
            const empty = element.shadowRoot.querySelectorAll('.empty');        
            expect(empty).not.toBeNull();
       });
    });

    it('renders without any records as default and shows "No data to display"', () => {
        // Create initial element
        const element = createElement('c-wired-opportunities', {
            is: wiredOpportunities
        });
        document.body.appendChild(element);

        // Query for rendered list items
        const datatable = element.shadowRoot.querySelector('lightning-datatable');        
        expect(datatable.data.length).toBe(0);

        const empty = element.shadowRoot.querySelectorAll('.empty');        
        expect(empty).not.toBeNull();        
    });    
});

