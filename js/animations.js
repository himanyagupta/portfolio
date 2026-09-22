/* Motion for the portfolio.

   Design rules:
   - Content is only hidden by JavaScript right before it animates in, and the
     loader covers the page while that happens. If anything here fails, rescue()
     puts everything back so the site is still fully readable.
   - Anime.js drives the entrances (loader, hero, reveals, counters, menu).
     If it fails to load, plain CSS transitions are used instead.
   - Everything scroll-linked runs in ONE requestAnimationFrame loop.
   - prefers-reduced-motion turns all of it off. */
(function () {
    'use strict';

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasAnime = typeof window.anime === 'function';
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

    const HERO_SEL = '#heroHi, .hero__role, .hero__desc, .hero__actions .btn, .hero .social-list li, .hero-badge, .hero__mark, .scroll-hint';
    const FROM = {
        up: 'translateY(28px)',
        left: 'translateX(-28px)',
        scale: 'translateY(36px) scale(.97)'
    };

    let heroChars = [];
    let observed = [];
    let io = null;

    function clearInline(el) {
        el.style.opacity = '';
        el.style.transform = '';
        el.style.transition = '';
        el.style.transitionDelay = '';
    }

    /* Restore everything to its normal, visible state. */
    function rescue() {
        $$('.reveal, .chip, .char, [data-count], ' + HERO_SEL).forEach(clearInline);
        $$('[data-mask] > .mask-inner').forEach(clearInline);
        $$('[data-count]').forEach((el) => { el.textContent = el.dataset.count; });
    }

    /* ---------- Loader ---------- */
    function runLoader(done) {
        const loader = $('#loader');
        if (!loader) { done(); return; }

        let finished = false;
        function finish() {
            if (finished) return;
            finished = true;
            loader.classList.add('is-done');
            try { sessionStorage.setItem('himanya-loaded', '1'); } catch (e) { /* storage unavailable */ }
            setTimeout(() => { loader.hidden = true; }, 700);
            done();
        }

        let seen = false;
        try { seen = sessionStorage.getItem('himanya-loaded') === '1'; } catch (e) { /* ignore */ }
        if (reduceMotion || seen) { finish(); return; }

        const bar = $('#loaderBar');
        const pct = $('#loaderPercent');
        const label = $('#loaderLabel');
        const state = { v: 0 };

        function paint(v) {
            const n = Math.round(v);
            if (pct) pct.textContent = n + '%';
            if (bar) bar.style.transform = 'scaleX(' + (n / 100) + ')';
            if (label) label.textContent = n < 50 ? 'INITIALIZING...' : (n < 100 ? 'LOADING PORTFOLIO...' : 'READY');
        }

        /* Failsafe: the loader can never get stuck. */
        setTimeout(finish, 3200);

        if (hasAnime) {
            window.anime({
                targets: state,
                v: 100,
                duration: 1400,
                easing: 'easeInOutQuad',
                update: () => paint(state.v),
                complete: () => { paint(100); setTimeout(finish, 220); }
            });
        } else {
            let v = 0;
            const timer = setInterval(() => {
                v += 8;
                paint(Math.min(v, 100));
                if (v >= 100) { clearInterval(timer); setTimeout(finish, 220); }
            }, 90);
        }
    }

    /* ---------- Preparing hidden start states ---------- */
    function splitName() {
        const el = $('#heroName');
        if (!el || el.dataset.split) return;
        const text = el.textContent;
        el.textContent = '';
        el.dataset.split = '1';
        Array.from(text).forEach((ch) => {
            const s = document.createElement('span');
            s.className = 'char';
            s.textContent = ch;
            s.setAttribute('aria-hidden', 'true');
            el.append(s);
        });
        heroChars = $$('.char', el);
    }

    function hide(el, kind) {
        el.style.opacity = '0';
        el.style.transform = FROM[kind] || FROM.up;
    }

    function prepare() {
        if (reduceMotion) return;

        splitName();
        $$(HERO_SEL).forEach((el) => { el.style.opacity = '0'; });
        heroChars.forEach((c) => { c.style.opacity = '0'; });

        $$('[data-mask]').forEach((el) => {
            if (el.querySelector('.mask-inner')) return;
            const inner = document.createElement('span');
            inner.className = 'mask-inner';
            inner.textContent = el.textContent;
            el.textContent = '';
            el.append(inner);
            el.classList.add('is-masked');
            inner.style.transform = 'translateY(105%)';
            observed.push(el);
        });

        $$('.reveal').forEach((el) => {
            hide(el, el.dataset.anim || 'up');
            observed.push(el);
        });

        $$('.reveal .chip').forEach((c) => {
            c.style.opacity = '0';
            c.style.transform = 'scale(.9)';
        });

        $$('.reveal [data-count]').forEach((el) => {
            const dec = (el.dataset.count.split('.')[1] || '').length;
            el.textContent = (0).toFixed(dec);
        });
    }

    /* ---------- Hero intro ---------- */
    function heroIntro() {
        if (reduceMotion) return;
        if (!hasAnime) { rescue(); return; }

        const A = window.anime;
        const tl = A.timeline({
            easing: 'easeOutExpo',
            complete: () => {
                $$(HERO_SEL).forEach(clearInline);
                heroChars.forEach(clearInline);
                const caret = $('#heroCaret');
                if (caret) {
                    caret.classList.add('is-on');
                    setTimeout(() => caret.classList.remove('is-on'), 2800);
                }
            }
        });

        tl.add({ targets: '#heroHi', opacity: [0, 1], translateY: [14, 0], duration: 700 })
            .add({ targets: heroChars, opacity: [0, 1], translateY: ['0.35em', 0], delay: A.stagger(75), duration: 650, easing: 'easeOutCubic' }, '-=350')
            .add({ targets: '.hero__role', opacity: [0, 1], translateX: [-20, 0], duration: 800 }, '-=300')
            .add({ targets: '.hero__desc', opacity: [0, 1], translateY: [16, 0], duration: 800 }, '-=550')
            .add({ targets: '.hero__actions .btn', opacity: [0, 1], scale: [0.9, 1], delay: A.stagger(100), duration: 700, easing: 'easeOutBack' }, '-=500')
            .add({ targets: '.hero .social-list li', opacity: [0, 1], scale: [0.5, 1], delay: A.stagger(80), duration: 600, easing: 'easeOutBack' }, '-=450')
            .add({ targets: '.hero__mark', opacity: [0, 1], duration: 1400 }, 500)
            .add({ targets: '.hero-badge', opacity: [0, 1], scale: [0.85, 1], translateY: [22, 0], delay: A.stagger(150), duration: 850, easing: 'easeOutBack' }, 750)
            .add({ targets: '.scroll-hint', opacity: [0, 1], duration: 600 }, '-=250');
    }

    /* ---------- Scroll reveals ---------- */
    function enter(el, kind, delay) {
        if (hasAnime) {
            const p = {
                targets: el,
                opacity: [0, 1],
                duration: 850,
                delay: delay || 0,
                easing: 'easeOutCubic',
                complete: () => clearInline(el)
            };
            if (kind === 'left') p.translateX = [-28, 0];
            else if (kind === 'scale') { p.translateY = [36, 0]; p.scale = [0.97, 1]; }
            else p.translateY = [28, 0];
            window.anime(p);
        } else {
            el.style.transition = 'opacity .7s ease, transform .7s ease';
            el.style.transitionDelay = (delay || 0) + 'ms';
            requestAnimationFrame(() => requestAnimationFrame(() => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            }));
            setTimeout(() => clearInline(el), 1000 + (delay || 0));
        }
    }

    function enterMask(el) {
        const inner = el.querySelector('.mask-inner');
        if (!inner) return;
        if (hasAnime) {
            window.anime({
                targets: inner,
                translateY: ['105%', 0],
                duration: 1000,
                easing: 'easeOutExpo',
                complete: () => clearInline(inner)
            });
        } else {
            inner.style.transition = 'transform .8s ease';
            requestAnimationFrame(() => requestAnimationFrame(() => { inner.style.transform = 'none'; }));
        }
    }

    function enterChips(root, base) {
        const chips = $$('.chip', root);
        if (!chips.length) return;
        if (hasAnime) {
            window.anime({
                targets: chips,
                opacity: [0, 1],
                scale: [0.9, 1],
                duration: 500,
                delay: window.anime.stagger(40, { start: base + 250 }),
                easing: 'easeOutCubic',
                complete: () => chips.forEach(clearInline)
            });
        } else {
            chips.forEach(clearInline);
        }
    }

    function countUp(el) {
        const raw = el.dataset.count;
        const target = parseFloat(raw);
        const dec = (raw.split('.')[1] || '').length;
        if (!hasAnime || isNaN(target)) { el.textContent = raw; return; }
        const o = { v: 0 };
        window.anime({
            targets: o,
            v: target,
            duration: 1600,
            delay: 350,
            easing: 'easeOutExpo',
            update: () => { el.textContent = o.v.toFixed(dec); },
            complete: () => { el.textContent = raw; }
        });
    }

    function reveal(el, order) {
        if (el.__done) return;
        el.__done = true;
        if (io) io.unobserve(el);
        if (el.hasAttribute('data-mask')) { enterMask(el); return; }
        const delay = el.dataset.delay ? Number(el.dataset.delay) : order * 90;
        enter(el, el.dataset.anim || 'up', delay);
        enterChips(el, delay);
        $$('[data-count]', el).forEach(countUp);
    }

    function startReveals() {
        if (reduceMotion || !observed.length) return;

        if (!('IntersectionObserver' in window)) { rescue(); return; }

        io = new IntersectionObserver((entries) => {
            let order = 0;
            entries.forEach((entry) => {
                if (entry.isIntersecting) reveal(entry.target, order++);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

        observed.forEach((el) => io.observe(el));

        /* Safety net: anything that is on screen but was somehow missed. */
        setInterval(() => {
            const vh = window.innerHeight;
            observed.forEach((el) => {
                if (el.__done) return;
                const r = el.getBoundingClientRect();
                if (r.top < vh * 0.92 && r.bottom > 0) reveal(el, 0);
            });
        }, 1500);
    }

    /* ---------- Scroll-linked effects (single rAF loop) ---------- */
    function startScroll() {
        const bar = $('#scrollProgress');
        const parallax = $$('[data-parallax]');
        const layers = $$('[data-parallax-layer]');
        const grid = $('#heroGrid');
        const symbols = $('#symbols');
        const flows = $$('.hero, .section');
        const timelines = $$('.timeline');
        const bandRows = $$('[data-band]');
        const band = $('#band');
        const reachedLists = timelines.map((t) => $$('.timeline__item', t));

        if (reduceMotion) {
            timelines.forEach((t) => t.style.setProperty('--draw', '1'));
            $$('.timeline__item').forEach((i) => i.classList.add('is-reached'));
            return;
        }

        let ticking = false;
        const setVar = (el, name, val) => {
            if (el.__last !== val) { el.__last = val; el.style.setProperty(name, val); }
        };

        function update() {
            ticking = false;
            const vh = window.innerHeight;
            const y = window.scrollY;
            const docH = document.documentElement.scrollHeight;

            /* top progress bar */
            if (bar) {
                const p = docH - vh > 0 ? y / (docH - vh) : 0;
                bar.style.transform = 'scaleX(' + clamp(p, 0, 1).toFixed(4) + ')';
            }

            /* hero background layers drift slower than the page */
            if (y < vh * 1.3) {
                if (grid) grid.style.transform = 'translate3d(0,' + (y * 0.12).toFixed(1) + 'px,0)';
                if (symbols) symbols.style.transform = 'translate3d(0,' + (y * 0.2).toFixed(1) + 'px,0)';
                layers.forEach((l) => {
                    const f = parseFloat(l.dataset.parallaxLayer) || 0.05;
                    l.style.setProperty('--py', (-y * f).toFixed(1) + 'px');
                });
            }

            /* image parallax (uses the parent frame so it does not feed back) */
            parallax.forEach((el) => {
                const r = el.parentElement.getBoundingClientRect();
                if (r.bottom < -120 || r.top > vh + 120) return;
                const speed = parseFloat(el.dataset.parallax) || 0.06;
                const offset = ((r.top + r.height / 2) - vh / 2) * -speed;
                el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0) scale(1.1)';
            });

            /* sections ease back and dim slightly as the next one takes over */
            flows.forEach((s) => {
                const r = s.getBoundingClientRect();
                const zone = vh * 0.45;
                const leave = r.bottom < zone ? clamp(1 - r.bottom / zone, 0, 1) : 0;
                setVar(s, '--leave', leave.toFixed(2));
            });

            /* drifting words band */
            if (band) {
                const r = band.getBoundingClientRect();
                if (r.bottom > 0 && r.top < vh) {
                    const p = clamp((vh - r.top) / (vh + r.height), 0, 1);
                    bandRows.forEach((row) => {
                        const dir = Number(row.dataset.band) || 1;
                        row.style.transform = 'translate3d(' + ((p - 0.5) * dir * 320).toFixed(1) + 'px,0,0)';
                    });
                }
            }

            /* timeline line draws itself as you read */
            timelines.forEach((t, i) => {
                const r = t.getBoundingClientRect();
                const p = clamp((vh * 0.7 - r.top) / Math.max(r.height, 1), 0, 1);
                setVar(t, '--draw', p.toFixed(3));
                reachedLists[i].forEach((item) => {
                    const ir = item.getBoundingClientRect();
                    item.classList.toggle('is-reached', ir.top < vh * 0.7);
                });
            });
        }

        function queue() {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }

        window.addEventListener('scroll', queue, { passive: true });
        window.addEventListener('resize', queue);
        update();
    }

    /* ---------- Mobile menu ---------- */
    function menuOpen() {
        if (reduceMotion || !hasAnime) return;
        const items = $$('.nav__links li');
        items.forEach((li) => { li.style.opacity = '0'; });
        window.anime({
            targets: items,
            opacity: [0, 1],
            translateY: [18, 0],
            delay: window.anime.stagger(55, { start: 120 }),
            duration: 600,
            easing: 'easeOutCubic',
            complete: () => items.forEach(clearInline)
        });
    }

    window.PortfolioMotion = {
        reduceMotion: reduceMotion,
        prepare: prepare,
        runLoader: runLoader,
        heroIntro: heroIntro,
        startReveals: startReveals,
        startScroll: startScroll,
        menuOpen: menuOpen,
        rescue: rescue
    };
})();
