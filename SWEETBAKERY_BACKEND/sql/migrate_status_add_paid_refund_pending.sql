-- Cập nhật enum trạng thái đơn hàng: thêm PAID và REFUND_PENDING
-- Sao lưu bảng orders trước khi chạy

ALTER TABLE orders
  MODIFY COLUMN trang_thai ENUM('PENDING','PAID','CONFIRMED','COMPLETED','REFUND_PENDING','CANCELLED') NOT NULL DEFAULT 'PENDING';

-- (Tuỳ chọn) chuẩn hoá dữ liệu cũ
-- UPDATE orders SET trang_thai = 'PAID' WHERE trang_thai = 'CONFIRMED' AND payment_method = 'VNPAY';
-- UPDATE orders SET trang_thai = 'REFUND_PENDING' WHERE trang_thai = 'CANCELLED' AND payment_method = 'VNPAY';

-- Kiểm tra
-- SELECT trang_thai, COUNT(*) FROM orders GROUP BY trang_thai;

