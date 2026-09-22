/* Lightweight carousel built on native scroll-snap.
   - Swipe / trackpad / touch use the browser's own scrolling, so it feels native.
   - Prev/next buttons, arrow keys and mouse-drag are layered on top.
   - While scrolling it exposes --p and --abs on every slide (its distance from
     the left edge). CSS uses those to dim/scale slides and slide the images
     inside them a little, which gives the parallax feel. */
(function () {
    'use strict';

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const pad = (n) => (n < 10 ? '0' + n : String(n));

    function init(root) {
        const track = root.querySelector('.carousel__track');
        if (!track) return;
        const slides = Array.from(track.querySelectorAll('.carousel__slide'));
        if (!slides.length) return;

        const prev = root.querySelector('[data-dir="-1"]');
        const next = root.querySelector('[data-dir="1"]');
        const bar = root.querySelector('.carousel__bar');
        const count = root.querySelector('.carousel__count');
        const total = slides.length;
        let index = 0;
        let ticking = false;

        track.setAttribute('aria-label', 'Scrollable list. Use the left and right arrow keys to browse.');
        slides.forEach((s, i) => {
            s.setAttribute('role', 'group');
            s.setAttribute('aria-roledescription', 'slide');
            s.setAttribute('aria-label', (i + 1) + ' of ' + total);
        });

        const maxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);
        const stepWidth = () => (slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth);
        const pageStep = () => Math.max(1, Math.round(track.clientWidth / stepWidth()) - 1);

        function nearest() {
            const x = track.scrollLeft;
            let best = 0;
            let bestDist = Infinity;
            slides.forEach((s, i) => {
                const d = Math.abs(s.offsetLeft - x);
                if (d < bestDist) { bestDist = d; best = i; }
            });
            return best;
        }

        function goTo(i) {
            const target = clamp(i, 0, total - 1);
            const left = Math.min(slides[target].offsetLeft, maxScroll());
            track.scrollTo({ left: left, behavior: reduceMotion ? 'auto' : 'smooth' });
        }

        function update() {
            ticking = false;
            const max = maxScroll();
            const x = track.scrollLeft;
            const atStart = x <= 2;
            const atEnd = x >= max - 2;
            index = (atEnd && max > 2) ? total - 1 : nearest();

            if (prev) prev.disabled = atStart;
            if (next) next.disabled = atEnd;
            if (count) count.textContent = pad(index + 1) + ' / ' + pad(total);

            if (bar) {
                const visible = track.scrollWidth > 0 ? track.clientWidth / track.scrollWidth : 1;
                const progress = max > 0 ? x / max : 1;
                bar.style.transform = 'scaleX(' + (visible + progress * (1 - visible)).toFixed(3) + ')';
            }

            slides.forEach((s, i) => {
                s.classList.toggle('is-active', i === index);
                if (!reduceMotion) {
                    const rel = clamp((s.offsetLeft - x) / track.clientWidth, -1, 1);
                    s.style.setProperty('--p', rel.toFixed(3));
                    s.style.setProperty('--abs', Math.abs(rel).toFixed(3));
                }
            });
        }

        function queue() {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }

        track.addEventListener('scroll', queue, { passive: true });
        window.addEventListener('resize', queue);

        if (prev) prev.addEventListener('click', () => goTo(index - pageStep()));
        if (next) next.addEventListener('click', () => goTo(index + pageStep()));

        track.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + pageStep()); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - pageStep()); }
            else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
            else if (e.key === 'End') { e.preventDefault(); goTo(total - 1); }
        });

        /* Mouse drag (touch and trackpads already scroll natively) */
        let down = false;
        let moved = false;
        let startX = 0;
        let startLeft = 0;

        track.addEventListener('dragstart', (e) => e.preventDefault());
        track.addEventListener('pointerdown', (e) => {
            if (e.pointerType !== 'mouse' || e.button !== 0) return;
            if (e.target.closest('a, button, input, textarea')) return;
            down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
        });
        window.addEventListener('pointermove', (e) => {
            if (!down) return;
            const dx = e.clientX - startX;
            if (!moved && Math.abs(dx) > 5) { moved = true; track.classList.add('is-dragging'); }
            if (moved) track.scrollLeft = startLeft - dx;
        });
        window.addEventListener('pointerup', () => {
            if (!down) return;
            down = false;
            if (moved) {
                track.classList.remove('is-dragging');
                goTo(nearest());
            }
        });

        update();
    }

    window.initCarousels = function () {
        Array.from(document.querySelectorAll('.carousel')).forEach(init);
    };
})();
