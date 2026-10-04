# Ôn tập THPT · Hóa & Sinh 12

Website ôn tập gồm hai môn:
- **Hóa học 12** (`hoa.html`) — đề thi thử theo cấu trúc đề THPT (18 trắc nghiệm · 4 đúng/sai · 6 trả lời ngắn = 28 câu, 10 điểm, 40 phút), câu tính toán tự **đổi số** mỗi lần làm. Chia theo phần, mỗi đợt thêm đề là một phần mới: Phần 1 · Ester – Lipid (Đề 1 – 7), Phần 2 · Carbohydrate (Đề 8 – 13).
- **Sinh học 12** (`sinh.html` → `di-truyen-phan-tu.html`) — lý thuyết kèm mô phỏng tương tác (xưởng lắp DNA, chạc sao chép, bán bảo toàn, cắt nối exon, bảng mã di truyền, dịch mã từng bước) và 3 đề luyện (28 câu, 50 phút). Chương 1: Di truyền phân tử.

`index.html` ở gốc là trang chọn môn học, dẫn vào từng môn ở trên.

## Môn Hóa học 12
- **Đề 7 / Đề 13 (trộn):** mỗi mã đề bốc ngẫu nhiên 18 + 4 + 6 câu từ kho câu của Đề 1 – 6 (chương 1) / Đề 8 – 12 (chương 2), không trùng dạng câu. Thêm đề mới vào kho bằng cách khai báo thêm id trong `blend` ở `js/exams/meta.js`.
- **Đăng nhập Google và bảng xếp hạng** (theo từng đề và tab Tổng): cần bật Firebase một lần, xem [SETUP.md](SETUP.md). Chưa bật thì web tự ẩn phần này.
- 2 chế độ: **Thi thử** (đồng hồ 40 phút, chấm khi nộp) và **Luyện tập** (xem đáp án ngay).
- Lời giải chi tiết sau khi nộp bài; lịch sử điểm lưu trong trình duyệt (localStorage).

## Môn Sinh học 12
- Một file HTML độc lập (`di-truyen-phan-tu.html`), không phụ thuộc `js/engine.js` của môn Hóa, nhưng cùng định dạng làm đề với Hóa (đáp án dạng nút, palette câu, băng kết quả).
- Tab "Kiến thức + mô phỏng" và tab "Luyện đề" (3 đề, đổi thứ tự đáp án mỗi lần vào).
- 2 chế độ như Hóa: **Thi thử** (đồng hồ 50 phút, chấm khi nộp) và **Luyện tập** (không giới hạn giờ; mỗi câu có nút "Kiểm tra đáp án" riêng, trắc nghiệm thì chấm ngay khi chọn).
- Muốn thêm chương mới: tạo file HTML tương tự, thêm 1 thẻ `.card` trỏ tới file đó trong `sinh.html`.

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
sinh.html                  trang chọn chương môn Sinh học 12
di-truyen-phan-tu.html     Sinh 12 · Chương 1: Di truyền phân tử (lý thuyết + mô phỏng + đề)
css/style.css              giao diện dùng chung (có chế độ tối tự động)
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
