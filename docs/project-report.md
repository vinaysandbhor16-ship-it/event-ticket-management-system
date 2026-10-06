# Project Report

**Project Title:** EventTix - Event Ticket Management System  
**Student Name:** Vinay  
**Course:** Data Science  
**Year:** 2nd Year  

---

## Abstract
The Event Ticket Management System (EventTix) is a web-based application designed to streamline the process of managing events and booking tickets. Developed purely with HTML, CSS, and JavaScript, it serves as a practical demonstration of fundamental data structures. The system utilizes Arrays for fixed event storage, a Singly Linked List for dynamic booking management, and a Stack for activity tracking and undo functionalities. This project aims to showcase how theoretical computer science concepts can be applied to solve real-world problems such as data integrity, efficient memory utilization, and transaction tracking in a client-side environment.

---

## Table of Contents
1. [Chapter 1: Introduction](#chapter-1-introduction)
2. [Chapter 2: Literature Review](#chapter-2-literature-review)
3. [Chapter 3: System Analysis](#chapter-3-system-analysis)
4. [Chapter 4: System Design](#chapter-4-system-design)
5. [Chapter 5: Implementation](#chapter-5-implementation)
6. [Chapter 6: Testing](#chapter-6-testing)
7. [Chapter 7: Results and Discussion](#chapter-7-results-and-discussion)
8. [Chapter 8: Conclusion](#chapter-8-conclusion)
9. [References](#references)
10. [Appendix: Viva Questions and Answers](#appendix-viva-questions-and-answers)

---

## Chapter 1: Introduction

### Background
In the digital age, manual ticket management is highly inefficient. Event organizers need reliable systems to track availability, while users expect a seamless booking experience.

### Problem Statement
Traditional spreadsheet or paper-based systems are prone to human error, double-bookings, and data loss. Furthermore, understanding the sequential flow of actions and reversing mistakes is difficult without a structured approach.

### Objectives
- Build a robust ticket management interface.
- Implement Arrays, Linked Lists, and Stacks without external libraries.
- Ensure data persistence using LocalStorage.
- Provide real-time analytics and dashboard features.

### Scope
The project covers client-side logic for event creation, ticket booking, cancellation, and activity tracking. It does not include backend databases, payment gateways, or multi-user synchronization.

---

## Chapter 2: Literature Review / Background Study

### Data Structures Overview
Data structures are ways of organizing data in computer memory. Arrays provide fast indexed access; Linked Lists offer dynamic size and O(1) insertions at the head; Stacks follow a LIFO principle essential for history tracking.

### Event Management Systems
Modern systems require fast CRUD operations. Using specialized data structures optimizes performance. For example, using a Linked List for unpredictable booking volumes prevents the overhead associated with array resizing.

### Web Technologies
HTML5 structures the content, CSS3 styles it, and ES5+ JavaScript provides the behavioral logic. Using raw vanilla JavaScript reinforces core programming concepts better than abstract frameworks like React or Angular.

---

## Chapter 3: System Analysis

### Functional Requirements
1. The system shall allow creation of events.
2. The system shall limit maximum events to 50.
3. The system shall allow users to select an event and book tickets.
4. The system shall capture user details during booking.
5. The system shall validate form inputs.
6. The system shall generate a unique Booking ID.
7. The system shall allow searching for bookings by ID.
8. The system shall allow booking cancellations.
9. The system shall track user actions in an activity log.
10. The system shall provide an 'Undo' functionality for recent actions.
11. The system shall display statistical data on a dashboard.

### Non-Functional Requirements
1. Fast performance and instantaneous UI updates.
2. Intuitive and responsive design.
3. Data persistence across browser reloads.
4. Clean and well-documented codebase.
5. High reliability in state management.

### System Requirements
- **Software:** Modern web browser (Chrome, Firefox, Edge).
- **Hardware:** Standard PC/Laptop. No specialized hardware required.

### Data Structure Mapping Table
| Application Feature | Data Structure | Reason |
|-------------------|----------------|--------|
| Event Storage | Array | Fast O(1) access by index, predictable max capacity (50). |
| Categories List | Array | Static list that rarely changes. |
| Ticket Types | Array | Quick iteration for dropdown population. |
| Booking Records | Singly Linked List | Dynamic growth, O(1) insertion at head. |
| Activity Log | Stack | Natural LIFO structure for tracking actions. |

---

## Chapter 4: System Design

### Architecture Overview
EventTix uses a 3-tier client-side architecture: UI Layer (HTML/CSS), Business Logic (JS Controllers & Data Structures), and Data Layer (LocalStorage).

### Module Design
- `event-manager.js`: Handles array operations for events.
- `ticket-manager.js`: Handles linked list operations for bookings.
- `stack.js`: Manages the undo stack.
- `app.js`: Main controller routing views and tying modules together.

### Data Flow
User Input -> UI Validation -> Controller -> Data Structure (Insert/Update) -> Stack (Push Action) -> LocalStorage Sync -> UI Update.

### UI Design Description
A Single Page Application (SPA) layout with a sidebar navigation. Distinct sections for Dashboard, Events, Booking, and Logs, which toggle visibility based on navigation.

---

## Chapter 5: Implementation

### Technology Stack Justification
Vanilla JavaScript, HTML, and CSS were chosen to demonstrate core computer science principles without the abstraction of modern frameworks, aligning with the educational goals of a 2nd-year Data Science student.

### Data Structure Implementations
- **Array:** Implemented natively in JS. Used `const events = new Array(50)`.
- **Linked List:** Created custom `Node` and `LinkedList` classes. Employs `insertAtHead` for fast addition of new bookings.
- **Stack:** Created a `Stack` class wrapping an array using only `push`, `pop`, and `peek` methods.

### Key Algorithms Explained
**Search Booking (Linked List Traversal):**
Starts at `head`. While `current != null`, check if `current.data.id == targetId`. If true, return node. Else, `current = current.next`.

### Code Snippets
```javascript
// Stack Push
push(action) {
    this.items.push(action);
}

// Linked List Insert At Head
insertAtHead(data) {
    let newNode = new Node(data);
    newNode.next = this.head;
    this.head = newNode;
}
```

---

## Chapter 6: Testing

### Test Cases
| ID | Test Case | Expected Result | Pass/Fail |
|----|-----------|-----------------|-----------|
| 1 | Create Event | Event added to Array, UI updates | Pass |
| 2 | Exceed 50 Events | System rejects addition | Pass |
| 3 | Book Ticket Valid Data | Booking added to Linked List | Pass |
| 4 | Book Ticket Invalid Input | Validation error displayed | Pass |
| 5 | Search Valid Booking ID | Booking details displayed | Pass |
| 6 | Search Invalid Booking ID | "Not Found" error displayed | Pass |
| 7 | Cancel Booking | Booking status changes to cancelled | Pass |
| 8 | Cancel Already Cancelled | Alert: "Already cancelled" | Pass |
| 9 | Perform Action | Action pushed to Stack/Log | Pass |
| 10| Click Undo | Last action popped from Stack, state reverts | Pass |

### Testing Methodology
Manual black-box testing was performed across UI components, along with unit testing of individual data structure classes via browser console.

---

## Chapter 7: Results and Discussion

### Features Achieved
All core objectives were met. The system successfully utilizes custom data structures to handle data processing, providing a fast, responsive user experience.

### Data Structure Demonstration
The implementation proved that Linked Lists provide efficient O(1) insertions for streams of unpredictable booking data, while Stacks are perfect for LIFO undo mechanisms.

---

## Chapter 8: Conclusion

### Summary
EventTix successfully demonstrates the integration of theoretical data structures into a practical software application, fulfilling all project requirements.

### Limitations
Hardcoded limits (50 events), reliance on LocalStorage (no real database), and lack of multi-user support.

### Future Scope
Implementing Doubly Linked Lists for easier backwards traversal, adding user authentication, and integrating a backend database like MongoDB.

### Learning Outcomes
Enhanced understanding of Arrays, Linked Lists, Stacks, DOM manipulation, state management, and algorithmic complexity in JavaScript.

---

## References
1. Cormen, T. H. et al. "Introduction to Algorithms".
2. MDN Web Docs - JavaScript Arrays, Classes.
3. W3Schools - HTML5 & CSS3 References.

---

## Appendix: Comprehensive Viva Questions and Answers (32 Questions)

### Part 1: Data Structures Concepts (Array, Linked List, Stack)

**Q1: Why did you use an Array for events but a Linked List for bookings?**
*A1:* Events have a fixed upper limit (`MAX_EVENTS = 50`) and need fast indexed access $O(1)$ by Event ID for editing, displaying, and status checks. In contrast, bookings grow dynamically as customers purchase tickets and shrink/change when tickets are cancelled. A Linked List dynamically allocates nodes without wasting pre-allocated contiguous memory or requiring expensive array resizing.

**Q2: Why not use an Array for all bookings instead of a Linked List?**
*A2:* A standard array has a fixed capacity. If we pre-allocate an array of 10,000 slots, memory is wasted if only 10 tickets sell. If we run out of slots, resizing an array requires allocating a new memory block and copying all elements ($O(n)$ overhead). Furthermore, inserting at the front or deleting from the middle of an array requires shifting elements ($O(n)$ time), whereas Linked List head insertion is instantaneous $O(1)$.

**Q3: What is a Singly Linked List, and what are its components?**
*A3:* A Singly Linked List is a linear data structure consisting of nodes. Each node has two parts: `data` (which stores the ticket ID, customer name, price, event details, status) and a `next` pointer/reference pointing to the subsequent node in sequence. The list ends with a `next` value of `null`.

**Q4: Explain the step-by-step algorithm for inserting a booking at the head of the Linked List.**
*A4:*
1. Create a new `TicketNode` containing the booking data.
2. Point the new node's `next` pointer to the current `head` of the list (`newNode.next = this.head`).
3. Update the list `head` pointer to point to the new node (`this.head = newNode`).
4. Increment the list `size` counter by 1.
This operation runs in $O(1)$ constant time.

**Q5: What is the time complexity of searching for a booking in your Singly Linked List?**
*A5:* $O(n)$ linear time. Because elements in a linked list are scattered in memory and accessed via references, we cannot perform random/indexed access or binary search. We must start from the `head` and traverse node-by-node sequentially until the matching ticket ID is found or we reach `null`.

**Q6: What is the difference between physical deletion and logical deletion in your Linked List?**
*A6:* 
- **Logical deletion** (`cancelBooking`): We traverse to the node and simply update `status = 'cancelled'`. The node remains in the list to maintain audit trails and booking history.
- **Physical deletion** (`removeNode`): We bypass the node by adjusting the previous node's pointer (`current.next = current.next.next`) and decrementing `size`. We use physical removal specifically when performing an "Undo" of a newly created booking.

**Q7: What is a Stack, and what operational principle does it follow?**
*A7:* A Stack is a linear data structure that follows the LIFO (Last-In, First-Out) principle. The last element added to the stack is always the first one to be removed.

**Q8: What are the primary operations of a Stack and their time complexities?**
*A8:*
- `push(element)`: Inserts an element at the top — $O(1)$.
- `pop()`: Removes and returns the top element — $O(1)$.
- `peek()`: Inspects the top element without removing it — $O(1)$.
- `isEmpty()`: Checks if the top index is `-1` — $O(1)$.
- `isFull()`: Checks if the top index has reached maximum capacity — $O(1)$.

**Q9: What is Stack Overflow and Stack Underflow? How do you prevent them?**
*A9:*
- **Stack Overflow**: Occurs when trying to `push` onto a stack that is already full (`top === maxSize - 1`). In our code, we handle this gracefully by sliding older actions down or rejecting overflow with a notification.
- **Stack Underflow**: Occurs when trying to `pop` or `peek` from an empty stack (`top === -1`). We prevent this by checking `isEmpty()` before popping and disabling the Undo button in the UI.

**Q10: Why is a Stack the most appropriate data structure for an Undo system?**
*A10:* Because the action a user wants to undo is always their most recent action. Since the last action performed was pushed to the top of the stack, `pop()` retrieves that exact action in $O(1)$ time, allowing its reverse operation to execute immediately.

---

### Part 2: Application Flow & Business Logic

**Q11: What exact steps occur when a ticket is booked?**
*A11:*
1. Input validation checks customer name, email format, and 10-digit phone number.
2. The event is fetched from the `EventStore` array by ID in $O(1)$.
3. We check if `event.tickets[type].available > 0`.
4. A unique ticket ID is generated (e.g., `TKT-10001`).
5. A booking object is created and inserted at the head of `BookingLinkedList` in $O(1)$.
6. The event's available ticket count is decremented in the array.
7. An action record `{ type: 'BOOK_TICKET', data: booking }` is pushed onto `ActionStack`.
8. The updated state is persisted to `localStorage`.

**Q12: What happens when a ticket is cancelled?**
*A12:*
1. User provides or selects a `ticketId`.
2. The linked list is traversed to locate the booking node.
3. If found and not already cancelled, `booking.status` is changed to `'cancelled'`.
4. The corresponding event's ticket capacity is restored (`available++`).
5. A `CANCEL_TICKET` action is pushed onto the stack for undoability.
6. The changes are saved to `localStorage` and the UI table updates dynamically.

**Q13: What happens when a user clicks the "Undo Last Action" button?**
*A13:*
1. We check if the stack is empty. If not, `actionStack.pop()` retrieves the last action.
2. If the action was `BOOK_TICKET`: The booking node is removed from the linked list, and the event's available seat count is incremented back.
3. If the action was `CANCEL_TICKET`: The booking node's status is restored back to `'confirmed'`, and the event's available seat count is decremented.
4. If the action was `DELETE_EVENT`: The event is restored into its original slot in the events array.
5. Storage and UI views refresh immediately.

**Q14: What happens when an event reaches maximum capacity (Sold Out)?**
*A14:*
When `available === 0` for all ticket categories:
- The event card displays a red "Sold Out" badge.
- In the booking wizard, selecting the event or sold-out ticket category is disabled.
- The validator rejects any booking attempts with a friendly error: "No tickets available for this event".

**Q15: How is a unique Ticket ID generated?**
*A15:* We use a persistent sequential counter stored in `localStorage` under `ticketCounter`, starting from `10001`. Each booking reads the counter, prefixes it with `TKT-` (e.g., `TKT-10001`), and increments the counter for the next transaction. This guarantees zero duplicates without needing hash tables.

---

### Part 3: Architecture, Algorithms & Design

**Q16: Why did you choose pure HTML, CSS, and Vanilla JavaScript over frameworks like React or Angular?**
*A16:*
1. Frameworks abstract away underlying data structures (e.g., hiding array operations behind state hooks).
2. Writing pure JavaScript classes allows us to demonstrate custom implementations of `TicketNode`, `BookingLinkedList`, `ActionStack`, and `EventStore` from scratch.
3. It requires zero compilation, zero `node_modules`, and can be demonstrated on any computer by simply opening `index.html`.

**Q17: How is the application structured internally?**
*A17:* We follow a clean 3-tier modular architecture:
- **Presentation Layer**: `index.html` and `css/styles.css` (SPA with section-based routing).
- **Business Logic Layer**: `event-manager.js`, `ticket-manager.js`, `dashboard.js`, `analytics.js`, `validator.js`.
- **Data Structure & Storage Layer**: `array-store.js`, `linked-list.js`, `stack.js`, `storage.js`.

**Q18: How does the application maintain data between browser refreshes?**
*A18:* We use the browser's native `localStorage` API.
- On updates: Arrays and linked lists are converted to JSON and stored under unique keys (`etms_events`, `etms_bookings`, `etms_actions`).
- On app launch: Stored JSON strings are deserialized using `JSON.parse()` and fed into `loadFromArray()` methods that reconstruct the live pointer-based `BookingLinkedList` and `ActionStack` in memory.

**Q19: How does the search algorithm work for events and bookings?**
*A19:*
- **Events**: Linear search iterating over the non-null elements of the `events` array, comparing lowercase query strings against event names, venues, and descriptions.
- **Bookings**: If the query starts with `TKT-`, it performs an exact ticket ID search traversing the linked list. Otherwise, it checks for partial substring matches against customer names.

**Q20: How are the visual analytics generated without external chart libraries like Chart.js?**
*A20:* Pure CSS horizontal bar graphs! We compute the maximum metric (e.g., max tickets sold or max revenue), calculate each event's percentage ratio `(value / maxValue) * 100`, and set the CSS `width: ${percentage}%` on dynamic colored track fill divs.

---

### Part 4: Advanced Scenarios, Complexities & Trade-offs

**Q21: Compare the time complexity of all operations across your 3 data structures.**
*A21:*
| Data Structure | Access | Search | Insertion | Deletion |
| :--- | :--- | :--- | :--- | :--- |
| **Array (`events`)** | $O(1)$ by index | $O(n)$ linear | $O(1)$ at slot | $O(1)$ nullify |
| **Linked List (`bookings`)** | $O(n)$ | $O(n)$ traversal | $O(1)$ at head | $O(n)$ to find + $O(1)$ pointer adjust |
| **Stack (`actions`)** | $O(1)$ at top | $O(n)$ | $O(1)$ push | $O(1)$ pop |

**Q22: What are the space complexities of your data structures?**
*A22:*
- **Array**: $O(N)$ where $N = 50$ (fixed static space allocated upfront).
- **Linked List**: $O(M)$ where $M$ is the number of active bookings (grows dynamically; each node requires memory for data + 1 pointer).
- **Stack**: $O(K)$ where $K = 100$ maximum action items.

**Q23: What is the downside of using a Singly Linked List compared to a Doubly Linked List?**
*A23:* In a Singly Linked List, each node only points forward (`next`). To delete a node, we must keep track of the preceding node during traversal. In a Doubly Linked List, every node has both `prev` and `next` pointers, allowing bi-directional traversal and easier node deletion given only a node reference.

**Q24: Can we use Binary Search on your Linked List? Why or why not?**
*A24:* No. Binary Search requires $O(1)$ random access to find the middle element in each step. In a Singly Linked List, finding the middle element takes $O(n/2) = O(n)$ traversal, which defeats the purpose of Binary Search.

**Q25: What is the QR code on the ticket? Is it cryptographically signed?**
*A25:* It is a visual representation generated deterministically via CSS grid using the characters of the unique ticket ID. It demonstrates ticket styling and UI verification layout suitable for a 2nd-year academic project without relying on paid or heavy external QR APIs.

---

### Part 5: Limitations, Testing & Future Enhancements

**Q26: How did you test your data structure implementations?**
*A26:* We created a dedicated automated test suite in `tests/test-data-structures.html` that executes unit tests for `EventStore`, `BookingLinkedList`, and `ActionStack`, validating edge cases such as empty lists, stack overflow/underflow, head-node deletions, and revenue calculation filters.

**Q27: What happens if two users try to book the last available ticket at the exact same millisecond?**
*A27:* In this client-side architecture, operations run in a single-threaded JavaScript event loop per browser session. In a multi-user enterprise deployment, race conditions would be handled at the backend database level using transactions or atomic decrements (`UPDATE events SET available = available - 1 WHERE available > 0`).

**Q28: What are the current limitations of this project?**
*A28:*
1. Data is stored locally in the browser's `localStorage` rather than a centralized cloud database.
2. Single-user administrative context (no role-based authentication).
3. Fixed maximum limit of 50 events in the primary array store.

**Q29: How could you enhance this project in your 3rd year or for a final year project?**
*A29:*
1. Add a backend (Node.js/Express or Python FastAPI) with a relational database (PostgreSQL) or NoSQL (MongoDB).
2. Upgrade the Singly Linked List to a Doubly Linked List with LRU caching for high-speed ticket lookups.
3. Introduce JWT authentication for separate Admin and Customer roles.
4. Integrate real payment gateways (Stripe/Razorpay) and send PDF tickets via email.

**Q30: What is the most important lesson you learned building this system?**
*A30:* The right data structure must match the problem's access pattern: Arrays for fixed indexed storage, Linked Lists for dynamic sequential allocations, and Stacks for state reversal. Theory and practical code must work hand-in-hand.

**Q31: If you had to support 100,000 bookings and fast searches by Ticket ID, what data structure would you use?**
*A31:* A Hash Table (or Hash Map) which gives $O(1)$ average time complexity for lookups, or a Balanced Binary Search Tree (like an AVL or Red-Black Tree) providing $O(\log n)$ guaranteed lookup time.

**Q32: Explain what Single Page Application (SPA) means in the context of this project.**
*A32:* In an SPA, the entire application loads through a single HTML document (`index.html`). Navigation between Dashboard, Events, Booking, and Analytics does not refresh or reload the page; instead, JavaScript dynamically shows/hides sections and re-renders the DOM in real time, delivering a fast, desktop-like app experience.

