/* ==========================================================================
   SIMPLEAFIED LANDING PAGE INTERACTIVE ENGINE (JS)
   Manages the state transitions, compliance rules, lab filterings,
   order checkouts, live testing timeline simulations, and mobile QR previews.
   ========================================================================== */

// 1. Core State
const state = {
  currentStep: 1,
  market: 'DE',
  product: 'Flower',
  selectedAnalytes: [],
  selectedLab: null,
  package: 'characterization',
  simulationPath: 'pass',
  orderId: 'ORD-2026-07-4481',
  sampleId: 'SMP-10421',
  dateIssued: ''
};

// 2. Rules Database (Analytes per Market & Product Type)
const rulesDatabase = {
  'DE': {
    name: 'Germany (BfArM Rules)',
    rulesetText: 'Rules: BfArM-2025-r3 &middot; EU-Pesticide-MRL-2024 &middot; Pharmacopoeia rules',
    analytes: {
      required: [
        { id: 'thc-profile', name: 'Cannabinoid Profile', desc: 'THC, CBD, CBG, CBN, CBC', basePrice: 120 },
        { id: 'heavy-metals', name: 'Heavy Metals', desc: 'Lead (Pb), Cadmium (Cd), Arsenic (As), Mercury (Hg)', basePrice: 85 },
        { id: 'pesticides', name: 'Pesticides', desc: 'EU MRL Annex II — 198 analytes', basePrice: 140 },
        { id: 'microbiology', name: 'Microbiology Panel', desc: 'TYM, E. coli, Salmonella, Aflatoxins', basePrice: 95 }
      ],
      recommended: [
        { id: 'terpenes', name: 'Terpene Profile', desc: '42 monoterpenes & sesquiterpenes', price: 45, checked: true },
        { id: 'moisture', name: 'Moisture & Water Activity', desc: 'Karl Fischer + Aw meter', price: 18, checked: true }
      ],
      optional: [
        { id: 'genetics', name: 'Genetics / Cultivar ID', desc: 'STR-marker panel', price: 89, checked: false },
        { id: 'stability', name: 'Stability / Shelf-life', desc: '6-month accelerated study', price: 240, checked: false },
        { id: 'solvents', name: 'Residual Solvents', desc: 'USP <467> — 25 solvents', price: 38, checked: false }
      ]
    }
  },
  'CZ': {
    name: 'Czech Republic (SUKL Rules)',
    rulesetText: 'Rules: SUKL-CZ-v2 &middot; EU-Pesticide-MRL-2024 &middot; CzPh',
    analytes: {
      required: [
        { id: 'thc-profile', name: 'Cannabinoid Profile', desc: 'THC, CBD, CBG', basePrice: 110 },
        { id: 'heavy-metals', name: 'Heavy Metals (3)', desc: 'Pb, Cd, Hg', basePrice: 75 },
        { id: 'microbiology', name: 'Microbiology Panel', desc: 'Yeast, Mold, Pathogens', basePrice: 90 }
      ],
      recommended: [
        { id: 'pesticides', name: 'Pesticides (Basic)', desc: 'CZ-selected pesticides', price: 110, checked: true },
        { id: 'moisture', name: 'Moisture Content', desc: 'Loss on drying', price: 15, checked: true }
      ],
      optional: [
        { id: 'terpenes', name: 'Terpene Profile', desc: '42 terpenes', price: 45, checked: false },
        { id: 'mycotoxins', name: 'Mycotoxins (extended)', desc: 'Ochratoxin A, T-2, HT-2', price: 32, checked: false }
      ]
    }
  },
  'GB': {
    name: 'United Kingdom (MHRA Rules)',
    rulesetText: 'Rules: UK-post-Brexit &middot; MHRA guidelines &middot; FSA Novel-Food',
    analytes: {
      required: [
        { id: 'thc-profile', name: 'Cannabinoid Profile', desc: 'THC, CBD, CBDv, THCa', basePrice: 130 },
        { id: 'microbiology', name: 'Microbiology Panel', desc: 'Total Aerobic Count, Yeast/Mold, E. coli', basePrice: 95 }
      ],
      recommended: [
        { id: 'heavy-metals', name: 'Heavy Metals', desc: 'Pb, Cd, As, Hg', price: 85, checked: true },
        { id: 'pesticides', name: 'Pesticides', desc: 'UK HSE guidelines', price: 140, checked: true }
      ],
      optional: [
        { id: 'solvents', name: 'Residual Solvents', desc: 'FSA Novel-Food solvents', price: 38, checked: false },
        { id: 'mycotoxins', name: 'Mycotoxins', desc: 'Aflatoxins B1/B2/G1/G2', price: 32, checked: false }
      ]
    }
  },
  'AU': {
    name: 'Australia (TGA Rules)',
    rulesetText: 'Rules: TGA Rules &middot; TGO 93 Schedule 4',
    analytes: {
      required: [
        { id: 'thc-profile', name: 'Cannabinoid Profile', desc: 'THC, CBD, CBG, CBN, CBC', basePrice: 140 },
        { id: 'heavy-metals', name: 'Heavy Metals', desc: 'TGO 93 requirements', basePrice: 90 },
        { id: 'pesticides', name: 'Pesticides', desc: 'EP MRL requirements', basePrice: 150 },
        { id: 'microbiology', name: 'Microbiology', desc: 'EP 5.1.8 Category B', basePrice: 100 }
      ],
      recommended: [
        { id: 'moisture', name: 'Loss on Drying', desc: 'TGO 93 requirements', price: 20, checked: true }
      ],
      optional: [
        { id: 'terpenes', name: 'Terpene Profile', desc: '42 monoterpenes', price: 50, checked: false },
        { id: 'genetics', name: 'Genetics ID', desc: 'STR-marker panel', price: 89, checked: false }
      ]
    }
  },
  'CH': {
    name: 'Switzerland (Swissmedic Rules)',
    rulesetText: 'Rules: Swissmedic &middot; CH pesticide list &middot; CH-Pharm',
    analytes: {
      required: [
        { id: 'thc-profile', name: 'Cannabinoid Profile', desc: 'THC, CBD, CBG', basePrice: 115 },
        { id: 'heavy-metals', name: 'Heavy Metals', desc: 'Pb, Cd, Hg Swiss limits', basePrice: 80 },
        { id: 'microbiology', name: 'Microbiology', desc: 'Pathogen screening', basePrice: 90 }
      ],
      recommended: [
        { id: 'pesticides', name: 'Pesticides', desc: 'CH pesticide rules', price: 130, checked: true },
        { id: 'moisture', name: 'Moisture & Water Activity', desc: 'Swiss compliance', price: 20, checked: true }
      ],
      optional: [
        { id: 'terpenes', name: 'Terpene Profile', desc: '42 terpenes', price: 45, checked: false },
        { id: 'solvents', name: 'Residual Solvents', desc: 'Swiss limits', price: 40, checked: false }
      ]
    }
  }
};

