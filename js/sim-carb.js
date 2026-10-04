/* Mô phỏng Chương 2 · Carbohydrate
   1. Mạch hở ⇄ mạch vòng (glucose, fructose)   2. Bàn thí nghiệm nhận biết   3. Máy tính bài toán */
(function (g) {
  'use strict';
  var LT = g.LT, C = LT.chem, F = LT.fmt;

  // ================= 2. BÀN THÍ NGHIỆM NHẬN BIẾT =================
  var SUBS = [
    { id: 'glu', name: 'Glucose', f: 'C6H12O6' },
    { id: 'fru', name: 'Fructose', f: 'C6H12O6' },
    { id: 'sac', name: 'Saccharose', f: 'C12H22O11' },
    { id: 'mal', name: 'Maltose', f: 'C12H22O11' },
    { id: 'tb', name: 'Tinh bột', f: '(C6H10O5)_{n}' },
    { id: 'cel', name: 'Cellulose', f: '(C6H10O5)_{n}' }
  ];
  var RG = [
    { id: 'h2o', name: 'Nước', full: 'Hòa tan vào nước (đun nóng với tinh bột)' },
    { id: 'cu', name: 'Cu(OH)2', full: 'Cu(OH)2 ở nhiệt độ thường' },
    { id: 'cuh', name: 'Cu(OH)2/OH^{–}, t°', full: 'Cu(OH)2 trong NaOH, đun nóng' },
    { id: 'ag', name: 'Tollens, t°', full: 'Thuốc thử Tollens (AgNO3 trong NH3), đun nóng' },
    { id: 'br', name: 'Nước bromine', full: 'Nước bromine' },
    { id: 'i2', name: 'Iodine', full: 'Dung dịch iodine' },
    { id: 'hy', name: 'Thủy phân → Tollens', full: 'Thủy phân bằng H2SO4 loãng, đun nóng; trung hòa rồi thử Tollens' }
  ];
  // look: liq = màu dung dịch, ppt = màu kết tủa đáy, mirror = tráng bạc, solid = chất rắn, heat = đun nóng, tag = chữ ngắn cho bảng
  var CLEAR = '#e9f4fb', CUSUS = '#cfe6f6', BLUE = '#2f62c9', RED = '#b5381f', BRW = '#f0a43a', IOD = '#e2b45a', VIOLET = '#3e2a8c', MILK = '#efe9df';
  function L(liq, extra) { var o = { liq: liq }; for (var k in extra) o[k] = extra[k]; return o; }
  var LAB = {
    h2o: {
      glu: [L(CLEAR), 'Tan tốt, tạo dung dịch trong suốt, có vị ngọt.', '', 'tan'],
      fru: [L(CLEAR), 'Tan tốt, tạo dung dịch trong suốt, ngọt hơn glucose.', '', 'tan'],
      sac: [L(CLEAR), 'Tan tốt, tạo dung dịch trong suốt.', '', 'tan'],
      mal: [L(CLEAR), 'Tan tốt, tạo dung dịch trong suốt.', '', 'tan'],
      tb: [L(MILK, { heat: 1 }), 'Không tan trong nước lạnh. Trong nước nóng, hạt tinh bột ngậm nước, trương phồng tạo dung dịch keo gọi là hồ tinh bột.', '', 'hồ (nóng)'],
      cel: [L(CLEAR, { solid: 'fiber' }), 'Không tan trong nước, kể cả khi đun nóng; sợi trắng vẫn còn nguyên.', '', 'không tan']
    },
    cu: {
      glu: [L(BLUE), 'Cu(OH)2 tan, tạo dung dịch màu xanh lam. Glucose có nhiều nhóm –OH liền kề.', '2C6H12O6 + Cu(OH)2 → (C6H11O6)2Cu + 2H2O', 'xanh lam'],
      fru: [L(BLUE), 'Cu(OH)2 tan, tạo dung dịch màu xanh lam. Fructose có nhiều nhóm –OH liền kề.', '2C6H12O6 + Cu(OH)2 → (C6H11O6)2Cu + 2H2O', 'xanh lam'],
      sac: [L(BLUE), 'Cu(OH)2 tan, tạo dung dịch màu xanh lam.', '2C12H22O11 + Cu(OH)2 → (C12H21O11)2Cu + 2H2O', 'xanh lam'],
      mal: [L(BLUE), 'Cu(OH)2 tan, tạo dung dịch màu xanh lam.', '2C12H22O11 + Cu(OH)2 → (C12H21O11)2Cu + 2H2O', 'xanh lam'],
      tb: [L(CUSUS, { ppt: '#5b9be0' }), 'Không có hiện tượng: Cu(OH)2 không tan, kết tủa xanh vẫn còn.', '', '–'],
      cel: [L(CUSUS, { ppt: '#5b9be0', solid: 'fiber' }), 'Không có hiện tượng: Cu(OH)2 không tan, kết tủa xanh vẫn còn.', '', '–']
    },
    cuh: {
      glu: [L('#9fc3e8', { ppt: RED, heat: 1 }), 'Xuất hiện kết tủa đỏ gạch Cu2O: nhóm –CHO của glucose khử Cu(II).', 'HOCH2[CHOH]4CHO + 2Cu(OH)2 + NaOH →{t°} HOCH2[CHOH]4COONa + Cu2O↓ + 3H2O', 'đỏ gạch'],
      fru: [L('#9fc3e8', { ppt: RED, heat: 1 }), 'Xuất hiện kết tủa đỏ gạch Cu2O: trong môi trường kiềm, fructose chuyển hóa thành glucose.', 'fructose ⇌{OH^{–}} glucose; glucose khử Cu(OH)2 thành Cu2O↓', 'đỏ gạch'],
      sac: [L(BLUE, { heat: 1 }), 'Dung dịch vẫn xanh lam, không có kết tủa đỏ gạch: saccharose không có tính khử.', '', 'xanh lam'],
      mal: [L('#9fc3e8', { ppt: RED, heat: 1 }), 'Xuất hiện kết tủa đỏ gạch Cu2O: maltose còn nhóm –OH hemiacetal, mở vòng tạo nhóm –CHO.', 'C12H22O11 (maltose) khử 2Cu(OH)2 → Cu2O↓', 'đỏ gạch'],
      tb: [L(CUSUS, { ppt: '#222', heat: 1 }), 'Không có kết tủa đỏ gạch. Cu(OH)2 bị nhiệt phân thành CuO màu đen.', 'Cu(OH)2 →{t°} CuO + H2O', '–'],
      cel: [L(CUSUS, { ppt: '#222', heat: 1, solid: 'fiber' }), 'Không có kết tủa đỏ gạch. Cu(OH)2 bị nhiệt phân thành CuO màu đen.', 'Cu(OH)2 →{t°} CuO + H2O', '–']
    },
    ag: {
      glu: [L(CLEAR, { mirror: 1, heat: 1 }), 'Có lớp bạc sáng bám trên thành ống nghiệm (phản ứng tráng bạc).', 'HOCH2[CHOH]4CHO + 2[Ag(NH3)2]OH →{t°} HOCH2[CHOH]4COONH4 + 2Ag↓ + 3NH3 + H2O', 'Ag↓'],
      fru: [L(CLEAR, { mirror: 1, heat: 1 }), 'Có lớp bạc sáng: trong môi trường kiềm của NH3, fructose chuyển thành glucose rồi tráng bạc.', 'C6H12O6 (fructose) → 2Ag↓', 'Ag↓'],
      sac: [L(CLEAR, { heat: 1 }), 'Không có hiện tượng: saccharose không có nhóm –CHO, không mở vòng được.', '', '–'],
      mal: [L(CLEAR, { mirror: 1, heat: 1 }), 'Có lớp bạc sáng: maltose mở vòng tạo nhóm –CHO. 1 mol maltose tạo 2 mol Ag.', 'C12H22O11 (maltose) → 2Ag↓', 'Ag↓'],
      tb: [L(MILK, { heat: 1 }), 'Không có hiện tượng tráng bạc.', '', '–'],
      cel: [L(CLEAR, { heat: 1, solid: 'fiber' }), 'Không có hiện tượng tráng bạc.', '', '–']
    },
    br: {
      glu: [L('#f6f7f2'), 'Nước bromine mất màu: nhóm –CHO bị oxi hóa thành –COOH.', 'HOCH2[CHOH]4CHO + Br2 + H2O → HOCH2[CHOH]4COOH + 2HBr', 'mất màu'],
      fru: [L(BRW), 'Không mất màu: fructose không có nhóm –CHO và không chuyển thành glucose trong môi trường này. Dùng nước bromine để phân biệt glucose với fructose.', '', '–'],
      sac: [L(BRW), 'Không mất màu nước bromine.', '', '–'],
      mal: [L('#f6f7f2'), 'Nước bromine mất màu: maltose mở vòng có nhóm –CHO.', '', 'mất màu'],
      tb: [L(BRW), 'Không mất màu nước bromine.', '', '–'],
      cel: [L(BRW, { solid: 'fiber' }), 'Không mất màu nước bromine.', '', '–']
    },
    i2: {
      glu: [L(IOD), 'Không đổi màu (vẫn là màu vàng nâu nhạt của iodine).', '', '–'],
      fru: [L(IOD), 'Không đổi màu.', '', '–'],
      sac: [L(IOD), 'Không đổi màu.', '', '–'],
      mal: [L(IOD), 'Không đổi màu.', '', '–'],
      tb: [L(VIOLET), 'Hồ tinh bột hóa xanh tím. Đun nóng màu mất đi, để nguội màu xanh tím xuất hiện trở lại (iodine bị giữ trong lòng mạch xoắn amylose).', '', 'xanh tím'],
      cel: [L(IOD, { solid: 'fiber' }), 'Không có màu xanh tím: cellulose mạch thẳng, không giữ iodine như amylose.', '', '–']
    },
    hy: {
      glu: [L(CLEAR, { mirror: 1, heat: 1 }), 'Glucose không bị thủy phân (monosaccharide) nhưng vốn có nhóm –CHO nên vẫn tráng bạc.', '', 'Ag↓'],
      fru: [L(CLEAR, { mirror: 1, heat: 1 }), 'Fructose không bị thủy phân nhưng vẫn tráng bạc (chuyển thành glucose trong môi trường kiềm).', '', 'Ag↓'],
      sac: [L(CLEAR, { mirror: 1, heat: 1 }), 'Saccharose bị thủy phân thành glucose và fructose nên dung dịch thu được tráng bạc. 1 mol saccharose → 4 mol Ag.', 'C12H22O11 + H2O →{H^{+}, t°} C6H12O6 (glucose) + C6H12O6 (fructose)', 'Ag↓'],
      mal: [L(CLEAR, { mirror: 1, heat: 1 }), 'Maltose bị thủy phân thành glucose nên tráng bạc. 1 mol maltose → 2 mol glucose → 4 mol Ag.', 'C12H22O11 + H2O →{H^{+}, t°} 2C6H12O6 (glucose)', 'Ag↓'],
      tb: [L(CLEAR, { mirror: 1, heat: 1 }), 'Tinh bột bị thủy phân hoàn toàn thành glucose nên dung dịch thu được tráng bạc.', '(C6H10O5)_{n} + nH2O →{H^{+}, t°} nC6H12O6', 'Ag↓'],
      cel: [L(CLEAR, { mirror: 1, heat: 1 }), 'Cellulose bị thủy phân (cần acid và đun nóng lâu) thành glucose nên dung dịch thu được tráng bạc.', '(C6H10O5)_{n} + nH2O →{H^{+}, t°} nC6H12O6', 'Ag↓']
    }
  };
  function lab(sub, rg) { var r = LAB[rg][sub]; return { look: r[0], text: r[1], eq: r[2], tag: r[3] }; }

  // ================= 3. MÁY TÍNH BÀI TOÁN =================
  var VDKC = 24.79; // L/mol ở điều kiện chuẩn (25 °C, 1 bar)
  function calcStarch(o) {
    var mS = o.m * o.pct / 100, n = mS / 162, nG = n * o.h1 / 100, nE = 2 * nG * o.h2 / 100, mE = nE * 46, vE = mE / 0.8;
    return { mS: mS, n: n, nG: nG, mG: nG * 180, nE: nE, mE: mE, vE: vE, vR: vE * 100 / o.deg, nCO2: nE, mCa: nE * 100 };
  }
  function calcFerment(o) {
    var n = o.m / 180, nE = 2 * n * o.h / 100;
    return { n: n, nE: nE, mE: nE * 46, nCO2: nE, vCO2: nE * VDKC, mCa: nE * 100 };
  }
  var SILVER = {
    glu: { name: 'glucose', sh: 'glucose', M: 180, k: 'Glucose có nhóm –CHO: 1 mol glucose → 2 mol Ag.' },
    fru: { name: 'fructose', sh: 'fructose', M: 180, k: 'Fructose chuyển thành glucose trong môi trường kiềm: 1 mol → 2 mol Ag.' },
    mal: { name: 'maltose', sh: 'maltose', M: 342, k: 'Maltose còn –OH hemiacetal, tráng bạc trực tiếp: 1 mol → 2 mol Ag.' },
    sacH: { name: 'saccharose (thủy phân rồi tráng bạc)', sh: 'saccharose', M: 342, hyd: 1, k: 'Saccharose → glucose + fructose: phần bị thủy phân cho 4 mol Ag/mol; phần chưa thủy phân không tráng bạc.' },
    malH: { name: 'maltose (thủy phân rồi tráng bạc)', sh: 'maltose', M: 342, hyd: 1, k: 'Maltose → 2 glucose: phần bị thủy phân cho 4 mol Ag/mol; phần maltose còn dư vẫn tráng bạc (2 mol Ag/mol).' },
    tbH: { name: 'tinh bột (thủy phân rồi tráng bạc)', sh: 'C6H10O5', M: 162, hyd: 1, k: 'Mỗi mắt xích C6H10O5 thủy phân tạo 1 glucose → 2 Ag.' }
  };
  function calcSilver(o) {
    var s = SILVER[o.sub], n = o.m / s.M, h = s.hyd ? o.h / 100 : 1, nAg;
    if (o.sub === 'sacH') nAg = 4 * n * h;
    else if (o.sub === 'malH') nAg = 4 * n * h + 2 * n * (1 - h);
    else if (o.sub === 'tbH') nAg = 2 * n * h;
    else nAg = 2 * n;
    return { n: n, nAg: nAg, mAg: nAg * 108 };
  }
  function calcNitrate(o) {
    var n = o.mP / 297, h = o.h / 100, nCell = n / h, nAcid = 3 * n / h, mAcid = nAcid * 63, mDd = mAcid * 100 / o.c;
    return { n: n, nCell: nCell, mCell: nCell * 162, nAcid: nAcid, mAcid: mAcid, mDd: mDd, vDd: mDd / o.d };
  }

  g.SimCarb = { SUBS: SUBS, RG: RG, lab: lab, calcStarch: calcStarch, calcFerment: calcFerment, calcSilver: calcSilver, calcNitrate: calcNitrate };
  if (!g.document) return;

  function $(s, el) { return (el || document).querySelector(s); }
  function eqBox(eq) { return '<div class="eq">' + C(eq) + '</div>'; }

  // ---- 1. Mạch hở ⇄ mạch vòng ----
  (function () {
    var root = document.getElementById('sim-ring'); if (!root) return;
    var body = $('.sim-body', root), st = { s: 'glu', f: 'open' };
    var INK = '#3b0a1a', OC = '#c8301a', HEMI = '#17703f', AT = '#2e6fb5', MUT = '#8a6d78';
    function ln(a, b, w, col) { return '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" stroke="' + (col || INK) + '" stroke-width="' + (w || 2.5) + '" stroke-linecap="round"/>'; }
    function tx(x, y, t, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" font-size="' + (o.fs || 17) + '" font-weight="' + (o.fw || 800) + '" fill="' + (o.c || INK) + '"' + (o.a ? ' text-anchor="' + o.a + '"' : ' text-anchor="middle"') + '>' + t + '</text>'; }
    function num(x, y, t) { return tx(x, y, t, { fs: 12, fw: 700, c: MUT }); }
    function sub(a, b, label, col) { // nhóm thế dọc từ a tới b; "CH₂OH" viết sao cho chữ C nằm ở đầu liên kết
      var y = b[1] + (b[1] < a[1] ? -8 : 18), left = label.charAt(0) === 'C';
      return ln(a, b, 2.4, col) + tx(left ? b[0] - 7 : b[0], y, label, { c: col || INK, fs: 16, a: left ? 'start' : 'middle' });
    }
    function openChain(fru) {
      var x = 320, ys = [46, 90, 134, 178, 222, 266], s = '';
      var rows = fru
        ? [['', 'CH₂OH', ''], ['', 'C', '=O'], ['HO', 'C', 'H'], ['H', 'C', 'OH'], ['H', 'C', 'OH'], ['', 'CH₂OH', '']]
        : [['H', 'C', '=O'], ['H', 'C', 'OH'], ['HO', 'C', 'H'], ['H', 'C', 'OH'], ['H', 'C', 'OH'], ['', 'CH₂OH', '']];
      var co = fru ? 1 : 0;
      for (var i = 0; i < 6; i++) {
        var y = ys[i], r = rows[i];
        if (i < 5) s += ln([x, y + 8], [x, ys[i + 1] - 20], 2.4);
        s += num(232, y, String(i + 1));
        s += tx(x, y + 6, r[1], { c: i === co ? OC : INK });
        if (r[0]) s += ln([x - 30, y], [x - 12, y], 2.4) + tx(x - 34, y + 6, r[0], { a: 'end' });
        if (r[2] === '=O') s += ln([x + 12, y - 3], [x + 34, y - 3], 2.4, OC) + ln([x + 12, y + 4], [x + 34, y + 4], 2.4, OC) + tx(x + 38, y + 6, 'O', { a: 'start', c: OC });
        else if (r[2]) s += ln([x + 12, y], [x + 30, y], 2.4, i === 4 ? AT : INK) + tx(x + 34, y + 6, r[2], { a: 'start', c: i === 4 ? AT : INK });
      }
      var ty = ys[co];
      s += '<path d="M392 ' + (ys[4] - 4) + ' C 480 ' + (ys[4] - 40) + ', 488 ' + (ty + 30) + ', 392 ' + (ty + 2) + '" fill="none" stroke="' + AT + '" stroke-width="2.4" stroke-dasharray="7 6"/>';
      s += '<path d="M404 ' + (ty - 6) + ' L390 ' + (ty + 2) + ' L404 ' + (ty + 10) + '" fill="none" stroke="' + AT + '" stroke-width="2.4"/>';
      s += tx(500, (ys[4] + ty) / 2 - 6, '–OH ở C5', { a: 'start', c: AT, fs: 13 }) + tx(500, (ys[4] + ty) / 2 + 12, 'cộng vào C=O ở C' + (fru ? 2 : 1), { a: 'start', c: AT, fs: 13 });
      return s;
    }
    function ringO(p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="12" fill="#fff"/>' + tx(p[0], p[1] + 6, 'O', { c: OC }); }
    function glucoseRing(beta) {
      var P = { C5: [250, 112], O: [350, 112], C1: [405, 162], C2: [360, 214], C3: [240, 214], C4: [195, 162] }, s = '';
      s += ln(P.C5, P.O, 2.5) + ln(P.O, P.C1, 2.5) + ln(P.C1, P.C2, 4.5) + ln(P.C2, P.C3, 8) + ln(P.C3, P.C4, 4.5) + ln(P.C4, P.C5, 2.5);
      s += ringO(P.O);
      s += sub(P.C5, [250, 72], 'CH₂OH') + num(232, 108, '5') + num(308, 60, '6');
      s += sub(P.C4, [195, 204], 'OH') + num(180, 160, '4');
      s += sub(P.C3, [240, 174], 'OH') + num(226, 232, '3');
      s += sub(P.C2, [360, 254], 'OH') + num(376, 232, '2');
      s += (beta ? sub(P.C1, [405, 118], 'OH', HEMI) : sub(P.C1, [405, 206], 'OH', HEMI)) + num(421, 168, '1');
      s += tx(430, beta ? 110 : 224, '← –OH hemiacetal', { a: 'start', c: HEMI, fs: 13 });
      return s;
    }
    function fructoseRing(beta) {
      var P = { C5: [225, 128], O: [318, 92], C2: [410, 128], C3: [360, 204], C4: [262, 204] }, s = '';
      s += ln(P.C5, P.O, 2.5) + ln(P.O, P.C2, 2.5) + ln(P.C2, P.C3, 4.5) + ln(P.C3, P.C4, 8) + ln(P.C4, P.C5, 4.5);
      s += ringO(P.O);
      s += sub(P.C5, [225, 88], 'CH₂OH') + num(206, 134, '5') + num(284, 78, '6');
      s += sub(P.C4, [262, 244], 'OH') + num(246, 222, '4');
      s += sub(P.C3, [360, 164], 'OH') + num(376, 222, '3');
      if (beta) s += sub(P.C2, [410, 86], 'OH', HEMI) + sub(P.C2, [410, 170], 'CH₂OH') + num(468, 190, '1');
      else s += sub(P.C2, [410, 170], 'OH', HEMI) + sub(P.C2, [410, 86], 'CH₂OH') + num(468, 80, '1');
      s += num(428, 134, '2');
      s += tx(436, beta ? 78 : 188, '← –OH hemiketal', { a: 'start', c: HEMI, fs: 13 });
      return s;
    }
    var CAP = {
      glu: {
        open: 'Glucose dạng mạch hở: HOCH2[CHOH]4CHO, có 5 nhóm –OH và 1 nhóm –CHO (aldehyde) ở C#1. Nhóm –OH ở C#5 có thể cộng vào nhóm C=O ở C#1 để đóng vòng 6 cạnh.',
        alpha: 'α-glucose: vòng 6 cạnh gồm 5 nguyên tử C và 1 nguyên tử O. Nhóm –OH mới sinh ra ở C#1 gọi là –OH hemiacetal, nằm dưới mặt phẳng vòng.',
        beta: 'β-glucose: nhóm –OH hemiacetal ở C#1 nằm trên mặt phẳng vòng (cùng phía với nhóm CH2OH). Trong dung dịch: α-glucose (khoảng 36%) ⇌ mạch hở (rất ít) ⇌ β-glucose (khoảng 64%).'
      },
      fru: {
        open: 'Fructose dạng mạch hở: HOCH2[CHOH]3COCH2OH, nhóm C=O (ketone) ở C#2. Nhóm –OH ở C#5 cộng vào nhóm C=O ở C#2 để đóng vòng 5 cạnh.',
        alpha: 'α-fructose: vòng 5 cạnh gồm 4 nguyên tử C và 1 nguyên tử O. Nhóm –OH hemiketal ở C#2 nằm dưới mặt phẳng vòng.',
        beta: 'β-fructose: nhóm –OH hemiketal ở C#2 nằm trên mặt phẳng vòng. Trong phân tử saccharose, gốc fructose ở dạng β.'
      }
    };
    body.innerHTML = '<div class="sim-row"><div class="ctl"><span>Chất</span><div id="sr-s"></div></div><div class="ctl"><span>Dạng</span><div id="sr-f"></div></div></div>' +
      '<div class="stage"><svg id="sr-svg" viewBox="0 0 640 290" role="img" aria-label="Cấu tạo mạch hở và mạch vòng"></svg></div><p class="capt" id="sr-cap" aria-live="polite"></p>' +
      '<div class="key" style="margin-bottom:0"><b class="lbl">Vì sao nhóm –OH hemiacetal quan trọng?</b>Vòng chứa nhóm –OH hemiacetal (hoặc hemiketal) có thể mở ra thành mạch hở, nên glucose, fructose, maltose thể hiện được tính khử (tráng bạc, khử Cu(OH)<sub>2</sub>/OH<sup>–</sup>). Trong saccharose, C1 của glucose và C2 của fructose đã liên kết với nhau, không còn nhóm này nên saccharose không mở vòng, không có tính khử.</div>';
    LT.picks($('#sr-s', body), [{ id: 'glu', label: 'Glucose' }, { id: 'fru', label: 'Fructose' }], st.s, function (v) { st.s = v; draw(); });
    LT.picks($('#sr-f', body), [{ id: 'open', label: 'Mạch hở' }, { id: 'alpha', label: 'Vòng α' }, { id: 'beta', label: 'Vòng β' }], st.f, function (v) { st.f = v; draw(); });
    function draw() {
      var fru = st.s === 'fru', s;
      if (st.f === 'open') s = openChain(fru);
      else s = fru ? fructoseRing(st.f === 'beta') : glucoseRing(st.f === 'beta');
      s += tx(16, 282, (fru ? 'Fructose' : 'Glucose') + ' · ' + (st.f === 'open' ? 'dạng mạch hở' : 'dạng ' + (st.f === 'beta' ? 'β' : 'α') + ' (vòng ' + (fru ? '5' : '6') + ' cạnh)'), { a: 'start', fs: 13, c: MUT });
      $('#sr-svg', body).innerHTML = s;
      $('#sr-cap', body).innerHTML = C(CAP[st.s][st.f]);
    }
    draw();
  })();

  // ---- 2. Bàn thí nghiệm nhận biết ----
  (function () {
    var root = document.getElementById('sim-lab'); if (!root) return;
    var body = $('.sim-body', root), st = { s: 'glu', r: 'ag' };
    body.innerHTML = '<div class="ctl"><span>① Chọn chất</span><div id="sl-s"></div></div><div class="ctl"><span>② Chọn thuốc thử / thao tác</span><div id="sl-r"></div></div>' +
      '<div class="tube-wrap"><div class="stage" id="sl-tube"></div><div class="out" id="sl-out" style="margin-top:0" aria-live="polite"></div></div>' +
      '<h5 style="margin:18px 0 6px;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;color:var(--burg-600)">Bảng tổng hợp (bấm vào ô để xem)</h5><div class="tbl" id="sl-mx"></div>';
    LT.picks($('#sl-s', body), SUBS.map(function (x) { return { id: x.id, label: x.name }; }), st.s, function (v) { st.s = v; draw(); });
    LT.picks($('#sl-r', body), RG.map(function (x) { return { id: x.id, label: C(x.name) }; }), st.r, function (v) { st.r = v; draw(); });
    function tube(look) {
      var s = '<svg viewBox="0 0 170 270" role="img" aria-label="Ống nghiệm"><defs><clipPath id="sl-clip"><path d="M60 26 V200 A25 25 0 0 0 110 200 V26 Z"/></clipPath>' +
        '<linearGradient id="sl-ag" x1="0" x2="1"><stop offset="0" stop-color="#f4f4f4"/><stop offset=".45" stop-color="#9a9a9a"/><stop offset=".6" stop-color="#e6e6e6"/><stop offset="1" stop-color="#7c7c7c"/></linearGradient></defs>';
      s += '<g clip-path="url(#sl-clip)"><rect x="55" y="96" width="60" height="140" fill="' + look.liq + '"/>';
      if (look.ppt) s += '<rect x="55" y="198" width="60" height="40" fill="' + look.ppt + '"/>';
      if (look.solid === 'fiber') s += '<path d="M66 205 q8 -14 16 0 t16 0 M70 190 q6 -10 12 0 t14 0 M64 175 q9 -12 18 0 t18 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M66 205 q8 -14 16 0 t16 0 M70 190 q6 -10 12 0 t14 0 M64 175 q9 -12 18 0 t18 0" fill="none" stroke="#b9a8ae" stroke-width="1.2"/>';
      if (look.mirror) s += '<rect x="55" y="96" width="9" height="140" fill="url(#sl-ag)"/><rect x="106" y="96" width="9" height="140" fill="url(#sl-ag)"/><path d="M60 196 A25 25 0 0 0 110 196 L110 214 A25 25 0 0 1 60 214 Z" fill="url(#sl-ag)"/>';
      s += '</g><path d="M60 26 V200 A25 25 0 0 0 110 200 V26" fill="none" stroke="#3b0a1a" stroke-width="3"/><line x1="52" y1="26" x2="118" y2="26" stroke="#3b0a1a" stroke-width="3"/>';
      if (look.heat) s += '<path d="M85 262 C 70 250, 74 238, 82 230 C 82 240, 90 240, 88 228 C 100 238, 102 252, 85 262 Z" fill="#ff8a3d" stroke="#c8301a" stroke-width="1.5"/>';
      return s + '</svg>';
    }
    function matrix() {
      var h = '<table class="mini-matrix"><thead><tr><th>Thuốc thử</th>' + SUBS.map(function (x) { return '<th>' + x.name + '</th>'; }).join('') + '</tr></thead><tbody>';
      RG.forEach(function (r) {
        h += '<tr><td style="text-align:left">' + C(r.name) + '</td>' + SUBS.map(function (x) {
          var on = x.id === st.s && r.id === st.r;
          return '<td class="' + (on ? 'on' : '') + '" data-s="' + x.id + '" data-r="' + r.id + '" style="cursor:pointer">' + LT.esc(lab(x.id, r.id).tag) + '</td>';
        }).join('') + '</tr>';
      });
      return h + '</tbody></table>';
    }
    function sync() {
      Array.prototype.forEach.call(body.querySelectorAll('#sl-s .pick'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-id') === st.s ? 'true' : 'false'); });
      Array.prototype.forEach.call(body.querySelectorAll('#sl-r .pick'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-id') === st.r ? 'true' : 'false'); });
    }
    function draw() {
      var x = lab(st.s, st.r), sub = SUBS.filter(function (o) { return o.id === st.s; })[0], rg = RG.filter(function (o) { return o.id === st.r; })[0];
      $('#sl-tube', body).innerHTML = tube(x.look);
      $('#sl-out', body).innerHTML = '<h5 style="text-transform:none;letter-spacing:0;font-size:.95rem">' + sub.name + ' (' + C(sub.f) + ') + ' + C(rg.full) + '</h5><p style="margin:4px 0 8px;font-weight:600">' + C(x.text) + '</p>' + (x.eq ? eqBox(x.eq) : '');
      $('#sl-mx', body).innerHTML = matrix();
    }
    body.addEventListener('click', function (e) {
      var td = e.target.closest('td[data-s]'); if (!td) return;
      st.s = td.getAttribute('data-s'); st.r = td.getAttribute('data-r'); sync(); draw();
    });
    draw();
  })();

  // ---- 3. Máy tính bài toán ----
  (function () {
    var root = document.getElementById('sim-calc'); if (!root) return;
    var body = $('.sim-body', root), tab = 'starch';
    var TABS = [{ id: 'starch', label: 'Tinh bột → ethanol' }, { id: 'ferment', label: 'Lên men glucose' }, { id: 'silver', label: 'Tráng bạc' }, { id: 'nitrate', label: 'Cellulose trinitrate' }];
    body.innerHTML = '<div id="sc-t"></div><div id="sc-form"></div><div class="out calc-out" id="sc-out" aria-live="polite"></div>';
    function field(id, label, val, step) { return '<label class="ctl"><span>' + label + '</span><input type="number" data-k="' + id + '" value="' + val + '" min="0" step="' + (step || 'any') + '"></label>'; }
    var FORMS = {
      starch: '<div class="sim-row">' + field('m', 'Khối lượng nguyên liệu (kg)', 100) + field('pct', 'Hàm lượng tinh bột (%)', 81) + field('h1', 'Hiệu suất thủy phân H<sub>1</sub> (%)', 80) + field('h2', 'Hiệu suất lên men H<sub>2</sub> (%)', 75) + field('deg', 'Độ rượu muốn pha (°)', 46) + '</div>',
      ferment: '<div class="sim-row">' + field('m', 'Khối lượng glucose (g)', 360) + field('h', 'Hiệu suất lên men (%)', 80) + '</div>',
      silver: '<div class="sim-row"><label class="ctl"><span>Chất đem tráng bạc</span><select data-k="sub">' + Object.keys(SILVER).map(function (k) { return '<option value="' + k + '">' + SILVER[k].name + '</option>'; }).join('') + '</select></label>' + field('m', 'Khối lượng (g)', 18) + field('h', 'Hiệu suất thủy phân (%) – nếu có', 100) + '</div>',
      nitrate: '<div class="sim-row">' + field('mP', 'Khối lượng cellulose trinitrate cần sản xuất (kg)', 29.7) + field('h', 'Hiệu suất phản ứng (%)', 90) + field('c', 'Nồng độ dung dịch HNO3 (%)', 96) + field('d', 'Khối lượng riêng dd HNO3 (g/mL)', 1.52) + '</div>'
    };
    function vals() { var o = {}; Array.prototype.forEach.call(body.querySelectorAll('[data-k]'), function (el) { o[el.getAttribute('data-k')] = el.tagName === 'SELECT' ? el.value : parseFloat(String(el.value).replace(',', '.')); }); return o; }
    function ok(o, keys) { return keys.every(function (k) { return isFinite(o[k]) && o[k] > 0; }); }
    function li(t) { return '<li>' + t + '</li>'; }
    function out() {
      var o = vals(), h = '';
      if (tab === 'starch') {
        if (!ok(o, ['m', 'pct', 'h1', 'h2', 'deg'])) { h = '<p class="muted">Nhập các số dương.</p>'; }
        else {
          var r = calcStarch(o);
          h = eqBox('(C6H10O5)_{n} + nH2O →{H^{+}, t°} nC6H12O6') + eqBox('C6H12O6 →{enzyme, 30 – 35 °C} 2C2H5OH + 2CO2') + '<ul class="steps">' +
            li('m<sub>tinh bột</sub> = ' + F(o.m) + ' × ' + F(o.pct) + '% = <b>' + F(r.mS, 3) + ' kg</b> → n<sub>' + C('C6H10O5') + '</sub> = ' + F(r.mS, 3) + ' : 162 = <b>' + F(r.n, 5) + ' kmol</b>') +
            li('n<sub>glucose</sub> = ' + F(r.n, 5) + ' × ' + F(o.h1) + '% = <b>' + F(r.nG, 5) + ' kmol</b> (' + F(r.mG, 3) + ' kg)') +
            li('n<sub>ethanol</sub> = 2 × ' + F(r.nG, 5) + ' × ' + F(o.h2) + '% = <b>' + F(r.nE, 5) + ' kmol</b> → m = ' + F(r.nE, 5) + ' × 46 = <b>' + F(r.mE, 3) + ' kg</b>') +
            li('V<sub>ethanol</sub> = m : D = ' + F(r.mE, 3) + ' : 0,8 = <b>' + F(r.vE, 3) + ' L</b> → V<sub>rượu ' + F(o.deg) + '°</sub> = ' + F(r.vE, 3) + ' × 100 : ' + F(o.deg) + ' = <b>' + F(r.vR, 2) + ' L</b>') +
            li('n<sub>' + C('CO2') + '</sub> = n<sub>ethanol</sub> = ' + F(r.nE, 5) + ' kmol; hấp thụ vào ' + C('Ca(OH)2') + ' dư thu được <b>' + F(r.mCa, 3) + ' kg</b> ' + C('CaCO3')) + '</ul>' +
            '<div class="result-line">Thu được <b>' + F(r.vR, 2) + ' L</b> rượu ' + F(o.deg) + '° (' + F(r.mE, 2) + ' kg ethanol)</div>';
        }
      } else if (tab === 'ferment') {
        if (!ok(o, ['m', 'h'])) h = '<p class="muted">Nhập các số dương.</p>';
        else {
          var f = calcFerment(o);
          h = eqBox('C6H12O6 →{enzyme, 30 – 35 °C} 2C2H5OH + 2CO2') + '<ul class="steps">' +
            li('n<sub>glucose</sub> = ' + F(o.m) + ' : 180 = <b>' + F(f.n, 4) + ' mol</b>') +
            li('n<sub>ethanol</sub> = n<sub>CO<sub>2</sub></sub> = 2 × ' + F(f.n, 4) + ' × ' + F(o.h) + '% = <b>' + F(f.nE, 4) + ' mol</b>') +
            li('m<sub>ethanol</sub> = ' + F(f.nE, 4) + ' × 46 = <b>' + F(f.mE, 3) + ' g</b>; V<sub>CO<sub>2</sub></sub> (đkc) = ' + F(f.nE, 4) + ' × 24,79 = <b>' + F(f.vCO2, 3) + ' L</b>') +
            li('Dẫn CO<sub>2</sub> vào Ca(OH)<sub>2</sub> dư: m<sub>CaCO<sub>3</sub></sub> = ' + F(f.nE, 4) + ' × 100 = <b>' + F(f.mCa, 3) + ' g</b>') + '</ul>' +
            '<div class="result-line">Thu được <b>' + F(f.mE, 2) + ' g</b> ethanol và <b>' + F(f.mCa, 2) + ' g</b> kết tủa CaCO<sub>3</sub></div>';
        }
      } else if (tab === 'silver') {
        if (!ok(o, ['m', 'h']) || o.h > 100) h = '<p class="muted">Nhập khối lượng dương, hiệu suất từ 0 đến 100%.</p>';
        else {
          var sv = SILVER[o.sub], a = calcSilver(o);
          h = '<p style="margin:0 0 6px">' + C(sv.k) + '</p><ul class="steps">' +
            li('n<sub>' + C(sv.sh) + '</sub> = ' + F(o.m) + ' : ' + sv.M + ' = <b>' + F(a.n, 4) + ' mol</b>') +
            li(o.sub === 'sacH' ? 'n<sub>Ag</sub> = 4 × ' + F(a.n, 4) + ' × ' + F(o.h) + '% = <b>' + F(a.nAg, 4) + ' mol</b>'
              : o.sub === 'malH' ? 'n<sub>Ag</sub> = 4 × ' + F(a.n, 4) + ' × ' + F(o.h) + '% + 2 × ' + F(a.n, 4) + ' × ' + F(100 - o.h) + '% = <b>' + F(a.nAg, 4) + ' mol</b>'
              : o.sub === 'tbH' ? 'n<sub>Ag</sub> = 2 × ' + F(a.n, 4) + ' × ' + F(o.h) + '% = <b>' + F(a.nAg, 4) + ' mol</b>'
              : 'n<sub>Ag</sub> = 2 × ' + F(a.n, 4) + ' = <b>' + F(a.nAg, 4) + ' mol</b>') +
            li('m<sub>Ag</sub> = ' + F(a.nAg, 4) + ' × 108 = <b>' + F(a.mAg, 3) + ' g</b>') + '</ul>' +
            '<div class="result-line">Khối lượng bạc thu được: <b>' + F(a.mAg, 2) + ' g</b></div>';
          var hin = body.querySelector('[data-k="h"]'); if (hin) hin.disabled = !sv.hyd;
        }
      } else {
        if (!ok(o, ['mP', 'h', 'c', 'd']) || o.h > 100) h = '<p class="muted">Nhập các số dương, hiệu suất không quá 100%.</p>';
        else {
          var t = calcNitrate(o);
          h = eqBox('[C6H7O2(OH)3]_{n} + 3nHNO3 →{H2SO4 đặc, t°} [C6H7O2(ONO2)3]_{n} + 3nH2O') + '<ul class="steps">' +
            li('n<sub>mắt xích sản phẩm</sub> = ' + F(o.mP) + ' : 297 = <b>' + F(t.n, 5) + ' kmol</b>') +
            li('Vì hiệu suất ' + F(o.h) + '%, cần dùng: n<sub>cellulose</sub> = ' + F(t.n, 5) + ' : ' + F(o.h) + '% = ' + F(t.nCell, 5) + ' kmol → <b>' + F(t.mCell, 3) + ' kg cellulose</b>') +
            li('n<sub>HNO<sub>3</sub></sub> = 3 × ' + F(t.n, 5) + ' : ' + F(o.h) + '% = ' + F(t.nAcid, 5) + ' kmol → m<sub>HNO<sub>3</sub></sub> = <b>' + F(t.mAcid, 3) + ' kg</b>') +
            li('m<sub>dd HNO<sub>3</sub></sub> = ' + F(t.mAcid, 3) + ' × 100 : ' + F(o.c) + ' = ' + F(t.mDd, 3) + ' kg → V = m : D = <b>' + F(t.vDd, 2) + ' L</b>') + '</ul>' +
            '<div class="result-line">Cần <b>' + F(t.vDd, 2) + ' L</b> dung dịch HNO<sub>3</sub> ' + F(o.c) + '% và <b>' + F(t.mCell, 2) + ' kg</b> cellulose</div>';
        }
      }
      $('#sc-out', body).innerHTML = h;
    }
    function form() { $('#sc-form', body).innerHTML = FORMS[tab]; out(); }
    LT.picks($('#sc-t', body), TABS, tab, function (v) { tab = v; form(); });
    body.addEventListener('input', function (e) { if (e.target.closest('#sc-form')) out(); });
    body.addEventListener('change', function (e) { if (e.target.closest('#sc-form')) out(); });
    form();
  })();
})(typeof window !== 'undefined' ? window : globalThis);
