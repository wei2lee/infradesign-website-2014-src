-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 08, 2014 at 02:26 PM
-- Server version: 5.6.16
-- PHP Version: 5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `infr3963_infradesign`
--

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE IF NOT EXISTS `User` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_bin DEFAULT '',
  `email` varchar(50) COLLATE utf8_bin DEFAULT '',
  `authName` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `authPassword` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `contact` varchar(50) COLLATE utf8_bin DEFAULT '',
  `company` varchar(50) COLLATE utf8_bin DEFAULT '',
  `businessType` varchar(50) COLLATE utf8_bin DEFAULT '',
  `interested` varchar(200) COLLATE utf8_bin DEFAULT '',
  `role` varchar(50) COLLATE utf8_bin DEFAULT 'client',
  `startDate` varchar(50) COLLATE utf8_bin DEFAULT '',
  `message` varchar(500) COLLATE utf8_bin DEFAULT '',
  `budget` varchar(50) COLLATE utf8_bin DEFAULT '',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `website` varchar(200) COLLATE utf8_bin DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=60 ;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`id`, `name`, `email`, `authName`, `authPassword`, `contact`, `company`, `businessType`, `interested`, `role`, `startDate`, `message`, `budget`, `createdAt`, `updatedAt`, `website`) VALUES
(13, 'Jacky Lee Yee Chuan', 'abc@gmail.com', 'jacky', 'jacky', '1235678', 'apple', 'a', NULL, 'admin', NULL, NULL, NULL, '2014-09-04 16:43:12', '2014-09-04 16:43:12', 'http://www.google.com'),
(14, 'john', 'abc@gmail.com', NULL, NULL, '1235678', 'orange', 'b', NULL, 'client', NULL, NULL, NULL, '2014-09-04 16:43:15', '2014-09-04 16:43:15', 'http://www.google.com'),
(15, 'ben', 'abc@gmail.com', NULL, NULL, '1235678', 'water', 'c', NULL, 'client', NULL, NULL, NULL, '2014-09-04 16:43:16', '2014-09-04 16:43:16', 'http://www.google.com'),
(16, 'kin', 'abc@gmail.com', NULL, NULL, '329847532', 'melon', 'd', NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:51:23', '2014-09-04 18:51:23', 'http://www.google.com'),
(17, 'sadfsdf', 'asdfasdf@gmail.com', NULL, NULL, '23234234234', 'dsfasdfsfs', 'e', NULL, 'client', NULL, 'sadfasdfas', 'dfsadfsadf', '2014-09-04 18:52:33', '2014-09-04 18:52:33', 'http://www.infradesign.com.my'),
(18, 'aaa', 'aa@gmail.com', NULL, NULL, '1212121212', 'aaaaaaa', 'f', NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:53:54', '2014-09-04 18:53:54', 'http://www.infradesign.com.my'),
(19, 'aaa', 'aa@gmail.com', NULL, NULL, '1212121212', 'aaaaaaa', 'g', NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:57:04', '2014-09-04 18:57:04', 'http://www.infradesign.com.my'),
(20, 'abc', 'abc@gmail.com', NULL, NULL, '1212121212', 'abcdef', 'my business', 'ar, crm, virtualtour', 'client', NULL, NULL, NULL, '2014-09-04 18:57:45', '2014-09-04 18:57:45', 'http://www.infradesign.com.my'),
(24, 'kelvin', 'abc@gmail.com', NULL, NULL, '329847532', 'leaf', 'i', NULL, 'client', NULL, NULL, NULL, '2014-09-04 16:43:15', '2014-09-04 16:43:15', 'http://www.infradesign.com.my'),
(25, 'christina', 'abc@gmail.com', NULL, NULL, '329847532', 'tree', 'j', NULL, 'client', NULL, NULL, NULL, '2014-09-04 16:43:16', '2014-09-04 16:43:16', 'http://www.infradesign.com.my'),
(26, 'happy', 'abc@gmail.com', NULL, NULL, '329847532', 'root', 'k', NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:51:23', '2014-09-04 18:51:23', 'http://www.yahoo.com'),
(27, 'sadfsdf', 'asdfasdf@gmail.com', NULL, NULL, '23234234234', 'dsfasdfsfs', 'j', NULL, 'client', NULL, 'sadfasdfas', 'dfsadfsadf', '2014-09-04 18:52:33', '2014-09-04 18:52:33', 'http://www.yahoo.com'),
(28, 'aaa', 'aa@gmail.com', NULL, NULL, '1212121212', 'aaaaaaa', 'l', NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:53:54', '2014-09-04 18:53:54', 'http://www.yahoo.com'),
(29, 'aaa', 'aa@gmail.com', NULL, NULL, '1212121212', 'aaaaaaa', 'm', NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:57:04', '2014-09-04 18:57:04', 'http://www.yahoo.com'),
(30, 'abc', 'abc@gmail.com', NULL, NULL, '1212121212', 'abcdef', 'my business', 'ar, crm, virtualtour', 'client', NULL, NULL, NULL, '2014-09-04 18:57:45', '2014-09-04 18:57:45', 'http://www.yahoo.com'),
(40, 'abc', 'abc@gmail.com', NULL, NULL, '1212121212', 'abcdef', 'my business', 'ar, crm, virtualtour', 'client', NULL, NULL, NULL, '2014-09-04 18:57:45', '2014-09-04 18:57:45', 'http://www.yahoo.com'),
(44, 'sad', 'abc@gmail.com', NULL, NULL, '329847532', 'juice', 'bb', NULL, 'client', NULL, NULL, NULL, '2014-09-04 16:43:15', '2014-09-04 16:43:15', 'http://www.yahoo.com'),
(45, 'wahaha', 'abc@gmail.com', NULL, NULL, '329847532', 'property', 'ccc', NULL, 'client', NULL, NULL, NULL, '2014-09-04 16:43:16', '2014-09-04 16:43:16', 'http://www.google.com'),
(46, 'lolo', 'abc@gmail.com', NULL, NULL, '329847532', 'building', 'ddd', NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:51:23', '2014-09-04 18:51:23', 'http://www.google.com'),
(47, 'sadfsdf', 'asdfasdf@gmail.com', NULL, NULL, '23234234234', 'dsfasdfsfs', 'eee', NULL, 'client', NULL, 'sadfasdfas', 'dfsadfsadf', '2014-09-04 18:52:33', '2014-09-04 18:52:33', 'http://www.google.com'),
(48, 'aaa', 'aa@gmail.com', NULL, NULL, '1212121212', 'aaaaaaa', 'aaaa', NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:53:54', '2014-09-04 18:53:54', 'http://www.google.com'),
(49, 'aaa', 'aa@gmail.com', NULL, NULL, '1212121212', 'aaaaaaa', 'hhh', NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:57:04', '2014-09-04 18:57:04', 'http://www.google.com'),
(50, 'abc', 'abc@gmail.com', NULL, NULL, '1212121212', 'abcdef', 'my business', 'ar, crm, virtualtour', 'client', NULL, NULL, NULL, '2014-09-04 18:57:45', '2014-09-04 18:57:45', 'http://www.infradesign.com.my'),
(53, 'Jacky Lee Yee Chuan', NULL, NULL, NULL, '121212', 'wonderland', 'a', NULL, 'client', NULL, NULL, NULL, '2014-09-04 16:43:12', '2014-09-04 16:43:12', 'http://www.infradesign.com.my'),
(54, 'infra', 'infra@gmail.com', NULL, NULL, '23232323', 'infradesign', 'b', NULL, 'client', NULL, NULL, NULL, '2014-09-04 16:43:15', '2014-09-04 16:43:15', 'http://www.infradesign.com.my'),
(55, 'design', 'design@gmail.com', NULL, NULL, '4545454545', 'gogogo', 'c', NULL, 'client', NULL, NULL, NULL, '2014-09-04 16:43:16', '2014-09-04 16:43:16', 'http://www.infradesign.com.my'),
(56, 'wonderland', 'wonderland@gamil.com', NULL, NULL, '67676767676', 'google', 'd', NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:51:23', '2014-09-04 18:51:23', 'http://www.infradesign.com.my'),
(57, 'sadfsdf', 'asdfasdf@gmail.com', NULL, NULL, '23234234234', 'dsfasdfsfs', 'e', NULL, 'client', NULL, 'sadfasdfas', 'dfsadfsadf', '2014-09-04 18:52:33', '2014-09-04 18:52:33', 'http://www.yahoo.com'),
(58, 'aaa', 'aa@gmail.com', NULL, NULL, '1212121212', 'aaaaaaa', 'f', NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:53:54', '2014-09-04 18:53:54', 'http://www.yahoo.com'),
(59, 'aaa', 'aa@gmail.com', NULL, NULL, '1212121212', 'aaaaaaa', 'g', NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:57:04', '2014-09-04 18:57:04', 'http://www.yahoo.com');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
