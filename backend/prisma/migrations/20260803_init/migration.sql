-- Initial migration for sport shoes store (MySQL)
CREATE TABLE `User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255),
  `role` VARCHAR(25) NOT NULL DEFAULT 'USER',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`)
);

CREATE TABLE `Brand` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Brand_name_key` (`name`),
  UNIQUE KEY `Brand_slug_key` (`slug`)
);

CREATE TABLE `Category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_name_key` (`name`),
  UNIQUE KEY `Category_slug_key` (`slug`)
);

CREATE TABLE `Product` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10,2) NOT NULL,
  `sku` VARCHAR(255),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `brandId` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Product_slug_key` (`slug`),
  UNIQUE KEY `Product_sku_key` (`sku`),
  CONSTRAINT `Product_brand_fk` FOREIGN KEY (`brandId`) REFERENCES `Brand`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `ProductImage` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `productId` INT NOT NULL,
  `url` VARCHAR(1000) NOT NULL,
  `alt` VARCHAR(255),
  `isMain` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `ProductImage_product_fk` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `ProductCategory` (
  `productId` INT NOT NULL,
  `categoryId` INT NOT NULL,
  PRIMARY KEY (`productId`,`categoryId`),
  CONSTRAINT `ProductCategory_product_fk` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ProductCategory_category_fk` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `Cart` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Cart_user_unique` (`userId`),
  CONSTRAINT `Cart_user_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `CartItem` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cartId` INT NOT NULL,
  `productId` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `unitPrice` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `CartItem_cart_product_unique` (`cartId`,`productId`),
  CONSTRAINT `CartItem_cart_fk` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CartItem_product_fk` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `Order` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `total` DECIMAL(10,2) NOT NULL,
  `status` VARCHAR(25) NOT NULL DEFAULT 'PENDING',
  `paymentMethod` VARCHAR(25),
  `placedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `shippingAddress` TEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `Order_user_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE `OrderItem` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `orderId` INT NOT NULL,
  `productId` INT NOT NULL,
  `quantity` INT NOT NULL,
  `unitPrice` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `OrderItem_order_fk` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `OrderItem_product_fk` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `Review` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `productId` INT NOT NULL,
  `userId` INT NOT NULL,
  `rating` INT NOT NULL,
  `title` VARCHAR(255),
  `content` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Review_product_user_unique` (`productId`,`userId`),
  CONSTRAINT `Review_product_fk` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Review_user_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);
