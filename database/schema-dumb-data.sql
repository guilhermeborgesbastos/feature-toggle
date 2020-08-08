USE feature_toggle;

-- INSERT DUMB DATA

LOCK TABLES 'customer' WRITE;
INSERT INTO 'customer' VALUES (1,'Swisscom AG','2020-06-14 18:10:10');
LOCK TABLES 'customer' WRITE;

LOCK TABLES 'feature_toggle' WRITE;
INSERT INTO 'feature_toggle' VALUES (1,'Reticulate Splines','reticulateSplines',NULL,_binary 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',0,'2020-06-14 18:54:17');
LOCK TABLES 'feature_toggle' WRITE;

LOCK TABLES 'customer_feature_toggle' WRITE;
INSERT INTO 'customer_feature_toggle' VALUES (1,1,1);
UNLOCK TABLES;

-- USER'S ROLES
LOCK TABLES 'role' WRITE;
INSERT INTO 'role' VALUES (1, 'SUPER_ADMIN');
INSERT INTO 'role' VALUES (2, 'PRODUCT_OWNER');
INSERT INTO 'role' VALUES (3, 'CLIENT');
UNLOCK TABLES;

-- USERS
LOCK TABLES 'user' WRITE;
INSERT INTO 'user' VALUES (1,1,'Guilherme Borges Bastos','guilhermeborgesbastos@gmail.com','$2a$10$9hh1GmPIBxrWN7YcrFaU2OLDRz5V0AZd7J9X/uSMSXtoNqBLWWcEW','1','2020-07-07 14:02:39'),
(2,2,'Johnathan Lysic','johnathan.lysic@gmail.com','$2a$10$MTzG5S7yF1xxDpRyy0YCreeS0o8Y.GM087nM0hRDeW2lTUw34VkYi','0','2020-07-07 18:38:01'),
(3,1,'John Marrie','john.marrie@gmail.com','$2a$10$vyZfow4AKikwcyKGsFX/KOaR/9k4jzV8EwZt99s2Dvbqa1MFPQ2Ui','0','2020-07-07 18:41:58'),
(5,1,'Camilla Helena Borges','camillaborgeshelena@gmail.com','$2a$10$SSgaz2NjtH7z45d6ovVSZejDgV3IZFMmodHtZF6wriSwrI/JbrHt2','0','2020-07-10 19:23:04'),
(6,3,'Amazon Client','client@amazon.com','$2a$10$kI6MrtFxx8xK.1TYpx8I/unebZok.SbXzjpjJdAxtxwSnxcb2fV6i','1','2020-07-24 13:58:27'),
(8,2,'Demo Product Owner','product.owner@gmail.com','$2a$10$2OXGM6PGYWMGch4MvxifuOqcwBDyjika3ieDoTg6fwAFzAIWFM.Wm','1','2020-08-07 14:29:04');
UNLOCK TABLES; 