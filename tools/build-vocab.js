/* Tạo dữ liệu từ vựng SAT (js/vocab/*.js) từ file Google Sheets xuất ra .xlsx.
   Cách dùng:  node tools/build-vocab.js duong-dan/vocab.xlsx
   (tải file: Google Sheets → Tệp → Tải xuống → .xlsx, hoặc mở link .../export?format=xlsx)
   Không cần cài thêm gói nào: tự giải nén .xlsx bằng zlib có sẵn của Node. */
'use strict';
var fs = require('fs'), path = require('path'), zlib = require('zlib');

// ---------- Đọc .xlsx (zip) ----------
function unzip(buf) {
  var files = {}, eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  var n = buf.readUInt16LE(eocd + 10), off = buf.readUInt32LE(eocd + 16);
  for (var i = 0; i < n; i++) {
    var method = buf.readUInt16LE(off + 10), csize = buf.readUInt32LE(off + 20);
    var nlen = buf.readUInt16LE(off + 28), xlen = buf.readUInt16LE(off + 30), clen = buf.readUInt16LE(off + 32);
    var local = buf.readUInt32LE(off + 42), name = buf.toString('utf8', off + 46, off + 46 + nlen);
    var start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    var data = buf.slice(start, start + csize);
    files[name] = method === 8 ? zlib.inflateRawSync(data) : data;
    off += 46 + nlen + xlen + clen;
  }
  return files;
}
function dec(s) {
  return s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, function (m, n) { return String.fromCodePoint(+n); })
    .replace(/&#x([0-9a-f]+);/gi, function (m, n) { return String.fromCodePoint(parseInt(n, 16)); })
    .replace(/&amp;/g, '&');
}
function texts(xml) { var t = '', re = /<t[^>]*>([\s\S]*?)<\/t>/g, m; while ((m = re.exec(xml))) t += m[1]; return dec(t); }
function readBook(file) {
  var z = unzip(fs.readFileSync(file)), str = function (p) { return z[p] ? z[p].toString('utf8') : ''; };
  var ss = [], m, re = /<si>([\s\S]*?)<\/si>/g, sx = str('xl/sharedStrings.xml');
  while ((m = re.exec(sx))) ss.push(texts(m[1]));
  var rels = {}; re = /<Relationship [^>]*Id="(\w+)"[^>]*Target="([^"]+)"/g; sx = str('xl/_rels/workbook.xml.rels');
  while ((m = re.exec(sx))) rels[m[1]] = 'xl/' + m[2].replace(/^\/?xl\//, '');
  var sheets = {}; re = /<sheet [^>]*name="([^"]+)"[^>]*r:id="(\w+)"/g; sx = str('xl/workbook.xml');
  while ((m = re.exec(sx))) sheets[dec(m[1])] = parseSheet(str(rels[m[2]]), ss);
  return sheets;
}
function col(c) { var n = 0; for (var i = 0; i < c.length; i++) n = n * 26 + c.charCodeAt(i) - 64; return n - 1; }
function parseSheet(xml, ss) {
  var rows = [], rr = /<row [^>]*?r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g, m;
  while ((m = rr.exec(xml))) {
    var row = [], cr = /<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g, c;
    while ((c = cr.exec(m[2]))) {
      var t = /t="(\w+)"/.exec(c[2]), body = c[3] || '', v = /<v>([\s\S]*?)<\/v>/.exec(body), val = '';
      if (t && t[1] === 's' && v) val = ss[+v[1]];
      else if (t && t[1] === 'inlineStr') val = texts(body);
      else if (v) val = dec(v[1]);
      val = String(val).replace(/\r/g, '').trim();
      if (val !== '') row[col(c[1])] = val;
    }
    if (row.length) rows.push(row);
  }
  return rows;
}

// ---------- Chuyển từng sheet thành bộ thẻ ----------
function clean(o) { Object.keys(o).forEach(function (k) { if (o[k] === undefined || o[k] === '') delete o[k]; }); return o; }
var isNum = function (s) { return /^\d+(\.0)?$/.test(s || ''); };

// Sheet chia theo "BUỔI n", mỗi hàng: STT | Word | ...
function byBuoi(rows, map) {
  var sets = [], cur = null;
  rows.forEach(function (r) {
    var first = r.filter(Boolean);
    if (first.length === 1 && /^BU[ỔO]I\s*\d+/i.test(first[0])) { cur = { n: first[0].replace(/^BU[ỔO]I/i, 'Buổi'), c: [] }; sets.push(cur); return; }
    if (!isNum(r[0]) || !r[1]) return;
    if (!cur) { cur = { n: 'Buổi 1', c: [] }; sets.push(cur); }
    cur.c.push(clean(map(r)));
  });
  return sets;
}
function chunk(cards, size, label) {
  var sets = [];
  for (var i = 0; i < cards.length; i += size) sets.push({ n: label + ' ' + (sets.length + 1), c: cards.slice(i, i + size) });
  return sets;
}

