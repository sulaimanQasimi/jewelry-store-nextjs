-- Allow NULL for productMasterId so purchase items can be added without linking to a product master (e.g. manual wizard entries).
-- Run this once: mysql -u user -p jewelry_store < db/migrations/allow_null_product_master_id.sql

ALTER TABLE purchase_items
  MODIFY COLUMN productMasterId INT NULL;

-- Re-add foreign key (MySQL may drop it on MODIFY; ensure it exists and allows NULL)
-- If the FK was dropped, add it back:
-- ALTER TABLE purchase_items
--   ADD CONSTRAINT purchase_items_ibfk_2 FOREIGN KEY (productMasterId) REFERENCES product_masters(id) ON DELETE CASCADE;
