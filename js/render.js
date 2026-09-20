/* Hiển thị câu hỏi (dùng cho làm bài, luyện tập, xem lại) */
(function (g) {
  'use strict';
  var C = g.Chem, chem = C.chem;
  var L = ['A', 'B', 'C', 'D'];

  function explainBlock(q) {
    var t = q.explain;
    if (q.type === 'tf') {
      t = q.items.map(function (it, i) {
        return String.fromCharCode(97 + i) + ') ' + (it.a ? 'ĐÚNG' : 'SAI') + (it.explain ? ' — ' + it.explain : '');
      }).join('\n');
      if (q.explain) t = q.explain + '\n' + t;
    }
    if (q.type === 'mcq' && !t) t = 'Đáp án đúng: ' + L[q.correct] + '.';
    if (!t) return '';
    return '<div class="explain"><b>Lời giải</b><div>' + chem(t) + '</div></div>';
  }

  // state: 'open' (đang làm), 'checked' (đã kiểm tra / xem lại)
  function questionHTML(q, i, ans, state) {
    var checked = state === 'checked';
    var h = '<article class="q" id="q' + i + '" data-i="' + i + '"><div class="qhead"><span class="qnum">Câu ' + (i + 1) + '</span>';
    if (checked) {
      var s = C.scoreQuestion(q, ans), full = q.type === 'tf' ? 1 : 0.25;
      var cls = s >= full ? 'ok' : (s > 0 ? 'part' : (C.isAnswered(q, ans) ? 'bad' : 'skip'));
      var label = s >= full ? 'Đúng' : (s > 0 ? 'Đúng một phần' : (C.isAnswered(q, ans) ? 'Sai' : 'Chưa làm'));
      h += '<span class="badge ' + cls + '">' + label + ' · ' + C.fmt(s) + ' đ</span>';
    }
    h += '</div><div class="qtext">' + chem(q.text) + '</div>';

    if (q.type === 'mcq') {
      h += '<div class="opts">';
      q.options.forEach(function (o, k) {
        var c = 'opt';
        if (ans === k) c += ' sel';
        if (checked && k === q.correct) c += ' right';
        if (checked && ans === k && k !== q.correct) c += ' wrong';
        h += '<button class="' + c + '" data-act="mcq" data-k="' + k + '"' + (checked ? ' disabled' : '') + '><b>' + L[k] + '.</b> <span>' + chem(o) + '</span></button>';
      });
      h += '</div>';
    } else if (q.type === 'tf') {
      h += '<div class="tf">';
      q.items.forEach(function (it, k) {
        var a = ans ? ans[k] : undefined, rc = '';
        if (checked) rc = a === it.a ? ' right' : ' wrong';
        h += '<div class="tfrow' + rc + '"><div class="tftext"><b>' + String.fromCharCode(97 + k) + ')</b> ' + chem(it.t) + '</div><div class="tfbtns">' +
          '<button class="tfb' + (a === true ? ' sel' : '') + '" data-act="tf" data-k="' + k + '" data-v="1"' + (checked ? ' disabled' : '') + '>Đúng</button>' +
          '<button class="tfb' + (a === false ? ' sel' : '') + '" data-act="tf" data-k="' + k + '" data-v="0"' + (checked ? ' disabled' : '') + '>Sai</button></div></div>';
      });
      h += '</div>';
    } else {
      var val = ans === undefined ? '' : String(ans).replace(/"/g, '&quot;');
      h += '<div class="short"><input type="text" inputmode="decimal" autocomplete="off" placeholder="Nhập đáp án (dùng dấu phẩy, vd 12,5)" data-act="short" value="' + val + '"' + (checked ? ' disabled' : '') + '>';
      if (q.unit) h += '<span class="unit">' + q.unit + '</span>';
      if (checked) h += '<div class="keyline">Đáp án: <b>' + C.fmt(q.answer, 4) + (q.unit || '') + '</b></div>';
      h += '</div>';
    }
    if (checked) h += explainBlock(q);
    h += '</article>';
    return h;
  }

  g.Render = { questionHTML: questionHTML, L: L };
})(window);
