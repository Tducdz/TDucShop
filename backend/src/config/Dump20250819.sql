CREATE DATABASE  IF NOT EXISTS `tducshop` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `tducshop`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: tducshop
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (36,3,19,1);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'iPhone'),(2,'Samsung'),(3,'Xiaomi'),(4,'OPPO'),(5,'Realme'),(6,'Vivo'),(7,'SONY');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `create_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `censor` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,2,1,'Điện thoại xịn lắm!','2025-08-10 14:47:31',1),(2,1,1,'Sản phẩm tốt!','2025-08-13 03:31:30',1),(3,3,1,'Rất hài lòng','2025-08-13 03:55:35',1),(5,8,18,'Sản phẩm tốt, giá cả hợp lý!','2025-08-17 06:44:19',1),(6,8,18,'xin chào','2025-08-17 06:45:45',0),(7,8,67,'xin chào','2025-08-18 09:53:09',1),(8,2,17,'test comment','2025-08-18 19:13:52',1),(10,2,57,'test comment 3','2025-08-18 19:14:23',1),(11,2,57,'test 4','2025-08-18 19:14:54',1),(12,2,57,'testv 5','2025-08-18 19:14:55',1),(13,2,57,'test 6','2025-08-18 19:14:58',1),(14,2,57,'test  7','2025-08-18 19:15:00',1),(15,2,57,'tes 8','2025-08-18 19:15:03',0),(16,2,57,'test 9','2025-08-18 19:15:04',1),(17,2,57,'test 10','2025-08-18 19:15:07',1),(18,2,57,'test 11','2025-08-18 19:15:09',1);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderdetails`
--

