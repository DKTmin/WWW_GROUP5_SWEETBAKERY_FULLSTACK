-- Thêm cột bank_name cho bảng orders (lưu tên ngân hàng dùng hoàn tiền VNPay)
-- Sao lưu bảng trước khi chạy

ALTER TABLE orders
  ADD COLUMN bank_name VARCHAR(120) NULL;

-- Kiểm tra
-- SELECT bank_name, bank_account_name, bank_account_number FROM orders WHERE payment_method = 'VNPAY' LIMIT 10;

