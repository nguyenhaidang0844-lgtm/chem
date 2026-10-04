/* Khai báo danh sách đề. Thêm đề mới: define() ở đây + tạo file js/exams/deN.js + thêm <script> vào hoa.html
   Mỗi đợt upload đề là một phần mới: gọi E.section({...}) trước các define() của đợt đó. */
(function (g) {
  'use strict';
  var E = g.Chem.Exams, chap = 'Chương 1. Ester – Lipid';
  // theory: trang lý thuyết của phần (hiện ở mục "Lý thuyết" trên trang chủ môn Hóa và link "Ôn lý thuyết" của phần)
  E.section({ id: 1, title: 'Phần 1 · Ester – Lipid', desc: 'Ester, chất béo, xà phòng và chất giặt rửa · Đề 1 – 7.',
    theory: { href: 'ester-lipid.html', chap: 'Chương 1', name: 'Ester – Lipid', meta: '3 bài · 4 mô phỏng · 40 câu hỏi',
      desc: 'Ester, chất béo, xà phòng và chất giặt rửa: khái niệm, danh pháp, đồng phân, tính chất, điều chế, ứng dụng. Có ghi nhớ, bẫy hay gặp, bài tập kèm đáp án.' } });
  E.define({ id: 'de1', chapter: chap, title: 'Đề 1 · Ester', desc: 'Khái niệm, danh pháp, đồng phân, tính chất, thủy phân và điều chế ester.' });
  E.define({ id: 'de2', chapter: chap, title: 'Đề 2 · Lipid – Chất béo', desc: 'Chất béo, acid béo, phản ứng thủy phân và hydrogen hóa, tính toán khối lượng muối.' });
  E.define({ id: 'de3', chapter: chap, title: 'Đề 3 · Xà phòng và chất giặt rửa', desc: 'Cấu tạo, tính chất giặt rửa, sản xuất xà phòng, nước cứng, thí nghiệm xà phòng hóa.' });
  E.define({ id: 'de4', chapter: chap, title: 'Đề 4 · Tổng hợp chương 1 (số 1)', desc: 'Đề tổng hợp Ester – Lipid – Xà phòng, độ khó trung bình.' });
  E.define({ id: 'de5', chapter: chap, title: 'Đề 5 · Tổng hợp chương 1 (số 2)', desc: 'Đề tổng hợp có câu đọc hiểu thí nghiệm và bài toán vận dụng.' });
  E.define({ id: 'de6', chapter: chap, title: 'Đề 6 · Vận dụng cao', desc: 'Đề nâng cao: đồng phân, hỗn hợp, bảo toàn khối lượng, biện luận công thức.' });
  // Đề trộn: mỗi mã đề bốc ngẫu nhiên 28 câu từ kho câu của Đề 1–6
  E.define({ id: 'de7', chapter: 'Tổng hợp · Đề 1 – 6', title: 'Đề 7 · Trộn tổng hợp', desc: 'Mỗi mã đề là một đề khác: 28 câu bốc ngẫu nhiên từ Đề 1 – 6 (ester, chất béo, xà phòng), câu tính toán vẫn đổi số.', blend: ['de1', 'de2', 'de3', 'de4', 'de5', 'de6'], mix: true });

  var chap2 = 'Chương 2. Carbohydrate';
  E.section({ id: 2, title: 'Phần 2 · Carbohydrate', desc: 'Glucose, fructose, saccharose, maltose, tinh bột, cellulose · Đề 8 – 13.',
    theory: { href: 'carbohydrate.html', chap: 'Chương 2', name: 'Carbohydrate', meta: '4 bài · 3 mô phỏng · 52 câu hỏi',
      desc: 'Glucose, fructose, saccharose, maltose, tinh bột, cellulose: cấu tạo mạch hở và mạch vòng, tính chất, bảng nhận biết, công thức tính nhanh, bài tập kèm lời giải.' } });
  E.define({ id: 'de8', chapter: chap2, title: 'Đề 8 · Glucose và Fructose', desc: 'Khái niệm, phân loại carbohydrate; cấu tạo, tính chất của glucose và fructose; tráng bạc, lên men.' });
  E.define({ id: 'de9', chapter: chap2, title: 'Đề 9 · Saccharose và Maltose', desc: 'Cấu tạo disaccharide, –OH hemiacetal, phản ứng với Cu(OH)2, thủy phân và hiệu suất thủy phân.' });
  E.define({ id: 'de10', chapter: chap2, title: 'Đề 10 · Tinh bột và Cellulose', desc: 'Amylose, amylopectin, cellulose; phản ứng màu iodine, thủy phân, cellulose trinitrate, lên men rượu.' });
  E.define({ id: 'de11', chapter: chap2, title: 'Đề 11 · Ôn tập chương 2 (số 1)', desc: 'Đề tổng hợp Carbohydrate: nhận biết, đếm phát biểu đúng, dạng mạch vòng của glucose, bài toán tráng bạc.' });
  E.define({ id: 'de12', chapter: chap2, title: 'Đề 12 · Ôn tập chương 2 (số 2)', desc: 'Đề tổng hợp Carbohydrate: cấu tạo fructose, saccharose, tinh bột – cellulose, bài toán lên men.' });
  // Đề trộn chương 2: mỗi mã đề bốc ngẫu nhiên 28 câu từ kho câu của Đề 8–12
  E.define({ id: 'de13', chapter: 'Tổng hợp · Đề 8 – 12', title: 'Đề 13 · Trộn chương 2', desc: 'Mỗi mã đề là một đề khác: 28 câu bốc ngẫu nhiên từ Đề 8 – 12 (glucose, fructose, saccharose, maltose, tinh bột, cellulose).', blend: ['de8', 'de9', 'de10', 'de11', 'de12'], mix: true });
})(window);
