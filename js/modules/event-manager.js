/**
 * File: js/modules/event-manager.js
 * Purpose: Business logic for event management
 * Author: Vinay
 * Project: Event Ticket Management System
 * Data Structure: Interacts with ArrayStore and ActionStack
 */

// EventManager depends on: EventStore, ActionStack, Validator, Helpers, StorageManager
// These will be initialized in app.js and passed/set as needed.
// For simplicity, EventManager will access global instances.

class EventManager {
    constructor(eventStore, actionStack) {
        this.store = eventStore;     // EventStore instance
        this.actionStack = actionStack; // ActionStack instance
    }
    
    createEvent(data) {
        const validation = Validator.validateEvent(data);
        if (!validation.valid) return { success: false, errors: validation.errors };
        
        const event = {
            id: data.id !== undefined ? data.id : this._getNextId(),
            name: data.name.trim(),
            description: (data.description || '').trim(),
            category: data.category,
            date: data.date,
            time: data.time,
            venue: data.venue.trim(),
            tickets: {
                VIP: { price: parseFloat(data.tickets.VIP.price), total: parseInt(data.tickets.VIP.capacity), available: parseInt(data.tickets.VIP.capacity) },
                Premium: { price: parseFloat(data.tickets.Premium.price), total: parseInt(data.tickets.Premium.capacity), available: parseInt(data.tickets.Premium.capacity) },
                General: { price: parseFloat(data.tickets.General.price), total: parseInt(data.tickets.General.capacity), available: parseInt(data.tickets.General.capacity) }
            },
            status: 'active',
            createdAt: Helpers.getCurrentDateTime()
        };
        
        const result = this.store.add(event);
        if (result.success) {
            this.actionStack.push({
                type: 'CREATE_EVENT',
                description: 'Created event: ' + event.name,
                timestamp: Helpers.getCurrentDateTime(),
                data: { ...event }
            });
            this._save();
        }
        return result;
    }
    
    updateEvent(id, data) {
        const oldEvent = this.store.get(id);
        if (!oldEvent) return { success: false, errors: ['Event not found'] };
        
        const validation = Validator.validateEvent(data);
        if (!validation.valid) return { success: false, errors: validation.errors };
        
        // Calculate tickets sold to preserve them
        const updatedTickets = {};
        TICKET_TYPES.forEach(type => {
            const newTotal = parseInt(data.tickets[type].capacity);
            const oldSold = oldEvent.tickets[type].total - oldEvent.tickets[type].available;
            updatedTickets[type] = {
                price: parseFloat(data.tickets[type].price),
                total: newTotal,
                available: Math.max(0, newTotal - oldSold)
            };
        });
        
        const updatedEvent = {
            name: data.name.trim(),
            description: (data.description || '').trim(),
            category: data.category,
            date: data.date,
            time: data.time,
            venue: data.venue.trim(),
            tickets: updatedTickets
        };
        
        // Save old state for undo
        const oldCopy = JSON.parse(JSON.stringify(oldEvent));
        
        const result = this.store.update(id, updatedEvent);
        if (result.success) {
            this.actionStack.push({
                type: 'UPDATE_EVENT',
                description: 'Updated event: ' + updatedEvent.name,
                timestamp: Helpers.getCurrentDateTime(),
                data: { oldEvent: oldCopy, newEvent: result.data }
            });
            this._save();
        }
        return result;
    }
    
    deleteEvent(id) {
        const event = this.store.get(id);
        if (!event) return { success: false, message: 'Event not found' };
        
        const eventCopy = JSON.parse(JSON.stringify(event));
        const result = this.store.remove(id);
        if (result.success) {
            this.actionStack.push({
                type: 'DELETE_EVENT',
                description: 'Deleted event: ' + event.name,
                timestamp: Helpers.getCurrentDateTime(),
                data: eventCopy
            });
            this._save();
        }
        return result;
    }
    
    getEvent(id) { return this.store.get(id); }
    getAllEvents() { return this.store.getAll(); }
    getActiveEvents() { return this.store.getActive(); }
    searchEvents(query) { return this.store.search(query); }
    filterByCategory(category) { return this.store.filterByCategory(category); }
    
    _getNextId() {
        // Find first empty slot in the array
        for (let i = 0; i < MAX_EVENTS; i++) {
            if (this.store.get(i) === null) return i;
        }
        return -1;
    }
    
    _save() {
        StorageManager.saveEvents(this.store.toSaveArray());
        StorageManager.saveActions(this.actionStack.toArray().reverse()); // save bottom to top
    }
    
    // Load sample data (6 events)
    loadSampleData() {
        const sampleEvents = [
            {
                id: 0, name: 'Tech Fest 2026', description: 'Annual technology festival featuring workshops, hackathons, and tech talks from industry leaders.',
                category: 'Tech', date: '2026-11-15', time: '09:00', venue: 'Main Auditorium',
                tickets: { VIP: {price:2000,total:50,available:45}, Premium: {price:1200,total:100,available:88}, General: {price:500,total:200,available:170} },
                status: 'active', createdAt: '2026-10-01T10:00:00'
            },
            {
                id: 1, name: 'College Cultural Night', description: 'A grand celebration of art, music, dance, and drama performances by talented students.',
                category: 'Cultural', date: '2026-11-20', time: '18:00', venue: 'Open Air Theater',
                tickets: { VIP: {price:1500,total:30,available:28}, Premium: {price:800,total:80,available:72}, General: {price:300,total:150,available:140} },
                status: 'active', createdAt: '2026-10-02T11:00:00'
            },
            {
                id: 2, name: 'Football Tournament', description: 'Inter-college football championship with teams competing for the coveted trophy.',
                category: 'Sports', date: '2026-12-01', time: '07:00', venue: 'College Ground',
                tickets: { VIP: {price:1000,total:20,available:18}, Premium: {price:500,total:60,available:55}, General: {price:200,total:200,available:190} },
                status: 'active', createdAt: '2026-10-03T09:00:00'
            },
            {
                id: 3, name: 'Music Concert', description: 'Live music performance featuring popular indie bands and college musicians.',
                category: 'Music', date: '2026-12-10', time: '19:00', venue: 'Indoor Stadium',
                tickets: { VIP: {price:3000,total:40,available:35}, Premium: {price:1500,total:100,available:85}, General: {price:700,total:300,available:260} },
                status: 'active', createdAt: '2026-10-04T14:00:00'
            },
            {
                id: 4, name: 'Hackathon', description: '24-hour coding marathon where teams build innovative solutions to real-world problems.',
                category: 'Tech', date: '2026-12-15', time: '10:00', venue: 'CS Lab Complex',
                tickets: { VIP: {price:0,total:0,available:0}, Premium: {price:500,total:50,available:45}, General: {price:200,total:100,available:90} },
                status: 'active', createdAt: '2026-10-05T08:00:00'
            },
            {
                id: 5, name: 'Stand-up Comedy Night', description: 'An evening of laughter with popular stand-up comedians performing live.',
                category: 'Comedy', date: '2026-12-20', time: '20:00', venue: 'Seminar Hall',
                tickets: { VIP: {price:2500,total:25,available:22}, Premium: {price:1200,total:60,available:55}, General: {price:500,total:120,available:110} },
                status: 'active', createdAt: '2026-10-05T10:00:00'
            }
        ];
        
        sampleEvents.forEach(event => this.store.add(event));
        this._save();
    }
}
