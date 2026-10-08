/* Từ vựng SAT: thẻ ghi nhớ, học, kiểm tra, ghép thẻ, ôn từ cũ, chuỗi ngày học (kiểu Quizlet) */
(function (g) {
  'use strict';
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  var DAY = 864e5, PKEY = 'satvocab.progress.v1';
  var INTERVAL = [0, 1, 3, 7, 14, 30, 60];          // số ngày tới lần ôn tiếp theo theo hộp (Leitner)
  var KNOWN = 2;                                      // hộp ≥ 2 là "đã biết"

  // ---------- Dữ liệu (js/vocab/*.js gọi vào đây) ----------
  var V = g.Vocab = { index: [], decks: {}, waiting: {} };
  var keyDeck = {};
  V.setIndex = function (list) {
    V.index = list;
    list.forEach(function (d) { d.sets.forEach(function (s) { s.k.forEach(function (k) { if (!keyDeck[k]) keyDeck[k] = d.id; }); }); });
  };
  V.addDeck = function (d) {
    var meta = deckMeta(d.id);
    d.cards = [];
    d.sets.forEach(function (s, si) { s.c.forEach(function (c) { c.deck = d.id; c.set = si; c.kind = meta.kind; d.cards.push(c); }); });
    V.decks[d.id] = d;
    (V.waiting[d.id] || []).forEach(function (f) { f(d); });
    delete V.waiting[d.id];
  };
  function deckMeta(id) { for (var i = 0; i < V.index.length; i++) if (V.index[i].id === id) return V.index[i]; return null; }
  function loadDeck(id) {
    return new Promise(function (ok, fail) {
      if (V.decks[id]) return ok(V.decks[id]);
      var first = !V.waiting[id];
      (V.waiting[id] = V.waiting[id] || []).push(ok);
      if (!first) return;
      var s = document.createElement('script');
      s.src = 'js/vocab/' + id + '.js';
      s.onerror = function () { delete V.waiting[id]; fail(new Error('Không tải được bộ ' + id)); };
      document.body.appendChild(s);
    });
  }
  function loadDecks(ids) { return Promise.all(ids.map(loadDeck)); }

  // ---------- Tiến độ (localStorage) ----------
  var P = loadP();
  function loadP() {
    var p = null;
    try { p = JSON.parse(localStorage.getItem(PKEY)); } catch (e) { /* bỏ qua */ }
    p = p && typeof p === 'object' ? p : {};
    p.c = p.c || {}; p.days = p.days || {}; p.best = p.best || 0; p.goal = p.goal || 20; p.match = p.match || {};
    p.opt = p.opt || {};
    return p;
  }
  function saveP() { try { localStorage.setItem(PKEY, JSON.stringify(P)); } catch (e) { /* bỏ qua */ } }
  function dk(d) { return d.getFullYear() + '-' + two(d.getMonth() + 1) + '-' + two(d.getDate()); }
  function two(n) { return (n < 10 ? '0' : '') + n; }
  function today() { return dk(new Date()); }
  function bump(n) {
    var t = today(); P.days[t] = (P.days[t] || 0) + (n || 1);
    var s = streak(); if (s > P.best) P.best = s;
  }
  function entry(k) { return P.c[k] || (P.c[k] = { b: 0, s: 0, r: 0, w: 0 }); }
  // Ghi một lần trả lời (học, kiểm tra): đúng thì lên hộp, sai thì về hộp 1 và cần ôn ngay
  function record(card, ok) {
    var e = entry(card.k), now = Date.now();
    e.s++; e.l = now;
    if (ok) { e.r++; e.b = Math.min(e.b + 1, INTERVAL.length - 1); e.du = now + INTERVAL[e.b] * DAY; }
    else { e.w++; e.b = 1; e.du = now; }
    bump(1); saveP(); topStreak(); refreshHead();
  }
  // Thẻ ghi nhớ: tự đánh giá "đã biết" / "chưa biết"
  function rate(card, known) {
    var e = entry(card.k), now = Date.now();
    e.s++; e.l = now;
    if (known) { e.r++; e.b = Math.max(e.b, KNOWN); e.du = now + INTERVAL[e.b] * DAY; }
    else { e.w++; e.b = 1; e.du = now; }
    bump(1); saveP(); topStreak(); refreshHead();
  }
  // Cập nhật thanh tiến độ ở băng tiêu đề khi đang học
  function refreshHead() {
    var hd = $('.vhead'); if (!hd || !view || !view.ctx) return;
    var b = $('.bar.tri', hd), l = $('.barlabel', hd); if (!b || !l) return;
    var tmp = document.createElement('div'); tmp.innerHTML = bar3(countKeys(view.ctx.cards.map(function (x) { return x.k; })));
    b.replaceWith(tmp.children[0]); l.replaceWith(tmp.children[0]);
  }
  function status(k) { var e = P.c[k]; if (!e || !e.s) return 'new'; return e.b >= KNOWN ? 'known' : 'learning'; }
  function isDue(k) { var e = P.c[k]; return !!(e && e.s && (e.du || 0) <= Date.now()); }
  function isStar(k) { return !!(P.c[k] && P.c[k].st); }
  function toggleStar(k) { var e = entry(k); e.st = !e.st; saveP(); return e.st; }
  function streak() {
    var d = new Date(), n = 0;
    if (!P.days[dk(d)]) d.setDate(d.getDate() - 1);
    while (P.days[dk(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function countKeys(keys) {
    var r = { total: 0, known: 0, learning: 0, due: 0 }, seen = {};
    keys.forEach(function (k) {
      if (seen[k]) return; seen[k] = 1; r.total++;
      var s = status(k); if (s === 'known') r.known++; else if (s === 'learning') r.learning++;
      if (isDue(k)) r.due++;
    });
    return r;
  }
  function deckKeys(d) { var a = []; d.sets.forEach(function (s) { a = a.concat(s.k); }); return a; }
  function allKeys() { return Object.keys(keyDeck); }

  // ---------- Tiện ích ----------
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function rich(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>'); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pct(a, b) { return b ? Math.round(a * 100 / b) : 0; }
  function isVi(s) { return /[àáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/i.test(s || ''); }
  function norm(s) { return String(s || '').toLowerCase().replace(/[’‘`]/g, "'").replace(/\([^)]*\)/g, ' ').replace(/[^a-z0-9'\- ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
  // Các cách viết được chấp nhận khi gõ đáp án: "Thou/Ye" → thou, ye; "digress(ion)" → digress, digression
  function variants(t) {
    var out = {};
    String(t).split(/\s*[\/;]\s*|\s*,\s*|\s+or\s+/).forEach(function (p) {
      if (!p) return;
      out[norm(p)] = 1;
      out[norm(p.replace(/[()]/g, ''))] = 1;
    });
    out[norm(t)] = 1; out[norm(String(t).replace(/[()]/g, ''))] = 1;
    delete out[''];
    return out;
  }
  function speakable() { return 'speechSynthesis' in g && typeof g.SpeechSynthesisUtterance === 'function'; }
  function speak(text) {
    if (!speakable()) return;
    var u = new g.SpeechSynthesisUtterance(String(text).replace(/\([^)]*\)/g, '').replace(/\//g, ', '));
    u.lang = 'en-US'; u.rate = .9;
    g.speechSynthesis.cancel(); g.speechSynthesis.speak(u);
  }
  var ICON_SAY = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3v10L5 10H2z" fill="currentColor"/><path d="M11 5.5c1 .8 1 4.2 0 5M12.8 3.8c2 1.8 2 6.6 0 8.4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>';
  function sayBtn(text) { return speakable() ? '<button class="say" data-act="say" data-t="' + esc(text) + '" title="Nghe phát âm" aria-label="Nghe phát âm">' + ICON_SAY + '</button>' : ''; }
  function starBtn(k) { var on = isStar(k); return '<button class="star' + (on ? ' on' : '') + '" data-act="star" data-k="' + esc(k) + '" title="Gắn sao" aria-pressed="' + on + '">' + (on ? '★' : '☆') + '</button>'; }
  function canSpeakTerm(c) { return c.kind !== 'math' || !isVi(c.t); }
  function cardsOf(ids) { var a = []; ids.forEach(function (id) { if (V.decks[id]) a = a.concat(V.decks[id].cards); }); return a; }

  // Lửa pixel cho chuỗi ngày
  var FLAME = ['....p.....', '...pp.....', '...ppp..p.', '..pppp.pp.', '..ppyppppp', '.ppyyyppp.', '.ppyyyypp.', 'ppyywyyppp', 'ppyywwyypp', 'ppyywwyypp', '.ppyyyypp.', '..pppppp..'];
  function flameSVG(cls) {
    var col = { p: '#ff8fb3', y: '#ffd166', w: '#fff8fa' }, h = '<svg class="' + (cls || '') + '" viewBox="0 0 10 12" aria-hidden="true">';
    FLAME.forEach(function (row, y) { for (var x = 0; x < row.length; x++) if (col[row[x]]) h += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + col[row[x]] + '"/>'; });
    return h + '</svg>';
  }
  function topStreak() {
    var el = $('#tbstreak'); if (!el) return;
    var s = streak(), done = !!P.days[today()];
    el.className = 'tb-streak' + (s ? '' : ' off');
    el.innerHTML = flameSVG() + '<span>' + s + '</span>';
    el.title = s ? 'Chuỗi ' + s + ' ngày học liên tiếp' + (done ? '' : ' · học hôm nay để giữ chuỗi') : 'Học 1 thẻ hôm nay để bắt đầu chuỗi ngày';
  }
  function bar3(c) {
    return '<div class="bar tri"><i class="k" style="width:' + pct(c.known, c.total) + '%"></i><i class="l" style="width:' + pct(c.learning, c.total) + '%"></i></div>' +
      '<div class="barlabel"><span><b>' + c.known + '</b> đã biết</span><span><b>' + c.learning + '</b> đang học</span><span><b>' + (c.total - c.known - c.learning) + '</b> chưa học</span></div>';
  }
  function legend() {
    return '<div class="legend"><span><i class="dot"></i>Chưa học</span><span><i class="dot learning"></i>Đang học</span><span><i class="dot known"></i>Đã biết</span><span>★ Gắn sao</span></div>';
  }

  // ---------- Điều hướng (hash) ----------
  var app = $('#app'), view = null, CUSTOM = null;
  function go(h) { if (location.hash === h) route(); else location.hash = h; }
  function route() {
    stopTimers();
    var h = location.hash.replace(/^#\/?/, ''), p = h.split('/');
    view = null;
    if (p[0] === 'd' && deckMeta(p[1])) return pageDeck(p[1]);
    if (p[0] === 's' && deckMeta(p[1])) return pageSet(p[1], p[2], p[3] || 'flash');
    if (p[0] === 'custom') { if (CUSTOM) return pageCustom(p[1] || 'flash'); return go('#/review'); }
    if (p[0] === 'review') return pageReview();
    pageHome();
  }
  function show(html) { app.innerHTML = html; g.scrollTo(0, 0); }
  function loading(msg) { show('<section class="cream"><div class="wrap"><p class="muted">' + (msg || 'Đang tải…') + '</p></div></section>'); }

  // ---------- Trang chủ ----------
  function weekStrip() {
    var names = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'], h = '<div class="week">', d = new Date();
    d.setDate(d.getDate() - 6);
    for (var i = 0; i < 7; i++) {
      var k = dk(d);
      h += '<span class="' + (P.days[k] ? 'on' : '') + (i === 6 ? ' today' : '') + '" title="' + k + (P.days[k] ? ' · ' + P.days[k] + ' thẻ' : '') + '"><i></i>' + names[d.getDay()] + '</span>';
      d.setDate(d.getDate() + 1);
    }
    return h + '</div>';
  }
  function deckCard(d, i) {
    var c = countKeys(deckKeys(d));
    return '<div class="card' + (d.hidden ? ' hid' : '') + '"><div class="no">' + two(i + 1) + '</div>' +
      '<div class="chap">' + (d.hidden ? 'Sheet ẩn · ' : 'Sheet · ') + esc(d.sheet) + '</div><h3>' + esc(d.name) + '</h3><p>' + esc(d.desc) + '</p>' +
      bar3(c) +
      '<div class="cardfoot"><span><b>' + d.count + '</b> thẻ · ' + d.sets.length + ' phần' + (c.due ? ' · <b>' + c.due + '</b> cần ôn' : '') + '</span><a class="btn" href="#/d/' + d.id + '">Mở bộ từ</a></div></div>';
  }
  function pageHome() {
    var main = V.index.filter(function (d) { return !d.hidden; }), extra = V.index.filter(function (d) { return d.hidden; });
    var c = countKeys(allKeys()), s = streak(), t = P.days[today()] || 0, last = P.opt.last;
    var lastLink = last && deckMeta(last.d) ? '#/s/' + last.d + '/' + last.s + '/flash' : '#/d/v30';
    var h = '<section class="hero">' + petals() + '<div class="wrap"><div><span class="chip">Digital SAT · Từ vựng</span>' +
      '<h1>Từ vựng<br><em>SAT</em></h1>' +
      '<p class="lead">Toàn bộ ' + V.index.reduce(function (n, d) { return n + d.count; }, 0).toLocaleString('vi-VN') + ' thẻ (' + c.total.toLocaleString('vi-VN') + ' từ khác nhau) trong bảng SAT Vocabulary, chia đúng theo từng sheet và từng buổi. Học bằng thẻ ghi nhớ, chế độ Học tự lặp lại từ sai, bài kiểm tra tự chấm, trò ghép thẻ – và ôn lại từ cũ đúng lúc sắp quên.</p>' +
      '<div class="hero-cta"><a class="btn" href="' + lastLink + '">' + (last ? 'Học tiếp' : 'Bắt đầu học') + '</a><a class="btn ghost" href="#/review">Ôn từ cũ' + (c.due ? ' (' + c.due + ')' : '') + '</a></div></div>' +
      '<div class="pixcard"><div class="pixpanel"><div class="streakpanel">' + flameSVG('flame' + (s ? '' : ' off')) + '<b>' + s + '</b><small>ngày học liên tiếp</small>' + weekStrip() + '</div></div>' +
      '<div class="pixcap">Kỷ lục ' + Math.max(P.best, s) + ' ngày · mục tiêu ' + P.goal + ' thẻ/ngày</div>' +
      '<div class="stats"><div class="stat"><b>' + c.known + '</b><span>Đã biết</span></div><div class="stat"><b>' + c.learning + '</b><span>Đang học</span></div><div class="stat"><b>' + c.due + '</b><span>Cần ôn</span></div></div></div>' +
      '</div></section>';

    h += '<section class="cream"><div class="wrap">' +
      '<div class="todaygrid"><div class="panel goal"><h3>Hôm nay</h3><p>' +
      (t >= P.goal ? 'Đã đạt mục tiêu hôm nay. Tuyệt vời! Học thêm để nhớ lâu hơn.' : t ? 'Còn ' + (P.goal - t) + ' thẻ nữa là đạt mục tiêu hôm nay.' : (s ? 'Học ít nhất 1 thẻ hôm nay để giữ chuỗi ' + s + ' ngày.' : 'Học ít nhất 1 thẻ mỗi ngày để tạo chuỗi ngày học.')) + '</p>' +
      '<div class="bar"><i style="width:' + Math.min(100, pct(t, P.goal)) + '%"></i></div><div class="barlabel"><span><b>' + t + '</b> / ' + P.goal + ' thẻ hôm nay</span><span>Đã biết <b>' + c.known + '</b> / ' + c.total + ' từ (' + pct(c.known, c.total) + '%)</span></div>' +
      '<div class="rowbtns"><a class="btn" href="#/review">' + (c.due ? 'Ôn ' + c.due + ' từ đến hạn' : 'Tạo bài kiểm tra từ cũ') + '</a><a class="btn dark" href="' + lastLink + '">' + (last ? 'Học tiếp' : 'Bắt đầu') + '</a></div>' +
      '<div class="tools"><button class="link" data-act="goal">Mục tiêu: ' + P.goal + ' thẻ/ngày</button><button class="link" data-act="export">Sao lưu tiến độ</button><button class="link" data-act="import">Khôi phục</button></div></div>' +
      '<div class="mini"><div><b>' + s + '</b><span>Chuỗi ngày</span></div><div><b>' + Math.max(P.best, s) + '</b><span>Kỷ lục chuỗi</span></div><div><b>' + c.known + '</b><span>Từ đã biết</span></div><div><b>' + Object.keys(P.days).length + '</b><span>Ngày đã học</span></div></div></div>';

    h += '<h2 class="sec-title" id="bo-tu" style="margin-top:34px">Bộ từ vựng</h2><p class="sec-sub">Chia giống các sheet trong bảng tính. Mỗi bộ chia theo buổi / chủ đề; cùng một từ xuất hiện ở nhiều bộ thì dùng chung tiến độ.</p>' +
      '<div class="search"><input id="gsearch" type="search" placeholder="Tìm từ hoặc nghĩa trong tất cả các bộ…" autocomplete="off" value="' + esc(P.opt.q || '') + '"></div><div class="searchres" id="gres"></div>' +
      '<div class="grid">' + main.map(deckCard).join('') + '</div>';
    if (extra.length) {
      h += '<div class="phan"><h3 class="phan-title">Kho mở rộng · sheet ẩn</h3><p class="sec-sub">Các sheet đang ẩn trong bảng tính (bản cũ và kho tổng hợp). Đưa vào đầy đủ để không sót từ nào.</p>' +
        '<div class="grid">' + extra.map(function (d, i) { return deckCard(d, main.length + i); }).join('') + '</div></div>';
    }
    h += '</div></section>' +
      '<section class="pinkband"><div class="wrap"><h2 class="sec-title">4 cách học mỗi bộ</h2><p class="sec-sub">Giống Quizlet, tiến độ lưu ngay trên trình duyệt này.</p><div class="scoregrid four">' +
      '<div class="score"><b>01</b><h4>Thẻ ghi nhớ</h4><p>Lật thẻ, nghe phát âm, phân loại Đã biết / Chưa biết. Phím Space, ← →, 1, 2.</p></div>' +
      '<div class="score"><b>02</b><h4>Học</h4><p>Trắc nghiệm rồi tự gõ từ. Sai sẽ hỏi lại cho tới khi thuộc.</p></div>' +
      '<div class="score"><b>03</b><h4>Kiểm tra</h4><p>Trắc nghiệm, đúng/sai, tự luận; chấm điểm và xem lại câu sai.</p></div>' +
      '<div class="score"><b>04</b><h4>Ghép thẻ</h4><p>Ghép từ với nghĩa nhanh nhất có thể, lưu kỷ lục thời gian.</p></div>' +
      '</div></div></section>';
    show(h);
    if (P.opt.q) doSearch(P.opt.q);
  }
  function petals() {
    var h = '<div class="petals" aria-hidden="true">';
    for (var i = 0; i < 16; i++) h += '<i style="--x:' + ((i * 37 + 3) % 97) + '%;--s:' + (6 + (i * 5) % 9) + 'px;--d:' + (9 + (i * 7) % 8) + 's;--l:-' + (i * 3 % 12) + 's;--dx:' + ((i % 2 ? 1 : -1) * (30 + (i * 11) % 50)) + 'px"></i>';
    return h + '</div>';
  }

  // Tìm kiếm toàn bộ
  var searchTimer = null;
  function doSearch(q) {
    var box = $('#gres'); if (!box) return;
    P.opt.q = q; saveP();
    var nq = q.trim().toLowerCase();
    if (nq.length < 2) { box.innerHTML = ''; return; }
    box.innerHTML = '<p class="muted">Đang tìm…</p>';
    loadDecks(V.index.map(function (d) { return d.id; })).then(function () {
      if (($('#gsearch') || {}).value !== q) return;
      var res = [], seen = {};
      V.index.forEach(function (d) {
        V.decks[d.id].cards.forEach(function (c) {
          var hit = c.t.toLowerCase().indexOf(nq) >= 0 || (c.d || '').toLowerCase().indexOf(nq) >= 0 || (c.de || '').toLowerCase().indexOf(nq) >= 0;
          if (hit && res.length < 60) { var id = c.deck + '|' + c.t + '|' + c.d; if (!seen[id]) { seen[id] = 1; res.push(c); } }
        });
      });
      res.sort(function (a, b) { var x = a.t.toLowerCase().indexOf(nq) === 0 ? 0 : 1, y = b.t.toLowerCase().indexOf(nq) === 0 ? 0 : 1; return x - y; });
      box.innerHTML = res.length ? '<p class="muted" style="margin:0 0 10px">' + (res.length >= 60 ? 'Hơn 60' : res.length) + ' kết quả</p><div class="wl">' + res.map(function (c) { return wordItem(c, true); }).join('') + '</div>'
        : '<div class="empty">Không thấy từ nào khớp “' + esc(q) + '”.</div>';
    }).catch(function () { box.innerHTML = '<div class="empty">Không tải được dữ liệu, hãy thử lại.</div>'; });
  }

  // ---------- Trang bộ từ ----------
  function pageDeck(id) {
    var d = deckMeta(id), c = countKeys(deckKeys(d));
    var h = '<section class="vhead"><div class="wrap"><div class="crumbs"><a href="#/">Từ vựng SAT</a><span>/</span>' + (d.hidden ? 'Sheet ẩn' : 'Sheet') + ': ' + esc(d.sheet) + '</div>' +
      '<h1>' + esc(d.name) + '</h1><p>' + esc(d.desc) + ' · ' + d.count + ' thẻ, ' + d.sets.length + ' phần.</p>' + bar3(c) +
      '<div class="vtabs"><a class="vtab" href="#/s/' + id + '/all/flash">Thẻ cả bộ</a><a class="vtab" href="#/s/' + id + '/all/learn">Học cả bộ</a><a class="vtab" href="#/s/' + id + '/all/test">Kiểm tra cả bộ</a><a class="vtab" href="#/s/' + id + '/all/list">Danh sách đầy đủ</a></div>' +
      '</div></section><section class="cream"><div class="wrap"><h2 class="sec-title">' + (d.kind === 'word' && /Buổi/.test(d.sets[0].n) ? 'Chọn buổi' : 'Chọn phần') + '</h2>' +
      '<p class="sec-sub">Ô tô hồng là phần đã biết hết. Số trong ngoặc là số từ cần ôn.</p><div class="setgrid">';
    d.sets.forEach(function (s, i) {
      var cc = countKeys(s.k), done = cc.known === cc.total;
      var m = /^(Buổi|Phần)\s+(\d+)$/.exec(s.n);
      h += '<a class="settile' + (done ? ' done' : '') + '" href="#/s/' + id + '/' + i + '/flash"><span class="num">' + (m ? two(+m[2]) : two(i + 1)) + '</span><b>' + esc(s.n) + '</b>' +
        '<small>' + s.k.length + ' thẻ · ' + cc.known + ' đã biết' + (cc.due ? ' (' + cc.due + ')' : '') + '</small><div class="bar tri thin"><i class="k" style="width:' + pct(cc.known, cc.total) + '%"></i><i class="l" style="width:' + pct(cc.learning, cc.total) + '%"></i></div></a>';
    });
    show(h + '</div></div></section>');
  }

  // ---------- Trang học một phần ----------
  var MODES = [['flash', 'Thẻ ghi nhớ'], ['learn', 'Học'], ['test', 'Kiểm tra'], ['match', 'Ghép thẻ'], ['list', 'Danh sách']];
  function pageSet(id, setId, mode) {
    var d = deckMeta(id), all = setId === 'all', si = all ? -1 : +setId;
    if (!all && !(si >= 0 && si < d.sets.length)) return go('#/d/' + id);
    loading();
    loadDeck(id).then(function (deck) {
      var cards = all ? deck.cards : deck.sets[si].c;
      if (!all) { P.opt.last = { d: id, s: si }; saveP(); }
      var ctx = { cards: cards, pool: deck.cards, title: all ? 'Cả bộ' : d.sets[si].n, sub: d.name, base: '#/s/' + id + '/' + setId, kind: d.kind,
        crumbs: '<a href="#/">Từ vựng SAT</a><span>/</span><a href="#/d/' + id + '">' + esc(d.name) + '</a>', matchKey: id + '/' + setId,
        next: !all && si + 1 < d.sets.length ? '#/s/' + id + '/' + (si + 1) + '/' + mode : null, nextName: !all && si + 1 < d.sets.length ? d.sets[si + 1].n : '' };
      renderStudy(ctx, mode);
    }).catch(function (e) { show('<section class="cream"><div class="wrap"><div class="empty">' + esc(e.message) + '. Kiểm tra mạng rồi tải lại trang.</div></div></section>'); });
  }
  function pageCustom(mode) { renderStudy(CUSTOM, mode); }
  function renderStudy(ctx, mode) {
    if (!MODES.some(function (m) { return m[0] === mode; })) mode = 'flash';
    var c = countKeys(ctx.cards.map(function (x) { return x.k; }));
    var h = '<section class="vhead"><div class="wrap"><div class="crumbs">' + ctx.crumbs + '</div><h1>' + esc(ctx.title) + '</h1>' +
      '<p>' + esc(ctx.sub) + ' · ' + ctx.cards.length + ' thẻ</p>' + bar3(c) + '<div class="vtabs">';
    MODES.forEach(function (m) { h += '<a class="vtab' + (m[0] === mode ? ' on' : '') + '" href="' + ctx.base + '/' + m[0] + '">' + m[1] + '</a>'; });
    h += '</div></div></section><section><div class="wrap study" id="study"></div></section>';
    if (mode === 'flash') h += '<section><div class="wrap study" style="padding-top:0" id="listbelow"></div></section>';
    show(h);
    view = { ctx: ctx, mode: mode };
    ({ flash: Flash, learn: Learn, test: TestMode, match: Match, list: List })[mode].start(ctx);
  }

  // ---------- Hiển thị một thẻ ----------
  function frontHTML(c) {
    var long = c.t.length > 26;
    return '<div class="fc-term' + (long ? ' long' : '') + '">' + esc(c.t) + '</div>' +
      '<div class="fc-sub">' + (c.p ? '<span class="pos">' + esc(c.p) + '</span> ' : '') + (c.i ? '<span class="ipa">' + esc(c.i) + '</span> ' : '') + (c.f ? '<span class="cefr">' + esc(c.f) + '</span>' : '') + '</div>' +
      (c.g ? '<div class="fc-sub">' + esc(c.g) + '</div>' : '');
  }
  function defText(c) { return c.d || c.de || ''; }
  function backHTML(c) {
    var d = defText(c), h = '<div class="fc-def' + (d.length > 90 ? ' long' : '') + '">' + rich(d) + '</div>';
    if (c.de && c.d !== c.de) h += '<div class="fc-sub">' + rich(c.de) + '</div>';
    if (c.e || c.ev) h += '<div class="fc-ex">' + (c.e ? '<p>' + rich(c.e) + '</p>' : '') + (c.ev ? '<p class="vi">' + rich(c.ev) + '</p>' : '') + '</div>';
    if (c.x) h += '<div class="fc-ex"><p>' + rich(c.x) + '</p></div>';
    if (c.mv) h += '<details class="mn"><summary>Mẹo nhớ</summary><p>' + rich(c.mv) + '</p></details>';
    if (c.me) h += '<details class="mn"><summary>Mnemonic (English)</summary><p>' + rich(c.me) + '</p></details>';
    return h;
  }
  function wordItem(c, showDeck) {
    var st = status(c.k), dm = deckMeta(c.deck);
    return '<div class="wi"><div class="w"><div class="row"><i class="dot ' + st + '" title="' + ({ new: 'Chưa học', learning: 'Đang học', known: 'Đã biết' })[st] + '"></i><b>' + esc(c.t) + '</b></div>' +
      '<div class="row">' + (c.p ? '<span class="pos">' + esc(c.p) + '</span>' : '') + (c.f ? '<span class="cefr">' + esc(c.f) + '</span>' : '') + (c.i ? '<span class="ipa">' + esc(c.i) + '</span>' : '') + '</div>' +
      '<div class="row">' + (canSpeakTerm(c) ? sayBtn(c.t) : '') + starBtn(c.k) + '</div>' +
      (showDeck ? '<a class="grp" href="#/s/' + c.deck + '/' + c.set + '/flash">' + esc(dm.name) + ' · ' + esc(dm.sets[c.set].n) + '</a>' : (c.g ? '<span class="grp">' + esc(c.g) + '</span>' : '')) + '</div>' +
      '<div class="m"><div class="def">' + rich(defText(c)) + '</div>' + (c.de && c.d !== c.de ? '<div class="defen">' + rich(c.de) + '</div>' : '') +
      (c.e ? '<p>' + rich(c.e) + '</p>' : '') + (c.ev ? '<p class="vi">' + rich(c.ev) + '</p>' : '') + (c.x ? '<p class="x">' + rich(c.x) + '</p>' : '') +
      (c.mv ? '<details class="mn"><summary>Mẹo nhớ</summary><p>' + rich(c.mv) + '</p></details>' : '') +
      (c.me ? '<details class="mn"><summary>Mnemonic (English)</summary><p>' + rich(c.me) + '</p></details>' : '') + '</div></div>';
  }

  // ---------- Chế độ: Thẻ ghi nhớ ----------
  var Flash = {
    start: function (ctx) {
      var o = P.opt.flash || (P.opt.flash = { shuffle: false, back: false, star: false, unk: false });
      var cards = ctx.cards.filter(function (c) {
        if (o.star && !isStar(c.k)) return false;
        if (o.unk && status(c.k) === 'known') return false;
        return true;
      });
      this.ctx = ctx; this.o = o; this.cards = o.shuffle ? shuffle(cards) : cards;
      this.i = 0; this.flip = false; this.yes = 0; this.no = 0; this.miss = []; this.empty = !cards.length;
      this.render();
      List.render($('#listbelow'), ctx, true);
    },
    opts: function () {
      var o = this.o, t = function (k, label) { return '<button class="tg' + (o[k] ? ' on' : '') + '" data-act="fopt" data-k="' + k + '">' + label + '</button>'; };
      return '<div class="opts-row">' + t('shuffle', 'Trộn thẻ') + t('back', 'Mặt trước: nghĩa') + t('unk', 'Bỏ thẻ đã biết') + t('star', 'Chỉ thẻ ★') + '</div>';
    },
    render: function () {
      var box = $('#study'); if (!box) return;
      var self = this, n = this.cards.length;
      if (this.empty) {
        box.innerHTML = '<div class="fc-top"><div class="cnt"><span>0 thẻ</span></div>' + this.opts() + '</div><div class="empty">' +
          (this.o.star ? 'Chưa có thẻ nào gắn sao trong phần này. Bấm ☆ ở danh sách bên dưới để gắn sao.' : 'Bạn đã biết hết các thẻ trong phần này! Tắt “Bỏ thẻ đã biết” để xem lại tất cả.') + '</div>';
        return;
      }
      if (this.i >= n) return this.end();
      var c = this.cards[this.i], front = this.o.back ? '<div class="fc-def">' + rich(defText(c)) + '</div>' : frontHTML(c), back = this.o.back ? frontHTML(c) + backHTML(c).replace(/^<div class="fc-def[^"]*">[\s\S]*?<\/div>/, '') : backHTML(c);
      box.innerHTML = '<div class="fc-top"><div class="cnt"><span class="u" title="Chưa biết">' + this.no + '</span><span>' + (this.i + 1) + ' / ' + n + '</span><span class="k" title="Đã biết">' + this.yes + '</span></div>' + this.opts() + '</div>' +
        '<div class="fc' + (this.flip ? ' flip' : '') + '" id="fc" tabindex="0" role="button" aria-label="Lật thẻ"><div class="fc-in">' +
        '<div class="fc-face front"><div class="fc-bar"><span>' + (this.o.back ? 'Nghĩa' : 'Thuật ngữ') + '</span><span>' + (canSpeakTerm(c) ? sayBtn(c.t) : '') + starBtn(c.k) + '</span></div><div class="fc-body">' + front + '</div><div class="fc-hint">Bấm để lật</div></div>' +
        '<div class="fc-face back"><div class="fc-bar"><span>' + (this.o.back ? 'Thuật ngữ' : 'Định nghĩa') + '</span><span>' + (canSpeakTerm(c) ? sayBtn(c.t) : '') + starBtn(c.k) + '</span></div><div class="fc-body">' + back + '</div></div>' +
        '</div></div>' +
        '<div class="fc-ctl"><button class="btn no-btn" data-act="fno">✗ Chưa biết</button><div class="mid"><button class="sq" data-act="fprev" ' + (this.i ? '' : 'disabled') + ' aria-label="Thẻ trước">◀</button><button class="sq flipb" data-act="fflip">Lật</button><button class="sq" data-act="fnext" aria-label="Thẻ sau">▶</button></div><button class="btn yes-btn" data-act="fyes">✓ Đã biết</button></div>' +
        '<div class="progress"><div class="bar thin"><i style="width:' + pct(this.i, n) + '%"></i></div></div>' +
        '<p class="keys"><kbd>Space</kbd> lật · <kbd>←</kbd> <kbd>→</kbd> chuyển thẻ · <kbd>1</kbd> chưa biết · <kbd>2</kbd> đã biết · vuốt thẻ trái/phải trên điện thoại</p>';
      var fc = $('#fc'), x0 = null, y0 = 0;
      fc.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
      fc.addEventListener('touchend', function (e) {
        if (x0 === null) return;
        var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
        if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) { e.preventDefault(); self.mark(dx > 0); }
      });
    },
    toggle: function () { this.flip = !this.flip; var f = $('#fc'); if (f) f.classList.toggle('flip', this.flip); },
    mark: function (known) {
      if (this.i >= this.cards.length) return;
      var c = this.cards[this.i];
      rate(c, known);
      if (known) this.yes++; else { this.no++; this.miss.push(c); }
      this.i++; this.flip = false; this.render();
    },
    move: function (d) { var j = this.i + d; if (j < 0 || j > this.cards.length) return; this.i = j; this.flip = false; this.render(); },
    end: function () {
      var box = $('#study'), ctx = this.ctx;
      box.innerHTML = '<div class="panel endcard"><span class="chip dark">Hết vòng</span><h3>' + (this.no ? 'Còn ' + this.no + ' thẻ chưa biết' : 'Bạn đã biết hết!') + '</h3>' +
        '<div class="big">' + this.yes + '<small> / ' + this.cards.length + '</small></div><p class="muted">thẻ đã biết trong vòng này</p><div class="rowbtns">' +
        (this.no ? '<button class="btn" data-act="fagain">Học lại ' + this.no + ' thẻ chưa biết</button>' : '') +
        '<button class="btn dark" data-act="frestart">Học lại từ đầu</button><a class="btn" href="' + ctx.base + '/learn">Chế độ Học</a><a class="btn" href="' + ctx.base + '/test">Kiểm tra</a>' +
        (ctx.next ? '<a class="btn dark" href="' + ctx.next + '">Tiếp: ' + esc(ctx.nextName) + '</a>' : '') + '</div></div>';
    },
    again: function () { this.cards = this.o.shuffle ? shuffle(this.miss) : this.miss; this.i = 0; this.yes = 0; this.no = 0; this.miss = []; this.flip = false; this.render(); },
    key: function (e) {
      if (e.key === ' ' || e.key === 'Enter') { if (this.i < this.cards.length && !this.empty) { e.preventDefault(); this.toggle(); } }
      else if (e.key === 'ArrowRight') this.move(1);
      else if (e.key === 'ArrowLeft') this.move(-1);
      else if (e.key === '1') this.mark(false);
      else if (e.key === '2') this.mark(true);
    }
  };

  // ---------- Câu hỏi dùng chung (Học, Kiểm tra) ----------
  function canWrite(c) { return c.kind === 'word' || c.kind === 'archaic'; }
  function distractors(c, field, pool, n) {
    var want = isVi(c[field]), self = (c[field] || '').toLowerCase(), out = [], seen = {}, ct = c.t.toLowerCase();
    seen[self] = 1;
    var pick = function (list) {
      for (var i = 0; i < list.length && out.length < n; i++) {
        var x = list[i], v = x[field] || '', lv = v.toLowerCase();
        if (!v || seen[lv] || x.t.toLowerCase() === ct) continue;
        if (field !== 't' && isVi(v) !== want) continue;
        seen[lv] = 1; out.push(x);
      }
    };
    var same = pool.filter(function (x) { return x.deck === c.deck && x.set === c.set; });
    pick(shuffle(same)); pick(shuffle(pool));
    return out;
  }
  // dir 'td': hỏi thuật ngữ → chọn nghĩa;  'dt': hỏi nghĩa → chọn thuật ngữ
  function makeQ(c, type, dir, pool) {
    var ask = dir === 'td' ? 't' : 'd', ansF = dir === 'td' ? 'd' : 't';
    if (!c.d) { ask = 't'; ansF = 'de'; }
    var q = { c: c, type: type, dir: dir, ask: ask, ansF: ansF };
    if (type === 'mc') {
      var ds = distractors(c, ansF, pool, 3);
      q.opts = shuffle([c].concat(ds)).map(function (x) { return x[ansF]; });
      q.correct = q.opts.indexOf(c[ansF]);
    } else if (type === 'tf') {
      var truth = Math.random() < .5, other = truth ? null : distractors(c, ansF, pool, 1)[0];
      if (!other) truth = true;
      q.truth = truth; q.shown = truth ? c[ansF] : other[ansF];
    } else if (type === 'wr') { q.ask = c.d ? 'd' : 'de'; q.ansF = 't'; }
    return q;
  }
  function promptHTML(q) {
    var v = q.c[q.ask], isTerm = q.ask === 't';
    return '<div class="qprompt"><small>' + (isTerm ? 'Thuật ngữ' : 'Định nghĩa') + '</small>' + (isTerm ? esc(v) + (q.c.p ? ' <span class="pos">' + esc(q.c.p) + '</span>' : '') : rich(v)) + '</div>';
  }
  function checkWritten(q, val) { return !!variants(q.c.t)[norm(val)]; }

  // ---------- Chế độ: Học ----------
  var Learn = {
    start: function (ctx) {
      this.ctx = ctx;
      var cards = ctx.cards.filter(function (c) { return status(c.k) !== 'known'; });
      this.reviewAll = !cards.length;
      if (!cards.length) cards = ctx.cards.slice();
      this.total = cards.length; this.done = 0;
      this.queue = shuffle(cards).map(function (c) { return { c: c, stage: 0 }; });
      this.render();
    },
    render: function () {
      var box = $('#study'); if (!box) return;
      if (!this.queue.length) {
        box.innerHTML = '<div class="panel endcard"><span class="chip dark">Hoàn thành</span><h3>Đã thuộc ' + this.total + ' thẻ!</h3><p class="muted">Mỗi thẻ đã trả lời đúng 2 lần liên tiếp. Các thẻ sẽ tự xuất hiện lại ở mục “Ôn từ cũ” khi tới hạn.</p><div class="rowbtns">' +
          '<button class="btn dark" data-act="lrestart">Học lại</button><a class="btn" href="' + this.ctx.base + '/test">Làm bài kiểm tra</a>' + (this.ctx.next ? '<a class="btn dark" href="' + this.ctx.next + '">Tiếp: ' + esc(this.ctx.nextName) + '</a>' : '') + '</div></div>';
        return;
      }
      var it = this.queue[0], c = it.c, type = it.stage === 1 && canWrite(c) ? 'wr' : 'mc';
      var dir = it.stage === 0 ? 'td' : 'dt';
      this.q = makeQ(c, type, dir, this.ctx.pool); this.answered = false;
      var q = this.q, h = '<div class="fc-top"><div class="cnt"><span>' + (this.reviewAll ? 'Ôn lại' : 'Đã thuộc') + ' ' + this.done + ' / ' + this.total + '</span></div><span class="muted" style="font-size:.85rem">Đúng 2 lần là thuộc · sai sẽ hỏi lại</span></div>' +
        '<div class="progress" style="margin:0 0 16px"><div class="bar thin"><i style="width:' + pct(this.done, this.total) + '%"></i></div></div>' +
        '<div class="lq"><div class="lq-k"><span>' + (type === 'wr' ? 'Gõ thuật ngữ' : q.ask === 't' ? 'Chọn định nghĩa đúng' : 'Chọn thuật ngữ đúng') + (it.stage ? ' · lần 2' : '') + '</span><span>' + (q.ask === 't' && canSpeakTerm(c) ? sayBtn(c.t) : '') + starBtn(c.k) + '</span></div>' +
        '<div class="lq-p' + (q.ask === 't' ? '' : ' def') + '">' + (q.ask === 't' ? esc(c.t) + (c.p ? ' <span class="pos">' + esc(c.p) + '</span>' : '') : rich(c[q.ask])) + '</div>';
      if (type === 'mc') {
        h += '<div class="opts">' + q.opts.map(function (o, i) { return '<button class="opt" data-act="lpick" data-i="' + i + '"><b>' + (i + 1) + '</b><span>' + rich(o) + '</span></button>'; }).join('') + '</div>';
      } else {
        h += '<form class="write" data-act="lwrite"><input id="lin" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Gõ từ tiếng Anh…"><button class="btn" type="submit">Kiểm tra</button><button class="link" type="button" data-act="lskip" style="color:var(--burg-700)">Không biết</button></form>';
      }
      box.innerHTML = h + '<div id="lfb"></div></div><p class="keys">' + (type === 'mc' ? '<kbd>1</kbd>–<kbd>4</kbd> chọn đáp án · ' : '') + '<kbd>Enter</kbd> tiếp tục</p>';
      var inp = $('#lin'); if (inp) inp.focus();
    },
    answer: function (ok, given) {
      if (this.answered) return;
      this.answered = true;
      var it = this.queue[0], q = this.q, c = it.c;
      record(c, ok);
      $$('#study .opt').forEach(function (b, i) { b.disabled = true; if (i === q.correct) b.classList.add('right'); else if (+b.dataset.i === given && !ok) b.classList.add('wrong'); });
      var inp = $('#lin'); if (inp) { inp.disabled = true; inp.classList.add(ok ? 'right' : 'wrong'); }
      $$('#study .write button').forEach(function (b) { b.disabled = true; });
      var fb = $('#lfb'), ansText = q.type === 'wr' || q.ansF === 't' ? esc(c.t) : rich(c[q.ansF]);
      fb.innerHTML = '<div class="fb ' + (ok ? 'ok' : 'bad') + '"><div><b>' + (ok ? 'Chính xác!' : 'Chưa đúng.') + '</b>' + (ok ? '' : ' <span class="ans">Đáp án: ' + ansText + '</span>') + '</div><div class="rowbtns" style="margin:0">' +
        (!ok && q.type === 'wr' && inp && inp.value.trim() ? '<button class="link" data-act="loverride" style="color:var(--burg-700)">Tôi đã đúng</button>' : '') +
        '<button class="btn" data-act="lnext" id="lnext">Tiếp tục</button></div></div>';
      this.lastOk = ok;
      if (ok) { it.stage++; } else { it.stage = 0; }
      var nb = $('#lnext'); if (nb) nb.focus();
      if (ok && q.type === 'mc') { var self = this, ref = it; this.auto = setTimeout(function () { if (self.queue[0] === ref && self.answered) self.next(); }, 900); }
    },
    override: function () {
      var it = this.queue[0], e = entry(it.c.k);
      e.w = Math.max(0, e.w - 1); e.r++; e.b = Math.max(e.b, 2); e.du = Date.now() + INTERVAL[e.b] * DAY; saveP();
      it.stage = 2; this.lastOk = true; this.next();
    },
    next: function () {
      clearTimeout(this.auto);
      var it = this.queue.shift();
      if (it.stage >= 2) this.done++;
      else this.queue.splice(Math.min(this.queue.length, this.lastOk ? 2 + Math.floor(Math.random() * 3) : 3), 0, it);
      this.render();
    },
    key: function (e) {
      if (this.answered && e.key === 'Enter') { e.preventDefault(); this.next(); return; }
      if (!this.answered && this.q && this.q.type === 'mc' && /^[1-4]$/.test(e.key)) { var i = +e.key - 1; if (i < this.q.opts.length) this.answer(i === this.q.correct, i); }
    }
  };

  // ---------- Bài kiểm tra (dùng cho từng phần và ôn từ cũ) ----------
  function testConfig() { return P.opt.test || (P.opt.test = { n: 20, types: { mc: 1, tf: 1, wr: 1 }, dir: 'mix' }); }
  function cfgHTML(cfg, total, extra) {
    var tg = function (act, v, on, label) { return '<button class="tg' + (on ? ' on' : '') + '" data-act="' + act + '" data-v="' + v + '">' + label + '</button>'; };
    var h = '<div class="cfg"><div><h4>Số câu</h4><div class="opts-row">';
    [10, 20, 30, 50, 0].forEach(function (n) { if (n && n >= total + 10) return; h += tg('tn', n, cfg.n === n, n ? n + ' câu' : 'Tất cả (' + total + ')'); });
    h += '</div></div><div><h4>Dạng câu hỏi</h4><div class="opts-row">' + tg('tt', 'mc', cfg.types.mc, 'Trắc nghiệm') + tg('tt', 'tf', cfg.types.tf, 'Đúng / Sai') + tg('tt', 'wr', cfg.types.wr, 'Tự luận (gõ từ)') + '</div></div>' +
      '<div><h4>Hỏi bằng</h4><div class="opts-row">' + tg('td', 'td', cfg.dir === 'td', 'Thuật ngữ → nghĩa') + tg('td', 'dt', cfg.dir === 'dt', 'Nghĩa → thuật ngữ') + tg('td', 'mix', cfg.dir === 'mix', 'Trộn cả hai') + '</div></div>' +
      (extra || '') + '</div>';
    return h;
  }
  function buildTest(cards, pool, cfg) {
    var pickN = cfg.n && cfg.n < cards.length ? cfg.n : cards.length, chosen = shuffle(cards).slice(0, pickN);
    var types = Object.keys(cfg.types).filter(function (k) { return cfg.types[k]; }); if (!types.length) types = ['mc'];
    var qs = chosen.map(function (c, i) {
      var t = types[i % types.length]; if (t === 'wr' && !canWrite(c)) t = 'mc';
      var dir = cfg.dir === 'mix' ? (Math.random() < .5 ? 'td' : 'dt') : cfg.dir;
      return makeQ(c, t, dir, pool);
    });
    var order = { mc: 0, tf: 1, wr: 2 };
    qs.sort(function (a, b) { return order[a.type] - order[b.type]; });
    return { qs: qs, ans: [], done: false };
  }
  var TL = ['A', 'B', 'C', 'D'];
  function testQHTML(q, i, a, done) {
    var c = q.c, ok = done ? qRight(q, a) : null;
    var h = '<article class="q" id="tq' + i + '"><div class="qhead"><span class="qnum">Câu ' + (i + 1) + '</span><span class="muted" style="font-size:.78rem;font-weight:700">' + ({ mc: 'Trắc nghiệm', tf: 'Đúng / Sai', wr: 'Tự luận' })[q.type] + '</span>' +
      (done ? '<span class="badge ' + (ok ? 'ok' : a == null || a === '' ? 'skip' : 'bad') + '">' + (ok ? 'Đúng' : a == null || a === '' ? 'Chưa làm' : 'Sai') + '</span>' : '') + '</div>';
    if (q.type === 'mc') {
      h += promptHTML(q) + '<div class="opts" style="margin-top:12px">' + q.opts.map(function (o, j) {
        var cls = done ? (j === q.correct ? ' right' : j === a ? ' wrong' : '') : (j === a ? ' sel' : '');
        return '<button class="opt' + cls + '" data-act="tpick" data-q="' + i + '" data-i="' + j + '"' + (done ? ' disabled' : '') + '><b>' + TL[j] + '</b><span>' + (q.ansF === 't' ? esc(o) : rich(o)) + '</span></button>';
      }).join('') + '</div>';
    } else if (q.type === 'tf') {
      h += '<div class="tfpair"><div><small class="muted" style="font-weight:800;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase">' + (q.ask === 't' ? 'Thuật ngữ' : 'Định nghĩa') + '</small><br>' + (q.ask === 't' ? '<b>' + esc(c.t) + '</b>' : rich(c[q.ask])) + '</div>' +
        '<div><small class="muted" style="font-weight:800;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase">' + (q.ansF === 't' ? 'Thuật ngữ' : 'Định nghĩa') + '</small><br>' + (q.ansF === 't' ? '<b>' + esc(q.shown) + '</b>' : rich(q.shown)) + '</div></div>' +
        '<div class="tfbtns">' + [[true, 'Đúng'], [false, 'Sai']].map(function (v) {
          var cls = done ? (v[0] === q.truth ? ' right' : v[0] === a ? ' wrong' : '') : (v[0] === a ? ' sel' : '');
          return '<button class="tfb' + cls + '" data-act="ttf" data-q="' + i + '" data-v="' + (v[0] ? 1 : 0) + '"' + (done ? ' disabled' : '') + '>' + v[1] + '</button>';
        }).join('') + '</div>';
      if (done && !q.truth) h += '<div class="explain"><b>Nghĩa đúng</b>' + (q.ansF === 't' ? esc(c.t) : rich(c[q.ansF])) + '</div>';
    } else {
      h += promptHTML(q) + '<div class="short" style="margin-top:12px"><input data-act="twr" data-q="' + i + '" value="' + esc(a || '') + '" placeholder="Gõ thuật ngữ…" autocomplete="off" autocapitalize="off" spellcheck="false"' + (done ? ' disabled' : '') + '>' +
        (done && !ok ? '<span class="keyline">Đáp án: ' + esc(c.t) + '</span>' : '') + '</div>';
    }
    if (done) h += '<div class="explain"><b>' + esc(c.t) + (c.p ? ' · ' + esc(c.p) : '') + '</b>' + rich(defText(c)) + (c.e ? '<div style="margin-top:4px">' + rich(c.e) + '</div>' : '') + '</div>';
    return h + '</article>';
  }
  function qRight(q, a) {
    if (q.type === 'mc') return a === q.correct;
    if (q.type === 'tf') return a === q.truth;
    return a != null && checkWritten(q, a);
  }
  function answeredCount(T) { var n = 0; T.qs.forEach(function (q, i) { var a = T.ans[i]; if (a != null && a !== '') n++; }); return n; }
  function renderTest(box, T, ctx) {
    var h = '';
    if (T.done) {
      var right = 0; T.qs.forEach(function (q, i) { if (qRight(q, T.ans[i])) right++; });
      h += '<div class="resultband" style="margin:0 -16px 10px;padding:28px 16px"><div class="wrap" style="padding:0"><div class="big">' + right + '<small> / ' + T.qs.length + '</small></div><div><div style="font-weight:900;text-transform:uppercase">' + (pct(right, T.qs.length) >= 80 ? 'Rất tốt!' : pct(right, T.qs.length) >= 50 ? 'Khá ổn, ôn thêm nhé' : 'Cần ôn lại') + ' · ' + pct(right, T.qs.length) + '%</div>' +
        '<ul class="parts"><li>Đúng <b>' + right + '</b></li><li>Sai/bỏ <b>' + (T.qs.length - right) + '</b></li></ul><div class="rbtns">' +
        (right < T.qs.length ? '<button class="btn" data-act="twrong">Học lại câu sai</button>' : '') + '<button class="btn ghost" data-act="tnew">Làm bài mới</button></div></div></div></div>';
    }
    T.qs.forEach(function (q, i) { h += testQHTML(q, i, T.ans[i], T.done); });
    if (!T.done) h += '<div class="submitbar"><div class="wrap" style="padding:0"><span id="tcount">Đã làm ' + answeredCount(T) + ' / ' + T.qs.length + '</span><button class="btn" data-act="tsubmit">Nộp bài</button></div></div>';
    box.innerHTML = h;
  }
  function submitTest(T) {
    $$('#study input[data-act="twr"]').forEach(function (inp) { T.ans[+inp.dataset.q] = inp.value; });
    T.done = true;
    T.qs.forEach(function (q, i) { var a = T.ans[i]; record(q.c, qRight(q, a)); });
  }
  var TestMode = {
    start: function (ctx) { this.ctx = ctx; this.T = null; this.renderCfg(); },
    renderCfg: function () {
      var box = $('#study'), cfg = testConfig();
      box.innerHTML = '<div class="panel"><h3 class="phan-title" style="margin-bottom:14px">Tạo bài kiểm tra · ' + esc(this.ctx.title) + '</h3>' + cfgHTML(cfg, this.ctx.cards.length) +
        '<div class="rowbtns"><button class="btn" data-act="tstart">Bắt đầu kiểm tra</button><button class="btn dark" data-act="tprint">In đề / Lưu PDF</button></div></div>';
    },
    begin: function () { this.T = buildTest(this.ctx.cards, this.ctx.pool, testConfig()); renderTest($('#study'), this.T, this.ctx); },
    key: function () {}
  };

  // ---------- Chế độ: Ghép thẻ ----------
  var matchTick = null;
  function stopTimers() { clearInterval(matchTick); matchTick = null; if (Learn.auto) clearTimeout(Learn.auto); }
  var Match = {
    start: function (ctx) { this.ctx = ctx; this.intro(); },
    intro: function () {
      var best = P.match[this.ctx.matchKey];
      $('#study').innerHTML = '<div class="panel endcard"><span class="chip dark">Ghép thẻ</span><h3>Ghép thuật ngữ với nghĩa</h3><p class="muted">Mỗi lượt 6 cặp ngẫu nhiên. Bấm một ô rồi bấm ô tương ứng; ghép sai bị cộng 1 giây.</p>' +
        (best ? '<p>Kỷ lục: <b class="pix">' + (best / 10).toFixed(1) + ' giây</b></p>' : '') + '<div class="rowbtns"><button class="btn" data-act="mstart">Bắt đầu</button></div></div>';
    },
    begin: function () {
      var src = shuffle(this.ctx.cards), seenT = {}, seenD = {}, pick = [];
      for (var i = 0; i < src.length && pick.length < 6; i++) {
        var c = src[i], t = c.t.toLowerCase(), d = defText(c).toLowerCase();
        if (seenT[t] || seenD[d]) continue; seenT[t] = seenD[d] = 1; pick.push(c);
      }
      this.pairs = pick; this.left = pick.length; this.sel = null; this.pen = 0; this.t0 = Date.now();
      var tiles = [];
      pick.forEach(function (c, i) { tiles.push({ i: i, term: true, txt: c.t }); var d = defText(c); tiles.push({ i: i, term: false, txt: d.length > 110 ? d.slice(0, 107) + '…' : d }); });
      tiles = shuffle(tiles);
      $('#study').innerHTML = '<div class="fc-top"><span class="mtimer" id="mt">0.0</span><button class="tg" data-act="mstart">Chơi lại</button></div><div class="mgrid">' +
        tiles.map(function (t) { return '<button class="tile' + (t.term ? ' term' : '') + '" data-act="mtile" data-i="' + t.i + '" data-term="' + (t.term ? 1 : 0) + '">' + esc(t.txt) + '</button>'; }).join('') + '</div>';
      var self = this;
      clearInterval(matchTick);
      matchTick = setInterval(function () { var el = $('#mt'); if (!el) return clearInterval(matchTick); el.textContent = ((Date.now() - self.t0) / 1000 + self.pen).toFixed(1); }, 100);
    },
    tap: function (btn) {
      if (btn.classList.contains('gone')) return;
      if (!this.sel) { this.sel = btn; btn.classList.add('sel'); return; }
      if (this.sel === btn) { btn.classList.remove('sel'); this.sel = null; return; }
      var a = this.sel, self = this; this.sel = null; a.classList.remove('sel');
      if (a.dataset.i === btn.dataset.i && a.dataset.term !== btn.dataset.term) {
        a.classList.add('gone'); btn.classList.add('gone'); this.left--;
        if (!this.left) this.finish();
      } else {
        this.pen += 1; a.classList.add('bad'); btn.classList.add('bad');
        setTimeout(function () { a.classList.remove('bad'); btn.classList.remove('bad'); }, 450);
      }
    },
    finish: function () {
      clearInterval(matchTick);
      var t = Math.round(((Date.now() - this.t0) / 1000 + this.pen) * 10), best = P.match[this.ctx.matchKey], rec = !best || t < best;
      if (rec) P.match[this.ctx.matchKey] = t;
      bump(this.pairs.length); saveP(); topStreak();
      $('#study').innerHTML = '<div class="panel endcard"><span class="chip dark">' + (rec ? 'Kỷ lục mới!' : 'Hoàn thành') + '</span><div class="big" style="margin-top:10px">' + (t / 10).toFixed(1) + '<small> giây</small></div>' +
        (!rec ? '<p class="muted">Kỷ lục: ' + (best / 10).toFixed(1) + ' giây</p>' : '') + '<div class="rowbtns"><button class="btn" data-act="mstart">Chơi lại</button><a class="btn dark" href="' + this.ctx.base + '/learn">Chế độ Học</a></div></div>';
    },
    key: function () {}
  };

  // ---------- Chế độ: Danh sách ----------
  var List = {
    start: function (ctx) { this.render($('#study'), ctx, false); },
    render: function (box, ctx, below) {
      if (!box) return;
      var head = '<div class="listhead"' + (below ? '' : ' style="margin-top:0"') + '><h2 class="sec-title">Thuật ngữ trong phần này (' + ctx.cards.length + ')</h2><div class="search"><input data-act="lfilter" type="search" placeholder="Lọc từ…" autocomplete="off"></div></div>' + legend();
      var groups = '', lastG = null;
      ctx.cards.forEach(function (c, i) {
        if (c.g !== undefined && c.g !== lastG && c.g) groups += '<h4 class="grp" style="margin:10px 0 0">' + esc(c.g) + '</h4>';
        lastG = c.g;
        groups += '<div data-row="' + i + '">' + wordItem(c, !!ctx.showDeck) + '</div>';
      });
      box.innerHTML = head + '<div class="wl" id="wl">' + groups + '</div>';
      this.ctx = ctx;
    },
    filter: function (q) {
      var nq = q.trim().toLowerCase(), ctx = this.ctx;
      $$('#wl [data-row]').forEach(function (el) {
        var c = ctx.cards[+el.dataset.row];
        el.style.display = !nq || c.t.toLowerCase().indexOf(nq) >= 0 || defText(c).toLowerCase().indexOf(nq) >= 0 ? '' : 'none';
      });
    },
    key: function () {}
  };

  // ---------- Ôn từ cũ ----------
  var SOURCES = [
    ['due', 'Đến hạn ôn', 'Từ đã học tới lúc cần ôn lại (lặp lại ngắt quãng)'],
    ['weak', 'Từ hay sai', 'Từ đang học hoặc trả lời sai nhiều hơn đúng'],
    ['known', 'Từ đã biết', 'Kiểm tra lại những từ bạn đã đánh dấu là biết'],
    ['seen', 'Tất cả từ đã học', 'Mọi từ bạn đã từng học'],
    ['star', 'Từ gắn sao', 'Những từ bạn đã gắn ★']
  ];
  function srcTest(src, k) {
    var e = P.c[k];
    if (src === 'star') return !!(e && e.st);
    if (!e || !e.s) return false;
    if (src === 'due') return isDue(k);
    if (src === 'weak') return e.b < KNOWN || e.w > e.r;
    if (src === 'known') return e.b >= KNOWN;
    return true;
  }
  function reviewState() {
    var R = P.opt.review || (P.opt.review = { src: 'due', decks: {} });
    return R;
  }
  function eligible(src) {
    var per = {}, total = 0, seen = {};
    V.index.forEach(function (d) {
      var n = 0;
      deckKeys(d).forEach(function (k) { if (srcTest(src, k) && keyDeck[k] === d.id && !seen[k]) { seen[k] = 1; n++; } });
      per[d.id] = n; total += n;
    });
    return { per: per, total: total };
  }
  function pageReview() {
    var R = reviewState(), counts = {};
    SOURCES.forEach(function (s) { counts[s[0]] = eligible(s[0]).total; });
    if (!counts[R.src]) { var firstSrc = SOURCES.filter(function (s) { return counts[s[0]]; })[0]; if (firstSrc) R.src = firstSrc[0]; }
    var el = eligible(R.src), cfg = testConfig();
    var h = '<section class="vhead"><div class="wrap"><div class="crumbs"><a href="#/">Từ vựng SAT</a><span>/</span>Ôn từ cũ</div><h1>Ôn từ cũ</h1>' +
      '<p>Tạo bài kiểm tra hoặc bộ thẻ từ những từ bạn đã học. Từ trả lời đúng sẽ giãn lịch ôn (1 → 3 → 7 → 14 → 30 → 60 ngày), trả lời sai sẽ quay lại ngay.</p>' +
      '<div class="barlabel" style="max-width:none;gap:18px;justify-content:flex-start"><span><b>' + counts.due + '</b> đến hạn</span><span><b>' + counts.seen + '</b> đã học</span><span><b>' + counts.known + '</b> đã biết</span><span><b>' + counts.weak + '</b> hay sai</span><span><b>' + counts.star + '</b> gắn sao</span></div></div></section>' +
      '<section class="cream" style="padding-top:28px"><div class="wrap" style="max-width:960px">';
    if (!counts.seen && !counts.star) {
      h += '<div class="empty">Bạn chưa học từ nào. Hãy học vài buổi bằng <a href="#/d/v30">Thẻ ghi nhớ</a> hoặc chế độ Học, rồi quay lại đây để kiểm tra từ cũ.</div></div></section>';
      return show(h);
    }
    h += '<div class="panel"><div class="cfg"><div><h4>Nguồn từ</h4><div class="srcgrid">' + SOURCES.map(function (s) {
      return '<button class="src' + (R.src === s[0] ? ' on' : '') + '" data-act="rsrc" data-v="' + s[0] + '"' + (counts[s[0]] ? '' : ' disabled') + '><em>' + counts[s[0]] + '</em><b>' + s[1] + '</b><small>' + s[2] + '</small></button>';
    }).join('') + '</div></div><div><h4>Lấy từ các bộ</h4><div class="opts-row">' + V.index.map(function (d) {
      var n = el.per[d.id], on = n && R.decks[d.id] !== false;
      return '<label class="chk' + (n ? '' : ' dim') + '"><input type="checkbox" data-act="rdeck" data-v="' + d.id + '"' + (on ? ' checked' : '') + (n ? '' : ' disabled') + '>' + esc(d.name) + ' (' + n + ')</label>';
    }).join('') + '</div></div></div>';
    var chosen = chosenKeys();
    h += '<div style="margin-top:16px">' + cfgHTML(cfg, chosen.length) + '</div>' +
      '<div class="rowbtns"><button class="btn" data-act="rtest"' + (chosen.length ? '' : ' disabled') + '>Kiểm tra ' + (cfg.n && cfg.n < chosen.length ? cfg.n : chosen.length) + ' từ</button>' +
      '<button class="btn dark" data-act="rflash"' + (chosen.length ? '' : ' disabled') + '>Ôn bằng thẻ (' + chosen.length + ')</button>' +
      '<button class="btn dark" data-act="rlearn"' + (chosen.length ? '' : ' disabled') + '>Chế độ Học</button>' +
      '<button class="btn" data-act="rprint"' + (chosen.length ? '' : ' disabled') + '>In đề / Lưu PDF</button></div></div>' +
      '<div id="study"></div></div></section>';
    show(h);
    view = { mode: 'review' };
  }
  function chosenKeys() {
    var R = reviewState(), out = [], seen = {};
    V.index.forEach(function (d) {
      if (R.decks[d.id] === false) return;
      deckKeys(d).forEach(function (k) { if (!seen[k] && keyDeck[k] === d.id && srcTest(R.src, k)) { seen[k] = 1; out.push(k); } });
    });
    return out;
  }
  // Nạp các bộ chứa từ cần ôn, trả về danh sách thẻ + kho đáp án nhiễu
  function reviewCards() {
    var keys = chosenKeys(), ids = {};
    keys.forEach(function (k) { ids[keyDeck[k]] = 1; });
    return loadDecks(Object.keys(ids)).then(function () {
      var want = {}, cards = [];
      keys.forEach(function (k) { want[k] = 1; });
      Object.keys(ids).forEach(function (id) { V.decks[id].cards.forEach(function (c) { if (want[c.k]) { cards.push(c); delete want[c.k]; } }); });
      return { cards: cards, pool: cardsOf(Object.keys(ids)) };
    });
  }
  function reviewCtx(r) {
    var src = SOURCES.filter(function (s) { return s[0] === reviewState().src; })[0];
    return { cards: r.cards, pool: r.pool, title: 'Ôn từ cũ', sub: src[1] + ' · ' + new Date().toLocaleDateString('vi-VN'), base: '#/custom', kind: 'word', showDeck: true,
      crumbs: '<a href="#/">Từ vựng SAT</a><span>/</span><a href="#/review">Ôn từ cũ</a>', matchKey: 'review' };
  }

  // ---------- In đề ----------
  function printTest(T, title) {
    var p = $('#print') || document.body.appendChild(Object.assign(document.createElement('div'), { id: 'print' }));
    var h = '<h1>' + esc(title) + '</h1><p class="meta">Từ vựng SAT · ' + new Date().toLocaleDateString('vi-VN') + ' · ' + T.qs.length + ' câu · Họ tên: ...................................................</p><ol class="pq">';
    T.qs.forEach(function (q) {
      var c = q.c, ask = q.ask === 't' ? '<b>' + esc(c.t) + '</b>' + (c.p ? ' (' + esc(c.p) + ')' : '') : rich(c[q.ask]);
      if (q.type === 'mc') h += '<li>' + ask + '<div class="po">' + q.opts.map(function (o, j) { return '<span>' + TL[j] + '. ' + (q.ansF === 't' ? esc(o) : rich(o)) + '</span>'; }).join('') + '</div></li>';
      else if (q.type === 'tf') h += '<li>Đúng hay sai: ' + ask + ' — ' + (q.ansF === 't' ? '<b>' + esc(q.shown) + '</b>' : rich(q.shown)) + ' &nbsp; ☐ Đúng &nbsp; ☐ Sai</li>';
      else h += '<li>' + ask + '<br>→ <span class="blank">&nbsp;</span></li>';
    });
    h += '</ol><div class="key"><h1>Đáp án</h1><ol>';
    T.qs.forEach(function (q) { h += '<li>' + (q.type === 'mc' ? TL[q.correct] + ' · ' : q.type === 'tf' ? (q.truth ? 'Đúng' : 'Sai') + ' · ' : '') + esc(q.c.t) + '</li>'; });
    p.innerHTML = h + '</ol></div>';
    setTimeout(function () { g.print(); }, 50);
  }

  // ---------- Sao lưu / khôi phục ----------
  function exportP() {
    var blob = new Blob([JSON.stringify(P)], { type: 'application/json' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'tien-do-sat-vocab-' + today() + '.json';
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function importP() {
    var inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'application/json,.json';
    inp.onchange = function () {
      var f = inp.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var d = JSON.parse(r.result); if (!d || typeof d.c !== 'object') throw new Error();
          if (!g.confirm('Thay tiến độ hiện tại bằng file sao lưu này?')) return;
          localStorage.setItem(PKEY, JSON.stringify(d)); P = loadP(); topStreak(); route();
        } catch (e) { g.alert('File không hợp lệ.'); }
      };
      r.readAsText(f);
    };
    inp.click();
  }

  // ---------- Sự kiện ----------
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]'); if (!t) {
      var fc = e.target.closest('#fc'); if (fc && view && view.mode === 'flash' && !e.target.closest('details')) Flash.toggle();
      return;
    }
    var act = t.dataset.act, v = t.dataset.v;
    if (t.tagName === 'FORM' || t.tagName === 'INPUT') return;
    switch (act) {
      case 'say': e.stopPropagation(); speak(t.dataset.t); break;
      case 'star': e.stopPropagation(); var on = toggleStar(t.dataset.k); $$('.star[data-k="' + CSS.escape(t.dataset.k) + '"]').forEach(function (b) { b.classList.toggle('on', on); b.textContent = on ? '★' : '☆'; b.setAttribute('aria-pressed', on); }); break;
      case 'goal': var gs = [10, 20, 30, 50, 100], gi = gs.indexOf(P.goal); P.goal = gs[(gi + 1) % gs.length]; saveP(); pageHome(); break;
      case 'export': exportP(); break;
      case 'import': importP(); break;
      case 'fopt': Flash.o[t.dataset.k] = !Flash.o[t.dataset.k]; saveP(); Flash.start(Flash.ctx); break;
      case 'fflip': Flash.toggle(); break;
      case 'fprev': Flash.move(-1); break;
      case 'fnext': Flash.move(1); break;
      case 'fyes': Flash.mark(true); break;
      case 'fno': Flash.mark(false); break;
      case 'fagain': Flash.again(); break;
      case 'frestart': Flash.start(Flash.ctx); break;
      case 'lpick': Learn.answer(+t.dataset.i === Learn.q.correct, +t.dataset.i); break;
      case 'lskip': Learn.answer(false); break;
      case 'lnext': Learn.next(); break;
      case 'loverride': Learn.override(); break;
      case 'lrestart': Learn.start(Learn.ctx); break;
      case 'tn': testConfig().n = +v; saveP(); refreshCfg(); break;
      case 'tt': var ty = testConfig().types; ty[v] = ty[v] ? 0 : 1; if (!ty.mc && !ty.tf && !ty.wr) ty[v] = 1; saveP(); refreshCfg(); break;
      case 'td': testConfig().dir = v; saveP(); refreshCfg(); break;
      case 'tstart': TestMode.begin(); break;
      case 'tprint': printTest(buildTest(TestMode.ctx.cards, TestMode.ctx.pool, testConfig()), 'Kiểm tra · ' + TestMode.ctx.sub + ' · ' + TestMode.ctx.title); break;
      case 'tpick': curTest().ans[+t.dataset.q] = +t.dataset.i; $$('#tq' + t.dataset.q + ' .opt').forEach(function (b) { b.classList.toggle('sel', b === t); }); testCount(); break;
      case 'ttf': curTest().ans[+t.dataset.q] = v === '1'; $$('#tq' + t.dataset.q + ' .tfb').forEach(function (b) { b.classList.toggle('sel', b === t); }); testCount(); break;
      case 'tsubmit':
        var T = curTest(), left = T.qs.length - answeredCount(T);
        $$('#study input[data-act="twr"]').forEach(function (inp) { T.ans[+inp.dataset.q] = inp.value; });
        left = T.qs.length - answeredCount(T);
        if (left && !g.confirm('Còn ' + left + ' câu chưa làm. Vẫn nộp bài?')) return;
        submitTest(T); renderTest($('#study'), T); g.scrollTo(0, ($('#study').getBoundingClientRect().top + g.scrollY) - 80); break;
      case 'tnew': if (view.mode === 'review') pageReview(); else TestMode.renderCfg(); break;
      case 'twrong':
        var TT = curTest(), wrong = TT.qs.filter(function (q, i) { return !qRight(q, TT.ans[i]); }).map(function (q) { return q.c; }), base = view.ctx || null;
        CUSTOM = { cards: wrong, pool: base ? base.pool : TT.pool, title: 'Học lại câu sai', sub: wrong.length + ' từ trả lời sai', base: '#/custom', kind: 'word', showDeck: true,
          crumbs: '<a href="#/">Từ vựng SAT</a><span>/</span>' + (base ? '<a href="' + base.base + '/test">' + esc(base.title) + '</a>' : '<a href="#/review">Ôn từ cũ</a>'), matchKey: 'wrong' };
        go('#/custom/learn'); break;
      case 'mstart': Match.begin(); break;
      case 'mtile': Match.tap(t); break;
      case 'rsrc': reviewState().src = v; saveP(); pageReview(); break;
      case 'rtest': case 'rflash': case 'rlearn': case 'rprint':
        t.disabled = true;
        reviewCards().then(function (r) {
          if (act === 'rflash' || act === 'rlearn') { CUSTOM = reviewCtx(r); go('#/custom/' + (act === 'rflash' ? 'flash' : 'learn')); return; }
          var RT = buildTest(r.cards, r.pool, testConfig()); RT.pool = r.pool;
          if (act === 'rprint') { t.disabled = false; return printTest(RT, 'Kiểm tra từ cũ'); }
          view.test = RT; renderTest($('#study'), RT); $('#study').scrollIntoView({ behavior: 'smooth' }); t.disabled = false;
        }).catch(function () { t.disabled = false; g.alert('Không tải được dữ liệu, kiểm tra mạng rồi thử lại.'); });
        break;
    }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.act === 'rdeck') { reviewState().decks[t.dataset.v] = t.checked; saveP(); pageReview(); }
  });
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.id === 'gsearch') { clearTimeout(searchTimer); searchTimer = setTimeout(function () { doSearch(t.value); }, 250); }
    else if (t.dataset && t.dataset.act === 'lfilter') List.filter(t.value);
    else if (t.dataset && t.dataset.act === 'twr') { curTest().ans[+t.dataset.q] = t.value; testCount(); }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f.dataset.act === 'lwrite') { e.preventDefault(); if (Learn.answered) return Learn.next(); var v = ($('#lin') || {}).value || ''; if (!v.trim()) return; Learn.answer(checkWritten(Learn.q, v)); }
  });
  document.addEventListener('keydown', function (e) {
    if (!view || e.ctrlKey || e.metaKey || e.altKey) return;
    var tag = (e.target.tagName || '').toLowerCase();
    // Ô nhập và nút tự xử lý phím của chúng (Enter trên nút = bấm nút)
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || tag === 'button' || tag === 'a' || tag === 'summary') return;
    var m = { flash: Flash, learn: Learn }[view.mode]; if (m) m.key(e);
  });
  function curTest() { return view.mode === 'review' ? view.test : TestMode.T; }
  function testCount() { var el = $('#tcount'), T = curTest(); if (el && T) el.textContent = 'Đã làm ' + answeredCount(T) + ' / ' + T.qs.length; }
  function refreshCfg() { if (view.mode === 'review') pageReview(); else TestMode.renderCfg(); }

  g.addEventListener('hashchange', route);
  document.addEventListener('DOMContentLoaded', function () { topStreak(); route(); });
})(window);
