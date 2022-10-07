CREATE DATABASE  IF NOT EXISTS `project_4_schema` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `project_4_schema`;
-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: project_4_schema
-- ------------------------------------------------------
-- Server version	8.0.29

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
-- Table structure for table `cart_products`
--

DROP TABLE IF EXISTS `cart_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `cart_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cart_product_id_idx` (`product_id`),
  KEY `car_id_idx` (`cart_id`),
  CONSTRAINT `cart_id` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`),
  CONSTRAINT `cart_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_products`
--

LOCK TABLES `cart_products` WRITE;
/*!40000 ALTER TABLE `cart_products` DISABLE KEYS */;
INSERT INTO `cart_products` VALUES (7,4,2,90.00,1),(8,10,5,10.00,1),(9,13,3,7.50,2),(10,7,1,4.00,2),(11,21,2,7.60,2),(12,19,5,12.50,3),(13,35,2,19.40,3),(14,29,1,6.00,3),(67,9,4,12.00,5),(120,26,1,17.00,36),(121,59,1,1.90,36),(122,49,1,50.00,36),(123,23,1,4.00,36),(124,33,1,4.00,36),(125,7,1,4.00,36),(126,1,1,10.00,36),(127,27,4,84.00,36),(128,59,1,1.90,36),(133,59,1,1.90,51),(138,27,1,21.00,98),(139,26,1,17.00,99);
/*!40000 ALTER TABLE `cart_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id_idx` (`customer_id`),
  CONSTRAINT `customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,222929233,'2022-09-06 09:40:22'),(2,222929233,'2022-09-05 09:40:22'),(3,222929233,'2022-09-04 11:35:19'),(4,222929233,'2022-09-11 17:35:19'),(5,300507883,'2022-09-11 08:35:19'),(36,300507883,'2022-09-26 16:17:34'),(51,300507883,'2022-09-28 15:08:12'),(98,300507883,'2022-09-29 12:32:24'),(99,300507883,'2022-09-29 13:01:43');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `id` int NOT NULL,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `user_name` varchar(30) NOT NULL,
  `password` varchar(100) NOT NULL,
  `city` varchar(45) DEFAULT NULL,
  `street` varchar(45) DEFAULT NULL,
  `house_number` int DEFAULT NULL,
  `role` varchar(45) NOT NULL DEFAULT 'customer',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (5544,'dsf','dsfds','ds@gm.com','Df3333','Tel Aviv','sdfs',1,'customer','2022-09-05 15:24:22'),(5555,'relop','gopda','yyyop.g@gop.com','Df3333','Petah Tikva','fd',1,'customer','2022-09-05 15:01:04'),(43345,'sdf','sfsdf','ee@gmai.com','Df3333','Tel Aviv','dsf',1,'customer','2022-09-05 15:10:22'),(43543,'sdf','gfdsg','dsf@v.com','Df3333','Tel Aviv','sfdg',1,'customer','2022-09-05 15:31:50'),(55554,'fdd','fddfg','dops.r@ynet.com','Df3333','Tel Aviv','ddf',1,'customer','2022-09-05 15:05:26'),(324332,'sdf','sdf','ds@ds.cv','Df3333','Tel Aviv','dsf',1,'customer','2022-09-05 15:28:03'),(325434,'xvcx','xcsgdf','dfds@v.com','Df3333','Tel Aviv','dsfds',1,'customer','2022-09-05 15:18:08'),(555542,'fsdfsd','sdfsddfsd','eitanpinto1000@gmail.com','Ef3333','Tel Aviv','dsfsd',1,'customer','2022-09-05 15:08:49'),(756766,'jk','jnk','xzc@v.coo','Df3333','Tel Aviv','mkl',1,'customer','2022-09-05 18:51:57'),(160777888,'john','doe','johndoe1234','dfdf','‌',NULL,NULL,'admin','2022-08-25 11:31:16'),(222929233,'benny','shlomo','bshlomo5554','ssvv','Haifa','fofo',7,'customer','2022-08-25 11:31:16'),(300507883,'roi','bobo','rbobo567','1212x','Ashdod','gpgo',13,'customer','2022-08-25 11:33:03');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `cart_id` int NOT NULL,
  `final_price` decimal(10,2) NOT NULL,
  `ship_city` varchar(45) NOT NULL,
  `ship_street` varchar(45) NOT NULL,
  `ship_house_number` int NOT NULL,
  `ship_date_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `order_submitted_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_4_digits_credit_card` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_cart_id_idx` (`cart_id`),
  KEY `order_customer_id_idx` (`customer_id`),
  CONSTRAINT `order_cart_id` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`),
  CONSTRAINT `order_customer_id` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,222929233,1,100.00,'Haifa','fofo',7,'2022-09-10 14:30:00','2022-09-06 11:27:12',4598),(2,222929233,2,19.10,'Tel Aviv','domo',14,'2022-09-25 14:30:00','2022-09-05 11:27:12',4598),(3,222929233,3,37.90,'Haifa','fofo',7,'2022-09-27 10:30:00','2022-09-08 11:27:12',4598),(4,300507883,5,12.00,'Ashdod','gpgo',13,'2022-10-16 10:30:00','2022-09-09 17:17:36',3327),(5,300507883,36,176.80,'Tel Aviv','ds',32,'2022-09-26 14:44:00','2022-09-28 14:51:35',6774),(38,300507883,51,261.80,'Ashdod','gpgo',13,'2022-08-31 23:32:00','2022-09-29 11:32:44',0),(42,300507883,98,21.00,'Ashdod','gpgo',13,'2022-08-31 00:33:00','2022-09-29 12:33:39',0);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_categories`
--

DROP TABLE IF EXISTS `product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL DEFAULT 'general',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_categories`
--

LOCK TABLES `product_categories` WRITE;
/*!40000 ALTER TABLE `product_categories` DISABLE KEYS */;
INSERT INTO `product_categories` VALUES (1,'Alcholol beverages'),(2,'Beverages'),(3,'Fruits'),(4,'Vegetables'),(5,'Canned Goods'),(6,'Frozen Foods'),(7,'Meat'),(8,'Fish and shellfish'),(9,'Deli'),(10,'Condiments & Spices '),(11,'Sauces & Oils'),(12,'Snacks'),(13,'Bread & Bakery '),(14,'Pasta & Rice '),(15,'Cereal'),(16,'Baking'),(17,'Personal Care '),(18,'Health Care'),(19,'Paper & Wrap'),(20,'Household Supplies'),(21,'Baby Items'),(22,'Dairy items'),(23,'Other');
/*!40000 ALTER TABLE `product_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `category_id` int NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '10.00',
  `image` varchar(10000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_category_id_idx` (`category_id`),
  CONSTRAINT `product_category_id` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Huggies Diapers',21,10.00,'/huggiesDiapers.png'),(2,'Doritos SM',12,4.00,'/doritos_L.jpg'),(3,'Doritos LG',12,7.00,'/doritos_L.jpg'),(4,'Vodka Smirnoff 1L',1,45.00,'/smirnoff1L.jpg'),(5,'MeyEden Mineral Water 6 pack ',2,8.00,'/6packMeyEden.jpg'),(6,'Pantene Shampoo ',17,4.50,'/pantene_shampoo.jpg'),(7,'Osem CornFlakes Yellow',15,4.00,'/osem_cornflakes.jpg'),(8,'Fresh Salmon per kilo',8,10.00,'/fresh_salmon.jpg'),(9,'Bannana',3,3.00,'/banana.jpg'),(10,'Tomatoes',4,2.00,'/tomato.jpg'),(11,'Onion',4,1.50,'/onions.jpg'),(12,'Tasters Choice Coffee',2,7.00,'/tatersChoiceCofee.jpg'),(13,'Tnuva Cottege Cheese',22,2.50,'/cottege_tnuva.png'),(14,'Eggs 12pack',16,5.00,'/eggs12pack.jpg'),(15,'Eggs 18pack',16,8.00,'/eggs18pack.jpg'),(16,'Colgate ToothBrush 2pack',17,4.00,'/2packColgateToothbrush.jpg'),(17,'Colgate Kids Toothpaste',17,5.50,'/colgateKidsToothbrush.jpg'),(18,'Colgate Toothpaste',17,5.00,'/colgateToothbrush.jpg'),(19,'Osem Bamba SM',12,2.50,'/osemBambaSM.jpg'),(20,'Osem Bamba 10pack',12,11.50,'/osemBamba10pack.jpg'),(21,'Sliced Bread Berman',13,3.80,'/bermanBread.jpg'),(22,'Tnuva Eshel Cheese',22,2.00,'/eshelTnuva.jpg'),(23,'Scissors SM',23,4.00,'/smallScicsors.jpg'),(24,'Elite Cow Chocolate 5pack',12,5.90,'/5packEliteCowChocolate.jpg'),(25,'Sugat Persion Rice',14,3.20,'/persianSugatRice.jpg'),(26,'Arak HaEla',1,17.00,'/arakAela.jpg'),(27,'Goldstar Beer 6pack',1,21.00,'/goldstar6pack.jpg'),(28,'Osem Ketchup',10,5.30,'/osemKetchup.jpg'),(29,'Heinz Ketchup ',10,6.00,'/heintzKetchup.png'),(30,'Osem Spicy Ketchup',10,5.50,'/osemSpicyKetchup.jpg'),(31,'Heinz Mustard ',10,6.50,'/heintzMustard.jpg'),(32,'Orbit Gum 5pack',12,3.00,'/orbitGum5pack.jpg'),(33,'A4 Paper pack ',23,4.00,'/a4papaerpack.jpg'),(34,'Gilette Shaving Razor',17,13.70,'/gilleteShavingRazor.jpg'),(35,'Coca-Cola 6pack',2,9.70,'/coca-cola-6-pack.jpg'),(36,'Coca-Cola 1Unit',2,2.30,'/coca-cola-1.5.jpg'),(37,'Elite Turkish Coffe',2,5.40,'/turki_100.jpg'),(38,'Vodka Beluga Novel 700ml',1,50.00,'/vodkaBelugaNovel700ml.jpg'),(39,'Vodka Nemiroff Pepper & Honey 700ml',1,35.00,'/vodkaNemiroffPepperandHoney700ml.jpg'),(40,'Vodka Blagoff Green Apple 700ml',1,32.70,'/vodkaBlagoffGreenApple700ml.jpg'),(41,'Vodka Nemiroff Original 700ml',1,35.00,'/vodkaNemiroffOriginal700ml.jpg'),(42,'Vodka Hlibny Dar Classic 700ml ',1,35.00,'/vodkaHilbnyClassic700ml.jpg'),(43,'Vodka Blagoff Premium 700ml',1,34.00,'/vodkaBlagoffPremium.jpg'),(44,'Vodka Belenkaya Extra 1L',1,52.00,'/vodkaBelenkayaExtra1L.jpg'),(45,'Vodka Imperial Collection Gold 700ml',1,49.00,'/vodkaImperialCollectionGold700ml.jpg'),(46,'Vodka Zubrowka Bisson Grass 700ml ',1,58.00,'/VodkaZubrowkaBissonGrass700ml.jpg'),(47,'Vodka Stolichnaya Elite 700ml',1,70.00,'/stolichnaya-elit.jpg'),(48,'Vodka Stolichnaya Gold 700ml',1,56.90,'/VodkaStolichnayaGold700ml.jpg'),(49,'Vodka Belenkaya Gold 1L',1,50.00,'/VodkaBelenkayaGold1L.jpg'),(50,'Vodka Ruski Standard 500ml',1,26.00,'/VodkaRuskiStandard500ml.jpg'),(51,'Whisky John Barr 1L',1,30.00,'/johnBarWhiskey1L.jpg'),(52,'Whisky Tomatin Single Malt 12 700ml',1,80.00,'/tomatin12.jpg'),(53,'Whisky Bushmills Black Bush 700ml',1,70.00,'/bushmillsBlackBush700.jpg'),(54,'Whisky Bushmills 10 years 700ml',1,80.00,'/bushmills10years700ml.jpg'),(55,'Whisky Tamnavulin Sherry Cask Edition 700ml',1,76.00,'/WhiskyTamnavulinSherryCaskEdition700ml.jpg'),(56,'Whisky Whyte & Mackay Blended 700ml',1,35.00,'/WhiskyWhyte&MackayBlended700ml.jpg'),(57,'Jem\'s Beer IPA 330ml',1,2.50,'/jems_beer.jpg'),(58,'HobGoblin Beer IPA 500ml ',1,3.30,'/HobGoblinBeerIPA500ml.jpg'),(59,'Savanna Dry Premium Cider 330ml',1,1.90,'/SavannaDryPremiumCider330ml.jpg');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-02 17:20:52
