/* Khai báo danh sách đề. Thêm đề mới: define() ở đây + tạo file js/exams/deN.js + thêm <script> vào hoa.html */
(function (g) {
  'use strict';
  var E = g.Chem.Exams, chap = 'Chương 1. Ester – Lipid';
  E.define({ id: 'de1', chapter: chap, title: 'Đề 1 · Ester', desc: 'Khái niệm, danh pháp, đồng phân, tính chất, thủy phân và điều chế ester.' });
  E.define({ id: 'de2', chapter: chap, title: 'Đề 2 · Lipid – Chất béo', desc: 'Chất béo, acid béo, phản ứng thủy phân và hydrogen hóa, tính toán khối lượng muối.' });
  E.define({ id: 'de3', chapter: chap, title: 'Đề 3 · Xà phòng và chất giặt rửa', desc: 'Cấu tạo, tính chất giặt rửa, sản xuất xà phòng, nước cứng, thí nghiệm xà phòng hóa.' });
  E.define({ id: 'de4', chapter: chap, title: 'Đề 4 · Tổng hợp chương 1 (số 1)', desc: 'Đề tổng hợp Ester – Lipid – Xà phòng, độ khó trung bình.' });
  E.define({ id: 'de5', chapter: chap, title: 'Đề 5 · Tổng hợp chương 1 (số 2)', desc: 'Đề tổng hợp có câu đọc hiểu thí nghiệm và bài toán vận dụng.' });
  E.define({ id: 'de6', chapter: chap, title: 'Đề 6 · Vận dụng cao', desc: 'Đề nâng cao: đồng phân, hỗn hợp, bảo toàn khối lượng, biện luận công thức.' });
  // Đề trộn: mỗi mã đề bốc ngẫu nhiên 28 câu từ kho câu của Đề 1–6
  E.define({ id: 'de7', chapter: 'Tổng hợp · Đề 1 – 6', title: 'Đề 7 · Trộn tổng hợp', desc: 'Mỗi mã đề là một đề khác: 28 câu bốc ngẫu nhiên từ Đề 1 – 6 (ester, chất béo, xà phòng), câu tính toán vẫn đổi số.', blend: ['de1', 'de2', 'de3', 'de4', 'de5', 'de6'], mix: true });
})(window);
