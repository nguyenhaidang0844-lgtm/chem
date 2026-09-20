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
  function logo(extra) { return '<div class="logo">' + sakura() + '<span>Hóa 12' + (extra ? '<small>' + extra + '</small>' : '') + '</span></div>'; }

  // ---------- Trang chủ ----------
  var pickMode = 'thi';
  function home() {
    stopTimer(); S = null; window.scrollTo(0, 0);
    var exams = C.Exams.list(), hist = loadHistory();
    var h = '<header class="topbar"><div class="wrap topbar-in">' + logo('Ôn thi THPT') + '<div class="tb-right"><a class="link" href="#modes" style="color:#fff">Bộ đề</a><a class="link" href="#scoring" style="color:#fff">Điểm</a><a class="btn" href="#modes">Bắt đầu</a></div></div></header>';
    h += '<section class="hero">' + petals() + '<div class="wrap"><div><span class="chip">Chương 1 · Ester – Lipid</span>' +
      '<h1>Ôn thi<br>Hóa học 12<em>Đổi số mỗi lần</em></h1>' +
      '<p class="lead">Đề thi thử theo cấu trúc THPT, chia thành nhiều đề. Câu tính toán tự thay số mỗi lần làm, có lời giải chi tiết ngay sau khi nộp bài.</p>' +
      '<div class="hero-cta"><a class="btn" href="#modes">Chọn đề</a><a class="btn ghost" href="#scoring">Cách tính điểm</a></div></div>' +
      '<div class="pixcard"><div class="pixpanel">' + sakura() + '</div><div class="pixcap">Cấu trúc mỗi đề · 28 câu · 40 phút</div>' +
      '<div class="stats"><div class="stat"><b>18</b><span>Trắc nghiệm</span></div><div class="stat"><b>04</b><span>Đúng / Sai</span></div><div class="stat"><b>06</b><span>Trả lời ngắn</span></div></div></div></div></section>';

    h += '<section class="cream" id="modes"><div class="wrap"><h2 class="sec-title">Chọn chế độ</h2><p class="sec-sub">Thi thử để làm như thi thật, luyện tập để xem đáp án từng câu.</p>' +
      '<div class="modes"><button class="mode' + (pickMode === 'thi' ? ' on' : '') + '" data-act="mode" data-v="thi"><b>Thi thử</b><small>40 phút, chấm điểm khi nộp bài</small></button>' +
      '<button class="mode' + (pickMode === 'luyen' ? ' on' : '') + '" data-act="mode" data-v="luyen"><b>Luyện tập</b><small>Không giới hạn giờ, xem đáp án ngay</small></button></div>' +
      '<label class="seedbox">Mã đề (tùy chọn): <input id="seed" type="text" inputmode="numeric" maxlength="9" placeholder="để trống = ngẫu nhiên"> <small>Nhập lại mã cũ để làm đúng bộ số đó.</small></label>' +
      '<h2 class="sec-title" style="margin-top:44px">Bộ đề</h2><p class="sec-sub">' + exams.length + ' đề · mỗi đề 10 điểm.</p><div class="grid">';
    exams.forEach(function (e) {
      var b = best(e.id), no = (e.id.match(/\d+/) || ['0'])[0], name = e.title.split('·').pop().trim();
      h += '<div class="card"><div class="no">' + two(parseInt(no, 10)) + '</div><div class="chap">' + C.esc(e.chapter) + '</div><h3>' + C.esc(name) + '</h3><p>' + C.esc(e.desc) + '</p>' +
        '<div class="cardfoot"><span>28 câu · 10 điểm' + (b !== null ? '<br>Cao nhất: <b>' + C.fmt(b) + '</b>' : '') + '</span><button class="btn" data-act="start" data-id="' + e.id + '">Làm bài</button></div></div>';
    });
    h += '</div></div></section>';

    h += '<section class="pinkband" id="scoring"><div class="wrap"><h2 class="sec-title">Cách tính điểm</h2><p class="sec-sub">Thang điểm giống đề thi tốt nghiệp THPT.</p><div class="scoregrid">' +
      '<div class="score"><b>4,5</b><h4>Phần I · 18 câu</h4><p>Trắc nghiệm nhiều lựa chọn, 0,25 điểm mỗi câu.</p></div>' +
      '<div class="score"><b>4,0</b><h4>Phần II · 4 câu</h4><p>Đúng/sai, mỗi câu 4 ý: đúng 1 ý 0,1 · 2 ý 0,25 · 3 ý 0,5 · 4 ý 1,0 điểm.</p></div>' +
      '<div class="score"><b>1,5</b><h4>Phần III · 6 câu</h4><p>Trả lời ngắn bằng số, 0,25 điểm mỗi câu.</p></div></div></div></section>';

    h += '<section class="cream"><div class="wrap"><div class="panel"><div class="histhead"><h2 class="sec-title" style="font-size:1.2rem">Lịch sử làm bài</h2>' + (hist.length ? '<button class="link" data-act="clear">Xóa lịch sử</button>' : '') + '</div>';
    if (!hist.length) h += '<p class="muted" style="margin:0">Chưa có bài nào. Hãy chọn một đề để bắt đầu.</p>';
    else {
      h += '<div class="tablewrap"><table><thead><tr><th>Thời gian</th><th>Đề</th><th>Chế độ</th><th>Mã đề</th><th>Điểm</th></tr></thead><tbody>';
      hist.slice(0, 15).forEach(function (x) {
        h += '<tr><td>' + C.esc(x.date) + '</td><td>' + C.esc(x.title) + '</td><td>' + (x.mode === 'thi' ? 'Thi thử' : 'Luyện tập') + '</td><td>' + x.seed + '</td><td><b>' + C.fmt(x.total) + '</b>/10</td></tr>';
      });
      h += '</tbody></table></div>';
    }
    h += '</div></div></section><footer class="foot"><div class="wrap"><span><b>Hóa 12</b> · Ester – Lipid</span><span>Đáp án và lời giải do hệ thống tự tính, hãy đối chiếu với giáo viên khi cần.</span></div></footer>';
    app.innerHTML = h;
  }

  // ---------- Bắt đầu / làm bài ----------
  function start(id, seed, mode) {
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
    var h = '<header class="topbar"><div class="wrap topbar-in"><div>' + logo(C.esc(S.meta.title) + ' · ' + (S.mode === 'thi' ? 'Thi thử' : 'Luyện tập') + ' · Mã ' + S.seed) + '</div><div class="tb-right">' +
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
    var h = '<header class="topbar"><div class="wrap topbar-in"><div>' + logo('Kết quả · ' + C.esc(S.meta.title) + ' · Mã ' + S.seed) + '</div><div class="tb-right"><button class="link" data-act="home" style="color:#fff">Trang chủ</button></div></div></header>';
    h += '<section class="resultband"><div class="wrap"><div class="big">' + C.fmt(sc.total) + '<small>/10</small></div><div><p style="margin:0">' + (auto ? 'Hết giờ, hệ thống đã tự nộp bài. ' : '') + 'Thời gian làm bài: <b>' + mmss(used) + '</b></p>' +
      '<ul class="parts"><li>Phần I: <b>' + C.fmt(sc.parts.mcq) + '</b>/4,5</li><li>Phần II: <b>' + C.fmt(sc.parts.tf) + '</b>/4</li><li>Phần III: <b>' + C.fmt(sc.parts.short) + '</b>/1,5</li></ul>' +
      '<div class="rbtns"><button class="btn" data-act="again" data-same="0">Làm lại (đổi số mới)</button><button class="btn ghost" data-act="again" data-same="1">Làm lại cùng mã đề</button></div></div></div></section>';
    h += '<div class="wrap" style="padding-bottom:40px"><main id="qs">';
    SECT.forEach(function (s) {
      h += '<h2 class="sect">' + s[1] + '</h2>';
      S.qs.forEach(function (q, i) { if (q.type === s[0]) h += R.questionHTML(q, i, S.answers[i], 'checked'); });
    });
    h += '</main></div>';
    app.innerHTML = h;
  }

  // ---------- Sự kiện ----------
  function qIndex(el) { var a = el.closest('.q'); return a ? parseInt(a.getAttribute('data-i'), 10) : -1; }
  app.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]'); if (!t) return;
    var act = t.getAttribute('data-act'), i = qIndex(t);
    if (act === 'mode') { pickMode = t.getAttribute('data-v'); var y = window.scrollY; home(); window.scrollTo(0, y); }
    else if (act === 'start') {
      var raw = ($('#seed') || {}).value || '', sd = parseInt(raw, 10);
      start(t.getAttribute('data-id'), isNaN(sd) || sd <= 0 ? newSeed() : sd, pickMode);
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
  });
  app.addEventListener('input', function (e) {
    var t = e.target; if (t.getAttribute('data-act') !== 'short') return;
    var i = qIndex(t); if (i < 0 || !S) return;
    S.answers[i] = t.value; paint(i); counter();
  });
  window.addEventListener('beforeunload', function (e) { if (S && !S.done && S.mode === 'thi') { e.preventDefault(); e.returnValue = ''; } });

  home();
})(window);
