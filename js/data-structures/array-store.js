/**
 * File: js/data-structures/array-store.js
 * Purpose: Array-based storage for events
 * Author: Vinay
 * Project: Event Ticket Management System
 * Data Structure: ARRAY
 */

/*
 * ============================================
 * DATA STRUCTURE: ARRAY
 * ============================================
 * Used for: Storing events in fixed-size indexed slots
 * 
 * Why Array?
 * - Events have a fixed maximum capacity (MAX_EVENTS)
 * - Direct index access is O(1) - fast lookup by ID
 * - Categories and ticket types are fixed collections
 * - Good for sequential access and iteration
 * 
 * Structure:
 *   events[0] = Event1 or null
 *   events[1] = Event2 or null
 *   events[2] = null (empty slot)
 *   ...
 *   events[MAX_EVENTS-1] = null
 */

class EventStore {
    constructor() {
        // DATA STRUCTURE: ARRAY - Fixed-size event storage
        this.events = new Array(MAX_EVENTS).fill(null);
        this.count = 0;
    }
    
    // Add event to array - finds first empty slot or uses specific ID
    add(event) {
        if (this.count >= MAX_EVENTS) {
            return { success: false, message: 'Maximum events reached' };
        }
        
        const id = event.id;
        if (id >= 0 && id < MAX_EVENTS) {
            this.events[id] = event;
            this.count++;
            return { success: true, data: event };
        }
        
        // Find first empty slot
        for (let i = 0; i < MAX_EVENTS; i++) {
            if (this.events[i] === null) {
                event.id = i;
                this.events[i] = event;
                this.count++;
                return { success: true, data: event };
            }
        }
        
        return { success: false, message: 'No empty slots available' };
    }
    
    // Get event by index - O(1) direct access
    get(id) {
        if (id >= 0 && id < MAX_EVENTS) {
            return this.events[id];
        }
        return null;
    }
    
    // Update event
    update(id, updatedData) {
        if (id >= 0 && id < MAX_EVENTS && this.events[id] !== null) {
            // Preserve the ID
            this.events[id] = { ...this.events[id], ...updatedData, id: id };
            return { success: true, data: this.events[id] };
        }
        return { success: false, message: 'Event not found' };
    }
    
    // Remove event (set slot to null)
    remove(id) {
        if (id >= 0 && id < MAX_EVENTS && this.events[id] !== null) {
            const removed = this.events[id];
            this.events[id] = null;
            this.count--;
            return { success: true, data: removed };
        }
        return { success: false, message: 'Event not found' };
    }
    
    // Restore event (for undo)
    restore(event) {
        const id = event.id;
        if (id >= 0 && id < MAX_EVENTS && this.events[id] === null) {
            this.events[id] = event;
            this.count++;
            return { success: true, data: event };
        }
        return { success: false, message: 'Cannot restore event' };
    }
    
    // Get all non-null events
    getAll() {
        // Filter out null slots
        return this.events.filter(e => e !== null);
    }
    
    // Get active events only
    getActive() {
        return this.events.filter(e => e !== null && e.status === 'active');
    }
    
    // Search events by name - O(n) linear search
    search(query) {
        const searchTerm = query.toLowerCase();
        return this.events.filter(e => 
            e !== null && 
            (e.name.toLowerCase().includes(searchTerm) || 
             e.venue.toLowerCase().includes(searchTerm) ||
             e.description.toLowerCase().includes(searchTerm))
        );
    }
    
    // Filter by category - O(n)
    filterByCategory(category) {
        if (!category || category === 'all') return this.getAll();
        return this.events.filter(e => e !== null && e.category === category);
    }
    
    // Get count of active events
    getActiveCount() {
        return this.events.filter(e => e !== null && e.status === 'active').length;
    }
    
    // Get total count (non-null)
    getCount() {
        return this.count;
    }
    
    // Get total available tickets across all events
    getTotalAvailableTickets() {
        let total = 0;
        this.events.forEach(e => {
            if (e !== null && e.status === 'active') {
                total += e.tickets.VIP.available + e.tickets.Premium.available + e.tickets.General.available;
            }
        });
        return total;
    }
    
    // Get total capacity across all events
    getTotalCapacity() {
        let total = 0;
        this.events.forEach(e => {
            if (e !== null) {
                total += e.tickets.VIP.total + e.tickets.Premium.total + e.tickets.General.total;
            }
        });
        return total;
    }
    
    // Load from saved array
    loadFromArray(dataArray) {
        this.events = new Array(MAX_EVENTS).fill(null);
        this.count = 0;
        dataArray.forEach(event => {
            if (event !== null) {
                this.events[event.id] = event;
                this.count++;
            }
        });
    }
    
    // Convert to saveable array (only non-null)
    toSaveArray() {
        return this.events.filter(e => e !== null);
    }
}
