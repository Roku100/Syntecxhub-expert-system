# 🧠 Rule-Based Expert System

A beginner-friendly implementation of a **forward chaining inference engine** in JavaScript. This project demonstrates how AI expert systems reason through rules to derive conclusions from known facts.

![Expert System Demo](https://img.shields.io/badge/Type-Expert%20System-blue)
![Forward Chaining](https://img.shields.io/badge/Algorithm-Forward%20Chaining-green)
![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow)

---

## 📚 Table of Contents

1. [What is an Expert System?](#-what-is-an-expert-system)
2. [Key Concepts](#-key-concepts)
3. [How Forward Chaining Works](#-how-forward-chaining-works)
4. [Project Structure](#-project-structure)
5. [Getting Started](#-getting-started)
6. [Using the Application](#-using-the-application)
7. [Code Walkthrough](#-code-walkthrough)
8. [Examples](#-examples)
9. [Extending the System](#-extending-the-system)

---

## 🤖 What is an Expert System?

An **Expert System** is a computer program that mimics the decision-making ability of a human expert. It uses:

- **Knowledge Base**: A collection of rules (IF-THEN statements)
- **Facts Base**: Known information about the current situation
- **Inference Engine**: The brain that applies rules to facts to derive new conclusions

### Real-World Applications

| Domain | Example Use |
|--------|-------------|
| Medicine | Diagnosing diseases from symptoms |
| Finance | Credit approval decisions |
| Tech Support | Troubleshooting problems |
| Agriculture | Crop disease identification |

---

## 📖 Key Concepts

### 1. Rules (IF-THEN Statements)

Rules encode expert knowledge in a simple format:

```
IF condition1 AND condition2 AND ... THEN conclusion
```

**Example:**
```
IF fever AND cough THEN respiratory_infection
```

This rule says: "If a patient has both fever AND cough, conclude they have a respiratory infection."

### 2. Facts

Facts are pieces of information that are known to be true. They can be:

- **Initial Facts**: Provided by the user (e.g., symptoms)
- **Inferred Facts**: Derived by firing rules

**Example Initial Facts:**
```
fever, cough, body_aches
```

### 3. Inference

Inference is the process of deriving new facts by applying rules. There are two main approaches:

| Method | Direction | Use Case |
|--------|-----------|----------|
| **Forward Chaining** | Data → Conclusions | "What can I conclude from these facts?" |
| **Backward Chaining** | Goal → Data | "What facts do I need to prove this goal?" |

This project uses **Forward Chaining**.

---

## ⚡ How Forward Chaining Works

Forward chaining is a **data-driven** approach. The algorithm:

```
1. Start with known facts
2. Find all rules whose conditions are satisfied
3. Fire matching rules (add their conclusions as new facts)
4. Repeat until no new facts can be derived
```

### Visual Example

```
Initial Facts: [fever, cough, body_aches]

ITERATION 1:
├── Check Rule 1: IF fever AND cough THEN respiratory_infection
│   └── ✅ Both conditions satisfied → ADD "respiratory_infection"
│
└── Facts: [fever, cough, body_aches, respiratory_infection]

ITERATION 2:
├── Check Rule 2: IF respiratory_infection AND body_aches THEN flu
│   └── ✅ Both conditions satisfied → ADD "flu"
│
└── Facts: [fever, cough, body_aches, respiratory_infection, flu]

ITERATION 3:
├── Check Rule 7: IF flu THEN recommend_rest
│   └── ✅ Condition satisfied → ADD "recommend_rest"
├── Check Rule 8: IF flu THEN recommend_fluids
│   └── ✅ Condition satisfied → ADD "recommend_fluids"
│
└── Facts: [..., flu, recommend_rest, recommend_fluids]

ITERATION 4:
└── No new rules can fire → DONE!

Final Conclusions: respiratory_infection, flu, recommend_rest, recommend_fluids
```

### Multi-Step Inference (Chaining)

Notice how conclusions from one rule become conditions for another:

```
fever + cough → respiratory_infection
                        ↓
respiratory_infection + body_aches → flu
                                      ↓
                                flu → recommend_rest
                                flu → recommend_fluids
```

This **chaining** allows complex reasoning from simple rules!

---

## 📁 Project Structure

```
Rule-Based Expert System/
│
├── index.html      # Main UI - the web page structure
├── styles.css      # Styling - makes it look beautiful
├── engine.js       # Core logic - the inference engine
├── app.js          # UI logic - connects engine to interface
└── README.md       # This documentation
```

### File Responsibilities

| File | What it Does |
|------|--------------|
| `engine.js` | Contains the `Rule` and `ExpertSystem` classes |
| `app.js` | Handles button clicks, renders rules/facts, updates the log |
| `index.html` | Defines the page layout and structure |
| `styles.css` | Makes everything look modern and professional |

---

## 🚀 Getting Started

### Prerequisites

- Any modern web browser (Chrome, Firefox, Edge, Safari)
- No installation required!

### Running the Application

1. **Download/Clone** the project folder
2. **Open** `index.html` in your web browser
3. That's it! No server or build tools needed.

```bash
# If you want to use a local server (optional):
cd "Rule-Based Expert System"
python -m http.server 8000
# Then visit: http://localhost:8000
```

---

## 🎮 Using the Application

### The Interface

The application has four main sections:

```
┌─────────────────┬──────────────────┬─────────────────┐
│   RULES PANEL   │  CONTROL PANEL   │  INFERENCE LOG  │
│                 │                  │                 │
│ • Add IF-THEN   │ • Run Inference  │ • Shows each    │
│   rules         │ • Clear All      │   reasoning     │
│ • View rules    │                  │   step          │
│ • Delete rules  │  CONCLUSIONS     │ • Which rules   │
│                 │                  │   fired         │
│   FACTS PANEL   │ • Shows derived  │ • What facts    │
│                 │   knowledge      │   were added    │
│ • Add facts     │                  │                 │
│ • View facts    │                  │                 │
└─────────────────┴──────────────────┴─────────────────┘
```

### Step-by-Step Guide

#### 1️⃣ Add Rules

Enter conditions (comma-separated) and a conclusion:

```
IF: fever, cough
THEN: cold
```

Click **"Add Rule"** to add it to the knowledge base.

#### 2️⃣ Add Facts

Enter known facts one at a time:

```
fever
cough
headache
```

#### 3️⃣ Run Inference

Click the green **"Run Forward Chaining"** button.

#### 4️⃣ View Results

- **Conclusions panel**: Shows all derived facts
- **Inference Log**: Shows the step-by-step reasoning

### Quick Start with Example

Click **"Load Medical Example"** to load a pre-built medical diagnosis system, then click **"Run Forward Chaining"** to see it in action!

---

## 💻 Code Walkthrough

### The Rule Class (`engine.js`)

```javascript
class Rule {
    constructor(id, conditions, conclusion) {
        this.id = id;                    // Unique identifier
        this.conditions = conditions;     // Array of required facts
        this.conclusion = conclusion;     // Fact to add when rule fires
        this.fired = false;              // Prevents re-firing
    }

    // Check if all conditions exist in the facts set
    isSatisfied(facts) {
        return this.conditions.every(c => facts.has(c));
    }
}
```

**Key Point**: A rule only fires when ALL its conditions are satisfied.

### The ExpertSystem Class (`engine.js`)

```javascript
class ExpertSystem {
    constructor() {
        this.rules = [];           // Knowledge base
        this.facts = new Set();    // All known facts
        this.inferredFacts = new Set();  // Facts derived by rules
    }

    // The forward chaining algorithm
    forwardChain() {
        let changed = true;
        
        while (changed) {           // Keep going until no changes
            changed = false;
            
            for (const rule of this.rules) {
                if (rule.fired) continue;  // Skip already-fired rules
                
                if (rule.isSatisfied(this.facts)) {
                    // Rule conditions are met!
                    if (!this.facts.has(rule.conclusion)) {
                        this.addFact(rule.conclusion, true);
                        changed = true;  // We made progress
                    }
                    rule.fired = true;
                }
            }
        }
    }
}
```

**Key Points**:
- Uses a `while` loop to iterate until no new facts are added
- Each rule fires at most once per inference cycle
- Uses `Set` for O(1) fact lookups

### Logging (`engine.js`)

The engine supports a callback for logging:

```javascript
engine.setLogCallback((type, message) => {
    // type: 'start', 'check', 'fire', 'new-fact', 'done'
    console.log(`[${type}] ${message}`);
});
```

---

## 📝 Examples

### Example 1: Simple Animal Classification

```javascript
// Rules
IF: has_feathers           THEN: bird
IF: bird, can_fly          THEN: flying_bird
IF: bird, cannot_fly       THEN: flightless_bird
IF: flying_bird, small     THEN: sparrow
IF: flightless_bird, tall  THEN: ostrich

// Facts
has_feathers, can_fly, small

// Inference Chain
has_feathers → bird
bird + can_fly → flying_bird
flying_bird + small → sparrow

// Conclusion: sparrow
```

### Example 2: Tech Support

```javascript
// Rules
IF: no_power               THEN: check_outlet
IF: no_display, has_power  THEN: check_monitor_cable
IF: slow_performance       THEN: check_memory_usage
IF: check_memory_usage, high_memory THEN: close_applications
IF: check_memory_usage, low_memory  THEN: add_more_ram

// Facts
slow_performance, high_memory

// Inference Chain
slow_performance → check_memory_usage
check_memory_usage + high_memory → close_applications
```

### Example 3: Medical Diagnosis (Built-in)

The included medical example demonstrates multi-step diagnosis:

```
Initial: fever, cough, body_aches

Step 1: fever + cough → respiratory_infection
Step 2: respiratory_infection + body_aches → flu
Step 3: flu → recommend_rest
Step 4: flu → recommend_fluids

Final: Patient likely has flu, should rest and drink fluids
```

---

## 🔧 Extending the System

### Adding New Rules Programmatically

```javascript
const engine = new ExpertSystem();

// Add rules
engine.addRule(['fever', 'cough'], 'cold');
engine.addRule(['cold', 'severe_headache'], 'flu');

// Add facts
engine.addFact('fever');
engine.addFact('cough');
engine.addFact('severe_headache');

// Run inference
const results = engine.forwardChain();
console.log('Inferred:', results.newFacts);
```

### Creating Your Own Knowledge Base

```javascript
const myKnowledgeBase = {
    rules: [
        { conditions: ['symptom1', 'symptom2'], conclusion: 'diagnosis1' },
        { conditions: ['diagnosis1', 'symptom3'], conclusion: 'diagnosis2' }
    ],
    facts: ['symptom1', 'symptom2', 'symptom3']
};

// Load it
engine.clearAll();
myKnowledgeBase.rules.forEach(r => engine.addRule(r.conditions, r.conclusion));
myKnowledgeBase.facts.forEach(f => engine.addFact(f));
```

### Ideas for Enhancement

| Feature | Description |
|---------|-------------|
| Rule Priority | Add weights to rules to fire higher-priority rules first |
| Backward Chaining | Goal-driven reasoning |
| Uncertainty | Add confidence values (0-100%) to facts and rules |
| Explanation | "Why?" feature to explain reasoning paths |
| Persistence | Save/load knowledge bases to localStorage or files |
| Conflict Resolution | Handle contradictory conclusions |

---

## 🧪 Testing Your Understanding

Try these exercises:

### Exercise 1: Weather Advisor
Create rules for recommending activities based on weather:
- IF sunny AND warm THEN go_outside
- IF rainy THEN bring_umbrella
- IF go_outside AND weekend THEN have_picnic

### Exercise 2: Grade Calculator
- IF score >= 90 THEN grade_A
- IF score >= 80 AND score < 90 THEN grade_B
- (Hint: You'll need to handle numeric conditions differently!)

### Exercise 3: Debug This
Why doesn't this work as expected?
```
Rule 1: IF A THEN B
Rule 2: IF B THEN C
Facts: C

Expected: Derive A and B
Actual: Nothing derived
```

<details>
<summary>Answer</summary>

Forward chaining works **forward** from facts to conclusions, not backward! With fact `C`, no rules fire because:
- Rule 1 needs `A` (we don't have it)
- Rule 2 needs `B` (we don't have it)

You would need **backward chaining** to prove what's needed to reach a goal.
</details>

---

## 📚 Further Reading

- [Expert Systems - Wikipedia](https://en.wikipedia.org/wiki/Expert_system)
- [Forward Chaining - Wikipedia](https://en.wikipedia.org/wiki/Forward_chaining)
- [CLIPS Expert System](http://www.clipsrules.net/) - A professional rule engine
- [Drools](https://www.drools.org/) - Enterprise rule engine (Java)

---

## 🤝 Contributing

Feel free to extend this project! Some ideas:
- Add backward chaining
- Create more example knowledge bases
- Add rule editing/updating
- Implement confidence factors

---

## 📄 License

This project is open source and available for educational purposes.

---

<div align="center">

**Built with ❤️ for learning AI fundamentals**

*Understanding expert systems is a great foundation for more advanced AI concepts!*

</div>
