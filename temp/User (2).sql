-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 09, 2014 at 02:03 PM
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=74 ;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`id`, `name`, `email`, `authName`, `authPassword`, `contact`, `company`, `businessType`, `interested`, `role`, `startDate`, `message`, `budget`, `createdAt`, `updatedAt`, `website`) VALUES
(16, 'kin', 'abc@gmail.com', NULL, NULL, '329847532', 'melon', 'd', NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:51:23', '2014-09-04 18:51:23', 'http://www.google.com'),
(17, 'sadfsdf', 'asdfasdf@gmail.com', NULL, NULL, '23234234234', 'dsfasdfsfs', 'e', NULL, 'client', NULL, 'sadfasdfas', 'dfsadfsadf', '2014-09-04 18:52:33', '2014-09-04 18:52:33', 'http://www.infradesign.com.my'),
(24, 'kelvin', 'abc@gmail.com', NULL, NULL, '329847532', 'leaf', 'i', NULL, 'client', NULL, NULL, NULL, '2014-09-04 16:43:15', '2014-09-04 16:43:15', 'http://www.infradesign.com.my'),
(27, 'sadfsdf', 'asdfasdf@gmail.com', NULL, NULL, '23234234234', 'dsfasdfsfs', 'j', NULL, 'client', NULL, 'sadfasdfas', 'dfsadfsadf', '2014-09-04 18:52:33', '2014-09-04 18:52:33', 'http://www.yahoo.com'),
(44, 'sad', 'abc@gmail.com', NULL, NULL, '329847532', 'juice', 'bb', NULL, 'client', NULL, NULL, NULL, '2014-09-04 16:43:15', '2014-09-04 16:43:15', 'http://www.yahoo.com'),
(45, 'wahaha', 'abc@gmail.com', NULL, NULL, '329847532', 'property', 'ccc', NULL, 'client', NULL, NULL, NULL, '2014-09-04 16:43:16', '2014-09-04 16:43:16', 'http://www.google.com'),
(46, 'lolo', 'abc@gmail.com', NULL, NULL, '329847532', 'building', 'ddd', NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:51:23', '2014-09-04 18:51:23', 'http://www.google.com'),
(47, 'sadfsdf', 'asdfasdf@gmail.com', NULL, NULL, '23234234234', 'dsfasdfsfs', 'eee', NULL, 'client', NULL, 'sadfasdfas', 'dfsadfsadf', '2014-09-04 18:52:33', '2014-09-04 18:52:33', 'http://www.google.com'),
(56, 'wonderland', 'wonderland@gamil.com', NULL, NULL, '67676767676', 'google', 'd', NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:51:23', '2014-09-04 18:51:23', 'http://www.infradesign.com.my'),
(57, 'sadfsdf', 'asdfasdf@gmail.com', NULL, NULL, '23234234234', 'dsfasdfsfs', 'e', NULL, 'client', NULL, 'sadfasdfas', 'dfsadfsadf', '2014-09-04 18:52:33', '2014-09-04 18:52:33', 'http://www.yahoo.com'),
(64, 'old', 'new@g.com', NULL, NULL, 'con', 'com', 'type', 'crm,mobileapplicatoin', 'client', '', '', '', NULL, NULL, ''),
(65, 'john', 'john@gmail.com', NULL, NULL, 'con', 'com', 'type', 'ar,virtualtour', 'client', '', '', '', NULL, NULL, ''),
(66, 'john', 'john@a.com', NULL, NULL, '1212', 'company', 'type', 'prosalesdemoversion,ar,crm,virtualtour,mobileapplicatoin', 'client', '', '', '', NULL, NULL, ''),
(67, 'john', 'john@abc.com', NULL, NULL, '121212', 'infra', 'design', 'prosalesdemoversion,crm,mobileapplicatoin', 'client', '', '', '', NULL, NULL, 'http://www.infra.com'),
(69, 'abc1', 'abc@gmail.com', NULL, NULL, 'contact', 'company', 'type', 'ar,virtualtour,mobileapplicatoin', 'client', '', '', '', NULL, '2014-09-09 19:25:10', 'http://abc.com'),
(70, 'abc', 'abc@gmail.com', NULL, NULL, 'contact', 'company', 'type', 'prosalesdemoversion,crm,mobileapplicatoin', 'client', '', '', '', NULL, NULL, 'http://www.123.com'),
(71, 'bbbbaaa', 'aaa@gmail.com', NULL, NULL, '12121212', 'company', 'business', 'crm,mobileapplicatoin', 'client', '', '', '', NULL, '2014-09-09 19:48:42', 'http://www.abc.com'),
(73, 'aha', 'aha@g.com', NULL, NULL, '1212', 'company', 'type', 'ar,crm,virtualtour,mobileapplicatoin', 'client', '', '', '', '2014-09-09 17:43:53', '2014-09-09 17:43:53', 'http://123.com');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
