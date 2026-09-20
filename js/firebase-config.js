/* Cấu hình Firebase (xem SETUP.md). Để null thì web ẩn phần đăng nhập và bảng xếp hạng.
   Các giá trị này KHÔNG phải bí mật, an toàn khi để công khai; bảo mật do firestore.rules đảm nhiệm.

   Dán vào đây đoạn firebaseConfig lấy từ Firebase Console, ví dụ:
   window.CHEM_FIREBASE = {
     apiKey: "AIza...",
     authDomain: "ten-project.firebaseapp.com",
     projectId: "ten-project",
     appId: "1:1234567890:web:abcdef"
   };
*/
window.CHEM_FIREBASE = null;
