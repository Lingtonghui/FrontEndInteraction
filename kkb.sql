/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50726
Source Host           : localhost:3306
Source Database       : kkb

Target Server Type    : MYSQL
Target Server Version : 50726
File Encoding         : 65001

Date: 2020-11-25 20:26:26
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `attachments`
-- ----------------------------
DROP TABLE IF EXISTS `attachments`;
CREATE TABLE `attachments` (
  `id` int(255) unsigned NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `size` int(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of attachments
-- ----------------------------
INSERT INTO `attachments` VALUES ('1', 'upload_943a8732009dce31caa2695c51386d7a.jpg', 'image/jpeg', '37580');
INSERT INTO `attachments` VALUES ('2', 'upload_818630f07458b87cb39ed45df3594b0c.jpg', 'image/jpeg', '37580');
INSERT INTO `attachments` VALUES ('3', 'upload_9e48266d9ae4a31323915d2c9a74e6e7.jpg', 'image/jpeg', '37580');
INSERT INTO `attachments` VALUES ('4', 'upload_a8015604b5d01ea359c1a2c6b2429226.jpg', 'image/jpeg', '37580');
INSERT INTO `attachments` VALUES ('5', 'upload_894be5399854fb66f06e1188b5b62959.jpg', 'image/jpeg', '19258');
INSERT INTO `attachments` VALUES ('9', 'upload_d0402c369eb06be7dda4b9df2d949404.jpg', 'image/jpeg', '29724');
INSERT INTO `attachments` VALUES ('10', 'upload_37a8da62abf51d37f669f9dc1d205020.jpg', 'image/jpeg', '19258');

-- ----------------------------
-- Table structure for `categories`
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `name` varchar(255) DEFAULT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of categories
-- ----------------------------
INSERT INTO `categories` VALUES ('手机', '1');
INSERT INTO `categories` VALUES ('笔记本', '2');
INSERT INTO `categories` VALUES ('电视机', '3');

-- ----------------------------
-- Table structure for `items`
-- ----------------------------
DROP TABLE IF EXISTS `items`;
CREATE TABLE `items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL DEFAULT '0',
  `cover` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of items
-- ----------------------------
INSERT INTO `items` VALUES ('8', '1', '测试数据3', '99', 'upload_dc70c03c646532522e16aaaeaa4e5bbf.jpg');
INSERT INTO `items` VALUES ('9', '1', '测试数据4', '999', 'upload_2e5a7b73800331b8c318b98b179dc28d.jpg');
INSERT INTO `items` VALUES ('6', '1', '测试数据1', '1', 'upload_9ed2c3d065aee76b553efe616e36dd8c.jpg');
INSERT INTO `items` VALUES ('7', '2', '测试数据2', '999', 'upload_a11e95764a2976c791a00bbb8849a39d.jpg');

-- ----------------------------
-- Table structure for `photos`
-- ----------------------------
DROP TABLE IF EXISTS `photos`;
CREATE TABLE `photos` (
  `id` int(255) unsigned NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `size` int(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of photos
-- ----------------------------
INSERT INTO `photos` VALUES ('10', 'static\\upload\\upload_29eb343c59db516f9402a5ec0dea58bf.jpg', 'image/jpeg', '26644');
INSERT INTO `photos` VALUES ('11', 'static\\upload\\upload_9411e1803e6b0d3edb17b4ae59fb2052.jpg', 'image/jpeg', '19258');
INSERT INTO `photos` VALUES ('12', 'static\\upload\\upload_924743c0e9d7229d2e21b1b67381963f.jpg', 'image/jpeg', '37580');
INSERT INTO `photos` VALUES ('13', 'static\\upload\\upload_19837c266cfd8640afb375c8eaa65598.jpg', 'image/jpeg', '16927');
INSERT INTO `photos` VALUES ('14', 'static\\upload\\upload_e1cfe1d67e6995740fd4dffa5e3cee11.jpg', 'image/jpeg', '41442');
INSERT INTO `photos` VALUES ('15', 'static\\upload\\upload_a706d7e18ab827f5ef8c5907c7ced319.jpg', 'image/jpeg', '20172');
INSERT INTO `photos` VALUES ('16', 'static\\upload\\upload_5d8dfb46810dbd2c23fe12e154885fc5.jpg', 'image/jpeg', '48912');
INSERT INTO `photos` VALUES ('17', 'static\\upload\\upload_4abba7e45d49b1ba5a17e31a217f68a1.jpg', 'image/jpeg', '12856');
INSERT INTO `photos` VALUES ('18', 'static\\upload\\upload_967c594b84a5319c5a5806f4d6b47c50.jpg', 'image/jpeg', '16927');
INSERT INTO `photos` VALUES ('19', 'static\\upload\\upload_7e037cb5862e72fbcad0e5711074a4c6.jpg', 'image/jpeg', '37580');
INSERT INTO `photos` VALUES ('20', 'static\\upload\\upload_93ebca4dacef8788903d0df8fcf93826.jpg', 'image/jpeg', '19258');

-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(255) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(999) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'adminone', 'a');
INSERT INTO `users` VALUES ('2', 'adminnoe3', 'a');