// 3. Laboratories Database
const laboratories = [
  {
    id: 'eurolab',
    name: 'EuroLab Munich GmbH',
    avatar: 'EM',
    location: 'Munich, Germany',
    accs: ['ISO 17025', 'DAkkS', 'GMP'],
    rating: '4.9',
    tat: '3-5 days',
    capacity: 'High',
    baseRateMultiplier: 1.0,
    hasGmp: true,
    hasDakks: true,
    country: 'DE'
  },
  {
    id: 'prague-analytical',
    name: 'Prague Analytical s.r.o.',
    avatar: 'PA',
    location: 'Prague, Czech Republic',
    accs: ['ISO 17025', 'GMP'],
    rating: '4.7',
    tat: '5-7 days',
    capacity: 'Medium',
    baseRateMultiplier: 0.85,
    hasGmp: true,
    hasDakks: false,
    country: 'CZ'
  },
  {
    id: 'zurich-cannasci',
    name: 'Zurich CannaSci AG',
    avatar: 'ZC',
    location: 'Zurich, Switzerland',
    accs: ['ISO 17025', 'Swissmedic'],
    rating: '4.8',
    tat: '4-6 days',
    capacity: 'Low',
    baseRateMultiplier: 1.25,
    hasGmp: false,
    hasDakks: false,
    country: 'CH'
  },
  {
    id: 'london-biocert',
    name: 'London BioCert Labs',
    avatar: 'LB',
    location: 'London, United Kingdom',
    accs: ['ISO 17025'],
    rating: '4.6',
    tat: '7-9 days',
    capacity: 'Medium',
    baseRateMultiplier: 1.1,
    hasGmp: false,
    hasDakks: false,
    country: 'GB'
  }
];

// 4. Initializers & DOM Listeners
document.addEventListener('DOMContentLoaded', () => {
  setupMarketSelectionListeners();
  setupProductSelectionListeners();
  setupFiltersListeners();
  renderComplianceEngine(); // initial draw
});

function setupMarketSelectionListeners() {
  document.querySelectorAll('.market-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.market-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.market = btn.getAttribute('data-market');
      renderComplianceEngine();
    });
  });
}

