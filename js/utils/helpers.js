/**
 * File: js/utils/helpers.js
 * Purpose: Global utility functions and constants
 * Author: Vinay
 * Project: Event Ticket Management System
 * Data Structure: ARRAY
 */

// ============================================
// DATA STRUCTURE: ARRAY
// Used here for: Fixed categories and types
// ============================================
const MAX_EVENTS = 50;
const MAX_ACTIONS = 100;
const CATEGORIES = ['Tech', 'Cultural', 'Sports', 'Music', 'Comedy', 'Academic'];
const TICKET_TYPES = ['VIP', 'Premium', 'General'];
const CATEGORY_COLORS = {
    'Tech': '#6366F1',
    'Cultural': '#EC4899',
    'Sports': '#10B981',
    'Music': '#F59E0B',
    'Comedy': '#8B5CF6',
    'Academic': '#3B82F6'
};

const Helpers = {
    generateTicketId() {
        let counter = parseInt(localStorage.getItem('ticketCounter') || '10000');
        counter++;
        localStorage.setItem('ticketCounter', counter);
        return 'TKT-' + counter;
    },
    
    generateEventId() {
        let counter = parseInt(localStorage.getItem('eventCounter') || '0');
        counter++;
        localStorage.setItem('eventCounter', counter);
        return counter;
    },
    
    formatDate(dateStr) {
        if (!dateStr) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
    },
    
    formatTime(timeStr) {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedHours = h % 12 || 12;
        return `${formattedHours}:${minutes} ${ampm}`;
    },
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    },
    
    getCurrentDateTime() {
        return new Date().toISOString();
    },
    
    getRelativeTime(isoDate) {
        if (!isoDate) return '';
        const now = new Date();
        const date = new Date(isoDate);
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'just now';
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} days ago`;
    },
    
    getCategoryColor(category) {
        return CATEGORY_COLORS[category] || '#9CA3AF';
    }
};
