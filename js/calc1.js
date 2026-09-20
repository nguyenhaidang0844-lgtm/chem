/* Bộ sinh câu tính toán (phần 1): ester. Mỗi hàm trả về gen(r) -> câu hỏi với số liệu ngẫu nhiên. */
(function (g) {
  'use strict';
  var C = g.Chem, f = C.fmt;
  var Calc = g.Calc = g.Calc || {};

  // Tạo 4 đáp án số (đã sắp tăng dần) gồm đáp án đúng và 3 phương án nhiễu
  Calc.numOptions = function (r, correct, dp, suffix, cands) {
    suffix = suffix || '';
    cands = cands || [0.8, 1.25, 0.9, 1.1, 1.5, 0.6, 1.2, 0.75];
    var seen = {}; var key = f(correct, dp); seen[key] = 1;
    var vals = [];
    r.shuffle(cands).forEach(function (m) {
      var v = C.round(correct * m, dp), k = f(v, dp);
      if (vals.length < 3 && !seen[k] && v > 0) { seen[k] = 1; vals.push(v); }
    });
    vals.push(C.round(correct, dp));
    vals.sort(function (a, b) { return a - b; });
    return {
      options: vals.map(function (v) { return f(v, dp) + suffix; }),
      answer: vals.indexOf(C.round(correct, dp))
    };
  };

  var ACIDS = [
    { n: 'acetic acid', F: 'CH3COOH', M: 60 },
    { n: 'propionic acid', F: 'C2H5COOH', M: 74 },
    { n: 'formic acid', F: 'HCOOH', M: 46 }
  ];
  var ALC = [{ n: 'ethyl alcohol', F: 'C2H5OH', M: 46 }, { n: 'methyl alcohol', F: 'CH3OH', M: 32 }];

  // Hiệu suất phản ứng ester hóa (acid + alcohol dư)
  Calc.hieuSuat = function (kind) {
    return function (r) {
      var a = r.pick(ACIDS), al = r.pick(ALC);
      var Me = a.M + al.M - 18;
      var H = r.pick([60, 65, 70, 75, 80, 85]);
      var n = r.pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6]);
      var mA = C.round(n * a.M, 2), mE = C.round(n * Me * H / 100, 2);
      var text = 'Đun nóng ' + f(mA) + ' gam ' + a.n + ' (' + a.F + ') với lượng dư ' + al.n + ' (' + al.F +
        ', xúc tác H2SO4 đặc), thu được ' + f(mE) + ' gam ester. Hiệu suất của phản ứng ester hóa là' + (kind === 'short' ? ' bao nhiêu phần trăm?' : '');
      var expl = 'n(' + a.F + ') = ' + f(mA) + ' : ' + a.M + ' = ' + f(n) + ' mol. Alcohol dư nên tính theo acid: ester lí thuyết = ' + f(n) +
        ' mol, khối lượng = ' + f(n) + ' × ' + Me + ' = ' + f(n * Me) + ' gam.\nH = ' + f(mE) + ' : ' + f(n * Me) + ' × 100% = ' + H + '%.';
      if (kind === 'short') return { text: text, answer: H, tol: 0.5, unit: '%', explain: expl };
      var cands = [H - 15, H - 10, H - 5, H + 5, H + 10].filter(function (x) { return x > 0 && x < 100; });
      var opt = r.shuffle(cands).slice(0, 3).concat([H]).sort(function (x, y) { return x - y; });
      return { text: text, options: opt.map(function (x) { return x + '%'; }), answer: opt.indexOf(H), explain: expl };
    };
  };

  // Dầu chuối: isoamyl acetate (16,2 g acetic + 15,2 g isoamyl alcohol ...)
  Calc.dauChuoi = function () {
    return function (r) {
      var nAl = r.pick([0.15, 0.2, 0.25, 0.3, 0.4]);
      var H = r.pick([60, 65, 70, 75, 80, 85]);
      var mAl = nAl * 88, mAc = C.round(nAl * r.pick([1.5, 2, 2.5]) * 60, 2), mE = C.round(nAl * 130 * H / 100, 2);
      return {
        text: 'Isoamyl acetate có mùi thơm của chuối chín nên còn gọi là dầu chuối. Đun nóng hỗn hợp gồm ' + f(mAc) + ' gam acetic acid và ' + f(mAl) +
          ' gam isoamyl alcohol ((CH3)2CHCH2CH2OH) với xúc tác H2SO4 đặc, thu được ' + f(mE) + ' gam dầu chuối. Tính hiệu suất phản ứng (%).',
        answer: H, tol: 0.5,
        explain: 'n(acetic acid) = ' + f(mAc / 60) + ' mol ; n(isoamyl alcohol) = ' + f(nAl) + ' mol → alcohol thiếu, tính theo alcohol.\n' +
          'Ester lí thuyết = ' + f(nAl) + ' × 130 = ' + f(nAl * 130) + ' gam.\nH = ' + f(mE) + ' : ' + f(nAl * 130) + ' × 100% = ' + H + '%.'
      };
    };
  };

  // Methyl salicylate (Đề MH 2024): khối lượng salicylic acid (tấn)
  Calc.salicylate = function () {
    return function (r) {
      var N = r.pick([2.5, 3, 3.2, 3.8, 4, 4.5, 5]), w = r.pick([2, 2.4, 2.5, 2.7, 3]), H = r.pick([60, 70, 75, 80, 90]);
      var m = N * w * 138 / 152 / (H / 100);
      m = C.round(m, 3);
      var o = Calc.numOptions(r, m, 3);
      return {
        text: 'Methyl salicylate dùng làm thuốc xoa bóp giảm đau, điều chế theo phản ứng: HOC6H4COOH + CH3OH ⇌ HOC6H4COOCH3 + H2O. Để sản xuất ' + f(N) +
          ' triệu tuýp thuốc, mỗi tuýp chứa ' + f(w) + ' gam methyl salicylate, cần tối thiểu m tấn salicylic acid. Biết hiệu suất tính theo salicylic acid là ' + H +
          '%. Giá trị của m là',
        options: o.options, answer: o.answer,
        explain: 'm(ester) = ' + f(N) + ' × ' + f(w) + ' = ' + f(N * w) + ' tấn. M(salicylic acid) = 138 ; M(methyl salicylate) = 152.\nm = ' + f(N * w) + ' × 138 / 152 : ' + f(H / 100) + ' = ' + f(m, 3) + ' tấn.'
      };
    };
  };

  var ESTERS = [
    { F: 'HCOOCH3', M: 60, salt: 68, S: 'HCOONa', alc: 'CH3OH' },
    { F: 'HCOOC2H5', M: 74, salt: 68, S: 'HCOONa', alc: 'C2H5OH' },
    { F: 'CH3COOCH3', M: 74, salt: 82, S: 'CH3COONa', alc: 'CH3OH' },
    { F: 'CH3COOC2H5', M: 88, salt: 82, S: 'CH3COONa', alc: 'C2H5OH' },
    { F: 'C2H5COOCH3', M: 88, salt: 96, S: 'C2H5COONa', alc: 'CH3OH' },
    { F: 'HCOOCH2CH2CH3', M: 88, salt: 68, S: 'HCOONa', alc: 'C3H7OH' },
    { F: 'C2H5COOC2H5', M: 102, salt: 96, S: 'C2H5COONa', alc: 'C2H5OH' },
    { F: 'CH3COOCH2CH2CH3', M: 102, salt: 82, S: 'CH3COONa', alc: 'C3H7OH' }
  ];

  // Xác định CTCT ester no đơn chức từ tỉ khối + khối lượng muối (Đề TSĐH B - 2007)
  Calc.esterTuMuoi = function () {
    return function (r) {
      var e = r.pick(ESTERS.slice(1)), n = r.pick([0.02, 0.025, 0.04, 0.05]);
      var same = ESTERS.filter(function (x) { return x.M === e.M; });
      var opts = same.slice(0, 3).map(function (x) { return x.F; });
      var others = ESTERS.filter(function (x) { return x.M !== e.M; });
      while (opts.length < 4) { var o = r.pick(others).F; if (opts.indexOf(o) < 0) opts.push(o); }
      return {
        text: 'X là một ester no, đơn chức, mạch hở, có tỉ khối hơi so với CH4 là ' + f(e.M / 16, 3) + '. Đun ' + f(n * e.M) + ' gam X với dung dịch NaOH dư thu được ' + f(n * e.salt) +
          ' gam muối. Công thức cấu tạo thu gọn của X là',
        options: opts, answer: opts.indexOf(e.F),
        explain: 'M(X) = 16 × ' + f(e.M / 16, 3) + ' = ' + e.M + ' → n(X) = ' + f(n * e.M) + ' : ' + e.M + ' = ' + f(n) + ' mol. M(muối) = ' + f(n * e.salt) + ' : ' + f(n) + ' = ' + e.salt +
          ' → muối là ' + e.S + '. Vậy X là ' + e.F + '.'
      };
    };
  };

  // Tên ester từ khối lượng ester và alcohol tạo thành (Đề THPT QG 2023)
  var ACYL = [['formate', 'HCOO', 0], ['acetate', 'CH3COO', 14], ['propionate', 'C2H5COO', 28], ['butyrate', 'C3H7COO', 42]];
  Calc.tenEster = function () {
    return function (r) {
      var al = r.pick([{ n: 'methyl', F: 'CH3OH', M: 32, R: 15 }, { n: 'ethyl', F: 'C2H5OH', M: 46, R: 29 }]);
      var k = r.int(0, 3), n = r.pick([0.05, 0.1, 0.15, 0.2, 0.25]);
      var M = 44 + al.R + [1, 15, 29, 43][k];
      var names = ACYL.map(function (a) { return al.n + ' ' + a[0]; });
      return {
        text: 'Cho ' + f(n * M) + ' gam ester X đơn chức phản ứng hoàn toàn với dung dịch NaOH, thu được ' + f(n * al.M) + ' gam ' + al.F + '. Tên của X là',
        options: names, answer: k,
        explain: 'n(' + al.F + ') = ' + f(n * al.M) + ' : ' + al.M + ' = ' + f(n) + ' mol = n(X) → M(X) = ' + f(n * M) + ' : ' + f(n) + ' = ' + M + '. Ester RCOO' + al.F.replace('OH', '') +
          ' có M = ' + M + ' nên X là ' + names[k] + '.'
      };
    };
  };

  // Khối lượng alcohol khi thủy phân ester đơn chức (Đề MH 2023)
  Calc.mAlcohol = function () {
    return function (r) {
      var e = r.pick(ESTERS.slice(0, 7)), n = r.pick([0.1, 0.15, 0.2, 0.25, 0.3]);
      var m = C.round(n * (e.M + 40 - e.salt), 2);
      var CT = 'C' + ((e.M - 32) / 14) + 'H' + ((e.M - 32) / 7) + 'O2';
      return {
        text: 'Thủy phân hoàn toàn ' + f(n * e.M) + ' gam ester đơn chức X (công thức phân tử ' + CT + ') bằng dung dịch NaOH dư, đun nóng, thu được ' + f(n * e.salt) +
          ' gam muối Y và m gam alcohol Z. Tính giá trị của m.',
        answer: m, tol: 0.0051,
        explain: 'n(X) = ' + f(n * e.M) + ' : ' + e.M + ' = ' + f(n) + ' mol = n(NaOH). Bảo toàn khối lượng: m(Z) = ' + f(n * e.M) + ' + 40 × ' + f(n) + ' − ' + f(n * e.salt) + ' = ' + f(m) + ' gam.'
      };
    };
  };

  // Hỗn hợp hai ester đơn chức + NaOH → khối lượng muối
  Calc.hhEster = function () {
    return function (r) {
      var i = r.int(0, ESTERS.length - 1), j = (i + r.int(1, ESTERS.length - 1)) % ESTERS.length;
      var e1 = ESTERS[i], e2 = ESTERS[j], a = r.pick([0.1, 0.15, 0.2, 0.25]), b = r.pick([0.1, 0.2, 0.25, 0.3]);
      var m = C.round(a * e1.salt + b * e2.salt, 2);
      return {
        text: 'Cho hỗn hợp X gồm ' + f(a) + ' mol ' + e1.F + ' và ' + f(b) + ' mol ' + e2.F + ' tác dụng vừa đủ với dung dịch NaOH, đun nóng. Cô cạn dung dịch sau phản ứng, thu được m gam muối khan. Tính giá trị của m.',
        answer: m, tol: 0.0051,
        explain: e1.F + ' + NaOH → ' + e1.S + ' + ' + e1.alc + ' (' + f(a) + ' mol ' + e1.S + ', M = ' + e1.salt + ').\n' + e2.F + ' + NaOH → ' + e2.S + ' + ' + e2.alc + ' (' + f(b) + ' mol ' + e2.S + ', M = ' + e2.salt + ').\nm = ' + f(a) + ' × ' + e1.salt + ' + ' + f(b) + ' × ' + e2.salt + ' = ' + f(m) + ' gam.'
      };
    };
  };

  // Đốt cháy ester no, đơn chức, mạch hở: n(H2O) = n(CO2)
  Calc.dotChay = function () {
    return function (r) {
      var k = r.int(3, 5), n = r.pick([0.05, 0.1, 0.15, 0.2]);
      var V = C.round(n * k * 22.4, 2), m = C.round(n * k * 18, 2);
      return {
        text: 'Đốt cháy hoàn toàn ' + f(n) + ' mol một ester no, đơn chức, mạch hở X (chứa ' + k + ' nguyên tử carbon), thu được V lít CO2 (đktc) và m gam H2O. Tính giá trị của m.',
        answer: m, tol: 0.0051,
        explain: 'Ester no, đơn chức, mạch hở có dạng C' + k + 'H' + (2 * k) + 'O2 nên khi cháy n(H2O) = n(CO2) = ' + f(n) + ' × ' + k + ' = ' + f(n * k) + ' mol.\nm(H2O) = ' + f(n * k) + ' × 18 = ' + f(m) + ' gam (V(CO2) = ' + f(V) + ' lít).'
      };
    };
  };
})(window);
