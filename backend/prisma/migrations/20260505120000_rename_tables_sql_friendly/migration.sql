-- Rename PascalCase tables so plain SQL works without double quotes (@@map in schema).
ALTER TABLE "User" RENAME TO users;
ALTER TABLE "Product" RENAME TO products;
ALTER TABLE "Cart" RENAME TO carts;
ALTER TABLE "CartItem" RENAME TO cart_items;
ALTER TABLE "Order" RENAME TO orders;
ALTER TABLE "OrderItem" RENAME TO order_items;
