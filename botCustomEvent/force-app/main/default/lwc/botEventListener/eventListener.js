import { LightningElement } from 'lwc';
import { subscribe, unsubscribe, onError } from 'lightning/empApi';

export default class EventListener extends LightningElement {
    channelName = '/event/Bot_Action_Event__e';  // Platform Event API name
    subscription = null;

    connectedCallback() {
        // Initialize the subscription when the component is inserted into the DOM
        this.subscribeToEvent();
    }

    // Subscribe to the platform event
    subscribeToEvent() {
        const callback = (response) => {
            // Log the received data
            console.log('Received platform event data:', response);

            const eventData = response.data.payload;
            
            // Send the event data to the parent window (hosting site)
            window.parent.postMessage({
                type: 'CUSTOM_BOT_EVENT',
                actionType: eventData.Action_Type__c,  // Action type like 'setReadOnly' or 'setEditable'
                message: eventData.Message__c  // Optional message if needed
            }, '*');
        };

        // Subscribe to the platform event
        subscribe(this.channelName, -1, callback)
            .then((response) => {
                console.log('Successfully subscribed to platform event');
                this.subscription = response;
            })
            .catch((error) => {
                console.error('Error subscribing to event', error);
            });
    }

    // Unsubscribe when the component is removed from the DOM
    disconnectedCallback() {
        if (this.subscription) {
            unsubscribe(this.subscription, (response) => {
                console.log('Successfully unsubscribed from event');
            });
        }
    }
}