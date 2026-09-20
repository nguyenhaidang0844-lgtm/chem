# Bật đăng nhập Google và bảng xếp hạng (Firebase, miễn phí)

Web chạy trên GitHub Pages nên không có máy chủ riêng. Tài khoản và điểm được lưu bằng Firebase của Google.
Trước khi làm các bước dưới đây, web tự ẩn nút đăng nhập và bảng xếp hạng.

## 1. Tạo project
1. Vào <https://console.firebase.google.com> → **Add project** (đặt tên tùy ý, tắt Google Analytics cũng được).

## 2. Bật đăng nhập Google
1. **Build → Authentication → Get started → Sign-in method → Google → Enable**, chọn email hỗ trợ, **Save**.
2. **Authentication → Settings → Authorized domains → Add domain**, thêm: `nguyenhaidang0844-lgtm.github.io`
   (`localhost` đã có sẵn để thử trên máy).

## 3. Tạo cơ sở dữ liệu
1. **Build → Firestore Database → Create database → Production mode**, chọn vị trí `asia-southeast1` (Singapore) hoặc gần nhất.
2. Tab **Rules**: xóa nội dung cũ, dán toàn bộ file [`firestore.rules`](firestore.rules) → **Publish**.

## 4. Lấy cấu hình và dán vào web
1. **Project settings (biểu tượng bánh răng) → Your apps → biểu tượng Web `</>`** → đặt tên → **Register app**.
2. Copy đoạn `firebaseConfig` và dán vào [`js/firebase-config.js`](js/firebase-config.js):

```js
window.CHEM_FIREBASE = {
  apiKey: "AIza...",
  authDomain: "ten-project.firebaseapp.com",
  projectId: "ten-project",
  appId: "1:1234567890:web:abcdef"
};
```
3. Commit và push. Sau khoảng 1 phút web hiện nút **Đăng nhập** và mục **Bảng xếp hạng**.

Các giá trị này không phải bí mật. Việc ai được đọc hoặc ghi dữ liệu do `firestore.rules` kiểm soát.

## Cách hoạt động
- Đăng nhập Google, lần đầu chọn **biệt danh** (2 – 20 ký tự). Chỉ biệt danh và điểm hiện công khai, không lộ tên thật hay email.
- Chỉ tính chế độ **Thi thử**. Mỗi người mỗi đề giữ **điểm cao nhất**; bằng điểm thì ai làm nhanh hơn xếp trên.
- Bài làm dưới 1 phút không được tính.
- Tab **Tổng**: cộng điểm cao nhất của các đề đã làm. Mỗi bảng hiện top 20.

## Giới hạn cần biết
- Điểm được chấm ngay trên trình duyệt (web tĩnh, đáp án nằm trong mã nguồn) nên **không chống gian lận tuyệt đối**. Rules chỉ chặn điểm ngoài khoảng 0 – 10, thời gian phi lý và việc ghi đè điểm người khác.
- Gói miễn phí Firebase (Spark) đủ cho lớp học: mỗi lần xem bảng xếp hạng tốn tối đa 200 – 600 lượt đọc, bảng được lưu tạm 60 giây; hạn mức là 50.000 lượt đọc/ngày.
- Muốn xóa hoặc sửa điểm của ai đó: vào Firebase Console → Firestore → collection `scores`.
