# Data Structures in C - Function Code Only

## 1. Stack using Array

### Push
```c
void push(int x) {
    if (top == MAX - 1) {
        printf("Stack Overflow!\n");
    } else {
        stack[++top] = x;
        printf("%d pushed to stack\n", x);
    }
}
```

### Pop
```c
void pop() {
    if (top == -1) {
        printf("Stack Underflow!\n");
    } else {
        printf("%d popped from stack\n", stack[top--]);
    }
}
```

### Peek
```c
void peek() {
    if (top == -1) {
        printf("Stack is empty\n");
    } else {
        printf("Top element: %d\n", stack[top]);
    }
}
```

### Display
```c
void display() {
    if (top == -1) {
        printf("Stack is empty\n");
    } else {
        printf("Stack elements: ");
        for (int i = top; i >= 0; i--) {
            printf("%d ", stack[i]);
        }
        printf("\n");
    }
}
```

---

## 2. Stack using Structure

### Initialize Stack
```c
void initStack(Stack *s) {
    s->top = -1;
}
```

### Push
```c
void push(Stack *s, int x) {
    if (s->top == MAX - 1) {
        printf("Stack Overflow!\n");
    } else {
        s->arr[++s->top] = x;
        printf("%d pushed\n", x);
    }
}
```

### Pop
```c
void pop(Stack *s) {
    if (s->top == -1) {
        printf("Stack Underflow!\n");
    } else {
        printf("%d popped\n", s->arr[s->top--]);
    }
}
```

### Display
```c
void display(Stack *s) {
    if (s->top == -1) {
        printf("Stack is empty\n");
    } else {
        printf("Stack: ");
        for (int i = s->top; i >= 0; i--) {
            printf("%d ", s->arr[i]);
        }
        printf("\n");
    }
}
```

---

## 3. Infix to Postfix Conversion

### Push
```c
void push(char c) {
    stack[++top] = c;
}
```

### Pop
```c
char pop() {
    return stack[top--];
}
```

### Peek
```c
char peek() {
    return stack[top];
}
```

### Precedence
```c
int precedence(char c) {
    if (c == '^') return 3;
    if (c == '*' || c == '/') return 2;
    if (c == '+' || c == '-') return 1;
    return 0;
}
```

### Infix to Postfix
```c
void infixToPostfix(char *infix) {
    char postfix[100];
    int j = 0;
    
    for (int i = 0; i < strlen(infix); i++) {
        char c = infix[i];
        
        if (isalnum(c)) {
            postfix[j++] = c;
        } else if (c == '(') {
            push(c);
        } else if (c == ')') {
            while (top != -1 && peek() != '(') {
                postfix[j++] = pop();
            }
            pop();
        } else {
            while (top != -1 && precedence(peek()) >= precedence(c)) {
                postfix[j++] = pop();
            }
            push(c);
        }
    }
    
    while (top != -1) {
        postfix[j++] = pop();
    }
    
    postfix[j] = '\0';
    printf("Postfix: %s\n", postfix);
}
```

---

## 4. Postfix Evaluation

### Push
```c
void push(int x) {
    stack[++top] = x;
}
```

### Pop
```c
int pop() {
    return stack[top--];
}
```

### Evaluate Postfix
```c
int evaluatePostfix(char *exp) {
    for (int i = 0; i < strlen(exp); i++) {
        char c = exp[i];
        
        if (isdigit(c)) {
            push(c - '0');
        } else {
            int val2 = pop();
            int val1 = pop();
            
            switch (c) {
                case '+': push(val1 + val2); break;
                case '-': push(val1 - val2); break;
                case '*': push(val1 * val2); break;
                case '/': push(val1 / val2); break;
                case '^': push(pow(val1, val2)); break;
            }
        }
    }
    return pop();
}
```

---

## 5. Linear Queue using Array

### Enqueue
```c
void enqueue(int x) {
    if (rear == SIZE - 1) {
        printf("Queue Overflow!\n");
    } else {
        if (front == -1) front = 0;
        queue[++rear] = x;
        printf("%d enqueued\n", x);
    }
}
```

