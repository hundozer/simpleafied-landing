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
    if (window.innerWidth < 768) return; // Disable parallax on mobile touch screens
    const rect = stage.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX = (e.clientX - centerX) / (rect.width / 2);
    mouseY = (e.clientY - centerY) / (rect.height / 2);
  });

  function renderParallax() {
    if (window.innerWidth >= 768) {
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
    }

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
      'Aseptic manufacturing batch record signoff automation.',
      'Automated QP release gate keeping for patient-specific lots.'
    ]
  },
  'pharma': {
    title: 'Pharmaceutical Manufacturing',
    subtitle: 'EU GMP Annex 1, 11 & 16 Compliance Architecture',
    points: [
      'Cryptographic batch genealogy and lot tracking in seconds.',
      'Cleanroom environmental monitoring system (EMS) integration.',
      'Automated deviation risk classification and CAPA engine.',
      'Qualified Person (QP) electronic batch release portal.'
    ]
  },
  'testing-labs': {
    title: 'Testing Laboratories & Contract Analytics',
    subtitle: 'ISO/IEC 17025 LIMS & Telemetry Engine',
    points: [
      'Direct HPLC, GC-MS, and ICP-MS instrument data extraction.',
      'Out-of-Specification (OOS) investigation automation.',
      'Instant tamper-evident Certificate of Analysis (CoA) issuance.',
      'Blind sample accessioning and analyst workload dispatch.'
    ]
  },
  'medical-cannabis': {
    title: 'Regulated Medical Cannabis',
    subtitle: 'EU GMSP & GACP Seed-to-Patient Traceability',
    points: [
      'Precursor lot tracking and botanical genealogy mapping.',
      'Potency, pesticide, and heavy metals lab test verification.',
      'Export compliance documentation for EU member state distribution.',
      'Automated batch release authorization for GMSP release.'
    ]
  },
  'advanced-manufacturing': {
    title: 'High-Precision & Specialty Chemicals',
    subtitle: 'ISO 9001 & AS9100 Regulatory Quality Control',
    points: [
      'Non-conformance report (NCR) automated triaging.',
      'Calibration and equipment maintenance lifecycle tracking.',
      'Statistical Process Control (SPC) telemetry triggers.',
      'Global audit-readiness and cryptographic evidence logs.'
    ]
  }
};

function initModals() {
  const demoModal = document.getElementById('demo-modal');
  const indModal = document.getElementById('industry-modal');
  const openDemoBtns = [
    document.getElementById('open-demo-btn'),
    document.getElementById('open-demo-btn-hero'),
    document.getElementById('open-demo-btn-final')
  ];
  const closeDemoBtn = document.getElementById('close-modal-btn');
  const closeIndModalBtn = document.getElementById('close-ind-modal-btn');
  const indCards = document.querySelectorAll('.ind-card');
  const indModalBody = document.getElementById('ind-modal-body');

  openDemoBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        demoModal.classList.add('active');
      });
    }
  });

  if (closeDemoBtn) {
    closeDemoBtn.addEventListener('click', () => {
      demoModal.classList.remove('active');
    });
  }

  demoModal.addEventListener('click', (e) => {
    if (e.target === demoModal) {
      demoModal.classList.remove('active');
    }
  });

  indCards.forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.industry;
      const data = INDUSTRY_DETAILS[key];

      if (data && indModalBody) {
        indModalBody.innerHTML = `
          <span class="meta-tag-brand">INDUSTRY ARCHITECTURE</span>
          <h3 style="font-family:var(--font-sans); font-size:1.8rem; font-weight:800; color:var(--text-white); margin-bottom:0.25rem;">${data.title}</h3>
          <p style="color:var(--mint-accent); font-size:0.95rem; margin-bottom:1.5rem; font-weight:600;">${data.subtitle}</p>
          <div style="background-color:var(--bg-card); padding:1.25rem; border-radius:8px; border:1px solid var(--border-subtle);">
            <h5 style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.75rem;">Key Regulatory Capabilities</h5>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.6rem; font-size:0.9rem; color:var(--text-primary);">
              ${data.points.map(pt => `
                <li style="display:flex; align-items:flex-start; gap:0.5rem;">
                  <span style="color:var(--mint-accent); font-weight:700;">✓</span>
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
