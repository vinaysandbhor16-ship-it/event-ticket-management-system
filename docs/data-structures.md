# Data Structures Documentation

## 1. Introduction
This project intentionally implements three fundamental data structures—Array, Singly Linked List, and Stack—to demonstrate their practical applications in managing events, bookings, and user actions. Each was chosen to solve a specific problem efficiently.

---

## 2. ARRAY

### Definition
An array is a collection of items stored at contiguous memory locations. It is a fixed-size data structure.

### Properties
- Fixed size upon initialization.
- Indexed access (0-based indexing).
- Fast O(1) random access.

### How it's used in the project
- `events[MAX_EVENTS]`: Used as a fixed storage array for up to 50 events.
- `CATEGORIES[]`: A static array holding event categories.
- `TICKET_TYPES[]`: A static array holding ticket type options.
- Stack Internal Storage: The underlying structure used to implement the Stack.

### Advantages for our use case
Perfect for storing predefined static lists (categories, types) and providing rapid O(1) access to events when the ID or index is known. 

### Limitations
Fixed size means it cannot dynamically grow without reallocation. Inserting or deleting elements in the middle requires shifting elements, which takes O(n) time.

### Code Example
```javascript
const MAX_EVENTS = 50;
let events = new Array(MAX_EVENTS);
events[0] = { id: 1, name: "Tech Conference" }; // O(1) assignment
```

### Time Complexity
| Operation | Complexity |
|-----------|------------|
| Access    | O(1)       |
| Search    | O(n)       |
| Insert    | O(n)       |
| Delete    | O(n)       |

---

## 3. SINGLY LINKED LIST

### Definition
A linear data structure consisting of nodes where each node contains data and a reference (pointer) to the next node in the sequence.

### Properties
- Dynamic size.
- Non-contiguous memory allocation.
- Sequential access (traversal from the head).

### Node Structure
```
[ Data | Next ] -> [ Data | Next ] -> NULL
```

### How it's used
- `BookingLinkedList`: Manages ticket booking records.
- **Insertion**: New bookings are inserted at the head (O(1)).
- **Search**: Traversing the list to find a booking by ID.
- **Deletion**: Logical deletion involves updating a status flag on the node, rather than physical removal, maintaining the audit trail.

### Why Linked List is better than Array for Bookings
| Feature | Array | Linked List |
|---------|-------|-------------|
| Size    | Fixed | Dynamic |
| Insertion at start | O(n) (shifting needed) | O(1) |
| Memory Usage | Pre-allocated (may waste space) | Allocated per node (overhead for pointers) |

For an unpredictable number of bookings where recent bookings are often accessed first, inserting at the head of a linked list is highly efficient.

### Code Example
```javascript
class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}
class LinkedList {
    insertAtHead(data) {
        let newNode = new Node(data);
        newNode.next = this.head;
        this.head = newNode;
    }
}
```

### Time Complexity
| Operation | Complexity |
|-----------|------------|
| Access    | O(n)       |
| Search    | O(n)       |
| Insert (Head) | O(1)       |
| Delete    | O(n)       |

### Visual Diagram
```text
INSERT AT HEAD:
NewNode -> CurrentHead -> Node2 -> NULL

DELETE (Logical):
[Data(active)|Next] -> [Data(cancelled)|Next] -> NULL
```

---

## 4. STACK

### Definition
A linear data structure that follows a particular order in which operations are performed.

### Principle
**LIFO** (Last In, First Out). The last element added is the first one removed.

### How it's used
- `ActionStack`: Tracks user activities (e.g., adding an event, booking a ticket).
- **Push**: Triggered on every user action to save the state/action details.
- **Pop**: Triggered when the user clicks 'Undo', reverting the last recorded action.
- **Peek**: Used to view the most recent action without removing it.

### Implementation Details
Implemented using a JavaScript Array with constrained methods (`push`, `pop`, `peek`) to enforce stack rules.

### Code Example
```javascript
class Stack {
    constructor() {
        this.items = [];
    }
    push(element) {
        this.items.push(element);
    }
    pop() {
        if(this.isEmpty()) return "Underflow";
        return this.items.pop();
    }
    peek() {
        return this.items[this.items.length - 1];
    }
}
```

### Time Complexity
| Operation | Complexity |
|-----------|------------|
| Push      | O(1)       |
| Pop       | O(1)       |
| Peek      | O(1)       |

### Visual Diagram
```text
PUSH Operation:
| Action 2 |  <- Top
| Action 1 |
------------

POP Operation: (Removes Action 2)
| Action 1 |  <- Top
------------
```

---

## 5. Data Structure Comparison Table

| Feature | Array | Linked List | Stack |
|---------|-------|-------------|-------|
| **Access** | O(1) | O(n) | O(1) for top |
| **Search** | O(n) | O(n) | O(n) |
| **Insert** | O(n) | O(1) at head | O(1) push |
| **Delete** | O(n) | O(n) (O(1) if node known) | O(1) pop |
| **Memory** | Contiguous | Scattered | Contiguous (Array-based) |
| **Use Case** | Fast indexing, fixed sizes | Dynamic data, frequent insertions | Undo mechanisms, history tracking |

---

## 6. Data Structure Mapping Table

| Application Feature | Data Structure | Reason |
|-------------------|----------------|--------|
| Event Storage | Array | Fast O(1) access by index, predictable max capacity (50). |
| Categories List | Array | Static, predefined list that rarely changes. |
| Ticket Types | Array | Quick iteration for UI population. |
| Booking Records | Singly Linked List | Dynamic growth, O(1) insertion at the head. |
| Recent Bookings View| Singly Linked List | Naturally ordered from newest to oldest by inserting at head. |
| Activity Log | Stack | Natural LIFO structure for tracking sequential actions. |
| Undo Functionality | Stack | Popping the last action easily reverts the system state. |
| Dashboard Stats | Variables/Array| O(1) reads for displaying real-time metrics. |
| Cancelled Bookings| Linked List Node | Logical deletion (status flag change) avoids O(n) shifting. |
