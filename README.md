# Ôn thi Hóa học 12

Website ôn tập Hóa học 12 theo cấu trúc đề THPT (18 trắc nghiệm · 4 đúng/sai · 6 trả lời ngắn = 28 câu, 10 điểm, 40 phút).
Các câu tính toán tự **đổi số** mỗi lần làm; nhập lại **mã đề** để làm đúng bộ số cũ.

- **Đề 7 (trộn):** mỗi mã đề bốc ngẫu nhiên 18 + 4 + 6 câu từ kho câu của Đề 1 – 6, không trùng dạng câu. Thêm đề mới vào kho bằng cách khai báo thêm id trong `blend` ở `js/exams/meta.js`.
- 2 chế độ: **Thi thử** (đồng hồ 40 phút, chấm khi nộp) và **Luyện tập** (xem đáp án ngay).
- Lời giải chi tiết sau khi nộp bài; lịch sử điểm lưu trong trình duyệt (localStorage).
- Không cần build: chỉ là HTML/CSS/JS thuần, chạy được trên GitHub Pages.

## Chạy trên GitHub Pages
1. Tạo repo mới trên GitHub, đẩy toàn bộ nội dung thư mục này lên nhánh `main`.
2. Vào **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)`** → Save.
3. Sau ~1 phút web có tại `https://<tên-tài-khoản>.github.io/<tên-repo>/`.

Chạy thử trên máy: mở `index.html` bằng trình duyệt (hoặc `npx serve`).

## Cấu trúc
```
index.html            trang chính
css/style.css         giao diện (có chế độ tối tự động)
js/engine.js          seed, chấm điểm THPT, dựng đề
js/calc1.js, calc2.js bộ sinh câu tính toán (ester, chất béo, xà phòng)
js/render.js, app.js  hiển thị và điều khiển
js/exams/meta.js      danh sách đề
js/exams/deN.js       nội dung từng đề
```

## Thêm đề / chương mới
1. Thêm `E.define({ id: 'de7', chapter: '...', title: '...', desc: '...' })` vào `js/exams/meta.js`.
2. Copy một file `js/exams/deN.js`, đổi id, viết câu hỏi (`mc`, `tf`, `sh`, hoặc câu tính toán `K.xxx()`).
3. Thêm `<script src="js/exams/de7.js"></script>` vào `index.html`.

Ký hiệu công thức: `C4H8O2` tự thành chỉ số dưới; dùng `C_{n}H_{2n}O_{2}` cho chỉ số chữ và `Ca^{2+}` cho chỉ số trên.
