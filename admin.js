/* ============================================================
   صيدليتي — Admin Dashboard Logic (admin.html)
   ============================================================ */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const loginScreen = $("#loginScreen");
  const dashboard = $("#dashboard");
  const toastEl = $("#toast");

  const isFileProtocol = () => window.location && window.location.protocol === "file:";

  if (isFileProtocol()) {
    const banner = document.createElement("div");
    banner.setAttribute("role", "alert");
    banner.style.cssText =
      "position: sticky; top: 0; z-index: 60; background: var(--warning); color: #1A1A2E; padding: .7rem 1.4rem; font: 600 .9rem var(--font); text-align: center;";
    banner.textContent =
      "أنت تفتح اللوحة مباشرة من الملفات (file://) — التعديلات والرسائل قد لا تظهر على صفحات الموقع. شغّل خادم محلي: python3 -m http.server ثم افتح http://localhost:8000/admin.html";
    document.body.prepend(banner);
  }

  const PAGE_FILES = ["index.html", "contact.html", "privacy-policy.html", "terms.html"];

  /* ----------------------------------------------------------
     Auth
  ---------------------------------------------------------- */
  const showDashboard = () => {
    loginScreen.hidden = true;
    dashboard.hidden = false;
  };

  if (window.SITE_STORE.isAuthed()) {
    showDashboard();
  } else {
    const tryLogin = () => {
      const input = $("#loginPass");
      if (input.value === window.SITE_STORE.getPass()) {
        window.SITE_STORE.setAuthed(true);
        $("#loginError").textContent = "";
        showDashboard();
        input.value = "";
      } else {
        $("#loginError").textContent = "كلمة المرور غير صحيحة، حاول مرة أخرى.";
        input.focus();
      }
    };
    $("#loginBtn").addEventListener("click", tryLogin);
    $("#loginPass").addEventListener("keydown", (e) => e.key === "Enter" && tryLogin());
  }

  $("#logoutBtn").addEventListener("click", () => {
    window.SITE_STORE.setAuthed(false);
    location.reload();
  });

  /* ----------------------------------------------------------
     Tabs
  ---------------------------------------------------------- */
  const tabBtns = $$(".admin-tab-btn");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.toggle("active", b === btn));
      $$(".admin-tab").forEach((t) => (t.hidden = t.id !== `tab-${btn.dataset.tab}`));
      if (btn.dataset.tab === "messages") renderMessages();
      if (btn.dataset.tab === "content" && !contentReady) initContent();
    });
  });

  /* ----------------------------------------------------------
     Messages
  ---------------------------------------------------------- */
  const messagesList = $("#messagesList");
  const statTotal = $("#statTotal");
  const statUnread = $("#statUnread");
  const statToday = $("#statToday");
  const unreadBadge = $("#unreadBadge");

  const fmtDate = (iso) => {
    try {
      return new Date(iso).toLocaleString("ar-IQ-u-nu-latn", { dateStyle: "medium", timeStyle: "short" });
    } catch (err) {
      return iso;
    }
  };

  const renderMessages = () => {
    const all = window.SITE_STORE.getMessages();
    const filter = $("#msgFilter").value;
    const list = filter === "unread" ? all.filter((m) => !m.read) : all;
    const today = new Date().toDateString();

    statTotal.textContent = all.length;
    statUnread.textContent = all.filter((m) => !m.read).length;
    statToday.textContent = all.filter((m) => new Date(m.date).toDateString() === today).length;
    unreadBadge.textContent = statUnread.textContent;
    unreadBadge.hidden = statUnread.textContent === "0";

    if (!list.length) {
      messagesList.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5Z"/><path d="M8.5 10.5h7M8.5 13.5h4"/></svg>
          <p>${filter === "unread" ? "لا توجد رسائل غير مقروءة 🎉" : "لا توجد رسائل بعد — انتظر أول رسالة من نموذج التواصل."}</p>
        </div>`;
      return;
    }

    messagesList.innerHTML = list
      .map(
        (m) => `
        <article class="msg-card ${m.read ? "" : "unread"}">
          <div class="msg-head">
            <strong>${escapeHtml(m.name)}</strong>
            <span class="msg-subject">${escapeHtml(m.subject || "بدون موضوع")}</span>
            <span class="msg-date">${fmtDate(m.date)}</span>
          </div>
          <a class="msg-email" href="mailto:${escapeAttr(m.email)}">${escapeHtml(m.email)}</a>
          <div class="msg-body">${escapeHtml(m.message)}</div>
          <div class="msg-actions">
            <button class="msg-btn" data-action="toggle-read" data-id="${m.id}" type="button">${m.read ? "تحديد كغير مقروءة" : "تحديد كمقروءة"}</button>
            <button class="msg-btn danger" data-action="delete" data-id="${m.id}" type="button">حذف</button>
          </div>
        </article>`
      )
      .join("");
  };

  const escapeHtml = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const escapeAttr = (s) => escapeHtml(s);

  messagesList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = btn.dataset.id;
    if (btn.dataset.action === "delete") {
      window.SITE_STORE.deleteMessage(id);
      toast("تم حذف الرسالة.");
    } else {
      const msg = window.SITE_STORE.getMessages().find((m) => m.id === id);
      window.SITE_STORE.updateMessage(id, { read: !(msg && msg.read) });
    }
    renderMessages();
  });

  $("#msgFilter").addEventListener("change", renderMessages);

  renderMessages();

  $("#exportBtn").addEventListener("click", () => {
    const data = window.SITE_STORE.getMessages();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "saydalati-messages.json";
    a.click();
    URL.revokeObjectURL(a.href);
    toast("تم تصدير الرسائل بنجاح.");
  });

  /* ----------------------------------------------------------
     Content editor
  ---------------------------------------------------------- */
  let contentReady = false;
  let defaultDocs = {};
  let fieldValues = {}; // selector -> current edited value (in-memory buffer)

  const initContent = async () => {
    contentReady = true;
    const fieldsBox = $("#contentFields");
    const chipsBox = $("#pageChips");

    fieldsBox.innerHTML = `<div class="empty-state"><p>جاري تحميل المحتوى…</p></div>`;

    await Promise.all(
      PAGE_FILES.map(async (file) => {
        try {
          const res = await fetch(file, { cache: "no-store" });
          const text = await res.text();
          defaultDocs[file] = new DOMParser().parseFromString(text, "text/html");
        } catch (err) {
          defaultDocs[file] = null;
        }
      })
    );

    chipsBox.innerHTML = PAGE_FILES.map(
      (file, i) =>
        `<button class="page-chip ${i === 0 ? "active" : ""}" data-file="${file}" type="button">${window.SITE_PAGE_NAMES[file] || file}</button>`
    ).join("");

    chipsBox.addEventListener("click", (e) => {
      const chip = e.target.closest(".page-chip");
      if (!chip) return;
      $$(".page-chip", chipsBox).forEach((c) => c.classList.toggle("active", c === chip));
      renderPage(chip.dataset.file);
    });

    renderPage(PAGE_FILES[0]);
  };

  const getFieldDefs = (file) => {
    const doc = defaultDocs[file];
    const defs = [];
    window.SITE_CONTENT_SCHEMA
      .filter((f) => f.file === file)
      .forEach((f) => {
        if (f.auto) {
          if (!doc) return;
          $$(`${f.root} > *`, doc).forEach((child, idx) => {
            const selector = `${f.root} > :nth-child(${idx + 1})`;
            if (child.matches && child.matches(".update-note")) return;
            const label =
              child.tagName === "H2"
                ? `§ ${(child.textContent || "").trim().slice(0, 60)}`
                : `${child.tagName || "عنصر"} ${idx + 1} — ${(child.textContent || "").trim().slice(0, 40)}`;
            defs.push({ selector, label, group: f.group, file });
          });
        } else {
          defs.push({ selector: f.selector, label: f.label, group: f.group, file });
        }
      });
    return defs;
  };

  const defaultOf = (file, selector) => {
    const doc = defaultDocs[file];
    if (!doc) return "";
    try {
      return doc.querySelector(selector)?.innerHTML ?? "";
    } catch (err) {
      return "";
    }
  };

  const renderPage = (file) => {
    const fieldsBox = $("#contentFields");
    if (!defaultDocs[file]) {
      fieldsBox.innerHTML = `<div class="empty-state"><p>تعذر تحميل القيم الافتراضية (يفضل فتح اللوحة عبر خادم HTTP). يمكنك التعديل والحفظ رغم ذلك.</p></div>`;
    }

    const defs = getFieldDefs(file);
    const stored = window.SITE_STORE.getContent();
    const groups = {};
    defs.forEach((d) => {
      (groups[d.group] = groups[d.group] || []).push(d);
    });

    fieldsBox.innerHTML = Object.entries(groups)
      .map(
        ([group, fields]) => `
        <div class="content-group">
          <h3>${escapeHtml(group)}</h3>
          ${fields
            .map((f) => {
              const value = fieldValues[f.selector] ?? stored[f.selector] ?? defaultOf(file, f.selector) ?? "";
              return `
              <div class="field-card" data-selector="${escapeAttr(f.selector)}">
                <div class="field-label">
                  <strong>${escapeHtml(f.label)}</strong>
                  <span class="field-selector">${escapeHtml(f.selector)}</span>
                  <span class="field-changed">● غير محفوظ</span>
                </div>
                <textarea rows="3">${escapeHtml(value)}</textarea>
                <div class="field-foot">
                  <small class="auto-saved">محفوظ ✓</small>
                  <button class="revert-btn" type="button">إعادة القيمة الافتراضية</button>
                </div>
              </div>`;
            })
            .join("")}
        </div>`
      )
      .join("");
  };

  $("#contentFields").addEventListener("input", (e) => {
    const card = e.target.closest(".field-card");
    if (!card) return;
    fieldValues[card.dataset.selector] = e.target.value;
    card.classList.add("changed");
    card.querySelector(".auto-saved").textContent = "";
    $("#saveStatus").textContent = "هناك تعديلات غير محفوظة — اضغط «حفظ التغييرات»";
    $("#saveBar").classList.remove("saved");
  });

  $("#contentFields").addEventListener("click", (e) => {
    const btn = e.target.closest(".revert-btn");
    if (!btn) return;
    const card = btn.closest(".field-card");
    const selector = card.dataset.selector;
    const file = $("#pageChips .page-chip.active")?.dataset.file;
    const defaultHtml = defaultOf(file, selector);

    delete fieldValues[selector];
    const stored = window.SITE_STORE.getContent();
    delete stored[selector];
    window.SITE_STORE.setContent(stored);

    card.querySelector("textarea").value = defaultHtml;
    card.classList.remove("changed");
    $("#saveStatus").textContent = "تمت إعادة القيمة الافتراضية.";
    toast("تمت إعادة القيمة الافتراضية لهذا العنصر.");
  });

  $("#saveBtn").addEventListener("click", () => {
    const map = {};
    $$(".field-card").forEach((card) => {
      map[card.dataset.selector] = card.querySelector("textarea").value;
    });
    window.SITE_STORE.setContent(map);
    $$(".field-card").forEach((card) => {
      card.classList.remove("changed");
      card.querySelector(".auto-saved").textContent = "محفوظ ✓";
    });
    $("#saveStatus").textContent = "تم حفظ جميع التغييرات ✓";
    $("#saveBar").classList.add("saved");
    toast("تم حفظ التغييرات — اطلع على الموقع الآن.");
  });

  /* ----------------------------------------------------------
     Settings
  ---------------------------------------------------------- */
  $("#changePassBtn").addEventListener("click", () => {
    const p1 = $("#newPass1").value;
    const p2 = $("#newPass2").value;
    if (p1.length < 6) return toast("كلمة المرور الجديدة يجب ألا تقل عن 6 أحرف.");
    if (p1 !== p2) return toast("كلمتا المرور غير متطابقتين.");
    window.SITE_STORE.setPass(p1);
    $("#newPass1").value = "";
    $("#newPass2").value = "";
    toast("تم تحديث كلمة المرور بنجاح.");
  });

  $("#resetContentBtn").addEventListener("click", () => {
    if (!confirm("سيتم تجاهل جميع تعديلات المحتوى والعودة للنصوص الافتراضية. متابعة؟")) return;
    localStorage.removeItem(window.SITE_KEYS.CONTENT);
    fieldValues = {};
    if (contentReady) {
      const active = $("#pageChips .page-chip.active")?.dataset.file || PAGE_FILES[0];
      renderPage(active);
    }
    toast("تمت استعادة المحتوى الافتراضي.");
  });

  $("#clearMessagesBtn").addEventListener("click", () => {
    if (!confirm("سيتم حذف جميع رسائل التواصل نهائيًا. متابعة؟")) return;
    window.SITE_STORE.clearMessages();
    renderMessages();
    toast("تم حذف جميع الرسائل.");
  });

  /* ----------------------------------------------------------
     Toast
  ---------------------------------------------------------- */
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  };
})();