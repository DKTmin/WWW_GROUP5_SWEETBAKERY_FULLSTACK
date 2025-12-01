-- Backup your orders table before running these commands.
-- Step 1: convert enum column to VARCHAR to allow safe updates
ALTER TABLE orders
  MODIFY COLUMN trang_thai VARCHAR(50) NOT NULL DEFAULT 'PENDING';

-- Step 2: update legacy values to the new enum names
UPDATE orders SET trang_thai = 'COMPLETED' WHERE trang_thai = 'HOAN_THANH';
UPDATE orders SET trang_thai = 'CANCELLED' WHERE trang_thai = 'DA_HUY';

-- Step 3: (optional) convert the column back to ENUM with the four allowed values
ALTER TABLE orders
  MODIFY COLUMN trang_thai ENUM('PENDING','CONFIRMED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING';

-- Verify:
SELECT trang_thai, COUNT(*) FROM orders GROUP BY trang_thai;