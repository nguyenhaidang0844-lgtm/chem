# Ôn tập THPT · Hóa & Sinh 12

Website ôn tập gồm hai môn:
- **Hóa học 12** (`hoa.html`) — đề thi thử theo cấu trúc đề THPT (18 trắc nghiệm · 4 đúng/sai · 6 trả lời ngắn = 28 câu, 10 điểm, 40 phút), câu tính toán tự **đổi số** mỗi lần làm. Chia theo phần, mỗi đợt thêm đề là một phần mới: Phần 1 · Ester – Lipid (Đề 1 – 7), Phần 2 · Carbohydrate (Đề 8 – 13).
  Mỗi phần có trang **lý thuyết** riêng: `ester-lipid.html` (Chương 1, Bài 1 – 3) và `carbohydrate.html` (Chương 2, Bài 4 – 7), gồm ghi nhớ, bẫy hay gặp, bài tập có đáp án ẩn (bấm để xem), câu hỏi tự kiểm tra chấm ngay, công thức bỏ túi, các dạng bài có lời giải và 7 mô phỏng tương tác.
- **Sinh học 12** (`sinh.html` → `di-truyen-phan-tu.html`) — lý thuyết kèm mô phỏng tương tác (xưởng lắp DNA, chạc sao chép, bán bảo toàn, cắt nối exon, bảng mã di truyền, dịch mã từng bước) và 3 đề luyện (28 câu, 50 phút). Chương 1: Di truyền phân tử.

- **Từ vựng SAT** (`sat.html`) — toàn bộ bảng SAT Vocabulary (Google Sheets), chia theo sheet và theo buổi, học kiểu Quizlet.

`index.html` ở gốc là trang chọn môn học, dẫn vào từng môn ở trên.

## Môn Hóa học 12
- **Lý thuyết:** trang chủ môn Hóa có mục "Lý thuyết" (lấy từ khai báo `theory` trong `E.section` ở `js/exams/meta.js`), mỗi phần đề có link "Ôn lý thuyết". Mô phỏng chương 1: đếm đồng phân, máy ghép ester, lắp chất béo, xà phòng làm sạch vết dầu (kèm nước cứng). Mô phỏng chương 2: mạch hở ⇄ mạch vòng, bàn thí nghiệm nhận biết, máy tính bài toán (tinh bột → ethanol, lên men, tráng bạc, cellulose trinitrate).
- **Đề 7 / Đề 13 (trộn):** mỗi mã đề bốc ngẫu nhiên 18 + 4 + 6 câu từ kho câu của Đề 1 – 6 (chương 1) / Đề 8 – 12 (chương 2), không trùng dạng câu. Thêm đề mới vào kho bằng cách khai báo thêm id trong `blend` ở `js/exams/meta.js`.
- **Đăng nhập Google và bảng xếp hạng** (theo từng đề và tab Tổng): cần bật Firebase một lần, xem [SETUP.md](SETUP.md). Chưa bật thì web tự ẩn phần này.
- 2 chế độ: **Thi thử** (đồng hồ 40 phút, chấm khi nộp) và **Luyện tập** (xem đáp án ngay).
- Lời giải chi tiết sau khi nộp bài; lịch sử điểm lưu trong trình duyệt (localStorage).

## Môn Sinh học 12
- Một file HTML độc lập (`di-truyen-phan-tu.html`), không phụ thuộc `js/engine.js` của môn Hóa, nhưng cùng định dạng làm đề với Hóa (đáp án dạng nút, palette câu, băng kết quả).
- Tab "Kiến thức + mô phỏng" và tab "Luyện đề" (3 đề, đổi thứ tự đáp án mỗi lần vào).
- 2 chế độ như Hóa: **Thi thử** (đồng hồ 50 phút, chấm khi nộp) và **Luyện tập** (không giới hạn giờ; mỗi câu có nút "Kiểm tra đáp án" riêng, trắc nghiệm thì chấm ngay khi chọn).
- Muốn thêm chương mới: tạo file HTML tương tự, thêm 1 thẻ `.card` trỏ tới file đó trong `sinh.html`.

## Từ vựng SAT
- 8 bộ thẻ theo đúng các sheet: SAT Vocab v3.0 (794 thẻ, 40 buổi), SAT Vocab v2.1 (723, 36 buổi), Prefixes/Suffixes/Roots (33), Archaic words (53), SAT Math Vocab (140, theo chủ đề); và "Kho mở rộng" từ các sheet ẩn: SAT Vocab (Cũ) (757), SAT Vocab-old (721), Merge (2090, theo mức ưu tiên). Tổng 5.311 thẻ, 2.846 từ khác nhau. Sheet `Diff` không đưa vào vì trùng đúng danh sách từ của `Merge`.
- 4 cách học mỗi buổi/bộ: **Thẻ ghi nhớ** (lật, phát âm, Đã biết/Chưa biết, vuốt trên điện thoại), **Học** (trắc nghiệm rồi gõ từ, sai thì hỏi lại), **Kiểm tra** (trắc nghiệm, đúng/sai, tự luận, chấm điểm, in đề/lưu PDF), **Ghép thẻ** (tính giờ, lưu kỷ lục); kèm danh sách đầy đủ (nghĩa, phiên âm, ví dụ, mẹo nhớ, CEFR) và tìm kiếm toàn bộ.
- **Chuỗi ngày học**, mục tiêu thẻ/ngày, **số từ đã biết**, **Ôn từ cũ** (lặp lại ngắt quãng 1 → 3 → 7 → 14 → 30 → 60 ngày; tạo bài kiểm tra/bộ thẻ từ: đến hạn, hay sai, đã biết, tất cả từ đã học, gắn sao). Tiến độ lưu trong localStorage (`satvocab.progress.v1`), có nút sao lưu/khôi phục ra file JSON.
- Cập nhật dữ liệu khi sheet thay đổi: tải sheet dạng .xlsx (Tệp → Tải xuống → Microsoft Excel) rồi chạy `node tools/build-vocab.js duong-dan/file.xlsx` — tạo lại `js/vocab/*.js`. Cùng một từ ở các bộ khác nhau dùng chung tiến độ.

