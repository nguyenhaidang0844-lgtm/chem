/* Bộ sinh câu tính toán (phần 2): chất béo, xà phòng */
(function (g) {
  'use strict';
  var C = g.Chem, f = C.fmt, Calc = g.Calc;

  // M chất béo và M muối (Na / K) của từng acid béo
  var FAT = {
    tristearin: { M: 890, acid: 'stearate', F: '(C17H35COO)3C3H5', Na: 306, K: 322 },
    triolein: { M: 884, acid: 'oleate', F: '(C17H33COO)3C3H5', Na: 304, K: 320 },
    tripalmitin: { M: 806, acid: 'palmitate', F: '(C15H31COO)3C3H5', Na: 278, K: 294 }
  };
  var FATNAMES = Object.keys(FAT);

  // Thủy phân m gam chất béo: biết glycerol + muối → tìm m (Đề THPT QG 2017)
  Calc.chatBeo = function () {
    return function (r) {
      var name = r.pick(FATNAMES), d = FAT[name], base = r.pick(['NaOH', 'KOH']);
      var mb = base === 'NaOH' ? 40 : 56, sM = base === 'NaOH' ? d.Na : d.K;
      var n = r.pick([0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.5]);
      var mGly = C.round(n * 92, 2), mSalt = C.round(n * 3 * sM, 2), m = C.round(n * d.M, 2);
      return {
        text: 'Thủy phân hoàn toàn m gam chất béo bằng dung dịch ' + base + ', đun nóng, thu được ' + f(mGly) + ' gam glycerol và ' + f(mSalt) + ' gam muối. Tính giá trị của m.',
        answer: m, tol: 0.0051,
        explain: 'n(glycerol) = ' + f(mGly) + ' : 92 = ' + f(n) + ' mol → n(' + base + ') = 3 × ' + f(n) + ' = ' + f(3 * n) + ' mol.\nBảo toàn khối lượng: m = ' + f(mSalt) + ' + ' + f(mGly) + ' − ' + mb + ' × ' + f(3 * n) + ' = ' + f(m) + ' gam.'
      };
    };
  };

  // Xà phòng hóa n mol triglyceride cụ thể → khối lượng glycerol hoặc muối
  Calc.xaPhongHoa = function (target) {
    return function (r) {
      var name = r.pick(FATNAMES), d = FAT[name], n = r.pick([0.05, 0.1, 0.15, 0.2, 0.25, 0.4]);
      var isGly = target === 'glycerol';
      var ans = C.round(isGly ? n * 92 : n * 3 * d.Na, 2);
      return {
        text: 'Xà phòng hóa hoàn toàn ' + f(n) + ' mol ' + name + ' ' + d.F + ' bằng dung dịch NaOH dư, đun nóng, thu được m gam ' + (isGly ? 'glycerol' : 'muối sodium ' + d.acid) + '. Tính giá trị của m.',
        answer: ans, tol: 0.0051,
        explain: 'Phương trình: ' + d.F + ' + 3NaOH → 3RCOONa + C3H5(OH)3.\n' + (isGly ? 'n(glycerol) = n(chất béo) = ' + f(n) + ' mol → m = ' + f(n) + ' × 92 = ' + f(ans) + ' gam.' :
          'n(muối) = 3 × ' + f(n) + ' = ' + f(3 * n) + ' mol → m = ' + f(3 * n) + ' × ' + d.Na + ' = ' + f(ans) + ' gam.')
      };
    };
  };

  // m gam chất béo + n mol NaOH vừa đủ → muối khan
  Calc.muoiKhan = function () {
    return function (r) {
      var k = r.int(1, 5), nN = C.round(0.03 * k, 2), d = FAT[r.pick(FATNAMES)];
      var m = C.round(nN / 3 * d.M, 2);
      var mS = C.round(m + 40 * nN - 92 * nN / 3, 2);
      return {
        text: 'Xà phòng hóa hoàn toàn ' + f(m) + ' gam chất béo X cần vừa đủ dung dịch chứa ' + f(nN) + ' mol NaOH. Cô cạn dung dịch sau phản ứng, thu được m gam muối khan. Tính giá trị của m.',
        answer: mS, tol: 0.0051,
        explain: 'n(glycerol) = ' + f(nN) + ' : 3 = ' + f(nN / 3, 3) + ' mol.\nBảo toàn khối lượng: m(muối) = ' + f(m) + ' + 40 × ' + f(nN) + ' − 92 × ' + f(nN / 3, 3) + ' = ' + f(mS) + ' gam.'
      };
    };
  };

  // Hydrogen hóa triolein: m gam → a mol H2 (Đề MH 2024)
  Calc.hydroTriolein = function (kind) {
    return function (r) {
      var k = r.int(1, 10), m = C.round(8.84 * k, 2), a = C.round(0.03 * k, 2);
      var text = 'Hydrogen hóa hoàn toàn ' + f(m) + ' gam triolein cần vừa đủ a mol khí H2 (Ni, t°). ' + (kind === 'short' ? 'Tính giá trị của a.' : 'Giá trị của a là');
      var expl = 'n(triolein) = ' + f(m) + ' : 884 = ' + f(a / 3) + ' mol. Mỗi phân tử triolein có 3 liên kết C=C nên a = 3 × ' + f(a / 3) + ' = ' + f(a) + ' mol.';
      if (kind === 'short') return { text: text, answer: a, tol: 0.0051, explain: expl };
      var o = Calc.numOptions(r, a, 2);
      return { text: text, options: o.options, answer: o.answer, explain: expl };
    };
  };

  // Hydro hóa triglyceride chứa 1 gốc palmitate: đếm số nguyên tử H (THPT)
  Calc.demH = function () {
    return function (r) {
      var kk = r.int(2, 4), n = r.pick([0.05, 0.1, 0.2]);
      var mP = C.round(n * 278, 2);
      return {
        text: 'Hydrogen hóa hoàn toàn ' + f(n) + ' mol triglyceride X cần dùng ' + f(kk * n) + ' mol H2 (Ni, t°) thu được chất hữu cơ Y. Đun nóng Y với dung dịch NaOH vừa đủ, thu được glycerol và hỗn hợp muối gồm sodium stearate và ' + f(mP) +
          ' gam sodium palmitate. Số nguyên tử hydrogen (H) trong phân tử X là bao nhiêu?',
        answer: 106 - 2 * kk, tol: 0.01,
        explain: 'n(sodium palmitate) = ' + f(mP) + ' : 278 = ' + f(n) + ' mol = n(X) → X có 1 gốc palmitate (C15H31COO) và 2 gốc C17.\nSố C=C trong X = ' + f(kk * n) + ' : ' + f(n) + ' = ' + kk +
          '. Hai gốc C17 no có 35 H mỗi gốc, mất 2H cho mỗi C=C: H(X) = 5 + 31 + 2 × 35 − 2 × ' + kk + ' = ' + (106 - 2 * kk) + '.'
      };
    };
  };

  // Hỗn hợp mỡ gồm tristearin, triolein, tripalmitin → khối lượng muối (SBT Hóa học 12)
  Calc.hhMo = function () {
    return function (r) {
      var a = r.pick([40, 45, 50, 55, 60]), b = r.pick([10, 15, 20, 25, 30]), c = 100 - a - b;
      var M = r.pick([50, 80, 100, 120, 150, 200]);
      var parts = [['tristearin', a, 890, 306], ['triolein', b, 884, 304], ['tripalmitin', c, 806, 278]];
      var tot = 0, lines = [];
      parts.forEach(function (p) {
        var mm = M * p[1] / 100, s = mm / p[2] * 3 * p[3]; tot += s;
        lines.push('m(' + p[0] + ') = ' + f(mm) + ' kg → m(muối) = ' + f(mm) + ' / ' + p[2] + ' × 3 × ' + p[3] + ' = ' + f(s, 2) + ' kg');
      });
      tot = C.round(tot, 1);
      return {
        text: 'Tính khối lượng muối (kg) dùng để sản xuất xà phòng, thu được khi cho ' + M + ' kg một loại mỡ chứa ' + a + '% tristearin; ' + b + '% triolein và ' + c +
          '% tripalmitin tác dụng với sodium hydroxide vừa đủ (hiệu suất 100%). Làm tròn kết quả đến hàng phần mười.',
        answer: tot, tol: 0.051,
        explain: lines.join('\n') + '\nTổng khối lượng muối ≈ ' + f(tot, 1) + ' kg.'
      };
    };
  };

  // Đổi NaOH sang KOH (SCĐ Hóa học 11 - CTST)
  Calc.doiKiem = function () {
    return function (r) {
      var m = r.pick([20, 30, 40, 50, 60, 80, 100, 120]);
      return {
        text: 'Lượng NaOH cần dùng trong một thí nghiệm điều chế xà phòng là ' + m + ' gam. Nếu thay NaOH bằng KOH (cùng số mol) thì khối lượng KOH cần dùng là bao nhiêu gam?',
        answer: C.round(m * 1.4, 2), tol: 0.0051,
        explain: 'n(NaOH) = ' + m + ' : 40 = ' + f(m / 40) + ' mol = n(KOH) → m(KOH) = ' + f(m / 40) + ' × 56 = ' + f(m * 1.4) + ' gam.'
      };
    };
  };

  // Chuyển một câu trả lời ngắn (gen) thành câu trắc nghiệm 4 đáp án
  Calc.mcq = function (gen, dp, suffix) {
    return function (r) {
      var q = gen(r), o = Calc.numOptions(r, q.answer, dp === undefined ? 2 : dp, suffix || '');
      return { text: q.text.replace(/Tính giá trị của (\w+)\.$/, 'Giá trị của $1 là'), options: o.options, answer: o.answer, explain: q.explain };
    };
  };

  // Phần trăm khối lượng oxygen trong muối tạo ra sau hydrogen hóa
  Calc.phanTramO = function () {
    return function (r) {
      var z = r.pick([['sodium stearate', 'C17H35COONa', 306], ['sodium palmitate', 'C15H31COONa', 278], ['potassium stearate', 'C17H35COOK', 322], ['potassium palmitate', 'C15H31COOK', 294]]);
      var v = C.round(3200 / z[2], 2);
      return {
        text: 'Xà phòng hóa hoàn toàn một chất béo, thu được glycerol và muối Z là ' + z[0] + ' (' + z[1] + '). Tính phần trăm khối lượng oxygen trong Z (làm tròn đến hàng phần trăm).',
        answer: v, tol: 0.0051,
        explain: 'M(' + z[1] + ') = ' + z[2] + '. %O = 32 : ' + z[2] + ' × 100% = ' + f(v) + '%.'
      };
    };
  };
})(window);
