/* ============================================================
   صيدليتي — Site Content & Messages Store
   Shared schema + localStorage storage for admin dashboard.
   Loaded on ALL pages BEFORE script.js (defer order).
   ============================================================ */
(() => {
  "use strict";

  const KEYS = {
    CONTENT: "saydalati-content",
    MESSAGES: "saydalati-messages",
    PASS: "saydalati-admin-pass",
    AUTH: "saydalati-admin-auth",
  };

  const PAGE_NAMES = {
    "index.html": "الرئيسية",
    "contact.html": "تواصل معنا",
    "privacy-policy.html": "سياسة الخصوصية",
    "terms.html": "الشروط والأحكام",
  };

  const range = (a, b) =>
    b === undefined
      ? Array.from({ length: a }, (_, i) => i + 1)
      : Array.from({ length: b - a + 1 }, (_, i) => a + i);

  const schema = [];

  const add = (file, group, label, selector) =>
    schema.push({ file, group, label, selector });

  /* ---------------- index.html ---------------- */
  add("index.html", "الهيرو", "الشارة العلوية", ".hero .badge");
  add("index.html", "الهيرو", "العنوان الرئيسي", ".hero-title");
  add("index.html", "الهيرو", "الوصف", ".hero-subtitle");
  add("index.html", "الهيرو", "زر تحميل للأندرويد", ".hero-actions .btn-primary");
  add("index.html", "الهيرو", "زر تحميل للآيفون", ".hero-actions .btn-dark");
  add("index.html", "الهيرو", "زر مشاهدة العرض", "#watchDemo");
  add("index.html", "الهيرو", "سطر الثقة (المستخدمون)", ".proof-text p");

  range(4).forEach((i) =>
    add("index.html", "الإحصائيات", `عنوان الإحصائية ${i}`, `.stats-grid .stat:nth-child(${i}) .stat-label`)
  );

  add("index.html", "المميزات — ترويسة", "الشارة", ".features .section-head .badge");
  add("index.html", "المميزات — ترويسة", "العنوان", ".features .section-title");
  add("index.html", "المميزات — ترويسة", "الوصف", ".features .section-sub");

  range(8).forEach((i) => {
    add("index.html", `المميزات — البطاقة ${i}`, "العنوان", `.features-grid .feature-card:nth-child(${i}) h3`);
    add("index.html", `المميزات — البطاقة ${i}`, "الوصف", `.features-grid .feature-card:nth-child(${i}) p`);
  });

  add("index.html", "كيف يعمل — ترويسة", "الشارة", ".how .section-head .badge");
  add("index.html", "كيف يعمل — ترويسة", "العنوان", ".how .section-title");
  add("index.html", "كيف يعمل — ترويسة", "الوصف", ".how .section-sub");

  range(5).forEach((i) => {
    add("index.html", `كيف يعمل — الخطوة ${i}`, "رقم الخطوة", `.timeline-item:nth-child(${i}) .timeline-step`);
    add("index.html", `كيف يعمل — الخطوة ${i}`, "العنوان", `.timeline-item:nth-child(${i}) .timeline-card h3`);
    add("index.html", `كيف يعمل — الخطوة ${i}`, "الوصف", `.timeline-item:nth-child(${i}) .timeline-card p`);
  });

  add("index.html", "لقطات التطبيق — ترويسة", "الشارة", ".screens .section-head .badge");
  add("index.html", "لقطات التطبيق — ترويسة", "العنوان", ".screens .section-title");
  add("index.html", "لقطات التطبيق — ترويسة", "الوصف", ".screens .section-sub");

  range(4).forEach((i) => {
    add("index.html", `لقطات التطبيق — الشاشة ${i}`, "العنوان", `.screen-item:nth-child(${i}) .screen-caption`);
    add("index.html", `لقطات التطبيق — الشاشة ${i}`, "الوصف", `.screen-item:nth-child(${i}) > p`);
  });

  add("index.html", "لماذا صيدليتي — ترويسة", "الشارة", ".benefits .section-head .badge");
  add("index.html", "لماذا صيدليتي — ترويسة", "العنوان", ".benefits .section-title");
  add("index.html", "لماذا صيدليتي — ترويسة", "الوصف", ".benefits .section-sub");

  range(4).forEach((i) => {
    add("index.html", `لماذا صيدليتي — البطاقة ${i}`, "العنوان", `.benefits-grid .benefit-card:nth-child(${i}) h3`);
    add("index.html", `لماذا صيدليتي — البطاقة ${i}`, "الوصف", `.benefits-grid .benefit-card:nth-child(${i}) p`);
  });

  add("index.html", "الأسئلة الشائعة — ترويسة", "الشارة", ".faq .section-head .badge");
  add("index.html", "الأسئلة الشائعة — ترويسة", "العنوان", ".faq .section-title");
  add("index.html", "الأسئلة الشائعة — ترويسة", "الوصف", ".faq .section-sub");

  range(6).forEach((i) => {
    add("index.html", `الأسئلة الشائعة — السؤال ${i}`, "السؤال", `.faq-item:nth-child(${i}) > .faq-question > span:first-child`);
    add("index.html", `الأسئلة الشائعة — السؤال ${i}`, "الجواب", `.faq-item:nth-child(${i}) .faq-answer`);
  });

  add("index.html", "تحميل التطبيق", "الشارة", ".download .badge");
  add("index.html", "تحميل التطبيق", "العنوان", ".download-title");
  add("index.html", "تحميل التطبيق", "الوصف", ".download-sub");
  add("index.html", "تحميل التطبيق", "ملاحظة الرمز", ".download-note");

  range(3).forEach((i) => {
    add("index.html", `التواصل — البطاقة ${i}`, "العنوان", `.contact-grid .contact-card:nth-child(${i}) h3`);
    add("index.html", `التواصل — البطاقة ${i}`, "القيمة", `.contact-grid .contact-card:nth-child(${i}) p`);
  });

  add("index.html", "التذييل", "وصف الموقع", ".footer-desc");

  /* ---------------- contact.html ---------------- */
  add("contact.html", "الترويسة", "العنوان", ".page-hero-title");
  add("contact.html", "الترويسة", "الوصف", ".page-hero-sub");

  range(3).forEach((i) => {
    add("contact.html", `بطاقات التواصل — ${i}`, "العنوان", `.info-card .info-row:nth-child(${i}) div strong`);
    add("contact.html", `بطاقات التواصل — ${i}`, "القيمة", `.info-card .info-row:nth-child(${i}) div span`);
  });

  add("contact.html", "الخريطة", "اسم الموقع", ".map-pin strong");
  add("contact.html", "الخريطة", "التفصيل", ".map-pin small");
  add("contact.html", "النموذج", "عنوان النموذج", ".form-card h3");

  range(4).forEach((i) =>
    add("contact.html", "النموذج", `عنوان الحقل ${i}`, `.form-row:nth-of-type(${i}) .form-label`)
  );

  range(2, 6).forEach((i) =>
    add("contact.html", "النموذج", `خيار الموضوع ${i - 1}`, `.form-card select option:nth-child(${i})`)
  );

  add("contact.html", "النموذج", "رسالة النجاح", ".form-success");

  /* ---------------- privacy-policy.html ---------------- */
  add("privacy-policy.html", "الترويسة", "العنوان", ".page-hero-title");
  add("privacy-policy.html", "الترويسة", "الوصف", ".page-hero-sub");
  add("privacy-policy.html", "الترويسة", "ملاحظة التحديث", ".update-note");
  schema.push({ file: "privacy-policy.html", group: "فقرات الصفحة", auto: true, root: ".prose" });

  /* ---------------- terms.html ---------------- */
  add("terms.html", "الترويسة", "العنوان", ".page-hero-title");
  add("terms.html", "الترويسة", "الوصف", ".page-hero-sub");
  add("terms.html", "الترويسة", "ملاحظة التحديث", ".update-note");
  schema.push({ file: "terms.html", group: "فقرات الصفحة", auto: true, root: ".prose" });

  /* ---------------- storage helpers ---------------- */
  const safeGet = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (err) {
      return fallback;
    }
  };

  const safeSet = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  };

  const SITE_STORE = {
    getContent: () => safeGet(KEYS.CONTENT, {}),
    setContent: (map) => safeSet(KEYS.CONTENT, map),
    getMessages: () => safeGet(KEYS.MESSAGES, []),
    saveMessage: (msg) => {
      const list = SITE_STORE.getMessages();
      list.unshift({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7), read: false, ...msg });
      safeSet(KEYS.MESSAGES, list.slice(0, 200));
    },
    updateMessage: (id, patch) => {
      const list = SITE_STORE.getMessages().map((m) => (m.id === id ? { ...m, ...patch } : m));
      safeSet(KEYS.MESSAGES, list);
    },
    deleteMessage: (id) => {
      safeSet(KEYS.MESSAGES, SITE_STORE.getMessages().filter((m) => m.id !== id));
    },
    clearMessages: () => safeSet(KEYS.MESSAGES, []),
    getPass: () => {
      try {
        return localStorage.getItem(KEYS.PASS) || "admin123";
      } catch (err) {
        return "admin123";
      }
    },
    setPass: (p) => {
      try {
        localStorage.setItem(KEYS.PASS, p);
        return true;
      } catch (err) {
        return false;
      }
    },
    isAuthed: () => {
      try {
        return sessionStorage.getItem(KEYS.AUTH) === "1";
      } catch (err) {
        return false;
      }
    },
    setAuthed: (v) => {
      try {
        sessionStorage.setItem(KEYS.AUTH, v ? "1" : "0");
      } catch (err) {}
    },
    applyOverrides: () => {
      const map = SITE_STORE.getContent();
      for (const [selector, html] of Object.entries(map)) {
        if (html == null) continue;
        try {
          document.querySelectorAll(selector).forEach((el) => {
            el.innerHTML = html;
          });
        } catch (err) {}
      }
    },
  };

  window.SITE_KEYS = KEYS;
  window.SITE_CONTENT_SCHEMA = schema;
  window.SITE_PAGE_NAMES = PAGE_NAMES;
  window.SITE_STORE = SITE_STORE;

  SITE_STORE.applyOverrides();
})();