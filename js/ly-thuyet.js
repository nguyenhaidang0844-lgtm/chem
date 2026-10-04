/* Trang lý thuyết Hóa 12: tự định dạng công thức, mục lục, ô đáp án ẩn, câu hỏi tự kiểm tra.
   Quy ước viết công thức trong HTML (giống phần đề):
   - C4H8O2 tự thành chỉ số dưới; C_{n}H_{2n}O_{2} cho chỉ số chữ; Ca^{2+} cho chỉ số trên
   - C#1 = nguyên tử carbon số 1 (dấu # giữ chữ số không bị thành chỉ số dưới)
   - Mũi tên có điều kiện: →{t°}  ⇌{H2SO4 đặc, t°} */
(function (g) {
  'use strict';
  var doc = g.document;

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  // Điều kiện trên mũi tên có thể chứa ^{...}, _{...} lồng bên trong: →{H^{+}, t°}
  var ARROW = /(→|⇌|⇄)\{((?:[^{}]|\{[^{}]*\})*)\}/g;
  function chemText(t) {
    t = t.replace(/#/g, '⁠');
    t = t.replace(ARROW, function (m, a, c) { return '<span class="ar"><span class="c">' + c + '</span><span class="a">' + a + '</span></span>'; });
    t = t.replace(/([A-Za-z\)\]])(\d+)/g, '$1<sub>$2</sub>');
    t = t.replace(/\^\{([^}]*)\}/g, '<sup>$1</sup>');
    t = t.replace(/_\{([^}]*)\}/g, '<sub>$1</sub>');
    return t;
  }
  function chem(s) { return chemText(esc(s)); }

  // Bản chữ thường (cho <option>, nhãn SVG): dùng ký tự chỉ số Unicode
  var SUB = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', '+': '₊', '-': '₋', 'n': 'ₙ', 'm': 'ₘ' };
  var SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', '–': '⁻' };
  function mapChars(s, tbl) { return s.split('').map(function (c) { return tbl[c] || c; }).join(''); }
  function uni(s) {
    s = String(s).replace(/#/g, '').replace(ARROW, '$1');
    s = s.replace(/([A-Za-z\)\]])(\d+)/g, function (m, a, d) { return a + mapChars(d, SUB); });
    s = s.replace(/\^\{([^}]*)\}/g, function (m, x) { return mapChars(x, SUP); });
    s = s.replace(/_\{([^}]*)\}/g, function (m, x) { return mapChars(x, SUB); });
    return s;
  }

  // Số kiểu Việt Nam: 0,25 ; nhóm hàng nghìn bằng khoảng trắng hẹp
  function round(x, dp) { var p = Math.pow(10, dp); return Math.round(x * p + (x >= 0 ? 1e-9 : -1e-9)) / p; }
  function fmt(x, dp) {
    if (dp === undefined) dp = 2;
    if (!isFinite(x)) return '—';
    var s = round(x, dp).toFixed(dp);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    var parts = s.split('.'), neg = parts[0].charAt(0) === '-', ip = neg ? parts[0].slice(1) : parts[0];
    if (ip.length > 4) ip = ip.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (neg ? '−' : '') + ip + (parts[1] ? ',' + parts[1] : '');
  }

  // ---------- Hình pixel (hoa anh đào của site, bình tam giác cho trang Hóa) ----------
  var ART = {
    sakura: { rows: ['....PP...PP....', '...PLLP.PLLP...', '..PLLLLPLLLLP..', '..PLLLLLLLLLP..', '...PLLLLLLLP...', '..PPLLLLLLLPP..', '.PLLLLLYLLLLLP.',
      'PLLLLLYDYLLLLLP', '.PLLLLLYLLLLLP.', '..PPLLLLLLLPP..', '...PLLLLLLLP...', '..PLLLLLLLLLP..', '..PLLLLPLLLLP..', '...PLLP.PLLP...', '....PP...PP....'],
      col: { P: '#ff8fb3', L: '#ffd3e2', Y: '#ffd166', D: '#9b1c40' } },
    flask: { rows: ['....OOOOOOO....', '.....OGGGO.....', '.....OGGGO.....', '.....OGGGO.....', '....OGGGGGO....', '...OGGGGGGGO...', '..OGGGGBGGGGO..',
      '..OPPPPPPPPPO..', '.OPPBPPPPPPPPO.', '.OPPPPPPPBPPPO.', 'OPPPPBPPPPPPPPO', 'OPPPPPPPPPPBPPO', 'OPPBPPPPPPPPPPO', 'OPPPPPPPPPPPPPO', '.OOOOOOOOOOOOO.'],
      col: { O: '#ffd3e2', G: '#5a1028', P: '#ff8fb3', B: '#fff3f7' } }
  };
  function pix(name) {
    var a = ART[name], r = '';
    if (!a) return '';
    a.rows.forEach(function (row, y) { for (var x = 0; x < row.length; x++) { var c = a.col[row.charAt(x)]; if (c) r += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + c + '"/>'; } });
    return '<svg viewBox="0 0 15 15" aria-hidden="true" shape-rendering="crispEdges">' + r + '</svg>';
  }

  var LT = { esc: esc, chem: chem, uni: uni, fmt: fmt, pix: pix };
  g.LT = LT;
  if (!doc) return; // chạy trong Node (kiểm thử) thì dừng ở đây

  // ---------- Định dạng công thức trong toàn trang ----------
  var SVGNS = 'http://www.w3.org/2000/svg';
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, SELECT: 1, OPTION: 1, CODE: 1, PRE: 1, KBD: 1, NOSCRIPT: 1, TITLE: 1 };
  var NEED = /[A-Za-z\)\]]\d|\^\{|_\{|[→⇌⇄]\{|#/;
  function skipped(el, stop) {
    for (var p = el; p && p !== stop; p = p.parentNode) {
      if (p.nodeType !== 1) continue;
      if (SKIP[p.nodeName] || p.namespaceURI === SVGNS || (p.classList && p.classList.contains('nochem'))) return true;
    }
    return false;
  }
  function formatTree(root) {
    if (!root) return;
    var walker = doc.createTreeWalker(root, 4 /* SHOW_TEXT */, null), list = [], n;
    while ((n = walker.nextNode())) if (NEED.test(n.nodeValue) && !skipped(n.parentNode, root.parentNode)) list.push(n);
    list.forEach(function (node) {
      var box = doc.createElement('span'), frag = doc.createDocumentFragment();
      box.innerHTML = chem(node.nodeValue);
      while (box.firstChild) frag.appendChild(box.firstChild);
      node.parentNode.replaceChild(frag, node);
    });
  }
  LT.formatTree = formatTree;

  // Nhóm nút chọn cho mô phỏng: list = [{ id, label }], label là HTML
  LT.picks = function (el, list, cur, onPick) {
    el.classList.add('picks');
    el.innerHTML = list.map(function (o) {
      return '<button type="button" class="pick" data-id="' + o.id + '" aria-pressed="' + (o.id === cur ? 'true' : 'false') + '">' + o.label + '</button>';
    }).join('');
    el.addEventListener('click', function (e) {
      var b = e.target.closest('.pick'); if (!b || !el.contains(b)) return;
      Array.prototype.forEach.call(el.querySelectorAll('.pick'), function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      onPick(b.getAttribute('data-id'));
    });
  };

  // ---------- Mục lục + đánh dấu mục đang đọc ----------
  function slug(s) {
    return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'muc';
  }
  function buildToc() {
    var main = doc.querySelector('main.lt'); if (!main) return;
    var used = {}, heads = [];
    Array.prototype.forEach.call(main.querySelectorAll('h2, h3, h4'), function (h) {
      if (h.closest('.box, .ex, .qz, .tfq, .out, .node, details, .key, .trap, .tip, .ext')) return;
      if (h.tagName === 'H2' && !h.closest('.lesson-head')) return;
      if (!h.id) { var base = slug(h.textContent), id = base, k = 2; while (used[id] || doc.getElementById(id)) id = base + '-' + k++; h.id = id; }
      used[h.id] = 1; heads.push(h);
    });
    var html = '';
    heads.forEach(function (h) {
      var lv = h.tagName === 'H2' ? 2 : h.tagName === 'H3' ? 3 : 4, label = h.innerHTML;
      if (lv === 2) { var ln = h.closest('.lesson-head').querySelector('.ln'); if (ln) label = ln.textContent + ' · ' + label; }
      if (h.closest('.sim')) label = '▸ ' + label;
      html += '<li class="t' + lv + '"><a href="#' + h.id + '" data-to="' + h.id + '">' + label + '</a></li>';
    });
    ['toc', 'toc-m'].forEach(function (id) { var el = doc.getElementById(id); if (el) el.innerHTML = html; });
    var nav = doc.querySelector('.toc'), tm = doc.querySelector('.toc-m');
    if (tm) tm.addEventListener('click', function (e) { if (e.target.closest('a')) tm.open = false; });
    var cur = null, ticking = false;
    function spy() {
      ticking = false;
      var act = null;
      for (var i = 0; i < heads.length; i++) { if (heads[i].getBoundingClientRect().top <= 120) act = heads[i]; else break; }
      var id = act ? act.id : null;
      if (id === cur) return;
      cur = id;
      Array.prototype.forEach.call(doc.querySelectorAll('.toc a.on'), function (a) { a.classList.remove('on'); });
      if (!id || !nav) return;
      var a = nav.querySelector('a[data-to="' + id + '"]');
      if (a) {
        a.classList.add('on');
        var top = a.offsetTop, h = nav.clientHeight;
        if (top < nav.scrollTop + 30 || top > nav.scrollTop + h - 40) nav.scrollTop = Math.max(0, top - h / 3);
      }
    }
    g.addEventListener('scroll', function () { if (!ticking) { ticking = true; g.requestAnimationFrame(spy); } }, { passive: true });
    spy();
  }

  // ---------- Ô đáp án ẩn ----------
  function initHidden() {
    Array.prototype.forEach.call(doc.querySelectorAll('.hid'), function (el) {
      el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button'); el.setAttribute('aria-label', 'Bấm để xem đáp án');
    });
  }
  function toggleHid(el, show) {
    show = show === undefined ? !el.classList.contains('show') : show;
    el.classList.toggle('show', show);
    if (show) { el.removeAttribute('aria-label'); } else { el.setAttribute('aria-label', 'Bấm để xem đáp án'); }
  }

  // ---------- Câu hỏi tự kiểm tra ----------
  var L = 'ABCD';
  function initQuiz() {
    Array.prototype.forEach.call(doc.querySelectorAll('.qz'), function (q) {
      var ol = q.querySelector(':scope > ol'); if (!ol) return;
      var box = doc.createElement('div'); box.className = 'opts';
      Array.prototype.forEach.call(ol.children, function (li, i) {
        var b = doc.createElement('button'); b.type = 'button'; b.className = 'opt'; b.setAttribute('data-i', i);
        b.innerHTML = '<b>' + L.charAt(i) + '</b><span>' + li.innerHTML + '</span>';
        box.appendChild(b);
      });
      ol.parentNode.replaceChild(box, ol);
      var why = q.querySelector('.why'); if (why) { q.appendChild(why); why.insertAdjacentHTML('afterbegin', '<b class="lbl">Giải thích</b>'); }
    });
    Array.prototype.forEach.call(doc.querySelectorAll('.tfq li'), function (li) {
      var why = li.querySelector('.why'); if (why) why.parentNode.removeChild(why);
      var text = li.innerHTML;
      li.innerHTML = '<div class="tfrow"><div class="tftext">' + text + '</div><div class="tfbtns"><button type="button" class="tfb" data-v="1">Đúng</button><button type="button" class="tfb" data-v="0">Sai</button></div></div>';
      if (why) li.appendChild(why);
    });
    Array.prototype.forEach.call(doc.querySelectorAll('.qset'), function (set) {
      var head = doc.createElement('div'); head.className = 'qset-head';
      head.innerHTML = '<span class="qset-score" aria-live="polite"></span><button type="button" class="link" data-act="qreset">Làm lại</button>';
      var first = set.firstElementChild;
      if (first && /^H[2-5]$/.test(first.tagName)) set.insertBefore(head, first.nextSibling); else set.insertBefore(head, set.firstChild);
      score(set);
    });
  }
  function items(set) { return Array.prototype.slice.call(set.querySelectorAll('.qz, .tfq li')); }
  function score(set) {
    if (!set) return;
    var all = items(set), done = 0, ok = 0;
    all.forEach(function (it) { var v = it.getAttribute('data-ok'); if (v !== null) { done++; if (v === '1') ok++; } });
    var el = set.querySelector('.qset-score');
    if (el) el.textContent = done ? 'Đúng ' + ok + '/' + done + ' · còn ' + (all.length - done) : all.length + ' câu · bấm để trả lời';
  }
  function answerMc(btn) {
    var q = btn.closest('.qz'); if (!q || q.classList.contains('done')) return;
    var a = L.indexOf((q.getAttribute('data-a') || 'A').trim().toUpperCase()), i = +btn.getAttribute('data-i');
    Array.prototype.forEach.call(q.querySelectorAll('.opt'), function (o, k) { o.disabled = true; if (k === a) o.classList.add('right'); });
    if (i !== a) btn.classList.add('wrong');
    q.classList.add('done'); q.setAttribute('data-ok', i === a ? '1' : '0');
    score(q.closest('.qset'));
  }
  function answerTf(btn) {
    var li = btn.closest('li'); if (!li || li.getAttribute('data-ok') !== null) return;
    var a = li.getAttribute('data-a') === '1', v = btn.getAttribute('data-v') === '1', row = li.querySelector('.tfrow');
    Array.prototype.forEach.call(li.querySelectorAll('.tfb'), function (b) { b.disabled = true; if ((b.getAttribute('data-v') === '1') === a) b.classList.add('right'); });
    if (v !== a) btn.classList.add('wrong');
    row.classList.add(v === a ? 'right' : 'wrong');
    li.setAttribute('data-ok', v === a ? '1' : '0');
    var why = li.querySelector('.why'); if (why) why.classList.add('on');
    score(li.closest('.qset'));
  }
  function resetSet(set) {
    items(set).forEach(function (it) { it.removeAttribute('data-ok'); it.classList.remove('done'); });
    Array.prototype.forEach.call(set.querySelectorAll('.opt, .tfb'), function (b) { b.disabled = false; b.classList.remove('right', 'wrong'); });
    Array.prototype.forEach.call(set.querySelectorAll('.tfrow'), function (r) { r.classList.remove('right', 'wrong'); });
    Array.prototype.forEach.call(set.querySelectorAll('.tfq .why'), function (w) { w.classList.remove('on'); });
    score(set);
  }

  // ---------- Sự kiện chung ----------
  doc.addEventListener('click', function (e) {
    var t = e.target;
    var hid = t.closest('.hid'); if (hid) { toggleHid(hid); return; }
    var rv = t.closest('[data-reveal]');
    if (rv) {
      var box = doc.getElementById(rv.getAttribute('data-reveal')); if (!box) return;
      var hs = box.querySelectorAll('.hid'), show = Array.prototype.some.call(hs, function (h) { return !h.classList.contains('show'); });
      Array.prototype.forEach.call(hs, function (h) { toggleHid(h, show); });
      rv.textContent = show ? 'Ẩn đáp án' : 'Hiện tất cả đáp án';
      return;
    }
    var opt = t.closest('.qz .opt'); if (opt) { answerMc(opt); return; }
    var tfb = t.closest('.tfq .tfb'); if (tfb) { answerTf(tfb); return; }
    var rs = t.closest('[data-act="qreset"]'); if (rs) { resetSet(rs.closest('.qset')); return; }
    if (t.closest('.totop')) g.scrollTo(0, 0);
  });
  doc.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('hid')) { e.preventDefault(); toggleHid(e.target); }
  });
  g.addEventListener('beforeprint', function () {
    Array.prototype.forEach.call(doc.querySelectorAll('details'), function (d) { d.open = true; });
  });

  // Tạm dừng hiệu ứng hoa rơi khi đã cuộn qua phần đầu trang (đỡ tốn pin)
  function pauseHero() {
    var hero = doc.querySelector('.hero');
    if (!hero || !g.IntersectionObserver) return;
    new g.IntersectionObserver(function (es) { doc.body.classList.toggle('hero-off', !es[0].isIntersecting); }).observe(hero);
  }

  function initTop() {
    var b = doc.createElement('button'); b.type = 'button'; b.className = 'totop'; b.setAttribute('aria-label', 'Lên đầu trang'); b.textContent = '▲';
    doc.body.appendChild(b);
    var on = false;
    g.addEventListener('scroll', function () { var s = g.scrollY > 700; if (s !== on) { on = s; b.classList.toggle('on', s); } }, { passive: true });
  }

  // Chạy ngay (script đặt cuối <body>): định dạng trước, rồi mới dựng mục lục và câu hỏi
  Array.prototype.forEach.call(doc.querySelectorAll('[data-pix]'), function (el) { el.innerHTML = pix(el.getAttribute('data-pix')); });
  Array.prototype.forEach.call(doc.querySelectorAll('.petals:empty'), function (el) {
    var h = '';
    for (var i = 0; i < 16; i++) {
      h += '<i style="--x:' + (3 + (i * 37) % 94) + '%;--s:' + (6 + (i * 5) % 9) + 'px;--d:' + (9 + (i * 7) % 8) + 's;--l:-' + ((i * 3) % 12) + 's;--dx:' + ((i % 2 ? 1 : -1) * (30 + (i * 11) % 60)) + 'px"></i>';
    }
    el.innerHTML = h;
  });
  formatTree(doc.querySelector('main.lt'));
  formatTree(doc.querySelector('.hero'));
  initHidden();
  initQuiz();
  buildToc();
  initTop();
  pauseHero();
})(typeof window !== 'undefined' ? window : globalThis);
