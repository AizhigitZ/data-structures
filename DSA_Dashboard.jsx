import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────── GLOBAL STYLES ─────────────────────────── */
const G = {
  bg: "#020510",
  panel: "rgba(6,12,28,0.85)",
  panelSolid: "#060c1c",
  border: "#0d1a30",
  borderHi: "#172540",
  text: "#d4e5ff",
  muted: "#2a4268",
  mutedHi: "#3a5888",
  dim: "#080f1e",
  font: "'Inter', 'JetBrains Mono', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
  radius: 12,
  glow: (c, s = 18) => `0 0 ${s}px ${c}40, 0 0 ${s * 2}px ${c}15`,
};

const topics = [
  { id: "searching", label: "Searching", icon: "🔍", color: "#38bdf8" },
  { id: "sorting", label: "Sorting", icon: "↕", color: "#fb923c" },
  { id: "stack", label: "Stack", icon: "⊞", color: "#c084fc" },
  { id: "linkedlist", label: "Linked List", icon: "⬡", color: "#34d399" },
  { id: "hash", label: "Hash Function", icon: "#", color: "#fbbf24" },
  { id: "queue", label: "Queue", icon: "⇒", color: "#f472b6" },
];

/* ─────────────────────────── PYTHON CODE SNIPPETS ─────────────────────────── */
const PY = {
  linear_search: `def linear_search(arr, target):
    """
    Linear Search — O(n) time, O(1) space
    Checks each element one by one until found.
    Works on both sorted and unsorted arrays.
    """
    for index, value in enumerate(arr):
        if value == target:
            return index   # Found! Return position
    return -1              # Not found

# ── Example ──────────────────────────────────
arr = [3, 7, 11, 15, 21, 28, 34, 42]
result = linear_search(arr, 28)
print(f"Found at index: {result}")   # → 5

result2 = linear_search(arr, 99)
print(f"Search result: {result2}")   # → -1 (not found)`,

  binary_search: `def binary_search(arr, target):
    """
    Binary Search — O(log n) time, O(1) space
    Array MUST be sorted first!
    Halves the search space on every iteration.
    """
    low, high = 0, len(arr) - 1

    while low <= high:
        mid = (low + high) // 2      # Find middle index

        if arr[mid] == target:
            return mid               # ✓ Found!
        elif arr[mid] < target:
            low = mid + 1            # Target is in right half
        else:
            high = mid - 1           # Target is in left half

    return -1                        # Not found

# ── Recursive version ────────────────────────
def binary_search_recursive(arr, target, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low > high:
        return -1                    # Base case: not found
    mid = (low + high) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, high)
    else:
        return binary_search_recursive(arr, target, low, mid - 1)

# ── Example ──────────────────────────────────
arr = [3, 7, 11, 15, 21, 28, 34, 42]
print(binary_search(arr, 28))            # → 5
print(binary_search_recursive(arr, 28)) # → 5`,

  bubble_sort: `def bubble_sort(arr):
    """
    Bubble Sort — O(n²) avg/worst, O(n) best, O(1) space
    Repeatedly swaps adjacent out-of-order elements.
    Larger elements 'bubble up' to the end each pass.
    """
    n = len(arr)
    for i in range(n):
        swapped = False
        # Last i elements are already in place
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        # Early exit: if no swaps, array is already sorted
        if not swapped:
            break
    return arr

# ── Example ──────────────────────────────────
arr = [64, 34, 25, 12, 22, 11, 90]
print(bubble_sort(arr))
# → [11, 12, 22, 25, 34, 64, 90]`,

  selection_sort: `def selection_sort(arr):
    """
    Selection Sort — O(n²) time, O(1) space
    Finds the minimum element and moves it to the front.
    Makes at most n swaps — useful when writes are costly.
    """
    n = len(arr)
    for i in range(n):
        min_idx = i                  # Assume current pos is minimum

        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j          # Found a smaller element

        # Swap minimum element with current position
        arr[i], arr[min_idx] = arr[min_idx], arr[i]

    return arr

# ── Example ──────────────────────────────────
arr = [64, 34, 25, 12, 22, 11, 90]
print(selection_sort(arr))
# → [11, 12, 22, 25, 34, 64, 90]`,

  insertion_sort: `def insertion_sort(arr):
    """
    Insertion Sort — O(n²) avg/worst, O(n) best, O(1) space
    Builds a sorted portion from left to right.
    Each new element is inserted into its correct position.
    Efficient for nearly-sorted data and small arrays.
    """
    for i in range(1, len(arr)):
        key = arr[i]                 # Element to be inserted
        j = i - 1

        # Shift elements greater than key one position right
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1

        arr[j + 1] = key             # Insert key in correct spot

    return arr

# ── Example ──────────────────────────────────
arr = [64, 34, 25, 12, 22, 11, 90]
print(insertion_sort(arr))
# → [11, 12, 22, 25, 34, 64, 90]`,

  merge_sort: `def merge_sort(arr):
    """
    Merge Sort — O(n log n) time, O(n) space
    Divide & Conquer strategy:
      1. Split array in half recursively
      2. Sort each half
      3. Merge sorted halves back together
    Stable sort — preserves relative order of equal elements.
    """
    if len(arr) <= 1:
        return arr                   # Base case

    mid = len(arr) // 2
    left  = merge_sort(arr[:mid])    # Sort left half
    right = merge_sort(arr[mid:])    # Sort right half

    return merge(left, right)        # Merge sorted halves

def merge(left, right):
    """Merge two sorted arrays into one sorted array."""
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1

    # Append any remaining elements
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# ── Example ──────────────────────────────────
arr = [64, 34, 25, 12, 22, 11, 90]
print(merge_sort(arr))
# → [11, 12, 22, 25, 34, 64, 90]`,

  counting_sort: `def counting_sort(arr):
    """
    Counting Sort — O(n + k) time, O(k) space
    Non-comparative sorting algorithm.
    Best used when k (max value) is not much larger than n.
    Cannot sort negative numbers in basic form.
    """
    if not arr:
        return arr

    max_val = max(arr)
    # Step 1: Build frequency count table
    count = [0] * (max_val + 1)
    for num in arr:
        count[num] += 1

    # Step 2: Rebuild sorted array from counts
    sorted_arr = []
    for value, frequency in enumerate(count):
        sorted_arr.extend([value] * frequency)

    return sorted_arr

# ── Stable version (preserves relative order) ──
def counting_sort_stable(arr):
    if not arr: return arr
    max_val = max(arr)
    count = [0] * (max_val + 1)
    for num in arr: count[num] += 1
    # Cumulative count
    for i in range(1, len(count)):
        count[i] += count[i - 1]
    output = [0] * len(arr)
    for num in reversed(arr):
        output[count[num] - 1] = num
        count[num] -= 1
    return output

# ── Example ──────────────────────────────────
arr = [4, 2, 2, 8, 3, 3, 1]
print(counting_sort(arr))
# → [1, 2, 2, 3, 3, 4, 8]`,

  radix_sort: `def radix_sort(arr):
    """
    Radix Sort — O(n * d) time, O(n + k) space
    d = number of digits, k = base (10 for decimal)
    Sorts digit by digit from LEAST to MOST significant.
    Non-comparative — works on non-negative integers.
    """
    if not arr:
        return arr

    max_val = max(arr)
    exp = 1                          # Start from units digit (10^0)

    while max_val // exp > 0:
        arr = _counting_sort_digit(arr, exp)
        exp *= 10                    # Move to next digit (tens, hundreds...)

    return arr

def _counting_sort_digit(arr, exp):
    """Sort array based on the digit at position exp."""
    n = len(arr)
    output = [0] * n
    count  = [0] * 10               # Digits 0–9

    # Count occurrences of each digit
    for num in arr:
        digit = (num // exp) % 10
        count[digit] += 1

    # Cumulative count (positions in output)
    for i in range(1, 10):
        count[i] += count[i - 1]

    # Build output array (right to left for stability)
    for i in range(n - 1, -1, -1):
        digit = (arr[i] // exp) % 10
        output[count[digit] - 1] = arr[i]
        count[digit] -= 1

    return output

# ── Example ──────────────────────────────────
arr = [170, 45, 75, 90, 802, 24, 2, 66]
print(radix_sort(arr))
# → [2, 24, 45, 66, 75, 90, 170, 802]`,

  stack_ops: `class Stack:
    """
    Stack — LIFO (Last In, First Out)
    Think of a stack of plates — you can only
    add/remove from the TOP.
    All primary operations are O(1).
    """
    def __init__(self):
        self.items = []              # Internal list storage

    def push(self, item):
        """Add item to the top — O(1)"""
        self.items.append(item)
        print(f"PUSH {item} → stack: {self.items}")

    def pop(self):
        """Remove and return top item — O(1)"""
        if self.is_empty():
            raise IndexError("Stack underflow — cannot pop from empty stack")
        item = self.items.pop()
        print(f"POP  {item} → stack: {self.items}")
        return item

    def peek(self):
        """View top item without removing — O(1)"""
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self.items[-1]

    def insert_at(self, position, item):
        """Insert at arbitrary position — O(n)"""
        self.items.insert(position, item)

    def delete_at(self, position):
        """Delete at arbitrary position — O(n)"""
        return self.items.pop(position)

    def is_empty(self):
        return len(self.items) == 0

    def size(self):
        return len(self.items)

    def __str__(self):
        if not self.items: return "[ empty ]"
        return " | ".join(str(x) for x in self.items) + " ← TOP"

# ── Example ──────────────────────────────────
s = Stack()
s.push(10)            # stack: [10]
s.push(20)            # stack: [10, 20]
s.push(30)            # stack: [10, 20, 30]
print(s.peek())       # → 30 (just look, don't remove)
print(s.pop())        # → 30 (removes from top)
s.insert_at(1, 15)   # insert 15 between 10 and 20
print(s)              # → 10 | 15 | 20 ← TOP`,

  polish_notation: `# ─── Polish Notation (Prefix) ─────────────────
def evaluate_prefix(expression):
    """
    Operator BEFORE operands: + 3 4  means  3 + 4
    Scan right-to-left. Push numbers; on operator,
    pop two values, compute, push result.
    """
    tokens = expression.split()
    stack  = []

    for token in reversed(tokens):       # Right to left
        if token.lstrip('-').isdigit():
            stack.append(int(token))
        else:
            a, b = stack.pop(), stack.pop()
            if   token == '+': stack.append(a + b)
            elif token == '-': stack.append(a - b)
            elif token == '*': stack.append(a * b)
            elif token == '/': stack.append(a // b)

    return stack[0]

# ─── Reverse Polish Notation (Postfix) ─────────
def evaluate_postfix(expression):
    """
    Operator AFTER operands: 3 4 +  means  3 + 4
    Scan left-to-right. Push numbers; on operator,
    pop two values (b then a), compute, push result.
    """
    tokens = expression.split()
    stack  = []

    for token in tokens:
        if token.lstrip('-').isdigit():
            stack.append(int(token))
        else:
            b = stack.pop()             # Second operand
            a = stack.pop()             # First operand
            if   token == '+': stack.append(a + b)
            elif token == '-': stack.append(a - b)
            elif token == '*': stack.append(a * b)
            elif token == '/': stack.append(a // b)

    return stack[0]

# ─── Infix to Postfix conversion ───────────────
def infix_to_postfix(expression):
    precedence = {'+': 1, '-': 1, '*': 2, '/': 2}
    output, stack = [], []
    for token in expression.split():
        if token.isdigit():
            output.append(token)
        elif token in precedence:
            while (stack and stack[-1] in precedence and
                   precedence[stack[-1]] >= precedence[token]):
                output.append(stack.pop())
            stack.append(token)
        elif token == '(':
            stack.append(token)
        elif token == ')':
            while stack and stack[-1] != '(':
                output.append(stack.pop())
            stack.pop()
    output.extend(reversed(stack))
    return ' '.join(output)

# ── Examples ─────────────────────────────────
print(evaluate_prefix("+ 3 4"))          # → 7
print(evaluate_postfix("3 4 +"))         # → 7
print(evaluate_postfix("5 1 2 + 4 * + 3 -"))  # → 14
print(infix_to_postfix("3 + 4 * 2"))     # → 3 4 2 * +`,

  recursion: `# ─── Recursion Examples ──────────────────────────
# Each call adds a STACK FRAME to the call stack.
# Must have a BASE CASE to stop infinite recursion.

def factorial(n):
    """
    n! = n × (n-1) × ... × 1
    Call stack grows n levels deep → O(n) space
    """
    if n <= 1:                      # Base case
        return 1
    return n * factorial(n - 1)    # Recursive case

def fibonacci(n, memo={}):
    """
    Memoized Fibonacci — avoids redundant calls.
    Without memo: O(2ⁿ). With memo: O(n).
    """
    if n in memo: return memo[n]
    if n <= 1:    return n
    memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]

def tower_of_hanoi(n, source, target, helper):
    """
    Classic recursion problem — uses the call stack
    to track each state. Requires 2ⁿ - 1 moves.
    """
    if n == 1:
        print(f"Move disk 1: {source} → {target}")
        return
    tower_of_hanoi(n-1, source, helper, target)
    print(f"Move disk {n}: {source} → {target}")
    tower_of_hanoi(n-1, helper, target, source)

def binary_search_recursive(arr, target, lo=0, hi=None):
    """Recursion replacing iteration — O(log n) stack depth"""
    if hi is None: hi = len(arr) - 1
    if lo > hi: return -1           # Base case: not found
    mid = (lo + hi) // 2
    if arr[mid] == target: return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid+1, hi)
    else:
        return binary_search_recursive(arr, target, lo, mid-1)

# ── Examples ─────────────────────────────────
print(factorial(5))           # → 120
print(fibonacci(10))          # → 55
tower_of_hanoi(3, 'A', 'C', 'B')  # Shows all moves`,

  linked_list_singly: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None             # Pointer to next node

class SinglyLinkedList:
    """
    Singly Linked List
    HEAD → [10|→] → [20|→] → [30|→] → NULL
    Each node only knows the NEXT node.
    """
    def __init__(self):
        self.head = None

    # ── INSERT ────────────────────────────────
    def insert_at_start(self, data):         # O(1)
        node = Node(data)
        node.next = self.head
        self.head = node

    def insert_at_end(self, data):           # O(n)
        node = Node(data)
        if not self.head:
            self.head = node; return
        current = self.head
        while current.next:                  # Traverse to tail
            current = current.next
        current.next = node

    def insert_at_position(self, pos, data): # O(n)
        if pos == 0:
            self.insert_at_start(data); return
        node = Node(data)
        current = self.head
        for _ in range(pos - 1):
            if not current: raise IndexError("Position out of range")
            current = current.next
        node.next = current.next             # Link new node
        current.next = node

    # ── DELETE ────────────────────────────────
    def delete(self, data):                  # O(n)
        if not self.head: return
        if self.head.data == data:
            self.head = self.head.next; return
        current = self.head
        while current.next:
            if current.next.data == data:
                current.next = current.next.next  # Skip over
                return
            current = current.next

    # ── SEARCH ────────────────────────────────
    def search(self, data):                  # O(n)
        current, index = self.head, 0
        while current:
            if current.data == data:
                return index
            current = current.next; index += 1
        return -1

    def display(self):
        nodes, cur = [], self.head
        while cur:
            nodes.append(str(cur.data)); cur = cur.next
        return " → ".join(nodes) + " → NULL"

# ── Example ──────────────────────────────────
ll = SinglyLinkedList()
ll.insert_at_end(10); ll.insert_at_end(30)
ll.insert_at_start(5)
ll.insert_at_position(2, 20)         # Insert 20 at index 2
print(ll.display())    # → 5 → 10 → 20 → 30 → NULL
print(ll.search(20))   # → 2
ll.delete(10)
print(ll.display())    # → 5 → 20 → 30 → NULL`,

  linked_list_doubly: `class DNode:
    def __init__(self, data):
        self.data = data
        self.prev = None             # Points to PREVIOUS node
        self.next = None             # Points to NEXT node

class DoublyLinkedList:
    """
    Doubly Linked List
    NULL ← [5|⇄] ⇄ [10|⇄] ⇄ [20|⇄] → NULL
    Can traverse BOTH directions.
    O(1) delete given direct node reference.
    """
    def __init__(self):
        self.head = None
        self.tail = None             # Extra tail pointer for O(1) end ops

    def insert_at_start(self, data):         # O(1)
        node = DNode(data)
        if not self.head:
            self.head = self.tail = node; return
        node.next = self.head
        self.head.prev = node
        self.head = node

    def insert_at_end(self, data):           # O(1) — thanks to tail
        node = DNode(data)
        if not self.tail:
            self.head = self.tail = node; return
        node.prev = self.tail
        self.tail.next = node
        self.tail = node

    def insert_at_position(self, pos, data): # O(n)
        if pos == 0: self.insert_at_start(data); return
        current = self.head
        for _ in range(pos - 1):
            if not current: raise IndexError("Out of range")
            current = current.next
        node = DNode(data)
        node.next = current.next
        node.prev = current
        if current.next: current.next.prev = node
        else: self.tail = node
        current.next = node

    def delete(self, data):                  # O(n) search, O(1) delete
        current = self.head
        while current:
            if current.data == data:
                if current.prev: current.prev.next = current.next
                else: self.head = current.next
                if current.next: current.next.prev = current.prev
                else: self.tail = current.prev
                return
            current = current.next

    def display_forward(self):
        nodes, cur = [], self.head
        while cur: nodes.append(str(cur.data)); cur = cur.next
        return " ⇄ ".join(nodes)

    def display_backward(self):
        nodes, cur = [], self.tail
        while cur: nodes.append(str(cur.data)); cur = cur.prev
        return " ⇄ ".join(nodes) + " (reversed)"

# ── Example ──────────────────────────────────
dll = DoublyLinkedList()
dll.insert_at_end(10); dll.insert_at_end(30)
dll.insert_at_start(5); dll.insert_at_position(2, 20)
print(dll.display_forward())    # → 5 ⇄ 10 ⇄ 20 ⇄ 30
print(dll.display_backward())   # → 30 ⇄ 20 ⇄ 10 ⇄ 5 (reversed)`,

  linked_list_circular: `class CNode:
    def __init__(self, data):
        self.data = data
        self.next = None

class CircularLinkedList:
    """
    Circular Linked List
    HEAD → [10|→] → [20|→] → [30|→] ↩ (back to HEAD)
    Tail's next always points back to head.
    Useful for: round-robin scheduling, circular buffers.
    """
    def __init__(self):
        self.head = None

    def _get_tail(self):
        """Traverse to find tail node — O(n)"""
        if not self.head: return None
        current = self.head
        while current.next != self.head:
            current = current.next
        return current

    def insert_at_end(self, data):           # O(n)
        node = CNode(data)
        if not self.head:
            self.head = node
            node.next = self.head            # Point to itself
            return
        tail = self._get_tail()
        tail.next = node
        node.next = self.head               # Complete the circle ↩

    def insert_at_start(self, data):         # O(n)
        node = CNode(data)
        if not self.head:
            self.head = node
            node.next = self.head; return
        tail = self._get_tail()
        node.next = self.head
        self.head = node
        tail.next = self.head               # Update tail → new head ↩

    def insert_at_position(self, pos, data): # O(n)
        if pos == 0: self.insert_at_start(data); return
        node = CNode(data)
        current = self.head
        for _ in range(pos - 1):
            current = current.next
            if current == self.head: break
        node.next = current.next
        current.next = node
        if node.next == self.head:
            self._get_tail()                # Nothing — already circular

    def delete(self, data):                  # O(n)
        if not self.head: return
        current, prev = self.head, None
        while True:
            if current.data == data:
                if not prev:                # Deleting head
                    tail = self._get_tail()
                    self.head = current.next
                    tail.next = self.head
                else:
                    prev.next = current.next
                return
            prev = current
            current = current.next
            if current == self.head: break  # Went full circle

    def display(self):
        if not self.head: return "Empty"
        result, cur = [], self.head
        while True:
            result.append(str(cur.data))
            cur = cur.next
            if cur == self.head: break       # Full circle done
        return " → ".join(result) + " ↩ HEAD"

# ── Example ──────────────────────────────────
cll = CircularLinkedList()
cll.insert_at_end(10); cll.insert_at_end(20); cll.insert_at_end(30)
cll.insert_at_start(5)
print(cll.display())    # → 5 → 10 → 20 → 30 ↩ HEAD
cll.delete(10)
print(cll.display())    # → 5 → 20 → 30 ↩ HEAD`,

  hash_open: `class HashTableChaining:
    """
    Open Hashing — Separate Chaining
    Each bucket holds a linked list of (key, value) pairs.
    Collisions are handled by chaining items in same bucket.

    Bucket 0: []
    Bucket 5: [(5,'a') → (14,'b') → (23,'c')]  ← all hash to 5
    """
    def __init__(self, size=9):
        self.size  = size
        self.table = [[] for _ in range(size)]  # Array of lists
        self.count = 0

    def _hash(self, key):
        """Hash function: maps key to bucket index"""
        return key % self.size

    def _load_factor(self):
        return self.count / self.size

    def insert(self, key, value=None):           # O(1) average
        idx = self._hash(key)
        # Update if key already exists
        for i, (k, v) in enumerate(self.table[idx]):
            if k == key:
                self.table[idx][i] = (key, value); return
        # Add new entry (chain to end of bucket)
        self.table[idx].append((key, value))
        self.count += 1
        print(f"hash({key}) = {key} % {self.size} = {idx}")

    def search(self, key):                       # O(1) average
        idx = self._hash(key)
        for k, v in self.table[idx]:
            if k == key: return v
        return None

    def delete(self, key):                       # O(1) average
        idx = self._hash(key)
        original = len(self.table[idx])
        self.table[idx] = [(k,v) for k,v in self.table[idx] if k != key]
        if len(self.table[idx]) < original:
            self.count -= 1

    def display(self):
        for i, bucket in enumerate(self.table):
            entries = " → ".join(f"{k}" for k,v in bucket)
            print(f"[{i}] {entries if entries else '∅'}")
        print(f"Load factor: {self._load_factor():.2f}")

# ── Example ──────────────────────────────────
ht = HashTableChaining()
ht.insert(5)    # hash(5)  = 5
ht.insert(14)   # hash(14) = 5  ← collision! chained
ht.insert(23)   # hash(23) = 5  ← collision! chained
ht.insert(7)    # hash(7)  = 7
ht.display()`,

  hash_closed: `class HashTableProbing:
    """
    Closed Hashing — Linear Probing
    ALL entries stored inside the table array itself.
    On collision: try (h+1)%n, (h+2)%n, ... until empty slot.

    Uses a TOMBSTONE marker for deletions to preserve
    search chains (deleted ≠ never used).
    """
    EMPTY   = None
    DELETED = "__DELETED__"          # Tombstone marker

    def __init__(self, size=9):
        self.size  = size
        self.table = [self.EMPTY] * size
        self.count = 0

    def _hash(self, key):
        return key % self.size

    def _probe(self, key):
        """Find slot for key using linear probing."""
        idx   = self._hash(key)
        steps = 0
        while steps < self.size:
            slot = (idx + steps) % self.size
            if self.table[slot] in (self.EMPTY, self.DELETED, key):
                return slot, steps
            steps += 1
        return -1, steps              # Table is full

    def insert(self, key):            # O(1) average
        if self.count >= self.size:
            raise OverflowError("Hash table is full!")

        idx    = self._hash(key)
        steps  = 0
        slot   = idx

        while self.table[slot] not in (self.EMPTY, self.DELETED):
            steps += 1
            slot = (idx + steps) % self.size

        self.table[slot] = key
        self.count += 1
        msg = f"hash({key})={idx}"
        if steps: msg += f" → collision! probed {steps} step(s) → slot {slot}"
        else:     msg += f" → placed at slot {slot}"
        print(msg)

    def search(self, key):            # O(1) average
        idx = self._hash(key)
        for i in range(self.size):
            slot = (idx + i) % self.size
            if self.table[slot] is self.EMPTY:
                return -1             # Empty slot = not in table
            if self.table[slot] == key:
                return slot
        return -1

    def delete(self, key):            # O(1) average
        slot = self.search(key)
        if slot != -1:
            self.table[slot] = self.DELETED   # Place tombstone
            self.count -= 1

    def display(self):
        for i, v in enumerate(self.table):
            if v is self.EMPTY:   print(f"[{i}] —")
            elif v == self.DELETED: print(f"[{i}] (deleted)")
            else: print(f"[{i}] {v}")

# ── Example ──────────────────────────────────
ht = HashTableProbing()
ht.insert(5)     # → slot 5
ht.insert(14)    # → hash=5, probe to slot 6
ht.insert(23)    # → hash=5, probe to slot 7
print(ht.search(14))   # → 6
ht.delete(14)
ht.display()`,

  queue_linear: `from collections import deque

class Queue:
    """
    Linear Queue — FIFO (First In, First Out)
    FRONT → [15] [30] [45] [60] ← REAR

    Uses Python's deque (double-ended queue) internally
    for O(1) operations at both ends.
    """
    def __init__(self):
        self.items = deque()

    # ── PRIMARY OPERATIONS ────────────────────
    def enqueue(self, item):                 # O(1) — add to rear
        self.items.append(item)
        print(f"Enqueue {item} → {list(self.items)}")

    def dequeue(self):                       # O(1) — remove from front
        if self.is_empty():
            raise IndexError("Queue underflow — empty queue")
        item = self.items.popleft()
        print(f"Dequeue {item} → {list(self.items)}")
        return item

    def front(self):                         # O(1) — peek front
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self.items[0]

    def rear(self):                          # O(1) — peek rear
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self.items[-1]

    # ── POSITIONAL OPERATIONS ─────────────────
    def insert_at_front(self, item):         # O(1)
        self.items.appendleft(item)

    def insert_at_position(self, pos, item): # O(n)
        self.items.insert(pos, item)

    def delete_at_position(self, pos):       # O(n)
        return self.items[pos] if 0 <= pos < len(self.items) else None

    def is_empty(self):
        return len(self.items) == 0

    def size(self):
        return len(self.items)

    def display(self):
        return f"FRONT → {list(self.items)} ← REAR"

# ── Example ──────────────────────────────────
q = Queue()
q.enqueue(15); q.enqueue(30); q.enqueue(45)
print(q.front())      # → 15  (first in)
q.dequeue()           # → removes 15 (first out)
q.insert_at_front(5)  # priority insert
print(q.display())    # FRONT → [5, 30, 45] ← REAR`,

  queue_circular: `class CircularQueue:
    """
    Circular Queue (Ring Buffer) — Fixed size array
    Uses modulo arithmetic so rear wraps back to front.

    Example with capacity=5:
    Slots:  [15] [30] [45] [60] [ ]
    front=0, rear=3, size=4

    After dequeue + enqueue 70:
    Slots:  [ ] [30] [45] [60] [70]
    front=1, rear=4, size=4
    """
    def __init__(self, capacity):
        self.capacity = capacity
        self.queue    = [None] * capacity
        self.front    = -1
        self.rear     = -1
        self.size     = 0

    def is_full(self):
        return self.size == self.capacity

    def is_empty(self):
        return self.size == 0

    def enqueue(self, item):                 # O(1)
        if self.is_full():
            raise OverflowError("Circular queue is full")
        if self.is_empty():
            self.front = 0
        # KEY: modulo wraps rear back to start of array
        self.rear = (self.rear + 1) % self.capacity
        self.queue[self.rear] = item
        self.size += 1
        print(f"Enqueue {item} → front={self.front} rear={self.rear}")

    def dequeue(self):                       # O(1)
        if self.is_empty():
            raise IndexError("Queue underflow")
        item = self.queue[self.front]
        self.queue[self.front] = None
        # KEY: modulo wraps front back to start of array
        self.front = (self.front + 1) % self.capacity
        self.size -= 1
        if self.is_empty():
            self.front = self.rear = -1
        print(f"Dequeue {item} → front={self.front} rear={self.rear}")
        return item

    def peek_front(self):
        if self.is_empty(): raise IndexError("Empty")
        return self.queue[self.front]

    def display(self):
        return self.queue

# ── Example ──────────────────────────────────
cq = CircularQueue(5)
cq.enqueue(15); cq.enqueue(30); cq.enqueue(45)
cq.dequeue()          # → removes 15, front moves to slot 1
cq.enqueue(60)        # → goes to slot 3
cq.enqueue(75)        # → goes to slot 4
cq.enqueue(90)        # → wraps around to slot 0! (circular)
print(cq.display())   # → [90, 30, 45, 60, 75]`,
};

