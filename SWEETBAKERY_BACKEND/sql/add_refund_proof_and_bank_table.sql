-- Thêm bảng bank_accounts và cột chứng từ hoàn tiền cho orders
-- Sao lưu dữ liệu trước khi chạy

CREATE TABLE IF NOT EXISTS bank_accounts (
  id VARCHAR(255) PRIMARY KEY,
  bank_name VARCHAR(120) NOT NULL,
  account_holder_name VARCHAR(150) NOT NULL,
  account_number VARCHAR(64) NOT NULL,
  is_default BIT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_id VARCHAR(255),
  CONSTRAINT fk_bank_user FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE orders
  ADD COLUMN refund_proof_image_url VARCHAR(512) NULL;

-- Gợi ý: có thể đặt is_default=1 cho một tài khoản đầu tiên của mỗi user
-- UPDATE bank_accounts b
-- JOIN (
--   SELECT MIN(id) AS id FROM bank_accounts GROUP BY user_id
-- ) t ON b.id = t.id
-- SET b.is_default = 1;

