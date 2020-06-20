DROP DATABASE IF EXISTS feature_toggle;
CREATE DATABASE feature_toggle;

USE feature_toggle;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

##########################
### DROP/CREATE TABELS ###
##########################

CREATE TABLE role (
	id INTEGER(11) 		AUTO_INCREMENT PRIMARY KEY,
	title VARCHAR(40) 	NOT NULL
) ENGINE=INNODB;

DROP TABLE IF EXISTS `user`;
CREATE TABLE user (
	`id` INTEGER(11) 			AUTO_INCREMENT PRIMARY KEY,
	`role_id` INTEGER(11) 	NOT NULL,
	`name` VARCHAR(60) 		NOT NULL,
    `email` VARCHAR(70) 		NOT NULL UNIQUE,
    `password` VARCHAR(255)  	NOT NULL,
    `status` CHAR(1) 			NOT NULL DEFAULT '0', /* 0 === disabled */
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_role
    FOREIGN KEY (role_id) 
		REFERENCES role(id)
		ON UPDATE CASCADE
) ENGINE=INNODB;

DROP TABLE IF EXISTS `user_password_history`;
CREATE TABLE user_password_history (
	`id` INTEGER(11) 		AUTO_INCREMENT PRIMARY KEY,
    `user_id` INTEGER(11) 	NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP 	DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_password_history_user
    FOREIGN KEY (user_id) 
        REFERENCES user(id)
        ON UPDATE CASCADE
) ENGINE=INNODB;

DROP TABLE IF EXISTS `customer`;
CREATE TABLE `customer` (
  `id` int(11)			AUTO_INCREMENT,
  `name` VARCHAR(60) 	NOT NULL,
  `created_at` 			DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `feature_toggle`;
CREATE TABLE `feature_toggle` (
  `id` INT(11) 		AUTO_INCREMENT,
  `display_name` 	VARCHAR(120) DEFAULT NULL,
  `technical_name` 	VARCHAR(120) NOT NULL,
  `expires_on` 		DATETIME NULL,
  `description` 	BLOB NULL,
  `inverted` 		TINYINT(1) NOT NULL DEFAULT '0', /* 0 === false */
  `created_at` 		DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `customer_feature_toggle`;
CREATE TABLE `customer_feature_toggle` (
  `customer_id` INT(11) 		NOT NULL,
  `feature_toggle_id` INT(11) 	NOT NULL,
  `status` TINYINT(1) 			NOT NULL DEFAULT '1', /* 0 === ENABLED */
  KEY `fk_customer_id` (`customer_id`),
  KEY `fk_feature_toggle_id` (`feature_toggle_id`),
  CONSTRAINT `fk_customer_id` 
	FOREIGN KEY (`customer_id`) REFERENCES `customer` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_feature_toggle_id` 
	FOREIGN KEY (`feature_toggle_id`) REFERENCES `feature_toggle` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `compound_key`
  PRIMARY KEY (`customer_id`, `feature_toggle_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

################################
### DROP/CREATE OAUTH TABELS ###
################################

DROP TABLE IF EXISTS `oauth_access_token`;
CREATE TABLE `oauth_access_token` (
  `authentication_id` VARCHAR(255) 	NOT NULL,
  `token_id` VARCHAR(255) 			NOT NULL,
  `token` BLOB 						NOT NULL,
  `user_name` VARCHAR(255) 			NOT NULL,
  `client_id` VARCHAR(255) 			NOT NULL,
  `authentication` BLOB 			NOT NULL,
  `refresh_token` VARCHAR(255) 		NOT NULL,
  PRIMARY KEY (`authentication_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `oauth_refresh_token`;
CREATE TABLE `oauth_refresh_token` (
  `token_id` varchar(255) NOT NULL,
  `token` BLOB NOT NULL,
  `authentication` BLOB NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;