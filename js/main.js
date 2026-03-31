/* ================================================
   Thai-Lian Group — Main JavaScript
   Features: Language Switcher, Sticky Nav, Mobile
   Menu, Scroll Animations, Back to Top, Form
   ================================================ */

(function () {
  'use strict';

  /* ---- State ---- */
  let currentLang = localStorage.getItem('tl_lang') || 'th';

  /* ---- DOM Helpers ---- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ================================================
     LANGUAGE SWITCHER
  ================================================ */
  function applyTranslations(lang) {
    const t = TRANSLATIONS[lang];
    if (!t) return;
    currentLang = lang;
    localStorage.setItem('tl_lang', lang);

    // Update html lang attribute
    document.documentElement.lang = lang === 'jp' ? 'ja' : lang === 'zh' ? 'zh-Hans' : lang;

    // Update all data-i18n elements
    $$('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const value = getNestedKey(t, key);
      if (value !== undefined) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = value;
        } else {
          el.innerHTML = value;
        }
      }
    });

    // Update page title
    const titles = {
      th: 'ไทยเหรียญฟอคลิฟท์ | Thai-Lian Group — ผู้นำเข้าและจำหน่ายรถโฟล์คลิฟท์ตั้งแต่ปี 1989',
      en: 'Thai-Lian Group | Thailand\'s Forklift Leader Since 1989',
      jp: 'タイリアングループ | タイのフォークリフト総合専門メーカー | 1989年創業',
      zh: '泰联集团 | 泰国叉车综合服务领导品牌 | 创立于1989年',
    };
    document.title = titles[lang] || titles.en;

    // Update meta description
    const descs = {
      th: 'บริษัท ไทยเหรียญฟอคลิฟท์ จำกัด ผู้นำเข้าและจัดจำหน่ายรถโฟล์คลิฟท์ อุปกรณ์คลังสินค้า ให้เช่า และบริการหลังการขาย ด้วยประสบการณ์กว่า 35 ปี มีสาขากว่า 13 สาขาทั่วประเทศ',
      en: 'Thailand\'s trusted forklift importer & distributor since 1989. Engine, electric, warehouse equipment, parts, rental & after-sales. 35+ years | 450+ specialists | 13+ branches.',
      jp: 'タイリアン・フォークリフト株式会社 — 1989年創業のタイ最大級フォークリフト輸入・販売・レンタル・アフターサービス専門会社。450名以上の専門スタッフ・13拠点以上。',
      zh: '泰联叉车有限公司 — 1989年创立，泰国领先叉车进口商与综合服务提供商。提供内燃叉车、电动叉车、仓储设备、租赁及售后服务。',
    };
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = descs[lang] || descs.en;

    // Update lang switcher UI
    const flags = { th: '🇹🇭', en: '🇺🇸', jp: '🇯🇵', zh: '🇨🇳' };
    const labels = { th: 'TH', en: 'EN', jp: 'JP', zh: '中文' };
    const currentLangBtn = $('#currentLang');
    if (currentLangBtn) {
      currentLangBtn.querySelector('.lang-flag').textContent = flags[lang];
      currentLangBtn.querySelector('.lang-text').textContent = labels[lang];
    }

    // Update active state in dropdown
    $$('.lang-dropdown li').forEach(li => {
      li.classList.toggle('active', li.dataset.lang === lang);
    });

    // Update footer lang buttons
    $$('.lang-btn-sm').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  function getNestedKey(obj, keyPath) {
    const parts = keyPath.split('.');
    let result = obj;
    for (const p of parts) {
      if (result === undefined || result === null) return undefined;
      result = result[p];
    }
    return result;
  }

  function initLangSwitcher() {
    const switcher = $('#langSwitcher');
    const dropdown = $('.lang-dropdown', switcher);

    if (!switcher) return;

    // Toggle open/close
    $('#currentLang')?.addEventListener('click', (e) => {
      e.stopPropagation();
      switcher.classList.toggle('open');
    });

    // Select language
    $$('.lang-dropdown li').forEach(li => {
      li.addEventListener('click', () => {
        applyTranslations(li.dataset.lang);
        switcher.classList.remove('open');
      });
    });

    // Footer lang buttons
    $$('.lang-btn-sm').forEach(btn => {
      btn.addEventListener('click', () => applyTranslations(btn.dataset.lang));
    });

    // Close on outside click
    document.addEventListener('click', () => switcher.classList.remove('open'));
  }

  /* ================================================
     NAVIGATION
  ================================================ */
  function initNavigation() {
    const navbar = $('#navbar');
    const mobileBtn = $('#mobileMenuBtn');
    const navLinks = $('#navLinks');

    // Sticky scroll effect
    window.addEventListener('scroll', () => {
      navbar?.classList.toggle('scrolled', window.scrollY > 10);
      updateBackToTop();
    }, { passive: true });

    // Mobile menu toggle
    mobileBtn?.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      mobileBtn.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Dropdown toggles on mobile
    $$('.has-dropdown > a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
          e.preventDefault();
          link.parentElement.classList.toggle('open');
        }
      });
    });

    // Close mobile menu on link click
    $$('.nav-links a:not(.has-dropdown > a)').forEach(link => {
      link.addEventListener('click', () => {
        navLinks?.classList.remove('mobile-open');
        mobileBtn?.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Active nav on scroll
    const sections = $$('section[id]');
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY + 100;
      sections.forEach(s => {
        const top = s.offsetTop;
        const height = s.offsetHeight;
        const link = $(`a[href="#${s.id}"]`, navbar);
        if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      });
    }, { passive: true });
  }

  /* ================================================
     SCROLL ANIMATIONS
  ================================================ */
  function initScrollAnimations() {
    const targets = $$('.product-card, .why-card, .news-card, .stat-item, .about-content, .contact-wrapper');
    targets.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => observer.observe(el));
  }

  /* ================================================
     COUNTER ANIMATION (Stats Bar)
  ================================================ */
  function animateCounter(el, end, duration = 1800) {
    const start = 0;
    const startTime = performance.now();
    const endNum = parseInt(end);

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * endNum);
      el.textContent = current + (end.includes('+') ? '+' : '');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function initCounters() {
    const statsBar = $('.stats-bar');
    if (!statsBar) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        $$('.stat-number').forEach(el => {
          const raw = el.textContent.trim();
          animateCounter(el, raw);
        });
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    observer.observe(statsBar);
  }

  /* ================================================
     BACK TO TOP
  ================================================ */
  function updateBackToTop() {
    const btn = $('#backToTop');
    if (btn) btn.classList.toggle('visible', window.scrollY > 400);
  }

  function initBackToTop() {
    $('#backToTop')?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ================================================
     CONTACT FORM (basic validation + feedback)
  ================================================ */
  function initContactForm() {
    const form = $('#contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const original = btn.textContent;

      // Simple validation
      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      if (!name || !email) {
        showFormMessage(form, 'error', currentLang === 'th' ? 'กรุณากรอกชื่อและอีเมล' : 'Please fill in name and email.');
        return;
      }

      // Simulate submission
      btn.textContent = currentLang === 'th' ? 'กำลังส่ง...' : currentLang === 'jp' ? '送信中...' : currentLang === 'zh' ? '发送中...' : 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
        const successMsg = {
          th: '✅ ส่งข้อความเรียบร้อย! เราจะติดต่อกลับโดยเร็ว',
          en: '✅ Message sent! We\'ll get back to you shortly.',
          jp: '✅ 送信完了！まもなくご連絡いたします。',
          zh: '✅ 发送成功！我们将尽快与您联系。',
        };
        showFormMessage(form, 'success', successMsg[currentLang]);
      }, 1200);
    });
  }

  function showFormMessage(form, type, text) {
    let msg = form.querySelector('.form-message');
    if (!msg) {
      msg = document.createElement('div');
      msg.className = 'form-message';
      msg.style.cssText = `margin-top:14px;padding:12px 18px;border-radius:8px;font-size:0.9rem;font-weight:500;`;
      form.appendChild(msg);
    }
    msg.textContent = text;
    msg.style.background = type === 'success' ? '#d4edda' : '#f8d7da';
    msg.style.color = type === 'success' ? '#155724' : '#721c24';
    setTimeout(() => msg.remove(), 5000);
  }

  /* ================================================
     SMOOTH SCROLL for anchor links
  ================================================ */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 74;
          const top = target.getBoundingClientRect().top + window.scrollY - offset - 10;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ================================================
     INIT
  ================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    applyTranslations(currentLang);
    initLangSwitcher();
    initNavigation();
    initScrollAnimations();
    initCounters();
    initBackToTop();
    initContactForm();
    initSmoothScroll();
  });

})();
