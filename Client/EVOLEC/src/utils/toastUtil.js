// src/utils/toastUtils.js

/**
 * Hiển thị toast tại góc phải trên
 * @param {React.RefObject} toastRef - React ref trỏ đến <Toast ref={...}>
 * @param {string} title - Tiêu đề thông báo
 * @param {string} content - Nội dung thông báo
 * @param {'success' | 'info' | 'warn' | 'error'} severity - Mức độ thông báo
 * @param {number} time - Thời gian hiển thị (ms)
 */
export function addToast(toastRef, title, content, severity = 'info', time = 3000) {
  if (!toastRef?.current) return;

  toastRef.current.show({
    severity,
    summary: title,
    detail: content,
    life: time,
    closable: true,
  });
}