/* ─────────────────────────── CODE PANEL ─────────────────────────── */
function CodePanel({ snippets, color }) {
  const [active, setActive] = useState(snippets[0].key);
  const [copied, setCopied] = useState(false);
  const code = PY[active] || "";

  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div style={{
      background: "#010308", border: `1px solid ${color}25`,
      borderRadius: G.radius, overflow: "hidden",
      boxShadow: `0 4px 32px rgba(0,0,0,0.5)`,
    }}>
      {/* Tab bar */}
      <div style={{
        display: "flex", alignItems: "center",
        borderBottom: `1px solid ${G.border}`,
        background: "rgba(2,5,16,0.95)", overflowX: "auto",
      }}>
        {/* Traffic-light dots */}
        <div style={{ display: "flex", gap: 5, padding: "0 14px", flexShrink: 0 }}>
          {["#f87171", "#fbbf24", "#4ade80"].map(c =>
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c + "99" }} />
          )}
        </div>
        {snippets.map(s => (
          <button key={s.key} onClick={() => setActive(s.key)}
            style={{
              padding: "10px 18px", fontSize: 11, fontFamily: G.mono,
              border: "none", cursor: "pointer",
              whiteSpace: "nowrap", flexShrink: 0, background: "transparent",
              color: active === s.key ? color : G.mutedHi,
              borderBottom: `2px solid ${active === s.key ? color : "transparent"}`,
              transition: "color 0.15s",
            }}>
            {s.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 14px", flexShrink: 0 }}>
          <span style={{
            fontSize: 9, padding: "2px 8px", borderRadius: 20,
            background: "#fbbf2420", color: "#fbbf24",
            border: "1px solid #fbbf2440", fontFamily: G.mono,
          }}>Python 3.x</span>
          <button onClick={copy}
            style={{
              padding: "4px 12px", fontSize: 10, fontFamily: G.font,
              border: `1px solid ${copied ? "#4ade8044" : color + "44"}`,
              borderRadius: 6, cursor: "pointer", background: "transparent",
              color: copied ? "#4ade80" : color, transition: "all 0.2s", fontWeight: 600,
            }}>
            {copied ? "✓ Copied!" : "⎘ Copy"}
          </button>
        </div>
      </div>
      {/* Code body */}
      <pre style={{
        margin: 0, padding: "22px 26px",
        fontSize: 12.5, fontFamily: G.mono,
        lineHeight: 2, color: "#c8e6ff",
        maxHeight: 520, overflowY: "auto", overflowX: "auto",
        whiteSpace: "pre", wordBreak: "normal",
      }}>
        {code}
      </pre>
    </div>
  );
}

/* ─────────────────────────── SHARED UI COMPONENTS ─────────────────────────── */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function Badge({ children, color }) {
  return (
    <span style={{
      fontSize: 10, padding: "3px 10px", borderRadius: 20,
      background: color + "18", color, border: `1px solid ${color}55`,
      fontFamily: G.mono, fontWeight: 600, letterSpacing: 0.5
    }}>
      {children}
    </span>
  );
}

function Btn({ children, onClick, color = "#38bdf8", disabled, variant = "fill" }) {
  const [hov, setHov] = useState(false);
  const filled = variant === "fill";
  return (
    <button
      style={{
        padding: "7px 18px", fontSize: 12, fontFamily: G.font,
        border: `1px solid ${hov ? color + "bb" : color + "50"}`,
        borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s", opacity: disabled ? 0.38 : 1,
        outline: "none", letterSpacing: 0.4, fontWeight: 600,
        background: filled
          ? hov ? color + "38" : color + "18"
          : hov ? color + "18" : "transparent",
        color,
        boxShadow: hov && !disabled ? G.glow(color, 10) : "none",
      }}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
}

function Input({ value, onChange, placeholder, width = 70, onEnter }) {
  const [focus, setFocus] = useState(false);
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      onKeyDown={e => e.key === "Enter" && onEnter?.()}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        width, background: "rgba(6,15,35,0.9)",
        color: G.text, fontFamily: G.mono,
        border: `1px solid ${focus ? "#38bdf855" : G.border}`,
        borderRadius: 8, padding: "7px 12px", fontSize: 12, outline: "none",
        transition: "border-color 0.2s",
        boxShadow: focus ? "0 0 0 3px #38bdf812" : "none",
      }} />
  );
}

