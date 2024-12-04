# Combined Markdown, TeX, and Mermaid Example

## 1. Mathematical Formulas

### Basic Equations
Here's a simple quadratic equation: $ax^2 + bx + c = 0$

The solutions are given by the quadratic formula:
$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

### Complex Mathematics
The Euler's formula states that:
$$e^{ix} = \cos(x) + i\sin(x)$$

A beautiful identity follows:
$$e^{i\pi} + 1 = 0$$

## 2. Flow Diagrams

### Simple Flow
```mermaid
graph LR
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
```

### State Machine
```mermaid
stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
```

## 3. Combined Example: Math Problem Solving

### Problem Statement
Let's solve a system of equations:
$$\begin{cases}
2x + y = 5 \\
x - y = 1
\end{cases}$$

### Solution Process
```mermaid
graph TD
    A[Start] --> B[Write System of Equations]
    B --> C{Choose Method}
    C -->|Method 1| D[Substitution]
    C -->|Method 2| E[Elimination]
    D --> F[Solve for y]
    E --> G[Add/Subtract Equations]
    F --> H[Substitute back]
    G --> I[Solve for x]
    H --> J[Final Answer]
    I --> J
    J --> K[Verify Solution]
```

### Solution
The solution is:
$$x = 2, \quad y = 1$$

## 4. Sequence Diagram Example

```mermaid
sequenceDiagram
    participant User
    participant System
    participant Database
    
    User->>System: Enter Data
    System->>System: Validate Input
    alt is valid
        System->>Database: Save Data
        Database-->>System: Confirm Save
        System-->>User: Show Success
    else is invalid
        System-->>User: Show Error
    end
```

## 5. Mathematical Proof with Diagram

### Theorem
For any right triangle with sides $a$, $b$, and hypotenuse $c$:
$$a^2 + b^2 = c^2$$

### Visual Proof
```mermaid
graph TD
    A[Square with side a+b] --> B[Four right triangles]
    B --> C[Inner square with side c]
    C --> D[Area comparison]
    D --> E["(a+b)² = 4(ab/2) + c²"]
    E --> F["a² + 2ab + b² = 2ab + c²"]
    F --> G["a² + b² = c²"]
```

### Algebraic Proof
Starting with the equation:
$$(a+b)^2 = 4\cdot\frac{ab}{2} + c^2$$

Expanding the left side:
$$a^2 + 2ab + b^2 = 2ab + c^2$$

Subtracting $2ab$ from both sides:
$$a^2 + b^2 = c^2 \quad \blacksquare$$
