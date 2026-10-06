/**
 * File: js/data-structures/linked-list.js
 * Purpose: Singly Linked List implementation for bookings
 * Author: Vinay
 * Project: Event Ticket Management System
 * Data Structure: SINGLY LINKED LIST
 */

/*
 * ============================================
 * DATA STRUCTURE: SINGLY LINKED LIST
 * ============================================
 * Used for: Managing booking records dynamically
 * 
 * Why Linked List instead of Array?
 * - Bookings are created and cancelled frequently
 * - No need to pre-allocate fixed memory
 * - Insertion at head is O(1)
 * - No shifting needed when deleting (unlike arrays)
 * - Size grows/shrinks dynamically
 * 
 * Structure:
 *   HEAD -> [Node1] -> [Node2] -> [Node3] -> NULL
 *   Each node contains booking data and a pointer to next node
 */

class TicketNode {
    constructor(data) {
        this.data = data;   // booking data object
        this.next = null;   // pointer to next node
    }
}

class BookingLinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }
    
    // Insert at the beginning (head) - O(1)
    // New bookings appear first (most recent)
    insertAtBeginning(data) {
        const newNode = new TicketNode(data);
        newNode.next = this.head;
        this.head = newNode;
        this.size++;
        return newNode;
    }
    
    // Search by ticket ID - O(n)
    // Traverse from head to find matching ticket
    search(ticketId) {
        let current = this.head;
        while (current !== null) {
            if (current.data.ticketId === ticketId) {
                return current.data;
            }
            current = current.next;
        }
        return null; // not found
    }
    
    // Search by customer name (partial match) - O(n)
    searchByName(name) {
        const results = [];
        let current = this.head;
        const searchTerm = name.toLowerCase();
        while (current !== null) {
            if (current.data.customerName.toLowerCase().includes(searchTerm)) {
                results.push(current.data);
            }
            current = current.next;
        }
        return results;
    }
    
    // Search by event ID - O(n)
    getBookingsByEvent(eventId) {
        const results = [];
        let current = this.head;
        while (current !== null) {
            if (current.data.eventId === eventId) {
                results.push(current.data);
            }
            current = current.next;
        }
        return results;
    }
    
    // Delete (cancel) by ticket ID - O(n)
    // Doesn't actually remove - sets status to 'cancelled'
    // This preserves booking history
    cancelBooking(ticketId) {
        let current = this.head;
        while (current !== null) {
            if (current.data.ticketId === ticketId) {
                if (current.data.status === 'cancelled') {
                    return { success: false, message: 'Ticket is already cancelled' };
                }
                current.data.status = 'cancelled';
                return { success: true, data: current.data };
            }
            current = current.next;
        }
        return { success: false, message: 'Ticket not found' };
    }
    
    // Restore a cancelled booking (for undo)
    restoreBooking(ticketId) {
        let current = this.head;
        while (current !== null) {
            if (current.data.ticketId === ticketId) {
                current.data.status = 'confirmed';
                return { success: true, data: current.data };
            }
            current = current.next;
        }
        return { success: false, message: 'Ticket not found' };
    }
    
    // Remove node completely (for undo booking)
    removeNode(ticketId) {
        if (this.head === null) return { success: false, message: 'List is empty' };
        
        // If head node is the one to remove
        if (this.head.data.ticketId === ticketId) {
            const removed = this.head.data;
            this.head = this.head.next;
            this.size--;
            return { success: true, data: removed };
        }
        
        // Search in rest of list
        let current = this.head;
        while (current.next !== null) {
            if (current.next.data.ticketId === ticketId) {
                const removed = current.next.data;
                current.next = current.next.next;
                this.size--;
                return { success: true, data: removed };
            }
            current = current.next;
        }
        return { success: false, message: 'Ticket not found' };
    }
    
    // Get all bookings as array - O(n)
    toArray() {
        const result = [];
        let current = this.head;
        while (current !== null) {
            result.push(current.data);
            current = current.next;
        }
        return result;
    }
    
    // Filter by status - O(n)
    filterByStatus(status) {
        const result = [];
        let current = this.head;
        while (current !== null) {
            if (current.data.status === status) {
                result.push(current.data);
            }
            current = current.next;
        }
        return result;
    }
    
    // Get count
    getSize() {
        return this.size;
    }
    
    // Check if empty
    isEmpty() {
        return this.head === null;
    }
    
    // Get confirmed bookings count
    getConfirmedCount() {
        let count = 0;
        let current = this.head;
        while (current !== null) {
            if (current.data.status === 'confirmed') count++;
            current = current.next;
        }
        return count;
    }
    
    // Get total revenue (confirmed bookings)
    getTotalRevenue() {
        let total = 0;
        let current = this.head;
        while (current !== null) {
            if (current.data.status === 'confirmed') {
                total += current.data.price;
            }
            current = current.next;
        }
        return total;
    }
    
    // Load from array (reconstruct linked list from saved data)
    loadFromArray(dataArray) {
        this.head = null;
        this.size = 0;
        // Insert in reverse order so that order is preserved
        for (let i = dataArray.length - 1; i >= 0; i--) {
            this.insertAtBeginning(dataArray[i]);
        }
    }
    
    // Display - for debugging
    display() {
        let current = this.head;
        let output = 'HEAD';
        while (current !== null) {
            output += ` -> [${current.data.ticketId}]`;
            current = current.next;
        }
        output += ' -> NULL';
        console.log(output);
        return output;
    }
}
