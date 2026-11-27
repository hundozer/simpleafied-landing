// Contact dialog. Without JavaScript (or without <dialog>), the buttons stay plain mailto links.
(function () {
  var dialog = document.getElementById('contact');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  var form = document.getElementById('contact-form');
  var done = dialog.querySelector('.contact-done');
  var status = form.querySelector('.form-status');
  var submit = form.querySelector('[type=submit]');
  var label = dialog.querySelector('[data-topic-label]');
  var LABELS = { pilot: 'Pilot customer', general: 'Contact us' };

  function open(topic) {
    form.hidden = false; done.hidden = true;
    status.textContent = ''; status.className = 'form-status';
    form.elements.topic.value = topic;
    label.textContent = LABELS[topic] || LABELS.general;
    dialog.showModal();
    document.documentElement.classList.add('modal-open');
    setTimeout(function () { form.elements.name.focus(); }, 50);
  }
  function close() { dialog.close(); }
  dialog.addEventListener('close', function () { document.documentElement.classList.remove('modal-open'); });

  document.querySelectorAll('[data-contact]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); open(a.getAttribute('data-contact')); });
  });
  dialog.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', close); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) close(); });

  function collect() {
    var f = form.elements;
    var interests = Array.prototype.slice.call(form.querySelectorAll('input[name=interest]:checked')).map(function (c) { return c.value; });
    return {
      topic: f.topic.value, website: f.website.value,
      name: f.name.value.trim(), email: f.email.value.trim(), company: f.company.value.trim(),
      role: f.role.value.trim(), orgType: f.orgType.value, country: f.country.value.trim(),
      interests: interests, message: f.message.value.trim(), consent: f.consent.checked
    };
  }

  function fallbackLink(d) {
    var body = 'Name: ' + d.name + '\nCompany: ' + d.company + '\nRole: ' + d.role + '\nOrganisation: ' + d.orgType +
      '\nCountry: ' + d.country + '\nInterested in: ' + d.interests.join(', ') + '\n\n' + d.message;
    return 'mailto:contact@simpleafied.app?subject=' + encodeURIComponent('Website: ' + (LABELS[d.topic] || 'Contact')) + '&body=' + encodeURIComponent(body);
  }

  form.addEventListener('input', function () {
    if (status.classList.contains('err')) { status.textContent = ''; status.className = 'form-status'; }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.className = 'form-status';
    if (!form.checkValidity()) {
      status.textContent = 'Please fill in the fields marked with *, and tick the consent box.';
      status.classList.add('err');
      var bad = form.querySelector(':invalid'); if (bad) bad.focus();
      return;
    }
    var d = collect();
    submit.disabled = true; status.textContent = 'Sending…';
    fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && res.j.ok) { if (window.sfTrack) window.sfTrack('generate_lead', { form_topic: d.topic }); form.reset(); form.hidden = true; done.hidden = false; status.textContent = ''; return; }
        throw new Error(res.j.error || 'failed');
      })
      .catch(function () {
        status.classList.add('err');
        status.innerHTML = 'Sorry, your message could not be sent. Please <a href="' + fallbackLink(d).replace(/"/g, '&quot;') + '">email it to contact@simpleafied.app</a> instead.';
      })
      .then(function () { submit.disabled = false; });
  });
})();
