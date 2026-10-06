/**
 * File: js/data-structures/stack.js
 * Purpose: Stack implementation for undo/activity tracking
 * Author: Vinay
 * Project: Event Ticket Management System
 * Data Structure: STACK
 */

/*
 * ============================================
 * DATA STRUCTURE: STACK (Array-based)
 * ============================================
 * Used for: Activity tracking and Undo operations
 * 
 * Why Stack?
 * - Actions follow LIFO (Last In, First Out) principle
 * - The most recent action should be undone first
 * - Push when action is performed, Pop to undo
 * - Peek to see last action without removing
 * 
 * Implementation: Array-based with top pointer
 *   BOTTOM [action1, action2, action3, ...] TOP
 *         top pointer →                    ↑
 */

class ActionStack {
    constructor(maxSize = MAX_ACTIONS) {
        // DATA STRUCTURE: ARRAY used as underlying storage for stack
        this.items = new Array(maxSize);
        this.top = -1;          // -1 means stack is empty
        this.maxSize = maxSize;
    }
    
    // PUSH - Add action to top of stack - O(1)
    push(action) {
        if (this.isFull()) {
            // Stack overflow - shift all items down and make room
            // (In a real system, we'd just discard oldest)
            for (let i = 0; i < this.maxSize - 1; i++) {
                this.items[i] = this.items[i + 1];
            }
            this.top = this.maxSize - 2;
        }
        this.top++;
        this.items[this.top] = action;
        return true;
    }
    
    // POP - Remove and return top action - O(1)
    pop() {
        if (this.isEmpty()) {
            return null;
        }
        const action = this.items[this.top];
        this.items[this.top] = undefined;
        this.top--;
        return action;
    }
    
    // PEEK - View top action without removing - O(1)
    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.top];
    }
    
    // Check if stack is empty
    isEmpty() {
        return this.top === -1;
    }
    
    // Check if stack is full
    isFull() {
        return this.top === this.maxSize - 1;
    }
    
    // Get current size
    getSize() {
        return this.top + 1;
    }
    
    // Get all items as array (from top to bottom for display)
    toArray() {
        const result = [];
        for (let i = this.top; i >= 0; i--) {
            result.push(this.items[i]);
        }
        return result;
    }
    
    // Display stack contents
    display() {
        console.log('--- Stack (Top to Bottom) ---');
        for (let i = this.top; i >= 0; i--) {
            console.log(`[${i}] ${this.items[i].description}`);
        }
        console.log('--- Bottom ---');
    }
    
    // Clear the stack
    clear() {
        this.items = new Array(this.maxSize);
        this.top = -1;
    }
    
    // Load from array (reconstruct stack)
    loadFromArray(dataArray) {
        this.clear();
        for (let i = 0; i < dataArray.length && i < this.maxSize; i++) {
            this.push(dataArray[i]);
        }
    }
}
