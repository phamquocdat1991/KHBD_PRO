# KHBD AI PRO 2.0.3 — QA và sửa sư phạm

## Phạm vi và nền bản sửa

- Nền GitHub main: bdc5043dc6fa4be38a797939f32a58dda37e933f (2.0.2).
- Người dùng đã cho phép thay production 2.1.0 bằng bản sửa từ 2.0.2.
- Bài mới chỉ dùng Kết nối tri thức với cuộc sống; bỏ các nút chọn bộ sách khác. Bài cũ giữ dữ liệu nguồn đã lưu, không gán lại nhãn SGK cho nội dung cũ.
- Không thêm dịch vụ đăng nhập, đồng bộ dữ liệu hoặc tính năng ngoài yêu cầu.

## Thay đổi

- Tô đỏ toàn bộ mục tiêu năng lực số/AI và mã tham chiếu hợp lệ trong hoạt động; giữ màu trong A4, in/PDF và Word.
- Danh mục NLS dùng 24 mã năng lực thành phần của TT 02/2025, ví dụ 1.2. Đây không phải mã chỉ báo có hậu tố CB/TC/NC; không tự tạo hậu tố chưa xác minh.
- Danh mục giáo dục AI dùng mã lớp.chủ đề.số thứ tự trong phụ lục QĐ 2422/QĐ-BGDĐT. Chỉ gửi danh mục đúng lớp cho Gemini; kiểm tra mã tồn tại và xuất hiện trong nhiệm vụ/sản phẩm của bài.
- Yêu cầu bài chi tiết: câu hỏi nguyên văn, dữ kiện, đáp án, lời chốt kiến thức, hỗ trợ/phân hóa, sản phẩm và đánh giá ở đủ bốn bước GV/HS.
- Chặn hoạt động quá sơ lược bằng ngưỡng tối thiểu 120 từ/hoạt động và 30 ký tự/ô GV-HS. Đây là kiểm tra độ sơ lược, không phải chứng nhận chất lượng sư phạm.
- Bỏ tự co giãn phút sau khi AI trả bài vì làm lệch lời hướng dẫn. Kiểm tra số nguyên và tổng phút đúng số tiết.
- Một lượt bổ sung tối đa nếu bài thiếu cấu trúc/chi tiết hoặc sai mã/phút; giữ nguyên nguồn trong yêu cầu bổ sung. Không tự thử lại lỗi API, từ chối nguồn, nội dung bị chặn hoặc JSON hỏng.
- Không đưa API key vào dữ liệu bài, commit hoặc cấu hình triển khai.

## Nguồn danh mục

- Cổng Chính phủ xác nhận TT 02/2025/TT-BGDĐT, ngày 24/01/2025: https://vanban.chinhphu.vn/?docid=212648&pageid=27160
- Nội dung văn bản TT 02/2025 được đối chiếu từ bản đăng lại: https://thuvienphapluat.vn/van-ban/Giao-duc/Thong-tu-02-2025-TT-BGDDT-quy-dinh-Khung-nang-luc-so-cho-nguoi-hoc-625668.aspx
- Bộ GDĐT có trang công bố QĐ 2422/QĐ-BGDĐT ngày 18/08/2026 (kết quả tìm kiếm xác nhận; trang gốc chưa mở được trong môi trường kiểm thử): https://moet.gov.vn/van-ban/van-ban-chi-dao-dieu-hanh/quyet-dinh-ban-hanh-khung-noi-dung-giao-duc-tri-tue-nhan-tao-cho-hoc-sinh-pho-thong.html
- Mã và nội dung yêu cầu cần đạt AI được trích từ phần văn bản quyết định/phụ lục đăng lại tại: https://luatvietnam.vn/giao-duc/quyet-dinh-2422-qd-bgddt-2026-ban-hanh-khung-noi-dung-giao-duc-tri-tue-nhan-tao-cho-hoc-sinh-pho-thong-444452-d1.html
- Danh mục AI có 282 mục không trùng mã từ bảng văn bản, gồm cốt lõi và mở rộng. Không tuyên bố xác minh từng mục từ PDF có chữ ký; nên đối chiếu lại khi có bản gốc hoặc văn bản thay thế.

## Kiểm thử

- Nền 46/46 đạt. Bảy kiểm thử hồi quy mới thất bại trước sửa, đúng lỗi mục tiêu.
- Sau sửa: 55/55 đạt; TypeScript và Vite build thành công.
- Kiểm tra gói DOCX thật: màu FF0000, nội dung, số cột và phụ lục; PPTX thật có nội dung slide.
- Build có cảnh báo chunk >500 kB, không chặn build; không thay đổi kiến trúc chỉ để loại cảnh báo.
- BYOK thật trên production cũ: đăng nhập thành công; lượt gọi Gemini 3.8 trả HTTP 503. Chưa coi đó là kiểm thử nội dung bản sửa.
- Kiểm thử Preview và production sẽ được ghi sau khi có kết quả.

## Giới hạn giữ nguyên

- Google/email chưa có backend; BYOK là luồng sử dụng được. Dữ liệu thư viện/hồ sơ lưu ở trình duyệt.
- Mã đúng danh mục không tự chứng minh AI diễn giải hoặc tích hợp đúng sư phạm; cần rà bài sinh thực tế.
- Bài cũ thiếu mã không được tự gán mã bằng suy đoán; có thể biên tập hoặc tạo lại.
