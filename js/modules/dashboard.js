const Dashboard = {
    render(eventManager, ticketManager, actionStack) {
        // Update stat cards
        document.getElementById('stat-total-events').textContent = eventManager.getActiveEvents().length;
        document.getElementById('stat-tickets-sold').textContent = ticketManager.getConfirmedCount();
        document.getElementById('stat-available-tickets').textContent = eventManager.store.getTotalAvailableTickets();
        document.getElementById('stat-total-revenue').textContent = Helpers.formatCurrency(ticketManager.getTotalRevenue());
        
        // Render recent bookings (last 5)
        const bookings = ticketManager.getAllBookings().slice(0, 5);
        const tbody = document.getElementById('dashboard-recent-bookings');
        if (bookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No bookings yet. Go to "Book Ticket" to create your first booking!</td></tr>';
        } else {
            tbody.innerHTML = bookings.map(b => `
                <tr>
                    <td><span class="ticket-id-link" onclick="App.viewTicket('${b.ticketId}')">${b.ticketId}</span></td>
                    <td>${b.customerName}</td>
                    <td>${b.eventName}</td>
                    <td><span class="badge badge-${b.ticketType.toLowerCase()}">${b.ticketType}</span></td>
                    <td>${Helpers.formatCurrency(b.price)}</td>
                    <td><span class="badge badge-${b.status}">${b.status}</span></td>
                </tr>
            `).join('');
        }
        
        // Render recent activity (last 5 from stack)
        const activities = actionStack.toArray().slice(0, 5);
        const actDiv = document.getElementById('dashboard-recent-activity');
        if (activities.length === 0) {
            actDiv.innerHTML = '<div class="empty-state">No activity yet</div>';
        } else {
            actDiv.innerHTML = activities.map(a => {
                const icon = this._getActionIcon(a.type);
                return `<div class="activity-item">
                    <span class="activity-icon">${icon}</span>
                    <div class="activity-text">
                        <p>${a.description}</p>
                        <span class="text-muted">${Helpers.getRelativeTime(a.timestamp)}</span>
                    </div>
                </div>`;
            }).join('');
        }
    },
    
    _getActionIcon(type) {
        const icons = {
            'BOOK_TICKET': '🎫',
            'CANCEL_TICKET': '❌',
            'CREATE_EVENT': '🎪',
            'UPDATE_EVENT': '✏️',
            'DELETE_EVENT': '🗑️'
        };
        return icons[type] || '📌';
    }
};
