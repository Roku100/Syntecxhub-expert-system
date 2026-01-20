/**
 * Forward Chaining Rule Engine - Core Logic
 */

class Rule {
    constructor(id, conditions, conclusion) {
        this.id = id;
        this.conditions = conditions.map(c => c.toLowerCase().trim());
        this.conclusion = conclusion.toLowerCase().trim();
        this.fired = false;
    }

    isSatisfied(facts) {
        return this.conditions.every(c => facts.has(c));
    }

    reset() {
        this.fired = false;
    }
}

class ExpertSystem {
    constructor() {
        this.rules = [];
        this.facts = new Set();
        this.inferredFacts = new Set();
        this.ruleCounter = 0;
        this.logCallback = null;
    }

    setLogCallback(cb) { this.logCallback = cb; }

    log(type, msg) { if (this.logCallback) this.logCallback(type, msg); }

    addRule(conditions, conclusion) {
        if (!conditions.length || !conclusion) throw new Error('Invalid rule');
        this.ruleCounter++;
        const rule = new Rule(this.ruleCounter, conditions, conclusion);
        this.rules.push(rule);
        return rule;
    }

    removeRule(id) {
        const i = this.rules.findIndex(r => r.id === id);
        if (i !== -1) { this.rules.splice(i, 1); return true; }
        return false;
    }

    addFact(fact, inferred = false) {
        const f = fact.toLowerCase().trim();
        if (!f || this.facts.has(f)) return false;
        this.facts.add(f);
        if (inferred) this.inferredFacts.add(f);
        return true;
    }

    removeFact(fact) {
        const f = fact.toLowerCase().trim();
        this.facts.delete(f);
        this.inferredFacts.delete(f);
    }

    getFacts() { return Array.from(this.facts); }
    getInitialFacts() { return this.getFacts().filter(f => !this.inferredFacts.has(f)); }
    getInferredFacts() { return Array.from(this.inferredFacts); }

    clearInferred() {
        this.inferredFacts.forEach(f => this.facts.delete(f));
        this.inferredFacts.clear();
    }

    clearAll() {
        this.rules = [];
        this.facts.clear();
        this.inferredFacts.clear();
        this.ruleCounter = 0;
    }

    forwardChain() {
        this.rules.forEach(r => r.reset());
        this.clearInferred();

        const results = { newFacts: [], firedRules: [], iterations: 0 };
        const fmtFacts = arr => arr.length ? arr.map(f => `"<span class="fact-ref">${f}</span>"`).join(', ') : '(none)';

        this.log('start', `Starting with <strong>${this.facts.size}</strong> facts: ${fmtFacts(this.getFacts())}`);

        let changed = true, iter = 0;
        while (changed && iter < 100) {
            changed = false;
            iter++;
            this.log('check', `<strong>Iteration ${iter}</strong> - Checking rules...`);

            for (const rule of this.rules) {
                if (rule.fired) continue;
                if (!rule.isSatisfied(this.facts)) continue;

                if (this.facts.has(rule.conclusion)) {
                    rule.fired = true;
                    continue;
                }

                rule.fired = true;
                this.addFact(rule.conclusion, true);
                changed = true;
                results.firedRules.push(rule);
                results.newFacts.push(rule.conclusion);

                const conds = rule.conditions.map(c => `"<span class="fact-ref">${c}</span>"`).join(' AND ');
                this.log('fire', `<span class="rule-ref">Rule ${rule.id}</span> FIRED: IF ${conds} THEN "<span class="highlight">${rule.conclusion}</span>"`);
                this.log('new-fact', `New fact: "<span class="highlight">${rule.conclusion}</span>"`);
            }
        }

        results.iterations = iter;
        this.log('done', `<strong>Complete:</strong> ${results.firedRules.length} rules fired, ${results.newFacts.length} new facts`);
        return results;
    }
}

const medicalExample = {
    rules: [
        { conditions: ['fever', 'cough'], conclusion: 'respiratory_infection' },
        { conditions: ['respiratory_infection', 'body_aches'], conclusion: 'flu' },
        { conditions: ['flu', 'high_fever'], conclusion: 'severe_flu' },
        { conditions: ['sneezing', 'runny_nose'], conclusion: 'common_cold' },
        { conditions: ['fever', 'cough', 'loss_of_taste'], conclusion: 'possible_covid' },
        { conditions: ['fever', 'sore_throat', 'swollen_glands'], conclusion: 'possible_strep' },
        { conditions: ['flu'], conclusion: 'recommend_rest' },
        { conditions: ['flu'], conclusion: 'recommend_fluids' },
        { conditions: ['severe_flu'], conclusion: 'recommend_doctor_visit' }
    ],
    facts: ['fever', 'cough', 'body_aches']
};

window.ExpertSystem = ExpertSystem;
window.medicalExample = medicalExample;
