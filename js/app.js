/*
 * ============================================
 * APP.JS - Main Application Controller
 * ============================================
 * This file ties all data structures and modules together.
 * It handles:
 *   - Initialization
 *   - Navigation between sections
 *   - Event CRUD UI operations
 *   - Booking workflow
 *   - Undo operations
 *   - Notifications
 *   - Confirm dialogs
 */

const App = {
    // Global instances
    eventStore: null,
    bookingList: null,
    actionStack: null,
    eventManager: null,
    ticketManager: null,
    
    // Booking workflow state
    bookingState: {
        currentStep: 1,
        selectedEventId: null,
        selectedTicketType: null,
        lastBookedTicket: null
    },
    
    // Confirm dialog callback
    confirmCallback: null,
    
    // ==========================================
    // INITIALIZATION
    // ==========================================
    init() {
        // Create data structure instances
        this.eventStore = new EventStore();        // ARRAY-based
        this.bookingList = new BookingLinkedList(); // LINKED LIST
        this.actionStack = new ActionStack();       // STACK
        
        // Create manager instances
        this.eventManager = new EventManager(this.eventStore, this.actionStack);
        this.ticketManager = new TicketManager(this.bookingList, this.eventStore, this.actionStack);
        
        // Load saved data from localStorage
        this._loadData();
        
        // Setup event listeners
        this._setupNavigation();
        this._setupEventModal();
        this._setupBookingFlow();
        this._setupFilters();
        this._setupUndo();
        this._setupMobileMenu();
        
        // Populate category dropdowns from CATEGORIES array
        this._populateCategories();
        
        // Render dashboard
        this.renderCurrentSection();
        
        console.log('✅ EventTix initialized successfully!');
        console.log('📊 Events:', this.eventStore.getCount());
        console.log('🎫 Bookings:', this.bookingList.getSize());
        console.log('📚 Actions in stack:', this.actionStack.getSize());
    },
    
    // ==========================================
    // DATA LOADING
    // ==========================================
    _loadData() {
        const savedEvents = StorageManager.loadEvents();
        const savedBookings = StorageManager.loadBookings();
        const savedActions = StorageManager.loadActions();
        
        if (savedEvents && savedEvents.length > 0) {
            this.eventStore.loadFromArray(savedEvents);
        } else {
            // Load sample data on first run
            this.eventManager.loadSampleData();
        }
        
        if (savedBookings && savedBookings.length > 0) {
            this.bookingList.loadFromArray(savedBookings);
        }
        
        if (savedActions && savedActions.length > 0) {
            this.actionStack.loadFromArray(savedActions);
        }
    },
    
    // ==========================================
    // NAVIGATION
    // ==========================================
    _setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const section = item.getAttribute('data-section');
                this.navigateTo(section);
            });
        });
    },
    
    navigateTo(sectionName) {
        // Update nav active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-section') === sectionName);
        });
        
        // Show/hide sections
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });
        const target = document.getElementById('section-' + sectionName);
        if (target) target.classList.add('active');
        
        // Close mobile menu
        document.querySelector('.sidebar').classList.remove('open');
        
        // Render the section content
        this.renderCurrentSection(sectionName);
    },
    
    renderCurrentSection(sectionName) {
        const section = sectionName || this._getActiveSection();
        switch (section) {
            case 'dashboard': Dashboard.render(this.eventManager, this.ticketManager, this.actionStack); break;
            case 'events': this.renderEvents(); break;
            case 'book-ticket': this.renderBookingStep(); break;
            case 'bookings': this.renderBookings(); break;
            case 'analytics': Analytics.render(this.eventManager, this.ticketManager); break;
            case 'activity': this.renderActivity(); break;
        }
    },
    
    _getActiveSection() {
        const active = document.querySelector('.nav-item.active');
        return active ? active.getAttribute('data-section') : 'dashboard';
    },
    
    // ==========================================
    // MOBILE MENU
    // ==========================================
    _setupMobileMenu() {
        const btn = document.getElementById('mobile-menu-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                document.querySelector('.sidebar').classList.toggle('open');
            });
        }
    },
    
    // ==========================================
    // POPULATE CATEGORIES
    // ==========================================
    _populateCategories() {
        // DATA STRUCTURE: ARRAY - Iterating over fixed categories array
        const eventFilter = document.getElementById('event-category-filter');
        const eventInput = document.getElementById('input-event-category');
        
        if (typeof CATEGORIES !== 'undefined') {
            CATEGORIES.forEach(cat => {
                if (eventFilter) {
                    const opt = document.createElement('option');
                    opt.value = cat;
                    opt.textContent = cat;
                    eventFilter.appendChild(opt);
                }
                if (eventInput) {
                    const opt = document.createElement('option');
                    opt.value = cat;
                    opt.textContent = cat;
                    eventInput.appendChild(opt);
                }
            });
        }
    },
    
    // ==========================================
    // EVENTS RENDERING & MANAGEMENT
    // ==========================================
    renderEvents() {
        const searchQuery = document.getElementById('event-search').value;
        const categoryFilter = document.getElementById('event-category-filter').value;
        
        let events;
        if (searchQuery.trim()) {
            events = this.eventManager.searchEvents(searchQuery);
        } else if (categoryFilter && categoryFilter !== 'all') {
            events = this.eventManager.filterByCategory(categoryFilter);
        } else {
            events = this.eventManager.getAllEvents();
        }
        
        const container = document.getElementById('events-container');
        if (events.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>🎪</p><p>No events found</p><p class="text-muted">Try a different search or add a new event</p></div>';
            return;
        }
        
        container.innerHTML = events.map(event => {
            const totalCapacity = event.tickets.VIP.total + event.tickets.Premium.total + event.tickets.General.total;
            const totalAvailable = event.tickets.VIP.available + event.tickets.Premium.available + event.tickets.General.available;
            const soldPct = totalCapacity > 0 ? Math.round(((totalCapacity - totalAvailable) / totalCapacity) * 100) : 0;
            
            return `<div class="event-card">
                <div class="event-card-header">
                    <span class="badge" style="background:${Helpers.getCategoryColor(event.category)}20; color:${Helpers.getCategoryColor(event.category)}">${event.category}</span>
                    <span class="badge badge-${event.status}">${event.status}</span>
                </div>
                <h3 class="event-card-title">${event.name}</h3>
                <p class="event-card-desc text-muted">${event.description || 'No description'}</p>
                <div class="event-card-details">
                    <span>📅 ${Helpers.formatDate(event.date)}</span>
                    <span>🕐 ${Helpers.formatTime(event.time)}</span>
                    <span>📍 ${event.venue}</span>
                </div>
                <div class="event-card-tickets">
                    <div class="ticket-info">
                        <span>🎫 ${totalAvailable}/${totalCapacity} available</span>
                        <div class="mini-progress"><div class="mini-progress-fill" style="width:${soldPct}%"></div></div>
                    </div>
                    <div class="ticket-prices">
                        ${event.tickets.VIP.total > 0 ? '<span class="price-tag">VIP: ' + Helpers.formatCurrency(event.tickets.VIP.price) + '</span>' : ''}
                        ${event.tickets.Premium.total > 0 ? '<span class="price-tag">Premium: ' + Helpers.formatCurrency(event.tickets.Premium.price) + '</span>' : ''}
                        ${event.tickets.General.total > 0 ? '<span class="price-tag">General: ' + Helpers.formatCurrency(event.tickets.General.price) + '</span>' : ''}
                    </div>
                </div>
                <div class="event-card-actions">
                    <button class="btn btn-sm btn-primary" onclick="App.navigateToBookEvent(${event.id})">🎟️ Book</button>
                    <button class="btn btn-sm btn-outline" onclick="App.editEvent(${event.id})">✏️ Edit</button>
                    <button class="btn btn-sm btn-danger-outline" onclick="App.confirmDeleteEvent(${event.id})">🗑️</button>
                </div>
            </div>`;
        }).join('');
    },
    
    _setupFilters() {
        document.getElementById('event-search').addEventListener('input', () => this.renderEvents());
        document.getElementById('event-category-filter').addEventListener('change', () => this.renderEvents());
        document.getElementById('booking-search').addEventListener('input', () => this.renderBookings());
        document.getElementById('booking-status-filter').addEventListener('change', () => this.renderBookings());
    },
    
    // ==========================================
    // EVENT MODAL (Add/Edit)
    // ==========================================
    _setupEventModal() {
        document.getElementById('btn-add-event').addEventListener('click', () => this.openAddEventModal());
        document.getElementById('form-event').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEvent();
        });
    },
    
    openAddEventModal() {
        document.getElementById('modal-event-title').textContent = 'Add New Event';
        document.getElementById('form-event').reset();
        document.getElementById('input-event-id').value = '';
        document.getElementById('modal-event').style.display = 'flex';
    },

    editEvent(id) {
        const event = this.eventManager.getEvent(id);
        if (!event) return;
        document.getElementById('modal-event-title').textContent = 'Edit Event';
        document.getElementById('input-event-id').value = event.id;
        document.getElementById('input-event-name').value = event.name;
        document.getElementById('input-event-description').value = event.description;
        document.getElementById('input-event-category').value = event.category;
        document.getElementById('input-event-venue').value = event.venue;
        document.getElementById('input-event-date').value = event.date;
        document.getElementById('input-event-time').value = event.time;

        document.getElementById('input-vip-price').value = event.tickets.VIP.price;
        document.getElementById('input-vip-capacity').value = event.tickets.VIP.total;
        document.getElementById('input-premium-price').value = event.tickets.Premium.price;
        document.getElementById('input-premium-capacity').value = event.tickets.Premium.total;
        document.getElementById('input-general-price').value = event.tickets.General.price;
        document.getElementById('input-general-capacity').value = event.tickets.General.total;

        document.getElementById('modal-event').style.display = 'flex';
    },

    closeEventModal() {
        document.getElementById('modal-event').style.display = 'none';
        document.getElementById('form-event').reset();
    },

    saveEvent() {
        const id = document.getElementById('input-event-id').value;
        const data = {
            name: document.getElementById('input-event-name').value,
            description: document.getElementById('input-event-description').value,
            category: document.getElementById('input-event-category').value,
            venue: document.getElementById('input-event-venue').value,
            date: document.getElementById('input-event-date').value,
            time: document.getElementById('input-event-time').value,
            tickets: {
                VIP: {
                    price: Number(document.getElementById('input-vip-price').value),
                    total: Number(document.getElementById('input-vip-capacity').value)
                },
                Premium: {
                    price: Number(document.getElementById('input-premium-price').value),
                    total: Number(document.getElementById('input-premium-capacity').value)
                },
                General: {
                    price: Number(document.getElementById('input-general-price').value),
                    total: Number(document.getElementById('input-general-capacity').value)
                }
            }
        };

        const validation = Validator.validateEvent(data);
        if (!validation.valid) {
            this.showNotification(validation.errors.join('<br>'), 'error');
            return;
        }

        if (id) {
            this.eventManager.updateEvent(Number(id), data);
            this.showNotification('Event updated successfully!', 'success');
        } else {
            this.eventManager.createEvent(data);
            this.showNotification('Event created successfully!', 'success');
        }

        this.closeEventModal();
        this.renderEvents();
    },

    confirmDeleteEvent(id) {
        const event = this.eventManager.getEvent(id);
        if (!event) return;
        this.confirmAction(`Are you sure you want to delete "${event.name}"? This action can be undone.`, () => {
            this.eventManager.deleteEvent(id);
            this.showNotification('Event deleted', 'info');
            this.renderEvents();
        });
    },

    // ==========================================
    // BOOKING FLOW
    // ==========================================
    _setupBookingFlow() {
        document.getElementById('btn-confirm-booking').addEventListener('click', () => {
            this.confirmBooking();
        });
    },

    navigateToBookEvent(eventId) {
        this.bookingState.selectedEventId = eventId;
        this.bookingState.currentStep = 2; // Skip step 1 if directly clicking book from an event
        this.navigateTo('book-ticket');
    },

    bookingNextStep() {
        if (this.bookingState.currentStep === 3) {
            const form = document.getElementById('customer-form');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
        }
        this.bookingState.currentStep++;
        this.renderBookingStep();
    },

    bookingPrevStep() {
        this.bookingState.currentStep--;
        this.renderBookingStep();
    },

    resetBooking() {
        this.bookingState = { currentStep: 1, selectedEventId: null, selectedTicketType: null, lastBookedTicket: null };
        document.getElementById('customer-form').reset();
        this.renderBookingStep();
    },

    renderBookingStep() {
        // Update Step UI
        document.querySelectorAll('.step').forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            step.classList.toggle('active', stepNum === this.bookingState.currentStep);
            step.classList.toggle('completed', stepNum < this.bookingState.currentStep);
        });

        document.querySelectorAll('.step-content').forEach(content => {
            content.classList.remove('active');
        });

        if (this.bookingState.currentStep > 4) {
            document.getElementById('step-success').classList.add('active');
            return;
        }

        document.getElementById(`step-${this.bookingState.currentStep}`).classList.add('active');

        switch (this.bookingState.currentStep) {
            case 1: this._renderBookingStep1(); break;
            case 2: this._renderBookingStep2(); break;
            case 3: break; // Form handled natively
            case 4: this._renderBookingSummary(); break;
        }
    },

    _renderBookingStep1() {
        const events = this.eventManager.getActiveEvents();
        const list = document.getElementById('booking-event-list');
        
        if (events.length === 0) {
            list.innerHTML = '<div class="empty-state">No active events available to book.</div>';
            return;
        }

        list.innerHTML = events.map(e => `
            <div class="booking-event-item ${this.bookingState.selectedEventId === e.id ? 'selected' : ''}" 
                 onclick="App.bookingState.selectedEventId = ${e.id}; App.bookingNextStep()">
                <div>
                    <h4>${e.name}</h4>
                    <span class="text-muted">📅 ${Helpers.formatDate(e.date)} | 📍 ${e.venue}</span>
                </div>
                <span class="badge" style="background:${Helpers.getCategoryColor(e.category)}20; color:${Helpers.getCategoryColor(e.category)}">${e.category}</span>
            </div>
        `).join('');
    },

    _renderBookingStep2() {
        if (!this.bookingState.selectedEventId) return;
        const event = this.eventManager.getEvent(this.bookingState.selectedEventId);
        const container = document.getElementById('ticket-type-cards');
        
        container.innerHTML = TICKET_TYPES.map(type => {
            const ticket = event.tickets[type];
            if (ticket.total === 0) return ''; // Not configured for this event

            const disabled = ticket.available === 0;
            const selected = this.bookingState.selectedTicketType === type;

            return `
                <div class="ticket-type-card ${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''}"
                     onclick="${!disabled ? `App.bookingState.selectedTicketType = '${type}'; App.bookingNextStep()` : ''}">
                    <div class="tt-info">
                        <h4>${type}</h4>
                        <p>${ticket.available} / ${ticket.total} available</p>
                    </div>
                    <div class="tt-price">${Helpers.formatCurrency(ticket.price)}</div>
                </div>
            `;
        }).join('');
    },

    _renderBookingSummary() {
        const event = this.eventManager.getEvent(this.bookingState.selectedEventId);
        const type = this.bookingState.selectedTicketType;
        const price = event.tickets[type].price;
        const name = document.getElementById('input-customer-name').value;
        const email = document.getElementById('input-customer-email').value;
        const phone = document.getElementById('input-customer-phone').value;

        const summary = document.getElementById('booking-summary-content');
        summary.innerHTML = `
            <div class="summary-row"><span class="summary-label">Event:</span><span class="summary-val">${event.name}</span></div>
            <div class="summary-row"><span class="summary-label">Date & Time:</span><span class="summary-val">${Helpers.formatDate(event.date)} at ${Helpers.formatTime(event.time)}</span></div>
            <div class="summary-row"><span class="summary-label">Venue:</span><span class="summary-val">${event.venue}</span></div>
            <div class="summary-row"><span class="summary-label">Ticket Type:</span><span class="summary-val badge badge-${type.toLowerCase()}">${type}</span></div>
            <div class="summary-row"><span class="summary-label">Customer Name:</span><span class="summary-val">${name}</span></div>
            <div class="summary-row"><span class="summary-label">Email:</span><span class="summary-val">${email}</span></div>
            <div class="summary-row"><span class="summary-label">Phone:</span><span class="summary-val">${phone}</span></div>
            <div class="summary-row mt-24" style="border-top: 2px solid var(--border); padding-top: 16px;"><span class="summary-label" style="font-size:1.2rem">Total Price:</span><span class="summary-total">${Helpers.formatCurrency(price)}</span></div>
        `;
    },

    confirmBooking() {
        const data = {
            eventId: this.bookingState.selectedEventId,
            ticketType: this.bookingState.selectedTicketType,
            customerName: document.getElementById('input-customer-name').value,
            customerEmail: document.getElementById('input-customer-email').value,
            customerPhone: document.getElementById('input-customer-phone').value
        };

        const result = this.ticketManager.bookTicket(data);
        if (result) {
            this.bookingState.lastBookedTicket = result.ticketId;
            document.getElementById('success-ticket-id').innerHTML = `Ticket ID: <strong>${result.ticketId}</strong>`;
            this.bookingState.currentStep = 5;
            this.renderBookingStep();
            this.showNotification('Ticket booked successfully!', 'success');
        } else {
            this.showNotification('Booking failed. The ticket might be sold out.', 'error');
        }
    },

    // ==========================================
    // BOOKINGS LIST & TICKET VIEW
    // ==========================================
    renderBookings() {
        const searchQuery = document.getElementById('booking-search').value.toLowerCase();
        const statusFilter = document.getElementById('booking-status-filter').value;
        
        let bookings = this.ticketManager.getAllBookings();
        
        // Apply filters
        if (statusFilter !== 'all') {
            bookings = bookings.filter(b => b.status === statusFilter);
        }
        if (searchQuery) {
            bookings = bookings.filter(b => 
                b.ticketId.toLowerCase().includes(searchQuery) || 
                b.customerName.toLowerCase().includes(searchQuery)
            );
        }

        const tbody = document.getElementById('bookings-table-body');
        if (bookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No bookings found matching your criteria.</td></tr>';
            return;
        }

        tbody.innerHTML = bookings.map(b => `
            <tr>
                <td><span class="ticket-id-link" onclick="App.viewTicket('${b.ticketId}')">${b.ticketId}</span></td>
                <td>${b.customerName}</td>
                <td>${b.eventName}</td>
                <td><span class="badge badge-${b.ticketType.toLowerCase()}">${b.ticketType}</span></td>
                <td>${Helpers.formatCurrency(b.price)}</td>
                <td>${Helpers.formatDate(b.bookingDate)}</td>
                <td><span class="badge badge-${b.status}">${b.status}</span></td>
                <td>
                    ${b.status === 'confirmed' ? `<button class="btn btn-sm btn-danger-outline" onclick="App.cancelBooking('${b.ticketId}')">Cancel</button>` : '-'}
                </td>
            </tr>
        `).join('');
    },

    cancelBooking(ticketId) {
        this.confirmAction(`Cancel booking ${ticketId}? This will refund the ticket.`, () => {
            const success = this.ticketManager.cancelTicket(ticketId);
            if (success) {
                this.showNotification('Booking cancelled successfully', 'info');
                this.renderBookings();
            } else {
                this.showNotification('Failed to cancel booking', 'error');
            }
        });
    },

    viewLastTicket() {
        if (this.bookingState.lastBookedTicket) {
            this.viewTicket(this.bookingState.lastBookedTicket);
        }
    },

    viewTicket(ticketId) {
        const booking = this.ticketManager.getBooking(ticketId);
        if (!booking) return;

        const event = this.eventManager.getEvent(booking.eventId);
        const container = document.getElementById('ticket-card');

        container.innerHTML = `
            <div class="ticket-card">
                <div class="ticket-header" style="background: ${Helpers.getCategoryColor(event.category)}">
                    <h2>${event.name}</h2>
                    <span class="ticket-status badge-${booking.status}">${booking.status}</span>
                </div>
                <div class="ticket-body">
                    <div>
                        <div class="ticket-detail">
                            <label>Customer Name</label>
                            <p>${booking.customerName}</p>
                        </div>
                        <div class="ticket-detail">
                            <label>Date & Time</label>
                            <p>${Helpers.formatDate(event.date)} at ${Helpers.formatTime(event.time)}</p>
                        </div>
                        <div class="ticket-detail">
                            <label>Venue</label>
                            <p>${event.venue}</p>
                        </div>
                        <div class="ticket-detail">
                            <label>Ticket Type</label>
                            <p><span class="badge badge-${booking.ticketType.toLowerCase()}">${booking.ticketType}</span> - ${Helpers.formatCurrency(booking.price)}</p>
                        </div>
                    </div>
                    <div>
                        <div class="qr-placeholder">
                            ${Array(25).fill(0).map(() => '<div class="qr-cell"></div>').join('')}
                        </div>
                        <p class="text-center text-muted" style="font-size:0.75rem; margin-top:8px">Scan to check-in</p>
                    </div>
                </div>
                <div class="ticket-footer">
                    <span class="ticket-id">${booking.ticketId}</span>
                </div>
            </div>
        `;
        
        this.navigateTo('ticket-view');
    },

    // ==========================================
    // ACTIVITY & UNDO (STACK DATA STRUCTURE)
    // ==========================================
    _setupUndo() {
        document.getElementById('btn-undo').addEventListener('click', () => this.undoLastAction());
    },

    renderActivity() {
        const actions = this.actionStack.toArray();
        const visual = document.getElementById('activity-stack-visual');
        const list = document.getElementById('activity-list');
        const undoBtn = document.getElementById('btn-undo');
        const sizeBadge = document.getElementById('stack-size-badge');

        sizeBadge.textContent = `Size: ${this.actionStack.getSize()}`;
        
        if (this.actionStack.isEmpty()) {
            visual.innerHTML = '<div class="empty-state">Stack is empty</div>';
            list.innerHTML = '<div class="empty-state">No activity recorded</div>';
            undoBtn.disabled = true;
            return;
        }

        undoBtn.disabled = false;

        // Render Stack Visual (Last In First Out)
        // Array representation: 0 is bottom, length-1 is top.
        // We display them with CSS flex-direction: column-reverse, so last element is on top visually.
        visual.innerHTML = actions.map((a, i) => {
            const isTop = i === 0; // Since toArray reverses it (top is 0)
            return `
                <div class="stack-item ${isTop ? 'top-item' : ''}">
                    <span class="stack-item-info">[${a.type}] ${a.description}</span>
                    ${isTop ? '<span class="badge badge-primary">TOP</span>' : ''}
                </div>
            `;
        }).join('');

        // Render standard log
        list.innerHTML = actions.map(a => `
            <div class="activity-item">
                <span class="activity-icon">${Dashboard._getActionIcon(a.type)}</span>
                <div class="activity-text">
                    <p>${a.description}</p>
                    <span class="text-muted">${Helpers.getRelativeTime(a.timestamp)}</span>
                </div>
            </div>
        `).join('');
    },

    undoLastAction() {
        if (this.actionStack.isEmpty()) return;

        const action = this.actionStack.peek();
        let success = false;

        this.confirmAction(`Undo: ${action.description}?`, () => {
            switch (action.type) {
                case 'CREATE_EVENT':
                    this.eventManager.deleteEvent(action.data.id, true); // true = skip stack push
                    success = true;
                    break;
                case 'DELETE_EVENT':
                    this.eventManager.restoreEvent(action.data, true);
                    success = true;
                    break;
                case 'BOOK_TICKET':
                    this.ticketManager.cancelTicket(action.data.ticketId, true);
                    success = true;
                    break;
                case 'CANCEL_TICKET':
                    this.ticketManager.restoreTicket(action.data.ticketId, true);
                    success = true;
                    break;
                case 'UPDATE_EVENT':
                    this.eventManager.updateEvent(action.data.id, action.data.oldData, true);
                    success = true;
                    break;
            }

            if (success) {
                this.actionStack.pop();
                StorageManager.saveActions(this.actionStack.toArray());
                this.showNotification('Action undone successfully', 'success');
                this.renderActivity();
            }
        });
    },

    // ==========================================
    // UI HELPERS
    // ==========================================
    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        const notif = document.createElement('div');
        notif.className = `notification ${type}`;
        
        const icons = { success: '✅', error: '❌', info: 'ℹ️' };
        
        notif.innerHTML = `
            <span class="notification-icon">${icons[type]}</span>
            <span class="notification-msg">${message}</span>
        `;
        
        container.appendChild(notif);
        
        setTimeout(() => {
            notif.style.animation = 'slideOutRight 0.3s forwards';
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    },

    confirmAction(message, onConfirm) {
        document.getElementById('confirm-message').textContent = message;
        document.getElementById('modal-confirm').style.display = 'flex';
        
        this.confirmCallback = onConfirm;
        
        const yesBtn = document.getElementById('btn-confirm-yes');
        const noBtn = document.getElementById('btn-confirm-no');
        
        const handleYes = () => { cleanup(); if(this.confirmCallback) this.confirmCallback(); };
        const handleNo = () => { cleanup(); };
        
        const cleanup = () => {
            document.getElementById('modal-confirm').style.display = 'none';
            yesBtn.removeEventListener('click', handleYes);
            noBtn.removeEventListener('click', handleNo);
            this.confirmCallback = null;
        };
        
        yesBtn.addEventListener('click', handleYes);
        noBtn.addEventListener('click', handleNo);
    }
};

// Bootstrap the application
window.addEventListener('DOMContentLoaded', () => {
    App.init();
});
