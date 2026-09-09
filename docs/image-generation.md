# Hình minh họa trong KHBD

Mở bài dạy → tab **Hình minh họa** → **Gợi ý hình cho bài này** → chỉnh mô tả nếu cần → **Duyệt tạo ảnh** → xem ảnh → **Chèn vào hoạt động**. Nút **Tạo lại ảnh** gọi API thêm một lần; ảnh mới cần được chèn lại sau khi xem. Word nhúng ảnh đã chèn, không chỉ đường dẫn.

App dùng Gemini API Key đang nhập, gọi `gemini-2.5-flash-image:generateContent` với `responseModalities: ['TEXT', 'IMAGE']`. Chỉ nhận phần `inlineData` PNG/JPEG không phải thought; kết quả chỉ có chữ được báo lỗi. Không tự thử lại yêu cầu tính phí. Dự án Google AI của khóa cần quyền, hạn mức và thanh toán phù hợp. Không bảo đảm miễn phí.

Ảnh lưu trong IndexedDB `khbd-images-v1`; metadata liên kết hoạt động lưu cùng bài ở localStorage hiện có. Tải lại trang giữ ảnh trên cùng trình duyệt và cùng tên miền. Xóa dữ liệu trang, đổi trình duyệt hoặc đổi tên miền không chuyển ảnh theo. Xuất Word để giữ bản có ảnh. Chưa bổ sung ảnh vào PowerPoint.

Nếu ảnh đã tạo nhưng lưu thất bại, panel giữ ảnh trong phiên hiện tại để tải xuống hoặc thử lưu lại mà không gọi AI thêm lần nữa. Không đóng trang trước khi tải/lưu ảnh.

Tài liệu API: https://ai.google.dev/gemini-api/docs/image-generation

## Xác minh

`npm test` kiểm tra phản hồi có ảnh/không ảnh, quota, vị trí gợi ý, luồng duyệt/chèn/mở lại bài và dữ liệu nhúng trong ZIP DOCX. Dịch vụ mạng được giả lập trong kiểm thử; chưa thay thế cho kiểm tra thực tế với khóa có quyền tạo ảnh.

`npm run build` kiểm tra TypeScript và bản production Vite.
