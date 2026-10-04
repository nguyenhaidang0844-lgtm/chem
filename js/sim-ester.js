/* Mô phỏng Chương 1 · Ester – Lipid
   1. Máy ghép ester   2. Đếm đồng phân   3. Lắp chất béo   4. Xà phòng làm sạch vết dầu + nước cứng */
(function (g) {
  'use strict';
  var LT = g.LT, C = LT.chem, F = LT.fmt;

  function cnt(sym, n) { return n === 0 ? '' : sym + (n === 1 ? '' : n); }
  function mf(c, h, o, na) { return cnt('C', c) + cnt('H', h) + cnt('O', o) + cnt('Na', na || 0); }
  function find(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
  function coef(k) { return k > 1 ? k : ''; }

  // ================= 1. MÁY GHÉP ESTER =================
  // C, H, O: số nguyên tử trong phân tử acid RCOOH
  var ACIDS = [
    { id: 'formic', f: 'HCOOH', rcoo: 'HCOO', name: 'formic acid', an: 'formate', C: 1, H: 2, O: 2, sat: 1, form: 1 },
    { id: 'acetic', f: 'CH3COOH', rcoo: 'CH3COO', name: 'acetic acid', an: 'acetate', C: 2, H: 4, O: 2, sat: 1 },
    { id: 'propionic', f: 'C2H5COOH', rcoo: 'C2H5COO', name: 'propionic acid', an: 'propionate', C: 3, H: 6, O: 2, sat: 1 },
    { id: 'butyric', f: 'CH3CH2CH2COOH', rcoo: 'CH3CH2CH2COO', name: 'butyric acid', an: 'butyrate', C: 4, H: 8, O: 2, sat: 1 },
    { id: 'isobutyric', f: '(CH3)2CHCOOH', rcoo: '(CH3)2CHCOO', name: 'isobutyric acid', an: 'isobutyrate', C: 4, H: 8, O: 2, sat: 1 },
    { id: 'acrylic', f: 'CH2=CHCOOH', rcoo: 'CH2=CHCOO', name: 'acrylic acid', an: 'acrylate', C: 3, H: 4, O: 2, cc: 1 },
    { id: 'methacrylic', f: 'CH2=C(CH3)COOH', rcoo: 'CH2=C(CH3)COO', name: 'methacrylic acid', an: 'methacrylate', C: 4, H: 6, O: 2, cc: 1 },
    { id: 'benzoic', f: 'C6H5COOH', rcoo: 'C6H5COO', name: 'benzoic acid', an: 'benzoate', C: 7, H: 6, O: 2, ar: 1 },
    { id: 'salicylic', f: 'o-HOC6H4COOH', rcoo: 'o-HOC6H4COO', name: 'salicylic acid', an: 'salicylate', C: 7, H: 6, O: 3, ar: 1, phOH: 1 },
    { id: 'palmitic', f: 'C15H31COOH', rcoo: 'C15H31COO', name: 'palmitic acid', an: 'palmitate', C: 16, H: 32, O: 2, sat: 1, fat: 1 },
    { id: 'stearic', f: 'C17H35COOH', rcoo: 'C17H35COO', name: 'stearic acid', an: 'stearate', C: 18, H: 36, O: 2, sat: 1, fat: 1 },
    { id: 'oleic', f: 'C17H33COOH', rcoo: 'C17H33COO', name: 'oleic acid', an: 'oleate', C: 18, H: 34, O: 2, cc: 1, fat: 1 }
  ];
  // C, H: số nguyên tử trong R'OH (với vinyl, isopropenyl là "enol" giả định)
  var ALCS = [
    { id: 'methyl', r: 'CH3', f: 'CH3OH', name: 'methyl', an: 'methanol', C: 1, H: 4, sat: 1 },
    { id: 'ethyl', r: 'C2H5', f: 'C2H5OH', name: 'ethyl', an: 'ethanol', C: 2, H: 6, sat: 1 },
    { id: 'propyl', r: 'CH2CH2CH3', f: 'CH3CH2CH2OH', name: 'propyl', an: 'propan-1-ol', C: 3, H: 8, sat: 1 },
    { id: 'isopropyl', r: 'CH(CH3)2', f: '(CH3)2CHOH', name: 'isopropyl', an: 'propan-2-ol', C: 3, H: 8, sat: 1 },
    { id: 'butyl', r: 'CH2CH2CH2CH3', f: 'CH3CH2CH2CH2OH', name: 'butyl', an: 'butan-1-ol', C: 4, H: 10, sat: 1 },
    { id: 'isoamyl', r: 'CH2CH2CH(CH3)2', f: '(CH3)2CHCH2CH2OH', name: 'isoamyl', an: 'isoamyl alcohol', C: 5, H: 12, sat: 1 },
    { id: 'vinyl', r: 'CH=CH2', f: 'CH2=CH–OH', name: 'vinyl', an: '"vinyl alcohol"', C: 2, H: 4, cc: 1 },
    { id: 'allyl', r: 'CH2CH=CH2', f: 'CH2=CHCH2OH', name: 'allyl', an: 'allyl alcohol', C: 3, H: 6, cc: 1 },
    { id: 'isopropenyl', r: 'C(CH3)=CH2', f: 'CH2=C(OH)CH3', name: 'isopropenyl', an: '', C: 3, H: 6, cc: 1 },
    { id: 'phenyl', r: 'C6H5', f: 'C6H5OH', name: 'phenyl', an: 'phenol', C: 6, H: 6, ar: 1 },
    { id: 'benzyl', r: 'CH2C6H5', f: 'C6H5CH2OH', name: 'benzyl', an: 'benzyl alcohol', C: 7, H: 8, ar: 1 }
  ];
  var USES = {
    'acetic|isoamyl': 'Mùi chuối chín, còn gọi là "dầu chuối".',
    'butyric|ethyl': 'Mùi dứa, dùng làm hương liệu thực phẩm.',
    'propionic|ethyl': 'Mùi dứa.',
    'acetic|benzyl': 'Mùi hoa nhài, dùng trong thực phẩm và mĩ phẩm.',
    'acetic|propyl': 'Mùi quả lê.',
    'butyric|methyl': 'Mùi quả táo.',
    'salicylic|methyl': 'Có trong dầu gió, miếng dán giảm đau khi chơi thể thao.',
    'acetic|ethyl': 'Dung môi tách, chiết chất hữu cơ; có trong nước rửa sơn móng tay.',
    'acetic|butyl': 'Dung môi pha sơn.',
    'acetic|methyl': 'Dung môi.',
    'methacrylic|methyl': 'Monomer trùng hợp tạo poly(methyl methacrylate) – thủy tinh hữu cơ (plexiglas).',
    'acetic|vinyl': 'Monomer trùng hợp tạo poly(vinyl acetate) – dùng làm keo dán, sơn.',
    'acrylic|methyl': 'Monomer sản xuất polyacrylate (sơn tường, keo dán).',
    'formic|methyl': 'Ester đơn giản nhất (C2H4O2, M = 60), là đồng phân của acetic acid.'
  };

  function ester(acidId, alcId) {
    var a = find(ACIDS, acidId), r = find(ALCS, alcId);
    var c = a.C + r.C, h = a.H + r.H - 2, o = a.O;
    var e = { acid: a, alc: r, f: a.rcoo + r.r, name: r.name + ' ' + a.an, mf: mf(c, h, o), M: 12 * c + h + 16 * o, C: c, H: h, O: o };
    e.saltF = a.phOH ? 'o-NaOC6H4COONa' : a.rcoo + 'Na';
    e.saltN = a.phOH ? 'muối sodium của salicylic acid (cả –OH phenol cũng thành –ONa)' : 'sodium ' + a.an;
    var pa = { f: r.f, n: r.an }, pb = pa;
    if (r.id === 'vinyl') pa = pb = { f: 'CH3CHO', n: 'acetaldehyde' };
    if (r.id === 'isopropenyl') pa = pb = { f: 'CH3COCH3', n: 'acetone' };
    if (r.id === 'phenyl') pb = { f: 'C6H5ONa', n: 'sodium phenolate' };
    e.naoh = 1 + (r.id === 'phenyl' ? 1 : 0) + (a.phOH ? 1 : 0);
    var w = e.naoh - 1;
    e.eqAcid = e.f + ' + H2O ⇌{H2SO4 loãng, t°} ' + a.f + ' + ' + pa.f;
    e.nmAcid = e.name + ' → ' + a.name + ' + ' + pa.n;
    e.eqBase = e.f + ' + ' + coef(e.naoh) + 'NaOH →{t°} ' + e.saltF + ' + ' + pb.f + (w ? ' + ' + coef(w) + 'H2O' : '');
    e.nmBase = e.name + ' → ' + e.saltN + ' + ' + pb.n;
    if (r.id === 'vinyl') e.eqMake = a.f + ' + CH≡CH →{xt, t°} ' + e.f;
    else if (r.id === 'isopropenyl') e.eqMake = a.f + ' + CH≡C–CH3 →{xt, t°} ' + e.f;
    else if (r.id === 'phenyl') e.eqMake = a.id === 'acetic' ? '(CH3CO)2O + C6H5OH → CH3COOC6H5 + CH3COOH' : '';
    else e.eqMake = a.f + ' + ' + r.f + ' ⇌{H2SO4 đặc, t°} ' + e.f + ' + H2O';
    e.flags = [];
    if (a.sat && r.sat) e.flags.push(['ok', 'Ester no, đơn chức, mạch hở: C_{n}H_{2n}O_{2}']);
    if (a.cc || r.cc) e.flags.push(['warn', 'Có liên kết C=C']);
    if (a.ar || r.ar) e.flags.push(['info', 'Có vòng benzene']);
    if (a.form) e.flags.push(['info', 'Tráng bạc được']);
    if (e.naoh > 1) e.flags.push(['bad', 'Tỉ lệ ester : NaOH = 1 : ' + e.naoh]);
    e.notes = [];
    if (a.form) e.notes.push('Ester của formic acid có dạng H–CO–O–R\', còn nhóm H–C=O giống aldehyde nên <b>tham gia phản ứng tráng bạc</b>. Muối HCOONa thu được khi thủy phân cũng tráng bạc.');
    if (r.id === 'vinyl') e.notes.push('Gốc vinyl: thủy phân sinh ra CH2=CH–OH (enol) không bền, chuyển ngay thành <b>acetaldehyde CH3CHO</b>, chất này tráng bạc được. Ester vinyl không điều chế bằng phản ứng ester hóa mà cho acid cộng vào acetylene.');
    if (r.id === 'isopropenyl') e.notes.push('Gốc isopropenyl: thủy phân sinh ra CH2=C(OH)–CH3 không bền, chuyển thành <b>acetone CH3COCH3</b> (ketone, không tráng bạc).');
    if (r.id === 'phenyl') e.notes.push('Ester của phenol: phenol sinh ra lại phản ứng tiếp với NaOH nên <b>1 mol ester cần 2 mol NaOH</b>, tạo 2 muối và nước. Không điều chế trực tiếp từ acid và phenol mà thường dùng anhydride acid.');
    if (a.phOH) e.notes.push('Phân tử còn nhóm –OH gắn vào vòng benzene (–OH phenol) nên phản ứng thêm 1 NaOH.');
    if (a.cc || r.cc) e.notes.push('Có liên kết C=C nên ester cộng được H2 (Ni, t°), <b>làm mất màu nước bromine</b> và có thể tham gia phản ứng trùng hợp.');
    if (a.fat && r.id === 'methyl') e.notes.push('Methyl ester của acid béo là thành phần chính của <b>biodiesel</b> (nhiên liệu sinh học).');
    if (a.sat && r.sat) e.notes.push('Đốt cháy ester no, đơn chức, mạch hở luôn cho số mol CO2 bằng số mol H2O.');
    e.use = USES[a.id + '|' + r.id] || '';
    return e;
  }

  // ================= 2. ĐẾM ĐỒNG PHÂN =================
  // [công thức, tên, sản phẩm thủy phân bằng NaOH]
  var ISO = {
    c2: { mf: 'C2H4O2', es: [['HCOOCH3', 'methyl formate', 'HCOONa + CH3OH']], ac: [['CH3COOH', 'acetic acid (ethanoic acid)']] },
    c3: { mf: 'C3H6O2', es: [['HCOOCH2CH3', 'ethyl formate', 'HCOONa + C2H5OH'], ['CH3COOCH3', 'methyl acetate', 'CH3COONa + CH3OH']],
      ac: [['CH3CH2COOH', 'propionic acid (propanoic acid)']] },
    c4: { mf: 'C4H8O2', es: [['HCOOCH2CH2CH3', 'propyl formate', 'HCOONa + CH3CH2CH2OH'], ['HCOOCH(CH3)2', 'isopropyl formate', 'HCOONa + (CH3)2CHOH'],
      ['CH3COOCH2CH3', 'ethyl acetate', 'CH3COONa + C2H5OH'], ['CH3CH2COOCH3', 'methyl propionate', 'CH3CH2COONa + CH3OH']],
      ac: [['CH3CH2CH2COOH', 'butyric acid (butanoic acid)'], ['(CH3)2CHCOOH', 'isobutyric acid (2-methylpropanoic acid)']] },
    c5: { mf: 'C5H10O2', es: [['HCOOCH2CH2CH2CH3', 'butyl formate', 'HCOONa + CH3CH2CH2CH2OH'], ['HCOOCH2CH(CH3)2', 'isobutyl formate', 'HCOONa + (CH3)2CHCH2OH'],
      ['HCOOCH(CH3)CH2CH3', 'sec-butyl formate', 'HCOONa + CH3CH(OH)CH2CH3'], ['HCOOC(CH3)3', 'tert-butyl formate', 'HCOONa + (CH3)3COH'],
      ['CH3COOCH2CH2CH3', 'propyl acetate', 'CH3COONa + CH3CH2CH2OH'], ['CH3COOCH(CH3)2', 'isopropyl acetate', 'CH3COONa + (CH3)2CHOH'],
      ['CH3CH2COOCH2CH3', 'ethyl propionate', 'CH3CH2COONa + C2H5OH'], ['CH3CH2CH2COOCH3', 'methyl butyrate', 'CH3CH2CH2COONa + CH3OH'],
      ['(CH3)2CHCOOCH3', 'methyl isobutyrate', '(CH3)2CHCOONa + CH3OH']],
      ac: [['CH3CH2CH2CH2COOH', 'valeric acid (pentanoic acid)'], ['(CH3)2CHCH2COOH', 'isovaleric acid (3-methylbutanoic acid)'],
        ['CH3CH2CH(CH3)COOH', '2-methylbutanoic acid'], ['(CH3)3CCOOH', '2,2-dimethylpropanoic acid']] },
    c4u: { mf: 'C4H6O2', unsat: 1, es: [['HCOOCH=CHCH3', 'prop-1-enyl formate · có đồng phân hình học cis – trans', 'HCOONa + CH3CH2CHO (aldehyde)'],
      ['HCOOCH2CH=CH2', 'allyl formate', 'HCOONa + CH2=CHCH2OH'], ['HCOOC(CH3)=CH2', 'isopropenyl formate', 'HCOONa + CH3COCH3 (ketone)'],
      ['CH3COOCH=CH2', 'vinyl acetate', 'CH3COONa + CH3CHO (aldehyde)'], ['CH2=CHCOOCH3', 'methyl acrylate', 'CH2=CHCOONa + CH3OH']],
      ac: [['CH2=CHCH2COOH', 'but-3-enoic acid'], ['CH3CH=CHCOOH', 'but-2-enoic acid · có đồng phân hình học cis – trans'], ['CH2=C(CH3)COOH', 'methacrylic acid']] }
  };
  function isomers(key) {
    var d = ISO[key], silver = d.es.filter(function (x) { return x[0].indexOf('HCOO') === 0; }).length;
    return { mf: d.mf, es: d.es, ac: d.ac, nEs: d.es.length, nAc: d.ac.length, silver: silver, unsat: !!d.unsat };
  }

  // ================= 3. LẮP CHẤT BÉO =================
  var FA = {
    P: { id: 'P', name: 'palmitic acid', an: 'palmitate', tri: 'tripalmitin', f: 'C15H31COOH', rcoo: 'C15H31COO', C: 16, H: 32, cc: 0, M: 256 },
    S: { id: 'S', name: 'stearic acid', an: 'stearate', tri: 'tristearin', f: 'C17H35COOH', rcoo: 'C17H35COO', C: 18, H: 36, cc: 0, M: 284 },
    O: { id: 'O', name: 'oleic acid', an: 'oleate', tri: 'triolein', f: 'C17H33COOH', rcoo: 'C17H33COO', C: 18, H: 34, cc: 1, M: 282 },
    L: { id: 'L', name: 'linoleic acid', an: 'linoleate', tri: 'trilinolein', f: 'C17H31COOH', rcoo: 'C17H31COO', C: 18, H: 32, cc: 2, M: 280 }
  };
  function groups(ids) { // giữ thứ tự xuất hiện: [[id, số lần], ...]
    var out = [];
    ids.forEach(function (id) { var gr = out.filter(function (x) { return x[0] === id; })[0]; if (gr) gr[1]++; else out.push([id, 1]); });
    return out;
  }
  function fatFormula(ids) {
    return groups(ids).map(function (gr) { return '(' + FA[gr[0]].rcoo + ')' + (gr[1] > 1 ? gr[1] : ''); }).join('') + 'C3H5';
  }
  function fat(ids, n) {
    var fa = ids.map(function (id) { return FA[id]; });
    var c = 3, h = 2, sumM = 0, cc = 0, unsat = 0;
    fa.forEach(function (x) { c += x.C; h += x.H; sumM += x.M; cc += x.cc; if (x.cc) unsat++; });
    var o = { ids: ids, f: fatFormula(ids), mf: mf(c, h, 6), M: 92 + sumM - 54, cc: cc, pi: cc + 3, unsat: unsat, n: n };
    var same = ids[0] === ids[1] && ids[1] === ids[2];
    o.name = same ? 'Glyceryl tri' + fa[0].an + ' (' + fa[0].tri + ')' : 'Triglyceride tạo bởi glycerol với ' + groups(ids).map(function (gr) { return FA[gr[0]].name; }).join(' và ');
    o.state = unsat >= 2 ? 'Lỏng ở nhiệt độ thường (dầu)' : 'Rắn ở nhiệt độ thường (mỡ)';
    o.mass = o.M * n; o.naoh = 3 * n; o.glycerol = 92 * n; o.h2 = cc * n;
    o.salts = groups(ids).map(function (gr) { var x = FA[gr[0]]; return { f: x.rcoo + 'Na', name: 'sodium ' + x.an, mol: gr[1] * n, M: x.M + 22, coef: gr[1] }; });
    o.saltMass = o.salts.reduce(function (s, x) { return s + x.mol * x.M; }, 0);
    o.eqSap = o.f + ' + 3NaOH →{t°} ' + o.salts.map(function (x) { return coef(x.coef) + x.f; }).join(' + ') + ' + C3H5(OH)3';
    o.eqHyd = groups(ids).map(function (gr) { return coef(gr[1]) + FA[gr[0]].f; }).join(' + ');
    o.eqAcid = o.f + ' + 3H2O ⇌{H^{+}, t°} ' + o.eqHyd + ' + C3H5(OH)3';
    if (cc) {
      var sat = fatFormula(ids.map(function (id) { return FA[id].cc ? 'S' : id; }));
      o.eqH2 = o.f + ' + ' + coef(cc) + 'H2 →{Ni, t°} ' + sat;
    }
    return o;
  }

  g.SimEster = { ACIDS: ACIDS, ALCS: ALCS, ester: ester, isomers: isomers, fat: fat };
  if (!g.document) return;

  // ================= Giao diện =================
  function $(s, el) { return (el || document).querySelector(s); }
  function eqBox(eq, nm) { return '<div class="eq">' + C(eq) + (nm ? '<span class="nm">' + C(nm) + '</span>' : '') + '</div>'; }
  function flag(f) { return '<span class="flag ' + f[0] + '">' + C(f[1]) + '</span>'; }
  function fact(v, k) { return '<div class="fact"><b>' + v + '</b><span>' + k + '</span></div>'; }

  // ---- 1. Máy ghép ester ----
  (function () {
    var root = document.getElementById('sim-ester'); if (!root) return;
    var body = $('.sim-body', root), st = { a: 'acetic', r: 'ethyl' };
    body.innerHTML = '<div class="sim-row"><div class="ctl"><span>① Chọn carboxylic acid (RCOOH)</span><div id="se-a"></div></div>' +
      '<div class="ctl"><span>② Chọn alcohol hoặc phenol (R\'OH)</span><div id="se-r"></div></div></div><div class="out" id="se-out" aria-live="polite"></div>';
    LT.picks($('#se-a', body), ACIDS.map(function (a) { return { id: a.id, label: C(a.f) }; }), st.a, function (id) { st.a = id; draw(); });
    LT.picks($('#se-r', body), ALCS.map(function (r) { return { id: r.id, label: r.name }; }), st.r, function (id) { st.r = id; draw(); });
    function draw() {
      var e = ester(st.a, st.r), h = '';
      h += '<h5>Ester tạo thành</h5><div class="big-f"><span style="color:var(--burg-700)">' + C(e.acid.rcoo) + '</span><span style="color:#c2185b">' + C(e.alc.r) + '</span></div>';
      h += '<p style="margin:2px 0 6px"><b>' + LT.esc(e.name) + '</b> <span class="muted">· đọc tên gốc R\' (<span style="color:#c2185b">' + e.alc.name + '</span>) trước, tên gốc acid (<span style="color:var(--burg-700)">' + e.acid.an + '</span>) sau</span></p>';
      h += '<div class="facts">' + fact(C(e.mf), 'Công thức phân tử') + fact(e.M, 'Phân tử khối M') + fact(F(e.O * 16 / e.M * 100, 2) + '%', '%O theo khối lượng') + fact('1 : ' + e.naoh, 'Tỉ lệ mol ester : NaOH') + '</div>';
      h += '<div>' + e.flags.map(flag).join('') + '</div>';
      if (e.use) h += '<p style="margin:8px 0 0">🌼 ' + C(e.use) + '</p>';
      h += '<h5>Điều chế</h5>' + (e.eqMake ? eqBox(e.eqMake) : '<p class="muted" style="margin:4px 0">Không điều chế trực tiếp từ acid và phenol (dùng anhydride acid hoặc acyl chloride).</p>');
      h += '<h5>Thủy phân trong môi trường acid (thuận nghịch)</h5>' + eqBox(e.eqAcid, e.nmAcid);
      h += '<h5>Thủy phân trong môi trường kiềm (một chiều – xà phòng hóa)</h5>' + eqBox(e.eqBase, e.nmBase);
      if (e.notes.length) h += '<h5>Lưu ý</h5><ul>' + e.notes.map(function (x) { return '<li>' + C(x).replace(/&lt;(\/?)b&gt;/g, '<$1b>') + '</li>'; }).join('') + '</ul>';
      $('#se-out', body).innerHTML = h;
    }
    draw();
  })();

  // ---- 2. Đếm đồng phân ----
  (function () {
    var root = document.getElementById('sim-iso'); if (!root) return;
    var body = $('.sim-body', root), cur = 'c4';
    body.innerHTML = '<div id="si-k"></div><div class="out" id="si-out" aria-live="polite"></div>';
    LT.picks($('#si-k', body), ['c2', 'c3', 'c4', 'c5', 'c4u'].map(function (k) { return { id: k, label: C(ISO[k].mf) + (k === 'c4u' ? ' <small>(không no)</small>' : '') }; }), cur, function (k) { cur = k; draw(); });
    function draw() {
      var d = isomers(cur), h = '';
      h += '<div class="facts">' + fact(d.nEs, 'Ester') + fact(d.nAc, 'Carboxylic acid') + fact(d.nEs + d.nAc, 'Chất đơn chức + NaOH') + fact(d.silver, 'Chất tráng bạc (HCOOR\')') + '</div>';
      h += '<div class="isolist"><div><h5>Ester (' + d.nEs + ')</h5><ol>' + d.es.map(function (x) {
        return '<li><b>' + C(x[0]) + '</b> – ' + LT.esc(x[1]) + (x[0].indexOf('HCOO') === 0 ? ' <span class="flag info">tráng bạc</span>' : '') + '<br><small>+ NaOH → ' + C(x[2]) + '</small></li>';
      }).join('') + '</ol></div><div><h5>Carboxylic acid (' + d.nAc + ')</h5><ol>' + d.ac.map(function (x) {
        return '<li><b>' + C(x[0]) + '</b> – ' + LT.esc(x[1]) + '</li>';
      }).join('') + '</ol></div></div>';
      if (d.unsat) h += '<p class="muted" style="margin:10px 0 0">Kể cả đồng phân hình học: 6 ester và 4 acid mạch hở. Chú ý các ester có gốc –CH=CH– gắn vào O khi thủy phân cho aldehyde, gốc –C(CH3)=CH2 cho ketone.</p>';
      else h += '<p class="muted" style="margin:10px 0 0">Mẹo nhẩm: ester no, đơn chức, mạch hở ' + C('C_{n}H_{2n}O_{2}') + ' có 2<sup>n−2</sup> đồng phân khi n ≤ 4 (n = 5 có 9). Acid ' + C('C_{n}H_{2n}O_{2}') + ' có 2<sup>n−3</sup> đồng phân khi 3 ≤ n ≤ 6. Chỉ acid tác dụng được với Na, ' + C('NaHCO3') + '.</p>';
      $('#si-out', body).innerHTML = h;
    }
    draw();
  })();

  // ---- 3. Lắp chất béo ----
  (function () {
    var root = document.getElementById('sim-fat'); if (!root) return;
    var body = $('.sim-body', root), st = { ids: ['O', 'O', 'O'], n: 0.1 };
    var opts = ['P', 'S', 'O', 'L'].map(function (k) { return '<option value="' + k + '">' + LT.uni(FA[k].rcoo) + ' · ' + FA[k].name.replace(' acid', '') + (FA[k].cc ? ' (' + FA[k].cc + ' C=C)' : ' (no)') + '</option>'; }).join('');
    body.innerHTML = '<div class="sim-row"><div>' + [0, 1, 2].map(function (i) {
      return '<label class="ctl" style="margin-bottom:8px"><span>Gốc acid béo ở vị trí ' + (i + 1) + '</span><select data-i="' + i + '">' + opts + '</select></label>';
    }).join('') + '<label class="ctl"><span>Số mol chất béo đem phản ứng</span><input type="number" id="sf-n" min="0.01" max="10" step="0.01" value="0.1"></label>' +
      '<div class="picks" style="margin-top:10px"><button type="button" class="pick" data-set="PPP">Tripalmitin</button><button type="button" class="pick" data-set="SSS">Tristearin</button><button type="button" class="pick" data-set="OOO">Triolein</button><button type="button" class="pick" data-set="LLL">Trilinolein</button></div></div>' +
      '<div class="stage" id="sf-svg"></div></div><div class="out" id="sf-out" aria-live="polite"></div>';
    var sels = body.querySelectorAll('select');
    function sync() { Array.prototype.forEach.call(sels, function (s, i) { s.value = st.ids[i]; }); }
    Array.prototype.forEach.call(sels, function (s) { s.addEventListener('change', function () { st.ids[+s.getAttribute('data-i')] = s.value; draw(); }); });
    $('#sf-n', body).addEventListener('input', function (e) { var v = parseFloat(String(e.target.value).replace(',', '.')); if (v > 0 && v <= 1000) { st.n = v; draw(); } });
    body.addEventListener('click', function (e) { var b = e.target.closest('[data-set]'); if (!b) return; st.ids = b.getAttribute('data-set').split(''); sync(); draw(); });
    function chain(id, y) {
      var x = FA[id], bonds = x.C - 1, db = x.cc === 1 ? [9] : x.cc === 2 ? [9, 12] : [];
      var L = 13.5, A = 4.5, th = 0, cx = 150, cy = y, pts = [[cx, cy]], seg = [];
      for (var i = 1; i <= bonds; i++) {
        if (db.indexOf(i - 1) >= 0) th += 22 * Math.PI / 180;
        cx += L * Math.cos(th); cy += L * Math.sin(th);
        var s = i % 2 ? -A : A;
        pts.push([cx - s * Math.sin(th), cy + s * Math.cos(th)]);
        if (db.indexOf(i) >= 0) seg.push(i);
      }
      var p = pts.map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' ');
      var sv = '<polyline points="' + p + '" fill="none" stroke="#7a1633" stroke-width="2.4" stroke-linejoin="round"/>';
      seg.forEach(function (i) { var a = pts[i - 1], b = pts[i]; sv += '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" stroke="#ff8fb3" stroke-width="7" stroke-linecap="round" opacity=".9"/><line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" stroke="#7a1633" stroke-width="2.4"/>'; });
      return sv;
    }
    function svg(ids) {
      var rows = [42, 127, 212], s = '<svg viewBox="0 0 470 290" role="img" aria-label="Sơ đồ phân tử chất béo">';
      s += '<line x1="34" y1="' + (rows[0] + 9) + '" x2="34" y2="' + (rows[1] - 14) + '" stroke="#3b0a1a" stroke-width="2.4"/><line x1="34" y1="' + (rows[1] + 9) + '" x2="34" y2="' + (rows[2] - 14) + '" stroke="#3b0a1a" stroke-width="2.4"/>';
      rows.forEach(function (y, i) {
        var x = FA[ids[i]];
        s += '<text x="' + (i === 1 ? 26 : 18) + '" y="' + (y + 5) + '" font-size="14" font-weight="800" fill="#3b0a1a">' + (i === 1 ? 'CH' : 'CH₂') + '</text>';
        s += '<line x1="56" y1="' + y + '" x2="84" y2="' + y + '" stroke="#3b0a1a" stroke-width="2.4"/><text x="86" y="' + (y + 5) + '" font-size="14" font-weight="800" fill="#c8301a">O</text>';
        s += '<line x1="100" y1="' + y + '" x2="150" y2="' + y + '" stroke="#3b0a1a" stroke-width="2.4"/>';
        s += '<line x1="120" y1="' + (y - 2) + '" x2="120" y2="' + (y - 20) + '" stroke="#3b0a1a" stroke-width="2"/><line x1="126" y1="' + (y - 2) + '" x2="126" y2="' + (y - 20) + '" stroke="#3b0a1a" stroke-width="2"/><text x="116" y="' + (y - 23) + '" font-size="13" font-weight="800" fill="#c8301a">O</text>';
        s += chain(ids[i], y);
        s += '<text x="160" y="' + (y - 14) + '" font-size="11" font-weight="700" fill="#9b1c40">' + x.an + (x.cc ? ' · ' + x.cc + ' C=C (cis)' : ' · no') + '</text>';
      });
      s += '<text x="12" y="282" font-size="11" fill="#6d4a57">Phần glycerol bên trái · gốc acid béo bên phải · đoạn hồng = liên kết C=C</text></svg>';
      return s;
    }
    function draw() {
      var o = fat(st.ids, st.n), h = '';
      $('#sf-svg', body).innerHTML = svg(st.ids);
      h += '<h5>Chất béo vừa lắp</h5><div class="big-f">' + C(o.f) + '</div><p style="margin:2px 0 6px"><b>' + LT.esc(o.name) + '</b></p>';
      h += '<div class="facts">' + fact(C(o.mf), 'Công thức phân tử') + fact(o.M, 'Phân tử khối M') + fact(o.cc, 'Số liên kết C=C') + fact(o.pi, 'Tổng số liên kết π') + '</div>';
      h += '<p style="margin:6px 0"><span class="flag ' + (o.unsat >= 2 ? 'info' : 'warn') + '">' + o.state + '</span> <span class="muted">' + (o.unsat >= 2 ? 'Nhiều gốc không no dạng cis gấp khúc, khó xếp khít.' : 'Nhiều gốc no thẳng, xếp khít vào nhau.') + '</span></p>';
      h += '<h5>Xà phòng hóa ' + F(o.n, 3) + ' mol chất béo (' + F(o.mass, 2) + ' g)</h5>' + eqBox(o.eqSap);
      h += '<ul class="steps"><li>Cần <b>' + F(o.naoh, 3) + ' mol NaOH</b> = ' + F(o.naoh * 40, 2) + ' g (gấp 3 lần số mol chất béo).</li>' +
        '<li>Thu được <b>' + F(o.n, 3) + ' mol glycerol</b> = ' + F(o.glycerol, 2) + ' g.</li>' +
        '<li>Muối: ' + o.salts.map(function (x) { return C(x.f) + ' ' + F(x.mol, 3) + ' mol (' + F(x.mol * x.M, 2) + ' g)'; }).join('; ') + ' → tổng <b>' + F(o.saltMass, 2) + ' g</b>.</li>' +
        '<li>Kiểm tra bảo toàn khối lượng: ' + F(o.mass, 2) + ' + ' + F(o.naoh * 40, 2) + ' = ' + F(o.saltMass, 2) + ' + ' + F(o.glycerol, 2) + ' ✓</li></ul>';
      h += '<h5>Thủy phân trong môi trường acid</h5>' + eqBox(o.eqAcid);
      h += '<h5>Hydrogen hóa</h5>' + (o.cc ? eqBox(o.eqH2) + '<p style="margin:4px 0">Cần ' + F(o.h2, 3) + ' mol H<sub>2</sub> (cũng là số mol Br<sub>2</sub> tối đa làm mất màu). Dầu lỏng chuyển thành mỡ rắn, dùng làm bơ thực vật.</p>' : '<p class="muted" style="margin:4px 0">Chất béo no, không có liên kết C=C nên không cộng H<sub>2</sub>, không làm mất màu nước bromine.</p>');
      $('#sf-out', body).innerHTML = h;
    }
    sync(); draw();
  })();

  // ---- 4. Xà phòng làm sạch vết dầu + nước cứng ----
  (function () {
    var root = document.getElementById('sim-soap'); if (!root) return;
    var body = $('.sim-body', root), step = 0, timer = null;
    var D0 = [[210, 240, 72, 17], [300, 238, 80, 22], [390, 240, 72, 17]];
    var DROP = [D0, D0, [[175, 150, 23, 23], [300, 112, 23, 23], [425, 150, 23, 23]], [[470, 70, 23, 23], [535, 46, 23, 23], [560, 120, 23, 23]]];
    var SCAT = [[70, 60, 20], [130, 120, -40], [200, 48, 70], [252, 138, 160], [322, 66, -110], [383, 150, 40], [440, 58, -20], [500, 128, 100], [552, 66, -60], [92, 176, 130],
      [160, 170, -150], [470, 182, 30], [540, 176, -90], [280, 40, 10], [350, 118, 200], [420, 104, -140], [58, 128, 80], [228, 92, -70]];
    function deg(r) { return r * 180 / Math.PI; }
    function onBlob(i) {
      var t = (200 + i * 140 / 17) * Math.PI / 180, ex = 300 + 150 * Math.cos(t), ey = 236 + 26 * Math.sin(t);
      var nx = Math.cos(t) / 150, ny = Math.sin(t) / 26, l = Math.sqrt(nx * nx + ny * ny); nx /= l; ny /= l;
      return [ex + nx * 21, ey + ny * 21, deg(Math.atan2(nx, -ny))];
    }
    function onDrop(d, j) {
      var t = (j * 60 + 30) * Math.PI / 180, nx = Math.cos(t), ny = Math.sin(t);
      return [d[0] + nx * 41, d[1] + ny * 41, deg(Math.atan2(nx, -ny))];
    }
    function pose(s, i) {
      if (s === 0) return SCAT[i];
      if (s === 1) return onBlob(i);
      return onDrop(DROP[s][Math.floor(i / 6)], i % 6);
    }
    var CAP = [
      '<b>(a)</b> Vết dầu mỡ bám trên sợi vải. Dầu mỡ không tan trong nước nên nước không cuốn trôi được. Các phân tử xà phòng tan vào nước, làm giảm sức căng bề mặt nên vải dễ thấm ướt.',
      '<b>(b)</b> Đuôi kị nước (gốc hydrocarbon dài, ưa dầu mỡ) thâm nhập vào vết dầu; đầu ưa nước (–COO<sup>–</sup>Na<sup>+</sup>) ở lại trong nước.',
      '<b>(c)</b> Khi vò, giặt, vết dầu bị chia thành những hạt rất nhỏ. Mỗi hạt được các phân tử xà phòng bao quanh, đầu ưa nước quay ra ngoài.',
      '<b>(d)</b> Các hạt dầu được "bọc" như vậy phân tán vào nước và bị nước xả cuốn trôi, vải sạch. Xà phòng không phản ứng hóa học với vết bẩn, chỉ làm vết bẩn phân tán vào nước.'
    ];
    var mols = '', i;
    for (i = 0; i < 18; i++) mols += '<g class="mol" style="transition:transform .9s ease"><polyline points="0,6 4,11 -4,16 4,21 -4,26 4,31 0,35" fill="none" stroke="#5a1028" stroke-width="2.2" stroke-linejoin="round"/><circle r="6.5" fill="#ff8fb3" stroke="#7a1633" stroke-width="2"/></g>';
    var drops = '';
    for (i = 0; i < 3; i++) drops += '<g class="drop" style="transition:transform .9s ease"><circle r="1" fill="#f2b33d"/></g>';
    var fabric = '';
    for (i = 0; i < 30; i++) fabric += '<rect x="' + (i * 20) + '" y="252" width="10" height="48" fill="#ffc2d6"/>';
    body.innerHTML = '<div class="stage"><svg viewBox="0 0 600 300" role="img" aria-label="Cơ chế giặt rửa của xà phòng">' +
      '<rect width="600" height="300" fill="#e7f4fb"/><rect y="252" width="600" height="48" fill="#ff8fb3"/>' + fabric +
      '<text x="12" y="290" font-size="12" font-weight="800" fill="#3b0a1a">SỢI VẢI</text><text x="12" y="22" font-size="12" font-weight="800" fill="#2e6f96">NƯỚC</text>' +
      '<g id="ss-flow" style="transition:opacity .6s" opacity="0"><path d="M300 200 C 380 170, 430 120, 500 90" fill="none" stroke="#2e6f96" stroke-width="3" stroke-dasharray="8 7"/><path d="M492 82 l14 4 -8 12" fill="none" stroke="#2e6f96" stroke-width="3"/><text x="318" y="230" font-size="12" font-weight="800" fill="#2e6f96">nước xả cuốn trôi</text></g>' +
      drops + mols + '</svg></div>' +
      '<div class="stepbar"><button type="button" class="btn sm ghost" data-ss="prev">◀ Trước</button><button type="button" class="btn sm" data-ss="next">Tiếp ▶</button><button type="button" class="btn sm ghost" data-ss="play">Tự chạy</button><div class="dots"><i></i><i></i><i></i><i></i></div></div>' +
      '<p class="capt" id="ss-cap" aria-live="polite"></p>' +
      '<h5 style="margin:22px 0 6px;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;color:var(--burg-600)">Thử với các loại nước</h5>' +
      '<div id="ss-w"></div><div class="stage" id="ss-beaker"></div><div class="out" id="ss-wout" aria-live="polite"></div>';
    var gm = body.querySelectorAll('.mol'), gd = body.querySelectorAll('.drop'), dots = body.querySelectorAll('.dots i');
    function show(s) {
      step = (s + 4) % 4;
      for (var k = 0; k < 18; k++) { var p = pose(step, k); gm[k].style.transform = 'translate(' + p[0].toFixed(1) + 'px,' + p[1].toFixed(1) + 'px) rotate(' + p[2].toFixed(1) + 'deg)'; }
      for (k = 0; k < 3; k++) { var d = DROP[step][k]; gd[k].style.transform = 'translate(' + d[0] + 'px,' + d[1] + 'px) scale(' + d[2] + ',' + d[3] + ')'; }
      $('#ss-flow', body).setAttribute('opacity', step === 3 ? '1' : '0');
      Array.prototype.forEach.call(dots, function (x, k) { x.classList.toggle('on', k === step); });
      $('#ss-cap', body).innerHTML = CAP[step];
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; $('[data-ss="play"]', body).textContent = 'Tự chạy'; } }
    body.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ss]'); if (!b) return;
      var a = b.getAttribute('data-ss');
      if (a === 'next') { stop(); show(step + 1); }
      else if (a === 'prev') { stop(); show(step - 1); }
      else if (timer) stop();
      else { b.textContent = 'Dừng'; show(step + 1); timer = setInterval(function () { show(step + 1); }, 2200); }
    });
    show(0);

    // Hai cốc: xà phòng và chất giặt rửa tổng hợp trong các loại nước
    var WATER = {
      soft: { label: 'Nước mềm', soap: [1, 0], det: [1, 0], txt: 'Cả xà phòng và chất giặt rửa tổng hợp đều tạo nhiều bọt và giặt rửa tốt.' },
      hard: { label: 'Nước cứng (có Ca<sup>2+</sup>, Mg<sup>2+</sup>)', soap: [0.15, 1], det: [1, 0],
        txt: 'Xà phòng tạo kết tủa với Ca<sup>2+</sup>, Mg<sup>2+</sup> (váng trắng bám lên vải), ít bọt, giảm tác dụng giặt rửa:' + C('2C17H35COONa + Ca^{2+} → (C17H35COO)2Ca↓ + 2Na^{+}').replace(/^/, '<span class="eq" style="display:block;margin:6px 0">') + '</span>Muối calcium, magnesium của alkylbenzene sulfonate tan được trong nước nên chất giặt rửa tổng hợp vẫn dùng tốt.' },
      acid: { label: 'Nước có acid (giấm)', soap: [0.15, 1], det: [1, 0],
        txt: 'Trong môi trường acid, muối của acid béo chuyển thành acid béo không tan, nổi váng:' + C('C17H35COONa + H^{+} → C17H35COOH↓ + Na^{+}').replace(/^/, '<span class="eq" style="display:block;margin:6px 0">') + '</span>Alkylbenzene sulfonic acid là acid mạnh, vẫn ở dạng ion nên chất giặt rửa tổng hợp không bị ảnh hưởng.' }
    };
    function beaker(x, foam, flakes, label, sub) {
      var s = '<g transform="translate(' + x + ',0)"><path d="M10 30 L10 170 Q10 186 26 186 L194 186 Q210 186 210 170 L210 30" fill="#fff" stroke="#3b0a1a" stroke-width="3"/>' +
        '<rect x="13" y="78" width="194" height="105" fill="#d6ecf7"/>';
      var f = '';
      for (var k = 0; k < 14; k++) f += '<circle cx="' + (24 + (k * 37) % 172) + '" cy="' + (66 + (k * 13) % 18) + '" r="' + (7 + (k * 5) % 7) + '" fill="#fff" stroke="#9ec9e2" stroke-width="1.5"/>';
      s += '<g style="transition:opacity .6s" opacity="' + foam + '">' + f + '</g>';
      var p = '';
      for (k = 0; k < 16; k++) p += '<rect x="' + (22 + (k * 41) % 170) + '" y="' + (92 + (k * 23) % 84) + '" width="' + (8 + k % 3 * 3) + '" height="4" fill="#f5f5f5" stroke="#8a8a8a" stroke-width="1" transform="rotate(' + ((k * 37) % 60 - 30) + ' ' + (26 + (k * 41) % 170) + ' ' + (94 + (k * 23) % 84) + ')"/>';
      s += '<g style="transition:opacity .6s" opacity="' + flakes + '">' + p + '</g>';
      s += '<text x="110" y="208" text-anchor="middle" font-size="13" font-weight="800" fill="#3b0a1a">' + label + '</text><text x="110" y="224" text-anchor="middle" font-size="11" fill="#6d4a57">' + sub + '</text></g>';
      return s;
    }
    var wcur = 'soft';
    LT.picks($('#ss-w', body), Object.keys(WATER).map(function (k) { return { id: k, label: WATER[k].label }; }), wcur, function (k) { wcur = k; drawW(); });
    function drawW() {
      var w = WATER[wcur];
      $('#ss-beaker', body).innerHTML = '<svg viewBox="0 0 600 236" role="img" aria-label="So sánh xà phòng và chất giặt rửa">' + beaker(50, w.soap[0], w.soap[1], 'Xà phòng', 'C₁₇H₃₅COONa') + beaker(340, w.det[0], w.det[1], 'Chất giặt rửa tổng hợp', 'CH₃[CH₂]₁₁C₆H₄SO₃Na') + '</svg>';
      $('#ss-wout', body).innerHTML = w.txt;
    }
    drawW();
  })();
})(typeof window !== 'undefined' ? window : globalThis);
