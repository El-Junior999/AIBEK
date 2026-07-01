/* sidebar.js — shared sidebar logic for all pages */
(function () {
  var ROLES = [
    { key: 'super',     label: 'Супер Админ',       color: '#3b5bff', page: 'dashboard.html' },
    { key: 'admin',     label: 'Админ',              color: '#12c99b', page: 'dashboard.html' },
    { key: 'operator',  label: 'Оператор',           color: '#f5a623', page: 'dashboard.html' },
    { key: 'teacher',   label: 'Учитель',            color: '#8b5cf6', page: 'teacher.html'   },
    { key: 'director',  label: 'Директор',           color: '#ff5a5f', page: 'director.html'  },
    { key: 'head',      label: 'Министр образования',color: '#18d8e8', page: 'head.html'      },
    { key: 'nachalnik', label: 'Нач. управления',    color: '#e94fd0', page: 'nachalnik.html' },
    { key: 'zav',       label: 'Зав. отделом',       color: '#f59e0b', page: 'zav.html'       },
  ];

  var currentRole = localStorage.getItem('aibek_role') || 'super';
  var currentRoleData = ROLES.find(function(r){ return r.key === currentRole; }) || ROLES[0];

  function navigate(roleKey) {
    var data = ROLES.find(function(r){ return r.key === roleKey; });
    localStorage.setItem('aibek_role', roleKey);
    window.location.href = data ? data.page : 'index.html';
  }

  function init() {
    var sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    /* ── 1. Logo → index.html ─────────────────── */
    var brand = document.querySelector('.sb-brand');
    if (brand && !brand.dataset.navInit) {
      brand.dataset.navInit = '1';
      brand.style.cursor = 'pointer';
      brand.addEventListener('click', function () {
        window.location.href = 'index.html';
      });
    }

    /* ── 2. Logout ────────────────────────────── */
    var logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn && !logoutBtn.dataset.navInit) {
      logoutBtn.dataset.navInit = '1';
      logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('aibek_role');
        window.location.href = 'index.html';
      });
    }

    /* ── 3. Role dropdown ─────────────────────── */
    /* If the page already has #sbRole HTML, wire up or skip — always return */
    var existingPop = document.getElementById('rolePop');
    if (existingPop && existingPop.dataset.navInit) {
      return; /* already handled by the page's own script — do nothing */
    }
    if (existingPop && !existingPop.dataset.navInit) {
      existingPop.dataset.navInit = '1';
      /* Replace old listeners by cloning buttons */
      existingPop.querySelectorAll('button[data-role]').forEach(function (btn) {
        var fresh = btn.cloneNode(true);
        btn.parentNode.replaceChild(fresh, btn);
        fresh.addEventListener('click', function () {
          navigate(this.getAttribute('data-role'));
        });
      });

      /* Highlight active role */
      existingPop.querySelectorAll('button[data-role]').forEach(function (btn) {
        btn.classList.toggle('active', btn.getAttribute('data-role') === currentRole);
      });

      /* Toggle open/close */
      var roleBtn = document.getElementById('roleBtn');
      var roleWrap = document.getElementById('sbRole');
      if (roleBtn && roleWrap && !roleBtn.dataset.navInit) {
        roleBtn.dataset.navInit = '1';
        roleBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          roleWrap.classList.toggle('open');
        });
        document.addEventListener('click', function (e) {
          if (roleWrap && !roleWrap.contains(e.target)) roleWrap.classList.remove('open');
        });
      }
      return; /* done */
    }

    /* Page has no #sbRole — inject CSS + HTML */
    if (!document.querySelector('style[data-sb-role]')) {
      var style = document.createElement('style');
      style.setAttribute('data-sb-role', '1');
      style.textContent = [
        '.sb-role{position:relative;margin:0 0 18px;}',
        '.sb-role-btn{display:flex;align-items:center;gap:9px;padding:10px 13px;border-radius:13px;',
        '  background:rgba(255,255,255,.12);cursor:pointer;user-select:none;transition:background .18s;}',
        '.sb-role-btn:hover{background:rgba(255,255,255,.2);}',
        '.rb-ico{width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,.18);',
        '  display:flex;align-items:center;justify-content:center;flex-shrink:0;}',
        '.rb-ico svg{width:15px;height:15px;}',
        '.rb-lbl{flex:1;font-size:13.5px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
        '.rb-chev{width:16px;height:16px;flex-shrink:0;color:rgba(255,255,255,.6);}',
        '.rb-chev svg{width:16px;height:16px;}',
        '.sb-role-pop{position:absolute;top:calc(100% + 8px);left:0;right:0;background:#fff;',
        '  border-radius:14px;padding:8px;box-shadow:0 12px 40px rgba(20,30,80,.18);z-index:99;display:none;}',
        '.sb-role.open .sb-role-pop{display:block;}',
        '.sb-role-pop button{display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;',
        '  border:none;background:transparent;border-radius:10px;font-size:13.5px;font-weight:600;',
        '  color:#3a4256;cursor:pointer;transition:background .12s;text-align:left;}',
        '.sb-role-pop button:hover{background:#f4f5ff;}',
        '.sb-role-pop button.active{background:#eef0ff;color:#3b5bff;}',
        '.rp-dot{width:9px;height:9px;border-radius:3px;flex-shrink:0;}',
        '.rp-sep{height:1px;background:#f0f2f8;margin:5px 0;}',
        '.sidebar.collapsed .sb-role{display:none;}',
      ].join('');
      document.head.appendChild(style);
    }

    /* Build popup HTML */
    var adminBtns = ROLES.slice(0, 3).map(function (r) {
      return '<button data-role="' + r.key + '" class="' + (r.key === currentRole ? 'active' : '') + '">' +
        '<span class="rp-dot" style="background:' + r.color + '"></span>' + r.label + '</button>';
    }).join('');
    var otherBtns = ROLES.slice(3).map(function (r) {
      return '<button data-role="' + r.key + '" class="' + (r.key === currentRole ? 'active' : '') + '">' +
        '<span class="rp-dot" style="background:' + r.color + '"></span>' + r.label + '</button>';
    }).join('');

    var roleDiv = document.createElement('div');
    roleDiv.className = 'sb-role';
    roleDiv.id = 'sbRole';
    roleDiv.innerHTML =
      '<div class="sb-role-btn" id="roleBtn">' +
        '<div class="rb-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
          '<path d="M12 2a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5z"/>' +
          '<path d="M3 21a9 9 0 0 1 18 0"/></svg></div>' +
        '<span class="rb-lbl">' + currentRoleData.label + '</span>' +
        '<span class="rb-chev"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">' +
          '<path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
      '</div>' +
      '<div class="sb-role-pop" id="rolePop">' +
        adminBtns +
        '<div class="rp-sep"></div>' +
        otherBtns +
      '</div>';

    /* Insert before nav */
    var nav = sidebar.querySelector('.sb-nav');
    sidebar.insertBefore(roleDiv, nav);

    /* Wire events */
    var roleBtn2 = document.getElementById('roleBtn');
    var roleWrap2 = document.getElementById('sbRole');
    roleBtn2.addEventListener('click', function (e) {
      e.stopPropagation();
      roleWrap2.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!roleWrap2.contains(e.target)) roleWrap2.classList.remove('open');
    });
    roleDiv.querySelectorAll('button[data-role]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        navigate(this.getAttribute('data-role'));
      });
    });
  }

  /* ── Lang switcher ───────────────────────── */
  function initLang() {
    var saved = localStorage.getItem('aibek_lang') || 'uz';
    document.querySelectorAll('.lang-btn').forEach(function(btn){
      btn.classList.toggle('active', btn.textContent === saved.toUpperCase());
    });
  }

  window.setLang = function(l) {
    localStorage.setItem('aibek_lang', l);
    document.querySelectorAll('.lang-btn').forEach(function(btn){
      btn.classList.toggle('active', btn.textContent === l.toUpperCase());
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ init(); initLang(); });
  } else {
    init(); initLang();
  }
})();
