-- Thêm cột ly_do_huy vào bảng orders
-- Backup your orders table before running this command.

ALTER TABLE orders
  ADD COLUMN ly_do_huy VARCHAR(500) NULL COMMENT 'Lý do hủy đơn hàng';

-- Verify:
-- SELECT id, trang_thai, ly_do_huy FROM orders WHERE trang_thai = 'CANCELLED';