function setupProductSelectionListeners() {
  document.querySelectorAll('.product-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.product-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.product = btn.getAttribute('data-product');
      renderComplianceEngine();
    });
  });
}

function setupFiltersListeners() {
  const gmpFilter = document.getElementById('filter-gmp');
  const dakksFilter = document.getElementById('filter-dakks');
  const tatSlider = document.getElementById('tat-slider');
  const locationSelect = document.getElementById('location-select');

  if (gmpFilter) gmpFilter.addEventListener('change', renderLaboratories);
  if (dakksFilter) dakksFilter.addEventListener('change', renderLaboratories);
  if (tatSlider) tatSlider.addEventListener('input', renderLaboratories);
  if (locationSelect) locationSelect.addEventListener('change', renderLaboratories);
}

// 5. Compliance Recommendation Engine Drawing
function renderComplianceEngine() {
  const marketRules = rulesDatabase[state.market];
  
  // Update Config Bar Title
  document.getElementById('engine-config-text').innerHTML = `${marketRules.name.split(' (')[0]} &times; ${state.product}`;
  document.getElementById('engine-rules-text').innerHTML = marketRules.rulesetText;
  
  // Clean lists
  const reqList = document.getElementById('required-analyte-list');
  const recList = document.getElementById('recommended-analyte-list');
  const optList = document.getElementById('optional-analyte-list');
  
  reqList.innerHTML = '';
  recList.innerHTML = '';
  optList.innerHTML = '';

  state.selectedAnalytes = [];

  // 1. Required
  marketRules.analytes.required.forEach(item => {
    state.selectedAnalytes.push(item);
    reqList.appendChild(createAnalyteDOM(item, true));
  });

  // 2. Recommended
  marketRules.analytes.recommended.forEach(item => {
    if (item.checked) state.selectedAnalytes.push(item);
    recList.appendChild(createAnalyteDOM(item, false, 'recommended'));
  });

  // 3. Optional
  marketRules.analytes.optional.forEach(item => {
    if (item.checked) state.selectedAnalytes.push(item);
    optList.appendChild(createAnalyteDOM(item, false, 'optional'));
  });

  updateAnalyteTotals();
  renderLaboratories(); // update pricing in lab cards
}

function createAnalyteDOM(item, isRequired, tierName = 'required') {
  const div = document.createElement('div');
  div.className = `analyte-item ${isRequired ? 'disabled' : ''}`;
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'analyte-checkbox';
  checkbox.checked = isRequired || item.checked;
  checkbox.disabled = isRequired;
  
  if (!isRequired) {
    checkbox.addEventListener('change', (e) => {
      item.checked = e.target.checked;
      if (item.checked) {
        state.selectedAnalytes.push(item);
      } else {
        state.selectedAnalytes = state.selectedAnalytes.filter(a => a.id !== item.id);
      }
      updateAnalyteTotals();
      renderLaboratories();
    });
  }

  const nameWrapper = document.createElement('div');
  nameWrapper.className = 'analyte-name';
  nameWrapper.innerHTML = `<span>${item.name}</span><span class="analyte-desc">${item.desc}</span>`;
  
  const priceSpan = document.createElement('span');
  priceSpan.className = 'analyte-price';
  priceSpan.innerHTML = isRequired ? 'Included' : `+€${item.price || item.basePrice}`;

  div.appendChild(checkbox);
  div.appendChild(nameWrapper);
  div.appendChild(priceSpan);
  return div;
}

function updateAnalyteTotals() {
  const requiredBaseCost = rulesDatabase[state.market].analytes.required.reduce((acc, curr) => acc + (curr.basePrice || 0), 0);
  const addonsCost = state.selectedAnalytes.reduce((acc, curr) => {
    if (curr.price) return acc + curr.price;
    return acc;
  }, 0);
  
  const totalEstim = requiredBaseCost + addonsCost;
  document.getElementById('selected-analytes-count').innerHTML = 
    `${state.selectedAnalytes.length} analytes selected &middot; estimated total €${totalEstim} + lab pricing`;
}

