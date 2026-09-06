# KHBD AI PRO 2.0.2 — Kiểm thử và bản sửa

## Phạm vi

- Repository: `phamquocdat1991/KHBD_PRO`, nền bản sửa `5afcf60`.
- Dự án Vercel hiện có: `khbd-ai-one`.
- Production: https://khbd-ai-one.vercel.app/
- Giữ chức năng, dữ liệu bài dạy và cấu trúc triển khai hiện có; không thêm tính năng mới.

## Lỗi đã tái hiện và sửa

| Vấn đề | Nguyên nhân | Bản sửa |
| --- | --- | --- |
| Ô BYOK vẫn giữ khóa cũ sau đăng xuất | Bản nháp trong LoginModal chỉ khởi tạo một lần, độc lập với khóa trong AuthContext | Xóa bản nháp khi đóng; đồng bộ khóa hiện tại khi mở lại |
| Ô BYOK không phản ánh khóa vừa cập nhật | Cùng nguyên nhân trạng thái cũ | Đồng bộ khi cấu hình khóa thay đổi |
| Khóa chỉ gồm khoảng trắng vẫn tạo hồ sơ khách | `required` của HTML không loại khoảng trắng; hàm đăng nhập chưa kiểm tra sau trim | Kiểm tra khóa sau trim và hiển thị lỗi trong biểu mẫu |
| Tải Word từ thư viện thất bại nhưng không báo lỗi | Promise xuất tệp chưa được await/catch | Hiện lỗi có thể thử lại, giữ bài trong thư viện |
| AI trả bài thiếu cấu trúc; thông báo lỗi quá chung | Yêu cầu chỉ quy định JSON, chưa gửi schema cho API; bộ kiểm tra thiếu xử lý phần tử null | Gửi JSON Schema cho bốn hoạt động và các phần bắt buộc, giữ nhánh báo lỗi nguồn; nêu rõ phần thiếu khi kiểm tra |

## Kiểm thử tự động

- 38 kiểm thử nền đạt trước khi sửa.
- Bảy kiểm thử hồi quy mới thất bại đúng lỗi trước khi sửa; bổ sung một kiểm thử giữ nguyên nhánh từ chối nguồn không đọc được.
- Kết quả: 46/46 kiểm thử đạt trong 6 tệp; TypeScript và Vite build thành công; `git diff --check` đạt.
- Kiểm tra cấu trúc OOXML thật của DOCX và PPTX: bố cục 1/2/3/4 cột, phụ lục, nhãn tiếng Anh, nội dung slide.
- Build còn cảnh báo kích thước bundle lớn; chưa thay đổi kiến trúc tải mã trong bản sửa nhỏ này.

## Kiểm thử trình duyệt với API key thật

- Nhập khóa qua biểu mẫu bảo mật và vào chế độ Giáo viên Khách (BYOK) thành công.
- Gemini 3.8 Flash: một lượt tạo bài trả HTTP 503.
- Gemini 2.5 Flash: một lượt tạo bài trả HTTP 404; ứng dụng hiển thị mô hình không khả dụng.
- Gemini 3.6 Flash: tạo thành công KHBD KHTN lớp 8 từ nội dung nhập; thư viện tăng từ 3 lên 4 bài.
- Bài có bốn hoạt động 5 + 20 + 12 + 8 = 45 phút, bảng GV/HS, mục tiêu, thiết bị, phiếu học tập và sơ đồ tư duy.
- Copilot trả lời đúng ba yếu tố cần giữ nguyên và tổng thời lượng 45 phút theo bài đang mở.
- Sửa mục tiêu rồi tải lại trang: giữ được nội dung sửa và trạng thái BYOK.
- Sao chép: có thông báo thành công và clipboard chứa nội dung bài tương ứng.
- Nhận bốn tệp TXT, DOCX, PDF, PNG thành công; lượt gọi đa phương thức đầu trả HTTP 503; lượt thử lại bị bộ kiểm tra cấu trúc chặn, không lưu bài thiếu. Bản sửa schema cần được kiểm thử tiếp trên Preview với cùng bốn nguồn.

## Giới hạn và chức năng chưa kết nối

- Đăng nhập Google/email và chia sẻ bài bằng liên kết trực tuyến chưa có dịch vụ phía sau trong bản hiện tại; bổ sung cần phê duyệt riêng.
- Thư viện và hồ sơ lưu trên trình duyệt, chưa đồng bộ tài khoản giữa thiết bị.
- Trình duyệt kiểm thử không trả sự kiện tải xuống cho Blob từ FileSaver; việc bấm nút và kiểm tra gói DOCX/PPTX trong bộ kiểm thử là hai bằng chứng riêng. Không coi đó là đã mở thành công tệp tải từ trình duyệt trong Word/PowerPoint.
- Kiểm thử kỹ thuật không xác nhận mọi phát biểu sư phạm do AI sinh ra. Ví dụ so sánh quạt gió và tăng nồng độ trong bài mẫu cần giáo viên rà lại để phân biệt tốc độ cấp oxygen với nồng độ của dòng khí.
- Không ghi API key vào mã nguồn, hồ sơ kiểm thử, commit hoặc Vercel.

## Các tệp thay đổi

- `src/components/auth/LoginModal.tsx`
- `src/context/AuthContext.tsx`
- `src/components/dashboard/LessonLibraryView.tsx`
- `src/components/layout/AppHeader.tsx` (nhãn 2.0.2)
- `src/services/geminiService.ts`, `src/services/lessonResponseSchema.ts`
- `package.json`, `package-lock.json` (phiên bản)
- `tests/auth.test.tsx`, `tests/library-export.test.tsx`, `tests/gemini.test.ts`
- Tài liệu QA này.
