# System Architecture

## Overview
EventTix uses a clean 3-tier architecture to separate concerns, implemented entirely on the client side using pure JavaScript.

## High-Level Architecture (3-Tier)
1. **UI Layer (Presentation):** HTML and CSS provide the visual interface. DOM events trigger application logic.
2. **Business Logic Layer (Controllers & DS):** Core application rules, validations, and custom Data Structures (Array, Linked List, Stack).
3. **Data Layer (Storage):** LocalStorage API ensures data persists between sessions.

## Component Diagram
```
[ User Interface ]
      |
(DOM Events)
      v
[ App Controller ] <-----> [ Module Managers ]
      |                      (Event, Ticket, Analytics)
      v
[ Data Structures ] <----> [ Storage Manager ]
 (Array, LL, Stack)              |
      |                          v
      +------------------> [ LocalStorage ]
```

## Module Descriptions
- **helpers.js:** Utility functions for DOM manipulation, formatting, and common tasks.
- **storage.js:** Wrapper around LocalStorage to save and retrieve complex objects seamlessly.
- **array-store.js:** Manages the fixed-size array implementation for events.
- **linked-list.js:** Implements the Singly Linked List for managing ticket bookings.
- **stack.js:** Implements the Stack for tracking user actions (undo functionality).
- **validator.js:** Validates forms and inputs before processing.
- **event-manager.js:** Handles CRUD operations for events.
- **ticket-manager.js:** Manages the booking workflow and ticket processing.
- **dashboard.js:** Updates dashboard statistics.
- **analytics.js:** Calculates and renders analytics data.
- **app.js:** Entry point, handles routing and initializes modules.

## Data Flow
1. User clicks "Book Ticket".
2. `app.js` routes to the booking view.
3. User submits form; `validator.js` checks data.
4. `ticket-manager.js` processes valid data.
5. New booking node is created and inserted via `linked-list.js`.
6. Action is logged in `stack.js`.
7. `storage.js` syncs data structures to LocalStorage.
8. UI updates to show success message and new stats.

## Storage Architecture
Data is serialized to JSON and stored in LocalStorage. Upon application load, data is deserialized and used to reconstruct the respective Data Structure instances in memory.

## Navigation Architecture
The application behaves as a Single Page Application (SPA). Section-based routing is used where different sections (`<section id="dashboard">`, etc.) are shown or hidden based on navigation clicks, providing a seamless user experience.
