/**
 * Expert System UI Application
 */

document.addEventListener('DOMContentLoaded', () => {
    const engine = new ExpertSystem();
    let currentExample = null;

    // DOM Elements
    const els = {
        ruleConditions: document.getElementById('ruleConditions'),
        ruleConclusion: document.getElementById('ruleConclusion'),
        addRuleBtn: document.getElementById('addRuleBtn'),
        rulesList: document.getElementById('rulesList'),
        ruleCount: document.getElementById('ruleCount'),
        factInput: document.getElementById('factInput'),
        addFactBtn: document.getElementById('addFactBtn'),
        factsList: document.getElementById('factsList'),
        factCount: document.getElementById('factCount'),
        quickFactsList: document.getElementById('quickFactsList'),
        runInferenceBtn: document.getElementById('runInferenceBtn'),
        clearAllBtn: document.getElementById('clearAllBtn'),
        conclusionsList: document.getElementById('conclusionsList'),
        inferenceLog: document.getElementById('inferenceLog'),
        clearLogBtn: document.getElementById('clearLogBtn'),
        exampleDropdown: document.querySelector('.example-dropdown'),
        exampleDropdownBtn: document.getElementById('exampleDropdownBtn'),
        exampleMenu: document.getElementById('exampleMenu'),
        welcomeBanner: document.getElementById('welcomeBanner'),
        closeBannerBtn: document.getElementById('closeBannerBtn'),
        helpBtn: document.getElementById('helpBtn'),
        helpModal: document.getElementById('helpModal'),
        closeHelpBtn: document.getElementById('closeHelpBtn')
    };

    // Example knowledge bases
    const examples = {
        medical: {
            name: 'Medical Diagnosis',
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
            facts: ['fever', 'cough', 'body_aches'],
            quickFacts: ['fever', 'cough', 'body_aches', 'sneezing', 'runny_nose', 'sore_throat', 'high_fever', 'loss_of_taste', 'fatigue', 'headache']
        },
        tech: {
            name: 'Tech Support',
            rules: [
                { conditions: ['no_power'], conclusion: 'check_power_cable' },
                { conditions: ['check_power_cable', 'cable_connected'], conclusion: 'check_outlet' },
                { conditions: ['has_power', 'no_display'], conclusion: 'check_monitor' },
                { conditions: ['check_monitor', 'monitor_on'], conclusion: 'check_video_cable' },
                { conditions: ['slow_computer'], conclusion: 'check_processes' },
                { conditions: ['check_processes', 'high_cpu'], conclusion: 'close_programs' },
                { conditions: ['check_processes', 'high_memory'], conclusion: 'add_more_ram' },
                { conditions: ['no_internet'], conclusion: 'check_wifi' },
                { conditions: ['check_wifi', 'wifi_connected'], conclusion: 'restart_router' },
                { conditions: ['restart_router', 'still_no_internet'], conclusion: 'contact_isp' }
            ],
            facts: ['slow_computer', 'high_cpu'],
            quickFacts: ['no_power', 'has_power', 'no_display', 'slow_computer', 'no_internet', 'cable_connected', 'monitor_on', 'high_cpu', 'high_memory', 'wifi_connected']
        },
        animal: {
            name: 'Animal Classification',
            rules: [
                { conditions: ['has_feathers'], conclusion: 'bird' },
                { conditions: ['bird', 'can_fly'], conclusion: 'flying_bird' },
                { conditions: ['bird', 'cannot_fly', 'swims'], conclusion: 'penguin' },
                { conditions: ['flying_bird', 'small', 'sings'], conclusion: 'songbird' },
                { conditions: ['has_fur', 'gives_milk'], conclusion: 'mammal' },
                { conditions: ['mammal', 'has_stripes'], conclusion: 'zebra' },
                { conditions: ['mammal', 'has_spots', 'long_neck'], conclusion: 'giraffe' },
                { conditions: ['mammal', 'lives_in_water'], conclusion: 'whale_or_dolphin' },
                { conditions: ['has_scales', 'lives_in_water'], conclusion: 'fish' },
                { conditions: ['has_scales', 'has_legs'], conclusion: 'reptile' }
            ],
            facts: ['has_feathers', 'can_fly', 'small', 'sings'],
            quickFacts: ['has_feathers', 'can_fly', 'cannot_fly', 'swims', 'small', 'sings', 'has_fur', 'gives_milk', 'has_stripes', 'has_spots', 'long_neck', 'lives_in_water']
        }
    };

    // Setup logging
    engine.setLogCallback((type, message) => {
        addLogEntry(type, message);
    });

    // Add rule
    function addRule() {
        const condStr = els.ruleConditions.value.trim();
        const conclusion = els.ruleConclusion.value.trim();
        if (!condStr || !conclusion) return;

        const conditions = condStr.split(',').map(c => c.trim()).filter(c => c);
        if (!conditions.length) return;

        try {
            engine.addRule(conditions, conclusion);
            renderRules();
            els.ruleConditions.value = '';
            els.ruleConclusion.value = '';
            els.ruleConditions.focus();
        } catch (e) {
            console.error(e);
        }
    }

    // Render rules list
    function renderRules() {
        els.ruleCount.textContent = engine.rules.length;

        if (!engine.rules.length) {
            els.rulesList.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <line x1="3" y1="9" x2="21" y2="9"/>
                        <line x1="9" y1="21" x2="9" y2="9"/>
                    </svg>
                    <p>No rules defined yet</p>
                    <span>Add IF-THEN rules above or load an example</span>
                </div>`;
            return;
        }

        els.rulesList.innerHTML = engine.rules.map(rule => `
            <div class="rule-item" data-id="${rule.id}">
                <span class="rule-number">${rule.id}</span>
                <div class="rule-content">
                    <div class="rule-condition">
                        <span class="rule-keyword">IF</span>
                        ${rule.conditions.map((c, i) => `
                            <span class="rule-fact">${c}</span>
                            ${i < rule.conditions.length - 1 ? '<span class="rule-and">AND</span>' : ''}
                        `).join('')}
                    </div>
                    <div class="rule-conclusion">
                        <span class="rule-keyword">THEN</span>
                        <span class="rule-fact">${rule.conclusion}</span>
                    </div>
                </div>
                <button class="rule-delete" onclick="deleteRule(${rule.id})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
        `).join('');
    }

    window.deleteRule = function (id) {
        engine.removeRule(id);
        renderRules();
    };

    // Add fact
    function addFact(fact) {
        const factToAdd = fact || els.factInput.value.trim();
        if (!factToAdd) return;

        if (engine.addFact(factToAdd)) {
            renderFacts();
            updateQuickFacts();
            if (!fact) els.factInput.value = '';
        }
        if (!fact) els.factInput.focus();
    }

    // Render facts
    function renderFacts() {
        const initial = engine.getInitialFacts();
        const inferred = engine.getInferredFacts();
        const all = [...initial, ...inferred];

        els.factCount.textContent = all.length;

        if (!all.length) {
            els.factsList.innerHTML = '<div class="empty-state small"><p>No facts added</p></div>';
            return;
        }

        els.factsList.innerHTML = all.map(fact => {
            const isInferred = inferred.includes(fact);
            return `
                <span class="fact-tag ${isInferred ? 'inferred' : ''}" data-fact="${fact}">
                    ${fact}
                    ${!isInferred ? `
                        <button onclick="deleteFact('${fact}')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    ` : ''}
                </span>
            `;
        }).join('');
    }

    window.deleteFact = function (fact) {
        engine.removeFact(fact);
        renderFacts();
        updateQuickFacts();
        renderConclusions();
    };

    // Run inference
    function runInference() {
        clearLog();
        const results = engine.forwardChain();
        renderFacts();
        updateQuickFacts();
        renderConclusions(results);
    }

    // Render conclusions
    function renderConclusions(results = null) {
        const inferred = engine.getInferredFacts();

        if (!inferred.length) {
            els.conclusionsList.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <p>No conclusions yet</p>
                    <span>Add facts and run inference</span>
                </div>`;
            return;
        }

        els.conclusionsList.innerHTML = inferred.map(fact => {
            const rule = results?.firedRules.find(r => r.conclusion === fact);
            const source = rule ? `From Rule ${rule.id}` : 'Inferred';
            return `
                <div class="conclusion-item">
                    <div class="conclusion-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    </div>
                    <div class="conclusion-text">
                        <strong>${fact}</strong>
                        <span>${source}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Render quick facts
    function renderQuickFacts(quickFacts) {
        if (!quickFacts || !quickFacts.length) {
            els.quickFactsList.innerHTML = '<span style="color: var(--text-muted); font-size: 0.75rem;">Load an example to see suggestions</span>';
            return;
        }

        els.quickFactsList.innerHTML = quickFacts.map(fact => {
            const isAdded = engine.facts.has(fact.toLowerCase());
            return `<button class="quick-fact-btn ${isAdded ? 'added' : ''}" 
                            onclick="quickAddFact('${fact}')" 
                            ${isAdded ? 'disabled' : ''}>
                        ${fact}
                    </button>`;
        }).join('');
    }

    function updateQuickFacts() {
        if (currentExample && examples[currentExample]) {
            renderQuickFacts(examples[currentExample].quickFacts);
        }
    }

    window.quickAddFact = function (fact) {
        addFact(fact);
    };

    // Log entry
    function addLogEntry(type, message) {
        if (els.inferenceLog.querySelector('.log-welcome')) {
            els.inferenceLog.innerHTML = '';
        }

        const time = new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `
            <span class="log-time">${time}</span>
            <span class="log-type ${type}"></span>
            <span class="log-message">${message}</span>
        `;
        els.inferenceLog.appendChild(entry);
        els.inferenceLog.scrollTop = els.inferenceLog.scrollHeight;
    }

    // Clear log
    function clearLog() {
        els.inferenceLog.innerHTML = `
            <div class="log-welcome">
                <div class="log-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                </div>
                <h3>Reasoning Path</h3>
                <p>The engine will show each step here</p>
            </div>
        `;
    }

    // Clear all
    function clearAll() {
        engine.clearAll();
        currentExample = null;
        renderRules();
        renderFacts();
        renderQuickFacts([]);
        renderConclusions();
        clearLog();
    }

    // Load example
    function loadExample(exampleKey) {
        const example = examples[exampleKey];
        if (!example) return;

        engine.clearAll();
        currentExample = exampleKey;

        example.rules.forEach(r => engine.addRule(r.conditions, r.conclusion));
        example.facts.forEach(f => engine.addFact(f));

        renderRules();
        renderFacts();
        renderQuickFacts(example.quickFacts);
        renderConclusions();
        clearLog();

        addLogEntry('start', `Loaded <strong>${example.name}</strong> example. Click "Run Forward Chaining" to see inference!`);

        // Close dropdown
        els.exampleDropdown.classList.remove('active');

        // Hide welcome banner
        els.welcomeBanner.classList.add('hidden');
    }

    // Dropdown toggle
    els.exampleDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        els.exampleDropdown.classList.toggle('active');
    });

    // Close dropdown on outside click
    document.addEventListener('click', () => {
        els.exampleDropdown.classList.remove('active');
    });

    // Dropdown items
    els.exampleMenu.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            const exampleKey = item.dataset.example;
            loadExample(exampleKey);
        });
    });

    // Welcome banner close
    els.closeBannerBtn.addEventListener('click', () => {
        els.welcomeBanner.classList.add('hidden');
    });

    // Event listeners
    els.addRuleBtn.addEventListener('click', addRule);
    els.ruleConditions.addEventListener('keypress', e => { if (e.key === 'Enter') els.ruleConclusion.focus(); });
    els.ruleConclusion.addEventListener('keypress', e => { if (e.key === 'Enter') addRule(); });

    els.addFactBtn.addEventListener('click', () => addFact());
    els.factInput.addEventListener('keypress', e => { if (e.key === 'Enter') addFact(); });

    els.runInferenceBtn.addEventListener('click', runInference);
    els.clearAllBtn.addEventListener('click', clearAll);
    els.clearLogBtn.addEventListener('click', clearLog);

    els.helpBtn.addEventListener('click', () => els.helpModal.classList.add('active'));
    els.closeHelpBtn.addEventListener('click', () => els.helpModal.classList.remove('active'));
    els.helpModal.addEventListener('click', e => {
        if (e.target === els.helpModal) els.helpModal.classList.remove('active');
    });

    // Initialize
    renderRules();
    renderFacts();
    renderQuickFacts([]);
    renderConclusions();
});
