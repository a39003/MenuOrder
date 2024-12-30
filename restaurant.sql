-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th12 30, 2024 lúc 09:58 AM
-- Phiên bản máy phục vụ: 10.4.27-MariaDB
-- Phiên bản PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `restaurant`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bills`
--

CREATE TABLE `bills` (
  `bill_id` bigint(20) NOT NULL,
  `bill_date_time` datetime DEFAULT NULL,
  `status` smallint(6) DEFAULT NULL,
  `total_amount` bigint(20) DEFAULT NULL,
  `order_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `bills`
--

INSERT INTO `bills` (`bill_id`, `bill_date_time`, `status`, `total_amount`, `order_id`) VALUES
(160, '2024-12-27 17:16:14', NULL, 60000, 114),
(161, '2024-12-29 01:18:28', NULL, 30000, 115),
(162, '2024-12-29 01:31:29', NULL, 30000, 116),
(163, '2024-12-29 02:07:45', NULL, 50000, 117),
(164, '2024-12-29 09:20:33', NULL, 50000, 118),
(165, '2024-12-29 09:35:15', NULL, 50000, 120),
(166, '2024-12-29 09:37:35', NULL, 50000, 119),
(167, '2024-12-29 10:13:18', NULL, 60000, 121),
(168, '2024-12-29 10:34:47', NULL, 180000, 122);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bill_items`
--

CREATE TABLE `bill_items` (
  `bill_item_id` bigint(20) NOT NULL,
  `bill_item_name` varchar(255) DEFAULT NULL,
  `bill_item_price` int(11) DEFAULT NULL,
  `bill_item_quantity` int(11) DEFAULT NULL,
  `bill_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `bill_items`
--

INSERT INTO `bill_items` (`bill_item_id`, `bill_item_name`, `bill_item_price`, `bill_item_quantity`, `bill_id`) VALUES
(243, 'Salad', 30000, 1, 160),
(244, 'vịt nướng', 30000, 1, 160),
(245, 'Salad', 30000, 1, 161),
(246, 'Salad', 30000, 1, 162),
(247, 'Salad', 30000, 1, 163),
(248, 'Cam', 20000, 1, 163),
(249, 'Salad', 30000, 1, 164),
(250, 'Cam', 20000, 1, 164),
(251, 'Salad', 30000, 1, 165),
(252, 'Cam', 20000, 1, 165),
(253, 'Salad', 30000, 1, 166),
(254, 'Cam', 20000, 1, 166),
(255, 'Salad', 30000, 2, 167),
(256, 'Salad', 30000, 1, 168),
(257, 'Cá nướng than', 150000, 1, 168);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dishes`
--

CREATE TABLE `dishes` (
  `dish_id` bigint(20) NOT NULL,
  `dish_name` varchar(255) DEFAULT NULL,
  `dish_price` int(11) DEFAULT NULL,
  `dish_status` smallint(6) DEFAULT NULL,
  `status` smallint(6) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `menu_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `dishes`
--

