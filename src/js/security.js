/**
 * ==========================================================================
 * SECURITY & ANTI-COPY PROTECTION MODULE
 * ป้องกันการคัดลอกซอร์สโค้ด การคลิกขวา และการเปิด Developer Tools
 * ==========================================================================
 */
(function() {
  'use strict';

  // Last warning toast timestamp to debounce toasts
  let lastToastTime = 0;
  function notifySecurityWarning(msg = 'ไม่อนุญาตให้คัดลอกหรือเปิดดูซอร์สโค้ดของระบบ') {
    const now = Date.now();
    if (now - lastToastTime > 2500) {
      lastToastTime = now;
      if (typeof window.showToast === 'function') {
        window.showToast(`🛡️ ${msg}`, 'warning');
      }
    }
  }

  // 1. ป้องกันการคลิกขวา (Disable Right Click / Context Menu)
  document.addEventListener('contextmenu', function(e) {
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    // อนุญาตให้คลิกขวาเฉพาะในช่องกรอกข้อมูล เพื่อให้ผู้ใช้สามารถ Paste / จัดการข้อความได้
    if (tag === 'input' || tag === 'textarea') {
      return;
    }
    e.preventDefault();
    notifySecurityWarning('ระบบสงวนสิทธิ์ ปิดการใช้งานคลิกขวา');
    return false;
  }, false);

  // 2. ป้องกันคีย์ลัดสำหรับ Developer Tools, View Source และ Save Page
  document.addEventListener('keydown', function(e) {
    const key = e.key || '';
    const keyCode = e.keyCode || 0;
    const isCtrl = e.ctrlKey || e.metaKey;
    const isShift = e.shiftKey;

    // F12 -> DevTools
    if (key === 'F12' || keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      notifySecurityWarning('ปิดการใช้งานปุ่ม F12 เพื่อความปลอดภัย');
      return false;
    }

    // Ctrl + Shift + I -> DevTools
    // Ctrl + Shift + J -> Console
    // Ctrl + Shift + C -> Inspect Element
    if (isCtrl && isShift && (key.toLowerCase() === 'i' || key.toLowerCase() === 'j' || key.toLowerCase() === 'c' || keyCode === 73 || keyCode === 74 || keyCode === 67)) {
      e.preventDefault();
      e.stopPropagation();
      notifySecurityWarning('ปิดการใช้งาน Developer Tools');
      return false;
    }

    // Ctrl + U -> View Source
    if (isCtrl && !isShift && (key.toLowerCase() === 'u' || keyCode === 85)) {
      e.preventDefault();
      e.stopPropagation();
      notifySecurityWarning('ปิดการใช้งานดูรหัสต้นฉบับ (View Source)');
      return false;
    }

    // Ctrl + S -> Save Page
    if (isCtrl && !isShift && (key.toLowerCase() === 's' || keyCode === 83)) {
      e.preventDefault();
      e.stopPropagation();
      notifySecurityWarning('ปิดการบันทึกหน้าเว็บ');
      return false;
    }

    // Ctrl + C / Ctrl + X -> ถ้าไม่ได้อยู่ในกล่องกรอกข้อความ ห้าม copy
    if (isCtrl && !isShift && (key.toLowerCase() === 'c' || key.toLowerCase() === 'x' || keyCode === 67 || keyCode === 88)) {
      const activeEl = document.activeElement;
      const tag = activeEl ? activeEl.tagName.toLowerCase() : '';
      const isInput = tag === 'input' || tag === 'textarea' || (activeEl && activeEl.isContentEditable);
      if (!isInput) {
        e.preventDefault();
        notifySecurityWarning('ไม่อนุญาตให้คัดลอกข้อความในหน้านี้');
        return false;
      }
    }
  }, false);

  // 3. ป้องกัน Copy Event บนเนื้อหาทั่วไป
  document.addEventListener('copy', function(e) {
    const activeEl = document.activeElement;
    const tag = activeEl ? activeEl.tagName.toLowerCase() : '';
    const isInput = tag === 'input' || tag === 'textarea' || (activeEl && activeEl.isContentEditable);
    if (!isInput) {
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.clearData();
      }
      notifySecurityWarning('ไม่อนุญาตให้คัดลอกข้อมูลในระบบ');
      return false;
    }
  }, false);

  // 4. ป้องกันการ Drag ลากคลุมเนื้อหาหรือรูปภาพ
  document.addEventListener('dragstart', function(e) {
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : '';
    if (tag !== 'input' && tag !== 'textarea') {
      e.preventDefault();
      return false;
    }
  }, false);

  // 5. แสดงข้อความเตือนใน Console หากมีการเปิดขึ้นมา
  try {
    const styleTitle = 'font-size: 22px; font-weight: bold; color: #dc2626; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);';
    const styleBody = 'font-size: 13px; color: #1e293b; line-height: 1.6;';
    console.log('%c⛔ คำเตือนความปลอดภัย (Security Notice)', styleTitle);
    console.log('%cระบบนี้สงวนลิขสิทธิ์และอยู่ภายใต้มาตรการรักษาความปลอดภัย\nห้ามคัดลอก ดัดแปลง หรือนำซอร์สโค้ดไปใช้โดยไม่ได้รับอนุญาต', styleBody);
  } catch (err) {}

})();
