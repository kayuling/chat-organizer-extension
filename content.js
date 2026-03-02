(function () {
  'use strict';
  function fetchAllProjects() {
    var projects = [];
    // Source 1: localStorage (snorlax-history cache)
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (!key || !key.endsWith('snorlax-history')) continue;
        var data = JSON.parse(localStorage.getItem(key));
        var pages = (data && data.value && data.value.pages) || [];
        for (var p = 0; p < pages.length; p++) {
          var items = pages[p].items || [];
          for (var j = 0; j < items.length; j++) {
            var g = items[j] && items[j].gizmo && items[j].gizmo.gizmo;
            if (!g || !g.id || g.id.indexOf('g-p-') !== 0) continue;
            var id = g.short_url || g.id;
            var name = (g.display && g.display.name) || g.name || id;
            if (!projects.find(function(x) { return x.id === id; }))
              projects.push({ id: id, name: name });
          }
        }
      }
    } catch (e) {}
    // Source 2: DOM links (catches projects loaded by clicking "More")
    var domLinks = Array.from(document.querySelectorAll('a[href*="/g/g-p-"]'));
    domLinks.forEach(function(a) {
      var m = a.href.match(/[/]g[/](g-p-[^/?#]+)/);
      if (!m) return;
      var id = m[1];
      var name = a.textContent.trim();
      if (name && id && !projects.find(function(x) { return x.id === id; }))
        projects.push({ id: id, name: name });
    });
    return projects;
  }
  function injectStyle() {
    if (document.getElementById('bcm3-style')) return;
    var style = document.createElement('style');
    style.id = 'bcm3-style';
    style.textContent = [
      ':root { --bcm3-bg:#0a0a0a; --bcm3-panel:#111111; --bcm3-border:#262626; --bcm3-text:#fafafa; --bcm3-muted:#a3a3a3; --bcm3-focus:#525252; }',
      '.bcm3-wrap { display:flex; align-items:center; gap:4px; padding-left:8px; }',
      '.bcm3-wrap > a { flex:1; min-width:0; }',
      '.bcm3-cb { -webkit-appearance:none; appearance:none; width:14px; height:14px; min-width:14px; margin:0 3px 0 2px; flex-shrink:0; z-index:10; cursor:pointer; border:1px solid #3f3f46; border-radius:4px; background:#111111; display:inline-grid; place-content:center; transition:border-color .14s ease, background-color .14s ease, transform .14s ease; }',
      '.bcm3-cb:hover { border-color:#737373; background:#171717; }',
      '.bcm3-cb:focus-visible { outline:2px solid #525252; outline-offset:1px; }',
      '.bcm3-cb:checked { background:#fafafa; border-color:#fafafa; }',
      '.bcm3-cb:checked::after { content:""; width:7px; height:4px; border:2px solid #111111; border-top:0; border-right:0; transform:rotate(-45deg) translate(1px,-1px); }',
      '#bcm3-panel { position:fixed; right:20px; bottom:20px; width:320px; z-index:999999; color:var(--bcm3-text); font-family:"Geist","SF Pro Text","Segoe UI",sans-serif; font-size:13px; border:1px solid var(--bcm3-border); border-radius:14px; padding:14px; background:radial-gradient(560px 200px at -5% -70%, #1f2937 0%, transparent 58%), radial-gradient(420px 170px at 105% 130%, #1f2937 0%, transparent 60%), color-mix(in srgb, var(--bcm3-panel) 94%, transparent); box-shadow:0 16px 44px rgba(0,0,0,0.45); backdrop-filter:blur(8px); }',
      '#bcm3-head { margin-bottom:10px; }',
      '#bcm3-kicker { display:inline-flex; align-items:center; border:1px solid #343434; border-radius:999px; padding:2px 7px; margin-bottom:7px; color:#d4d4d4; font-size:10px; letter-spacing:.06em; text-transform:uppercase; background:#171717; }',
      '#bcm3-panel h3 { margin:0 0 5px; font-size:15px; font-weight:620; letter-spacing:-.01em; }',
      '#bcm3-sub { margin:0; font-size:12px; color:var(--bcm3-muted); line-height:1.4; }',
      '#bcm3-count { margin:0 0 9px; color:#d4d4d4; font-size:12px; }',
      '#bcm3-panel select { width:100%; appearance:none; background:#171717; color:var(--bcm3-text); border:1px solid #333; border-radius:10px; padding:8px 10px; margin-bottom:8px; font-size:12px; }',
      '#bcm3-panel select:focus-visible, #bcm3-panel button:focus-visible { outline:2px solid var(--bcm3-focus); outline-offset:2px; }',
      '#bcm3-panel button { width:100%; border:1px solid #333; border-radius:10px; cursor:pointer; padding:8px 10px; margin-bottom:6px; font-size:12px; font-weight:600; transition:transform .14s ease, opacity .14s ease, box-shadow .14s ease; }',
      '#bcm3-panel button:hover { transform:translateY(-1px); }',
      '#bcm3-panel button:active { transform:translateY(0); }',
      '#bcm3-move-btn { background:#fafafa; color:#111111; border-color:#fafafa; box-shadow:0 1px 0 rgba(255,255,255,.35) inset; }',
      '#bcm3-refresh-btn, #bcm3-selall-btn { background:#171717; color:#f5f5f5; }',
      '#bcm3-close-btn { background:transparent; color:#a3a3a3; }',
      '#bcm3-status { margin-top:8px; font-size:11px; min-height:16px; color:#d4d4d4; word-break:break-word; line-height:1.4; }'
    ].join(' ');
    document.head.appendChild(style);
  }
  function delay(ms) {
    return new Promise(function(r) { setTimeout(r, ms); });
  }
  function fireEvents(el, types) {
    var r = el.getBoundingClientRect();
    var x = r.left + r.width / 2;
    var y = r.top + r.height / 2;
    var opts = { bubbles: true, cancelable: true, view: window, clientX: x, clientY: y, screenX: x, screenY: y, pointerId: 1, pointerType: 'mouse', isPrimary: true };
    types.forEach(function(t) {
      el.dispatchEvent(new (t.indexOf('pointer') === 0 ? PointerEvent : MouseEvent)(t, opts));
    });
  }
  function realClick(el) {
    fireEvents(el, ['pointerover','pointerenter','mouseover','mouseenter','pointermove','mousemove','pointerdown','mousedown','pointerup','mouseup','click']);
  }
  function realHover(el) {
    fireEvents(el, ['pointerover','pointerenter','mouseover','mouseenter','pointermove','mousemove']);
  }
  function setStatus(msg) {
    var el = document.getElementById('bcm3-status');
    if (el) el.textContent = msg;
  }
  function updateCount() {
    var all = document.querySelectorAll('.bcm3-cb').length;
    var checked = document.querySelectorAll('.bcm3-cb:checked').length;
    var el = document.getElementById('bcm3-count');
    if (el) el.textContent = checked + ' of ' + all + ' chats selected';
  }
  var lastClickedCheckbox = null;
  function handleCheckboxClick(e, cb) {
    if (e.shiftKey && lastClickedCheckbox && lastClickedCheckbox !== cb) {
      var boxes = Array.from(document.querySelectorAll('.bcm3-cb'));
      var start = boxes.indexOf(lastClickedCheckbox);
      var end = boxes.indexOf(cb);
      if (start !== -1 && end !== -1) {
        var from = Math.min(start, end);
        var to = Math.max(start, end);
        var shouldCheck = cb.checked;
        for (var i = from; i <= to; i++) boxes[i].checked = shouldCheck;
      }
    }
    lastClickedCheckbox = cb;
    updateCount();
  }
  var lastProjectCount = 0;
  function loadProjects() {
    var projects = fetchAllProjects();
    var sel = document.getElementById('bcm3-project-sel');
    if (!sel) return;
    if (projects.length === 0) {
      sel.innerHTML = '<option value="">No projects found — try Refresh</option>';
      setStatus('No projects found. Try clicking Refresh after the page loads.');
      lastProjectCount = 0;
      return;
    }
    // Only update dropdown if count changed (avoids resetting selection on every mutation)
    if (projects.length === lastProjectCount) return;
    lastProjectCount = projects.length;
    var currentVal = sel.value;
    sel.innerHTML = projects.map(function(p) {
      return '<option value="' + p.id + '">' + p.name + '</option>';
    }).join('');
    // Restore previous selection if still available
    if (currentVal && sel.querySelector('option[value="' + currentVal + '"]')) {
      sel.value = currentVal;
    }
    setStatus('Loaded ' + projects.length + ' projects');
  }
  function injectCheckboxes() {
    var links = document.querySelectorAll('nav a[href^="/c/"]');
    links.forEach(function(link) {
      if (link.parentElement && link.parentElement.classList.contains('bcm3-wrap')) return;
      var match = link.href.match(/[/]c[/]([^?#]+)/);
      var convId = match && match[1];
      if (!convId) return;
      var wrap = document.createElement('div');
      wrap.className = 'bcm3-wrap';
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'bcm3-cb';
      cb.dataset.convId = convId;
      cb.dataset.title = link.textContent.trim().replace(/\\s+/g, ' ');
      cb.addEventListener('change', updateCount);
      cb.addEventListener('click', function(e) {
        e.stopPropagation();
        handleCheckboxClick(e, cb);
      });
      link.parentElement.insertBefore(wrap, link);
      wrap.appendChild(cb);
      wrap.appendChild(link);
    });
    updateCount();
  }
  async function moveSelected() {
    var checked = Array.from(document.querySelectorAll('.bcm3-cb:checked'));
    var sel = document.getElementById('bcm3-project-sel');
    var projectId = sel && sel.value;
    var projectName = sel && sel.options[sel.selectedIndex] && sel.options[sel.selectedIndex].text || '';
    if (!checked.length) { setStatus('No chats selected'); return; }
    if (!projectId) { setStatus('No project selected'); return; }
    setStatus('Starting: ' + checked.length + ' chats to "' + projectName + '"');
    var moved = 0;
    for (var i = 0; i < checked.length; i++) {
      var cb = checked[i];
      var wrap = cb.closest('.bcm3-wrap') || cb.parentElement;
      var link = wrap && wrap.querySelector('a[href^="/c/"]');
      if (!link) { setStatus('[' + (i+1) + '] No link found'); continue; }
      var title = (cb.dataset.title || '').substring(0, 25);
      try {
        link.scrollIntoView({ behavior: 'instant', block: 'center' });
        await delay(300);
        realHover(link);
        await delay(500);
        var btn = link.querySelector('button.__menu-item-trailing-btn')
          || link.querySelector('button[aria-label]')
          || link.querySelector('button');
        if (!btn) { setStatus('[' + (i+1) + '] No ... button for "' + title + '"'); continue; }
        setStatus('[' + (i+1) + '/' + checked.length + '] Moving "' + title + '"...');
        realClick(btn);
        await delay(600);
        var moveItem = null;
        for (var w = 0; w < 20; w++) {
          var items = Array.from(document.querySelectorAll('[role="menuitem"]'));
          moveItem = items.find(function(el) { return el.textContent.trim().indexOf('Move to project') === 0; });
          if (moveItem) break;
          await delay(150);
        }
        if (!moveItem) {
          setStatus('[' + (i+1) + '] "Move to project" not found');
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
          await delay(300);
          continue;
        }
        realHover(moveItem);
        realClick(moveItem);
        await delay(600);
        var projItem = null;
        var pName = projectName.toLowerCase();
        for (var w2 = 0; w2 < 15; w2++) {
          var pitems = Array.from(document.querySelectorAll('[role="menuitem"]'));
          projItem = pitems.find(function(el) { return el.textContent.trim().toLowerCase() === pName; });
          if (projItem) break;
          await delay(150);
        }
        if (!projItem) {
          setStatus('[' + (i+1) + '] Project "' + projectName + '" not in submenu');
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
          await delay(300);
          continue;
        }
        realClick(projItem);
        moved++;
        cb.checked = false;
        updateCount();
        setStatus('[' + (i+1) + '/' + checked.length + '] Moved "' + title + '"');
        await delay(1200);
      } catch (e) {
        setStatus('[' + (i+1) + '] Error: ' + e.message);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await delay(500);
      }
    }
    setStatus('Done! Moved ' + moved + '/' + checked.length + ' to "' + projectName + '"');
  }
  function init() {
    if (document.getElementById('bcm3-panel')) return;
    injectStyle();
    var panel = document.createElement('div');
    panel.id = 'bcm3-panel';
    panel.innerHTML =
      '<div id="bcm3-head">' +
      '<div id="bcm3-kicker">Extension</div>' +
      '<h3>Bulk Chat Mover</h3>' +
      '<p id="bcm3-sub">Move selected chats into a project in one pass.</p>' +
      '</div>' +
      '<div id="bcm3-count">Loading...</div>' +
      '<select id="bcm3-project-sel"><option>Loading...</option></select>' +
      '<button id="bcm3-refresh-btn">↻ Refresh Projects</button>' +
      '<button id="bcm3-selall-btn">☑ Select / Deselect All</button>' +
      '<button id="bcm3-move-btn">➜ Move Selected to Project</button>' +
      '<button id="bcm3-close-btn">✕ Close</button>' +
      '<div id="bcm3-status">Ready</div>';
    document.body.appendChild(panel);
    document.getElementById('bcm3-selall-btn').addEventListener('click', function() {
      var cbs = Array.from(document.querySelectorAll('.bcm3-cb'));
      var shouldSelectAll = cbs.some(function(cb) { return !cb.checked; });
      cbs.forEach(function(cb) { cb.checked = shouldSelectAll; });
      updateCount();
    });
    document.getElementById('bcm3-refresh-btn').addEventListener('click', function() {
      lastProjectCount = 0; // force reload
      loadProjects();
    });
    document.getElementById('bcm3-move-btn').addEventListener('click', moveSelected);
    document.getElementById('bcm3-close-btn').addEventListener('click', function() {
      panel.remove();
      lastClickedCheckbox = null;
      var s = document.getElementById('bcm3-style');
      if (s) s.remove();
      if (window._bcmObserver) { window._bcmObserver.disconnect(); window._bcmObserver = null; }
      if (window._bcmProjectObserver) { window._bcmProjectObserver.disconnect(); window._bcmProjectObserver = null; }
      document.querySelectorAll('.bcm3-wrap').forEach(function(wrap) {
        var link = wrap.querySelector('a');
        if (link) wrap.parentElement.insertBefore(link, wrap);
        wrap.remove();
      });
    });
    // Watch sidebar chat links for checkbox injection
    var injectTimer = null;
    window._bcmObserver = new MutationObserver(function() {
      clearTimeout(injectTimer);
      injectTimer = setTimeout(injectCheckboxes, 300);
    });
    window._bcmObserver.observe(document.querySelector('nav') || document.body, { childList: true, subtree: true });
    injectCheckboxes();
    // Watch for new project links appearing in the DOM (e.g. after clicking "More")
    var projectTimer = null;
    var knownProjectCount = document.querySelectorAll('a[href*="/g/g-p-"]').length;
    window._bcmProjectObserver = new MutationObserver(function() {
      var currentCount = document.querySelectorAll('a[href*="/g/g-p-"]').length;
      if (currentCount !== knownProjectCount) {
        knownProjectCount = currentCount;
        clearTimeout(projectTimer);
        projectTimer = setTimeout(function() {
          lastProjectCount = 0; // force reload
          loadProjects();
        }, 400);
      }
    });
    window._bcmProjectObserver.observe(document.body, { childList: true, subtree: true });
    loadProjects();
  }
  window._bcmInit = init;
  setTimeout(init, 2000);
  // Re-run on SPA navigation
  var lastUrl = location.href;
  new MutationObserver(function() {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      setTimeout(function() {
        if (!document.getElementById('bcm3-panel')) init();
      }, 1500);
    }
  }).observe(document.body, { childList: true, subtree: true });
})();