function Select({ value, onChange, options, color }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: "rgba(6,15,35,0.95)", color,
        border: `1px solid ${color}44`, borderRadius: 8,
        padding: "7px 12px", fontSize: 12, fontFamily: G.font,
        outline: "none", cursor: "pointer",
      }}>
      {options.map(o => <option key={o.value} value={o.value} style={{ background: "#060c1c" }}>{o.label}</option>)}
    </select>
  );
}

function Log({ entries, color }) {
  const ref = useRef();
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [entries]);
  return (
    <div
      ref={ref}
      style={{
        background: "rgba(1,4,12,0.9)",
        border: `1px solid ${G.border}`,
        borderLeft: `3px solid ${color}55`,
        borderRadius: 8, padding: "10px 14px",
        maxHeight: 120, overflowY: "auto",
        fontSize: 11, fontFamily: G.mono,
      }}>
      {entries.length === 0 && (
        <span style={{ color: G.muted, fontStyle: "italic" }}>// output will appear here…</span>
      )}
      {entries.map((e, i) => (
        <div key={i} style={{
          color: e.type === "error" ? "#f87171" : e.type === "success" ? "#4ade80" : color + "cc",
          marginBottom: 3, display: "flex", gap: 6, alignItems: "flex-start",
        }}>
          <span style={{ color: G.muted, flexShrink: 0 }}>›</span>
          <span>{e.msg}</span>
        </div>
      ))}
    </div>
  );
}

function TheoryCard({ concept, color }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? `rgba(6,15,35,0.97)` : G.dim,
        border: `1px solid ${hov ? color + "44" : color + "20"}`,
        borderRadius: G.radius, padding: 20,
        borderTop: `2px solid ${color}`,
        transition: "all 0.25s",
        boxShadow: hov ? G.glow(color, 12) : "none",
      }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#e8f4ff", fontFamily: G.font }}>{concept.name}</span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <Badge color={color}>T: {concept.time}</Badge>
          <Badge color={G.mutedHi + "ff"}>S: {concept.space}</Badge>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 12, color: "#6a88aa", lineHeight: 1.8, fontFamily: G.font }}>{concept.desc}</p>
    </div>
  );
}

