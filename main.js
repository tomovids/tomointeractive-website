/* Tomo Interactive — site behaviour */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- Theme toggle ---------- */
  document.getElementById('themeToggle').addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('ti-theme', next); } catch (e) { /* private mode */ }
  });

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');

  var closeMenu = function () {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
  };

  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Contact form ----------
     No backend is wired up yet. Until one is (see README.md), this opens the
     visitor's mail client with the message pre-filled so no enquiry is lost.
     Set ENDPOINT to a form-service URL to POST instead. */
  var ENDPOINT = '';
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');

  var setNote = function (msg, kind) {
    note.textContent = msg;
    note.className = 'form-note' + (kind ? ' ' + kind : '');
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      project: form.project.value,
      message: form.message.value.trim()
    };

    var missing = !data.name || !data.email || !data.message;
    var badEmail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);

    form.name.setAttribute('aria-invalid', String(!data.name));
    form.email.setAttribute('aria-invalid', String(!data.email || badEmail));
    form.message.setAttribute('aria-invalid', String(!data.message));

    if (missing || badEmail) {
      setNote(missing ? 'Please fill in every field.' : 'That email address looks incomplete.', 'err');
      return;
    }

    if (!ENDPOINT) {
      var subject = 'Project enquiry — ' + data.project;
      var body = 'Name: ' + data.name + '\nEmail: ' + data.email +
                 '\nInterest: ' + data.project + '\n\n' + data.message;
      window.location.href = 'mailto:contact@tomointeractive.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      setNote('Opening your email app — press send to finish.', 'ok');
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    setNote('Sending…');

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (res) {
      if (!res.ok) throw new Error(res.status);
      form.reset();
      setNote('Thanks — we\'ll be in touch shortly.', 'ok');
    }).catch(function () {
      setNote('Something went wrong. Please email contact@tomointeractive.com directly.', 'err');
    }).finally(function () {
      btn.disabled = false;
    });
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
