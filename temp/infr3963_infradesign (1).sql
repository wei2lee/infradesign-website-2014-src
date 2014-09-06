-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 05, 2014 at 12:14 PM
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=21 ;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`id`, `name`, `email`, `authName`, `authPassword`, `contact`, `company`, `businessType`, `interested`, `role`, `startDate`, `message`, `budget`, `createdAt`, `updatedAt`) VALUES
(23, 'Jacky Lee Yee Chuan', NULL, 'jacky', 'jacky', NULL, NULL, NULL, NULL, 'admin', NULL, NULL, NULL, '2014-09-04 16:43:12', '2014-09-04 16:43:12'),
(24, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'client', NULL, NULL, NULL, '2014-09-04 16:43:15', '2014-09-04 16:43:15'),
(25, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'client', NULL, NULL, NULL, '2014-09-04 16:43:16', '2014-09-04 16:43:16'),
(26, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:51:23', '2014-09-04 18:51:23'),
(27, 'sadfsdf', 'asdfasdf@gmail.com', NULL, NULL, '23234234234', 'dsfasdfsfs', NULL, NULL, 'client', NULL, 'sadfasdfas', 'dfsadfsadf', '2014-09-04 18:52:33', '2014-09-04 18:52:33'),
(28, 'aaa', 'aa@gmail.com', NULL, NULL, '1212121212', 'aaaaaaa', NULL, NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:53:54', '2014-09-04 18:53:54'),
(29, 'aaa', 'aa@gmail.com', NULL, NULL, '1212121212', 'aaaaaaa', NULL, NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:57:04', '2014-09-04 18:57:04'),
(30, 'abc', 'abc@gmail.com', NULL, NULL, '1212121212', 'abcdef', 'my business', 'ar, crm, virtualtour', 'client', NULL, NULL, NULL, '2014-09-04 18:57:45', '2014-09-04 18:57:45');

INSERT INTO `User` (`id`, `name`, `email`, `authName`, `authPassword`, `contact`, `company`, `businessType`, `interested`, `role`, `startDate`, `message`, `budget`, `createdAt`, `updatedAt`) VALUES
(43, 'Jacky Lee Yee Chuan', NULL, 'jacky', 'jacky', NULL, NULL, NULL, NULL, 'admin', NULL, NULL, NULL, '2014-09-04 16:43:12', '2014-09-04 16:43:12'),
(44, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'client', NULL, NULL, NULL, '2014-09-04 16:43:15', '2014-09-04 16:43:15'),
(45, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'client', NULL, NULL, NULL, '2014-09-04 16:43:16', '2014-09-04 16:43:16'),
(46, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:51:23', '2014-09-04 18:51:23'),
(47, 'sadfsdf', 'asdfasdf@gmail.com', NULL, NULL, '23234234234', 'dsfasdfsfs', NULL, NULL, 'client', NULL, 'sadfasdfas', 'dfsadfsadf', '2014-09-04 18:52:33', '2014-09-04 18:52:33'),
(48, 'aaa', 'aa@gmail.com', NULL, NULL, '1212121212', 'aaaaaaa', NULL, NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:53:54', '2014-09-04 18:53:54'),
(49, 'aaa', 'aa@gmail.com', NULL, NULL, '1212121212', 'aaaaaaa', NULL, NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:57:04', '2014-09-04 18:57:04'),
(40, 'abc', 'abc@gmail.com', NULL, NULL, '1212121212', 'abcdef', 'my business', 'ar, crm, virtualtour', 'client', NULL, NULL, NULL, '2014-09-04 18:57:45', '2014-09-04 18:57:45');

INSERT INTO `User` (`id`, `name`, `email`, `authName`, `authPassword`, `contact`, `company`, `businessType`, `interested`, `role`, `startDate`, `message`, `budget`, `createdAt`, `updatedAt`) VALUES
(53, 'Jacky Lee Yee Chuan', NULL, 'jacky', 'jacky', NULL, NULL, NULL, NULL, 'admin', NULL, NULL, NULL, '2014-09-04 16:43:12', '2014-09-04 16:43:12'),
(54, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'client', NULL, NULL, NULL, '2014-09-04 16:43:15', '2014-09-04 16:43:15'),
(55, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'client', NULL, NULL, NULL, '2014-09-04 16:43:16', '2014-09-04 16:43:16'),
(56, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:51:23', '2014-09-04 18:51:23'),
(57, 'sadfsdf', 'asdfasdf@gmail.com', NULL, NULL, '23234234234', 'dsfasdfsfs', NULL, NULL, 'client', NULL, 'sadfasdfas', 'dfsadfsadf', '2014-09-04 18:52:33', '2014-09-04 18:52:33'),
(58, 'aaa', 'aa@gmail.com', NULL, NULL, '1212121212', 'aaaaaaa', NULL, NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:53:54', '2014-09-04 18:53:54'),
(59, 'aaa', 'aa@gmail.com', NULL, NULL, '1212121212', 'aaaaaaa', NULL, NULL, 'client', NULL, NULL, NULL, '2014-09-04 18:57:04', '2014-09-04 18:57:04'),
(50, 'abc', 'abc@gmail.com', NULL, NULL, '1212121212', 'abcdef', 'my business', 'ar, crm, virtualtour', 'client', NULL, NULL, NULL, '2014-09-04 18:57:45', '2014-09-04 18:57:45');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