Không cần build: chỉ là HTML/CSS/JS thuần, chạy được trên GitHub Pages.

## Chạy trên GitHub Pages
1. Tạo repo mới trên GitHub, đẩy toàn bộ nội dung thư mục này lên nhánh `main`.
2. Vào **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)`** → Save.
3. Sau ~1 phút web có tại `https://<tên-tài-khoản>.github.io/<tên-repo>/`.

Chạy thử trên máy: mở `index.html` bằng trình duyệt (hoặc `npx serve`).

## Cấu trúc
```
index.html                trang chọn môn học (Hóa / Sinh)
hoa.html                   trang chính môn Hóa học 12
ester-lipid.html           Hóa 12 · lý thuyết Chương 1: Ester – Lipid, xà phòng và chất giặt rửa
carbohydrate.html          Hóa 12 · lý thuyết Chương 2: Carbohydrate
sinh.html                  trang chọn chương môn Sinh học 12
sat.html                   Từ vựng SAT (thẻ ghi nhớ, học, kiểm tra, ghép thẻ, ôn từ cũ)
css/vocab.css              giao diện trang Từ vựng SAT
js/vocab-app.js            điều khiển trang Từ vựng SAT (tiến độ, chuỗi ngày, các chế độ học)
js/vocab/index.js, *.js    dữ liệu từ vựng (tạo tự động, đừng sửa tay)
tools/build-vocab.js       tạo js/vocab/*.js từ file .xlsx của Google Sheets
di-truyen-phan-tu.html     Sinh 12 · Chương 1: Di truyền phân tử (lý thuyết + mô phỏng + đề)
css/style.css              giao diện dùng chung
css/ly-thuyet.css          giao diện trang lý thuyết Hóa (mục lục, khung ghi nhớ, mô phỏng, câu hỏi)
js/ly-thuyet.js            trang lý thuyết: tự viết chỉ số công thức, mục lục, ô đáp án ẩn, câu tự kiểm tra
js/sim-ester.js            mô phỏng chương 1
js/sim-carb.js             mô phỏng chương 2
js/engine.js               seed, chấm điểm THPT, dựng đề (môn Hóa)
js/calc1.js, calc2.js      bộ sinh câu tính toán (ester, chất béo, xà phòng)
js/render.js, app.js       hiển thị và điều khiển (môn Hóa)
js/backend.js              đăng nhập Google + bảng xếp hạng (Firebase, môn Hóa)
js/firebase-config.js      cấu hình Firebase (dán vào theo SETUP.md)
firestore.rules            luật bảo mật Firestore
js/exams/meta.js           danh sách đề (môn Hóa)
js/exams/deN.js            nội dung từng đề (môn Hóa)
```

## Thêm đề / chương mới (Hóa)
1. Mỗi đợt thêm đề là một phần mới: thêm `E.section({ id: 3, title: 'Phần 3 · ...', desc: '...' })` trong `js/exams/meta.js`, các `define()` viết sau dòng này sẽ thuộc phần đó.
2. Thêm `E.define({ id: 'de7', chapter: '...', title: '...', desc: '...' })` vào `js/exams/meta.js`.
3. Copy một file `js/exams/deN.js`, đổi id, viết câu hỏi (`mc`, `tf`, `sh`, hoặc câu tính toán `K.xxx()`).
4. Thêm `<script src="js/exams/de7.js"></script>` vào `hoa.html`.

Câu có hình: thêm `img: { src: 'img/ten.png', alt: '...' }` vào câu hỏi (hàm `tf(text, items, img)` trong `de8.js` – `de12.js`). Vị trí nguyên tử carbon viết `C#1` để chữ số không bị thành chỉ số dưới.

Ký hiệu công thức: `C4H8O2` tự thành chỉ số dưới; dùng `C_{n}H_{2n}O_{2}` cho chỉ số chữ và `Ca^{2+}` cho chỉ số trên.

## Thêm chương lý thuyết mới (Hóa)
1. Copy `carbohydrate.html` thành file mới, giữ khung `<main class="lt">`, thay nội dung từng `<section class="lesson">`. Mục lục tự dựng từ các thẻ `h2` (trong `.lesson-head`), `h3`, `h4`.
2. Viết công thức như phần đề (tự thành chỉ số); mũi tên có điều kiện viết `→{t°}`, `⇌{H2SO4 đặc, t°}`; `C#1` là nguyên tử carbon số 1.
3. Khung có sẵn: `.box`, `.key` (ghi nhớ), `.trap` (bẫy), `.tip`, `.ext` (mở rộng), `.eq` (phương trình), `.tbl` (bảng), ô ẩn đáp án `class="hid"` + nút `data-reveal="id-bảng"`, lời giải `<details class="ans">`.
4. Câu tự kiểm tra: `<div class="qz" data-a="B"><p>đề</p><ol><li>A</li>…</ol><div class="why">giải thích</div></div>`; câu đúng/sai: `<div class="tfq"><ul><li data-a="1">phát biểu<span class="why">…</span></li></ul></div>`; gom vào `<div class="qset">` để có bộ đếm điểm.
5. Khai báo `theory: { href, chap, name, desc, meta }` trong `E.section(...)` của phần tương ứng ở `js/exams/meta.js`.