INSERT INTO `dishes` (`dish_id`, `dish_name`, `dish_price`, `dish_status`, `status`, `thumbnail`, `menu_id`) VALUES
(3, 'Thịt lợn', 50000, 0, 0, 'http://res.cloudinary.com/dj2lvmrop/image/upload/v1732780555/hustaurant/thumbnails/A.png.png', 1),
(5, 'Thịt lợn', 50000, 1, 0, 'http://res.cloudinary.com/dj2lvmrop/image/upload/v1732780555/hustaurant/thumbnails/A.png.png', 3),
(14, 'cam', 5000, 1, 0, 'http://res.cloudinary.com/dj2lvmrop/image/upload/v1734946493/hustaurant/thumbnails/cong-dung-qua-cam.jpg.jpg', 2),
(17, 'Món chính', 120000, 1, 1, 'http://res.cloudinary.com/dj2lvmrop/image/upload/v1734948406/hustaurant/thumbnails/bap_xap_tom_bo_400.jpg.jpg', 5),
(18, 'Coca', 10000, 1, 1, 'http://res.cloudinary.com/dj2lvmrop/image/upload/v1734947904/hustaurant/thumbnails/COCA-CHAI-NHUA-390ML.jpg.jpg', 3),
(20, 'Nước cam', 50000, 1, 1, 'http://res.cloudinary.com/dj2lvmrop/image/upload/v1734947968/hustaurant/thumbnails/Nuoc-cam-ep.jpg.jpg', 3),
(21, 'Gà nướng', 200000, 1, 1, 'http://res.cloudinary.com/dj2lvmrop/image/upload/v1734948212/hustaurant/thumbnails/images%20%281%29.jpg.jpg', 5),
(22, 'Gà xào xả ớt', 150000, 1, 1, 'http://res.cloudinary.com/dj2lvmrop/image/upload/v1735051903/hustaurant/thumbnails/unnamed.jpg.jpg', 5),
(23, 'Cá nướng than', 150000, 1, 1, 'http://res.cloudinary.com/dj2lvmrop/image/upload/v1734948155/hustaurant/thumbnails/ca-bap-ne-1375179038-1375180173.jpg.jpg', 2),
(24, 'Salad', 30000, 1, 1, 'http://res.cloudinary.com/dj2lvmrop/image/upload/v1734948315/hustaurant/thumbnails/saladrauqua-1635240739-5476-1635240778.jpg.jpg', 1),
(26, 'Thịt nướng', 100000, 1, 1, 'http://res.cloudinary.com/dj2lvmrop/image/upload/v1735223801/hustaurant/thumbnails/cach-uop-thit-nuong.jpg.jpg', 5),
(27, 'Ngô xào', 50000, 0, 1, 'http://res.cloudinary.com/dj2lvmrop/image/upload/v1734948406/hustaurant/thumbnails/bap_xap_tom_bo_400.jpg.jpg', 2),
(28, 'Tôm chua cay', 200000, 1, 1, 'http://res.cloudinary.com/dj2lvmrop/image/upload/v1732966951/hustaurant/thumbnails/chup-anh-mon-an-4.jpeg.jpg', 5),
(29, 'Cam', 20000, 1, 1, 'http://res.cloudinary.com/dj2lvmrop/image/upload/v1734946493/hustaurant/thumbnails/cong-dung-qua-cam.jpg.jpg', 1),
(31, 'vịt ', 1231422, 1, 0, 'http://res.cloudinary.com/dj2lvmrop/image/upload/v1734947904/hustaurant/thumbnails/COCA-CHAI-NHUA-390ML.jpg.jpg', 5),
(32, 'Bò bít tết', 300000, 1, 0, 'http://res.cloudinary.com/dj2lvmrop/image/upload/v1735223497/hustaurant/thumbnails/bo-bit-tet.jpg.jpg', 5);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `menus`
--

CREATE TABLE `menus` (
  `menu_id` bigint(20) NOT NULL,
  `menu_title` varchar(255) DEFAULT NULL,
  `status` smallint(6) DEFAULT NULL,
  `menu_description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `menus`
--

INSERT INTO `menus` (`menu_id`, `menu_title`, `status`, `menu_description`) VALUES
(1, 'Đồ ăn vặt', 1, 'những món ăn vặt như bắp rang,...'),
(2, 'Món tráng miệng', 1, 'hoa quả'),
(3, 'Đồ uống ', 1, 'rượu, nước ngọt,...'),
(5, 'Món chính ', 1, 'cá nướng, gà nướng, ....');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` bigint(20) NOT NULL,
  `notification_time` datetime DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL,
  `table_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`notification_id`, `notification_time`, `text`, `table_id`) VALUES
(246, '2024-12-27 17:15:05', 'Khách ở bàn 1 đang order.', NULL),
(247, '2024-12-27 17:15:36', 'Khách ở bàn 1 đã đặt món.', NULL),
(248, '2024-12-27 17:15:55', 'Khách ở bàn Bàn 1 đang yêu cầu hỗ trợ cho món Salad.', NULL),
(249, '2024-12-27 17:15:55', 'Khách ở bàn Bàn 1 đang yêu cầu hỗ trợ cho món vịt nướng.', NULL),
(250, '2024-12-27 17:16:08', 'Khách ở bàn Bàn 1 đang yêu cầu thanh toán', NULL),
(255, '2024-12-29 01:18:21', 'Khách ở bàn Bàn 2 đang yêu cầu thanh toán', NULL),
(259, '2024-12-29 01:31:27', 'Khách ở bàn Bàn 1 đang yêu cầu thanh toán', NULL),
(265, '2024-12-29 02:07:23', 'Khách ở bàn Bàn 1 đang yêu cầu hỗ trợ cho món Cam.', NULL),
(266, '2024-12-29 02:07:40', 'Khách ở bàn Bàn 1 đang yêu cầu thanh toán', NULL),
(267, '2024-12-29 09:10:40', 'Khách ở bàn 2 đang order.', NULL),
(268, '2024-12-29 09:19:46', 'Khách ở bàn 2 đang order.', NULL),
(269, '2024-12-29 09:20:19', 'Khách ở bàn 2 đã đặt món.', NULL),
(270, '2024-12-29 09:20:30', 'Khách ở bàn Bàn 2 đang yêu cầu thanh toán', NULL),
(271, '2024-12-29 09:30:10', 'Khách ở bàn 1 đang order.', NULL),
(274, '2024-12-29 09:35:10', 'Khách ở bàn Bàn 2 đang yêu cầu thanh toán', NULL),
(275, '2024-12-29 09:37:03', 'Khách ở bàn 1 đã đặt món.', NULL),
(276, '2024-12-29 09:37:28', 'Khách ở bàn Bàn 1 đang yêu cầu thanh toán', NULL),
(277, '2024-12-29 09:51:24', 'Khách ở bàn 1 đang order.', NULL),
(278, '2024-12-29 09:52:00', 'Khách ở bàn 1 đang order.', NULL),
(279, '2024-12-29 10:12:57', 'Khách ở bàn 1 đã đặt món.', NULL),
(280, '2024-12-29 10:13:00', 'Khách ở bàn Bàn 1 đang yêu cầu thanh toán', NULL),
(281, '2024-12-29 10:32:27', 'Khách ở bàn 1 đang order.', NULL),
(282, '2024-12-29 10:33:31', 'Khách ở bàn 1 đã đặt món.', NULL),
(283, '2024-12-29 10:34:06', 'Khách ở bàn Bàn 1 đang yêu cầu hỗ trợ cho món Salad.', NULL),
(284, '2024-12-29 10:34:36', 'Khách ở bàn Bàn 1 đang yêu cầu thanh toán', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `order_id` bigint(20) NOT NULL,
  `order_status` varchar(255) DEFAULT NULL,
  `order_time` datetime DEFAULT NULL,
  `status` smallint(6) DEFAULT NULL,
  `table_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`order_id`, `order_status`, `order_time`, `status`, `table_id`) VALUES
