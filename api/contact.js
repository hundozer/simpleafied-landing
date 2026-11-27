// Vercel serverless function: receives the website contact form and emails it to the team.
// Needs RESEND_API_KEY in the Vercel project's environment. Optional: CONTACT_TO, CONTACT_FROM.
// Without a key it answers 503, and the page offers the visitor a pre-filled email instead.

const TO = process.env.CONTACT_TO || 'contact@simpleafied.app';
const FROM = process.env.CONTACT_FROM || 'Simpleafied website <website@simpleafied.app>';
const ORG_TYPES = ['Grower or producer', 'Testing laboratory', 'Life-sciences QA team', 'Other'];
const INTERESTS = ['Veritas', 'Genesis', 'Nexus', 'Connected release', 'Not sure yet'];
const TOPICS = { pilot: 'Pilot customer', general: 'Contact' };
const LIMITS = { name: 120, email: 200, company: 160, role: 120, country: 80, message: 4000 };

// Best-effort throttle per warm instance: 5 messages per IP per 10 minutes.
const hits = new Map();
function throttled(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 600000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const oneLine = (v) => v.replace(/[\r\n]+/g, ' ');
const esc = (v) => v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function validate(b) {
  if (!b || typeof b !== 'object') return { error: 'invalid' };
  const d = {
    topic: TOPICS[b.topic] ? b.topic : 'general',
    name: oneLine(str(b.name, LIMITS.name)),
    email: oneLine(str(b.email, LIMITS.email)),
    company: oneLine(str(b.company, LIMITS.company)),
    role: oneLine(str(b.role, LIMITS.role)),
    country: oneLine(str(b.country, LIMITS.country)),
    orgType: ORG_TYPES.includes(b.orgType) ? b.orgType : '',
    interests: Array.isArray(b.interests) ? b.interests.filter((i) => INTERESTS.includes(i)) : [],
    message: str(b.message, LIMITS.message),
  };
  if (!d.name || !d.company || !d.orgType) return { error: 'missing_fields' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) return { error: 'invalid_email' };
  if (b.consent !== true) return { error: 'no_consent' };
  return { data: d };
}

function render(d) {
  const rows = [
    ['Name', d.name], ['Email', d.email], ['Company', d.company], ['Role', d.role],
    ['Organisation', d.orgType], ['Country', d.country], ['Interested in', d.interests.join(', ')],
  ];
  const text = `${TOPICS[d.topic]} enquiry from simpleafied.eu\n\n` +
    rows.map(([k, v]) => `${k}: ${v || '—'}`).join('\n') +
    `\n\nMessage:\n${d.message || '—'}\n\nThe sender agreed that Simpleafied may use these details to reply. Reply to this email to answer them.`;
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#222">
<p><strong>${esc(TOPICS[d.topic])} enquiry</strong> from simpleafied.eu</p>
<table cellpadding="6" style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="color:#777">${esc(k)}</td><td>${esc(v || '—')}</td></tr>`).join('')}</table>
<p style="color:#777;margin-top:16px">Message</p><p style="white-space:pre-wrap">${esc(d.message || '—')}</p>
<p style="color:#999;font-size:12px">The sender agreed that Simpleafied may use these details to reply. Reply to this email to answer them.</p></div>`;
  return { text, html };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }

  // Bots fill the hidden field: accept silently, send nothing.
  if (body && typeof body.website === 'string' && body.website.trim() !== '') return res.status(200).json({ ok: true });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (throttled(ip)) return res.status(429).json({ ok: false, error: 'too_many_requests' });

  const { data, error } = validate(body);
  if (error) return res.status(400).json({ ok: false, error });

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(503).json({ ok: false, error: 'not_configured' });

  const { text, html } = render(data);
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: data.email,
        subject: `Website: ${TOPICS[data.topic]} — ${data.company}`,
        text,
        html,
      }),
    });
    if (!r.ok) {
      console.error('contact: send failed', r.status, await r.text().catch(() => ''));
      return res.status(502).json({ ok: false, error: 'send_failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('contact: send error', e && e.message);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
};

module.exports.validate = validate;
module.exports.render = render;
