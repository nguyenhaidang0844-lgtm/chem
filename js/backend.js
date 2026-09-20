/* Đăng nhập Google + bảng xếp hạng bằng Firebase (Auth + Firestore), nạp SDK từ CDN khi cần.
   Dữ liệu:  profiles/{uid} = { name }
             scores/{uid}_{examId} = { uid, name, examId, score, time, at }  (điểm cao nhất mỗi người mỗi đề) */
(function (g) {
  'use strict';
  var cfg = g.CHEM_FIREBASE;
  var enabled = !!(cfg && cfg.apiKey && cfg.projectId);
  var SDK = 'https://www.gstatic.com/firebasejs/10.12.2/';
  var fb = null, loading = null, user = null, listeners = [];
  var cache = {};

  function load() {
    if (loading) return loading;
    loading = Promise.all([import(SDK + 'firebase-app.js'), import(SDK + 'firebase-auth.js'), import(SDK + 'firebase-firestore.js')]).then(function (m) {
      var app = m[0].initializeApp(cfg);
      fb = { A: m[1], F: m[2], auth: m[1].getAuth(app), db: m[2].getFirestore(app) };
      fb.A.onAuthStateChanged(fb.auth, function (u) {
        if (!u) { user = null; emit(); return; }
        fb.F.getDoc(fb.F.doc(fb.db, 'profiles', u.uid)).then(function (s) {
          user = { uid: u.uid, name: s.exists() ? s.data().name : null, google: (u.displayName || '').split(' ').pop() };
          emit();
        }).catch(function () { user = { uid: u.uid, name: null, google: '' }; emit(); });
      });
      return fb;
    });
    return loading;
  }
  function emit() { listeners.forEach(function (f) { f(user); }); }
  function validName(n) { return typeof n === 'string' && n.trim().length >= 2 && n.trim().length <= 20; }

  var Backend = {
    enabled: enabled,
    user: function () { return user; },
    // Đăng ký nhận thay đổi trạng thái đăng nhập (gọi ngay khi có kết quả đầu tiên)
    onChange: function (f) { listeners.push(f); if (enabled) load().catch(function () { /* mất mạng: coi như chưa đăng nhập */ }); },
    signIn: function () {
      return load().then(function () { return fb.A.signInWithPopup(fb.auth, new fb.A.GoogleAuthProvider()); });
    },
    signOut: function () { return load().then(function () { return fb.A.signOut(fb.auth); }); },
    // Đặt/đổi biệt danh và cập nhật tên trên các điểm đã có
    setName: function (name) {
      name = String(name || '').trim();
      if (!validName(name)) return Promise.reject(new Error('Biệt danh cần 2 – 20 ký tự.'));
      var F = fb.F, uid = user.uid;
      return F.setDoc(F.doc(fb.db, 'profiles', uid), { name: name }).then(function () {
        return F.getDocs(F.query(F.collection(fb.db, 'scores'), F.where('uid', '==', uid)));
      }).then(function (snap) {
        return Promise.all(snap.docs.map(function (d) { var x = d.data(); x.name = name; x.at = F.serverTimestamp(); return F.setDoc(d.ref, x); }));
      }).then(function () { user.name = name; cache = {}; emit(); });
    },
    // Lưu điểm nếu tốt hơn kỷ lục cũ: điểm cao hơn, hoặc bằng điểm nhưng nhanh hơn
    submit: function (examId, score, time) {
      var F = fb.F, ref = F.doc(fb.db, 'scores', user.uid + '_' + examId);
      return F.getDoc(ref).then(function (s) {
        var old = s.exists() ? s.data() : null;
        if (old && !(score > old.score || (score === old.score && time < old.time))) return { saved: false, best: old.score };
        return F.setDoc(ref, { uid: user.uid, name: user.name, examId: examId, score: score, time: time, at: F.serverTimestamp() }).then(function () { cache = {}; return { saved: true, best: score, first: !old }; });
      });
    },
    // Bảng xếp hạng: examId hoặc 'total'. Sắp xếp phía trình duyệt để không cần tạo chỉ mục Firestore.
    board: function (examId) {
      var hit = cache[examId];
      if (hit && Date.now() - hit.t < 60000) return Promise.resolve(hit.rows);
      return load().then(function () {
        var F = fb.F, col = F.collection(fb.db, 'scores');
        var q = examId === 'total' ? F.query(col, F.limit(600)) : F.query(col, F.where('examId', '==', examId), F.limit(200));
        return F.getDocs(q);
      }).then(function (snap) {
        var rows = [];
        if (examId === 'total') {
          var by = {};
          snap.forEach(function (d) { var x = d.data(), r = by[x.uid] || (by[x.uid] = { uid: x.uid, name: x.name, score: 0, time: 0, n: 0 }); r.score += x.score; r.time += x.time; r.n++; r.name = x.name; });
          rows = Object.keys(by).map(function (k) { by[k].score = Math.round(by[k].score * 100) / 100; return by[k]; });
        } else {
          snap.forEach(function (d) { rows.push(d.data()); });
        }
        rows.sort(function (a, b) { return b.score - a.score || a.time - b.time; });
        rows = rows.slice(0, 20);
        cache[examId] = { t: Date.now(), rows: rows };
        return rows;
      });
    }
  };
  g.Backend = Backend;
})(window);
