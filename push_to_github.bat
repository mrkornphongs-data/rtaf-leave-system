@echo off
chcp 65001 >nul
title อัปโหลดขึ้น GitHub - ระบบบริหารจัดการวันลา (RTAF Leave System)
cls
echo =======================================================================
echo          ระบบบริหารจัดการวันลา - อัปโหลดโค้ดขึ้น GitHub
echo =======================================================================
echo.
echo กำลังเตรียมการอัปโหลดโค้ดไปยัง:
echo Repository: https://github.com/mrkornphongs-data/rtaf-leave-system.git
echo สาขา: main
echo.
echo [หมายเหตุ] 
echo หากยังไม่ได้ Sign-in บนเครื่องนี้ จะมีหน้าต่างเบราว์เซอร์เด้งขึ้นมา
echo ให้กด "Sign in with your browser" หรือป้อน Token เพื่อยืนยันสิทธิ์
echo.
echo -----------------------------------------------------------------------

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo -----------------------------------------------------------------------
    echo  [สำเร็จ] อัปโหลดโปรเจกต์ขึ้น GitHub เรียบร้อยแล้ว 100%!
    echo  ตรวจสอบได้ที่: https://github.com/mrkornphongs-data/rtaf-leave-system
    echo -----------------------------------------------------------------------
) else (
    echo.
    echo -----------------------------------------------------------------------
    echo  [คำแนะนำเพิ่มเติมหาก Push ไม่ผ่าน]
    echo  หากระบบต้องการ Personal Access Token (PAT):
    echo  1. ไปที่ https://github.com/settings/tokens
    echo  2. สร้าง Token (ติ๊กสิทธิ์ repo)
    echo  3. สามารถป้อน Token แทน Password ได้ทันที
    echo -----------------------------------------------------------------------
)

echo.
pause
