(() => {
  const ALLOW_SELECTOR = 'input, textarea, [data-allow-select]'; // allow forms or tagged elements

  function injectStyles() {
    const css = `
      .cg-noselect { -webkit-user-select:none; -ms-user-select:none; user-select:none; }
      ${ALLOW_SELECTOR}{ -webkit-user-select:text; user-select:text; }
      #cg-toast{
        position:fixed; left:50%; bottom:24px; transform:translateX(-50%);
        background: linear-gradient(135deg, #ff8a00, #ffa000);
        color:#fff; padding:12px 20px; border-radius:12px;
        font:bold 14px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial;
        z-index:2147483647; pointer-events:none; opacity:0; transition:opacity .3s ease;
        box-shadow: 0 6px 18px rgba(255, 138, 0, 0.45), 0 0 15px rgba(255, 165, 0, 0.7);
        border: 1px solid rgba(255, 165, 0, 0.3);
        text-align: center;
        max-width: 80%;
        animation: cg-pulse 2s infinite;
      }
      @keyframes cg-pulse {
        0% { box-shadow: 0 6px 18px rgba(255, 138, 0, 0.45), 0 0 15px rgba(255, 165, 0, 0.7); }
        50% { box-shadow: 0 6px 22px rgba(255, 138, 0, 0.6), 0 0 20px rgba(255, 165, 0, 0.9); }
        100% { box-shadow: 0 6px 18px rgba(255, 138, 0, 0.45), 0 0 15px rgba(255, 165, 0, 0.7); }
      }`;
    const s = document.createElement('style');
    s.id = 'cg-style'; s.textContent = css;
    document.head.appendChild(s);
    document.addEventListener('DOMContentLoaded', () => document.body.classList.add('cg-noselect'));
  }

  let toastTimer;
  function toast(msg) {
    let t = document.getElementById('cg-toast');
    if (!t) { t = document.createElement('div'); t.id = 'cg-toast'; document.body.appendChild(t); }
    t.textContent = msg; t.style.opacity = '1';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.style.opacity = '0'; }, 2000);
  }

  // Block selection (except allowed)
  document.addEventListener('selectstart', e => {
    if (!e.target.closest(ALLOW_SELECTOR)) {
      e.preventDefault();
      toast("content is protected");
    }
  }, {capture:true});

  // Block right-click
  document.addEventListener('contextmenu', e => {
    if (!e.target.closest(ALLOW_SELECTOR)) {
      e.preventDefault();
      toast("content is protected");
    }
  });

  // Block copy / cut / drag
  ['copy','cut','dragstart'].forEach(type => {
    document.addEventListener(type, e => {
      if (!e.target.closest(ALLOW_SELECTOR)) {
        e.preventDefault();
        toast("content is protected");
      }
    }, {capture:true});
  });

  // Block DevTools & view-source keys
  document.addEventListener('keydown', e => {
    const k = (e.key || '').toLowerCase();
    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;

    if ((ctrl && (k === 'u' || k === 's' || k === 'p'))) {
      e.preventDefault(); e.stopPropagation();
      toast("content is protected");
    }

    const isBlockedCombo =
      (k === 'f12') ||
      (ctrl && shift && (k === 'i' || k === 'j' || k === 'c'));

    if (isBlockedCombo) {
      e.preventDefault(); e.stopPropagation();
      toast("content is protected");
    }
  }, {capture:true});

  // Block attempts to open "view-source:" from inside JS navigation
  const originalAssign = window.location.assign;
  const originalReplace = window.location.replace;
  Object.defineProperty(window.location, "assign", {
    value: function(url) {
      if (url.startsWith("view-source:")) {
        toast("content is protected");
        return;
      }
      return originalAssign.call(window.location, url);
    }
  });
  Object.defineProperty(window.location, "replace", {
    value: function(url) {
      if (url.startsWith("view-source:")) {
        toast("content is protected");
        return;
      }
      return originalReplace.call(window.location, url);
    }
  });

  // Sanitize links with "view-source:"
  function sanitizeLinks(root=document) {
    root.querySelectorAll("a[href^='view-source:']").forEach(a => {
      a.removeAttribute("href");
      a.addEventListener("click", e => {
        e.preventDefault();
        toast("content is protected");
      });
    });
  }

  // Run once on page load
  document.addEventListener("DOMContentLoaded", () => sanitizeLinks());

  // Watch for dynamically added links
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // element
          if (node.matches("a[href^='view-source:']")) {
            sanitizeLinks(node.parentNode || document);
          } else {
            sanitizeLinks(node);
          }
        }
      });
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  injectStyles();
})();
(() => {
  const ALLOW_SELECTOR = 'input, textarea, [data-allow-select]'; // allow forms or tagged elements

  function injectStyles() {
    const css = `
      .cg-noselect { -webkit-user-select:none; -ms-user-select:none; user-select:none; }
      ${ALLOW_SELECTOR}{ -webkit-user-select:text; user-select:text; }
      #cg-toast{
        position:fixed; left:50%; bottom:24px; transform:translateX(-50%);
        background: linear-gradient(135deg, #ff8a00, #ffa000);
        color:#fff; padding:12px 20px; border-radius:12px;
        font:bold 14px/1.2 system-ui, -apple-system, Segoe UI, Roboto, Arial;
        z-index:2147483647; pointer-events:none; opacity:0; transition:opacity .3s ease;
        box-shadow: 0 6px 18px rgba(255, 138, 0, 0.45), 0 0 15px rgba(255, 165, 0, 0.7);
        border: 1px solid rgba(255, 165, 0, 0.3);
        text-align: center;
        max-width: 80%;
        animation: cg-pulse 2s infinite;
      }
      @keyframes cg-pulse {
        0% { box-shadow: 0 6px 18px rgba(255, 138, 0, 0.45), 0 0 15px rgba(255, 165, 0, 0.7); }
        50% { box-shadow: 0 6px 22px rgba(255, 138, 0, 0.6), 0 0 20px rgba(255, 165, 0, 0.9); }
        100% { box-shadow: 0 6px 18px rgba(255, 138, 0, 0.45), 0 0 15px rgba(255, 165, 0, 0.7); }
      }`;
    const s = document.createElement('style');
    s.id = 'cg-style'; s.textContent = css;
    document.head.appendChild(s);
    document.addEventListener('DOMContentLoaded', () => document.body.classList.add('cg-noselect'));
  }

  let toastTimer;
  function toast(msg) {
    let t = document.getElementById('cg-toast');
    if (!t) { t = document.createElement('div'); t.id = 'cg-toast'; document.body.appendChild(t); }
    t.textContent = msg; t.style.opacity = '1';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.style.opacity = '0'; }, 2000);
  }

  // Block selection (except allowed)
  document.addEventListener('selectstart', e => {
    if (!e.target.closest(ALLOW_SELECTOR)) {
      e.preventDefault();
      toast("content is protected");
    }
  }, {capture:true});

  // Block right-click
  document.addEventListener('contextmenu', e => {
    if (!e.target.closest(ALLOW_SELECTOR)) {
      e.preventDefault();
      toast("content is protected");
    }
  });

  // Block copy / cut / drag
  ['copy','cut','dragstart'].forEach(type => {
    document.addEventListener(type, e => {
      if (!e.target.closest(ALLOW_SELECTOR)) {
        e.preventDefault();
        toast("content is protected");
      }
    }, {capture:true});
  });

  // Block DevTools & view-source keys
  document.addEventListener('keydown', e => {
    const k = (e.key || '').toLowerCase();
    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;

    if ((ctrl && (k === 'u' || k === 's' || k === 'p'))) {
      e.preventDefault(); e.stopPropagation();
      toast("content is protected");
    }

    const isBlockedCombo =
      (k === 'f12') ||
      (ctrl && shift && (k === 'i' || k === 'j' || k === 'c'));

    if (isBlockedCombo) {
      e.preventDefault(); e.stopPropagation();
      toast("content is protected");
    }
  }, {capture:true});

  // Block attempts to open "view-source:" from inside JS navigation
  const originalAssign = window.location.assign;
  const originalReplace = window.location.replace;
  Object.defineProperty(window.location, "assign", {
    value: function(url) {
      if (url.startsWith("view-source:")) {
        toast("content is protected");
        return;
      }
      return originalAssign.call(window.location, url);
    }
  });
  Object.defineProperty(window.location, "replace", {
    value: function(url) {
      if (url.startsWith("view-source:")) {
        toast("content is protected");
        return;
      }
      return originalReplace.call(window.location, url);
    }
  });

  // Sanitize links with "view-source:"
  function sanitizeLinks(root=document) {
    root.querySelectorAll("a[href^='view-source:']").forEach(a => {
      a.removeAttribute("href");
      a.addEventListener("click", e => {
        e.preventDefault();
        toast("content is protected");
      });
    });
  }

  // Run once on page load
  document.addEventListener("DOMContentLoaded", () => sanitizeLinks());

  // Watch for dynamically added links
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node.nodeType === 1) { // element
          if (node.matches("a[href^='view-source:']")) {
            sanitizeLinks(node.parentNode || document);
          } else {
            sanitizeLinks(node);
          }
        }
      });
    });
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  injectStyles();
})();