### Dequeue
```c
void dequeue() {
    if (front == -1 || front > rear) {
        printf("Queue Underflow!\n");
    } else {
        printf("%d dequeued\n", queue[front++]);
        if (front > rear) {
            front = rear = -1;
        }
    }
}
```

### Display
```c
void display() {
    if (front == -1 || front > rear) {
        printf("Queue is empty\n");
    } else {
        printf("Queue: ");
        for (int i = front; i <= rear; i++) {
            printf("%d ", queue[i]);
        }
        printf("\n");
    }
}
```

---

## 6. Circular Queue using Structure

### Initialize Queue
```c
void initQueue(CircularQueue *q) {
    q->front = q->rear = -1;
}
```

### Is Full
```c
int isFull(CircularQueue *q) {
    return (q->front == 0 && q->rear == SIZE - 1) || (q->front == q->rear + 1);
}
```

### Is Empty
```c
int isEmpty(CircularQueue *q) {
    return q->front == -1;
}
```

### Enqueue
```c
void enqueue(CircularQueue *q, int x) {
    if (isFull(q)) {
        printf("Queue Overflow!\n");
    } else {
        if (q->front == -1) q->front = 0;
        q->rear = (q->rear + 1) % SIZE;
        q->arr[q->rear] = x;
        printf("%d enqueued\n", x);
    }
}
```

### Dequeue
```c
void dequeue(CircularQueue *q) {
    if (isEmpty(q)) {
        printf("Queue Underflow!\n");
    } else {
        printf("%d dequeued\n", q->arr[q->front]);
        if (q->front == q->rear) {
            q->front = q->rear = -1;
        } else {
            q->front = (q->front + 1) % SIZE;
        }
    }
}
```

### Display
```c
void display(CircularQueue *q) {
    if (isEmpty(q)) {
        printf("Queue is empty\n");
    } else {
        printf("Queue: ");
        int i = q->front;
        while (1) {
            printf("%d ", q->arr[i]);
            if (i == q->rear) break;
            i = (i + 1) % SIZE;
        }
        printf("\n");
    }
}
```

---

## 7. Priority Queue

### Initialize Queue
```c
void initQueue(PriorityQueue *pq) {
    pq->n = 0;
}
```

### Enqueue
```c
void enqueue(PriorityQueue *pq, int val, int pri) {
    if (pq->n == SIZE) {
        printf("Queue Overflow!\n");
    } else {
        pq->data[pq->n] = val;
        pq->priority[pq->n] = pri;
        pq->n++;
        printf("%d with priority %d enqueued\n", val, pri);
    }
}
```

### Dequeue
```c
void dequeue(PriorityQueue *pq) {
    if (pq->n == 0) {
        printf("Queue Underflow!\n");
    } else {
        int highest = 0;
        for (int i = 1; i < pq->n; i++) {
            if (pq->priority[i] < pq->priority[highest]) {
                highest = i;
            }
        }
        
        printf("%d dequeued (priority %d)\n", pq->data[highest], pq->priority[highest]);
        
        for (int i = highest; i < pq->n - 1; i++) {
            pq->data[i] = pq->data[i + 1];
            pq->priority[i] = pq->priority[i + 1];
        }
        pq->n--;
    }
}
```

### Display
```c
void display(PriorityQueue *pq) {
    if (pq->n == 0) {
        printf("Queue is empty\n");
    } else {
        printf("Data:     ");
        for (int i = 0; i < pq->n; i++) printf("%d ", pq->data[i]);
        printf("\nPriority: ");
        for (int i = 0; i < pq->n; i++) printf("%d ", pq->priority[i]);
        printf("\n");
    }
}
```

---

## 8. Singly Linked List

### Insert at Beginning
```c
void insertBegin(int val) {
    Node *newNode = (Node *)malloc(sizeof(Node));
    newNode->data = val;
    newNode->next = head;
    head = newNode;
    printf("%d inserted at beginning\n", val);
}
```

