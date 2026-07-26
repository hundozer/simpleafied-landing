/**
 * SIMPLEAFIED SOLUTIONS — OFFICIAL BRANDBOOK INTERACTIVITY
 * Motion Physics, Hardware Parallax & Live Micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initCursorParallax();
  initScrollChoreography();
  initProductMicroInteractions();
  initEcosystemDiagram();
  initModals();
});

/* 1. 3D HARDWARE PARALLAX & REFLECTION ENGINE */
function initCursorParallax() {
  const stage = document.getElementById('exhibition-stage');
  const deviceCenter = document.getElementById('device-veritas');
  const deviceLeft = document.getElementById('device-genesis');
  const deviceRight = document.getElementById('device-nexus');

  if (!stage || !deviceCenter) return;

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
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    const centerRotX = 4 - currentY * 8;
    const centerRotY = currentX * 10;
    deviceCenter.style.transform = `translate3d(0px, ${currentY * -10}px, 80px) rotateX(${centerRotX}deg) rotateY(${centerRotY}deg)`;

    const leftRotX = 6 - currentY * 6;
    const leftRotY = 18 + currentX * 12;
    deviceLeft.style.transform = `translate3d(-340px, ${20 + currentY * -8}px, -40px) rotateX(${leftRotX}deg) rotateY(${leftRotY}deg)`;

    const rightRotX = 6 - currentY * 6;
    const rightRotY = -18 + currentX * 12;
    deviceRight.style.transform = `translate3d(340px, ${20 + currentY * -8}px, -40px) rotateX(${rightRotX}deg) rotateY(${rightRotY}deg)`;

    requestAnimationFrame(renderParallax);
  }

  renderParallax();
}

/* 2. SCROLL CHOREOGRAPHY */
function initScrollChoreography() {
  const header = document.getElementById('site-header');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 40) {
      header.style.backgroundColor = 'rgba(0, 50, 66, 0.96)';
      header.style.boxShadow = '0 4px 20px rgba(0, 20, 30, 0.6)';
    } else {
      header.style.backgroundColor = 'rgba(0, 50, 66, 0.92)';
      header.style.boxShadow = 'none';
    }
  });
}

/* 3. PRODUCT MICRO-INTERACTIONS */
function initProductMicroInteractions() {
  const signBtn = document.getElementById('simulate-sign-btn');
  const auditLog = document.getElementById('audit-log-list');
  const sigState = document.getElementById('sig-state-text');
  const auditScore = document.getElementById('audit-score-num');

  if (signBtn && auditLog) {
    signBtn.addEventListener('click', () => {
      signBtn.disabled = true;
      signBtn.innerText = 'Validating PKI Credentials...';
      signBtn.style.opacity = '0.7';

      setTimeout(() => {
        signBtn.innerText = 'Signature Authorization Executed ✓';
        signBtn.style.backgroundColor = '#11A38E';
        signBtn.style.opacity = '1';

        if (sigState) {
          sigState.innerText = 'QP Authorized (Dr. M. Weber &bull; eIDAS Validated)';
          sigState.style.color = '#83D9B5';
        }

        const now = new Date();
        const timeStr = now.toTimeString().split(' ')[0];
        const newRow = document.createElement('div');
        newRow.className = 'log-row';
        newRow.innerHTML = `
          <span class="log-time">${timeStr}</span>
          <span class="log-desc" style="color:#83D9B5; font-weight:700;">QP Signature Executed: PKI Certified (EU Annex 11)</span>
        `;
        auditLog.prepend(newRow);

        if (auditScore) {
          auditScore.innerText = '99.4';
        }
      }, 900);
    });
  }
}

/* 4. ECOSYSTEM DIAGRAM INTERACTIVITY */
function initEcosystemDiagram() {
  const nodes = document.querySelectorAll('.net-node');
  const lines = document.querySelectorAll('.net-line');

  nodes.forEach((node) => {
    node.addEventListener('mouseenter', () => {
      lines.forEach(l => l.style.stroke = '#11A38E');
    });

    node.addEventListener('mouseleave', () => {
      lines.forEach(l => l.style.stroke = '#A3C2CA');
    });
  });
}

/* 5. MODALS & INDUSTRY DRAWERS */
const INDUSTRY_DETAILS = {
  'life-sciences': {
    title: 'Life Sciences Software Infrastructure',
    subtitle: 'EU MDR & GxP Quality System Architecture',
    points: [
      'Automated ISO 13485 Design History File (DHF) compilation.',
      'Validated 21 CFR Part 11 electronic signature workflows.',
      'Real-time supplier quality auditing and CAPA linking.',
      'EU EUDAMED medical device database integration ready.'
    ]
  },
  'biotech': {
    title: 'Biotechnology & Advanced Therapeutics',
    subtitle: 'Cell & Gene Therapy (ATMP) Traceability Platform',
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

  demoModal.addEventListener('click', (e) => {
    if (e.target === demoModal) {
      demoModal.classList.remove('active');
      demoModal.setAttribute('aria-hidden', 'true');
    }
  });

  const indModal = document.getElementById('industry-modal');
  const indModalBody = document.getElementById('ind-modal-body');
  const closeIndModalBtn = document.getElementById('close-ind-modal-btn');
  const industryTiles = document.querySelectorAll('.ind-card');

  industryTiles.forEach((tile) => {
    tile.addEventListener('click', () => {
      const indKey = tile.getAttribute('data-industry');
      const data = INDUSTRY_DETAILS[indKey];

      if (data && indModalBody) {
        indModalBody.innerHTML = `
          <span class="meta-tag-brand">INDUSTRY SPECIFICATION</span>
          <h3 class="modal-title">${data.title}</h3>
          <p class="modal-sub">${data.subtitle}</p>
          <div style="margin: 1.5rem 0;">
            <h4 style="font-family:var(--font-mono); font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); margin-bottom:1rem;">System Highlights</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.8rem;">
              ${data.points.map(pt => `
                <li style="display:flex; align-items:flex-start; gap:0.6rem; font-size:0.92rem; color:var(--text-primary);">
                  <span style="color:var(--teal-primary); font-weight:700;">✓</span>
                  <span>${pt}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          <div style="margin-top:2rem; display:flex; gap:1rem;">
            <button class="btn btn-primary-brand" onclick="document.getElementById('industry-modal').classList.remove('active'); document.getElementById('demo-modal').classList.add('active');">Schedule Industry Demo &rarr;</button>
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

function handleFormSubmit() {
  const form = document.getElementById('demo-form');
  const successMsg = document.getElementById('form-success');

  if (form && successMsg) {
    form.style.display = 'none';
    successMsg.classList.add('active');
  }
}
