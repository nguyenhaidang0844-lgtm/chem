/* Điều khiển giao diện: trang chủ, làm bài (thi thử / luyện tập), kết quả, lịch sử */
(function (g) {
  'use strict';
  var C = g.Chem, R = g.Render, $ = function (s, el) { return (el || document).querySelector(s); };
  var app = $('#app');
  var DURATION = 40 * 60;
  var HKEY = 'chem12.history.v1';
  var S = null, timer = null;

  function loadHistory() { try { return JSON.parse(localStorage.getItem(HKEY)) || []; } catch (e) { return []; } }
  function saveHistory(list) { try { localStorage.setItem(HKEY, JSON.stringify(list.slice(0, 200))); } catch (e) { /* bỏ qua */ } }
  function best(id) { var b = null; loadHistory().forEach(function (h) { if (h.id === id && h.mode === 'thi' && (b === null || h.total > b)) b = h.total; }); return b; }
  function mmss(s) { s = Math.max(0, s); var m = Math.floor(s / 60), x = s % 60; return (m < 10 ? '0' : '') + m + ':' + (x < 10 ? '0' : '') + x; }
  function newSeed() { return 100000 + Math.floor(Math.random() * 900000); }
  function two(n) { return (n < 10 ? '0' : '') + n; }

  // ---------- Đăng nhập & bảng xếp hạng ----------
  var B = g.Backend, U = null, pending = null, rankTab = 'total';
  function authHTML() {
    if (!B.enabled) return '<a class="btn" href="#modes">Bắt đầu</a>';
    if (!U) return '<button class="btn" data-act="login">Đăng nhập</button>';
    return '<button class="link who" data-act="editnick" title="Đổi biệt danh" style="color:#fff">' + C.esc(U.name || 'Đặt biệt danh') + '</button><button class="link" data-act="logout" style="color:#fff">Đăng xuất</button>';
  }
  function rankTabs() {
    var h = '<div class="tabs">';
    [['total', 'Tổng']].concat(C.Exams.list().map(function (e) { return [e.id, 'Đề ' + e.id.replace('de', '')]; })).forEach(function (t) {
      h += '<button class="tab' + (rankTab === t[0] ? ' on' : '') + '" data-act="tab" data-v="' + t[0] + '">' + t[1] + '</button>';
    });
    return h + '</div>';
  }
  function renderRanking() {
    var box = $('#rankbox'); if (!box) return;
    var tab = rankTab;
    box.innerHTML = rankTabs() + '<div class="rk-body"><p class="muted">Đang tải…</p></div>';
    B.board(tab).then(function (rows) {
      var b = $('#rankbox .rk-body'); if (rankTab !== tab || !b) return;
      if (!rows.length) { b.innerHTML = '<p class="muted" style="margin:0">Chưa có ai trên bảng này. Hãy là người đầu tiên!</p>'; return; }
      var h = '<div class="tablewrap"><table class="rank"><thead><tr><th>#</th><th>Biệt danh</th><th>Điểm</th><th>' + (tab === 'total' ? 'Số đề' : 'Thời gian') + '</th></tr></thead><tbody>';
      rows.forEach(function (r, i) {
        h += '<tr' + (U && r.uid === U.uid ? ' class="me"' : '') + '><td>' + (i + 1) + '</td><td>' + C.esc(r.name) + '</td><td><b>' + C.fmt(r.score) + '</b></td><td>' + (tab === 'total' ? r.n + ' đề' : mmss(r.time)) + '</td></tr>';
      });
      b.innerHTML = h + '</tbody></table></div>';
    }).catch(function () {
      var b = $('#rankbox .rk-body'); if (b) b.innerHTML = '<p class="muted" style="margin:0">Không tải được bảng xếp hạng. Kiểm tra mạng rồi thử lại.</p>';
    });
  }
  function closeModal() { var m = $('#modal'); if (m) m.remove(); }
  function askNick() {
    closeModal();
    var d = document.createElement('div'); d.className = 'modal'; d.id = 'modal';
    d.innerHTML = '<div class="modal-in"><h3>Chọn biệt danh</h3><p>Biệt danh hiện công khai trên bảng xếp hạng. Đừng dùng tên thật hay thông tin cá nhân.</p>' +
      '<input id="nick" maxlength="20" placeholder="2 – 20 ký tự" value="' + C.esc((U && U.name) || '') + '"><p class="modal-err" id="nickerr"></p>' +
      '<div class="modal-btns"><button class="btn" data-act="savenick">Lưu</button><button class="link" data-act="closemodal">Để sau</button></div></div>';
    document.body.appendChild(d);
    var i = $('#nick'); if (i) { i.focus(); i.select(); }
  }
  function saveNick() {
    var err = $('#nickerr'); if (err) err.textContent = '';
    B.setName(($('#nick') || {}).value).then(closeModal).catch(function (e) {
      if (err) err.textContent = (e && /Biệt danh/.test(e.message)) ? e.message : 'Không lưu được, hãy thử lại.';
    });
  }
  function rankStatus(html) { var el = $('#rankstatus'); if (el) el.innerHTML = html; }
  function trySubmit() {
    if (!pending || !B.enabled) return;
    if (!U) { rankStatus('Đăng nhập để lưu điểm này lên bảng xếp hạng. <button class="btn small" data-act="login">Đăng nhập</button>'); return; }
    if (!U.name) { rankStatus('Hãy đặt biệt danh để lưu điểm lên bảng xếp hạng. <button class="btn small" data-act="editnick">Đặt biệt danh</button>'); return; }
    var p = pending; pending = null; rankStatus('Đang lưu điểm…');
    B.submit(p.examId, p.score, p.time).then(function (r) {
      rankStatus(r.saved ? (r.first ? 'Đã lưu điểm của bạn lên bảng xếp hạng.' : 'Kỷ lục mới của bạn! Đã cập nhật bảng xếp hạng.') : 'Điểm cao nhất của bạn ở đề này vẫn là ' + C.fmt(r.best) + ', bảng xếp hạng giữ nguyên.');
    }).catch(function () { pending = p; rankStatus('Chưa lưu được điểm. <button class="btn small" data-act="retrysubmit">Thử lại</button>'); });
  }
  function onAuth(u) {
    U = u;
    var box = $('#authbox'); if (box) box.innerHTML = authHTML();
    if ($('#rankbox')) renderRanking();
    if (U && !U.name) { if (!$('#modal')) askNick(); } else { closeModal(); trySubmit(); }
  }

  // ---------- Hoa anh đào pixel ----------
  var FLOWER = ['....PP...PP....', '...PLLP.PLLP...', '..PLLLLPLLLLP..', '..PLLLLLLLLLP..', '...PLLLLLLLP...', '..PPLLLLLLLPP..', '.PLLLLLYLLLLLP.',
    'PLLLLLYDYLLLLLP', '.PLLLLLYLLLLLP.', '..PPLLLLLLLPP..', '...PLLLLLLLP...', '..PLLLLLLLLLP..', '..PLLLLPLLLLP..', '...PLLP.PLLP...', '....PP...PP....'];
  var COL = { P: '#ff8fb3', L: '#ffd3e2', Y: '#ffd166', D: '#9b1c40' };
  function sakura() {
    var r = '';
    FLOWER.forEach(function (row, y) { for (var x = 0; x < row.length; x++) { var c = COL[row.charAt(x)]; if (c) r += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + c + '"/>'; } });
    return '<svg viewBox="0 0 15 15" aria-hidden="true">' + r + '</svg>';
  }
  function petals() {
    var h = '<div class="petals" aria-hidden="true">';
    for (var i = 0; i < 16; i++) {
      var s = 6 + (i * 5) % 9;
      h += '<i style="--x:' + (3 + (i * 37) % 94) + '%;--s:' + s + 'px;--d:' + (9 + (i * 7) % 8) + 's;--l:-' + ((i * 3) % 12) + 's;--dx:' + ((i % 2 ? 1 : -1) * (30 + (i * 11) % 60)) + 'px"></i>';
    }
    return h + '</div>';
  }
  function logo(extra) { return '<a class="logo" href="index.html" style="color:inherit;text-decoration:none">' + sakura() + '<span>Hóa 12' + (extra ? '<small>' + extra + '</small>' : '') + '</span></a>'; }

  // ---------- Trang chủ ----------
  var pickMode = 'thi';
  function home() {
    stopTimer(); S = null; window.scrollTo(0, 0);
    var exams = C.Exams.list(), hist = loadHistory();
    var h = '<header class="topbar"><div class="wrap topbar-in">' + logo('Ôn thi THPT') + '<div class="tb-right"><a class="link" href="#modes" style="color:#fff">Bộ đề</a><a class="link" href="#scoring" style="color:#fff">Điểm</a>' + (B.enabled ? '<a class="link" href="#ranking" style="color:#fff">Xếp hạng</a>' : '') + '<span id="authbox">' + authHTML() + '</span></div></div></header>';
    h += '<section class="hero">' + petals() + '<div class="wrap"><div><span class="chip">Chương 1 · Ester – Lipid</span>' +
      '<h1>Ôn thi<br>Hóa học 12</h1>' +
      '<p class="lead">Đề thi thử theo cấu trúc THPT, chia thành nhiều đề. Câu tính toán tự thay số mỗi lần làm, có lời giải chi tiết ngay sau khi nộp bài.</p>' +
      '<div class="hero-cta"><a class="btn" href="#modes">Chọn đề</a><a class="btn ghost" href="#scoring">Cách tính điểm</a></div></div>' +
      '<div class="pixcard"><div class="pixpanel">' + sakura() + '</div><div class="pixcap">Cấu trúc mỗi đề · 28 câu · 40 phút</div>' +
      '<div class="stats"><div class="stat"><b>18</b><span>Trắc nghiệm</span></div><div class="stat"><b>04</b><span>Đúng / Sai</span></div><div class="stat"><b>06</b><span>Trả lời ngắn</span></div></div></div></div></section>';

    h += '<section class="cream" id="modes"><div class="wrap"><h2 class="sec-title">Chọn chế độ</h2><p class="sec-sub">Thi thử để làm như thi thật, luyện tập để xem đáp án từng câu.</p>' +
      '<div class="modes"><button class="mode' + (pickMode === 'thi' ? ' on' : '') + '" data-act="mode" data-v="thi"><b>Thi thử</b><small>40 phút, chấm điểm khi nộp bài</small></button>' +
      '<button class="mode' + (pickMode === 'luyen' ? ' on' : '') + '" data-act="mode" data-v="luyen"><b>Luyện tập</b><small>Không giới hạn giờ, xem đáp án ngay</small></button></div>' +
      '<h2 class="sec-title" style="margin-top:44px">Bộ đề</h2><p class="sec-sub">' + exams.length + ' đề · mỗi đề 10 điểm.</p><div class="grid">';
    exams.forEach(function (e) {
      var b = best(e.id), no = (e.id.match(/\d+/) || ['0'])[0], name = e.title.split('·').pop().trim();
      h += '<div class="card' + (e.mix ? ' mix' : '') + '"><div class="no">' + (e.mix ? '<span class="tag">Trộn ngẫu nhiên</span>' : '') + two(parseInt(no, 10)) + '</div><div class="chap">' + C.esc(e.chapter) + '</div><h3>' + C.esc(name) + '</h3><p>' + C.esc(e.desc) + '</p>' +
        '<div class="cardfoot"><span>28 câu · 10 điểm' + (b !== null ? '<br>Cao nhất: <b>' + C.fmt(b) + '</b>' : '') + '</span><button class="btn" data-act="start" data-id="' + e.id + '">Làm bài</button></div></div>';
    });
    h += '</div></div></section>';

    if (B.enabled) h += '<section class="cream" id="ranking"><div class="wrap"><h2 class="sec-title">Bảng xếp hạng</h2><p class="sec-sub">Điểm cao nhất của mỗi người, chỉ tính chế độ Thi thử. Bằng điểm thì ai làm nhanh hơn xếp trên.</p><div class="panel" id="rankbox"></div></div></section>';

    h += '<section class="pinkband" id="scoring"><div class="wrap"><h2 class="sec-title">Cách tính điểm</h2><p class="sec-sub">Thang điểm giống đề thi tốt nghiệp THPT.</p><div class="scoregrid">' +
      '<div class="score"><b>4,5</b><h4>Phần I · 18 câu</h4><p>Trắc nghiệm nhiều lựa chọn, 0,25 điểm mỗi câu.</p></div>' +
      '<div class="score"><b>4,0</b><h4>Phần II · 4 câu</h4><p>Đúng/sai, mỗi câu 4 ý: đúng 1 ý 0,1 · 2 ý 0,25 · 3 ý 0,5 · 4 ý 1,0 điểm.</p></div>' +
      '<div class="score"><b>1,5</b><h4>Phần III · 6 câu</h4><p>Trả lời ngắn bằng số, 0,25 điểm mỗi câu.</p></div></div></div></section>';

    h += '<section class="cream"><div class="wrap"><div class="panel"><div class="histhead"><h2 class="sec-title" style="font-size:1.2rem">Lịch sử làm bài</h2>' + (hist.length ? '<button class="link" data-act="clear">Xóa lịch sử</button>' : '') + '</div>';
    if (!hist.length) h += '<p class="muted" style="margin:0">Chưa có bài nào. Hãy chọn một đề để bắt đầu.</p>';
    else {
      h += '<div class="tablewrap"><table><thead><tr><th>Thời gian</th><th>Đề</th><th>Chế độ</th><th>Điểm</th></tr></thead><tbody>';
      hist.slice(0, 15).forEach(function (x) {
        h += '<tr><td>' + C.esc(x.date) + '</td><td>' + C.esc(x.title) + '</td><td>' + (x.mode === 'thi' ? 'Thi thử' : 'Luyện tập') + '</td><td><b>' + C.fmt(x.total) + '</b>/10</td></tr>';
      });
      h += '</tbody></table></div>';
    }
    h += '</div></div></section><footer class="foot"><div class="wrap"><span><b>Hóa 12</b> · Ester – Lipid</span><span>Đáp án và lời giải do hệ thống tự tính, hãy đối chiếu với giáo viên khi cần.</span></div></footer>';
    app.innerHTML = h;
    if (B.enabled) renderRanking();
  }

  // ---------- Bắt đầu / làm bài ----------
  function start(id, seed, mode) {
    pending = null;
    var meta = C.Exams.list().filter(function (e) { return e.id === id; })[0];
    S = { id: id, meta: meta, seed: seed, mode: mode, qs: C.build(id, seed), answers: {}, checked: {}, t0: Date.now(), left: DURATION, done: false };
    exam();
    if (mode === 'thi') { timer = setInterval(tick, 1000); }
  }
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
  function tick() {
    S.left = DURATION - Math.floor((Date.now() - S.t0) / 1000);
    var el = $('#clock'); if (el) { el.textContent = mmss(S.left); el.classList.toggle('warn', S.left <= 300); }
    if (S.left <= 0) submit(true);
  }
  var SECT = [['mcq', 'Phần I. Trắc nghiệm nhiều phương án lựa chọn', 'Mỗi câu chỉ có một đáp án đúng · 0,25 điểm/câu'],
    ['tf', 'Phần II. Trắc nghiệm đúng/sai', 'Đúng 1 ý: 0,1 · 2 ý: 0,25 · 3 ý: 0,5 · 4 ý: 1,0 điểm'],
    ['short', 'Phần III. Trắc nghiệm trả lời ngắn', 'Nhập kết quả dạng số · 0,25 điểm/câu']];

  function qHTML(i) {
    var q = S.qs[i], state = (S.done || S.checked[i]) ? 'checked' : 'open';
    var h = R.questionHTML(q, i, S.answers[i], state);
    if (S.mode === 'luyen' && !S.done && state === 'open' && q.type !== 'mcq') {
      h = h.replace(/<\/article>$/, '<button class="btn small" data-act="check">Kiểm tra đáp án</button></article>');
    }
    return h;
  }
  function exam() {
    window.scrollTo(0, 0);
    var h = '<header class="topbar"><div class="wrap topbar-in"><div>' + logo(C.esc(S.meta.title) + ' · ' + (S.mode === 'thi' ? 'Thi thử' : 'Luyện tập')) + '</div><div class="tb-right">' +
      (S.mode === 'thi' ? '<div class="clock" id="clock">' + mmss(S.left) + '</div>' : '') +
      '<button class="link" data-act="home" style="color:#fff">Thoát</button><button class="btn" data-act="submit">Nộp bài</button></div></div></header>';
    h += '<div class="wrap layout"><main id="qs">';
    SECT.forEach(function (s) {
      h += '<h2 class="sect">' + s[1] + '<small>' + s[2] + '</small></h2>';
      S.qs.forEach(function (q, i) { if (q.type === s[0]) h += qHTML(i); });
    });
    h += '</main><aside class="palette"><h4>Danh sách câu</h4><div class="pgrid" id="pal">';
    S.qs.forEach(function (q, i) { h += '<a href="#q' + i + '" id="p' + i + '">' + (i + 1) + '</a>'; });
    h += '</div><div class="pcount" id="pcount"></div></aside></div>';
    app.innerHTML = h;
    S.qs.forEach(function (q, i) { paint(i); });
    counter();
  }
  function paint(i) {
    var p = $('#p' + i); if (!p) return;
    p.className = C.isAnswered(S.qs[i], S.answers[i]) ? 'done' : '';
  }
  function counter() {
    var n = 0; S.qs.forEach(function (q, i) { if (C.isAnswered(q, S.answers[i])) n++; });
    var el = $('#pcount'); if (el) el.textContent = 'Đã làm ' + n + '/' + S.qs.length + ' câu';
  }
  function redraw(i) {
    var el = $('#q' + i); if (!el) return;
    var tmp = document.createElement('div'); tmp.innerHTML = qHTML(i);
    el.replaceWith(tmp.firstChild);
  }

  // ---------- Nộp bài & kết quả ----------
  function submit(auto) {
    if (!S || S.done) return;
    if (!auto) {
      var left = S.qs.filter(function (q, i) { return !C.isAnswered(q, S.answers[i]); }).length;
      if (!confirm(left ? 'Bạn còn ' + left + ' câu chưa làm. Vẫn nộp bài?' : 'Nộp bài ngay bây giờ?')) return;
    }
    stopTimer(); S.done = true;
    var sc = C.scoreExam(S.qs, S.answers), used = Math.floor((Date.now() - S.t0) / 1000);
    var list = loadHistory();
    var d = new Date();
    list.unshift({ id: S.id, title: S.meta.title, seed: S.seed, mode: S.mode, total: sc.total, parts: sc.parts, used: used,
      date: two(d.getDate()) + '/' + two(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + two(d.getHours()) + ':' + two(d.getMinutes()) });
    saveHistory(list);
    result(sc, used, auto);
  }
  function result(sc, used, auto) {
    window.scrollTo(0, 0);
    var h = '<header class="topbar"><div class="wrap topbar-in"><div>' + logo('Kết quả · ' + C.esc(S.meta.title)) + '</div><div class="tb-right"><button class="link" data-act="home" style="color:#fff">Trang chủ</button></div></div></header>';
    h += '<section class="resultband"><div class="wrap"><div class="big">' + C.fmt(sc.total) + '<small>/10</small></div><div><p style="margin:0">' + (auto ? 'Hết giờ, hệ thống đã tự nộp bài. ' : '') + 'Thời gian làm bài: <b>' + mmss(used) + '</b></p>' +
      '<ul class="parts"><li>Phần I: <b>' + C.fmt(sc.parts.mcq) + '</b>/4,5</li><li>Phần II: <b>' + C.fmt(sc.parts.tf) + '</b>/4</li><li>Phần III: <b>' + C.fmt(sc.parts.short) + '</b>/1,5</li></ul>' +
      (B.enabled ? '<p class="rankstatus" id="rankstatus">' + (S.mode !== 'thi' ? 'Chế độ luyện tập không tính vào bảng xếp hạng.' : (used < 60 ? 'Bài làm dưới 1 phút nên không tính vào bảng xếp hạng.' : '')) + '</p>' : '') +
      '<div class="rbtns"><button class="btn" data-act="again" data-same="0">Làm đề mới (đổi số)</button><button class="btn ghost" data-act="again" data-same="1">Làm lại đúng đề này</button></div></div></div></section>';
    h += '<div class="wrap" style="padding-bottom:40px"><main id="qs">';
    SECT.forEach(function (s) {
      h += '<h2 class="sect">' + s[1] + '</h2>';
      S.qs.forEach(function (q, i) { if (q.type === s[0]) h += R.questionHTML(q, i, S.answers[i], 'checked'); });
    });
    h += '</main></div>';
    app.innerHTML = h;
    if (B.enabled && S.mode === 'thi' && used >= 60) { pending = { examId: S.id, score: sc.total, time: Math.min(used, 2400) }; trySubmit(); }
  }

  // ---------- Sự kiện ----------
  function qIndex(el) { var a = el.closest('.q'); return a ? parseInt(a.getAttribute('data-i'), 10) : -1; }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]'); if (!t) return;
    var act = t.getAttribute('data-act'), i = qIndex(t);
    if (act === 'mode') { pickMode = t.getAttribute('data-v'); var y = window.scrollY; home(); window.scrollTo(0, y); }
    else if (act === 'start') {
      start(t.getAttribute('data-id'), newSeed(), pickMode);
    }
    else if (act === 'clear') { if (confirm('Xóa toàn bộ lịch sử làm bài?')) { saveHistory([]); home(); } }
    else if (act === 'home') { if (!S || S.done || confirm('Thoát và bỏ bài đang làm?')) home(); }
    else if (act === 'submit') submit(false);
    else if (act === 'again') { var same = t.getAttribute('data-same') === '1'; start(S.id, same ? S.seed : newSeed(), S.mode); }
    else if (act === 'mcq' && i >= 0 && !S.done) {
      S.answers[i] = parseInt(t.getAttribute('data-k'), 10);
      if (S.mode === 'luyen') S.checked[i] = true;
      redraw(i); paint(i); counter();
    }
    else if (act === 'tf' && i >= 0 && !S.done) {
      var a = S.answers[i] || [undefined, undefined, undefined, undefined];
      a[parseInt(t.getAttribute('data-k'), 10)] = t.getAttribute('data-v') === '1';
      S.answers[i] = a; redraw(i); paint(i); counter();
    }
    else if (act === 'check' && i >= 0) { S.checked[i] = true; redraw(i); }
    else if (act === 'login') { B.signIn().catch(function (err) { var c = (err && err.code) || ''; if (c !== 'auth/popup-closed-by-user' && c !== 'auth/cancelled-popup-request') alert('Không đăng nhập được (' + (c || 'lỗi mạng') + '). Hãy thử lại.'); }); }
    else if (act === 'logout') { B.signOut(); }
    else if (act === 'editnick') { if (U) askNick(); }
    else if (act === 'savenick') saveNick();
    else if (act === 'closemodal') closeModal();
    else if (act === 'retrysubmit') trySubmit();
    else if (act === 'tab') { rankTab = t.getAttribute('data-v'); renderRanking(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target && e.target.id === 'nick') saveNick(); });
  app.addEventListener('input', function (e) {
    var t = e.target; if (t.getAttribute('data-act') !== 'short') return;
    var i = qIndex(t); if (i < 0 || !S) return;
    S.answers[i] = t.value; paint(i); counter();
  });
  window.addEventListener('beforeunload', function (e) { if (S && !S.done && S.mode === 'thi') { e.preventDefault(); e.returnValue = ''; } });

  home();
  if (B.enabled) B.onChange(onAuth);
})(window);