### Insert at End
```c
void insertEnd(int val) {
    Node *newNode = (Node *)malloc(sizeof(Node));
    newNode->data = val;
    newNode->next = NULL;
    
    if (head == NULL) {
        head = newNode;
    } else {
        Node *temp = head;
        while (temp->next != NULL) {
            temp = temp->next;
        }
        temp->next = newNode;
    }
    printf("%d inserted at end\n", val);
}
```

### Delete Node
```c
void deleteNode(int val) {
    if (head == NULL) {
        printf("List is empty\n");
        return;
    }
    
    if (head->data == val) {
        Node *temp = head;
        head = head->next;
        free(temp);
        printf("%d deleted\n", val);
        return;
    }
    
    Node *temp = head;
    while (temp->next != NULL && temp->next->data != val) {
        temp = temp->next;
    }
    
    if (temp->next == NULL) {
        printf("Value not found\n");
    } else {
        Node *del = temp->next;
        temp->next = del->next;
        free(del);
        printf("%d deleted\n", val);
    }
}
```

### Display
```c
void display() {
    if (head == NULL) {
        printf("List is empty\n");
    } else {
        Node *temp = head;
        printf("List: ");
        while (temp != NULL) {
            printf("%d ", temp->data);
            temp = temp->next;
        }
        printf("\n");
    }
}
```

---

## 9. Doubly Linked List

### Insert at Beginning
```c
void insertBegin(int val) {
    Node *newNode = (Node *)malloc(sizeof(Node));
    newNode->data = val;
    newNode->prev = NULL;
    newNode->next = head;
    
    if (head != NULL) {
        head->prev = newNode;
    }
    head = newNode;
    printf("%d inserted at beginning\n", val);
}
```

### Insert at End
```c
void insertEnd(int val) {
    Node *newNode = (Node *)malloc(sizeof(Node));
    newNode->data = val;
    newNode->next = NULL;
    
    if (head == NULL) {
        newNode->prev = NULL;
        head = newNode;
    } else {
        Node *temp = head;
        while (temp->next != NULL) {
            temp = temp->next;
        }
        temp->next = newNode;
        newNode->prev = temp;
    }
    printf("%d inserted at end\n", val);
}
```

### Delete Node
```c
void deleteNode(int val) {
    Node *temp = head;
    
    while (temp != NULL && temp->data != val) {
        temp = temp->next;
    }
    
    if (temp == NULL) {
        printf("Value not found\n");
        return;
    }
    
    if (temp->prev != NULL) {
        temp->prev->next = temp->next;
    } else {
        head = temp->next;
    }
    
    if (temp->next != NULL) {
        temp->next->prev = temp->prev;
    }
    
    free(temp);
    printf("%d deleted\n", val);
}
```

### Display Forward
```c
void displayForward() {
    Node *temp = head;
    printf("Forward: ");
    while (temp != NULL) {
        printf("%d ", temp->data);
        temp = temp->next;
    }
    printf("\n");
}
```

### Display Backward
```c
void displayBackward() {
    if (head == NULL) return;
    
    Node *temp = head;
    while (temp->next != NULL) {
        temp = temp->next;
    }
    
    printf("Backward: ");
    while (temp != NULL) {
        printf("%d ", temp->data);
        temp = temp->prev;
    }
    printf("\n");
}
```

---

## 10. Singly Circular Linked List

### Insert at End
```c
void insertEnd(int val) {
    Node *newNode = (Node *)malloc(sizeof(Node));
    newNode->data = val;
    
    if (head == NULL) {
        head = newNode;
        newNode->next = head;
    } else {
        Node *temp = head;
        while (temp->next != head) {
            temp = temp->next;
        }
        temp->next = newNode;
        newNode->next = head;
    }
    printf("%d inserted\n", val);
}
```

