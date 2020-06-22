USE feature_toggle;

-- INSERT DUMB DATA
INSERT INTO customer VALUES (1,'Guilherme Borges Bastos','2020-06-14 18:10:10');
INSERT INTO feature_toggle VALUES (1,'Reticulate Splines','reticulateSplines',NULL,_binary 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',0,'2020-06-14 18:54:17');
INSERT INTO customer_feature_toggle VALUES (1,1,1);
-- USER'S ROLES
INSERT INTO role VALUES (1, 'SUPER_ADMIN');
INSERT INTO role VALUES (2, 'PRODUCT_OWNER');