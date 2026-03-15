/**
 * ansec-layout.js
 * ──────────────────────────────────────────────────────────────
 * Loads the shared ANSEC topbar, navbar, and footer into every
 * page, then initialises all navigation behaviour.
 *
 * USAGE — add ONE script tag at the very end of <body>:
 *
 *   <script src="/assets/js/ansec-layout.js" defer></script>
 *
 * The script auto-detects the current page path and highlights
 * the matching nav item as active.
 *
 * FILE STRUCTURE ASSUMED:
 *   /index.html
 *   /pages/ansec-*.html
 *   /assets/js/ansec-layout.js                        ← this file
 *   /assets/css/ansec-layout.css                      ← header + footer styles
 *   /assets/components/ansec-header-component.html
 *   /assets/components/ansec-footer-component.html
 *
 * If you prefer not to use separate component HTML files, set
 *   CONFIG.useInlineComponents = true
 * and the script will use the INLINE_HEADER / INLINE_FOOTER
 * constants defined below instead of fetching external files.
 * The inline strings are kept in sync with the component files —
 * the component files remain the single source of truth.
 * ──────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════
     CONFIGURATION
     Edit paths here to match your folder structure.
  ═══════════════════════════════════════════════════════════ */
  const CONFIG = {
    /* Set true to embed HTML inline (no fetch needed, e.g. file:// dev) */
    useInlineComponents: false,

    /* Paths to the component HTML files (relative to site root) */
    headerPath: '/assets/components/ansec-header-component.html',
    footerPath: '/assets/components/ansec-footer-component.html',

    /* Path to the shared CSS file */
    cssPath: '/assets/css/ansec-layout.css',

    /* IDs of the mount-point divs in your page HTML.
       Every page should contain:
         <div id="ansec-header"></div>   <- at very top of <body>
         <div id="ansec-footer"></div>   <- at very bottom of <body>
       If a mount point is absent the script falls back to
       prepend/append on <body> automatically. */
    headerMountId: 'ansec-header',
    footerMountId: 'ansec-footer',

    /* Breakpoint (px) below which the hamburger menu is shown */
    mobileBreak: 992,
  };


  /* ═══════════════════════════════════════════════════════════
     ACTIVE-PAGE MAP
     Maps URL path fragments to data-section attribute values on
     the <li class="al-ni"> elements so the correct nav group
     is highlighted for the current page.
  ═══════════════════════════════════════════════════════════ */
  const ACTIVE_MAP = {
    /* Our School */
    '/pages/ansec-history.html':               'our-school',
    '/pages/ansec-mission-vision-values.html': 'our-school',
    '/pages/ansec-admin-staff.html':           'our-school',
    '/pages/ansec-campus-facilities.html':     'our-school',
    '/pages/ansec-anthem-motto.html':          'our-school',

    /* Academic Life */
    '/pages/ansec-programmes.html':            'academic-life',
    '/pages/ansec-departments.html':           'academic-life',
    '/pages/ansec-academic-calendar.html':     'academic-life',

    /* Admissions (standalone nav item) */
    '/pages/ansec-admissions.html':            'admissions',

    /* Faith & Student Life */
    '/pages/ansec-chaplaincy.html':            'student-life',
    '/pages/ansec-clubs.html':                 'student-life',
    '/pages/ansec-sports.html':                'student-life',
    '/pages/ansec-boarding.html':              'student-life',

    /* Direct nav items */
    '/pages/ansec-events.html':                'events',
    '/pages/ansec-gallery.html':               'gallery',
    '/pages/ansec-contact.html':               'contact',

    /* Topbar-only pages (mapped so partial matching stays correct) */
    '/pages/ansec-alumni.html':                'alumni',
    '/pages/ansec-donate.html':                'donate',
  };


  /* ═══════════════════════════════════════════════════════════
     INLINE HTML FALLBACK
     Exact copies of the component files — used when
     CONFIG.useInlineComponents = true  OR when fetch() fails
     (e.g. opening HTML files directly via the file:// protocol).

     Keep these in sync with the component files.
     The component files are the source of truth.
  ═══════════════════════════════════════════════════════════ */
  const INLINE_HEADER = `<!-- TOPBAR -->
<div class="al-topbar" id="al-topbar" role="banner">
  <div class="al-topbar-inner">
    <a href="/index.html" class="al-brand" aria-label="Anum Presbyterian SHS home">
      <img src="/assets/images/anseclogo.jpg" alt="ANSEC Logo"
           class="al-logo" width="40" height="40"
           loading="eager" onerror="this.style.display='none'"/>
      <span class="al-school-name">
        Anum Presby SHS
        <span class="al-sub">Est. 1897 &middot; Anum, Ghana</span>
      </span>
    </a>
    <div class="al-topbar-actions">
      <a href="/pages/ansec-alumni.html" class="al-alumni" aria-label="Alumni Portal">
        <i class="ri-user-star-line" aria-hidden="true"></i>
        <span class="al-tb-text">Alumni</span>
      </a>
      <span class="al-sep" aria-hidden="true"></span>
      <a href="/pages/ansec-admissions.html" class="al-admissions" aria-label="Admissions information">
        <i class="ri-mail-send-line" aria-hidden="true"></i>
        <span class="al-tb-text">Admissions</span>
      </a>
      <span class="al-sep" aria-hidden="true"></span>
      <a href="/pages/ansec-donate.html" class="al-donate" aria-label="Make a donation to ANSEC">
        <i class="ri-heart-3-fill" aria-hidden="true"></i>
        <span class="al-tb-text">Donate</span>
      </a>
    </div>
  </div>
</div>

<!-- NAVBAR -->
<nav class="al-navbar" id="al-navbar" role="navigation" aria-label="Main navigation">
  <div class="al-navbar-inner">

    <a href="/index.html" class="al-wordmark" aria-label="ANSEC home">AN<em>SEC</em></a>

    <button class="al-burger" id="al-burger"
            aria-label="Open navigation menu"
            aria-expanded="false"
            aria-controls="al-menu">
      <span class="al-hb" aria-hidden="true">
        <span></span><span></span><span></span>
      </span>
    </button>

    <ul class="al-nav-list" role="menubar">

      <li class="al-ni" role="none" data-section="our-school" data-drop>
        <button class="al-nl" aria-haspopup="true" aria-expanded="false" role="menuitem">
          <i class="ri-information-line" aria-hidden="true"></i>
          <span>Our School</span>
          <i class="ri-arrow-down-s-line al-caret" aria-hidden="true"></i>
        </button>
        <ul class="al-drop" role="menu">
          <li role="none"><a href="/pages/ansec-history.html" class="al-di" role="menuitem">
            <i class="ri-time-line" aria-hidden="true"></i><span>Our History</span></a></li>
          <li role="none"><a href="/pages/ansec-mission-vision-values.html" class="al-di" role="menuitem">
            <i class="ri-eye-line" aria-hidden="true"></i><span>Mission, Vision &amp; Values</span></a></li>
          <li role="none"><a href="/pages/ansec-admin-staff.html" class="al-di" role="menuitem">
            <i class="ri-user-star-line" aria-hidden="true"></i><span>Administration &amp; Staff</span></a></li>
          <li role="none"><a href="/pages/ansec-campus-facilities.html" class="al-di" role="menuitem">
            <i class="ri-school-line" aria-hidden="true"></i><span>Campus &amp; Facilities</span></a></li>
          <li role="none"><a href="/pages/ansec-anthem-motto.html" class="al-di" role="menuitem">
            <i class="ri-music-2-line" aria-hidden="true"></i><span>School Anthem &amp; Motto</span></a></li>
        </ul>
      </li>

      <li class="al-ni" role="none" data-section="academic-life" data-drop>
        <button class="al-nl" aria-haspopup="true" aria-expanded="false" role="menuitem">
          <i class="ri-book-open-line" aria-hidden="true"></i>
          <span>Academic Life</span>
          <i class="ri-arrow-down-s-line al-caret" aria-hidden="true"></i>
        </button>
        <ul class="al-drop" role="menu">
          <li role="none"><a href="/pages/ansec-programmes.html" class="al-di" role="menuitem">
            <i class="ri-graduation-cap-line" aria-hidden="true"></i><span>Programmes Offered</span></a></li>
          <li role="none"><a href="/pages/ansec-departments.html" class="al-di" role="menuitem">
            <i class="ri-building-4-line" aria-hidden="true"></i><span>Academic Departments</span></a></li>
          <li role="none"><a href="/pages/ansec-academic-calendar.html" class="al-di" role="menuitem">
            <i class="ri-calendar-2-line" aria-hidden="true"></i><span>Academic Calendar</span></a></li>
          <li class="al-drop-rule" role="none" aria-hidden="true"></li>
          <li role="none"><a href="/pages/ansec-admissions.html" class="al-di" role="menuitem"
              style="color:var(--al-blue);font-weight:600">
            <i class="ri-mail-send-line" aria-hidden="true"></i><span>Admissions</span></a></li>
        </ul>
      </li>

      <li class="al-ni" role="none" data-section="student-life" data-drop>
        <button class="al-nl" aria-haspopup="true" aria-expanded="false" role="menuitem">
          <i class="ri-user-smile-line" aria-hidden="true"></i>
          <span>Faith &amp; Student Life</span>
          <i class="ri-arrow-down-s-line al-caret" aria-hidden="true"></i>
        </button>
        <ul class="al-drop" role="menu">
          <li role="none"><a href="/pages/ansec-chaplaincy.html" class="al-di" role="menuitem">
            <i class="ri-cross-line" aria-hidden="true"></i><span>Chaplaincy &amp; Worship</span></a></li>
          <li role="none"><a href="/pages/ansec-clubs.html" class="al-di" role="menuitem">
            <i class="ri-group-line" aria-hidden="true"></i><span>Clubs &amp; Activities</span></a></li>
          <li role="none"><a href="/pages/ansec-sports.html" class="al-di" role="menuitem">
            <i class="ri-football-line" aria-hidden="true"></i><span>Sports &amp; Athletics</span></a></li>
          <li role="none"><a href="/pages/ansec-boarding.html" class="al-di" role="menuitem">
            <i class="ri-home-heart-line" aria-hidden="true"></i><span>Boarding &amp; Pastoral Care</span></a></li>
        </ul>
      </li>

      <li class="al-ni" role="none" data-section="events">
        <a href="/pages/ansec-events.html" class="al-nl" role="menuitem">
          <i class="ri-calendar-event-line" aria-hidden="true"></i>
          <span>Events</span>
        </a>
      </li>

      <li class="al-ni" role="none" data-section="gallery">
        <a href="/pages/ansec-gallery.html" class="al-nl" role="menuitem">
          <i class="ri-camera-line" aria-hidden="true"></i>
          <span>Gallery</span>
        </a>
      </li>

      <li class="al-ni" role="none" data-section="admissions">
        <a href="/pages/ansec-admissions.html" class="al-nl al-nl-admissions" role="menuitem"
           style="color:var(--al-blue);font-weight:700;border:1.5px solid rgba(0,113,227,0.22);border-radius:8px;background:rgba(0,113,227,0.06)">
          <i class="ri-mail-send-line" aria-hidden="true"></i>
          <span>Admissions</span>
        </a>
      </li>

      <li class="al-ni" role="none" data-section="contact">
        <a href="/pages/ansec-contact.html" class="al-nl" role="menuitem">
          <i class="ri-map-pin-line" aria-hidden="true"></i>
          <span>Contact &amp; Location</span>
        </a>
      </li>

    </ul>

    <!-- Mobile panel -->
    <div class="al-menu" id="al-menu"
         role="dialog" aria-modal="true" aria-label="Navigation menu">

      <div class="al-panel-head">
        <span class="al-panel-label">Navigation</span>
        <button class="al-panel-close" id="al-close" aria-label="Close navigation menu">
          <i class="ri-close-line" aria-hidden="true"></i>
        </button>
      </div>

      <ul class="al-mob-nav" role="menubar">

        <li class="al-ni" role="none" data-section="our-school" data-drop>
          <button class="al-nl" aria-haspopup="true" aria-expanded="false" role="menuitem">
            <i class="ri-information-line" aria-hidden="true"></i>
            <span>Our School</span>
            <i class="ri-arrow-down-s-line al-caret" aria-hidden="true"></i>
          </button>
          <ul class="al-mob-drop" role="menu">
            <li><a href="/pages/ansec-history.html" class="al-mob-di" role="menuitem">
              <i class="ri-time-line"></i>Our History</a></li>
            <li><a href="/pages/ansec-mission-vision-values.html" class="al-mob-di" role="menuitem">
              <i class="ri-eye-line"></i>Mission, Vision &amp; Values</a></li>
            <li><a href="/pages/ansec-admin-staff.html" class="al-mob-di" role="menuitem">
              <i class="ri-user-star-line"></i>Administration &amp; Staff</a></li>
            <li><a href="/pages/ansec-campus-facilities.html" class="al-mob-di" role="menuitem">
              <i class="ri-school-line"></i>Campus &amp; Facilities</a></li>
            <li><a href="/pages/ansec-anthem-motto.html" class="al-mob-di" role="menuitem">
              <i class="ri-music-2-line"></i>School Anthem &amp; Motto</a></li>
          </ul>
        </li>

        <li class="al-ni" role="none" data-section="academic-life" data-drop>
          <button class="al-nl" aria-haspopup="true" aria-expanded="false" role="menuitem">
            <i class="ri-book-open-line" aria-hidden="true"></i>
            <span>Academic Life</span>
            <i class="ri-arrow-down-s-line al-caret" aria-hidden="true"></i>
          </button>
          <ul class="al-mob-drop" role="menu">
            <li><a href="/pages/ansec-programmes.html" class="al-mob-di" role="menuitem">
              <i class="ri-graduation-cap-line"></i>Programmes Offered</a></li>
            <li><a href="/pages/ansec-departments.html" class="al-mob-di" role="menuitem">
              <i class="ri-building-4-line"></i>Academic Departments</a></li>
            <li><a href="/pages/ansec-academic-calendar.html" class="al-mob-di" role="menuitem">
              <i class="ri-calendar-2-line"></i>Academic Calendar</a></li>
            <li><a href="/pages/ansec-admissions.html" class="al-mob-di" role="menuitem"
                style="color:var(--al-blue);font-weight:600">
              <i class="ri-mail-send-line"></i>Admissions</a></li>
          </ul>
        </li>

        <li class="al-ni" role="none" data-section="student-life" data-drop>
          <button class="al-nl" aria-haspopup="true" aria-expanded="false" role="menuitem">
            <i class="ri-user-smile-line" aria-hidden="true"></i>
            <span>Faith &amp; Student Life</span>
            <i class="ri-arrow-down-s-line al-caret" aria-hidden="true"></i>
          </button>
          <ul class="al-mob-drop" role="menu">
            <li><a href="/pages/ansec-chaplaincy.html" class="al-mob-di" role="menuitem">
              <i class="ri-cross-line"></i>Chaplaincy &amp; Worship</a></li>
            <li><a href="/pages/ansec-clubs.html" class="al-mob-di" role="menuitem">
              <i class="ri-group-line"></i>Clubs &amp; Activities</a></li>
            <li><a href="/pages/ansec-sports.html" class="al-mob-di" role="menuitem">
              <i class="ri-football-line"></i>Sports &amp; Athletics</a></li>
            <li><a href="/pages/ansec-boarding.html" class="al-mob-di" role="menuitem">
              <i class="ri-home-heart-line"></i>Boarding &amp; Pastoral Care</a></li>
          </ul>
        </li>

        <li class="al-ni" role="none" data-section="events">
          <a href="/pages/ansec-events.html" class="al-nl" role="menuitem">
            <i class="ri-calendar-event-line" aria-hidden="true"></i><span>Events</span>
          </a>
        </li>
        <li class="al-ni" role="none" data-section="gallery">
          <a href="/pages/ansec-gallery.html" class="al-nl" role="menuitem">
            <i class="ri-camera-line" aria-hidden="true"></i><span>Gallery</span>
          </a>
        </li>
        <li class="al-ni" role="none" data-section="contact">
          <a href="/pages/ansec-contact.html" class="al-nl" role="menuitem">
            <i class="ri-map-pin-line" aria-hidden="true"></i><span>Contact &amp; Location</span>
          </a>
        </li>
        <li class="al-ni" role="none" data-section="admissions">
          <a href="/pages/ansec-admissions.html" class="al-nl" role="menuitem"
             style="color:var(--al-blue);font-weight:700">
            <i class="ri-mail-send-line" aria-hidden="true"></i><span>Admissions</span>
          </a>
        </li>

      </ul>

      <div class="al-panel-foot">
        <a href="/pages/ansec-admissions.html" class="al-pf-admissions">
          <i class="ri-mail-send-line" aria-hidden="true"></i>Apply / Admissions
        </a>
        <a href="/pages/ansec-donate.html" class="al-pf-donate">
          <i class="ri-heart-3-fill" aria-hidden="true"></i>Donate to ANSEC
        </a>
        <a href="/pages/ansec-alumni.html" class="al-pf-alumni">
          <i class="ri-user-star-line" aria-hidden="true"></i>Alumni Portal
        </a>
      </div>

    </div><!-- /al-menu -->

  </div><!-- /al-navbar-inner -->
</nav>

<!-- Overlay behind mobile panel -->
<div class="al-overlay" id="al-overlay" aria-hidden="true"></div>`;


  const INLINE_FOOTER = `<footer id="contact" class="contact-strip" aria-label="Site footer">
  <div class="wrap">

    <div class="cs-grid">
      <div class="cs-col">
        <div class="cs-col-h"><i class="ri-map-pin-line" aria-hidden="true"></i> Location</div>
        <div class="cs-col-v">Anum, Eastern Region</div>
        <div class="cs-col-s">Ghana, West Africa</div>
        <div class="cs-col-s" style="margin-top:.4rem">
          Accessible via Accra-Kumasi Highway,<br/>exit at Anum Junction
        </div>
      </div>
      <div class="cs-col">
        <div class="cs-col-h"><i class="ri-phone-line" aria-hidden="true"></i> Contact</div>
        <div class="cs-col-v">+233 (0) XXX XXX XXXX</div>
        <div class="cs-col-s">admissions@ansec.edu.gh</div>
        <div class="cs-col-s">info@ansec.edu.gh</div>
        <div class="cs-col-v" style="margin-top:.65rem;font-size:.78rem">
          Mon &ndash; Fri &middot; 7:30 am &ndash; 4:30 pm
        </div>
      </div>
      <div class="cs-col">
        <div class="cs-col-h"><i class="ri-links-line" aria-hidden="true"></i> Connect</div>
        <div class="cs-social-icons" style="display:flex;gap:.7rem;flex-wrap:wrap;margin-top:.2rem">
          <a href="#" class="cs-link" aria-label="Facebook">
            <i class="ri-facebook-circle-line" style="font-size:1.2rem;color:rgba(0,180,255,.55)" aria-hidden="true"></i>
          </a>
          <a href="#" class="cs-link" aria-label="Twitter / X">
            <i class="ri-twitter-x-line" style="font-size:1.2rem;color:rgba(0,180,255,.55)" aria-hidden="true"></i>
          </a>
          <a href="#" class="cs-link" aria-label="YouTube">
            <i class="ri-youtube-line" style="font-size:1.2rem;color:rgba(0,180,255,.55)" aria-hidden="true"></i>
          </a>
          <a href="#" class="cs-link" aria-label="Instagram">
            <i class="ri-instagram-line" style="font-size:1.2rem;color:rgba(0,180,255,.55)" aria-hidden="true"></i>
          </a>
        </div>
        <a href="/pages/ansec-mission-vision-values.html" class="cs-link"
           style="margin-top:1rem;display:inline-flex;align-items:center;gap:.4rem">
          Mission &amp; Values <i class="ri-arrow-right-line" style="font-size:.8rem" aria-hidden="true"></i>
        </a>
        <a href="/pages/ansec-history.html" class="cs-link"
           style="display:inline-flex;align-items:center;gap:.4rem;margin-top:.65rem">
          Our History <i class="ri-arrow-right-line" style="font-size:.8rem" aria-hidden="true"></i>
        </a>
      </div>
      <div class="cs-col cs-col-crest">
        <img
          class="cs-crest"
          src="/assets/images/ansecLogo.jpg"
          alt="ANSEC School Crest"
          width="88" height="88"
          loading="lazy"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"
        />
        <div class="cs-crest-placeholder" aria-hidden="true" style="display:none">
          <i class="ri-shield-star-line"></i>
        </div>
        <div class="cs-crest-name">Anum Presbyterian Senior High School</div>
        <div class="cs-crest-sub">Est. 1897 &middot; Anum, Eastern Region &middot; Ghana</div>
        <div class="cs-crest-motto">"Service and Sacrifice"</div>
      </div>
    </div>

    <div class="cs-divider"></div>

    <div class="cs-footer-row">
      <div class="cs-copy">
        &copy; <span id="ansec-year">2025</span> Anum Presbyterian Senior High School.
        All rights reserved.
      </div>
      <div class="cs-links">
        <a href="#" class="cs-link">Privacy Policy</a>
        <a href="#" class="cs-link">Terms of Use</a>
        <a href="#" class="cs-link">Accessibility</a>
        <a href="#" class="cs-link">Sitemap</a>
      </div>
    </div>

  </div>
</footer>`;


  /* ═══════════════════════════════════════════════════════════
     INJECT CSS
     Appends the shared stylesheet <link> to <head> once only.
  ═══════════════════════════════════════════════════════════ */
  function injectCSS() {
    if (document.querySelector(`link[href="${CONFIG.cssPath}"]`)) return;
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = CONFIG.cssPath;
    document.head.appendChild(link);
  }


  /* ═══════════════════════════════════════════════════════════
     MOUNT HELPERS
     Write HTML into the named mount-point div, or fall back to
     prepend/append on <body> if the div is absent.
  ═══════════════════════════════════════════════════════════ */
  function mountHeader(html) {
    const mount = document.getElementById(CONFIG.headerMountId);
    if (mount) {
      mount.innerHTML = html;
    } else {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      document.body.insertBefore(tmp, document.body.firstChild);
    }
  }

  function mountFooter(html) {
    const mount = document.getElementById(CONFIG.footerMountId);
    if (mount) {
      mount.innerHTML = html;
    } else {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      document.body.appendChild(tmp);
    }
  }


  /* ═══════════════════════════════════════════════════════════
     BODY OFFSET
     Adds the  al-offset  class which ansec-layout.css targets
     with:  body.al-offset { padding-top: var(--al-total-h) }
     This pushes page content below the fixed dual-bar header.
  ═══════════════════════════════════════════════════════════ */
  function applyBodyOffset() {
    document.body.classList.add('al-offset');
  }


  /* ═══════════════════════════════════════════════════════════
     ACTIVE NAV STATE
     Marks every  .al-ni[data-section="X"]  element that matches
     the current page URL with the  al-active  class — both the
     desktop nav list item and its mirror in the mobile panel
     get highlighted simultaneously.
  ═══════════════════════════════════════════════════════════ */
  function setActiveNav() {
    const path = window.location.pathname;

    /* 1. Exact match */
    let section = ACTIVE_MAP[path];

    /* 2. Trailing-slash variant */
    if (!section) section = ACTIVE_MAP[path.replace(/\/$/, '')];

    /* 3. Partial slug match (handles hashes, query strings, etc.) */
    if (!section) {
      for (const [key, val] of Object.entries(ACTIVE_MAP)) {
        const slug = key.replace('/pages/', '').replace('.html', '');
        if (path.includes(slug)) { section = val; break; }
      }
    }

    /* 4. Homepage — nothing to highlight */
    if (!section) return;

    document.querySelectorAll(`.al-ni[data-section="${section}"]`)
      .forEach(li => li.classList.add('al-active'));
  }


  /* ═══════════════════════════════════════════════════════════
     AUTO YEAR in footer copyright
  ═══════════════════════════════════════════════════════════ */
  function setYear() {
    const el = document.getElementById('ansec-year');
    if (el) el.textContent = new Date().getFullYear();
  }


  /* ═══════════════════════════════════════════════════════════
     NAVIGATION BEHAVIOUR
     Uses event DELEGATION on document/navbar for all interactive
     elements — this is the only reliable approach when HTML is
     injected dynamically (innerHTML) on real mobile browsers.
     Direct addEventListener on injected elements can silently
     fail on iOS Safari and some Android WebViews.
  ═══════════════════════════════════════════════════════════ */
  function initNav() {
    const isMobile = () => window.innerWidth <= CONFIG.mobileBreak;

    /* ── Live element refs (re-queried on each use via helpers) ── */
    const navbar   = () => document.getElementById('al-navbar');
    const burger   = () => document.getElementById('al-burger');
    const menu     = () => document.getElementById('al-menu');
    const closeBtn = () => document.getElementById('al-close');
    const overlay  = () => document.getElementById('al-overlay');

    /* Safety guard */
    if (!navbar()) return;

    let menuOpen = false;
    let scrolled = false;

    /* ── Touch detection ──────────────────────────────────────── */
    if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0) {
      document.documentElement.classList.add('al-no-touch');
    }

    /* ════════════════════════════════════════════════════════════
       MOBILE PANEL  open / close
    ════════════════════════════════════════════════════════════ */
    function openMenu() {
      menuOpen = true;
      const m = menu(), o = overlay(), b = burger(), c = closeBtn();
      m && m.classList.add('al-open');
      o && o.classList.add('al-vis');
      b && b.setAttribute('aria-expanded', 'true');
      b && b.setAttribute('aria-label', 'Close navigation menu');
      document.body.classList.add('al-locked');
      setTimeout(() => { c && c.focus(); }, 80);
    }

    function closeMenu() {
      if (!menuOpen) return;
      menuOpen = false;
      const m = menu(), o = overlay(), b = burger();
      m && m.classList.remove('al-open');
      o && o.classList.remove('al-vis');
      b && b.setAttribute('aria-expanded', 'false');
      b && b.setAttribute('aria-label', 'Open navigation menu');
      document.body.classList.remove('al-locked');
      b && b.focus();
    }

    /* ════════════════════════════════════════════════════════════
       DROPDOWNS
    ════════════════════════════════════════════════════════════ */
    function openDrop(li) {
      li.classList.add('al-open');
      const btn = li.querySelector('button.al-nl');
      btn && btn.setAttribute('aria-expanded', 'true');
    }

    function closeDrop(li) {
      li.classList.remove('al-open');
      const btn = li.querySelector('button.al-nl');
      btn && btn.setAttribute('aria-expanded', 'false');
    }

    function closeAllDrops(except = null) {
      document.querySelectorAll('.al-ni.al-open[data-drop]').forEach(li => {
        if (li !== except) closeDrop(li);
      });
    }

    /* ════════════════════════════════════════════════════════════
       DELEGATED CLICK HANDLER  (single listener on document)
       Handles: burger, close button, overlay, dropdown toggles,
       outside-click to close.
    ════════════════════════════════════════════════════════════ */
    document.addEventListener('click', function handleClick(e) {
      const target = e.target;

      /* ── Burger toggle ──────────────────────────────────── */
      const burgerEl = burger();
      if (burgerEl && (target === burgerEl || burgerEl.contains(target))) {
        e.stopPropagation();
        menuOpen ? closeMenu() : openMenu();
        return;
      }

      /* ── Close button ───────────────────────────────────── */
      const closeBtnEl = closeBtn();
      if (closeBtnEl && (target === closeBtnEl || closeBtnEl.contains(target))) {
        closeMenu();
        return;
      }

      /* ── Overlay ────────────────────────────────────────── */
      const overlayEl = overlay();
      if (overlayEl && target === overlayEl) {
        closeMenu();
        return;
      }

      /* ── Dropdown toggle buttons ────────────────────────── */
      const dropBtn = target.closest('.al-ni[data-drop] > button.al-nl');
      if (dropBtn) {
        e.preventDefault();
        e.stopPropagation();
        const li = dropBtn.closest('.al-ni');
        const isOpen = li.classList.contains('al-open');
        closeAllDrops(isOpen ? null : li);
        isOpen ? closeDrop(li) : openDrop(li);
        return;
      }

      /* ── Outside click — close everything ───────────────── */
      const nav = navbar();
      const ov  = overlay();
      if (nav && !nav.contains(target) && !(ov && ov.contains(target))) {
        closeAllDrops();
        if (isMobile()) closeMenu();
      }
    });

    /* ════════════════════════════════════════════════════════════
       NAVBAR SCROLL SHADOW
    ════════════════════════════════════════════════════════════ */
    function onScroll() {
      const nav = navbar();
      if (!nav) return;
      const y = window.scrollY;
      if (y > 40 && !scrolled)  { nav.classList.add('al-scrolled');    scrolled = true;  }
      if (y <= 40 && scrolled)  { nav.classList.remove('al-scrolled'); scrolled = false; }
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ════════════════════════════════════════════════════════════
       RESIZE
    ════════════════════════════════════════════════════════════ */
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!isMobile()) { closeMenu(); closeAllDrops(); }
      }, 150);
    });

    /* ════════════════════════════════════════════════════════════
       KEYBOARD NAVIGATION  (delegated)
    ════════════════════════════════════════════════════════════ */
    document.addEventListener('keydown', e => {
      /* Escape */
      if (e.key === 'Escape') {
        if (menuOpen) { closeMenu(); return; }
        closeAllDrops();
        return;
      }

      /* Arrow keys inside dropdown panels */
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const drop = e.target.closest('.al-drop');
        if (drop) {
          e.preventDefault();
          const items = [...drop.querySelectorAll('.al-di')];
          const i = items.indexOf(e.target);
          if (i === -1) return;
          const next = e.key === 'ArrowDown'
            ? items[(i + 1) % items.length]
            : items[(i - 1 + items.length) % items.length];
          next && next.focus();
          return;
        }
      }

      /* Enter / Space / ArrowDown on dropdown trigger */
      if (['ArrowDown', 'Enter', ' '].includes(e.key)) {
        const btn = e.target.closest('.al-ni[data-drop] > button.al-nl');
        if (btn) {
          const li = btn.closest('.al-ni');
          if (!li.classList.contains('al-open')) {
            e.preventDefault();
            openDrop(li);
            setTimeout(() => {
              const first = li.querySelector('.al-di') || li.querySelector('.al-mob-di');
              first && first.focus();
            }, 50);
          }
          return;
        }
      }
    });

    /* Focus trap inside mobile panel (delegated) */
    document.addEventListener('keydown', e => {
      if (e.key !== 'Tab' || !menuOpen) return;
      const m = menu();
      if (!m) return;
      const focusable = [...m.querySelectorAll('a[href], button:not([disabled])')]
        .filter(el => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });
  }


  /* ═══════════════════════════════════════════════════════════
     MAIN BOOTSTRAP
  ═══════════════════════════════════════════════════════════ */
  function run(headerHTML, footerHTML) {
    mountHeader(headerHTML);
    mountFooter(footerHTML);
    applyBodyOffset();
    setActiveNav();
    setYear();
    initNav();
  }

  async function init() {
    injectCSS();

    if (CONFIG.useInlineComponents) {
      run(INLINE_HEADER, INLINE_FOOTER);
      return;
    }

    /* Fetch component files; fall back to inline on any failure
       (covers file:// protocol, 404s, network errors) */
    try {
      const [hRes, fRes] = await Promise.all([
        fetch(CONFIG.headerPath),
        fetch(CONFIG.footerPath),
      ]);
      if (!hRes.ok) throw new Error(`Header ${hRes.status}`);
      if (!fRes.ok) throw new Error(`Footer ${fRes.status}`);

      const [headerHTML, footerHTML] = await Promise.all([
        hRes.text(),
        fRes.text(),
      ]);
      run(headerHTML, footerHTML);

    } catch (err) {
      console.warn('[ANSEC Layout] Fetch failed — using inline fallback.', err.message);
      run(INLINE_HEADER, INLINE_FOOTER);
    }
  }

  /* Run after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