### Delete Node
```c
void deleteNode(int val) {
    if (head == NULL) {
        printf("List is empty\n");
        return;
    }
    
    Node *temp = head, *prev = NULL;
    
    do {
        if (temp->data == val) {
            if (prev) {
                prev->next = temp->next;
            } else {
                Node *last = head;
                while (last->next != head) {
                    last = last->next;
                }
                head = temp->next;
                last->next = head;
            }
            free(temp);
            printf("%d deleted\n", val);
            return;
        }
        prev = temp;
        temp = temp->next;
    } while (temp != head);
    
    printf("Value not found\n");
}
```

### Display
```c
void display() {
    if (head == NULL) {
        printf("List is empty\n");
        return;
    }
    
    Node *temp = head;
    printf("List: ");
    do {
        printf("%d ", temp->data);
        temp = temp->next;
    } while (temp != head);
    printf("\n");
}
```

---

## 11. Doubly Circular Linked List

### Insert at End
```c
void insertEnd(int val) {
    Node *newNode = (Node *)malloc(sizeof(Node));
    newNode->data = val;
    
    if (head == NULL) {
        head = newNode;
        head->next = head->prev = head;
    } else {
        Node *tail = head->prev;
        tail->next = newNode;
        newNode->prev = tail;
        newNode->next = head;
        head->prev = newNode;
    }
    printf("%d inserted\n", val);
}
```

### Delete Node
```c
void deleteNode(int val) {
    if (head == NULL) return;
    
    Node *temp = head;
    do {
        if (temp->data == val) {
            temp->prev->next = temp->next;
            temp->next->prev = temp->prev;
            if (temp == head) {
                head = (temp->next != temp) ? temp->next : NULL;
            }
            free(temp);
            printf("%d deleted\n", val);
            return;
        }
        temp = temp->next;
    } while (temp != head);
    
    printf("Value not found\n");
}
```

### Display Forward
```c
void displayForward() {
    if (head == NULL) {
        printf("List is empty\n");
        return;
    }
    
    Node *temp = head;
    printf("Forward: ");
    do {
        printf("%d ", temp->data);
        temp = temp->next;
    } while (temp != head);
    printf("\n");
}
```

---

## 12. Stack using Linked List

### Push
```c
void push(int val) {
    Node *newNode = (Node *)malloc(sizeof(Node));
    newNode->data = val;
    newNode->next = top;
    top = newNode;
    printf("%d pushed\n", val);
}
```

### Pop
```c
void pop() {
    if (top == NULL) {
        printf("Stack Underflow!\n");
    } else {
        Node *temp = top;
        printf("%d popped\n", top->data);
        top = top->next;
        free(temp);
    }
}
```

### Peek
```c
void peek() {
    if (top == NULL) {
        printf("Stack is empty\n");
    } else {
        printf("Top element: %d\n", top->data);
    }
}
```

### Display
```c
void display() {
    Node *temp = top;
    printf("Stack: ");
    while (temp != NULL) {
        printf("%d ", temp->data);
        temp = temp->next;
    }
    printf("\n");
}
```

---

## 13. Queue using Linked List

### Enqueue
```c
void enqueue(int val) {
    Node *newNode = (Node *)malloc(sizeof(Node));
    newNode->data = val;
    newNode->next = NULL;
    
    if (rear == NULL) {
        front = rear = newNode;
    } else {
        rear->next = newNode;
        rear = newNode;
    }
    printf("%d enqueued\n", val);
}
```

### Dequeue
```c
void dequeue() {
    if (front == NULL) {
        printf("Queue Underflow!\n");
    } else {
        Node *temp = front;
        printf("%d dequeued\n", front->data);
        front = front->next;
        if (front == NULL) {
            rear = NULL;
        }
        free(temp);
    }
}
```

### Display
```c
void display() {
    if (front == NULL) {
        printf("Queue is empty\n");
    } else {
        Node *temp = front;
        printf("Queue: ");
        while (temp != NULL) {
            printf("%d ", temp->data);
            temp = temp->next;
        }
        printf("\n");
    }
}
```

---

