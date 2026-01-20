-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: db_toko_bangunan
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `db_toko_bangunan`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `db_toko_bangunan` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `db_toko_bangunan`;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_kategori` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Besi & Baja'),(2,'Material Bangunan'),(3,'Pasir & Batu'),(4,'Cat & Finishing'),(5,'Kayu & Triplek'),(6,'Kuas & Peralatan Cat'),(7,'Alat Pertukangan'),(8,'Bahan Finishing'),(9,'Pipa & Sanitasi'),(10,'genteng');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int DEFAULT NULL,
  `qty` int DEFAULT NULL,
  `harga` int DEFAULT NULL,
  `total` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(20) DEFAULT 'cart',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (6,25,1,65000,65000,'2026-01-06 01:32:23','cart'),(10,1,2,50000,100000,'2026-01-13 16:48:19','cart'),(11,1,1,50000,50000,'2026-01-13 16:49:39','cart'),(12,1,1,50000,50000,'2026-01-13 17:20:17','paid'),(13,3,1,68000,68000,'2026-01-13 17:49:59','paid');
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
  `nama_produk` varchar(100) DEFAULT NULL,
  `harga` int DEFAULT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `kategori_id` int DEFAULT NULL,
  `deskripsi` text,
  `stok` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `kategori_id` (`kategori_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`kategori_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Besi Beton Hollo',150000,'5acaf1db90fa457a942441dcb9c7ac92.jpg',1,'Besi beton polos',20),(2,'Besi Beton',150000,'56f33126c480417990444d65affb6291.jpg',1,'Besi beton ulir',20),(3,'Semen',68000,'358bad391cd3429680139697e741e4e3.jpg',2,'Semen tiga roda 50kg',99),(4,'Pasir',250000,'74d52169fe7842289f7906dff640459a.jpg',3,'Pasir kualitas bangunan',4),(5,'Kayu Balok',85000,'7288994480064134a9bf3c277f3d4738.jpg',5,'Kayu balok bangunan',60),(6,'Triplek 12mm',120000,'7667057c4146439089431adfd12757ec.jpg',5,'Triplek tebal 12mm',79),(7,'Plywood',135000,'c84979984c33478a805843644074fffb.jpg',5,'Plywood kualitas tinggi',5),(8,'Kuas Cat 3 Inch',25000,'f9b8b27451d640dc94ba3a1af6eb5464.jpg',6,'Kuas cat ukuran 3 inch',40),(9,'Roll Cat',45000,'e9166a88e4b641ad9d6f8192a0c54443.jpg',6,'Roll cat tembok',8),(10,'Bak Cat',20000,'03679ffb1656464c93278eaeb78d09e9.jpg',6,'Bak cat plastik',18),(11,'Palu Bangunan',35000,'c5ecaab0534f450ca7f2078ef7459919.jpg',7,'Palu bangunan',34),(12,'Gerinda Tangan',450000,'77b176c32e40420783995d4546ccb749.jpg',7,'Gerinda listrik',30),(13,'Bor Listrik',520000,'2da90fa02042491081f3115e88f602b5.jpg',7,'Bor listrik',56),(14,'Besi Siku',80000,'08ba165323ed4e61a6da86c2e70adc1a.jpg',1,'Besi siku',20),(15,'Batu Bata',900,'3623b994daa443febf7070f04cbe7ca5.jpg',2,'Batu bata',5000),(16,'Batako',3500,'723b7bea61954f04815d09561622ce5d.jpg',2,'Batako',1000),(17,'Pasir Cor',350000,'20aeffbe39304dc28df66ae856e7de0e.jpg',3,'Pasir cor',68),(18,'Batu Split',400000,'21d53acc0213449dae8b773317dea050.jpg',3,'Batu split',76),(19,'Cat Tembok',120000,'213cd2f6793442bfbf327619a8176f50.jpg',4,'Cat tembok',80),(20,'Cat Kayu & Besi',95000,'79be8928c6f245939622c0a8ac1eb43f.jpg',4,'Cat kayu dan besi',48),(21,'Cat Anti Bocor',180000,'f962b34eeb5946618a3d9c35ffda2720.jpg',4,'Cat anti bocor',28),(22,'Keramik Lantai',75000,'4385b85255134afabeb9eca62492e00b.jpg',8,'Keramik lantai',20),(23,'Plafon PVC',95000,'bc2ce4694fc943949f12da0b09d59058.jpg',8,'Plafon PVC',50),(24,'Wallpaper Dinding',110000,'47bbf63d05484e8ea4fe531168b596cd.jpg',8,'Wallpaper dinding',34),(25,'Pipa PVC',65000,'daae47ec65154fe59aa89b7574a9d86b.jpg',9,'Pipa PVC',40),(26,'Kran Air',120000,'1945cb3d32a24261b82833e1b1e029d1.jpg',9,'Kran air',16),(27,'Closet Duduk',850000,'552d8f84fb27486a8c5e440c8fa29420.jpg',9,'Closet duduk',26),(30,'genteng karang tilang',150000,'b689e2e0fd4b40ffab747eac10d0d683.jpg',10,'genteng anti bocor',1);
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
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin123','admin'),(2,'user','user123','user');
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

-- Dump completed on 2026-01-20 15:27:04