// 6. Laboratory Marketplace Logic
function renderLaboratories() {
  const labsContainer = document.getElementById('labs-list-container');
  if (!labsContainer) return;
  
  labsContainer.innerHTML = '';
  
  const gmpFilter = document.getElementById('filter-gmp')?.checked;
  const dakksFilter = document.getElementById('filter-dakks')?.checked;
  const maxTat = parseInt(document.getElementById('tat-slider')?.value || '10');
  const locSelect = document.getElementById('location-select')?.value;
  
  // Calculate price of current selections for each lab
  const requiredBaseCost = rulesDatabase[state.market].analytes.required.reduce((acc, curr) => acc + (curr.basePrice || 0), 0);
  const addonsCost = state.selectedAnalytes.reduce((acc, curr) => curr.price ? acc + curr.price : acc, 0);
  const corePrice = requiredBaseCost + addonsCost;

  let matchCount = 0;
  
  laboratories.forEach(lab => {
    // Apply filters
    if (gmpFilter && !lab.hasGmp) return;
    if (dakksFilter && !lab.hasDakks) return;
    
    // Parse TAT
    const tatDays = parseInt(lab.tat.split('-')[0]);
    if (tatDays > maxTat) return;
    
    // Location filter
    if (locSelect === 'Germany-only' && lab.country !== 'DE') return;

    matchCount++;
    const finalPrice = Math.round(corePrice * lab.baseRateMultiplier);
    
    const labCard = document.createElement('div');
    labCard.className = `lab-card ${state.selectedLab?.id === lab.id ? 'active-match' : ''}`;
    labCard.id = `lab-card-${lab.id}`;
    
    // Accent badge for EuroLab Munich (best match in DE)
    const bestMatchBadge = (lab.id === 'eurolab' && state.market === 'DE') ? '<span class="match-badge">BEST MATCH</span>' : '';
    
    // Accs render
    const accBadges = lab.accs.map(acc => `<span class="tech-badge">${acc}</span>`).join(' ');

    labCard.innerHTML = `
      <div class="lab-avatar">${lab.avatar}</div>
      <div class="lab-info-col">
        <h4>${lab.name} ${bestMatchBadge}</h4>
        <div class="lab-rating">
          <span class="star-rating">★ ★ ★ ★ ★</span>
          <span>${lab.rating} &bull; ${lab.location}</span>
        </div>
      </div>
      <div class="lab-specs-col">
        <div><strong>Turnaround:</strong> ${lab.tat}</div>
        <div><strong>Capacity:</strong> ${lab.capacity}</div>
        <div>${accBadges}</div>
      </div>
      <div class="lab-price-col">
        <span class="price-from-label">TOTAL ACC. PRICE</span>
        <div class="lab-price-val">€${finalPrice}</div>
        <button class="btn btn-secondary btn-ghost lab-btn-select" id="lab-btn-${lab.id}" onclick="selectLaboratory('${lab.id}', ${finalPrice})">
          ${state.selectedLab?.id === lab.id ? 'Selected ✓' : 'Select Lab'}
        </button>
      </div>
    `;
    
    labsContainer.appendChild(labCard);
  });

  if (matchCount === 0) {
    labsContainer.innerHTML = '<div class="table-loading-placeholder">No laboratories match your active filter criteria.</div>';
  }
}

function selectLaboratory(labId, calculatedPrice) {
  const lab = laboratories.find(l => l.id === labId);
  state.selectedLab = { ...lab, finalPrice: calculatedPrice };
  
  // Redraw labs to show checked state
  renderLaboratories();
  
  // Enable next step button
  const nextBtn = document.getElementById('lab-select-next-btn');
  if (nextBtn) {
    nextBtn.disabled = false;
    nextBtn.classList.remove('btn-secondary');
    nextBtn.classList.add('btn-primary');
  }

  // Populate order summary names
  document.getElementById('summary-lab').innerText = lab.name;
}

// 7. Step navigation & wizard flow
function goToStep(stepNum) {
  // Hide all panels
  document.querySelectorAll('.sandbox-step-panel').forEach(p => p.classList.remove('active'));
  // Show active panel
  document.getElementById(`step-panel-${stepNum}`).classList.add('active');

  // Update navbar indicators
  document.querySelectorAll('.sandbox-step-indicator').forEach(ind => {
    const indStep = parseInt(ind.getAttribute('data-step'));
    ind.classList.remove('active');
    
    if (indStep === stepNum) {
      ind.classList.add('active');
    }
    
    if (indStep < stepNum) {
      ind.classList.add('completed');
    } else {
      ind.classList.remove('completed');
    }
  });

  state.currentStep = stepNum;

  // Specific panel triggers
  if (stepNum === 4) {
    calculateCheckoutBill();
  }
}

