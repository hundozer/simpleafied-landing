/**
 * SIMPLEAFIED 2.0 — KEYNOTE INTERACTIVITY & MOTION ENGINE
 * Features:
 * - 3D Cursor Parallax Physics for 3 Floating iPad Devices
 * - Scroll-driven rotation and sculptural expansion
 * - Live Product Screen Micro-interactions (e-Signature, Batch Trace, LIMS)
 * - Animated Ecosystem Diagram
 * - Industry Architecture Modals & Demo Request Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  initCursorParallax();
  initScrollChoreography();
  initProductMicroInteractions();
  initEcosystemDiagram();
  initModals();
});

/* -------------------------------------------------------------
 * 1. 3D CURSOR PARALLAX ENGINE
 * ------------------------------------------------------------- */
function initCursorParallax() {
  const stage = document.getElementById('exhibition-stage');
  const stage3d = document.getElementById('stage-3d');
  const ipadCenter = document.getElementById('ipad-veritas');
  const ipadLeft = document.getElementById('ipad-genesis');
  const ipadRight = document.getElementById('ipad-nexus');

  if (!stage || !stage3d || !ipadCenter) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX = (e.clientX - centerX) / (rect.width / 2);
    mouseY = (e.clientY - centerY) / (rect.height / 2);
  });

  function renderParallax() {
    // Smooth interpolation (lerp)
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    // Center iPad independent subtle tilt
    const centerRotX = 4 - currentY * 8;
    const centerRotY = currentX * 10;
    ipadCenter.style.transform = `translate3d(0px, ${currentY * -12}px, 80px) rotateX(${centerRotX}deg) rotateY(${centerRotY}deg)`;

    // Left iPad tilt & offset
    const leftRotX = 6 - currentY * 6;
    const leftRotY = 18 + currentX * 12;
    ipadLeft.style.transform = `translate3d(-340px, ${20 + currentY * -8}px, -40px) rotateX(${leftRotX}deg) rotateY(${leftRotY}deg)`;

    // Right iPad tilt & offset
    const rightRotX = 6 - currentY * 6;
    const rightRotY = -18 + currentX * 12;
    ipadRight.style.transform = `translate3d(340px, ${20 + currentY * -8}px, -40px) rotateX(${rightRotX}deg) rotateY(${rightRotY}deg)`;

    requestAnimationFrame(renderParallax);
  }

  renderParallax();
}

/* -------------------------------------------------------------
 * 2. SCROLL CHOREOGRAPHY & DEVICE ROTATION
 * ------------------------------------------------------------- */
function initScrollChoreography() {
  const header = document.getElementById('site-header');
  const ipadLeft = document.getElementById('ipad-genesis');
  const ipadRight = document.getElementById('ipad-nexus');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header background opacity on scroll
    if (scrollY > 50) {
      header.style.boxShadow = '0 4px 20px rgba(17, 19, 21, 0.06)';
    } else {
      header.style.boxShadow = 'none';
    }

    // Gentle scroll drift for iPads in hero
    if (scrollY < 1000 && window.innerWidth > 1100) {
      const scrollFactor = scrollY * 0.15;
      ipadLeft.style.marginLeft = `-${scrollFactor}px`;
      ipadRight.style.marginRight = `-${scrollFactor}px`;
    }
  });
}

/* -------------------------------------------------------------
 * 3. LIVE PRODUCT MICRO-INTERACTIONS
 * ------------------------------------------------------------- */
function initProductMicroInteractions() {
  // Veritas Electronic Signature Simulation
  const signBtn = document.getElementById('simulate-sign-btn');
  const auditLog = document.getElementById('audit-log-list');
  const auditScore = document.getElementById('audit-score-num');

  if (signBtn && auditLog) {
    signBtn.addEventListener('click', () => {
      signBtn.disabled = true;
      signBtn.innerText = 'Verifying PKI Signature...';
      signBtn.style.opacity = '0.7';

      setTimeout(() => {
        signBtn.innerText = 'Signature Authorization Recorded ✓';
        signBtn.style.backgroundColor = '#047857';
        signBtn.style.opacity = '1';

        // Add log entry
        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        const newLog = document.createElement('div');
        newLog.className = 'log-entry';
        newLog.style.animation = 'fadeIn 0.4s ease';
        newLog.innerHTML = `
          <span class="log-time">${timeStr}</span>
          <span class="log-txt" style="color:#059669; font-weight:700;">QP Release Signed: Dr. M. Weber (eIDAS Validated)</span>
        `;
        auditLog.prepend(newLog);

        if (auditScore) {
          auditScore.innerText = '99.4';
        }
      }, 1000);
    });
  }
}

/* -------------------------------------------------------------
 * 4. ECOSYSTEM DIAGRAM INTERACTIVITY
 * ------------------------------------------------------------- */
function initEcosystemDiagram() {
  const nodes = document.querySelectorAll('.node-product');
  const connLines = document.querySelectorAll('.conn-line');

  nodes.forEach((node) => {
    node.addEventListener('mouseenter', () => {
      connLines.forEach(line => line.style.stroke = '#059669');
    });

    node.addEventListener('mouseleave', () => {
      connLines.forEach(line => line.style.stroke = '#111315');
    });
  });
}

/* -------------------------------------------------------------
 * 5. MODAL HANDLERS & INDUSTRY DATA
 * ------------------------------------------------------------- */