(114, 'Đã thanh toán', '2024-12-27 17:15:36', 1, 1),
(115, 'Đã thanh toán', '2024-12-29 01:18:07', 1, 2),
(116, 'Đã thanh toán', '2024-12-29 01:30:44', 1, 1),
(117, 'Đã thanh toán', '2024-12-29 02:06:32', 1, 1),
(118, 'Đã thanh toán', '2024-12-29 09:20:19', 1, 2),
(119, 'Đã thanh toán', '2024-12-29 09:37:03', 1, 1),
(120, 'Đã thanh toán', '2024-12-29 09:34:48', 1, 2),
(121, 'Đã thanh toán', '2024-12-29 10:12:57', 1, 1),
(122, 'Đã thanh toán', '2024-12-29 10:33:31', 1, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` bigint(20) NOT NULL,
  `custom_price` int(11) DEFAULT NULL,
  `dish_note` varchar(255) DEFAULT NULL,
  `dish_quantity` int(11) DEFAULT NULL,
  `dish_status` varchar(255) DEFAULT NULL,
  `status` smallint(6) DEFAULT NULL,
  `dish_id` bigint(20) DEFAULT NULL,
  `order_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `custom_price`, `dish_note`, `dish_quantity`, `dish_status`, `status`, `dish_id`, `order_id`) VALUES
(224, 0, '', 1, 'Đã ra món', NULL, 24, 114),
(225, 0, 'cho ít cay', 1, 'Đã ra món', NULL, 17, 114),
(226, 0, '', 1, 'Đã ra món', NULL, 24, 115),
(227, 0, '', 1, 'Đã ra món', NULL, 24, 116),
(228, 0, 'Tuyệt vời ông mặt trời', 1, 'Đã ra món', NULL, 24, 117),
(229, 0, '', 1, 'Đã ra món', NULL, 29, 117),
(230, 0, '', 1, 'Đã ra món', NULL, 24, 118),
(231, 0, '', 1, 'Đã ra món', NULL, 29, 118),
(232, 0, '', 1, 'Đã ra món', NULL, 24, 120),
(233, 0, '', 1, 'Đã ra món', NULL, 29, 120),
(234, 0, '', 1, 'Đã ra món', NULL, 24, 119),
(235, 0, '', 1, 'Đã ra món', NULL, 29, 119),
(236, 0, '', 1, 'Đã ra món', NULL, 24, 121),
(237, 0, '', 1, 'Đã ra món', NULL, 24, 121),
(238, 0, 'không rau', 1, 'Đã ra món', NULL, 24, 122),
(239, 0, '', 1, 'Đã ra món', NULL, 23, 122);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `tables`
--

