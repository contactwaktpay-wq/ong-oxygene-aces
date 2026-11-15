(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Année du pied de page
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  // Menu mobile
  var btn = $('#menuBtn'), menu = $('#mobileMenu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('hidden') === false;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('.mob-link', menu).forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.add('hidden'); btn.setAttribute('aria-expanded', 'false'); });
    });
  }

  // Onglets des 4 secteurs
  $$('.axe-tab').forEach(function (t) {
    t.addEventListener('click', function () {
      $$('.axe-tab').forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-selected', 'false'); });
      $$('.axe-panel').forEach(function (p) { p.classList.toggle('active', p.getAttribute('data-panel') === t.getAttribute('data-axe')); });
      t.classList.add('active'); t.setAttribute('aria-selected', 'true');
    });
  });

  // FAQ
  $$('.faq-head').forEach(function (h) {
    h.addEventListener('click', function () {
      var item = h.parentNode, open = !item.classList.contains('open');
      $$('.faq-item').forEach(function (i) { i.classList.remove('open'); $('.faq-head', i).setAttribute('aria-expanded', 'false'); });
      if (open) { item.classList.add('open'); h.setAttribute('aria-expanded', 'true'); }
    });
  });

  // Visionneuse photo
  var lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
  function closeLb() { lb.classList.remove('open'); lbImg.src = ''; document.body.style.overflow = ''; }
  $$('.gal-card').forEach(function (c) {
    c.addEventListener('click', function () {
      lbImg.src = c.getAttribute('data-full'); lbImg.alt = c.getAttribute('data-cap') || '';
      lbCap.textContent = c.getAttribute('data-cap') || '';
      lb.classList.add('open'); document.body.style.overflow = 'hidden'; $('#lbClose').focus();
    });
  });
  if (lb) {
    $('#lbClose').addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lb.classList.contains('open')) closeLb(); });
  }

  // Wilayas
  var chosenRegion = '';
  $$('.region-pill').forEach(function (p) {
    p.addEventListener('click', function () {
      $$('.region-pill').forEach(function (x) { x.classList.remove('active'); });
      p.classList.add('active'); chosenRegion = p.textContent.trim();
      $('#regionName').textContent = chosenRegion; $('#regionInfo').classList.remove('hidden');
    });
  });
  var rc = $('#regionContact');
  if (rc) rc.addEventListener('click', function () {
    var s = $('#fSubject'); if (s) s.value = 'Projet dans une wilaya';
    var m = $('#fMsg'); if (m && !m.value) m.value = 'Wilaya : ' + chosenRegion + '\n';
  });
  $$('[data-subject]').forEach(function (a) {
    a.addEventListener('click', function () { var s = $('#fSubject'); if (s) s.value = a.getAttribute('data-subject'); });
  });

  // Formulaire : WhatsApp ou e-mail (aucun serveur nécessaire)
  var form = $('#contactForm'), via = 'wa';
  if (form) {
    $$('button[type=submit]', form).forEach(function (b) { b.addEventListener('click', function () { via = b.getAttribute('data-via'); }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#fName').value.trim(), phone = $('#fPhone').value.trim(),
          subj = $('#fSubject').value, msg = $('#fMsg').value.trim();
      if (!name || !msg) { $('#fErr').classList.remove('hidden'); return; }
      $('#fErr').classList.add('hidden');
      var body = 'Objet : ' + subj + '\nNom : ' + name + (phone ? '\nTéléphone : ' + phone : '') + '\n\n' + msg;
      if (via === 'mail') {
        location.href = 'mailto:oxygeneaces@gmail.com?subject=' + encodeURIComponent('[Site web] ' + subj) + '&body=' + encodeURIComponent(body);
      } else {
        window.open('https://wa.me/22248485919?text=' + encodeURIComponent(body), '_blank', 'noopener');
      }
    });
  }

  // Lien actif dans la navigation
  if ('IntersectionObserver' in window) {
    var links = $$('.nav-link');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('header[id], section[id]').forEach(function (s) { io.observe(s); });
  }
})();