const INDUSTRY_DETAILS = {
  'life-sciences': {
    title: 'Life Sciences Regulatory Architecture',
    subtitle: 'EU MDR & GxP Compliance Infrastructure',
    points: [
      'Automated ISO 13485 design history file (DHF) compilation.',
      'Validated 21 CFR Part 11 electronic signature workflows.',
      'Real-time supplier quality auditing and CAPA linking.',
      'EU EUDAMED medical device database integration ready.'
    ]
  },
  'biotech': {
    title: 'Biotechnology & Advanced Therapeutics',
    subtitle: 'Cell & Gene Therapy (ATMP) Traceability',
    points: [
      'Chain of identity (COI) and chain of custody (COC) tracking.',
      'Cold-chain temperature telemetry monitoring down to -196°C.',
      'Cleanroom environmental monitoring (EM) data aggregation.',
      'Automated batch release protocol for custom autologous therapies.'
    ]
  },
  'pharma': {
    title: 'Pharmaceutical Manufacturing (EU GMP)',
    subtitle: 'Annex 1, Annex 11 & Annex 16 QP Release Automation',
    points: [
      'Full manufacturing batch lineage and precursor lot genealogy.',
      'Qualified Person (QP) automated release authorization checklist.',
      'Integrated Change Control and Deviation Management (QRM).',
      'EU Falsified Medicines Directive (FMD) serialization sync.'
    ]
  },
  'testing-labs': {
    title: 'Testing Laboratories (ISO/IEC 17025)',
    subtitle: 'Accredited LIMS & Direct Instrument Integration',
    points: [
      'Direct RS-232 / REST API instrument data acquisition (HPLC, GC-MS, ICP-MS).',
      'Out-of-Specification (OOS) automated investigation trigger.',
      'Tamper-evident Certificate of Analysis (CoA) generation.',
      'Multi-lab sample routing and audit trail verification.'
    ]
  },
  'medical-cannabis': {
    title: 'Medical Cannabis & Botanical Extracts',
    subtitle: 'EU GMSP & GACP Regulatory Infrastructure',
    points: [
      'GACP cultivation batch tracking to EU GMP extraction facility.',
      'Standardized cannabinoid & terpene profile testing verification.',
      'Heavy metals, pesticides, and residual solvent safety thresholds.',
      'Cross-border European import/export regulatory documentation.'
    ]
  },
  'advanced-manufacturing': {
    title: 'Advanced Manufacturing & Specialty Chemicals',
    subtitle: 'ISO 9001 & High-Precision Quality Controls',
    points: [
      'Statistical Process Control (SPC) real-time quality limits.',
      'Raw material lot traceability across complex supply chains.',
      'Non-conformance reporting (NCR) and corrective action workflow.',
      'Regulatory compliance dashboards for REACH & CLP mandates.'
    ]
  }
};

function initModals() {
  // Demo Modal Triggers
  const demoModal = document.getElementById('demo-modal');
  const demoBtns = [
    document.getElementById('open-demo-btn'),
    document.getElementById('open-demo-btn-hero'),
    document.getElementById('open-demo-btn-final')
  ];
  const closeModalBtn = document.getElementById('close-modal-btn');

  demoBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', () => {
        demoModal.classList.add('active');
        demoModal.setAttribute('aria-hidden', 'false');
      });
    }
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      demoModal.classList.remove('active');
      demoModal.setAttribute('aria-hidden', 'true');
    });
  }

  // Close modal when clicking backdrop
  demoModal.addEventListener('click', (e) => {
    if (e.target === demoModal) {
      demoModal.classList.remove('active');
      demoModal.setAttribute('aria-hidden', 'true');
    }
  });

  // Industry Detail Modal Triggers
  const indModal = document.getElementById('industry-modal');
  const indModalBody = document.getElementById('ind-modal-body');
  const closeIndModalBtn = document.getElementById('close-ind-modal-btn');
  const industryTiles = document.querySelectorAll('.industry-tile');

  industryTiles.forEach((tile) => {
    tile.addEventListener('click', () => {
      const indKey = tile.getAttribute('data-industry');
      const data = INDUSTRY_DETAILS[indKey];

      if (data && indModalBody) {
        indModalBody.innerHTML = `
          <div class="meta-tag">Industry Focus</div>
          <h3 class="modal-title">${data.title}</h3>
          <p class="modal-sub">${data.subtitle}</p>
          <div style="margin: 1.5rem 0;">
            <h4 style="font-size: 0.85rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-muted); margin-bottom:1rem;">Architecture Highlights</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.8rem;">
              ${data.points.map(pt => `
                <li style="display:flex; align-items:flex-start; gap:0.6rem; font-size:0.95rem; color:var(--text-secondary);">
                  <span style="color:var(--emerald-muted); font-weight:700;">✓</span>
                  <span>${pt}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          <div style="margin-top:2rem; display:flex; gap:1rem;">
            <button class="btn btn-primary-keynote" onclick="document.getElementById('industry-modal').classList.remove('active'); document.getElementById('demo-modal').classList.add('active');">Request Industry Demo &rarr;</button>
          </div>
        `;
        indModal.classList.add('active');
      }
    });
  });

  if (closeIndModalBtn) {
    closeIndModalBtn.addEventListener('click', () => {
      indModal.classList.remove('active');
    });
  }

  indModal.addEventListener('click', (e) => {
    if (e.target === indModal) {
      indModal.classList.remove('active');
    }
  });
}

// Global Demo Form Handler
function handleFormSubmit() {
  const form = document.getElementById('demo-form');
  const successMsg = document.getElementById('form-success');

  if (form && successMsg) {
    form.style.display = 'none';
    successMsg.classList.add('active');
  }
}