CREATE TABLE `tables` (
  `table_id` bigint(20) NOT NULL,
  `start_ordering_time` datetime DEFAULT NULL,
  `status` smallint(6) DEFAULT NULL,
  `table_name` varchar(255) DEFAULT NULL,
  `table_status` varchar(255) DEFAULT NULL,
  `table_description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `tables`
--

INSERT INTO `tables` (`table_id`, `start_ordering_time`, `status`, `table_name`, `table_status`, `table_description`) VALUES
(1, NULL, 1, 'Bàn 1', 'Đang trống', 'tầng 2'),
(2, NULL, 1, 'Bàn 2', 'Đang trống', 'tầng 3'),
(3, NULL, 1, 'Bàn 3', 'Đang trống', 'tầng 4'),
(4, NULL, 1, 'Bàn 4', 'Đang trống', 'tầng 4'),
(5, NULL, 1, 'Bàn 5', 'Đang trống', 'tầng 3'),
(6, NULL, 1, 'Bàn 6', 'Đang trống', 'tầng 2'),
(7, NULL, 1, 'Bàn 7', 'Đang trống', 'Tầng 2'),
(49, NULL, 1, 'Bàn 8', 'Đang trống', 'tầng 3'),
(50, NULL, 0, 'Bàn 11', 'Đang trống', 'tầng 3');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `user_id` bigint(20) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `password`, `role`, `username`) VALUES
(1, '$2a$10$hfL8laDL4wCjaZOPEDlvpO32VAcwGkqzPUfGu9z0FIiaKwjiiJISO', 'ADMIN', 'admin@gmail.com');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `bills`
--
ALTER TABLE `bills`
  ADD PRIMARY KEY (`bill_id`),
  ADD KEY `FK2s1iwv6bgsmh8u9awhdd1aela` (`order_id`);

--
-- Chỉ mục cho bảng `bill_items`
--
ALTER TABLE `bill_items`
  ADD PRIMARY KEY (`bill_item_id`),
  ADD KEY `FKj9o7g8krc56gf6t6f0sy4ic5p` (`bill_id`);

--
-- Chỉ mục cho bảng `dishes`
--
ALTER TABLE `dishes`
  ADD PRIMARY KEY (`dish_id`),
  ADD KEY `FKpcwepst3fw5exfggpsm1is56d` (`menu_id`);

--
-- Chỉ mục cho bảng `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`menu_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `FKnk6esbr041s5yqy0uxmm4jcub` (`table_id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `FKrkhrp1dape261t3x3spj7l5ny` (`table_id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `FKn06bdypik73hotpxvefsrtn77` (`dish_id`),
  ADD KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`);

--
-- Chỉ mục cho bảng `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`table_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `bills`
--
ALTER TABLE `bills`
  MODIFY `bill_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=169;

--
-- AUTO_INCREMENT cho bảng `bill_items`
--
ALTER TABLE `bill_items`
  MODIFY `bill_item_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=258;

--
-- AUTO_INCREMENT cho bảng `dishes`
--
ALTER TABLE `dishes`
  MODIFY `dish_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT cho bảng `menus`
--
ALTER TABLE `menus`
  MODIFY `menu_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=285;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=240;

--
-- AUTO_INCREMENT cho bảng `tables`
--
ALTER TABLE `tables`
  MODIFY `table_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bills`
--
ALTER TABLE `bills`
  ADD CONSTRAINT `FK2s1iwv6bgsmh8u9awhdd1aela` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);

--
-- Các ràng buộc cho bảng `bill_items`
--
ALTER TABLE `bill_items`
  ADD CONSTRAINT `FKj9o7g8krc56gf6t6f0sy4ic5p` FOREIGN KEY (`bill_id`) REFERENCES `bills` (`bill_id`);

--
-- Các ràng buộc cho bảng `dishes`
--
ALTER TABLE `dishes`
  ADD CONSTRAINT `FKpcwepst3fw5exfggpsm1is56d` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`menu_id`);

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `FKnk6esbr041s5yqy0uxmm4jcub` FOREIGN KEY (`table_id`) REFERENCES `tables` (`table_id`);

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `FKrkhrp1dape261t3x3spj7l5ny` FOREIGN KEY (`table_id`) REFERENCES `tables` (`table_id`);

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `FKn06bdypik73hotpxvefsrtn77` FOREIGN KEY (`dish_id`) REFERENCES `dishes` (`dish_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