var BUILD = {
  v30: function (rows) {
    return byBuoi(rows, function (r) { return { t: r[1], p: r[2], d: r[3], i: r[4], e: r[5], ev: r[6], mv: r[7] }; });
  },
  v21: function (rows) {
    return byBuoi(rows, function (r) { return { t: r[1], p: r[2], d: r[3], i: r[4], e: r[5], ev: r[6], me: r[7], mv: r[8], f: r[9] }; });
  },
  old: function (rows) {
    return byBuoi(rows, function (r) { return { t: r[1], p: r[2], d: r[3], e: r[4], ev: r[5] }; });
  },
  roots: function (rows) {
    var head = rows.findIndex(function (r) { return r[0] === 'Prefix'; }), sets = [
      { n: 'Prefixes · Tiền tố', c: [] }, { n: 'Suffixes · Hậu tố', c: [] }, { n: 'Roots · Gốc từ', c: [] }];
    rows.slice(head + 1).forEach(function (r) {
      [[0, 'prefix'], [4, 'suffix'], [8, 'root']].forEach(function (g, k) {
        if (r[g[0]]) sets[k].c.push(clean({ t: r[g[0]], p: g[1], d: r[g[0] + 1], e: r[g[0] + 2] }));
      });
    });
    return sets;
  },
  archaic: function (rows) {
    var cards = [];
    rows.forEach(function (r) { if (isNum(r[0]) && r[1]) cards.push(clean({ t: r[1], d: r[2] })); });
    return chunk(cards, 20, 'Phần');
  },
  math: function (rows) {
    // Hàng chỉ có 1 ô là tiêu đề; tiêu đề viết hoa (hoặc "Hàm số & Đồ thị") mở phần mới, còn lại là nhóm con
    var sets = [], cur = null, sub = '', units = false;
    rows.forEach(function (r) {
      var cells = r.filter(Boolean);
      if (cells.length === 1 && r[0]) {
        var h = r[0], major = h === h.toUpperCase() || /^Hàm số & Đồ thị$/.test(h);
        if (major) { cur = { n: h === h.toUpperCase() ? h.charAt(0) + h.slice(1).toLowerCase() : h, c: [] }; sets.push(cur); sub = ''; units = /ĐƠN VỊ/.test(h); }
        else sub = h;
        return;
      }
      if (!cur || !r[0] || !r[1]) return;
      if (r[0] === 'ĐƠN VỊ GỐC') return; // hàng tiêu đề bảng quy đổi
      // Thẻ: mặt trước là thuật ngữ tiếng Anh, mặt sau là nghĩa tiếng Việt (bảng quy đổi: đơn vị gốc → quy đổi)
      cur.c.push(clean(units ? { t: r[0], d: r[1], g: sub } : { t: r[1], d: r[0], e: r[2], g: sub }));
    });
    sets.forEach(function (s) { s.n = s.n.replace(/^(\S)/, function (a) { return a.toUpperCase(); }); });
    return sets;
  },
  merge: function (rows) {
    var groups = {}, order = ['Priority-1', 'Priority-2', 'Priority-3', 'Archaic', '#N/A'];
    rows.slice(1).forEach(function (r) {
      if (!r[2]) return;
      var c = clean({ t: r[2], p: r[3], d: r[5] || r[4], de: r[5] ? r[4] : '', e: r[6], ev: r[13] });
      var extra = [];
      if (r[7] && r[7] !== r[3]) extra.push('Loại từ 2: ' + r[7]);
      if (r[8]) extra.push('Nghĩa 2: ' + r[8]);
      if (r[9]) extra.push('Ví dụ 2: ' + r[9]);
      if (r[10]) extra.push('Loại từ 3: ' + r[10]);
      if (r[11]) extra.push('Nghĩa 3: ' + r[11]);
      if (r[12]) extra.push('Ví dụ 3: ' + r[12]);
      if (extra.length) c.x = extra.join('\n');
      var g = r[1] || '#N/A'; (groups[g] = groups[g] || []).push(c);
    });
    Object.keys(groups).forEach(function (g) { if (order.indexOf(g) < 0) order.push(g); });
    var sets = [];
    order.forEach(function (g) {
      if (!groups[g]) return;
      var label = g === '#N/A' ? 'Chưa phân loại' : g === 'Archaic' ? 'Archaic' : g.replace('Priority-', 'Ưu tiên ');
      sets = sets.concat(chunk(groups[g], 25, label + ' ·'));
    });
    return sets;
  }
};

