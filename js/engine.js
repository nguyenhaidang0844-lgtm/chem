/* Tiện ích dùng chung: sinh số ngẫu nhiên theo seed, định dạng số/công thức, chấm điểm THPT */
(function (g) {
  'use strict';

  // ---------- RNG theo seed (mulberry32) ----------
  function makeRng(seed) {
    var a = (seed >>> 0) || 1;
    function next() {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    return {
      next: next,
      int: function (lo, hi) { return lo + Math.floor(next() * (hi - lo + 1)); },
      pick: function (arr) { return arr[Math.floor(next() * arr.length)]; },
      shuffle: function (arr) {
        var b = arr.slice();
        for (var i = b.length - 1; i > 0; i--) {
          var j = Math.floor(next() * (i + 1));
          var t = b[i]; b[i] = b[j]; b[j] = t;
        }
        return b;
      }
    };
  }

  // ---------- Định dạng ----------
  function round(x, dp) { var p = Math.pow(10, dp); return Math.round(x * p + 1e-9) / p; }
  // Số kiểu Việt Nam: 0,25 ; bỏ số 0 thừa
  function fmt(x, dp) {
    if (dp === undefined) dp = 2;
    var s = round(x, dp).toFixed(dp);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    return s.replace('.', ',');
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  // Công thức hóa học: C4H8O2 -> C<sub>4</sub>H<sub>8</sub>O<sub>2</sub>; ^{2+} -> <sup>2+</sup>
  function chem(s) {
    var t = esc(s);
    t = t.replace(/([A-Za-z\)\]])(\d+)/g, '$1<sub>$2</sub>');
    t = t.replace(/\^\{([^}]*)\}/g, '<sup>$1</sup>');
    t = t.replace(/_\{([^}]*)\}/g, '<sub>$1</sub>');
    t = t.replace(/\n/g, '<br>');
    return t;
  }

  // ---------- Đăng ký đề ----------
  var registry = { meta: [], parts: {} };
  var Exams = {
    define: function (meta) { registry.meta.push(meta); registry.parts[meta.id] = { mcq: [], tf: [], short: [] }; },
    part: function (id, kind, list) {
      var p = registry.parts[id];
      if (!p) throw new Error('Chưa khai báo đề ' + id);
      p[kind] = p[kind].concat(list);
    },
    list: function () { return registry.meta; },
    parts: function (id) { return registry.parts[id]; }
  };

  // ---------- Dựng đề từ seed ----------
  // Câu có thể là object thường hoặc { gen: function(r) { return {...}; } }
  var QUOTA = { mcq: 18, tf: 4, short: 6 };
  function metaOf(id) { return registry.meta.filter(function (m) { return m.id === id; })[0]; }
  // Đề "trộn" (meta.blend = [id, ...]): kho câu = gộp các đề nguồn
  function poolOf(id, kind) {
    var m = metaOf(id);
    if (!m || !m.blend) return registry.parts[id][kind];
    return m.blend.reduce(function (a, b) { return a.concat(registry.parts[b][kind]); }, []);
  }
  // Dấu vết để tránh chọn hai câu cùng dạng trong một đề trộn (số liệu được che đi)
  function signature(o) { return String(o.text).replace(/[\d,.]+/g, '#').replace(/\s+/g, ' ').slice(0, 70); }

  function build(id, seed) {
    var blend = !!(metaOf(id) && metaOf(id).blend);
    var r = makeRng(seed);
    function inst(q, i) {
      var qr = makeRng(seed * 131 + i * 7919 + 17);
      return typeof q === 'function' ? q(qr) : JSON.parse(JSON.stringify(q));
    }
    var out = [], seen = {};
    var n = 0;
    ['mcq', 'tf', 'short'].forEach(function (kind, ki) {
      var list = poolOf(id, kind), picked = [];
      if (blend) {
        var order = r.shuffle(list.map(function (_, i) { return i; }));
        for (var j = 0; j < order.length && picked.length < QUOTA[kind]; j++) {
          var o = inst(list[order[j]], order[j] + ki * 1000);
          var sig = signature(o);
          if (!seen[sig]) { seen[sig] = 1; picked.push(o); }
        }
      } else {
        picked = list.map(function (q) { return inst(q, n++); });
      }
      picked.forEach(function (o) {
        o.type = kind;
        if (kind === 'mcq') {
          var idx = o.options.map(function (_, i) { return i; });
          var fixed = o.fixed || o.options.every(function (t) { return /^[\d.,\s%]/.test(String(t)); });
          if (!fixed) idx = r.shuffle(idx);
          o.correct = idx.indexOf(o.answer);
          o.options = idx.map(function (i) { return o.options[i]; });
        }
        out.push(o);
      });
    });
    return out;
  }

  // ---------- Chấm điểm theo thang THPT ----------
  // Phần II: đúng 1 ý 0,1 ; 2 ý 0,25 ; 3 ý 0,5 ; 4 ý 1,0
  var TF_SCORE = [0, 0.1, 0.25, 0.5, 1];
  function parseNum(s) {
    if (s === undefined || s === null) return NaN;
    var t = String(s).trim().replace(/\s+/g, '').replace(',', '.');
    if (!/^-?\d+(\.\d+)?$/.test(t)) return NaN;
    return parseFloat(t);
  }
  function scoreQuestion(q, ans) {
    if (q.type === 'mcq') return ans === q.correct ? 0.25 : 0;
    if (q.type === 'short') {
      var v = parseNum(ans);
      if (isNaN(v)) return 0;
      var tol = q.tol !== undefined ? q.tol : 0.0051;
      return Math.abs(v - q.answer) <= tol ? 0.25 : 0;
    }
    if (q.type === 'tf') {
      if (!ans) return 0;
      var ok = 0;
      q.items.forEach(function (it, i) { if (ans[i] === it.a) ok++; });
      return TF_SCORE[ok];
    }
    return 0;
  }
  function isAnswered(q, ans) {
    if (q.type === 'tf') return !!ans && ans.some(function (x) { return x === true || x === false; });
    if (q.type === 'short') return ans !== undefined && String(ans).trim() !== '';
    return ans !== undefined && ans !== null;
  }
  function scoreExam(qs, answers) {
    var parts = { mcq: 0, tf: 0, short: 0 };
    qs.forEach(function (q, i) { parts[q.type] += scoreQuestion(q, answers[i]); });
    var total = parts.mcq + parts.tf + parts.short;
    return { parts: parts, total: Math.round(total * 100) / 100 };
  }

  g.Chem = {
    makeRng: makeRng, round: round, fmt: fmt, esc: esc, chem: chem,
    Exams: Exams, build: build, scoreQuestion: scoreQuestion, scoreExam: scoreExam,
    isAnswered: isAnswered, parseNum: parseNum, TF_SCORE: TF_SCORE
  };
})(window);
