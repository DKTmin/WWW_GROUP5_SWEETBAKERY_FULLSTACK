-- Thêm cột thông tin ngân hàng cho đơn hàng (phục vụ hoàn tiền VNPay thủ công)
-- Sao lưu bảng orders trước khi chạy

ALTER TABLE orders
  ADD COLUMN bank_account_name VARCHAR(150) NULL,
  ADD COLUMN bank_account_number VARCHAR(64) NULL;

-- Kiểm tra
-- SELECT bank_account_name, bank_account_number FROM orders WHERE payment_method = 'VNPAY' LIMIT 10;

