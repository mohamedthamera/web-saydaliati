/* ============================================================
   صيدليتي — Saydalati Landing Website
   Main script — Vanilla JavaScript
   ============================================================ */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     1. Scroll progress bar + header state + back-to-top
  ---------------------------------------------------------- */
  const progressBar = $("#scrollProgress");
  const header = $("#siteHeader");
  const backToTop = $("#backToTop");

  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const ratio = max > 0 ? doc.scrollTop / max : 0;

    if (progressBar) progressBar.style.transform = `scaleX(${ratio})`;
    if (header) header.classList.toggle("scrolled", doc.scrollTop > 24);
    if (backToTop) backToTop.classList.toggle("visible", doc.scrollTop > 600);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  /* ----------------------------------------------------------
     2. Mobile menu
  ---------------------------------------------------------- */
  const navToggle = $("#navToggle");
  const mobileMenu = $("#mobileMenu");

  const setMenu = (open) => {
    if (!mobileMenu || !navToggle) return;
    mobileMenu.classList.toggle("open", open);
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
    mobileMenu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      $$(".mobile-menu-links .nav-link", mobileMenu).forEach((link, i) => {
        link.style.setProperty("--i", i);
      });
    }
  };

  if (navToggle) navToggle.addEventListener("click", () => setMenu(!mobileMenu.classList.contains("open")));

  /* ----------------------------------------------------------
     3. Smooth scrolling for in-page anchors (works on all pages)
  ---------------------------------------------------------- */
  $$('a[href*="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href") || "";
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;

      const id = href.slice(hashIndex + 1);
      const target = document.getElementById(id);

      if (target) {
        e.preventDefault();
        setMenu(false);
        const top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: prefersReduced ? "auto" : "smooth" });
        history.replaceState(null, "", `#${id}`);
      }
    });
  });

  /* ----------------------------------------------------------
     4. Reveal on scroll
  ---------------------------------------------------------- */
  const revealEls = $$(".reveal");

  if (revealEls.length) {
    revealEls.forEach((el) => {
      const delay = parseInt(el.dataset.delay || "0", 10);
      el.style.setProperty("--reveal-delay", `${delay}ms`);
    });

    if (prefersReduced || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("visible"));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach((el) => revealObserver.observe(el));
    }
  }

  /* ----------------------------------------------------------
     5. Animated statistics counters (Arabic-Indic numerals)
  ---------------------------------------------------------- */
  const formatArabic = new Intl.NumberFormat("ar-IQ");

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count || "0", 10);
    const suffix = el.dataset.suffix || "";
    const duration = prefersReduced ? 0 : 1600;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = formatArabic.format(value) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const statEls = $$(".stat-value");
  if (statEls.length) {
    if ("IntersectionObserver" in window) {
      const statObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              statObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      statEls.forEach((el) => statObserver.observe(el));
    } else {
      statEls.forEach(animateCounter);
    }
  }

  /* ----------------------------------------------------------
     6. FAQ accordion
  ---------------------------------------------------------- */
  const faqItems = $$(".faq-item");

  faqItems.forEach((item) => {
    const question = $(".faq-question", item);
    const answer = $(".faq-answer", item);

    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close others
      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove("open");
          $(".faq-question", other)?.setAttribute("aria-expanded", "false");
          const a = $(".faq-answer", other);
          if (a) a.style.maxHeight = null;
        }
      });

      item.classList.toggle("open", !isOpen);
      question.setAttribute("aria-expanded", String(!isOpen));
      answer.style.maxHeight = !isOpen ? `${answer.scrollHeight}px` : null;
    });

    // Keep accordion height accurate on resize
    window.addEventListener("resize", () => {
      if (item.classList.contains("open")) {
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  /* ----------------------------------------------------------
     7. Hero phone 3D tilt (desktop only)
  ---------------------------------------------------------- */
  const heroPhone = $("#heroPhone");
  const heroVisual = $(".hero-visual");

  if (heroPhone && heroVisual && !prefersReduced && window.matchMedia("(hover: hover)").matches) {
    const handleTilt = (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroPhone.style.transform = `perspective(1000px) rotateY(${x * 9}deg) rotateX(${-y * 9}deg)`;
    };

    const resetTilt = () => {
      heroPhone.style.transform = "";
    };

    heroVisual.addEventListener("mousemove", handleTilt);
    heroVisual.addEventListener("mouseleave", resetTilt);
  }

  /* ----------------------------------------------------------
     8. Demo modal
  ---------------------------------------------------------- */
  const watchDemo = $("#watchDemo");
  const demoModal = $("#demoModal");

  if (watchDemo && demoModal) {
    const openModal = () => {
      demoModal.hidden = false;
      document.body.style.overflow = "hidden";
      $(".modal-close", demoModal)?.focus();
    };

    const closeModal = () => {
      demoModal.hidden = true;
      document.body.style.overflow = "";
      watchDemo.focus();
    };

    watchDemo.addEventListener("click", openModal);

    $$("[data-close]", demoModal).forEach((el) => el.addEventListener("click", closeModal));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !demoModal.hidden) closeModal();
    });
  }

  /* ----------------------------------------------------------
     9. Contact form validation (contact.html)
  ---------------------------------------------------------- */
  const contactForm = $("#contactForm");

  if (contactForm) {
    const fields = {
      name: { input: $("#name"), validate: (v) => v.trim().length >= 3 },
      email: { input: $("#email"), validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
      subject: { input: $("#subject"), validate: (v) => v !== "" },
      message: { input: $("#message"), validate: (v) => v.trim().length >= 10 },
    };

    const validateField = (key) => {
      const { input, validate } = fields[key];
      if (!input) return true;
      const valid = validate(input.value);
      input.classList.toggle("error", !valid);
      return valid;
    };

    Object.keys(fields).forEach((key) => {
      const input = fields[key].input;
      if (input) {
        input.addEventListener("blur", () => validateField(key));
        input.addEventListener("input", () => {
          if (input.classList.contains("error")) validateField(key);
        });
      }
    });

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const results = Object.keys(fields).map(validateField);
      if (results.every(Boolean)) {
        const success = $(".form-success");
        if (success) {
          success.classList.add("show");
          success.setAttribute("role", "status");
        }
        contactForm.reset();
        setTimeout(() => success?.classList.remove("show"), 6000);
      } else {
        const firstError = $(".form-control.error");
        firstError?.focus();
      }
    });
  }

  /* ----------------------------------------------------------
     10. Dark / Light theme toggle
  ---------------------------------------------------------- */
  const themeToggle = $("#themeToggle");

  if (themeToggle) {
    const root = document.documentElement;
    const themeColorMeta = $('meta[name="theme-color"]');

    const applyTheme = (theme) => {
      root.setAttribute("data-theme", theme);
      try {
        localStorage.setItem("saydalati-theme", theme);
      } catch (e) {}
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "التبديل إلى الوضع النهاري" : "التبديل إلى الوضع الليلي"
      );
      themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", theme === "dark" ? "#0E1122" : "#1976D2");
      }
    };

    // Sync initial state with the value set by the inline head script
    applyTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");

    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.classList.add("theme-transition");
      applyTheme(next);
      setTimeout(() => root.classList.remove("theme-transition"), 400);
    });

    // Follow system preference only when the user hasn't chosen manually
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
    systemDark.addEventListener("change", (e) => {
      let stored = null;
      try { stored = localStorage.getItem("saydalati-theme"); } catch (err) {}
      if (!stored) root.setAttribute("data-theme", e.matches ? "dark" : "light");
    });
  }

  /* ----------------------------------------------------------
     11. Footer year
  ---------------------------------------------------------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     12. Scroll spy — active nav link highlighting
  ---------------------------------------------------------- */
  if ("IntersectionObserver" in window && document.body.classList.contains("on-home")) {
    const sections = $$("main section[id]");
    const navLinks = $$(".nav-link[href*='#']");

    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              link.classList.toggle(
                "active",
                link.getAttribute("href")?.split("#")[1] === entry.target.id
              );
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach((section) => spyObserver.observe(section));
  }
})();