DROP TABLE IF EXISTS `orderdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderdetails` (
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `orderdetails_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orderdetails_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderdetails`
--

LOCK TABLES `orderdetails` WRITE;
/*!40000 ALTER TABLE `orderdetails` DISABLE KEYS */;
INSERT INTO `orderdetails` VALUES (1,1,1,29990000.00),(7,5,1,26990000.00),(7,14,1,33990000.00),(8,11,2,23990000.00),(9,34,2,35990000.00),(11,20,1,18990000.00),(12,1,2,29990000.00),(13,2,2,24990000.00),(13,3,2,19990000.00),(14,4,3,22990000.00),(14,20,1,18990000.00),(14,48,2,5990000.00),(15,2,2,24990000.00),(15,13,2,29990000.00),(15,15,2,12990000.00),(15,18,2,17990000.00),(15,20,2,18990000.00),(15,48,2,5990000.00),(16,2,2,24990000.00),(16,13,2,29990000.00),(16,15,2,12990000.00),(16,18,2,17990000.00),(16,20,2,18990000.00),(16,48,2,5990000.00),(17,2,2,24990000.00),(17,13,2,29990000.00),(17,15,2,12990000.00),(17,18,2,17990000.00),(17,20,2,18990000.00),(17,48,2,5990000.00),(18,67,1,11999000.00),(19,17,1,7990000.00),(19,40,1,3990000.00),(19,57,1,12990000.00);
/*!40000 ALTER TABLE `orderdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `total_price` decimal(15,2) DEFAULT NULL,
  `payment_method` enum('COD','Credit Card','Bank Transfer') COLLATE utf8mb4_unicode_ci DEFAULT 'COD',
  `payment_status` enum('pending','paid','failed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `order_status` enum('pending','processing','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `shipping_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,2,'2025-08-10 14:47:31',29990000.00,'COD','pending','pending','TP.HCM'),(7,8,'2025-08-15 17:00:00',60980000.00,'COD','pending','pending','Trung Đức || 0983722485 || Thanh Hóa'),(8,8,'2025-08-15 17:00:00',47980000.00,'COD','pending','pending','Trung Đức || 0983722485 || Thanh Hóa'),(9,8,'2025-08-16 11:13:18',71980000.00,'COD','pending','pending','Trung Đức || 0983722485 || Thanh Hóa'),(11,8,'2025-08-16 11:13:38',18990000.00,'COD','pending','pending','Trung Đức || 0983722485 || Thanh Hóa'),(12,8,'2025-08-16 11:15:02',59980000.00,'COD','pending','pending','Trung Đức || 0983722485 || Thanh Hóa'),(13,8,'2025-08-16 11:15:19',89960000.00,'COD','paid','completed','Trung Đức || 0983722485 || Thanh Hóa'),(14,8,'2025-08-16 11:30:35',99940000.00,'COD','paid','completed','Trung Đức || 0983722485 || Thanh Hóa'),(15,8,'2025-08-16 11:48:55',221880000.00,'COD','paid','pending','Trung Đức || 0983722485 || Thanh Hóa'),(16,8,'2025-08-16 11:49:04',221880000.00,'COD','paid','completed','Trung Đức || 0983722485 || Thanh Hóa'),(17,8,'2025-08-16 11:49:30',221880000.00,'COD','paid','processing','Trung Đức || 0983722485 || Thanh Hóa'),(18,8,'2025-08-18 09:53:01',11999000.00,'COD','paid','completed','Trung Đức || 0983722485 || Thanh Hóa'),(19,2,'2025-08-18 19:13:08',24970000.00,'COD','pending','pending','Trung Đức || 0983722485 || Thanh Hóa');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `price_old` decimal(10,2) DEFAULT NULL,
  `screen_size` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `screen_tech` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `chipset` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nfc` tinyint(1) DEFAULT '0',
  `RAM` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ROM` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `battery` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sim_slots` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `os` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `water_resistant` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stock` int DEFAULT '0',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'iPhone 15 Pro',29990000.00,31990000.00,'6.1','Super Retina XDR','A17 Pro',1,'8','256','3200','1','iOS 17','1',8,'iphone_15.jpg'),(2,1,'Samsung Galaxy S23',24990000.00,26990000.00,'6.1\"','Dynamic AMOLED 2X','Snapdragon 8 Gen 2',1,'8GB','256GB','3900mAh','2 Nano SIM','Android 13','1',10,'samsung_s23.jpg'),(3,1,'iPhone 14',19990000.00,21990000.00,'6.1\"','Super Retina XDR','A15 Bionic',1,'6GB','128GB','3279mAh','1 Nano SIM + eSIM','iOS 16','1',18,'iphone_14.jpg'),(4,1,'iPhone 14 Plus',22990000.00,24990000.00,'6.7','Super Retina XDR','A15 Bionic',1,'6','128','4325','1','iOS 16','1',12,'iphone_14_plus.jpg'),(5,1,'iPhone 14 Pro',26990000.00,28990000.00,'6.1\"','Super Retina XDR ProMotion','A16 Bionic',1,'6GB','128GB','3200mAh','1 Nano SIM + eSIM','iOS 16','1',11,'iphone_14_pro.jpg'),(6,1,'iPhone 14 Pro Max',29990000.00,31990000.00,'6.7','Super Retina XDR ProMotion','A16 Bionic',1,'6','128','4323','1','iOS 16','1',10,'iphone_14_pro_max.jpg'),(7,1,'iPhone 15',21990000.00,23990000.00,'6.1\"','Super Retina XDR','A16 Bionic',1,'6GB','128GB','3349mAh','1 Nano SIM + eSIM','iOS 17','1',25,'iphone_15.jpg'),(8,1,'iPhone 15 Plus',24990000.00,26990000.00,'6.7\"','Super Retina XDR','A16 Bionic',1,'6GB','128GB','4383mAh','1 Nano SIM + eSIM','iOS 17','1',18,'iphone_15_plus.jpg'),(9,1,'iPhone 15 Pro',27990000.00,29990000.00,'6.1\"','Super Retina XDR ProMotion','A17 Pro',1,'8GB','256GB','3274mAh','1 Nano SIM + eSIM','iOS 17','1',14,'iphone_15_pro.jpg'),(10,1,'iPhone 15 Pro Max',31990000.00,33990000.00,'6.7\"','Super Retina XDR ProMotion','A17 Pro',1,'8GB','256GB','4422mAh','1 Nano SIM + eSIM','iOS 17','1',12,'iphone_15_pro_max.jpg'),(11,1,'iPhone 16',23990000.00,25990000.00,'6.1\"','Super Retina XDR','A18 Bionic',1,'8GB','128GB','3350mAh','1 Nano SIM + eSIM','iOS 18','1',18,'iphone_16.jpg'),(12,1,'iPhone 16 Plus',26990000.00,28990000.00,'6.7\"','Super Retina XDR','A18 Bionic',1,'8GB','128GB','4375mAh','1 Nano SIM + eSIM','iOS 18','1',18,'iphone_16_plus.jpg'),(13,1,'iPhone 16 Pro',29990000.00,31990000.00,'6.1\"','Super Retina XDR ProMotion','A18 Pro',1,'8GB','256GB','3300mAh','1 Nano SIM + eSIM','iOS 18','1',12,'iphone_16_pro.jpg'),(14,1,'iPhone 16 Pro Max',33990000.00,35990000.00,'6.7\"','Super Retina XDR ProMotion','A18 Pro',1,'8GB','256GB','4450mAh','1 Nano SIM + eSIM','iOS 18','1',11,'iphone_16_pro_max.jpg'),(15,1,'iPhone SE 2024',12990000.00,14990000.00,'4.7\"','Retina HD','A16 Bionic',1,'4GB','64GB','2018mAh','1 Nano SIM + eSIM','iOS 17','0',28,'iphone_se_2024.jpg'),(16,4,'OPPO A58',5990000.00,6490000.00,'6.56\"','IPS LCD','Helio G85',1,'6GB','128GB','5000mAh','2 Nano SIM','Android 13','0',40,'oppo_a58.jpg'),(17,4,'OPPO A79',7990000.00,8490000.00,'6.72\"','IPS LCD','Dimensity 6020',1,'8GB','128GB','5000mAh','2 Nano SIM','Android 13','0',34,'oppo_a79.jpg'),(18,4,'OPPO Find X6',17990000.00,19990000.00,'6.74\"','AMOLED 120Hz','Dimensity 9200',1,'12GB','256GB','4800mAh','2 Nano SIM','Android 13','1',12,'oppo_find_x6.jpg'),(19,4,'OPPO Find X6 Pro',22990000.00,24990000.00,'6.82\"','AMOLED 120Hz','Snapdragon 8 Gen 2',1,'16GB','512GB','5000mAh','2 Nano SIM','Android 13','1',12,'oppo_find_x6_pro.jpg'),(20,4,'OPPO Find X7',18990000.00,20990000.00,'6.74\"','AMOLED 120Hz','Dimensity 9300',1,'12GB','256GB','5000mAh','2 Nano SIM','Android 14','1',11,'oppo_find_x7.jpg'),(21,4,'OPPO Find X7 Ultra',24990000.00,26990000.00,'6.82\"','AMOLED 120Hz','Snapdragon 8 Gen 3',1,'16GB','512GB','5000mAh','2 Nano SIM','Android 14','1',10,'oppo_find_x7_ultra.jpg'),(22,4,'OPPO Reno 10 Pro',13990000.00,15990000.00,'6.7\"','AMOLED 120Hz','Snapdragon 778G',1,'8GB','256GB','4600mAh','2 Nano SIM','Android 13','1',25,'oppo_reno_10_pro.jpg'),(23,4,'OPPO Reno 11',10990000.00,12990000.00,'6.7\"','AMOLED 120Hz','Dimensity 8200',1,'8GB','256GB','4800mAh','2 Nano SIM','Android 14','1',20,'oppo_reno_11.jpg'),(24,4,'OPPO Reno 11 Pro',15990000.00,17990000.00,'6.7\"','AMOLED 120Hz','Snapdragon 8+ Gen 1',1,'12GB','256GB','4700mAh','2 Nano SIM','Android 14','1',18,'oppo_reno_11_pro.jpg'),(25,2,'Samsung Galaxy S23',19990000.00,21990000.00,'6.1\"','Dynamic AMOLED 2X','Snapdragon 8 Gen 2',1,'8GB','128GB','3900mAh','2 Nano SIM','Android 13','1',25,'samsungs23.jpg'),(26,2,'Samsung Galaxy S23+',22990000.00,24990000.00,'6.6\"','Dynamic AMOLED 2X','Snapdragon 8 Gen 2',1,'8GB','256GB','4700mAh','2 Nano SIM','Android 13','1',20,'samsung_s23_plus.jpg'),(27,2,'Samsung Galaxy S23 Ultra',27990000.00,29990000.00,'6.8\"','Dynamic AMOLED 2X','Snapdragon 8 Gen 2',1,'12GB','256GB','5000mAh','2 Nano SIM','Android 13','1',15,'samsung_s23_ultra.jpg'),(28,2,'Samsung Galaxy S24',21990000.00,23990000.00,'6.2\"','Dynamic AMOLED 2X','Snapdragon 8 Gen 3',1,'8GB','256GB','4000mAh','2 Nano SIM','Android 14','1',22,'samsung_s24.jpg'),(29,2,'Samsung Galaxy S24+',24990000.00,26990000.00,'6.7\"','Dynamic AMOLED 2X','Snapdragon 8 Gen 3',1,'12GB','256GB','4900mAh','2 Nano SIM','Android 14','1',18,'samsung_s24_plus.jpg'),(30,2,'Samsung Galaxy S24 Ultra',30990000.00,32990000.00,'6.8','Dynamic AMOLED 2X','Snapdragon 8 Gen 3',1,'12','512','5000','2','Android 14','1',12,'samsung_s24_ultra.jpg'),(31,2,'Samsung Galaxy A34',7990000.00,8990000.00,'6.6\"','Super AMOLED','Dimensity 1080',1,'6GB','128GB','5000mAh','2 Nano SIM','Android 13','1',30,'samsung_a34.jpg'),(32,2,'Samsung Galaxy A54',9990000.00,10990000.00,'6.4\"','Super AMOLED','Exynos 1380',1,'8GB','128GB','5000mAh','2 Nano SIM','Android 13','1',28,'samsung_a54.jpg'),(33,2,'Samsung Galaxy Z Flip5',22990000.00,24990000.00,'6.7\"','Foldable AMOLED','Snapdragon 8 Gen 2',1,'8GB','256GB','3700mAh','2 Nano SIM','Android 13','1',14,'samsung_z_flip_5.jpg'),(34,2,'Samsung Galaxy Z Fold5',35990000.00,37990000.00,'7.6\"','Foldable AMOLED','Snapdragon 8 Gen 2',1,'12GB','512GB','4400mAh','2 Nano SIM','Android 13','1',8,'samsung_z_fold_5.jpg'),(35,3,'Xiaomi 12 Pro',15990000.00,17990000.00,'6.73\"','AMOLED 120Hz','Snapdragon 8 Gen 1',1,'8GB','256GB','4600mAh','2 Nano SIM','Android 12','1',20,'xiaomi_12_pro.jpg'),(36,3,'Xiaomi 13',18990000.00,20990000.00,'6.36\"','AMOLED 120Hz','Snapdragon 8 Gen 2',1,'8GB','256GB','4500mAh','2 Nano SIM','Android 13','1',18,'xiaomi_13.jpg'),(37,3,'Xiaomi 13 Pro',22990000.00,24990000.00,'6.73\"','AMOLED 120Hz','Snapdragon 8 Gen 2',1,'12GB','512GB','4820mAh','2 Nano SIM','Android 13','1',14,'xiaomi_13_pro.jpg'),(38,3,'Xiaomi 14',20990000.00,22990000.00,'6.36\"','AMOLED 120Hz','Snapdragon 8 Gen 3',1,'12GB','256GB','4610mAh','2 Nano SIM','Android 14','1',15,'xiaomi_14.jpg'),(39,3,'Xiaomi 14 Pro',25990000.00,27990000.00,'6.73\"','AMOLED 120Hz','Snapdragon 8 Gen 3',1,'16GB','512GB','4880mAh','2 Nano SIM','Android 14','1',12,'xiaomi_14_pro.jpg'),(40,3,'Redmi 12',3990000.00,4490000.00,'6.79\"','IPS LCD','Helio G88',0,'4GB','128GB','5000mAh','2 Nano SIM','Android 13','0',49,'redmi_12.jpg'),(41,3,'Redmi Note 12 Pro',7990000.00,8990000.00,'6.67\"','AMOLED 120Hz','Dimensity 1080',1,'8GB','256GB','5000mAh','2 Nano SIM','Android 12','1',35,'redmi_note_12_pro.jpg'),(42,3,'Redmi Note 13',5990000.00,6990000.00,'6.6\"','AMOLED 120Hz','Snapdragon 685',0,'6GB','128GB','5000mAh','2 Nano SIM','Android 13','0',40,'redmi_note_13.jpg'),(43,3,'Redmi Note 13 Pro',8990000.00,9990000.00,'6.67\"','AMOLED 120Hz','Snapdragon 7s Gen 2',1,'8GB','256GB','5000mAh','2 Nano SIM','Android 13','1',32,'redmi_note_13_pro.jpg'),(44,5,'Realme 11 Pro',8990000.00,9990000.00,'6.7\"','AMOLED 120Hz','Dimensity 7050',1,'8GB','256GB','5000mAh','2 Nano SIM','Android 13','0',30,'realme_11_pro.jpg'),(45,5,'Realme C53',3290000.00,3790000.00,'6.74\"','IPS LCD','Unisoc T612',0,'4GB','128GB','5000mAh','2 Nano SIM','Android 13','0',40,'realme_c53.jpg'),(46,5,'Realme C55',4290000.00,4790000.00,'6.6\"','IPS LCD','Helio G88',0,'6GB','128GB','5000mAh','2 Nano SIM','Android 13','0',35,'realme_c55.jpg'),(47,5,'Realme GT 5',13990000.00,14990000.00,'6.74\"','AMOLED 144Hz','Snapdragon 8 Gen 2',1,'12GB','256GB','5240mAh','2 Nano SIM','Android 13','0',20,'realme_gt_5.jpg'),(48,5,'Realme Narzo 60',5990000.00,6490000.00,'6.6\"','AMOLED 120Hz','Dimensity 6020',0,'8GB','128GB','5000mAh','2 Nano SIM','Android 13','0',24,'realme_narzo_60.jpg'),(49,6,'Vivo V29',9990000.00,10990000.00,'6.78\"','AMOLED 120Hz','Snapdragon 778G',1,'8GB','256GB','4600mAh','2 Nano SIM','Android 13','0',30,'vivo_v29.jpg'),(50,6,'Vivo X90 Pro',21990000.00,23990000.00,'6.78\"','AMOLED 120Hz','Dimensity 9200',1,'12GB','256GB','4870mAh','2 Nano SIM','Android 13','1',18,'vivo_x90_pro.jpg'),(51,6,'Vivo X100 Pro',26990000.00,28990000.00,'6.78\"','AMOLED 120Hz','Dimensity 9300',1,'16GB','512GB','5400mAh','2 Nano SIM','Android 14','1',15,'vivo_x100_pro.jpg'),(52,6,'Vivo Y17s',3990000.00,4490000.00,'6.56\"','IPS LCD','Helio G85',0,'4GB','128GB','5000mAh','2 Nano SIM','Android 13','0',45,'vivo_y17s.jpg'),(53,6,'Vivo Y36',5990000.00,6490000.00,'6.64\"','IPS LCD','Snapdragon 680',0,'8GB','256GB','5000mAh','2 Nano SIM','Android 13','0',40,'vivo_y36.jpg'),(54,7,'Sony Xperia 1 V',27990000.00,29990000.00,'6.5\"','OLED 120Hz','Snapdragon 8 Gen 2',1,'12GB','256GB','5000mAh','2 Nano SIM','Android 13','1',10,'sony_xperia_1_v.jpg'),(55,7,'Sony Xperia 1 VI',29990000.00,31990000.00,'6.5\"','OLED 120Hz','Snapdragon 8 Gen 3',1,'12GB','256GB','5000mAh','2 Nano SIM','Android 14','1',80,'sony_xperia_1_VI.jpg'),(56,7,'Sony Xperia 5 V',23990000.00,25990000.00,'6.1\"','OLED 120Hz','Snapdragon 8 Gen 2',1,'8GB','256GB','5000mAh','2 Nano SIM','Android 13','1',12,'sony_xperia_5_v.jpg'),(57,7,'Sony Xperia 10 VI',12990000.00,13990000.00,'6.1\"','OLED','Snapdragon 6 Gen 1',1,'6GB','128GB','5000mAh','2 Nano SIM','Android 14','0',17,'sony_xperia_10_vi.jpg'),(58,1,'Iphone 13 Pro',23990000.00,25990000.00,'6.1\"','Super Retina XDR ProMotion','A15 Bionic',1,'6GB','128GB','3095mAh','1 Nano SIM + eSIM','IOS 15','1',10,'iphone_13_pro.jpg'),(59,1,'iphone test',12000.00,12.00,'12','12','12',12,'12','12','12','12','12','12',12,'trinhhuyhoang.jpg'),(61,1,'test2',1.00,1.00,'123gf','1','1',1,'1','1','1','1','1','1',11,'Rooney.png'),(63,1,'test4',1.00,2.00,'2','1','',0,'1','1','1','1','1','1',1,'Neymar_Jr.png'),(67,2,'oppotest',11999000.00,14000000.00,'5.7 inch','OLED','snapdragon 888',0,'6','128','4000','2','Android','IP54',20,'Xabi_Alonso(1).png');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('admin','user') COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Admin','admin@gmail.com','0123456789','Hà Nội','admin','123456'),(2,'Trung Duc','duc@gmail.com','0987654321','','user','123456'),(3,'Trung Duc','trungduc@gmail.com','0983722485',NULL,'admin','123456'),(4,'Quang Anh','quanganh@gmail.com',NULL,NULL,'user','123456'),(5,'Duy Anh','duyanh@gmail.com','0988776654','Hà Nội','user','123456'),(7,'Lam Oanh','lamoanh@gmail.com','0365394841','Thanh Hóa','admin','123456'),(8,'Trung Đức','dtducdzz@gmail.com','0983722485','Thanh Hóa','admin','123456'),(9,'user','user@gmail.com','1212323223','dsad','user','123456'),(10,'test','test1@gmail.com',NULL,NULL,'user',' ');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-19  2:35:10
