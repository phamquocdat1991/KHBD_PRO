@echo off
chcp 65001 >nul
title Day KHBD AI PRO len GitHub
echo ========================================================
echo   Đang đẩy toàn bộ mã nguồn KHBD AI PRO lên GitHub...
echo   Repository: phamquocdat1991/KHBD_PRO
echo ========================================================
echo.
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo [THÀNH CÔNG] Đã đẩy mã nguồn lên GitHub thành công!
) else (
    echo [LƯU Ý] Quá trình đẩy gặp sự cố hoặc cần đăng nhập trình duyệt.
)
echo.
pause