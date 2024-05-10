-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 10, 2024 at 08:21 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `facebook`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `pID` int(11) DEFAULT NULL,
  `uID` int(11) DEFAULT NULL,
  `commentID` int(11) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`pID`, `uID`, `commentID`, `comment`) VALUES
(1, 1, 1, 'Hello'),
(1, 1, 1, 'How are You ?'),
(2, 1, 1, 'Goku'),
(1, 1, 1, 'Hello'),
(1, 3, 1, 'Nice Car'),
(1, 3, 1, 'Lambo'),
(1, 3, 1, 'Nice color'),
(1, 3, 1, 'Nice Ride!\n');

-- --------------------------------------------------------

--
-- Table structure for table `likecounts`
--

CREATE TABLE `likecounts` (
  `pID` int(11) DEFAULT NULL,
  `uID` int(11) DEFAULT NULL,
  `likeID` int(11) DEFAULT NULL,
  `likeCount` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `likecounts`
--

INSERT INTO `likecounts` (`pID`, `uID`, `likeID`, `likeCount`) VALUES
(2, 3, 2, 1),
(4, 1, 1, 1),
(5, 1, 1, 1),
(3, 1, 1, 1),
(2, 1, 1, 1),
(2, 2, 1, 1),
(3, 2, 1, 1),
(1, 1, 4, 2),
(3, 1, 4, 2),
(4, 1, 4, 2),
(5, 1, 4, 2),
(2, 1, 4, 2),
(1, 3, 4, 1),
(2, 3, 1, 2),
(1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `pID` int(11) NOT NULL,
  `uID` int(11) DEFAULT NULL,
  `postURL` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`pID`, `uID`, `postURL`) VALUES
(1, 1, 'https://res.cloudinary.com/dm39cq43w/image/upload/v1714371718/uploads/u9k8x3afgifzbzsplcm4.png'),
(2, 1, 'https://res.cloudinary.com/dm39cq43w/image/upload/v1714371767/uploads/lqw2cndotd0ibvsjjcse.avif'),
(3, 1, 'https://res.cloudinary.com/dm39cq43w/image/upload/v1714373113/uploads/ejpvrudsyewenkfv3ple.jpg'),
(4, 1, 'https://res.cloudinary.com/dm39cq43w/image/upload/v1714374714/uploads/lujv73mhamtohe967aaj.avif'),
(5, 1, 'https://res.cloudinary.com/dm39cq43w/image/upload/v1714376347/uploads/j2yiztqlpfrvhfq8wxbl.webp'),
(6, 2, 'https://res.cloudinary.com/dm39cq43w/image/upload/v1714541771/uploads/vz2a12wyfzyxfoczblsr.jpg'),
(7, 2, 'https://res.cloudinary.com/dm39cq43w/image/upload/v1714541784/uploads/cfbsekbryxajbvfswqzx.jpg'),
(8, 2, 'https://res.cloudinary.com/dm39cq43w/image/upload/v1714541793/uploads/ygn8sliqojou6bxk2krq.jpg'),
(9, 3, 'https://res.cloudinary.com/dm39cq43w/image/upload/v1714554907/uploads/g6zldnoimbbxn6safnxu.jpg'),
(10, 3, 'https://res.cloudinary.com/dm39cq43w/image/upload/v1714554927/uploads/ppx2d9kbrdayzmc4ysll.avif');

-- --------------------------------------------------------

--
-- Table structure for table `profilephoto`
--

CREATE TABLE `profilephoto` (
  `uID` int(11) NOT NULL,
  `photoUrl` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `profilephoto`
--

INSERT INTO `profilephoto` (`uID`, `photoUrl`) VALUES
(1, 'https://res.cloudinary.com/dm39cq43w/image/upload/v1714365523/uploads/uzvynmnrorcfujx3zgrd.png'),
(2, 'https://res.cloudinary.com/dm39cq43w/image/upload/v1714541284/uploads/ppxzfkgbquhhiory5sok.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uID` int(11) NOT NULL,
  `fname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `day` int(11) DEFAULT NULL,
  `month` varchar(255) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uID`, `fname`, `lname`, `email`, `password`, `day`, `month`, `year`, `gender`) VALUES
(1, 'ojasvi', 'jain', 'ojasvijainfeb4@gmail.com', 'ojasvi', 4, '02', 2003, 'male'),
(2, 'Sarika', 'Jain', 'jaindrsarika@gmail.com', 'sarika', 3, '10', 1973, 'female'),
(3, 'Chandan', 'Prajapati', 'chandan@gmail.com', 'chandan', 15, '09', 2001, 'male'),
(4, 'Pratyush', 'Agg.', 'pa@gmail.com', 'pratyush', 1, '01', 2003, 'male');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`pID`);

--
-- Indexes for table `profilephoto`
--
ALTER TABLE `profilephoto`
  ADD PRIMARY KEY (`uID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uID`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `pID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