function jumpToStep(stepNum) {
  // Allow navigation if they have filled prerequisites
  if (stepNum === 3 && !state.selectedLab) {
    // select first lab automatically
    const firstLab = laboratories[0];
    const baseCost = rulesDatabase[state.market].analytes.required.reduce((acc, curr) => acc + (curr.basePrice || 0), 0);
    const addonsCost = state.selectedAnalytes.reduce((acc, curr) => curr.price ? acc + curr.price : acc, 0);
    selectLaboratory(firstLab.id, Math.round((baseCost + addonsCost) * firstLab.baseRateMultiplier));
  }
  goToStep(stepNum);
}

// 8. Checkout page details selection & calculations
function selectPackage(pkgType) {
  state.package = pkgType;
  document.querySelectorAll('.package-card').forEach(c => c.classList.remove('active'));
  document.getElementById(`pkg-${pkgType}`).classList.add('active');
  calculateCheckoutBill();
}

function setSimulationPath(pathType) {
  state.simulationPath = pathType;
  document.querySelectorAll('.path-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.path-btn[data-path="${pathType}"]`).classList.add('active');
}

function calculateCheckoutBill() {
  if (!state.selectedLab) return;

  const basePrice = state.selectedLab.finalPrice;
  let pkgSubtotal = basePrice;
  let pkgName = 'Custom Panel';

  if (state.package === 'compliance') {
    // Only required analytes
    const reqBase = rulesDatabase[state.market].analytes.required.reduce((acc, curr) => acc + (curr.basePrice || 0), 0);
    pkgSubtotal = Math.round(reqBase * state.selectedLab.baseRateMultiplier);
    pkgName = 'Compliance Package';
  } else if (state.package === 'characterization') {
    // Required + all recommended
    const reqBase = rulesDatabase[state.market].analytes.required.reduce((acc, curr) => acc + (curr.basePrice || 0), 0);
    const recBase = rulesDatabase[state.market].analytes.recommended.reduce((acc, curr) => acc + (curr.price || 0), 0);
    pkgSubtotal = Math.round((reqBase + recBase) * state.selectedLab.baseRateMultiplier);
    pkgName = 'Full Characterization';
  } else {
    // Custom selections verbatim
    pkgSubtotal = basePrice;
    pkgName = 'Custom Package';
  }

  const shipping = 14.00;
  const subtotal = pkgSubtotal;
  const vat = Math.round(subtotal * 0.19 * 100) / 100;
  const total = subtotal + shipping + vat;

  // Write values to DOM
  document.getElementById('pkg-price-compliance').innerText = `€${Math.round(rulesDatabase[state.market].analytes.required.reduce((acc, curr) => acc + (curr.basePrice || 0), 0) * state.selectedLab.baseRateMultiplier)}`;
  document.getElementById('pkg-price-full').innerText = `€${Math.round((rulesDatabase[state.market].analytes.required.reduce((acc, curr) => acc + (curr.basePrice || 0), 0) + rulesDatabase[state.market].analytes.recommended.reduce((acc, curr) => acc + (curr.price || 0), 0)) * state.selectedLab.baseRateMultiplier)}`;
  document.getElementById('pkg-price-custom').innerText = `€${basePrice}`;

  document.getElementById('summary-market').innerText = `${rulesDatabase[state.market].name.split(' (')[0]} (${state.market})`;
  document.getElementById('summary-pkg').innerText = pkgName;
  document.getElementById('summary-qty').innerText = `${document.getElementById('sample-qty').value || '10'}g`;
  document.getElementById('summary-subtotal').innerText = `€${subtotal.toFixed(2)}`;
  document.getElementById('summary-vat').innerText = `€${vat.toFixed(2)}`;
  document.getElementById('summary-total').innerText = `€${total.toFixed(2)}`;
}

// 9. Submit Order & Running the Timeline Simulation
function submitSampleOrder() {
  goToStep(5);

  // Show loading spinner first
  document.getElementById('sim-loading-screen').classList.remove('hidden');
  document.getElementById('sim-results-layout').classList.add('hidden');

  // Generate random IDs for the order output
  const randOrd = `ORD-2026-07-${Math.floor(1000 + Math.random() * 9000)}`;
  const randSmp = `SMP-${Math.floor(10000 + Math.random() * 9000)}`;
  state.orderId = randOrd;
  state.sampleId = randSmp;

  // Set initial CoA state (pending)
  document.getElementById('res-ord-id').innerText = randOrd;
  document.getElementById('res-smp-id').innerText = randSmp;
  document.getElementById('res-lab-name').innerText = state.selectedLab.name;
  
  // Set date issued to today
  const todayStr = new Date().toISOString().split('T')[0];
  state.dateIssued = todayStr;

  // Draw loading CoA
  resetCoaToPending();

  // Hide modal verify initially
  document.getElementById('qr-modal-view').classList.remove('active');

  setTimeout(() => {
    // Hide spinner, show layout
    document.getElementById('sim-loading-screen').classList.add('hidden');
    document.getElementById('sim-results-layout').classList.remove('hidden');
    
    // Start running event log timeline updates
    runTimelineSimulation();
  }, 1800);
}

function resetCoaToPending() {
  const card = document.getElementById('coa-document-card');
  card.className = 'coa-card'; // clear classes
  
  const banner = document.getElementById('coa-verdict-banner');
  banner.className = 'coa-verdict-banner verdict-pending animate-pulse';
  document.getElementById('coa-verdict-icon').innerText = '⧗';
  document.getElementById('coa-verdict-title').innerText = 'IN TESTING';
  document.getElementById('coa-verdict-subtitle').innerText = 'The laboratory is currently processing your sample.';

  document.getElementById('coa-lab-name-val').innerText = state.selectedLab.name;
  document.getElementById('coa-num-val').innerText = `COA-2026-${state.selectedLab.avatar}-${Math.floor(1000 + Math.random() * 9000)}`;
  document.getElementById('coa-sample-name-val').innerText = document.getElementById('sample-name').value;
  document.getElementById('coa-batch-val').innerText = document.getElementById('batch-num').value;
  document.getElementById('coa-market-val').innerText = `${rulesDatabase[state.market].name.split(' (')[0]} &bull; Medical`;
  document.getElementById('coa-date-val').innerText = 'Awaiting...';

  // Table loading state
  document.getElementById('coa-results-tbody').innerHTML = `
    <tr>
      <td colspan="4" class="table-loading-placeholder">
        <span class="animate-pulse">Analyzing sample vial via chromatography...</span>
      </td>
    </tr>
  `;

  // Clear signatures
  document.getElementById('sig-analyst').innerText = 'Awaiting testing...';
  document.getElementById('sig-analyst').className = 'sig-rendered';
  document.getElementById('sig-qa').innerText = 'Awaiting QC...';
  document.getElementById('sig-qa').className = 'sig-rendered';

  // Hide next buttons
  document.getElementById('remediation-guidance-card').classList.add('hidden');
  document.getElementById('btn-show-public-qr').classList.add('hidden');
}

function runTimelineSimulation() {
  const dots = document.querySelectorAll('.stepper-dot');
  
  // Set stepper dots back to step 5 active
  dots.forEach((dot, idx) => {
    dot.className = 'step-dot';
    if (idx < 4) dot.classList.add('completed');
    if (idx === 4) dot.classList.add('active');
  });

  // Reset Event log items display
  const items = document.querySelectorAll('.event-log-container .event-item');
  items.forEach((item, idx) => {
    item.classList.add('hidden');
    if (idx < 5) item.classList.remove('hidden');
  });
  
  document.getElementById('event-in-testing').className = 'event-item active';
  document.getElementById('active-testing-text').innerText = 'HPLC Cannabinoid profile started by analyst M. LEHNER.';

  // Scroll event log container to top
  const logContainer = document.querySelector('.event-log-container');
  logContainer.scrollTop = 0;

  // Timeline Step 6: Move to QC Review
  setTimeout(() => {
    dots[4].className = 'step-dot completed';
    dots[5].className = 'step-dot active';
    
    document.getElementById('event-in-testing').className = 'event-item';
    const qcEv = document.getElementById('event-qc-review');
    qcEv.classList.remove('hidden');
    qcEv.className = 'event-item active';
    
    // Scroll event log
    logContainer.scrollTop = logContainer.scrollHeight;

    // Renders partial results in CoA
    renderPartialResults();

  }, 3500);

  // Timeline Step 7: CoA Issued!
  setTimeout(() => {
    dots[5].className = 'step-dot completed';
    dots[6].className = 'step-dot completed'; // final dot

    document.getElementById('event-qc-review').className = 'event-item';
    const coaEv = document.getElementById('event-coa-issued');
    coaEv.classList.remove('hidden');
    coaEv.className = 'event-item active';

    if (state.simulationPath === 'pass') {
      document.getElementById('event-coa-badge').className = 'event-badge badge-pass';
      document.getElementById('event-coa-text').innerText = `Certificate of Analysis signed and hashed on chain. Verdict: PASS.`;
    } else {
      document.getElementById('event-coa-badge').className = 'event-badge badge-fail';
      document.getElementById('event-coa-text').innerText = `Certificate of Analysis signed and hashed on chain. Verdict: FAIL — Cadmium heavy-metal limit exceeded.`;
    }

    logContainer.scrollTop = logContainer.scrollHeight;

    // Render Final Results
    renderFinalResults();

  }, 7000);
}

function renderPartialResults() {
  const tbody = document.getElementById('coa-results-tbody');
  tbody.innerHTML = `
    <tr>
      <td>Total THC</td>
      <td>18.4%</td>
      <td>&mdash;</td>
      <td><span class="status-pill pass">PASS</span></td>
    </tr>
    <tr>
      <td>Total CBD</td>
      <td>0.6%</td>
      <td>&mdash;</td>
      <td><span class="status-pill pass">PASS</span></td>
    </tr>
    <tr class="animate-pulse">
      <td colspan="4" class="table-loading-placeholder" style="padding: 10px !important;">
        Running ICP-MS heavy metals scan (Lead, Cadmium, Arsenic)...
      </td>
    </tr>
  `;
}

function renderFinalResults() {
  const tbody = document.getElementById('coa-results-tbody');
  const isPass = (state.simulationPath === 'pass');

  // Populate final results
  tbody.innerHTML = `
    <tr>
      <td>Total THC</td>
      <td>18.4%</td>
      <td>&mdash;</td>
      <td><span class="status-pill pass">PASS</span></td>
    </tr>
    <tr>
      <td>Total CBD</td>
      <td>0.6%</td>
      <td>&mdash;</td>
      <td><span class="status-pill pass">PASS</span></td>
    </tr>
    <tr>
      <td>Lead (Pb)</td>
      <td>0.18 ppm</td>
      <td>0.50 ppm</td>
      <td><span class="status-pill pass">PASS</span></td>
    </tr>
    <tr>
      <td>Cadmium (Cd)</td>
      <td class="${isPass ? '' : 'text-fail'}">${isPass ? '0.12 ppm' : '1.50 ppm'}</td>
      <td>${state.market === 'DE' ? '0.20 ppm' : '0.50 ppm'}</td>
      <td>
        <span class="status-pill ${isPass ? 'pass' : 'fail'}">${isPass ? 'PASS' : 'FAIL'}</span>
      </td>
    </tr>
    <tr>
      <td>Arsenic (As)</td>
      <td>0.08 ppm</td>
      <td>1.50 ppm</td>
      <td><span class="status-pill pass">PASS</span></td>
    </tr>
  `;

  // Update verdict banner
  const banner = document.getElementById('coa-verdict-banner');
  const icon = document.getElementById('coa-verdict-icon');
  const title = document.getElementById('coa-verdict-title');
  const sub = document.getElementById('coa-verdict-subtitle');
  
  banner.className = 'coa-verdict-banner';
  
  if (isPass) {
    banner.classList.add('verdict-pass');
    icon.innerText = '✓';
    title.innerText = 'PASS';
    sub.innerText = 'Batch meets all regulatory limits for target market.';
  } else {
    banner.classList.add('verdict-fail');
    icon.innerText = '✕';
    title.innerText = 'FAIL — Cadmium exceeds limit';
    sub.innerText = `Product is ineligible for sale in ${rulesDatabase[state.market].name.split(' (')[0]}.`;
  }

  // Set date issued
  document.getElementById('coa-date-val').innerText = state.dateIssued;

  // Add signatures
  document.getElementById('sig-analyst').innerText = 'Dr. M. Hartmann';
  document.getElementById('sig-analyst').className = 'sig-rendered text-accent-weight';
  document.getElementById('sig-qa').innerText = 'A. Weber';
  document.getElementById('sig-qa').className = 'sig-rendered text-accent-weight';

  // Make COA card signed (actives actual qr code render)
  document.getElementById('coa-document-card').classList.add('signed');

  // Show action buttons
  document.getElementById('btn-show-public-qr').classList.remove('hidden');

  if (!isPass) {
    document.getElementById('remediation-guidance-card').classList.remove('hidden');
    // Update remediation limit values
    document.getElementById('remediation-header').innerText = `Cadmium 1.5 ppm in flower — likely soil / fertilizer uptake`;
  }

  // Pre-load mobile verification modal content
  populateMobileVerification();
}

// 10. Mobile QR Verification Preview
function toggleQrVerificationPage() {
  const modal = document.getElementById('qr-modal-view');
  modal.classList.toggle('active');
}

function populateMobileVerification() {
  const body = document.getElementById('mobile-verification-body');
  const isPass = (state.simulationPath === 'pass');
  const marketRules = rulesDatabase[state.market];

  if (isPass) {
    body.innerHTML = `
      <div class="verification-badge success">
        <span>✓</span> VERIFIED AUTHENTIC &bull; GENUINE
      </div>
      
      <div class="mobile-verify-card">
        <h4>Batch Verdict: <span class="text-pass">PASS</span></h4>
        <div class="mobile-data-row">
          <span class="mobile-data-label">Sample Name</span>
          <strong>${document.getElementById('sample-name').value}</strong>
        </div>
        <div class="mobile-data-row">
          <span class="mobile-data-label">Batch ID</span>
          <strong class="code-font">${document.getElementById('batch-num').value}</strong>
        </div>
        <div class="mobile-data-row">
          <span class="mobile-data-label">Laboratory</span>
          <strong>${state.selectedLab.name}</strong>
        </div>
        <div class="mobile-data-row">
          <span class="mobile-data-label">Market ruleset</span>
          <strong>${marketRules.name.split(' (')[0]}</strong>
        </div>
        <div class="mobile-data-row">
          <span class="mobile-data-label">Verified Date</span>
          <strong class="code-font">${state.dateIssued}</strong>
        </div>
      </div>

      <div class="mobile-verify-card">
        <h4>Analyte breakdown</h4>
        <div class="mobile-data-row">
          <span>THC</span>
          <strong>18.4% (Pass)</strong>
        </div>
        <div class="mobile-data-row">
          <span>CBD</span>
          <strong>0.6% (Pass)</strong>
        </div>
        <div class="mobile-data-row">
          <span>Lead (Pb)</span>
          <strong>0.18 ppm (Pass)</strong>
        </div>
        <div class="mobile-data-row">
          <span>Cadmium (Cd)</span>
          <strong>0.12 ppm (Pass)</strong>
        </div>
      </div>

      <div class="mobile-verify-actions">
        <button class="btn btn-primary" onclick="alert('PDF downloaded!')">Download signed PDF</button>
      </div>
    `;
  } else {
    body.innerHTML = `
      <div class="verification-badge failed">
        <span>✕</span> VERIFIED AUTHENTIC &bull; REJECTED BATCH
      </div>
      
      <div class="mobile-verify-card">
        <h4>Batch Verdict: <span class="text-fail">FAIL</span></h4>
        <div class="mobile-data-row text-fail">
          <span>Failed Analyte:</span>
          <strong>Cadmium (Cd)</strong>
        </div>
        <div class="mobile-data-row">
          <span class="mobile-data-label">Sample Name</span>
          <strong>${document.getElementById('sample-name').value}</strong>
        </div>
        <div class="mobile-data-row">
          <span class="mobile-data-label">Batch ID</span>
          <strong class="code-font">${document.getElementById('batch-num').value}</strong>
        </div>
        <div class="mobile-data-row">
          <span class="mobile-data-label">Laboratory</span>
          <strong>${state.selectedLab.name}</strong>
        </div>
        <div class="mobile-data-row">
          <span class="mobile-data-label">Verified Date</span>
          <strong class="code-font">${state.dateIssued}</strong>
        </div>
      </div>

      <div class="mobile-verify-card" style="background-color: #FFF2F2; border-color: rgba(220,38,38,0.15)">
        <h4 class="text-fail">Recall / Alert Notice</h4>
        <p style="font-size: 0.8rem; color: #5C1D1D; line-height: 1.4;">
          This batch failed heavy metals limits (Cd registered at 1.50 ppm vs limit of ${state.market === 'DE' ? '0.20 ppm' : '0.50 ppm'}). 
          Distributing this batch in ${state.market} is a regulatory violation.
        </p>
      </div>

      <div class="mobile-verify-actions">
        <button class="btn btn-accent-dark" onclick="alert('Report submitted!')">Report Recall Violation</button>
        <button class="btn btn-secondary" onclick="alert('PDF downloaded!')">Download signed PDF</button>
      </div>
    `;
  }
}

// 11. Reset Sandbox Simulation
function resetSandbox() {
  goToStep(1);
  state.selectedLab = null;
  state.package = 'characterization';
  state.simulationPath = 'pass';
  
  // Reset select elements
  document.querySelectorAll('.package-card').forEach(c => c.classList.remove('active'));
  document.getElementById('pkg-characterization').classList.add('active');
  
  document.querySelectorAll('.path-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.path-btn[data-path="pass"]').classList.add('active');

  // Disable next button
  const nextBtn = document.getElementById('lab-select-next-btn');
  if (nextBtn) {
    nextBtn.disabled = true;
    nextBtn.classList.remove('btn-primary');
    nextBtn.classList.add('btn-secondary');
  }

  renderComplianceEngine();
}
