/**
 * File: js/utils/storage.js
 * Purpose: LocalStorage persistence management
 * Author: Vinay
 * Project: Event Ticket Management System
 * Data Structure: None specific
 */

const StorageManager = {
    saveEvents(eventsArray) {
        localStorage.setItem('etms_events', JSON.stringify(eventsArray));
    },
    
    loadEvents() {
        const data = localStorage.getItem('etms_events');
        return data ? JSON.parse(data) : null;
    },
    
    saveBookings(bookingsArray) {
        localStorage.setItem('etms_bookings', JSON.stringify(bookingsArray));
    },
    
    loadBookings() {
        const data = localStorage.getItem('etms_bookings');
        return data ? JSON.parse(data) : null;
    },
    
    saveActions(actionsArray) {
        localStorage.setItem('etms_actions', JSON.stringify(actionsArray));
    },
    
    loadActions() {
        const data = localStorage.getItem('etms_actions');
        return data ? JSON.parse(data) : null;
    },
    
    saveCounter(key, value) {
        localStorage.setItem(`etms_${key}`, value);
    },
    
    loadCounter(key) {
        return localStorage.getItem(`etms_${key}`);
    },
    
    clearAll() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('etms_') || key === 'ticketCounter' || key === 'eventCounter') {
                localStorage.removeItem(key);
            }
        });
    }
};
