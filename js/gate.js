/* Cổng đăng nhập: phải đăng nhập Google và điền đủ thông tin mới dùng được web.
   Nạp trong <head> của mọi trang, sau firebase-config.js và backend.js. */
(function (g, doc) {
  'use strict';
  var B = g.Backend;
  if (!B || !B.enabled) return;
  var HINT = 'chem.gate.v1', root = doc.documentElement;
  var U = null, editing = false, busy = false;

  function hint(v) { try { if (v) localStorage.setItem(HINT, v); else localStorage.removeItem(HINT); } catch (e) { /* bỏ qua */ } }
  function hasHint() { try { return !!localStorage.getItem(HINT); } catch (e) { return false; } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function clean(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  function complete(u) { var i = u && u.info; return !!(i && i.fullName && i.className && i.school && i.phone && u.name); }

  // Che nội dung ngay từ đầu (trước khi trang vẽ) nếu máy này chưa từng qua cổng
  var css = doc.createElement('style');
  css.textContent =
    'html.gate-lock body > :not(#gate){display:none!important}' +
    '#gate{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;overflow:auto;padding:16px;background:#3b0a1a;font-family:"Be Vietnam Pro",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#2a0a14}' +
    '#gate .g-in{background:#fff8fa;border:3px solid #2a0a14;box-shadow:8px 8px 0 #ff8fb3;padding:24px;width:min(100%,440px);margin:auto}' +
    '#gate h2{font-size:1.35rem;font-weight:900;text-transform:uppercase;color:#7a1633;margin:0 0 8px}' +
    '#gate p{margin:0 0 14px;color:#6d4a57;font-size:.92rem;line-height:1.5}' +
    '#gate label{display:block;font-weight:700;font-size:.85rem;margin:12px 0 4px}' +
    '#gate label small{font-weight:500;color:#6d4a57}' +
    '#gate input{width:100%;box-sizing:border-box;padding:10px 12px;border:2px solid #2a0a14;background:#fff;font:inherit;font-size:1rem}' +
    '#gate .g-err{color:#c8301a;font-weight:600;min-height:1.4em;margin:10px 0 0}' +
    '#gate .g-btn{display:inline-block;background:#ff8fb3;color:#2a0a14;border:2px solid #2a0a14;padding:12px 20px;font:inherit;font-weight:800;font-size:.85rem;letter-spacing:.04em;text-transform:uppercase;box-shadow:4px 4px 0 #2a0a14;cursor:pointer}' +
    '#gate .g-btn:hover{transform:translate(2px,2px);box-shadow:2px 2px 0 #2a0a14}' +
    '#gate .g-btn[disabled]{opacity:.6;cursor:wait}' +
    '#gate .g-row{display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin-top:14px}' +
    '#gate .g-link{background:none;border:0;padding:0;font:inherit;color:#7a1633;text-decoration:underline;cursor:pointer}' +
    '#gate .g-who{font-size:.85rem;color:#6d4a57;margin-top:16px}';
  doc.head.appendChild(css);
  if (!hasHint()) root.classList.add('gate-lock');

  function box() {
    var el = doc.getElementById('gate');
    if (!el) { el = doc.createElement('div'); el.id = 'gate'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); doc.body.appendChild(el); }
    return el;
  }
  function show(html) {
    root.classList.add('gate-lock');
    var el = box(); el.innerHTML = '<div class="g-in">' + html + '</div>';
    var f = el.querySelector('input'); if (f) f.focus();
  }
  function hide() { root.classList.remove('gate-lock'); var el = doc.getElementById('gate'); if (el) el.remove(); }

  function loadingView() { show('<h2>Ôn tập THPT</h2><p>Đang kiểm tra đăng nhập…</p>'); }
  function loginView(msg) {
    show('<h2>Đăng nhập</h2><p>Bạn cần đăng nhập bằng tài khoản Google và điền thông tin học sinh để sử dụng web ôn tập.</p>' +
      '<button class="g-btn" data-g="login">Đăng nhập bằng Google</button><p class="g-err">' + esc(msg || '') + '</p>');
  }
  function field(id, label, val, attrs) {
    return '<label for="g-' + id + '">' + label + '</label><input id="g-' + id + '" value="' + esc(val) + '" ' + attrs + '>';
  }
  function formView() {
    var i = (U && U.info) || {};
    show('<h2>' + (complete(U) ? 'Thông tin của bạn' : 'Thông tin học sinh') + '</h2>' +
      '<p>Điền đầy đủ để tiếp tục. Họ tên, lớp, trường và số điện thoại chỉ quản trị viên web xem được; bảng xếp hạng chỉ hiện biệt danh.</p>' +
      '<form data-g="form" novalidate>' +
      field('fullName', 'Họ và tên', i.fullName || (U && U.google) || '', 'maxlength="60" autocomplete="name" required') +
      field('className', 'Lớp <small>(ví dụ 12A1)</small>', i.className || '', 'maxlength="20" required') +
      field('school', 'Trường', i.school || '', 'maxlength="100" autocomplete="organization" required') +
      field('phone', 'Số điện thoại', i.phone || '', 'type="tel" maxlength="15" inputmode="tel" autocomplete="tel" required') +
      field('nick', 'Biệt danh <small>(hiện trên bảng xếp hạng, 2 – 20 ký tự)</small>', (U && U.name) || '', 'maxlength="20" required') +
      '<p class="g-err" id="g-err"></p>' +
      '<div class="g-row"><button class="g-btn" type="submit">' + (complete(U) ? 'Lưu' : 'Vào web') + '</button>' +
      (complete(U) ? '<button class="g-link" type="button" data-g="close">Đóng</button>' : '') +
      '<button class="g-link" type="button" data-g="logout">Đăng xuất</button></div>' +
      '<p class="g-who">Đang đăng nhập: ' + esc(U && (U.email || U.google)) + '</p></form>');
  }

  function val(id) { var el = doc.getElementById('g-' + id); return el ? clean(el.value) : ''; }
  function submit() {
    if (busy) return;
    var d = { fullName: val('fullName'), className: val('className').toUpperCase(), school: val('school'), phone: val('phone').replace(/[\s.\-()]/g, ''), nick: val('nick') };
    var err = doc.getElementById('g-err'), msg = '';
    if (d.fullName.length < 2) msg = 'Hãy nhập họ và tên.';
    else if (!d.className) msg = 'Hãy nhập lớp.';
    else if (d.school.length < 2) msg = 'Hãy nhập tên trường.';
    else if (!/^(0|\+84)[0-9]{9,10}$/.test(d.phone)) msg = 'Số điện thoại chưa đúng (ví dụ 0912345678).';
    else if (d.nick.length < 2 || d.nick.length > 20) msg = 'Biệt danh cần 2 – 20 ký tự.';
    if (msg) { err.textContent = msg; return; }
    busy = true; err.textContent = 'Đang lưu…';
    var btn = doc.querySelector('#gate button[type=submit]'); if (btn) btn.disabled = true;
    B.saveInfo(d).then(function () { busy = false; editing = false; render(); }).catch(function (e) {
      busy = false; if (btn) btn.disabled = false;
      err.textContent = (e && e.code === 'permission-denied') ? 'Máy chủ chưa cho phép lưu thông tin (quản trị viên cần cập nhật firestore.rules).' : 'Không lưu được, hãy kiểm tra mạng rồi thử lại.';
    });
  }

  function render() {
    if (!U) { hint(null); loginView(); return; }
    if (!complete(U)) { hint(null); formView(); return; }
    hint(U.uid);
    if (editing) formView(); else hide();
  }

  // Mở lại bảng thông tin (nút "Tài khoản" trên thanh trên cùng)
  g.ChemGate = { edit: function () { if (U && complete(U)) { editing = true; formView(); } } };
  function addAccountLink() {
    var bar = doc.querySelector('.topbar .tb-right');
    if (!bar || bar.querySelector('[data-g="acct"]')) return;
    var a = doc.createElement('button'); a.className = 'link'; a.type = 'button'; a.setAttribute('data-g', 'acct');
    a.style.cssText = 'color:#fff;background:none;border:0;cursor:pointer;font:inherit'; a.textContent = 'Tài khoản';
    bar.insertBefore(a, bar.firstChild);
  }

  doc.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-g]'); if (!t) return;
    var act = t.getAttribute('data-g');
    if (act === 'login') {
      t.disabled = true;
      B.signIn().catch(function (err) {
        var c = (err && err.code) || '';
        loginView(c === 'auth/popup-closed-by-user' || c === 'auth/cancelled-popup-request' ? '' : 'Không đăng nhập được (' + (c || 'lỗi mạng') + '). Hãy thử lại.');
      });
    } else if (act === 'logout') { editing = false; hint(null); B.signOut(); }
    else if (act === 'close') { editing = false; render(); }
    else if (act === 'acct') g.ChemGate.edit();
  });
  doc.addEventListener('submit', function (e) { if (e.target.getAttribute('data-g') === 'form') { e.preventDefault(); submit(); } });

  var ready = false;
  function start() {
    addAccountLink();
    if (!ready && !hasHint()) loadingView();
    // Không tải được Firebase (mất mạng, bị chặn) thì vẫn giữ khóa và cho thử lại
    setTimeout(function () { if (!ready && root.classList.contains('gate-lock')) show('<h2>Ôn tập THPT</h2><p>Không kết nối được máy chủ đăng nhập. Hãy kiểm tra mạng.</p><button class="g-btn" onclick="location.reload()">Thử lại</button>'); }, 15000);
  }
  B.onChange(function (u) { ready = true; U = u; if (doc.body) render(); else doc.addEventListener('DOMContentLoaded', render); });
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start); else start();
})(window, document);