## 14. Polynomial Addition using Linked List

### Insert Term
```c
Node* insertTerm(Node *head, int c, int e) {
    Node *newNode = (Node *)malloc(sizeof(Node));
    newNode->coeff = c;
    newNode->exp = e;
    newNode->next = NULL;
    
    if (head == NULL || e > head->exp) {
        newNode->next = head;
        return newNode;
    }
    
    Node *temp = head;
    while (temp->next != NULL && temp->next->exp > e) {
        temp = temp->next;
    }
    
    if (temp->next != NULL && temp->next->exp == e) {
        temp->next->coeff += c;
    } else {
        newNode->next = temp->next;
        temp->next = newNode;
    }
    
    return head;
}
```

### Add Polynomials
```c
Node* addPolynomials(Node *p1, Node *p2) {
    Node *result = NULL;
    
    while (p1 != NULL) {
        result = insertTerm(result, p1->coeff, p1->exp);
        p1 = p1->next;
    }
    
    while (p2 != NULL) {
        result = insertTerm(result, p2->coeff, p2->exp);
        p2 = p2->next;
    }
    
    return result;
}
```

### Display
```c
void display(Node *head) {
    if (head == NULL) {
        printf("0\n");
        return;
    }
    
    while (head != NULL) {
        printf("%dx^%d", head->coeff, head->exp);
        if (head->next != NULL) {
            printf(" + ");
        }
        head = head->next;
    }
    printf("\n");
}
```

---

## 15. Binary Search Tree

### Create Node
```c
Node* createNode(int val) {
    Node *newNode = (Node *)malloc(sizeof(Node));
    newNode->data = val;
    newNode->left = newNode->right = NULL;
    return newNode;
}
```

### Insert
```c
Node* insert(Node *root, int val) {
    if (root == NULL) {
        return createNode(val);
    }
    
    if (val < root->data) {
        root->left = insert(root->left, val);
    } else {
        root->right = insert(root->right, val);
    }
    
    return root;
}
```

### Inorder Traversal (LNR)
```c
void inorder(Node *root) {
    if (root != NULL) {
        inorder(root->left);
        printf("%d ", root->data);
        inorder(root->right);
    }
}
```

### Preorder Traversal (NLR)
```c
void preorder(Node *root) {
    if (root != NULL) {
        printf("%d ", root->data);
        preorder(root->left);
        preorder(root->right);
    }
}
```

### Postorder Traversal (LRN)
```c
void postorder(Node *root) {
    if (root != NULL) {
        postorder(root->left);
        postorder(root->right);
        printf("%d ", root->data);
    }
}
```

---

## 16. Graph using Adjacency Matrix

### Initialize Graph
```c
void initGraph() {
    for (int i = 0; i < MAX; i++) {
        for (int j = 0; j < MAX; j++) {
            adj[i][j] = 0;
        }
    }
}
```

### Add Edge
```c
void addEdge(int u, int v) {
    adj[u][v] = 1;
    adj[v][u] = 1;
    printf("Edge added between %d and %d\n", u, v);
}
```

### Remove Edge
```c
void removeEdge(int u, int v) {
    adj[u][v] = 0;
    adj[v][u] = 0;
    printf("Edge removed between %d and %d\n", u, v);
}
```

### Display
```c
void display() {
    printf("\nAdjacency Matrix:\n");
    printf("  ");
    for (int i = 0; i < MAX; i++) {
        printf("%d ", i);
    }
    printf("\n");
    
    for (int i = 0; i < MAX; i++) {
        printf("%d ", i);
        for (int j = 0; j < MAX; j++) {
            printf("%d ", adj[i][j]);
        }
        printf("\n");
    }
}
```

### Display Neighbors
```c
void displayNeighbors(int vertex) {
    printf("Neighbors of vertex %d: ", vertex);
    for (int i = 0; i < MAX; i++) {
        if (adj[vertex][i] == 1) {
            printf("%d ", i);
        }
    }
    printf("\n");
}
```
