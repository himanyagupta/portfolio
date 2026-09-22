/* Builds the socials, education, skills, projects and experience markup
   from js/data.js so content is edited in one place. */
(function () {
    'use strict';

    const D = window.PORTFOLIO || {};
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    function h(tag, attrs, children) {
        const node = document.createElement(tag);
        if (attrs) {
            Object.keys(attrs).forEach((k) => {
                const v = attrs[k];
                if (v == null || v === false) return;
                if (k === 'class') node.className = v;
                else if (k === 'text') node.textContent = v;
                else node.setAttribute(k, v === true ? '' : v);
            });
        }
        (children || []).forEach((c) => { if (c) node.append(c); });
        return node;
    }
    const icon = (cls) => h('i', { class: cls, 'aria-hidden': 'true' });
    const isPlaceholder = (url) => !url || /^YOUR_/.test(url);

    /* ---------- Socials ---------- */
    function socialHref(s) {
        return s.email ? 'mailto:' + s.email : s.url;
    }

    function renderSocials() {
        $$('[data-socials]').forEach((list) => {
            const variant = list.getAttribute('data-socials');
            (D.socials || []).forEach((s) => {
                const href = socialHref(s);
                const external = !s.email;
                const placeholder = isPlaceholder(s.email || s.url);

                if (variant === 'contact') {
                    const a = h('a', {
                        class: 'contact-card',
                        href: href,
                        target: external ? '_blank' : null,
                        rel: external ? 'noopener noreferrer' : null,
                        title: s.label,
                        'data-placeholder': placeholder ? '' : null
                    }, [
                        h('span', { class: 'contact-card__icon' }, [icon(s.icon)]),
                        h('span', { class: 'contact-card__text' }, [
                            h('strong', { text: s.label }),
                            h('small', { text: s.blurb || '' })
                        ]),
                        icon('fa-solid fa-arrow-up-right-from-square contact-card__go')
                    ]);
                    list.append(h('li', null, [a]));
                    return;
                }

                const a = h('a', {
                    class: 'social',
                    href: href,
                    target: external ? '_blank' : null,
                    rel: external ? 'noopener noreferrer' : null,
                    'aria-label': external ? s.label + ' (opens in a new tab)' : 'Email Himanya',
                    'data-tip': s.label,
                    'data-placeholder': placeholder ? '' : null
                }, [icon(s.icon)]);
                list.append(h('li', null, [a]));
            });
        });
    }

    /* ---------- Timeline shared helpers ---------- */
    function timelineItem(current, card) {
        return h('li', { class: 'timeline__item reveal' + (current ? ' is-current' : ''), 'data-anim': 'left' }, [
            h('span', { class: 'timeline__dot', 'aria-hidden': 'true' }),
            card
        ]);
    }

    /* ---------- Education ---------- */
    function renderEducation() {
        const root = $('#educationTimeline');
        if (!root) return;
        (D.education || []).forEach((e, i) => {
            const head = h('div', { class: 'timeline__meta' }, [
                h('span', { class: 'timeline__date', text: e.period }),
                e.status ? h('span', { class: 'badge', text: e.status }) : null
            ]);
            const kids = [
                head,
                h('h3', { class: 'timeline__title', text: e.title }),
                h('p', { class: 'timeline__org', text: e.org })
            ];
            if (e.description) kids.push(h('p', { class: 'timeline__text', text: e.description }));
            if (e.stats && e.stats.length) {
                const row = h('dl', { class: 'stat-row' });
                e.stats.forEach((s) => {
                    row.append(h('div', { class: 'stat' }, [
                        h('dt', { text: s.label }),
                        h('dd', null, [
                            h('span', { class: 'stat__value', 'data-count': s.value, text: s.value }),
                            s.unit ? h('span', { class: 'stat__unit', text: s.unit }) : null
                        ])
                    ]));
                });
                kids.push(row);
            }
            root.append(timelineItem(i === 0, h('div', { class: 'card timeline__card' }, kids)));
        });
    }

    /* ---------- Experience ---------- */
    function renderExperience() {
        const root = $('#experienceTimeline');
        if (!root) return;
        (D.experience || []).forEach((x) => {
            const kids = [
                h('div', { class: 'timeline__meta' }, [
                    h('span', { class: 'timeline__date', text: x.period }),
                    x.current ? h('span', { class: 'badge badge--live', text: 'Current' }) : null
                ]),
                h('h3', { class: 'timeline__title', text: x.role }),
                h('p', { class: 'timeline__org', text: x.org }),
                x.summary ? h('p', { class: 'timeline__text', text: x.summary }) : null
            ];

            if (x.flow && x.flow.length) {
                const ol = h('ol', { class: 'flow' });
                x.flow.forEach((step, i) => {
                    ol.append(h('li', { class: 'flow__step' }, [
                        h('span', { class: 'flow__n', text: String(i + 1) }),
                        h('span', { text: step })
                    ]));
                });
                kids.push(h('div', { class: 'flow-wrap' }, [
                    h('p', { class: 'flow-wrap__title', text: x.flowTitle || 'Flow' }),
                    ol
                ]));
            }

            if (x.points && x.points.length) {
                const ul = h('ul', { class: 'checklist' });
                x.points.forEach((p) => ul.append(h('li', null, [icon('fa-solid fa-check'), h('span', { text: p })])));
                kids.push(ul);
            }
            if (x.tags && x.tags.length) {
                const tags = h('ul', { class: 'tags' });
                x.tags.forEach((t) => tags.append(h('li', { text: t })));
                kids.push(tags);
            }
            root.append(timelineItem(x.current, h('div', { class: 'card timeline__card' }, kids)));
        });
    }

    /* ---------- Skills (carousel slides) ---------- */
    function renderSkills() {
        const track = $('#skillsGrid');
        if (!track) return;
        (D.skills || []).forEach((cat) => {
            const chips = h('ul', { class: 'chip-list' });
            cat.items.forEach((it) => {
                chips.append(h('li', { class: 'chip' }, [
                    icon(it.icon),
                    h('span', { text: it.name }),
                    it.note ? h('em', { class: 'chip__note', text: it.note }) : null
                ]));
            });
            const card = h('article', { class: 'card skill-card' }, [
                h('div', { class: 'skill-card__head' }, [
                    h('span', { class: 'skill-card__icon' }, [icon(cat.icon)]),
                    h('h3', { text: cat.title })
                ]),
                cat.blurb ? h('p', { class: 'skill-card__blurb', text: cat.blurb }) : null,
                chips
            ]);
            track.append(h('div', { class: 'carousel__slide carousel__slide--skill' }, [card]));
        });
    }

    /* ---------- Projects (carousel slides) ---------- */
    function renderProjects() {
        const track = $('#projectsGrid');
        if (!track) return;

        (D.projects || []).forEach((p) => {
            const media = h('div', { class: 'project__media' }, [
                h('img', { src: p.image, alt: p.imageAlt || (p.title + ' screenshot'), loading: 'lazy', decoding: 'async', width: '1200', height: '750' }),
                h('div', { class: 'project__placeholder' }, [
                    icon(p.placeholderIcon || 'fa-solid fa-image'),
                    h('span', { text: p.title }),
                    h('small', { text: 'Screenshot: ' + p.image })
                ])
            ]);

            const links = h('div', { class: 'project__links' });
            if (p.liveUrl) {
                links.append(h('a', {
                    class: 'btn btn--primary btn--sm', href: p.liveUrl, target: '_blank', rel: 'noopener noreferrer',
                    'aria-label': p.title + ' live demo (opens in a new tab)'
                }, [h('span', { text: 'Live demo' }), icon('fa-solid fa-arrow-up-right-from-square')]));
            }
            links.append(h('a', {
                class: 'btn btn--ghost btn--sm', href: p.githubUrl, target: '_blank', rel: 'noopener noreferrer',
                'aria-label': p.title + ' on GitHub (opens in a new tab)', title: p.title + ' on GitHub',
                'data-placeholder': isPlaceholder(p.githubUrl) ? '' : null
            }, [icon('fa-brands fa-github'), h('span', { text: 'GitHub' })]));

            const body = h('div', { class: 'project__body' }, [
                p.context ? h('p', { class: 'project__context', text: p.context }) : null,
                h('h3', { class: 'project__title', text: p.title }),
                p.role ? h('p', { class: 'project__role', text: p.role }) : null,
                h('p', { class: 'project__desc', text: p.description })
            ]);

            if (p.features && p.features.length) {
                const ul = h('ul', { class: 'project__features' });
                p.features.forEach((f) => ul.append(h('li', { text: f })));
                body.append(ul);
            }
            if (p.tech && p.tech.length) {
                const tags = h('ul', { class: 'tags' });
                p.tech.forEach((t) => tags.append(h('li', { text: t })));
                body.append(tags);
            }
            body.append(links);

            const card = h('article', { class: 'card project', 'aria-label': p.title }, [media, body]);
            track.append(h('div', { class: 'carousel__slide carousel__slide--project' }, [card]));
        });
    }

    window.PortfolioRender = {
        all() {
            renderSocials();
            renderEducation();
            renderSkills();
            renderProjects();
            renderExperience();
        },
        isPlaceholder
    };
})();
