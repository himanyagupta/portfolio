/* Boot sequence and interactive behavior: navigation, mobile menu,
   contact form, image fallbacks, toasts. */
(function () {
    'use strict';

    document.documentElement.classList.add('js');

    const D = window.PORTFOLIO || {};
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function safe(fn, name) {
        try { fn(); } catch (err) { console.error('[portfolio] ' + name + ' failed:', err); }
    }

    /* ---------- Toast ---------- */
    let toastTimer;
    function toast(msg) {
        const el = $('#toast');
        if (!el) return;
        el.textContent = msg;
        el.classList.add('is-on');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => el.classList.remove('is-on'), 3200);
    }

    /* Links that still hold a YOUR_..._HERE placeholder don't navigate. */
    function initPlaceholderLinks() {
        document.addEventListener('click', (e) => {
            const a = e.target.closest('a[data-placeholder]');
            if (!a) return;
            e.preventDefault();
            toast('This link is not set yet. Add it in js/data.js');
        });
    }

    /* ---------- Image fallbacks ---------- */
    function bindFallback(img, wrapper) {
        if (!img || !wrapper) return;
        const fail = () => wrapper.classList.add('is-empty');
        img.addEventListener('error', fail);
        if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) fail();
    }
    function initImages() {
        bindFallback($('#profilePhoto'), $('#photoFrame'));
        $$('.project__media').forEach((m) => bindFallback($('img', m), m));
    }

    /* ---------- Navigation ---------- */
    const header = $('#header');
    const menu = $('#navMenu');
    const toggle = $('#menuToggle');
    let menuIsOpen = false;

    function setMenu(open) {
        menuIsOpen = open;
        menu.classList.toggle('is-open', open);
        toggle.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.classList.toggle('menu-open', open);
        if (open && window.PortfolioMotion) window.PortfolioMotion.menuOpen();
    }

    function initMenu() {
        toggle.addEventListener('click', () => setMenu(!menuIsOpen));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuIsOpen) { setMenu(false); toggle.focus(); }
        });
        window.addEventListener('resize', () => {
            if (menuIsOpen && window.innerWidth > 980) setMenu(false);
        });
    }

    function initNav() {
        const links = $$('.nav__link');
        const sections = $$('main section[id]');

        function setActive(id) {
            links.forEach((l) => {
                const on = l.dataset.section === id;
                l.classList.toggle('is-active', on);
                if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
            });
        }

        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
            }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
            sections.forEach((s) => io.observe(s));
        }

        function onScroll() {
            header.classList.toggle('is-scrolled', window.scrollY > 30);
            /* bottom of the page always means "Contact" */
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) setActive('contact');
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        /* Smooth in-page navigation */
        document.addEventListener('click', (e) => {
            const a = e.target.closest('a[href^="#"]');
            if (!a) return;
            const id = a.getAttribute('href');
            if (id.length < 2) return;
            const target = $(id);
            if (!target) return;
            e.preventDefault();
            if (menuIsOpen) setMenu(false);

            const headerH = header.offsetHeight;
            const top = id === '#home' ? 0 : target.getBoundingClientRect().top + window.scrollY - headerH + 1;
            /* wait a frame so the menu's scroll lock is released first */
            requestAnimationFrame(() => {
                window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });
            });
            if (history.replaceState) history.replaceState(null, '', id);
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        });
    }

    /* ---------- Hero symbols (tiny, slow, low opacity) ---------- */
    function initSymbols() {
        const box = $('#symbols');
        if (!box) return;
        const glyphs = ['{ }', '( )', '</>', '[ ]', '=>', '++', ';', '#', '&&', '//', '0x', '::'];
        const count = window.innerWidth < 700 ? 8 : 14;
        for (let i = 0; i < count; i++) {
            const s = document.createElement('span');
            s.className = 'symbol';
            s.textContent = glyphs[i % glyphs.length];
            s.style.left = (Math.random() * 96).toFixed(1) + '%';
            s.style.top = (Math.random() * 92).toFixed(1) + '%';
            s.style.fontSize = (0.8 + Math.random() * 0.9).toFixed(2) + 'rem';
            s.style.animationDuration = (22 + Math.random() * 20).toFixed(1) + 's';
            s.style.animationDelay = (-Math.random() * 20).toFixed(1) + 's';
            if (i % 3 === 0) s.classList.add('symbol--warm');
            box.append(s);
        }
    }

    /* ---------- Pointer glow on cards (CSS does the drawing) ---------- */
    function initCardGlow() {
        if (reduceMotion) return;
        document.addEventListener('pointermove', (e) => {
            if (e.pointerType !== 'mouse') return;
            const card = e.target.closest && e.target.closest('.card, .contact-card');
            if (!card) return;
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            card.style.setProperty('--my', (e.clientY - r.top) + 'px');
        }, { passive: true });
    }

    /* ---------- Contact form ---------- */
    const rules = {
        name: (v) => (v.trim().length < 2 ? 'Please enter your name.' : ''),
        email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address.'),
        organization: () => '',
        subject: (v) => (v.trim().length < 3 ? 'Please add a short subject.' : ''),
        message: (v) => (v.trim().length < 10 ? 'Your message needs at least 10 characters.' : '')
    };

    function initForm() {
        const form = $('#contactForm');
        if (!form) return;
        const status = $('#formStatus');
        const fields = Object.keys(rules).map((n) => form.elements[n]);

        function check(field) {
            const msg = rules[field.name](field.value);
            const err = $('#' + field.id + '-err');
            if (err) err.textContent = msg;
            field.setAttribute('aria-invalid', msg ? 'true' : 'false');
            field.closest('.field').classList.toggle('has-error', !!msg);
            return !msg;
        }

        fields.forEach((f) => {
            f.addEventListener('blur', () => { if (f.value || f.getAttribute('aria-invalid') === 'true') check(f); });
            f.addEventListener('input', () => { if (f.getAttribute('aria-invalid') === 'true') check(f); });
        });

        function setStatus(kind, nodes) {
            status.className = 'form-status is-' + kind;
            status.textContent = '';
            nodes.forEach((n) => status.append(n));
        }
        const text = (t) => document.createTextNode(t);

        function mailtoUrl(data) {
            const to = (D.contactForm && D.contactForm.toEmail) || '';
            const body = 'Name: ' + data.name + '\nEmail: ' + data.email +
                (data.organization ? '\nOrganization / Work: ' + data.organization : '') +
                '\n\n' + data.message;
            return 'mailto:' + to + '?subject=' + encodeURIComponent(data.subject) + '&body=' + encodeURIComponent(body);
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const results = fields.map(check);
            const firstBad = fields[results.indexOf(false)];
            if (firstBad) {
                setStatus('error', [text('Please fix the highlighted fields.')]);
                firstBad.focus();
                return;
            }
            if (form.elements._gotcha && form.elements._gotcha.value) return; // bot

            const data = {};
            fields.forEach((f) => { data[f.name] = f.value.trim(); });
            const endpoint = D.contactForm && D.contactForm.endpoint;

            if (endpoint) {
                setStatus('info', [text('Sending...')]);
                try {
                    const res = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                        body: JSON.stringify(data)
                    });
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    setStatus('success', [text('Thanks, your message was sent.')]);
                    form.reset();
                } catch (err) {
                    const a = document.createElement('a');
                    a.href = mailtoUrl(data);
                    a.textContent = 'send it by email instead';
                    setStatus('error', [text('That did not go through. You can '), a, text('.')]);
                }
                return;
            }

            /* No backend configured: be honest. Nothing has been sent yet. */
            const a = document.createElement('a');
            a.className = 'btn btn--ghost btn--sm';
            a.href = mailtoUrl(data);
            a.textContent = 'Open in your email app';
            setStatus('success', [text('Thanks \u2014 your message is ready to be sent. '), a]);
        });
    }

    /* ---------- Boot ---------- */
    function boot() {
        const M = window.PortfolioMotion;

        safe(() => window.PortfolioRender.all(), 'render');
        safe(initImages, 'images');
        safe(initPlaceholderLinks, 'placeholder links');
        safe(initMenu, 'menu');
        safe(initNav, 'nav');
        safe(initSymbols, 'symbols');
        safe(initCardGlow, 'card glow');
        safe(initForm, 'form');
        safe(() => { if (window.initCarousels) window.initCarousels(); }, 'carousels');
        safe(() => { const y = $('#year'); if (y) y.textContent = new Date().getFullYear(); }, 'year');

        if (!M) {
            const loader = $('#loader');
            if (loader) loader.hidden = true;
            return;
        }

        try {
            M.prepare();
        } catch (err) {
            console.error('[portfolio] motion setup failed:', err);
            M.rescue();
        }

        safe(() => M.startScroll(), 'scroll effects');
        M.runLoader(() => {
            safe(() => M.heroIntro(), 'hero intro');
            safe(() => M.startReveals(), 'reveals');
        });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();