// ---------- Danh sách bộ thẻ (giữ thứ tự & tên như các sheet) ----------
var DECKS = [
  { id: 'v30', sheet: 'SAT Vocab v3.0', build: 'v30', name: 'SAT Vocab v3.0', kind: 'word', desc: 'Digital SAT Vocabulary – cập nhật 8/2026. Nghĩa tiếng Việt, phiên âm US, ví dụ kèm dịch và mẹo nhớ bằng câu chuyện.' },
  { id: 'v21', sheet: 'SAT Vocab v2.1 (Official)', build: 'v21', name: 'SAT Vocab v2.1 (Official)', kind: 'word', desc: 'Bộ từ chính thức v2.1: nghĩa, phiên âm, ví dụ, mẹo nhớ tiếng Anh và tiếng Việt, cấp độ CEFR.' },
  { id: 'roots', sheet: 'Prefixes, & Suffixes', build: 'roots', name: 'Prefixes, Suffixes & Roots', kind: 'root', desc: 'Tiền tố, hậu tố và gốc từ quan trọng trong SAT – đoán nghĩa từ mới qua cấu tạo từ.' },
  { id: 'archaic', sheet: 'Archaic words', build: 'archaic', name: 'Archaic words', kind: 'archaic', desc: 'Từ cổ hay gặp trong các bài văn, thơ của SAT (thou, thee, hath, whence…).' },
  { id: 'math', sheet: 'SAT MATH Vocab', build: 'math', name: 'SAT Math Vocab', kind: 'math', desc: 'Thuật ngữ Toán SAT theo chủ đề: đại số, hàm số, hình học, lượng giác, đường tròn, xác suất – thống kê, quy đổi đơn vị.' },
  { id: 'old6', sheet: 'SAT Vocab (Cũ)', build: 'old', name: 'SAT Vocab (Cũ)', kind: 'word', hidden: true, desc: 'Sheet ẩn: bản cũ của bộ từ SAT, gồm nhiều từ không có trong v2.1 và v3.0.' },
  { id: 'old1', sheet: 'SAT Vocab-old', build: 'old', name: 'SAT Vocab-old', kind: 'word', hidden: true, desc: 'Sheet ẩn: bản cũ nhất của bộ từ SAT, gồm nhiều từ không có trong các bản sau.' },
  { id: 'merge', sheet: 'Merge', build: 'merge', name: 'Merge · Kho tổng hợp', kind: 'word', hidden: true, desc: 'Sheet ẩn: kho tổng hợp hơn 2000 từ chia theo mức ưu tiên (Priority 1 – 3, Archaic, chưa phân loại), định nghĩa tiếng Anh/Việt và ví dụ.' }
];

function key(deck, c) {
  var t = c.t.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, ' ').trim();
  if (deck.kind === 'word' || deck.kind === 'archaic') return t;   // cùng một từ ở các bộ khác nhau dùng chung tiến độ
  return deck.id + ':' + t + (deck.kind === 'math' ? '=' + c.d.toLowerCase() : '');
}

function main() {
  var file = process.argv[2];
  if (!file) { console.error('Cách dùng: node tools/build-vocab.js vocab.xlsx'); process.exit(1); }
  var book = readBook(file), out = path.join(__dirname, '..', 'js', 'vocab'), index = [];
  if (!fs.existsSync(out)) fs.mkdirSync(out);
  DECKS.forEach(function (d) {
    if (!book[d.sheet]) { console.warn('Không thấy sheet: ' + d.sheet); return; }
    var sets = BUILD[d.build](book[d.sheet]), n = 0;
    sets.forEach(function (s) { s.c.forEach(function (c) { c.k = key(d, c); n++; }); });
    var meta = { id: d.id, name: d.name, sheet: d.sheet, kind: d.kind, desc: d.desc, hidden: !!d.hidden, count: n,
      sets: sets.map(function (s) { return { n: s.n, k: s.c.map(function (c) { return c.k; }) }; }) };
    index.push(meta);
    fs.writeFileSync(path.join(out, d.id + '.js'), '/* Tạo tự động bởi tools/build-vocab.js từ sheet "' + d.sheet + '" – đừng sửa tay */\nVocab.addDeck(' +
      JSON.stringify({ id: d.id, sets: sets }) + ');\n');
    console.log(d.id.padEnd(8), String(n).padStart(5), 'thẻ', String(sets.length).padStart(3), 'phần');
  });
  fs.writeFileSync(path.join(out, 'index.js'), '/* Tạo tự động bởi tools/build-vocab.js – danh sách bộ thẻ và khóa từng thẻ */\nVocab.setIndex(' + JSON.stringify(index) + ');\n');
}
main();
