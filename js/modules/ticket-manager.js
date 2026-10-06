/**
 * File: js/modules/ticket-manager.js
 * Purpose: Business logic for booking and managing tickets
 * Author: Vinay
 * Project: Event Ticket Management System
 * Data Structure: Interacts with BookingLinkedList, EventStore, ActionStack
 */

class TicketManager {
    constructor(bookingList, eventStore, actionStack) {
        this.bookingList = bookingList;   // BookingLinkedList instance
        this.eventStore = eventStore;     // EventStore instance  
        this.actionStack = actionStack;   // ActionStack instance
    }
    
    bookTicket(data) {
        // Validate booking data
        const validation = Validator.validateBooking(data);
        if (!validation.valid) return { success: false, errors: validation.errors };
        
        // Check event exists and is active
        const event = this.eventStore.get(data.eventId);
        if (!event) return { success: false, errors: ['Event not found'] };
        if (event.status !== 'active') return { success: false, errors: ['Event is not active'] };
        
        // Check ticket availability
        const ticketType = data.ticketType;
        if (event.tickets[ticketType].available <= 0) {
            return { success: false, errors: ['No ' + ticketType + ' tickets available for this event'] };
        }
        
        // Generate unique ticket ID
        const ticketId = Helpers.generateTicketId();
        
        // Create booking record
        const booking = {
            ticketId: ticketId,
            customerName: data.customerName.trim(),
            customerEmail: data.customerEmail.trim().toLowerCase(),
            customerPhone: data.customerPhone.trim(),
            eventId: data.eventId,
            eventName: event.name,
            ticketType: ticketType,
            price: event.tickets[ticketType].price,
            bookingDate: Helpers.getCurrentDateTime(),
            eventDate: event.date,
            eventTime: event.time,
            venue: event.venue,
            status: 'confirmed'
        };
        
        // Insert into linked list
        this.bookingList.insertAtBeginning(booking);
        
        // Decrease available tickets in event array
        event.tickets[ticketType].available--;
        this.eventStore.update(data.eventId, event);
        
        // Push to action stack
        this.actionStack.push({
            type: 'BOOK_TICKET',
            description: 'Booked ' + ticketType + ' ticket for ' + event.name + ' - ' + data.customerName.trim(),
            timestamp: Helpers.getCurrentDateTime(),
            data: { ...booking }
        });
        
        this._save();
        return { success: true, data: booking };
    }
    
    cancelTicket(ticketId) {
        const result = this.bookingList.cancelBooking(ticketId);
        if (result.success) {
            // Restore ticket to event availability
            const booking = result.data;
            const event = this.eventStore.get(booking.eventId);
            if (event) {
                event.tickets[booking.ticketType].available++;
                this.eventStore.update(booking.eventId, event);
            }
            
            this.actionStack.push({
                type: 'CANCEL_TICKET',
                description: 'Cancelled ticket ' + ticketId + ' for ' + booking.eventName,
                timestamp: Helpers.getCurrentDateTime(),
                data: { ...booking, status: 'confirmed' } // save pre-cancel state for undo
            });
            
            this._save();
        }
        return result;
    }
    
    getBooking(ticketId) { return this.bookingList.search(ticketId); }
    getAllBookings() { return this.bookingList.toArray(); }
    searchByName(name) { return this.bookingList.searchByName(name); }
    searchByTicketId(ticketId) {
        const booking = this.bookingList.search(ticketId);
        return booking ? [booking] : [];
    }
    filterByStatus(status) { return this.bookingList.filterByStatus(status); }
    getBookingsByEvent(eventId) { return this.bookingList.getBookingsByEvent(eventId); }
    getConfirmedCount() { return this.bookingList.getConfirmedCount(); }
    getTotalRevenue() { return this.bookingList.getTotalRevenue(); }
    
    // Search bookings by query (searches ticket ID and customer name)
    searchBookings(query) {
        const q = query.trim().toUpperCase();
        if (q.startsWith('TKT-')) {
            return this.searchByTicketId(q);
        }
        return this.searchByName(query);
    }
    
    _save() {
        StorageManager.saveBookings(this.bookingList.toArray());
        StorageManager.saveEvents(this.eventStore.toSaveArray());
        StorageManager.saveActions(this.actionStack.toArray().reverse());
    }
}
