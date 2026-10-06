const Analytics = {
    render(eventManager, ticketManager) {
        const container = document.getElementById('analytics-content');
        const events = eventManager.getAllEvents();
        const bookings = ticketManager.getAllBookings();
        
        if (events.length === 0) {
            container.innerHTML = '<div class="empty-state">No events to analyze. Create some events first!</div>';
            return;
        }
        
        let html = '';
        
        // 1. Revenue Summary Cards
        const totalRevenue = ticketManager.getTotalRevenue();
        const confirmedBookings = ticketManager.getConfirmedCount();
        const cancelledBookings = bookings.length - confirmedBookings;
        const avgTicketPrice = confirmedBookings > 0 ? Math.round(totalRevenue / confirmedBookings) : 0;
        
        html += `<div class="stat-grid">
            <div class="stat-card stat-card--success"><div class="stat-icon">💰</div><div class="stat-info"><h3>${Helpers.formatCurrency(totalRevenue)}</h3><p>Total Revenue</p></div></div>
            <div class="stat-card stat-card--primary"><div class="stat-icon">✅</div><div class="stat-info"><h3>${confirmedBookings}</h3><p>Confirmed</p></div></div>
            <div class="stat-card stat-card--danger"><div class="stat-icon">❌</div><div class="stat-info"><h3>${cancelledBookings}</h3><p>Cancelled</p></div></div>
            <div class="stat-card stat-card--info"><div class="stat-icon">💵</div><div class="stat-info"><h3>${Helpers.formatCurrency(avgTicketPrice)}</h3><p>Avg. Ticket Price</p></div></div>
        </div>`;
        
        // 2. Tickets Sold per Event (horizontal bar chart)
        html += '<div class="card mt-24"><div class="card-header"><h3>🎫 Tickets Sold per Event</h3></div><div class="chart-container">';
        const maxSold = Math.max(...events.map(e => {
            const eventBookings = ticketManager.getBookingsByEvent(e.id).filter(b => b.status === 'confirmed');
            return eventBookings.length;
        }), 1);
        events.forEach(e => {
            const eventBookings = ticketManager.getBookingsByEvent(e.id).filter(b => b.status === 'confirmed');
            const sold = eventBookings.length;
            const pct = (sold / maxSold) * 100;
            html += `<div class="bar-row">
                <span class="bar-label">${e.name}</span>
                <div class="bar-track"><div class="bar-fill" style="width:${pct}%; background:${Helpers.getCategoryColor(e.category)}"></div></div>
                <span class="bar-value">${sold}</span>
            </div>`;
        });
        html += '</div></div>';
        
        // 3. Revenue per Event
        html += '<div class="card mt-24"><div class="card-header"><h3>💰 Revenue per Event</h3></div><div class="chart-container">';
        const maxRev = Math.max(...events.map(e => {
            return ticketManager.getBookingsByEvent(e.id).filter(b => b.status === 'confirmed').reduce((s,b) => s + b.price, 0);
        }), 1);
        events.forEach(e => {
            const rev = ticketManager.getBookingsByEvent(e.id).filter(b => b.status === 'confirmed').reduce((s,b) => s + b.price, 0);
            const pct = (rev / maxRev) * 100;
            html += `<div class="bar-row">
                <span class="bar-label">${e.name}</span>
                <div class="bar-track"><div class="bar-fill" style="width:${pct}%; background:${Helpers.getCategoryColor(e.category)}"></div></div>
                <span class="bar-value">${Helpers.formatCurrency(rev)}</span>
            </div>`;
        });
        html += '</div></div>';
        
        // 4. Event Capacity Utilization
        html += '<div class="card mt-24"><div class="card-header"><h3>📊 Event Capacity Utilization</h3></div><div class="chart-container">';
        events.forEach(e => {
            const total = e.tickets.VIP.total + e.tickets.Premium.total + e.tickets.General.total;
            const available = e.tickets.VIP.available + e.tickets.Premium.available + e.tickets.General.available;
            const used = total - available;
            const pct = total > 0 ? Math.round((used / total) * 100) : 0;
            const color = pct > 80 ? '#EF4444' : pct > 50 ? '#F59E0B' : '#10B981';
            html += `<div class="bar-row">
                <span class="bar-label">${e.name}</span>
                <div class="bar-track"><div class="bar-fill" style="width:${pct}%; background:${color}"></div></div>
                <span class="bar-value">${pct}% (${used}/${total})</span>
            </div>`;
        });
        html += '</div></div>';
        
        // 5. Popular Ticket Types
        html += '<div class="card mt-24"><div class="card-header"><h3>🏆 Popular Ticket Types</h3></div><div class="chart-container">';
        const typeColors = { VIP: '#6366F1', Premium: '#F59E0B', General: '#10B981' };
        const confirmedList = bookings.filter(b => b.status === 'confirmed');
        const maxType = Math.max(...TICKET_TYPES.map(t => confirmedList.filter(b => b.ticketType === t).length), 1);
        TICKET_TYPES.forEach(type => {
            const count = confirmedList.filter(b => b.ticketType === type).length;
            const pct = (count / maxType) * 100;
            html += `<div class="bar-row">
                <span class="bar-label">${type}</span>
                <div class="bar-track"><div class="bar-fill" style="width:${pct}%; background:${typeColors[type]}"></div></div>
                <span class="bar-value">${count} tickets</span>
            </div>`;
        });
        html += '</div></div>';
        
        // 6. Booking Status Breakdown
        const totalBookings = bookings.length;
        const confirmedPct = totalBookings > 0 ? Math.round((confirmedBookings/totalBookings)*100) : 0;
        const cancelledPct = totalBookings > 0 ? 100 - confirmedPct : 0;
        html += `<div class="card mt-24"><div class="card-header"><h3>📋 Booking Status Breakdown</h3></div>
            <div class="status-breakdown">
                <div class="status-bar">
                    <div class="status-fill status-fill--confirmed" style="width:${confirmedPct}%"></div>
                    <div class="status-fill status-fill--cancelled" style="width:${cancelledPct}%"></div>
                </div>
                <div class="status-legend">
                    <span class="legend-item"><span class="legend-dot" style="background:#10B981"></span> Confirmed: ${confirmedBookings} (${confirmedPct}%)</span>
                    <span class="legend-item"><span class="legend-dot" style="background:#EF4444"></span> Cancelled: ${cancelledBookings} (${cancelledPct}%)</span>
                </div>
            </div></div>`;
        
        container.innerHTML = html;
    }
};