function SectionHeader({ title, simple, color, icon }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: color + "18", border: `1px solid ${color}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, flexShrink: 0,
          boxShadow: G.glow(color, 8),
        }}>{icon}</div>
        <div>
          <h2 style={{
            margin: 0, fontSize: 26, fontWeight: 900, color,
            letterSpacing: -0.8, fontFamily: G.font,
            textShadow: `0 0 30px ${color}50`,
          }}>{title}</h2>
          <div style={{ fontSize: 12, color: G.mutedHi, fontStyle: "italic", marginTop: 2, fontFamily: G.font }}>" {simple}"</div>
        </div>
      </div>
      <div style={{ height: 1, background: `linear-gradient(90deg, ${color}44 0%, transparent 70%)` }} />
    </div>
  );
}

function TabBar({ tabs, active, setActive, color }) {
  return (
    <div style={{
      display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap",
      background: "rgba(4,8,20,0.6)", padding: "5px 6px",
      borderRadius: 10, border: `1px solid ${G.border}`,
      width: "fit-content",
    }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            style={{
              padding: "6px 16px", fontSize: 12, fontFamily: G.font,
              fontWeight: isActive ? 700 : 500,
              border: isActive ? `1px solid ${color}55` : "1px solid transparent",
              borderRadius: 7, cursor: "pointer",
              background: isActive ? color + "22" : "transparent",
              color: isActive ? color : G.mutedHi,
              transition: "all 0.18s",
              boxShadow: isActive ? G.glow(color, 8) : "none",
            }}>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   1. SEARCHING
══════════════════════════════════════════════════════════════ */
function SearchingSection() {
  const C = "#38bdf8";
  const DEF = [3, 7, 11, 15, 21, 28, 34, 42, 55, 67, 72, 88];
  const [arr, setArr] = useState([...DEF]);
  const [algo, setAlgo] = useState("binary");
  const [target, setTarget] = useState("28");
  const [addVal, setAddVal] = useState("");
  const [addPos, setAddPos] = useState("end");
  const [customPos, setCustomPos] = useState("");
  const [highlights, setHighlights] = useState({});
  const [log, setLog] = useState([]);
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState("demo");
  const runRef = useRef(false);

  const addLog = (msg, type = "info") => setLog(l => [...l.slice(-30), { msg, type }]);

  const insertAt = () => {
    const v = Number(addVal); if (!addVal || isNaN(v)) return;
    let a = [...arr];
    if (addPos === "start") a = [v, ...a];
    else if (addPos === "end") a = [...a, v];
    else { const p = Math.max(0, Math.min(a.length, Number(customPos) || 0)); a.splice(p, 0, v); }
    setArr(a); setAddVal(""); setHighlights({});
    addLog(`Inserted ${v} at ${addPos === "custom" ? "index " + customPos : addPos}`, "success");
  };

  const removeAt = (i) => {
    const v = arr[i]; setArr(a => a.filter((_, j) => j !== i));
    addLog(`Deleted ${v} from index ${i}`, "success"); setHighlights({});
  };

  const runSearch = useCallback(async () => {
    if (running) return;
    const t = Number(target); if (isNaN(t)) return;
    setRunning(true); runRef.current = true; setHighlights({});
    const a = [...arr];
    if (algo === "linear") {
      addLog(`Linear Search for ${t}…`);
      for (let i = 0; i < a.length && runRef.current; i++) {
        setHighlights({ [i]: "active" }); await sleep(350);
        if (a[i] === t) { setHighlights({ [i]: "found" }); addLog(`✓ Found ${t} at index ${i}`, "success"); break; }
        else if (i === a.length - 1) { setHighlights({}); addLog(`✗ ${t} not found`, "error"); }
      }
    } else {
      const sorted = [...a].sort((x, y) => x - y); setArr(sorted);
      addLog(`Binary Search for ${t} (sorted)…`);
      let lo = 0, hi = sorted.length - 1, found = false;
      while (lo <= hi && runRef.current) {
        const mid = Math.floor((lo + hi) / 2);
        const elim = {};
        for (let i = 0; i < sorted.length; i++) if (i < lo || i > hi) elim[i] = "eliminated";
        setHighlights({ ...elim, [mid]: "active" });
        addLog(`lo=${lo} hi=${hi} mid=${mid} → arr[${mid}]=${sorted[mid]}`);
        await sleep(700);
        if (sorted[mid] === t) { setHighlights({ ...elim, [mid]: "found" }); addLog(`✓ Found at index ${mid}`, "success"); found = true; break; }
        else if (sorted[mid] < t) lo = mid + 1; else hi = mid - 1;
      }
      if (!found && runRef.current) { addLog(`✗ ${t} not found`, "error"); setHighlights({}); }
    }
    setRunning(false); runRef.current = false;
  }, [arr, algo, target, running]);

  const colorOf = (i) => {
    const h = highlights[i];
    if (h === "found") return { bg: "#4ade8033", border: "#4ade80", color: "#4ade80" };
    if (h === "active") return { bg: C + "33", border: C, color: "#fff" };
    if (h === "eliminated") return { bg: "#04050a", border: "#12192a", color: "#1a2a3a" };
    return { bg: G.dim, border: G.border, color: G.text };
  };

  const theory = [
    { name: "Linear Search", time: "O(n)", space: "O(1)", desc: "Checks each element sequentially. Works on any list. Simple but slow for large datasets." },
    { name: "Binary Search", time: "O(log n)", space: "O(1)", desc: "Requires sorted array. Halves search space each step. Finding 1 in 1M items takes ~20 steps." },
  ];

  return (
    <div>
      <SectionHeader title="Searching" icon="🔍" color={C} simple="A way to find a specific item in a list." />
      <TabBar color={C} active={tab} setActive={setTab}
        tabs={[{ id: "demo", label: "▶ Demo" }, { id: "theory", label: "📐 Theory" }, { id: "code", label: "{ } Python Code" }]} />

      {tab === "demo" && (
        <div>
          <div style={{ background: G.panel, border: `1px solid ${G.border}`, borderRadius: 10, padding: 18, marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              <Select value={addPos} onChange={setAddPos} color={C}
                options={[{ value: "start", label: "Insert: Start" }, { value: "end", label: "Insert: End" }, { value: "custom", label: "Insert: Index N" }]} />
              <Input value={addVal} onChange={setAddVal} placeholder="value" width={70} onEnter={insertAt} />
              {addPos === "custom" && <Input value={customPos} onChange={setCustomPos} placeholder="index" width={60} />}
              <Btn color={C} onClick={insertAt}>Insert</Btn>
              <span style={{ color: G.muted, alignSelf: "center" }}>|</span>
              <Select value={algo} onChange={setAlgo} color={C}
                options={[{ value: "binary", label: "Binary Search" }, { value: "linear", label: "Linear Search" }]} />
              <Input value={target} onChange={setTarget} placeholder="target" width={70} onEnter={runSearch} />
              <Btn color={C} onClick={runSearch} disabled={running}>{running ? "Searching…" : "▶ Search"}</Btn>
              <Btn color={G.muted + "ff"} onClick={() => { setArr([...DEF]); setHighlights({}); setLog([]); }} variant="outline">Reset</Btn>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {arr.map((v, i) => {
                const c = colorOf(i); return (
                  <div key={i} onClick={() => removeAt(i)} title="Click to delete"
                    style={{
                      width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center",
                      flexDirection: "column", gap: 2, background: c.bg, border: `1px solid ${c.border}`,
                      borderRadius: 7, color: c.color, cursor: "pointer", transition: "all 0.25s",
                      fontSize: 13, fontFamily: G.font, fontWeight: 700, userSelect: "none"
                    }}>
                    <span style={{ fontSize: 8, color: G.muted }}>[{i}]</span>{v}
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 10, color: G.muted }}>Click any cell to delete</div>
          </div>
          <Log entries={log} color={C} />
        </div>
      )}
      {tab === "theory" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {theory.map(c => <TheoryCard key={c.name} concept={c} color={C} />)}
        </div>
      )}
      {tab === "code" && (
        <CodePanel color={C} snippets={[
          { label: "Linear Search", key: "linear_search" },
          { label: "Binary Search", key: "binary_search" },
        ]} />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   2. SORTING
══════════════════════════════════════════════════════════════ */
function SortingSection() {
  const C = "#fb923c";
  const DEF = [64, 34, 25, 12, 22, 11, 90, 47, 3, 58, 73, 40];
  const [arr, setArr] = useState([...DEF]);
  const [algo, setAlgo] = useState("bubble");
  const [active, setActive] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [log, setLog] = useState([]);
  const [running, setRunning] = useState(false);
  const [addVal, setAddVal] = useState("");
  const [addPos, setAddPos] = useState("end");
  const [customPos, setCustomPos] = useState("");
  const [tab, setTab] = useState("demo");
  const runRef = useRef(false);

  const addLog = (msg, type = "info") => setLog(l => [...l.slice(-30), { msg, type }]);

  const insert = () => {
    const v = Number(addVal); if (!addVal || isNaN(v)) return;
    let a = [...arr];
    if (addPos === "start") a = [v, ...a];
    else if (addPos === "end") a = [...a, v];
    else { const p = Math.max(0, Math.min(a.length, Number(customPos) || 0)); a.splice(p, 0, v); }
    setArr(a); setAddVal(""); setSorted([]); setActive([]);
    addLog(`Inserted ${v}`, "success");
  };

  const removeAt = (i) => {
    const v = arr[i]; setArr(a => a.filter((_, j) => j !== i));
    setSorted([]); setActive([]); addLog(`Deleted ${v} from index ${i}`, "success");
  };

  const reset = () => { runRef.current = false; setArr([...DEF]); setActive([]); setSorted([]); setLog([]); };

  const runSort = useCallback(async () => {
    if (running) { runRef.current = false; setRunning(false); return; }
    setRunning(true); runRef.current = true; setSorted([]); setActive([]);
    let a = [...arr];
    addLog(`Running ${algo} sort…`);

    if (algo === "bubble") {
      for (let i = 0; i < a.length && runRef.current; i++) {
        for (let j = 0; j < a.length - i - 1 && runRef.current; j++) {
          setActive([j, j + 1]); await sleep(90);
          if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; setArr([...a]); }
        }
        setSorted(s => [...s, a.length - 1 - i]);
      }
    } else if (algo === "selection") {
      for (let i = 0; i < a.length && runRef.current; i++) {
        let m = i;
        for (let j = i + 1; j < a.length && runRef.current; j++) { setActive([m, j]); await sleep(80); if (a[j] < a[m]) m = j; }
        [a[i], a[m]] = [a[m], a[i]]; setArr([...a]); setSorted(s => [...s, i]);
      }
    } else if (algo === "insertion") {
      setSorted([0]);
      for (let i = 1; i < a.length && runRef.current; i++) {
        let j = i;
        while (j > 0 && a[j - 1] > a[j] && runRef.current) {
          setActive([j - 1, j]); await sleep(100);
          [a[j - 1], a[j]] = [a[j], a[j - 1]]; setArr([...a]); j--;
        }
        setSorted(s => [...new Set([...s, ...Array.from({ length: i + 1 }, (_, x) => x)])]);
      }
    } else if (algo === "merge") {
      const ms = async (ar, lo, hi) => {
        if (lo >= hi || !runRef.current) return;
        const mid = Math.floor((lo + hi) / 2);
        await ms(ar, lo, mid); await ms(ar, mid + 1, hi);
        let left = ar.slice(lo, mid + 1), right = ar.slice(mid + 1, hi + 1), k = lo, li = 0, ri = 0;
        while (li < left.length && ri < right.length && runRef.current) {
          setActive([k]); await sleep(80);
          if (left[li] <= right[ri]) ar[k++] = left[li++]; else ar[k++] = right[ri++]; setArr([...ar]);
        }
        while (li < left.length && runRef.current) { ar[k++] = left[li++]; setArr([...ar]); await sleep(60); }
        while (ri < right.length && runRef.current) { ar[k++] = right[ri++]; setArr([...ar]); await sleep(60); }
      };
      await ms(a, 0, a.length - 1);
    } else if (algo === "counting") {
      const mx = Math.max(...a); const cnt = Array(mx + 1).fill(0);
      a.forEach(v => cnt[v]++); let idx = 0;
      for (let i = 0; i <= mx && runRef.current; i++) while (cnt[i]-- > 0 && runRef.current) { setActive([idx]); a[idx] = i; setArr([...a]); await sleep(80); idx++; }
    } else if (algo === "radix") {
      const csd = async (ar, exp) => {
        const out = new Array(ar.length), cnt = new Array(10).fill(0);
        ar.forEach(v => cnt[Math.floor(v / exp) % 10]++);
        for (let i = 1; i < 10; i++) cnt[i] += cnt[i - 1];
        for (let i = ar.length - 1; i >= 0; i--) { const d = Math.floor(ar[i] / exp) % 10; out[--cnt[d]] = ar[i]; }
        for (let i = 0; i < ar.length && runRef.current; i++) { setActive([i]); ar[i] = out[i]; setArr([...ar]); await sleep(80); }
      };
      const mx = Math.max(...a);
      for (let exp = 1; Math.floor(mx / exp) > 0 && runRef.current; exp *= 10) { addLog(`Pass exp=${exp}`); await csd(a, exp); }
    }

    setActive([]); setSorted(a.map((_, i) => i));
    addLog(`✓ Sorted: [${a.join(", ")}]`, "success");
    setRunning(false); runRef.current = false;
  }, [arr, algo, running]);

  const maxV = Math.max(...arr, 1);

  const theory = [
    { name: "Bubble Sort", time: "O(n²)", space: "O(1)", desc: "Repeatedly swaps adjacent out-of-order elements. Simple, slow. Best case O(n) when already sorted." },
    { name: "Selection Sort", time: "O(n²)", space: "O(1)", desc: "Finds minimum each pass and moves to start. Makes at most n swaps — good when writes are costly." },
    { name: "Insertion Sort", time: "O(n²)", space: "O(1)", desc: "Builds sorted portion from left. Efficient on nearly-sorted data. Used internally in hybrid algorithms." },
    { name: "Merge Sort", time: "O(n log n)", space: "O(n)", desc: "Divide, sort recursively, merge. Stable, predictable. Preferred for large datasets." },
    { name: "Counting Sort", time: "O(n+k)", space: "O(k)", desc: "Non-comparative. Counts frequency of each value. Linear for bounded integer ranges." },
    { name: "Radix Sort", time: "O(nk)", space: "O(n+k)", desc: "Sorts digit by digit. Non-comparative. Excellent for fixed-length integer keys." },
  ];

  return (
    <div>
      <SectionHeader title="Sorting" icon="↕" color={C} simple="Putting items in order (e.g., smallest to largest)." />
      <TabBar color={C} active={tab} setActive={setTab}
        tabs={[{ id: "demo", label: "▶ Demo" }, { id: "theory", label: "📐 Theory" }, { id: "code", label: "{ } Python Code" }]} />

      {tab === "demo" && (
        <div>
          <div style={{ background: G.panel, border: `1px solid ${G.border}`, borderRadius: 10, padding: 18, marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              <Select value={addPos} onChange={setAddPos} color={C}
                options={[{ value: "start", label: "Insert: Start" }, { value: "end", label: "Insert: End" }, { value: "custom", label: "Insert: Index N" }]} />
              <Input value={addVal} onChange={setAddVal} placeholder="value" width={70} onEnter={insert} />
              {addPos === "custom" && <Input value={customPos} onChange={setCustomPos} placeholder="index" width={60} />}
              <Btn color={C} onClick={insert}>Insert</Btn>
              <span style={{ color: G.muted, alignSelf: "center" }}>|</span>
              <Select value={algo} onChange={setAlgo} color={C}
                options={[
                  { value: "bubble", label: "Bubble Sort" }, { value: "selection", label: "Selection Sort" },
                  { value: "insertion", label: "Insertion Sort" }, { value: "merge", label: "Merge Sort" },
                  { value: "counting", label: "Counting Sort" }, { value: "radix", label: "Radix Sort" },
                ]} />
              <Btn color={C} onClick={runSort}>{running ? "■ Stop" : "▶ Sort"}</Btn>
              <Btn color={G.muted + "ff"} onClick={reset} variant="outline">Reset</Btn>
            </div>
            <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 130, marginBottom: 6 }}>
              {arr.map((v, i) => (
                <div key={i} onClick={() => removeAt(i)} title="Click to delete"
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 3, cursor: "pointer" }}>
                  <span style={{ fontSize: 9, color: active.includes(i) ? C : sorted.includes(i) ? "#4ade80" : G.muted }}>{v}</span>
                  <div style={{
                    width: "100%", height: `${(v / maxV) * 110}px`,
                    background: active.includes(i) ? C : sorted.includes(i) ? "#4ade8066" : C + "44",
                    border: `1px solid ${active.includes(i) ? C : sorted.includes(i) ? "#4ade80" : C + "33"}`,
                    borderRadius: "3px 3px 0 0", transition: "height 0.1s, background 0.2s"
                  }} />
                </div>
              ))}
            </div>
            <div style={{ fontSize: 10, color: G.muted }}>Click any bar to delete</div>
          </div>
          <Log entries={log} color={C} />
        </div>
      )}
      {tab === "theory" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {theory.map(c => <TheoryCard key={c.name} concept={c} color={C} />)}
        </div>
      )}
      {tab === "code" && (
        <CodePanel color={C} snippets={[
          { label: "Bubble Sort", key: "bubble_sort" },
          { label: "Selection Sort", key: "selection_sort" },
          { label: "Insertion Sort", key: "insertion_sort" },
          { label: "Merge Sort", key: "merge_sort" },
          { label: "Counting Sort", key: "counting_sort" },
          { label: "Radix Sort", key: "radix_sort" },
        ]} />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   3. STACK
══════════════════════════════════════════════════════════════ */
function StackSection() {
  const C = "#c084fc";
  const [stack, setStack] = useState([42, 17, 8, 33]);
  const [input, setInput] = useState("");
  const [posInput, setPosInput] = useState("");
  const [log, setLog] = useState([]);
  const [flashIdx, setFlashIdx] = useState(null);
  const [rpnExpr, setRpnExpr] = useState("5 1 2 + 4 * + 3 -");
  const [rpnLog, setRpnLog] = useState([]);
  const [rpnResult, setRpnResult] = useState(null);
  const [tab, setTab] = useState("demo");

  const addLog = (msg, type = "info") => setLog(l => [...l.slice(-30), { msg, type }]);

  const push = () => {
    const v = Number(input); if (!input || isNaN(v)) return;
    setStack(s => [...s, v]);
    setFlashIdx(stack.length); setTimeout(() => setFlashIdx(null), 500);
    addLog(`PUSH ${v} → top`, "success"); setInput("");
  };

  const pop = () => {
    if (!stack.length) { addLog("Stack underflow!", "error"); return; }
    addLog(`POP → ${stack[stack.length - 1]}`, "success");
    setStack(s => s.slice(0, -1));
  };

  const insertAt = () => {
    const v = Number(input); if (!input || isNaN(v)) return;
    const pos = posInput === "" ? stack.length : Math.max(0, Math.min(stack.length, Number(posInput) || 0));
    const s = [...stack]; s.splice(pos, 0, v);
    setStack(s); addLog(`Inserted ${v} at position ${pos}`, "success"); setInput(""); setPosInput("");
  };

  const deleteAt = (i) => {
    const v = stack[i]; setStack(s => s.filter((_, j) => j !== i));
    addLog(`Deleted ${v} from index ${i}`, "success");
  };

  const evalRPN = () => {
    const tokens = rpnExpr.trim().split(/\s+/);
    const s = [], steps = [];
    try {
      for (const t of tokens) {
        if (!isNaN(t)) { s.push(Number(t)); steps.push({ action: `PUSH ${t}`, stack: [...s] }); }
        else {
          const b = s.pop(), a = s.pop(); let r;
          if (t === "+") r = a + b; else if (t === "-") r = a - b;
          else if (t === "*") r = a * b; else if (t === "/") r = +(a / b).toFixed(3);
          s.push(r); steps.push({ action: `${a} ${t} ${b} = ${r}`, stack: [...s] });
        }
      }
      setRpnLog(steps); setRpnResult(s[0]);
    } catch { setRpnLog([{ action: "Error in expression", stack: [] }]); setRpnResult(null); }
  };

  const theory = [
    { name: "Push", time: "O(1)", space: "O(1)", desc: "Adds element to the top. Stack pointer increments." },
    { name: "Pop", time: "O(1)", space: "O(1)", desc: "Removes from top. Raises underflow error on empty stack." },
    { name: "Polish Notation (Prefix)", time: "O(n)", space: "O(n)", desc: "Operator precedes operands: + A B. Evaluated right-to-left using a stack." },
    { name: "RPN / Postfix", time: "O(n)", space: "O(n)", desc: "Operator follows operands: A B +. Operands pushed; operators pop and compute." },
    { name: "Recursion", time: "Varies", space: "O(n)", desc: "Each recursive call adds a frame to the call stack. Deep recursion risks stack overflow." },
  ];

  return (
    <div>
      <SectionHeader title="Stack (LIFO)" icon="⊞" color={C} simple='A "stack" of data — only work with the top item.' />
      <TabBar color={C} active={tab} setActive={setTab}
        tabs={[{ id: "demo", label: "▶ Stack Demo" }, { id: "rpn", label: "⚙ RPN Evaluator" }, { id: "theory", label: "📐 Theory" }, { id: "code", label: "{ } Python Code" }]} />

      {tab === "demo" && (
        <div style={{ background: G.panel, border: `1px solid ${G.border}`, borderRadius: 10, padding: 18 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <Input value={input} onChange={setInput} placeholder="value" width={70} onEnter={push} />
            <Input value={posInput} onChange={setPosInput} placeholder="pos (0=bottom)" width={130} />
            <Btn color={C} onClick={insertAt}>Insert at Pos</Btn>
            <Btn color={C} onClick={push}>Push (top)</Btn>
            <Btn color={C + "aa"} onClick={pop} variant="outline">Pop</Btn>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 10, color: G.muted, marginBottom: 6, textAlign: "center" }}>← top</div>
              <div style={{ display: "flex", flexDirection: "column-reverse", gap: 4, minHeight: 40 }}>
                {stack.map((v, i) => (
                  <div key={i} onClick={() => deleteAt(i)} title="Click to delete"
                    style={{
                      width: 120, height: 38, display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "0 12px", background: flashIdx === i ? C + "44" : i === stack.length - 1 ? C + "22" : G.dim,
                      border: `1px solid ${i === stack.length - 1 ? C : G.border}`,
                      borderRadius: 6, color: i === stack.length - 1 ? C : G.text,
                      cursor: "pointer", transition: "all 0.25s", fontFamily: G.font, fontSize: 14, fontWeight: 700
                    }}>
                    <span style={{ fontSize: 9, color: G.muted }}>idx:{i}</span>
                    {v}
                    {i === stack.length - 1 && <span style={{ fontSize: 9, color: C + "88" }}>TOP</span>}
                  </div>
                ))}
                {!stack.length && <div style={{ color: G.muted, fontSize: 12 }}>Empty stack</div>}
              </div>
              <div style={{ fontSize: 10, color: G.muted, marginTop: 4, textAlign: "center" }}>← bottom</div>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}><Log entries={log} color={C} /></div>
          </div>
        </div>
      )}

      {tab === "rpn" && (
        <div style={{ background: G.panel, border: `1px solid ${G.border}`, borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 11, color: G.muted, marginBottom: 10 }}>Enter a postfix expression (e.g. "3 4 + 2 *")</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            <input value={rpnExpr} onChange={e => setRpnExpr(e.target.value)}
              style={{
                flex: 1, minWidth: 240, background: "#020408", color: G.text, border: `1px solid ${G.border}`,
                borderRadius: 6, padding: "7px 12px", fontSize: 13, fontFamily: G.font, outline: "none"
              }} />
            <Btn color={C} onClick={evalRPN}>Evaluate</Btn>
          </div>
          {rpnLog.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: C, fontFamily: G.font, minWidth: 190 }}>{s.action}</span>
              <div style={{ display: "flex", gap: 4 }}>
                {s.stack.map((v, j) => (
                  <span key={j} style={{
                    padding: "2px 8px", background: C + "11", border: `1px solid ${C}44`,
                    borderRadius: 4, color: C, fontSize: 11, fontFamily: G.font
                  }}>{v}</span>
                ))}
              </div>
            </div>
          ))}
          {rpnResult !== null && (
            <div style={{
              marginTop: 10, padding: "8px 16px", background: "#4ade8011", border: "1px solid #4ade8044",
              borderRadius: 6, color: "#4ade80", fontFamily: G.font, fontSize: 16, fontWeight: 700
            }}>
              Result = {rpnResult}
            </div>
          )}
        </div>
      )}

      {tab === "theory" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {theory.map(c => <TheoryCard key={c.name} concept={c} color={C} />)}
        </div>
      )}
      {tab === "code" && (
        <CodePanel color={C} snippets={[
          { label: "Stack Class", key: "stack_ops" },
          { label: "Polish / RPN Notation", key: "polish_notation" },
          { label: "Recursion Examples", key: "recursion" },
        ]} />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   4. LINKED LIST
══════════════════════════════════════════════════════════════ */
function LinkedListSection() {
  const C = "#34d399";
  const [nodes, setNodes] = useState([10, 20, 30, 40, 50]);
  const [mode, setMode] = useState("singly");
  const [input, setInput] = useState("");
  const [posInput, setPosInput] = useState("end");
  const [customPos, setCustomPos] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [highlighted, setHighlighted] = useState({});
  const [log, setLog] = useState([]);
  const [tab, setTab] = useState("demo");

  const addLog = (msg, type = "info") => setLog(l => [...l.slice(-30), { msg, type }]);

  const insert = () => {
    const v = Number(input); if (!input || isNaN(v)) return;
    let a = [...nodes], pos;
    if (posInput === "start") { a = [v, ...a]; pos = 0; }
    else if (posInput === "end") { a = [...a, v]; pos = a.length - 1; }
    else { pos = Math.max(0, Math.min(a.length, Number(customPos) || 0)); a.splice(pos, 0, v); }
    setNodes(a); setInput("");
    setHighlighted({ [pos]: "new" }); setTimeout(() => setHighlighted({}), 1000);
    addLog(`Inserted ${v} at ${posInput === "custom" ? "index " + pos : posInput}`, "success");
  };

  const remove = (i) => {
    const v = nodes[i]; setNodes(n => n.filter((_, j) => j !== i));
    addLog(`Deleted node ${v} at index ${i}`, "success"); setHighlighted({});
  };

  const search = async () => {
    const t = Number(searchVal); if (isNaN(t) || !searchVal) return;
    addLog(`Searching for ${t}…`);
    for (let i = 0; i < nodes.length; i++) {
      setHighlighted({ [i]: "active" }); await sleep(350);
      if (nodes[i] === t) { setHighlighted({ [i]: "found" }); addLog(`✓ Found at node ${i}`, "success"); return; }
    }
    setHighlighted({}); addLog(`✗ ${t} not found`, "error");
  };

  const nc = (i) => {
    const h = highlighted[i];
    if (h === "found") return { bg: "#4ade8033", border: "#4ade80", color: "#4ade80" };
    if (h === "active") return { bg: C + "22", border: C, color: "#fff" };
    if (h === "new") return { bg: C + "44", border: C, color: C };
    return { bg: G.dim, border: G.border, color: G.text };
  };

  const theory = [
    { name: "Singly Linked", time: "O(n) search", space: "O(n)", desc: "Each node stores data + next pointer. One-directional traversal. O(1) insertion at head." },
    { name: "Doubly Linked", time: "O(1) at ends", space: "O(n)", desc: "Each node has next AND prev pointers. Bidirectional traversal. O(1) deletion given reference." },
    { name: "Circular Linked", time: "O(n)", space: "O(n)", desc: "Tail next points back to head. Useful for round-robin scheduling and circular buffers." },
    { name: "Insertion", time: "O(1) with ref", space: "O(1)", desc: "O(1) at head/tail. O(n) at position N (must traverse to find it)." },
    { name: "Deletion", time: "O(1) with ref", space: "O(1)", desc: "O(1) given a node reference. O(n) when searching for the node first." },
  ];

  return (
    <div>
      <SectionHeader title="Linked List" icon="⬡" color={C} simple="A chain of data where each point points to the next one." />
      <TabBar color={C} active={tab} setActive={setTab}
        tabs={[{ id: "demo", label: "▶ Demo" }, { id: "theory", label: "📐 Theory" }, { id: "code", label: "{ } Python Code" }]} />

      {tab === "demo" && (
        <div>
          <div style={{ background: G.panel, border: `1px solid ${G.border}`, borderRadius: 10, padding: 18, marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {["singly", "doubly", "circular"].map(m => (
                <Btn key={m} color={C} onClick={() => setMode(m)} variant={mode === m ? "fill" : "outline"}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </Btn>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              <Select value={posInput} onChange={setPosInput} color={C}
                options={[{ value: "start", label: "Insert: Start" }, { value: "end", label: "Insert: End" }, { value: "custom", label: "Insert: Index N" }]} />
              <Input value={input} onChange={setInput} placeholder="value" width={70} onEnter={insert} />
              {posInput === "custom" && <Input value={customPos} onChange={setCustomPos} placeholder="index" width={60} />}
              <Btn color={C} onClick={insert}>Insert Node</Btn>
              <span style={{ color: G.muted, alignSelf: "center" }}>|</span>
              <Input value={searchVal} onChange={setSearchVal} placeholder="search val" width={90} onEnter={search} />
              <Btn color={C} onClick={search} variant="outline">Search</Btn>
            </div>
            <div style={{ overflowX: "auto", paddingBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: "max-content", padding: "20px 0 4px", position: "relative" }}>
                {nodes.length > 0 && <div style={{ position: "absolute", top: 4, left: 0, fontSize: 9, color: C + "88", fontFamily: G.font }}>HEAD</div>}
                {nodes.map((v, i) => {
                  const n = nc(i);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center" }}>
                      <div onClick={() => remove(i)} title="Click to delete"
                        style={{
                          display: "flex", alignItems: "stretch", border: `1px solid ${n.border}`,
                          borderRadius: 8, overflow: "hidden", cursor: "pointer", transition: "all 0.25s", background: n.bg
                        }}>
                        <div style={{ padding: "8px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                          <span style={{ fontSize: 8, color: G.muted }}>idx:{i}</span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: n.color, fontFamily: G.font }}>{v}</span>
                        </div>
                        <div style={{ width: 1, background: n.border + "44", alignSelf: "stretch" }} />
                        <div style={{ padding: "8px 10px", display: "flex", alignItems: "center", fontSize: 11, color: C + "66", fontFamily: G.font }}>
                          {i === nodes.length - 1 ? (mode === "circular" ? "↩HEAD" : "NULL") : mode === "doubly" ? "⇄" : "next"}
                        </div>
                      </div>
                      {i < nodes.length - 1 && <div style={{ color: C + "55", padding: "0 3px", fontSize: 13 }}>{mode === "doubly" ? "⇄" : "→"}</div>}
                      {mode === "circular" && i === nodes.length - 1 && <div style={{ color: C + "44", padding: "0 6px", fontSize: 18 }}>⟳</div>}
                    </div>
                  );
                })}
                {!nodes.length && <div style={{ color: G.muted, fontSize: 13 }}>Empty list</div>}
              </div>
            </div>
            <div style={{ fontSize: 10, color: G.muted, marginTop: 4 }}>Click any node to delete it</div>
          </div>
          <Log entries={log} color={C} />
        </div>
      )}
      {tab === "theory" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {theory.map(c => <TheoryCard key={c.name} concept={c} color={C} />)}
        </div>
      )}
      {tab === "code" && (
        <CodePanel color={C} snippets={[
          { label: "Singly Linked List", key: "linked_list_singly" },
          { label: "Doubly Linked List", key: "linked_list_doubly" },
          { label: "Circular Linked List", key: "linked_list_circular" },
        ]} />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   5. HASH FUNCTION
══════════════════════════════════════════════════════════════ */
function HashSection() {
  const C = "#fbbf24";
  const SIZE = 9;
  const [mode, setMode] = useState("chaining");
  const [table, setTable] = useState(Array(SIZE).fill(null).map(() => []));
  const [probeTable, setProbeTable] = useState(Array(SIZE).fill(null));
  const [input, setInput] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [highlighted, setHighlighted] = useState({});
  const [log, setLog] = useState([]);
  const [tab, setTab] = useState("demo");

  const addLog = (msg, type = "info") => setLog(l => [...l.slice(-30), { msg, type }]);
  const hash = (v) => ((v % SIZE) + SIZE) % SIZE;

  const insert = () => {
    const v = Number(input); if (!input || isNaN(v)) return;
    const h = hash(v);
    if (mode === "chaining") {
      setTable(t => { const n = t.map(b => [...b]); n[h] = [...n[h], v]; return n; });
      addLog(`hash(${v}) = ${v} mod ${SIZE} = ${h} → chained at bucket ${h}`, "success");
    } else {
      let idx = h, steps = 0, pt = [...probeTable];
      while (pt[idx] !== null && steps < SIZE) { idx = (idx + 1) % SIZE; steps++; }
      if (steps >= SIZE) { addLog("Table full!", "error"); setInput(""); return; }
      pt[idx] = v; setProbeTable(pt);
      addLog(`hash(${v})=${h} → ${steps > 0 ? `collision! probed to slot ${idx}` : `placed at slot ${idx}`}`, steps > 0 ? "info" : "success");
    }
    setHighlighted({ [h]: true }); setTimeout(() => setHighlighted({}), 800);
    setInput("");
  };

  const searchHash = async () => {
    const t = Number(searchVal); if (isNaN(t) || !searchVal) return;
    const h = hash(t);
    if (mode === "chaining") {
      setHighlighted({ [h]: "active" }); await sleep(300);
      const found = table[h].includes(t);
      setHighlighted({ [h]: found ? "found" : "notfound" });
      addLog(found ? `✓ Found ${t} in bucket ${h}` : `✗ Not in bucket ${h}`, found ? "success" : "error");
    } else {
      let idx = h, steps = 0;
      while (probeTable[idx] !== t && probeTable[idx] !== null && steps < SIZE) {
        setHighlighted({ [idx]: "active" }); await sleep(300);
        idx = (idx + 1) % SIZE; steps++;
      }
      if (probeTable[idx] === t) { setHighlighted({ [idx]: "found" }); addLog(`✓ Found ${t} at slot ${idx}`, "success"); }
      else { setHighlighted({}); addLog(`✗ ${t} not found`, "error"); }
    }
    setTimeout(() => setHighlighted({}), 1500);
  };

  const bColor = (i) => {
    const h = highlighted[i];
    if (h === "found") return "#4ade80";
    if (h === "active" || h === true) return C;
    if (h === "notfound") return "#f87171";
    return G.muted;
  };

  const theory = [
    { name: "Hash Function", time: "O(1) avg", space: "O(n)", desc: "Maps key to fixed index. Good hash distributes keys uniformly to minimize collisions." },
    { name: "Open Hashing (Chaining)", time: "O(1) avg", space: "O(n+m)", desc: "Each slot holds a list. Simple collision handling. Degrades at high load factor." },
    { name: "Closed Hashing (Probing)", time: "O(1) avg", space: "O(n)", desc: "All entries in the table. On collision, probe for open slot. Types: linear, quadratic, double." },
    { name: "Load Factor λ", time: "—", space: "—", desc: "λ = n/m (keys/table size). Rehash when λ > 0.7 to maintain performance." },
  ];

  return (
    <div>
      <SectionHeader title="Hash Function" icon="#" color={C} simple="A shortcut to find data instantly using a unique code." />
      <TabBar color={C} active={tab} setActive={setTab}
        tabs={[{ id: "demo", label: "▶ Demo" }, { id: "theory", label: "📐 Theory" }, { id: "code", label: "{ } Python Code" }]} />

      {tab === "demo" && (
        <div>
          <div style={{ background: G.panel, border: `1px solid ${G.border}`, borderRadius: 10, padding: 18, marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              <Btn color={C} onClick={() => { setMode("chaining"); setTable(Array(SIZE).fill(null).map(() => [])); setLog([]); }} variant={mode === "chaining" ? "fill" : "outline"}>Open (Chaining)</Btn>
              <Btn color={C} onClick={() => { setMode("probing"); setProbeTable(Array(SIZE).fill(null)); setLog([]); }} variant={mode === "probing" ? "fill" : "outline"}>Closed (Probing)</Btn>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              <Input value={input} onChange={setInput} placeholder="integer" width={80} onEnter={insert} />
              <Btn color={C} onClick={insert}>Insert</Btn>
              <span style={{ color: G.muted, alignSelf: "center" }}>|</span>
              <Input value={searchVal} onChange={setSearchVal} placeholder="search" width={80} onEnter={searchHash} />
              <Btn color={C} onClick={searchHash} variant="outline">Search</Btn>
              <span style={{ fontSize: 11, color: G.muted, alignSelf: "center" }}>h(x) = x mod {SIZE}</span>
            </div>
            {mode === "chaining" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {table.map((bucket, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 36, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
                      background: highlighted[i] ? bColor(i) + "33" : C + "11",
                      border: `1px solid ${highlighted[i] ? bColor(i) : C + "44"}`,
                      borderRadius: 6, color: highlighted[i] ? bColor(i) : C, fontSize: 12, fontFamily: G.font, fontWeight: 700, transition: "all 0.3s"
                    }}>{i}</div>
                    <div style={{ color: G.muted, fontSize: 11 }}>h(x)={i}</div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {bucket.map((v, j) => (
                        <div key={j} onClick={() => { setTable(t => { const n = t.map(b => [...b]); n[i] = n[i].filter((_, k) => k !== j); return n; }); addLog(`Deleted ${v}`, "success"); }}
                          style={{ padding: "4px 10px", background: C + "11", border: `1px solid ${C}44`, borderRadius: 4, color: C, fontSize: 12, fontFamily: G.font, cursor: "pointer" }}>
                          {v}
                        </div>
                      ))}
                      {!bucket.length && <span style={{ color: "#1a2a3a", fontSize: 12 }}>∅</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {probeTable.map((v, i) => (
                  <div key={i} onClick={() => { if (v !== null) { setProbeTable(p => { const n = [...p]; n[i] = null; return n; }); addLog(`Deleted ${v} from slot ${i}`, "success"); } }}
                    style={{
                      width: 60, minHeight: 56, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                      background: v !== null ? (highlighted[i] ? bColor(i) + "33" : C + "11") : G.dim,
                      border: `1px solid ${v !== null ? (highlighted[i] ? bColor(i) : C + "66") : G.border}`,
                      borderRadius: 7, cursor: v !== null ? "pointer" : "default", transition: "all 0.25s", fontFamily: G.font
                    }}>
                    <span style={{ fontSize: 9, color: G.muted }}>slot:{i}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: v !== null ? C : "#1a2a3a" }}>{v !== null ? v : "—"}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ fontSize: 10, color: G.muted, marginTop: 8 }}>Click any entry to delete it</div>
          </div>
          <Log entries={log} color={C} />
        </div>
      )}
      {tab === "theory" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {theory.map(c => <TheoryCard key={c.name} concept={c} color={C} />)}
        </div>
      )}
      {tab === "code" && (
        <CodePanel color={C} snippets={[
          { label: "Open Hashing (Chaining)", key: "hash_open" },
          { label: "Closed Hashing (Probing)", key: "hash_closed" },
        ]} />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   6. QUEUE
══════════════════════════════════════════════════════════════ */
function QueueSection() {
  const C = "#f472b6";
  const MAX = 8;
  const [mode, setMode] = useState("linear");
  const [queue, setQueue] = useState([15, 30, 45, 60]);
  const [circArr, setCircArr] = useState(Array(MAX).fill(null));
  const [front, setFront] = useState(0);
  const [rear, setRear] = useState(3);
  const [circSize, setCircSize] = useState(4);
  const [input, setInput] = useState("");
  const [posInput, setPosInput] = useState("rear");
  const [customPos, setCustomPos] = useState("");
  const [log, setLog] = useState([]);
  const [flashFront, setFlashFront] = useState(false);
  const [flashRear, setFlashRear] = useState(false);
  const [tab, setTab] = useState("demo");

  useEffect(() => {
    const a = Array(MAX).fill(null);
    a[0] = 15; a[1] = 30; a[2] = 45; a[3] = 60;
    setCircArr(a);
  }, []);

  const addLog = (msg, type = "info") => setLog(l => [...l.slice(-30), { msg, type }]);

  const enqueue = () => {
    const v = Number(input); if (!input || isNaN(v)) return;
    if (mode === "linear") {
      let a = [...queue];
      if (posInput === "front") a = [v, ...a];
      else if (posInput === "rear") { a = [...a, v]; setFlashRear(true); setTimeout(() => setFlashRear(false), 500); }
      else { const p = Math.max(0, Math.min(a.length, Number(customPos) || 0)); a.splice(p, 0, v); }
      setQueue(a); addLog(`Enqueued ${v} at ${posInput}`, "success");
    } else {
      if (circSize >= MAX) { addLog("Queue full!", "error"); setInput(""); return; }
      const nr = (rear + 1) % MAX;
      setCircArr(a => { const n = [...a]; n[nr] = v; return n; });
      setRear(nr); setCircSize(s => s + 1);
      setFlashRear(true); setTimeout(() => setFlashRear(false), 500);
      addLog(`Enqueued ${v} at slot ${nr}`, "success");
    }
    setInput("");
  };

  const dequeue = () => {
    if (mode === "linear") {
      if (!queue.length) { addLog("Queue underflow!", "error"); return; }
      addLog(`Dequeued ${queue[0]} from FRONT`, "success");
      setQueue(q => q.slice(1)); setFlashFront(true); setTimeout(() => setFlashFront(false), 500);
    } else {
      if (circSize <= 0) { addLog("Queue underflow!", "error"); return; }
      addLog(`Dequeued ${circArr[front]} from slot ${front}`, "success");
      setCircArr(a => { const n = [...a]; n[front] = null; return n; });
      setFront(f => (f + 1) % MAX); setCircSize(s => s - 1);
      setFlashFront(true); setTimeout(() => setFlashFront(false), 500);
    }
  };

  const theory = [
    { name: "Enqueue", time: "O(1)", space: "O(1)", desc: "Add element to the REAR. Pointer advances forward." },
    { name: "Dequeue", time: "O(1)", space: "O(1)", desc: "Remove element from FRONT. Raises underflow on empty queue." },
    { name: "Circular Queue", time: "O(1)", space: "O(n)", desc: "Rear wraps to front via modulo. Avoids wasted space. (rear+1) % capacity." },
    { name: "FIFO Principle", time: "—", space: "—", desc: "First-In, First-Out. First added is first removed. Like a real waiting line." },
  ];

  return (
    <div>
      <SectionHeader title="Queue (FIFO)" icon="⇒" color={C} simple='A "line" of data — first one in is first one out.' />
      <TabBar color={C} active={tab} setActive={setTab}
        tabs={[{ id: "demo", label: "▶ Demo" }, { id: "theory", label: "📐 Theory" }, { id: "code", label: "{ } Python Code" }]} />

      {tab === "demo" && (
        <div>
          <div style={{ background: G.panel, border: `1px solid ${G.border}`, borderRadius: 10, padding: 18, marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              <Btn color={C} onClick={() => setMode("linear")} variant={mode === "linear" ? "fill" : "outline"}>Linear</Btn>
              <Btn color={C} onClick={() => setMode("circular")} variant={mode === "circular" ? "fill" : "outline"}>Circular</Btn>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              {mode === "linear" && (
                <Select value={posInput} onChange={setPosInput} color={C}
                  options={[{ value: "rear", label: "Insert: Rear" }, { value: "front", label: "Insert: Front" }, { value: "custom", label: "Insert: Index N" }]} />
              )}
              <Input value={input} onChange={setInput} placeholder="value" width={70} onEnter={enqueue} />
              {posInput === "custom" && mode === "linear" && <Input value={customPos} onChange={setCustomPos} placeholder="index" width={60} />}
              <Btn color={C} onClick={enqueue}>Enqueue</Btn>
              <Btn color={C + "aa"} onClick={dequeue} variant="outline">Dequeue (front)</Btn>
            </div>
            {mode === "linear" ? (
              <div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 0, overflowX: "auto", paddingBottom: 8 }}>
                  {queue.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 2 }}>
                      <span style={{ fontSize: 9, color: C + "88", fontFamily: G.font }}>FRONT</span>
                      <span style={{ color: C + "88" }}>↓</span>
                    </div>
                  )}
                  {queue.map((v, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center" }}>
                      <div onClick={() => { const val = queue[i]; setQueue(q => q.filter((_, j) => j !== i)); addLog(`Deleted ${val}`, "success"); }}
                        style={{
                          width: 56, height: 52, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1,
                          background: (i === 0 && flashFront) ? C + "55" : i === 0 ? C + "22" : (i === queue.length - 1 && flashRear) ? C + "33" : G.dim,
                          border: `1px solid ${i === 0 || i === queue.length - 1 ? C + "99" : G.border}`,
                          borderRadius: 7, color: i === 0 ? C : G.text, cursor: "pointer", transition: "all 0.25s", fontFamily: G.font, fontSize: 14, fontWeight: 700
                        }}>
                        <span style={{ fontSize: 8, color: G.muted }}>[{i}]</span>{v}
                      </div>
                      {i < queue.length - 1 && <div style={{ color: C + "44", padding: "0 2px", fontSize: 14 }}>→</div>}
                    </div>
                  ))}
                  {queue.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: 4 }}>
                      <span style={{ fontSize: 9, color: C + "88", fontFamily: G.font }}>REAR</span>
                      <span style={{ color: C + "88" }}>↓</span>
                    </div>
                  )}
                  {!queue.length && <div style={{ color: G.muted, fontSize: 13 }}>Empty Queue</div>}
                </div>
                <div style={{ fontSize: 10, color: G.muted, marginTop: 4 }}>Click any cell to delete</div>
              </div>
            ) : (
              <div>
                <div style={{ position: "relative", width: 220, height: 220, margin: "10px auto" }}>
                  {circArr.map((v, i) => {
                    const angle = (i / MAX) * 2 * Math.PI - Math.PI / 2;
                    const r = 82, x = 110 + r * Math.cos(angle), y = 110 + r * Math.sin(angle);
                    const occ = v !== null, isFront = i === front && occ, isRear = i === rear && occ;
                    return (
                      <div key={i} onClick={() => { if (!occ) return; setCircArr(a => { const n = [...a]; n[i] = null; return n; }); setCircSize(s => s - 1); addLog(`Deleted from slot ${i}`, "success"); }}
                        style={{
                          position: "absolute", width: 42, height: 42, left: x - 21, top: y - 21,
                          display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 1,
                          background: occ ? (isFront && flashFront ? C + "55" : isRear && flashRear ? C + "44" : C + "15") : "#04050a",
                          border: `1px solid ${isFront || isRear ? C : occ ? C + "55" : G.border}`,
                          borderRadius: "50%", cursor: occ ? "pointer" : "default", transition: "all 0.3s", fontFamily: G.font
                        }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: occ ? C : G.muted }}>{v !== null ? v : i}</span>
                        {isFront && <span style={{ fontSize: 7, color: C + "88" }}>F</span>}
                        {isRear && !isFront && <span style={{ fontSize: 7, color: C + "88" }}>R</span>}
                      </div>
                    );
                  })}
                  <div style={{
                    position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                    fontSize: 11, color: G.muted, textAlign: "center", fontFamily: G.font
                  }}>
                    <div>{circSize}/{MAX}</div><div style={{ fontSize: 9 }}>slots used</div>
                  </div>
                </div>
                <div style={{ fontSize: 10, color: G.muted, textAlign: "center" }}>Click any slot to delete</div>
              </div>
            )}
          </div>
          <Log entries={log} color={C} />
        </div>
      )}
      {tab === "theory" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {theory.map(c => <TheoryCard key={c.name} concept={c} color={C} />)}
        </div>
      )}
      {tab === "code" && (
        <CodePanel color={C} snippets={[
          { label: "Linear Queue", key: "queue_linear" },
          { label: "Circular Queue", key: "queue_circular" },
        ]} />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   OVERVIEW
══════════════════════════════════════════════════════════════ */
function Overview({ onSelect }) {
  const bigO = [
    { n: "O(1)", label: "Constant", ex: "Hash lookup, Stack push/pop", bar: 4 },
    { n: "O(log n)", label: "Logarithmic", ex: "Binary Search", bar: 14 },
    { n: "O(n)", label: "Linear", ex: "Linear Search, Linked List traversal", bar: 30 },
    { n: "O(n log n)", label: "Linearithmic", ex: "Merge Sort", bar: 50 },
    { n: "O(n²)", label: "Quadratic", ex: "Bubble, Selection, Insertion Sort", bar: 80 },
    { n: "O(2ⁿ)", label: "Exponential", ex: "Recursive subsets", bar: 100 },
  ];
  const clrs = ["#4ade80", "#a3e635", "#fbbf24", "#fb923c", "#f87171", "#c084fc"];

  return (
    <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
      {/* Hero */}
      <div style={{
        marginBottom: 36, padding: "36px 40px",
        background: "linear-gradient(135deg, rgba(56,189,248,0.08) 0%, rgba(129,140,248,0.06) 50%, rgba(56,189,248,0.04) 100%)",
        border: "1px solid rgba(56,189,248,0.15)",
        borderRadius: 20, position: "relative", overflow: "hidden",
      }}>
        {/* Decorative glow orb */}
        <div style={{
          position: "absolute", right: -60, top: -60,
          width: 260, height: 260, borderRadius: "50%",
          background: "radial-gradient(circle, #38bdf812 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          fontSize: 11, color: "#38bdf8", letterSpacing: 3, textTransform: "uppercase",
          fontFamily: G.mono, marginBottom: 14, fontWeight: 600,
        }}>◈ Interactive Dashboard</div>
        <h1 style={{
          margin: "0 0 10px", fontSize: 38, fontWeight: 900,
          fontFamily: G.font, letterSpacing: -1.5, lineHeight: 1.15,
          color: "#f0f8ff",
        }}>
          Data Structures
          <span style={{
            display: "block",
            background: "linear-gradient(135deg, #38bdf8, #818cf8)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>& Algorithms</span>
        </h1>
        <p style={{
          color: G.mutedHi, fontSize: 13, maxWidth: 500, lineHeight: 1.8,
          fontFamily: G.font, margin: 0,
        }}>
          Live demos, complexity theory cards, and full Python implementations — all 6 core CS topics in one place.
        </p>
      </div>

      {/* Topic Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 14, marginBottom: 32,
      }}>
        {topics.map(t => (
          <div key={t.id} onClick={() => onSelect(t.id)}
            style={{
              background: G.dim, border: `1px solid ${t.color}25`,
              borderRadius: 14, padding: "22px 20px",
              cursor: "pointer", transition: "all 0.22s",
              borderTop: `2px solid ${t.color}`,
              position: "relative", overflow: "hidden",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = t.color + "12";
              e.currentTarget.style.boxShadow = G.glow(t.color, 14);
              e.currentTarget.style.borderColor = t.color + "55";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = G.dim;
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = t.color + "25";
              e.currentTarget.style.transform = "none";
            }}>
            <div style={{ fontSize: 30, marginBottom: 12 }}>{t.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: t.color, marginBottom: 6, fontFamily: G.font }}>{t.label}</div>
            <div style={{ fontSize: 11, color: G.mutedHi, fontFamily: G.font }}>Demo · Theory · Code →</div>
          </div>
        ))}
      </div>

      {/* Big-O Chart */}
      <div style={{
        background: G.dim, border: `1px solid ${G.border}`,
        borderRadius: 16, padding: 26,
      }}>
        <div style={{ fontSize: 10, color: G.mutedHi, marginBottom: 18, textTransform: "uppercase", letterSpacing: 2, fontFamily: G.mono }}>⏱ Big-O Complexity Reference</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {bigO.map((o, i) => (
            <div key={o.n} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 88, fontSize: 12, fontFamily: G.mono, color: clrs[i], textAlign: "right", flexShrink: 0, fontWeight: 700 }}>{o.n}</div>
              <div style={{ flex: 1, height: 20, background: "rgba(4,8,20,0.8)", borderRadius: 6, overflow: "hidden", border: "1px solid " + G.border }}>
                <div style={{
                  width: `${o.bar}%`, height: "100%",
                  background: `linear-gradient(90deg, ${clrs[i]}99, ${clrs[i]}44)`,
                  borderRadius: 6, transition: "width 0.6s ease",
                }} />
              </div>
              <div style={{ width: 230, fontSize: 11, color: G.mutedHi, flexShrink: 0, fontFamily: G.font }}>{o.ex}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════════════ */
const sectionMap = { searching: SearchingSection, sorting: SortingSection, stack: StackSection, linkedlist: LinkedListSection, hash: HashSection, queue: QueueSection };

export default function App() {
  const [active, setActive] = useState("overview");
  const [sideOpen, setSideOpen] = useState(true);
  const ActiveSection = active !== "overview" ? sectionMap[active] : null;
  const activeTopic = topics.find(t => t.id === active);

  return (
    <div style={{
      display: "flex", height: "100vh",
      background: G.bg,
      backgroundImage: "radial-gradient(ellipse at 20% 50%, rgba(56,189,248,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(129,140,248,0.04) 0%, transparent 60%)",
      color: G.text, fontFamily: G.font, overflow: "hidden",
    }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: sideOpen ? 230 : 60, flexShrink: 0,
        background: "rgba(4,8,22,0.95)",
        borderRight: `1px solid ${G.border}`,
        backdropFilter: "blur(12px)",
        display: "flex", flexDirection: "column",
        transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{
          padding: sideOpen ? "20px 16px 16px" : "20px 10px 16px",
          borderBottom: `1px solid ${G.border}`,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 34, height: 34, flexShrink: 0,
            background: "linear-gradient(135deg, #38bdf830, #818cf820)",
            border: "1px solid #38bdf840", borderRadius: 9,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, boxShadow: G.glow("#38bdf8", 8),
          }}>⌬</div>
          {sideOpen && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#f0f8ff", fontFamily: G.font, letterSpacing: -0.3 }}>DS&amp;A</div>
              <div style={{ fontSize: 9, color: G.mutedHi, letterSpacing: 2, textTransform: "uppercase" }}>Dashboard</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
          {/* Overview */}
          <button onClick={() => setActive("overview")}
            style={{
              width: "100%", display: "flex", alignItems: "center",
              gap: 10, padding: sideOpen ? "11px 16px" : "11px 13px",
              background: active === "overview" ? "rgba(56,189,248,0.1)" : "transparent",
              borderLeft: `3px solid ${active === "overview" ? "#38bdf8" : "transparent"}`,
              border: "none", cursor: "pointer",
              color: active === "overview" ? "#38bdf8" : G.mutedHi,
              fontSize: 12.5, fontFamily: G.font, fontWeight: active === "overview" ? 700 : 400,
              transition: "all 0.15s", textAlign: "left", whiteSpace: "nowrap",
              boxShadow: active === "overview" ? "inset 0 0 20px rgba(56,189,248,0.05)" : "none",
            }}>
            <span style={{ fontSize: 17, flexShrink: 0 }}>◈</span>
            {sideOpen && "Overview"}
          </button>

          {sideOpen && (
            <div style={{
              padding: "10px 16px 4px", fontSize: 9,
              color: G.muted, textTransform: "uppercase", letterSpacing: 2.5, fontFamily: G.mono,
            }}>Topics</div>
          )}

          {topics.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                gap: 10, padding: sideOpen ? "11px 16px" : "11px 13px",
                background: active === t.id ? t.color + "14" : "transparent",
                borderLeft: `3px solid ${active === t.id ? t.color : "transparent"}`,
                border: "none", cursor: "pointer",
                color: active === t.id ? t.color : G.mutedHi,
                fontSize: 12.5, fontFamily: G.font, fontWeight: active === t.id ? 700 : 400,
                transition: "all 0.15s", textAlign: "left", whiteSpace: "nowrap",
                boxShadow: active === t.id ? `inset 0 0 20px ${t.color}08` : "none",
              }}
              onMouseEnter={e => { if (active !== t.id) e.currentTarget.style.color = t.color + "cc"; }}
              onMouseLeave={e => { if (active !== t.id) e.currentTarget.style.color = G.mutedHi; }}>
              <span style={{ fontSize: 17, flexShrink: 0 }}>{t.icon}</span>
              {sideOpen && t.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        {sideOpen && (
          <div style={{
            padding: "12px 16px", borderTop: `1px solid ${G.border}`,
            fontSize: 10, color: G.muted, fontFamily: G.mono, lineHeight: 1.6,
          }}>
            <div>Due: 05-03-2026</div>
            <div style={{ marginTop: 2, opacity: 0.7 }}>≤ 2 students / group</div>
          </div>
        )}

        {/* Toggle */}
        <button onClick={() => setSideOpen(s => !s)}
          style={{
            padding: "11px", background: "transparent", border: "none",
            borderTop: `1px solid ${G.border}`, cursor: "pointer",
            color: G.mutedHi, fontSize: 15, fontFamily: G.font,
            transition: "color 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#38bdf8"}
          onMouseLeave={e => e.currentTarget.style.color = G.mutedHi}>
          {sideOpen ? "◂" : "▸"}
        </button>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <div style={{
          padding: "14px 28px",
          borderBottom: `1px solid ${G.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(4,8,22,0.8)",
          backdropFilter: "blur(12px)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {activeTopic && (
              <span style={{
                width: 28, height: 28, borderRadius: 7,
                background: activeTopic.color + "18",
                border: `1px solid ${activeTopic.color}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15,
              }}>{activeTopic.icon}</span>
            )}
            <span style={{
              fontSize: 15, fontWeight: 700, fontFamily: G.font,
              color: activeTopic ? activeTopic.color : "#f0f8ff",
            }}>
              {active === "overview" ? "Overview" : activeTopic?.label}
            </span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 10, color: G.muted, fontFamily: G.mono }}>DS&amp;A Dashboard</span>
            <div style={{
              padding: "4px 14px",
              background: "linear-gradient(135deg, #38bdf812, #818cf808)",
              border: "1px solid #38bdf830", borderRadius: 20,
              fontSize: 11, color: "#38bdf8", fontFamily: G.mono, fontWeight: 600,
            }}>05 · 03 · 2026</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "32px 36px", flex: 1 }}>
          {active === "overview"
            ? <Overview onSelect={setActive} />
            : ActiveSection && <ActiveSection />}
        </div>
      </main>
    </div>
  );
}
