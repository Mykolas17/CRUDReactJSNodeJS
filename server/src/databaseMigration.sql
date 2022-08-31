
CREATE DATABASE IF NOT EXISTS reactJsTest;
USE reactJsTest;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullName` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `reg_timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES (1,'vidmantas1','vidmantas1','$2b$10$tnVaAX25bSkE2l32WLGNduqvAzNZD7hIm5LQWjhWH8VgBTOCTmY9O','2022-07-17 20:17:28'),(2,'vidmantas2','vidmantas2','$2b$10$/LZWSugKamlwY/I0KHoQ2Oc8JQyVOk7gMRwURJmHpmOG1HRYNz2vG','2022-07-17 20:47:36');
UNLOCK TABLES;

DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `date` DATE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `grupes`
--

LOCK TABLES `events` WRITE;
INSERT INTO `events` VALUES (1,'Trip to Spain'),(2,'Going to Alps');
UNLOCK TABLES;


--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `events_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `events_id` (`event_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`events_id`) REFERENCES `events` (`id`),
  CONSTRAINT `accounts_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Table structure for table `bills`
--

DROP TABLE IF EXISTS `guests`;
CREATE TABLE `guests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `events_id` int NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `date` DATE,
  PRIMARY KEY (`id`),
  KEY `grupes_id` (`events_id`),
  CONSTRAINT `bills_ibfk_1` FOREIGN KEY (`events_id`) REFERENCES `events` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



