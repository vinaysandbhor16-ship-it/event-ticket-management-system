# 🎫 EventTix - Event Ticket Management System

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg?style=for-the-badge)

A pure frontend application demonstrating the practical application of essential Data Structures (Arrays, Linked Lists, Stacks) for managing events and ticket bookings.

## 📑 Table of Contents

- [Problem Statement](#-problem-statement)
- [Proposed Solution](#-proposed-solution)
- [Objectives](#-objectives)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Data Structures Used](#-data-structures-used)
- [System Architecture](#-system-architecture)
- [Application Workflow](#-application-workflow)
- [Screenshots](#-screenshots)
- [Installation Instructions](#-installation-instructions)
- [How to Run](#-how-to-run)
- [Sample Usage](#-sample-usage)
- [Project Structure](#-project-structure)
- [Data Structure Mapping Table](#-data-structure-mapping-table)
- [Future Improvements](#-future-improvements)
- [Limitations](#-limitations)
- [Learning Outcomes](#-learning-outcomes)
- [Contributors](#-contributors)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

## 🚨 Problem Statement

Manual event and ticket management processes are often prone to errors, slow, and lack proper activity tracking. Managing available spots, preventing double bookings, and understanding how different actions affect the system state can be complex without a reliable, structured approach.

## 💡 Proposed Solution

EventTix provides a streamlined, digital solution that ensures data integrity and operational efficiency. By leveraging specific data structures for distinct tasks, it guarantees fast event retrieval, dynamic booking management, and a robust undo system.

## 🎯 Objectives

1. Demonstrate practical implementation of Data Structures in a real-world scenario.
2. Develop a completely client-side application without external dependencies.
3. Showcase efficient data manipulation techniques (CRUD operations).
4. Implement dynamic memory-like management using Linked Lists for bookings.
5. Provide a safe operational environment using Stacks for tracking actions.
6. Create an intuitive user interface for managing events and tickets.
7. Offer comprehensive analytics to visualize system data.

## ✨ Features

- 📊 **Dashboard:** Real-time stats (Total Events, Tickets Sold, Available Tickets, Revenue).
- 📅 **Event Management:** Create, Read, Update, Delete events (Categories: Tech, Cultural, Sports, Music, Comedy, Academic).
- 🎟️ **Ticket Booking Workflow:** 4-step wizard (Select Event → Select Type → Enter Details → Confirm).
- 📋 **Booking Management:** View, Search, Cancel bookings.
- 📱 **Professional Ticket Display:** Includes a QR placeholder.
- 📈 **Analytics:** Revenue per event, Tickets sold, Capacity utilization, Popular types.
- 🔄 **Activity Log:** Stack visualization with Undo feature.
- 🔍 **Search and Filter:** Events by name/category, bookings by ID/name/status.
- 🛡️ **Input Validation:** Ensures data integrity.

## 💻 Technology Stack

- **HTML5:** Semantic structure and layout.
- **CSS3:** Custom styling, flexbox/grid layouts, responsive design.
- **JavaScript (ES5+):** Core logic, DOM manipulation, data structure implementations.
- **LocalStorage:** Persistent data storage across sessions.

## 🧱 Data Structures Used

### 1. Array
Arrays are used for fixed-size collections and fast indexed access.
- **Implementation:** Used for storing events `events[MAX_EVENTS]`, predefined categories, and ticket types.
- **Code Snippet:**
```javascript
const MAX_EVENTS = 50;
let events = new Array(MAX_EVENTS);
```

### 2. Singly Linked List
Dynamic collection used for managing ticket bookings.
- **Implementation:** Handles unpredictable volume of bookings efficiently. Insertions happen at the head.
- **Diagram:**
```text
HEAD -> [Booking 1 | next] -> [Booking 2 | next] -> NULL
```

### 3. Stack
LIFO (Last-In-First-Out) structure for activity tracking.
- **Implementation:** Array-based stack tracks user actions (e.g., booking a ticket, creating an event) to allow for 'Undo' operations.
- **Diagram:**
```text
| Action 3 (Undo-able) |  <- TOP
| Action 2             |
| Action 1             |
------------------------
```

## 🏗️ System Architecture

The application follows a client-side MVC-like pattern:
- **Model (Data Structures & Storage):** Manages data via Array, Linked List, Stack, and syncs with `localStorage`.
- **View (DOM):** Renders HTML sections dynamically based on the state.
- **Controller (Logic):** Handles user interactions, updates models, and refreshes views.

## 🔄 Application Workflow

1. User opens the application (loads data from `localStorage`).
2. Dashboard displays current statistics.
3. User navigates to Events to add a new event (saved in Array, action pushed to Stack).
4. User books a ticket (added to Linked List, action pushed to Stack).
5. User can view analytics or undo the last action.

## 📸 Screenshots

*Screenshots will be added soon*

## 🚀 Installation Instructions

1. Clone the repository: `git clone https://github.com/yourusername/eventtix.git`
2. Navigate to the project directory: `cd eventtix`
3. Open `index.html` in your favorite web browser.

## 🏃 How to Run

No server is required. Just double-click `index.html` or serve it using a simple local server (e.g., Live Server extension in VS Code).

## 🛠️ Sample Usage

1. Go to "Events" and click "Add Event". Fill in details.
2. Go to "Book Ticket", select the event, enter guest details, and confirm.
3. Check "Dashboard" to see updated revenue and ticket counts.
4. Go to "Activity Log" to see the actions recorded.

## 📂 Project Structure

```text
event-ticket-management-system/
│
├── index.html                      # Main Single Page Application
├── README.md                       # Repository overview & setup guide
├── LICENSE                         # MIT License
├── .gitignore                      # Git ignored files
│
├── css/
│   └── styles.css                  # Professional dashboard & component styles
│
├── js/
│   ├── app.js                      # Central Application Controller & SPA router
│   ├── data-structures/
│   │   ├── array-store.js          # Fixed-size Array store for Events [Array DS]
│   │   ├── linked-list.js          # Singly Linked List for Bookings [Linked List DS]
│   │   └── stack.js                # LIFO Action Stack for Undo operations [Stack DS]
│   ├── modules/
│   │   ├── event-manager.js        # Event CRUD operations
│   │   ├── ticket-manager.js       # Ticket booking, cancellations & lookups
│   │   ├── dashboard.js            # Dashboard rendering & stat computations
│   │   ├── analytics.js            # Pure CSS charts & capacity utilization
│   │   └── validator.js            # Input validation & error prevention
│   └── utils/
│       ├── helpers.js              # ID generator, formatters, constants
│       └── storage.js              # LocalStorage persistence manager
│
├── data/
│   └── sample-data.json            # Pre-configured demo events
│
├── docs/
│   ├── architecture.md             # System design & component breakdown
│   ├── data-structures.md          # In-depth algorithmic explanation & complexity
│   ├── flowcharts.md               # Mermaid diagrams for workflows
│   └── project-report.md           # Full academic project report with 32 Viva Q&As
│
├── screenshots/                    # UI screenshots for portfolio
│
└── tests/
    └── test-data-structures.html   # Browser-based automated unit test suite
```


## 🗺️ Data Structure Mapping Table

| Application Feature | Data Structure | Reason |
|-------------------|----------------|--------|
| Event Storage | Array | Fast O(1) access by index, predictable max capacity. |
| Categories List | Array | Static list that rarely changes. |
| Ticket Types | Array | Quick iteration for dropdown population. |
| Booking Records | Singly Linked List | Dynamic growth, O(1) insertion at head. |
| Activity Log | Stack | Natural LIFO structure for tracking actions. |
| Undo Functionality | Stack | Popping last action easily reverts state. |
| Dashboard Stats | Array/Variables | O(1) reads for displaying metrics. |
| Cancelled Bookings| Linked List Node | Logical deletion (flag change) without shifting elements. |

## 🔮 Future Improvements

1. Implement Doubly Linked List for bidirectional booking traversal.
2. Add a priority queue for VIP ticket processing.
3. Integrate user authentication.
4. Implement a hash map for faster event/booking lookups by ID.
5. Export data to CSV/PDF.
6. Add dark mode UI.
7. Integrate a real database (e.g., Firebase, MongoDB).

## ⚠️ Limitations

1. Maximum event limit is hardcoded (50).
2. Data is bound to the specific browser/device (localStorage).
3. No real-time collaboration (multi-user).
4. Synchronous operations might block UI on extremely large datasets.
5. Search operations on linked list take O(n) time.

## 📚 Learning Outcomes

1. Deep understanding of Array, Linked List, and Stack operations.
2. Practical experience implementing custom data structures in JS.
3. Knowledge of state management in a vanilla frontend application.
4. Understanding of DOM manipulation without frameworks.
5. Familiarity with LocalStorage for data persistence.
6. Ability to design algorithms for searching and filtering collections.
7. Experience in structuring a moderately complex web application.

## 👥 Contributors

- **Vinay** - *2nd-year Data Science student* - Developer

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Course instructors and peers for feedback.
- Open-source community for UI/UX inspiration.
