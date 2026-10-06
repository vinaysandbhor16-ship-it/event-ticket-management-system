/**
 * File: js/modules/validator.js
 * Purpose: Validation module for events and bookings
 * Author: Vinay
 * Project: Event Ticket Management System
 * Data Structure: None specific (Utility)
 */

const Validator = {
    validateEvent(data) {
        const errors = [];
        if (!data.name || data.name.trim() === '') errors.push('Event name is required');
        if (data.name && data.name.trim().length < 3) errors.push('Event name must be at least 3 characters');
        if (!data.category || !CATEGORIES.includes(data.category)) errors.push('Please select a valid category');
        if (!data.date) errors.push('Event date is required');
        if (!data.time) errors.push('Event time is required');
        if (!data.venue || data.venue.trim() === '') errors.push('Venue is required');
        
        // Validate ticket prices and capacities
        TICKET_TYPES.forEach(type => {
            const price = parseFloat(data.tickets[type]?.price);
            const capacity = parseInt(data.tickets[type]?.capacity);
            if (isNaN(price) || price < 0) errors.push(type + ' ticket price must be a non-negative number');
            if (isNaN(capacity) || capacity < 0) errors.push(type + ' ticket capacity must be a non-negative number');
        });
        
        // At least one ticket type should have capacity > 0
        const totalCapacity = TICKET_TYPES.reduce((sum, type) => sum + (parseInt(data.tickets[type]?.capacity) || 0), 0);
        if (totalCapacity === 0) errors.push('At least one ticket type must have capacity greater than 0');
        
        return { valid: errors.length === 0, errors };
    },
    
    validateBooking(data) {
        const errors = [];
        if (!data.eventId && data.eventId !== 0) errors.push('Please select an event');
        if (!data.ticketType || !TICKET_TYPES.includes(data.ticketType)) errors.push('Please select a ticket type');
        if (!data.customerName || data.customerName.trim() === '') errors.push('Customer name is required');
        if (data.customerName && data.customerName.trim().length < 2) errors.push('Customer name must be at least 2 characters');
        if (!data.customerEmail || !data.customerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.push('Valid email is required');
        if (!data.customerPhone || !data.customerPhone.match(/^[0-9]{10}$/)) errors.push('Valid 10-digit phone number is required');
        return { valid: errors.length === 0, errors };
    },
    
    validateSearch(query) {
        if (!query || query.trim() === '') return { valid: false, errors: ['Search query cannot be empty'] };
        return { valid: true, errors: [] };
    }
};
