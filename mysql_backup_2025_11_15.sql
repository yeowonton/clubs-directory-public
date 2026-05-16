-- Clubs DB backup
-- Generated at 2025-11-16T01:27:03.502Z

DROP TABLE IF EXISTS `club_categories`;
CREATE TABLE `club_categories` (
  `club_id` int NOT NULL,
  `category` varchar(50) NOT NULL,
  PRIMARY KEY (`club_id`,`category`),
  CONSTRAINT `fk_cc_club` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `club_categories` (`club_id`, `category`) VALUES (7, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (7, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (7, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (9, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (9, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (9, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (11, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (11, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (11, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (11, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (11, 'research');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (12, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (13, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (13, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (13, 'research');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (14, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (14, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (15, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (15, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (16, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (16, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (17, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (18, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (18, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (18, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (18, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (19, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (19, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (20, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (20, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (20, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (21, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (22, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (22, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (23, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (23, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (23, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (23, 'research');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (24, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (25, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (25, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (26, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (26, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (26, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (27, 'research');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (29, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (30, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (30, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (31, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (31, 'research');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (32, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (32, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (33, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (33, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (34, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (34, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (35, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (35, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (36, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (36, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (36, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (37, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (38, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (38, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (38, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (41, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (41, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (42, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (42, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (42, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (43, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (45, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (45, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (46, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (46, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (47, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (47, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (47, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (47, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (48, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (52, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (52, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (53, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (53, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (53, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (53, 'research');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (54, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (55, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (55, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (55, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (56, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (56, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (56, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (58, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (59, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (60, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (60, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (62, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (62, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (63, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (63, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (63, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (64, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (65, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (65, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (65, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (65, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (65, 'research');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (66, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (66, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (66, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (67, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (67, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (69, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (70, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (70, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (70, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (71, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (71, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (72, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (72, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (73, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (73, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (73, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (73, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (74, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (74, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (74, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (74, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (74, 'research');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (75, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (76, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (77, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (77, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (78, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (79, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (80, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (81, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (81, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (81, 'research');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (82, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (82, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (83, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (83, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (83, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (83, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (83, 'research');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (84, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (84, 'research');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (85, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (85, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (86, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (86, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (87, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (88, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (88, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (89, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (89, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (90, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (90, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (91, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (91, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (92, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (93, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (94, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (94, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (95, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (95, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (95, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (96, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (96, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (96, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (98, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (98, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (99, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (99, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (100, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (100, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (101, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (101, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (101, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (102, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (102, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (103, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (104, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (105, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (106, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (106, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (107, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (107, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (108, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (108, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (108, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (110, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (110, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (111, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (111, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (111, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (112, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (112, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (113, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (114, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (114, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (114, 'research');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (115, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (115, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (115, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (115, 'research');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (116, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (116, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (117, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (117, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (118, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (118, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (118, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (119, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (119, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (119, 'research');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (120, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (120, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (122, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (122, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (123, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (126, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (126, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (126, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (126, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (126, 'research');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (127, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (129, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (130, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (130, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (130, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (131, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (132, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (132, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (132, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (133, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (134, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (135, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (135, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (136, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (136, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (137, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (137, 'advocacy');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (137, 'community');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (138, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (138, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (139, 'activity');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (139, 'competition');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (139, 'outreach');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (139, 'research');
INSERT INTO `club_categories` (`club_id`, `category`) VALUES (142, 'activity');

DROP TABLE IF EXISTS `club_fields`;
CREATE TABLE `club_fields` (
  `club_id` int NOT NULL,
  `field_label` varchar(100) NOT NULL,
  PRIMARY KEY (`club_id`,`field_label`),
  CONSTRAINT `fk_cf_club` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (7, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (9, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (11, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (11, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (12, 'Faith / Identity / Other');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (13, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (13, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (14, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (14, 'Humanities');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (15, 'Humanities');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (15, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (16, 'Faith / Identity / Other');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (17, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (18, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (18, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (19, 'Humanities');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (19, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (20, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (21, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (22, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (23, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (24, 'Sports & Wellness');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (25, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (26, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (26, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (27, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (28, 'Faith / Identity / Other');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (29, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (30, 'Humanities');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (30, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (33, 'Sports & Wellness');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (35, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (36, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (37, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (37, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (38, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (39, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (39, 'Sports & Wellness');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (40, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (41, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (42, 'Humanities');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (42, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (42, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (43, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (44, 'Humanities');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (45, 'Humanities');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (46, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (47, 'Faith / Identity / Other');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (48, 'Humanities');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (51, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (52, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (53, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (53, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (54, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (55, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (55, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (55, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (56, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (56, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (60, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (61, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (62, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (62, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (63, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (64, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (64, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (65, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (65, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (66, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (66, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (67, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (68, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (69, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (70, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (70, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (71, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (71, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (71, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (72, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (73, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (73, 'Sports & Wellness');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (74, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (74, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (74, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (75, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (76, 'Humanities');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (76, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (77, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (77, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (78, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (78, 'Faith / Identity / Other');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (78, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (79, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (80, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (81, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (82, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (82, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (83, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (83, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (84, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (85, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (85, 'Faith / Identity / Other');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (85, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (86, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (86, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (87, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (88, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (88, 'Faith / Identity / Other');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (88, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (89, 'Humanities');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (90, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (90, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (90, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (91, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (91, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (93, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (93, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (94, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (94, 'Faith / Identity / Other');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (94, 'Humanities');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (94, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (95, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (95, 'Faith / Identity / Other');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (95, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (95, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (96, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (98, 'Faith / Identity / Other');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (98, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (100, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (101, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (101, 'Faith / Identity / Other');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (101, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (102, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (102, 'Faith / Identity / Other');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (102, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (104, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (104, 'Sports & Wellness');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (104, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (105, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (106, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (107, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (107, 'Faith / Identity / Other');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (107, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (108, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (108, 'Sports & Wellness');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (109, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (110, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (110, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (111, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (112, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (113, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (113, 'Faith / Identity / Other');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (113, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (114, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (114, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (115, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (115, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (116, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (117, 'Sports & Wellness');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (118, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (118, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (119, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (120, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (120, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (123, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (126, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (126, 'Faith / Identity / Other');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (126, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (127, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (128, 'Faith / Identity / Other');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (129, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (130, 'Arts / Culture');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (130, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (132, 'Faith / Identity / Other');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (132, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (132, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (133, 'Humanities');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (135, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (135, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (137, 'Social Impact / Service');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (137, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (138, 'Sports & Wellness');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (139, 'STEM');
INSERT INTO `club_fields` (`club_id`, `field_label`) VALUES (142, 'Arts / Culture');

DROP TABLE IF EXISTS `club_meeting_days`;
CREATE TABLE `club_meeting_days` (
  `club_id` int NOT NULL,
  `day_id` int NOT NULL,
  PRIMARY KEY (`club_id`,`day_id`),
  KEY `fk_cmd_day` (`day_id`),
  CONSTRAINT `fk_cmd_club` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cmd_day` FOREIGN KEY (`day_id`) REFERENCES `meeting_days` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (19, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (20, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (22, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (30, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (31, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (40, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (51, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (52, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (61, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (62, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (63, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (64, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (84, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (95, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (103, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (105, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (111, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (118, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (121, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (125, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (126, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (127, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (132, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (138, 1);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (13, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (14, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (25, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (28, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (29, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (32, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (34, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (35, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (37, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (53, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (59, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (65, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (68, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (71, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (78, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (80, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (82, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (86, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (87, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (96, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (99, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (101, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (105, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (109, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (115, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (116, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (123, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (139, 2);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (11, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (15, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (17, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (21, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (23, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (31, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (41, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (43, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (45, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (48, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (54, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (56, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (57, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (60, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (69, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (74, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (81, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (83, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (88, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (89, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (93, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (94, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (98, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (102, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (107, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (110, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (117, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (119, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (120, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (124, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (130, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (135, 3);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (7, 4);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (37, 4);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (46, 4);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (67, 4);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (70, 4);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (72, 4);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (73, 4);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (75, 4);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (85, 4);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (90, 4);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (100, 4);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (104, 4);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (105, 4);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (108, 4);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (112, 4);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (114, 4);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (139, 4);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (9, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (12, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (13, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (16, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (18, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (24, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (26, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (27, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (33, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (36, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (38, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (39, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (42, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (44, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (47, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (55, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (58, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (59, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (66, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (76, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (77, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (91, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (92, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (113, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (122, 5);
INSERT INTO `club_meeting_days` (`club_id`, `day_id`) VALUES (137, 5);

DROP TABLE IF EXISTS `club_subfields`;
CREATE TABLE `club_subfields` (
  `club_id` int NOT NULL,
  `subfield_id` int NOT NULL,
  PRIMARY KEY (`club_id`,`subfield_id`),
  KEY `fk_cs_sub` (`subfield_id`),
  CONSTRAINT `fk_cs_club` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cs_sub` FOREIGN KEY (`subfield_id`) REFERENCES `subfields` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (7, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (22, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (23, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (27, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (37, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (52, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (53, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (54, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (55, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (56, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (62, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (64, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (66, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (68, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (70, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (71, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (72, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (74, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (75, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (77, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (78, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (82, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (83, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (90, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (93, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (95, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (104, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (106, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (110, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (113, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (114, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (115, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (118, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (126, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (129, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (132, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (135, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (137, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (139, 1);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (7, 4);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (21, 4);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (22, 4);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (23, 4);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (27, 4);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (37, 4);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (90, 4);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (11, 7);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (23, 7);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (90, 7);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (114, 7);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (23, 8);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (9, 9);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (13, 9);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (22, 9);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (23, 9);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (29, 9);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (43, 9);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (69, 9);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (105, 9);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (114, 9);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (11, 12);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (23, 12);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (54, 12);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (66, 12);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (86, 12);
INSERT INTO `club_subfields` (`club_id`, `subfield_id`) VALUES (137, 12);

DROP TABLE IF EXISTS `clubs`;
CREATE TABLE `clubs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `club_type` varchar(50) DEFAULT NULL,
  `primary_mode` varchar(50) DEFAULT NULL,
  `volunteer_hours` tinyint(1) NOT NULL DEFAULT '0',
  `meeting_frequency` enum('weekly','biweekly','monthly','event') DEFAULT NULL,
  `meeting_time_type` enum('lunch','after_school') DEFAULT NULL,
  `meeting_time_range` varchar(100) DEFAULT '',
  `meeting_room` varchar(50) DEFAULT NULL,
  `website_url` varchar(512) DEFAULT NULL,
  `open_to_all` tinyint(1) NOT NULL DEFAULT '1',
  `prereq_required` tinyint(1) NOT NULL DEFAULT '0',
  `prerequisites` varchar(255) DEFAULT '',
  `description` text,
  `president_code` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved') NOT NULL DEFAULT 'approved',
  `president_id` int DEFAULT NULL,
  `president_contact` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_name` (`name`),
  KEY `fk_clubs_president` (`president_id`),
  CONSTRAINT `fk_clubs_president` FOREIGN KEY (`president_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=145 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (7, 'Troy Web Development Club', 'STEM', NULL, NULL, 1, 'biweekly', 'lunch', '', 'Room 412', 'https://troywebdev.com', 1, 0, '', 'T-Web is Troy High’s Web Development Club, where students learn how to design, build, and launch real websites using HTML, CSS, JavaScript, and Flask. No prior experience is required—members can start with the basics and quickly move into advanced techniques. Our purpose is to give students practical, marketable skills that can be applied to personal projects, digital portfolios, and even real commissions for school clubs and organizations. Along the way, members strengthen collaboration, project planning, and UI/UX design skills while gaining early preparation for APCSP or the Troy Tech Computer Science Pathway.

We meet weekly to host workshops, mentor newcomers, and collaborate on live projects. Members also have opportunities to participate in competitions, earn volunteer hours by teaching workshops, and take on leadership roles—officer positions rotate every semester, making it easier to get involved. Benefits include hands-on coding experience, portfolio development, teamwork practice, and exposure to real-world applications of computer science.

To join, sign up through our Google Form at https://docs.google.com/forms/d/e/1FAIpQLScWXwXRrtLJZWFj-FwEXGvhCARMdI8ivDXur3wS5qHkzGwYww/viewform
, enter Classroom code pl5cq2g, and connect with us on Discord and Instagram for updates.', '', 'approved', NULL, 'yeowonyoon0109@gmail.com');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (9, 'Physics Club', 'STEM', NULL, NULL, 0, 'weekly', 'lunch', '', 'Room 902', NULL, 1, 0, '', 'The Troy Physics Club is a student-run organization dedicated to making physics engaging, collaborative, and accessible to all Troy students. Our mission is to explore real-world physical phenomena through live demonstrations, problem-solving sessions, and preparation for national and international physics competitions, including the AAPT F=ma, USAPhO, PhysicsBowl, and OPhO.

What we do:
 - Weekly meetings with short demonstrations, interactive activities, and structured practice sessions
 - Competition preparation workshops to build problem-solving and analytical skills
 - Opportunities to represent Troy at regional and national physics contests
 - Participation in school-wide events such as Club Rush and Food Fest

Benefits for members:
 - Strengthened problem-solving abilities for school and competition contexts
 - Exposure to advanced physics concepts and experiments beyond the classroom
 - Leadership opportunities through officer positions and event organization
 - Community service and mentoring hours by helping underclassmen with physics
 - A collaborative environment where students share knowledge and learn from each other

Commitments:
 - Members are expected to attend meetings at least once a month, actively participate in group activities, and contribute to preparation for events or fundraisers.

How to join:
 - Sign up during Club Rush!!!', '', 'approved', NULL, '800025055@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (11, 'Scholars of Medicine and Health', 'STEM', NULL, NULL, 1, 'weekly', 'lunch', '', 'Room 905', NULL, 1, 0, '', 'Scholars of Medicine and Health is a student-led medical club designed to guide and support future healthcare professionals as they explore careers in medicine by offering specialized opportunities such as speaker events, service projects, and hands-on experiences. SMH is structured around seven focused chapters including psychology, pediatrics, oncology, and biomedical engineering. Any student is welcome to join.
Mission Statement: To inspire and empower students who are truly passionate about medicine by providing meaningful exposure to the medical field. We aim to promote public health through education, community outreach, campaigns, and interactive events like certification programs, guest speakers, internships, competitions, and volunteer opportunities. We create a diverse and supportive community where future healthcare professionals can explore their interests, deepen their 
understanding, and take confident steps toward impactful medical careers by offering specialized chapters in areas such as biomedical engineering, pediatrics, and psychology.

Google Classroom: x3wqymtx
Instagram: @troy.smh', '', 'approved', NULL, '800025534@fjuhsd.org, 800019213@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (12, 'Latinos Unidos', 'Faith / Identity / Other', NULL, NULL, 0, 'biweekly', 'lunch', '', '330', NULL, 1, 0, '', 'Latinos Unidos is dedicated to sharing and embracing diverse Latino cultures. We will discuss various traditions and countries, from music to food and everything in between. Anyone is welcome to join! Follow us on Instagram @thslatinos unidos . 
Join here: https://docs.google.com/forms/d/e/1FAIpQLSeYu7aRUJLmjkIjFEsAvTZM3EbYvzqE0pwsqodcKCMf391Hdw/viewform?usp=header 
Google classroom code: su7xyxj

We also have a folklorico team, Raíces de las Almas! Follow them on Instagram @raicesdelasalmas . If you are interested in joining, fill out this form: https://docs.google.com/forms/d/e/1FAIpQLSeYu7aRUJLmjkIjFEsAvTZM3EbYvzqE0pwsqodcKCMf391Hdw/viewform?usp=header', '', 'approved', NULL, '800024720@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (13, 'Troy Future City', 'STEM', NULL, NULL, 1, 'weekly', 'lunch', '', 'Room 305', NULL, 1, 0, '', 'Future City is an international Engineering competition where students imagine, design, and build a model of a city, 100 years in the future. This encompasses all types of engineering, as designing a full city is not limited to Civil Engineering or Architecture! 

✨ Why Join?
By becoming a member, you’ll gain:
💰 Scholarship prizes –$10,000 per person for the winning team
🤝 Community service hours through our middle school outreach program
🌍 International recognition – an impressive highlight for college applications
✈️ A trip to Washington, D.C. to compete on the global stage, and meet world renowned engineers
✅Open Board positions – No prior experience is required for TFC at all!
🎉Engineering skills - Future City is a creative outlet and is a very fun project!

Our meetings are hands-on and collaborative—researching, brainstorming, and engineering creative solutions to design our Future City. We prepare for project submission in January and the international competition in D.C. in February!

🏆 Our Track Record
With 6+ years of experience, our team has consistently excelled. Last year, we placed Top 5 out of 1,800 teams worldwide, earning over $1,000 in prizes.

Google Classroom Code: zth5dq25
Instagram: @troyfuturecity
Google Form to Sign Up: https://forms.gle/QEwV5akq5utwf2kb6', '', 'approved', NULL, '800026281@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (14, 'Letters Connect', 'Humanities', NULL, NULL, 1, 'weekly', 'lunch', '', 'Room 527', NULL, 1, 0, '', 'Google Classroom: 7ie2occc
Instagram: @troylettersconnect
Our mission is to revive letter-writing and to destress from Internet chaos! We offer pen pals from other chapters and board games, and members will have the opportunity to get some easy volunteer hours just by writing letters! We will also be offering volunteer hours for help with fundraisers and other events like Food Fest.', '', 'approved', NULL, '800019179@fjuhsd.org, 800018943@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (15, 'Bridge of  Ages', 'Humanities', NULL, NULL, 1, 'weekly', 'lunch', '', '334', NULL, 1, 0, '', 'Bridge of Ages is a youth organization dedicated to promoting wellness and addressing health issues commonly faced by the elderly. Using opportunities of youth, we strive to raise awareness surrounding health concerns, contribute to preventing illnesses, and empower both the older and younger generation to initiate healthy lives. Through advocacy, education, and support for the senior community, we hope to bridge the gap between the youth and elderly one home at a time.', '', 'approved', NULL, '800025404@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (16, 'Gender-Sexuality Alliance', 'Faith / Identity / Other', NULL, NULL, 0, 'weekly', 'lunch', '', 'Room 325', NULL, 1, 0, '', 'We provide a safe space on campus for queer students and allies, where you can make friends and learn about LGBTQ+ history and culture. Occasionally, we fundraise for local LGBTQ+ charities or organizations with our own sales.

Our Instagram is troy.gsa and links to our Discord server will be provided at meetings each Friday. Our Google Classroom code is a6pi6ed.', '', 'approved', NULL, '800024787@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (17, 'Make-A-Wish', 'Social Impact / Service', NULL, NULL, 1, 'biweekly', 'lunch', '', 'Room 1001', NULL, 1, 0, '', 'Troy Make-A-Wish club supports the national organization in spreading awareness and helping create positive moments for families who have children with critical illnesses. As a student-led chapter, we focus on raising awareness and funds to help grant life-changing wishes in our community through local fundraising efforts. Our club gives students the opportunity to make a direct impact on children and families in our community. Members can earn service hours, make cards for Make-A-Wish kids, help host fundraisers, and participate in fun MAW trivia activities every meeting!
Google classroom code: sneg3u4k
Interest form: https://forms.gle/P1sTpWuThMbg7itp6', '', 'approved', NULL, '800024895@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (18, 'Green Lantern', 'Arts / Culture', NULL, NULL, 1, 'biweekly', 'lunch', '', '315', NULL, 1, 0, '', 'The Green Lantern Club can really bring something special to Troy by inspiring students to be creative and caring at the same time. It’s a well-known non-profit organization that encourages young people to write and share their own stories, helping them develop their voice and confidence. But more than that, Green Lantern is about making a difference in the lives of kids in rural areas around the world. Through fundraising efforts to build libraries and support community projects, Troy students can see how their passions and hard work can directly help children who need it most. It’s a chance for everyone to come together as a community of caring, selfless young people who want to create a better future , not just for their own town, but for kids everywhere. Green Lantern can help Troy students find purpose, grow compassion, and become the next generation of leaders who truly care.', '', 'approved', NULL, '800025218@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (19, 'Student Advocates for Mental Health', 'Humanities', NULL, NULL, 1, 'biweekly', 'lunch', '', 'Room 412', 'https://www.instagram.com/ths.samh?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr', 1, 0, '', 'Students Advocates for Mental Health (SAMH) is a student-led club dedicated to increasing awareness and reducing stigma around mental health on the Troy campus. Our mission is to foster a supportive environment where students, parents, and staff can openly discuss mental health, build understanding, and encourage holistic wellness.
Through workshops, awareness campaigns, advocacy projects, and community events, SAMH empowers students to use their voices to spark meaningful change. We aim to provide education, resources, and safe spaces that promote mental health awareness and well-being for the entire Troy community.
If you are passionate about mental health and want to make a difference, SAMH is the club for you!

Google Classroom: oojnjgs
Instagram: @ths.samh', '', 'approved', NULL, '800019158@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (20, 'Big Brothers Big Sisters', 'Social Impact / Service', NULL, NULL, 1, 'biweekly', 'lunch', '', 'Room 1006', 'https://www.instagram.com/troyhigh.bbbs?igsh=NTc4MTIwNjQ2YQ%3D%3D&utm_source=qr', 1, 0, '', 'Big Brothers Big Sisters of Orange County (BBBS) is a club here at Troy dedicated to fostering mentorship, leadership, and community service through the nationally recognized Big Brothers Big Sisters program. Our mission is to inspire, guide, and empower students to build meaningful connections with younger mentees while growing as compassionate leaders themselves.
Through service projects, mentorship activities, awareness campaigns, and community outreach, BBBS provides opportunities for students to make a lasting impact in the lives of local youth. Members develop skills in communication, empathy, and responsibility while promoting a culture of service and support both on and off campus.
If you are passionate about giving back, mentoring younger generations, and creating positive change, BBBS is the club for you!

Google Classroom: 4fhmfob
Instagram: @troyhigh.bbbs', '', 'approved', NULL, '800019158@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (21, 'Math Club', 'STEM', NULL, NULL, 1, 'weekly', 'lunch', '', '311', NULL, 1, 0, '', 'Math Club is a club for people interested in math, and also helps prepare students for math competitions such as the AMC and AIME. Each week, lectures are typically held on different math topics. As competition dates get closer, lectures become more focused on topics relating to those competitions, in order to help students.

The club also sends teams to math competitions outside of the AMC cycle, which can be a good opportunity to further your math competition experience and represent Troy.

Interest form: https://forms.gle/4rTMHZQu7YFFrwTR7', '', 'approved', NULL, '800026332@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (22, 'G-TEC', 'STEM', NULL, NULL, 1, 'weekly', 'lunch', '', '1005', NULL, 1, 0, '', 'Classroom Code: if52ec2
Discord: https://discord.com/invite/ygwNe5dG23
Google Form for sign-ups: https://forms.gle/QioCQJozTa3upqsFA', '', 'approved', NULL, '800025019@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (23, 'STEMLink', 'STEM', NULL, NULL, 1, 'biweekly', 'lunch', '', '1004', NULL, 1, 0, '', 'GC code : pyvixr6e
Instagram : stemlink_

Members will rewrite research papers to be easily understood, allowing everyday people, regardless of education level, to learn and understand research that is being done in STEM fields. A month will be given to do these papers, and the paper a member rewrites will be one of their own choosing. This club won\'t feel like another class. Instead, it\'ll be a fun opportunity where members can make a difference while also learning about something they love! (and also getting volunteer hours for it) 

Re-writes won\'t be all we\'re doing! We also hope to have outreach events, have workshops, and fun club bonding activities! 

Why you should join : 
- get volunteer hours
- gain experience with research papers
- make new friends', '', 'approved', NULL, '800025366@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (24, 'Badminton Club', 'Sports & Wellness', NULL, NULL, 0, 'biweekly', 'lunch', '', 'South Gym', NULL, 1, 0, '', 'Google Classroom code: ihbhdxy
Instagram: troybadminton
Discord: https://discord.gg/Z37myKJAqP

This club brings together students interested in playing badminton for both entertainment and competitive purposes. The purpose of this club is to create a supportive environment where members can enhance their badminton skills and build friendships.', '', 'approved', NULL, '800019133@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (25, 'Love Through the Lines', 'Social Impact / Service', NULL, NULL, 0, 'biweekly', 'lunch', '', '319', NULL, 1, 0, '', 'Education should open doors for all, not just some! LTTL is a youth-led high school club union that nurtures education advocates because no child should be left behind in their education. By helping to bridge the gap in underprivileged areas and overcoming barriers,  we build a community across over 20 high schools that empowers all students.', '', 'approved', NULL, '800025114@fjuhsd.org / phoebeyou11@gmail.com');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (26, 'Troy High Fashion', 'Arts / Culture', NULL, NULL, 0, 'biweekly', 'lunch', '', '903', NULL, 1, 0, '', 'Google Classroom Code: igxfaxs
Instagram: @troyhighfashion

Troy High Fashion is a club for students who love style, creativity, and making a difference. We discuss the effects of fast fashion. how to shop sustainably, and how to discover your personal style. We also explore trends and share our ideas on what we predict is going to happen next in the fashion world. We also give back thought clothing drives and fundraising for organizations combating child labor in the fast fashion industry. We also host events like MET Gala day, movie nights, pop-up stores, clothing personalization, and even publishing our own fashion magazine!', '', 'approved', NULL, '800024639@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (27, 'Data Science Club', 'STEM', NULL, NULL, 1, 'biweekly', 'lunch', '', 'Room 318', NULL, 1, 0, '', 'Data Science Club guides TRHS students through the interdisciplinary study of Computer Science, Math, and domain knowledge using case-studies, real-world examples, practical applications, and monthly newsletters to demonstrate the dynamic interactions of people, data, information, and decision making. At this club, we don\'t stress about competing with one another to get ahead; instead, we collaborate, discuss and debate to learn more in the age of AI.

The club meets in room 318 on 2nd and 4th Fridays of each month while school is in session (except school holidays and AP/IB testing time). Google Classroom Code:  xs5xfl5

- Leadership roles: All five elected board positions will be open in the spring of 2026; appointed leadership roles are filled as needed. Interested students should email the club president for more info and job shadowing. We welcome underclassmen who wish to learn hands-on.
- Volunteer hours: The club is connected to volunteer organizations and nearly 50 charities in the community. If you need volunteer hours or wish to know about upcoming service events in the community, come to a club meeting and ask for more info.', '', 'approved', NULL, '800024645@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (28, 'FCA- Fellowship of Christian Athletes', 'Faith / Identity / Other', NULL, NULL, 0, 'event', 'lunch', '', '524', NULL, 1, 0, '', 'HI THERE! 
We hope you join the FCA FAM. We bring in speakers monthly, have bible studies with our peers, and play LOTS OF GAMES. We will have PIZZA and SNACKS for you all every other TUESDAY @ LUNCH in RM:524. Our verse of the year is 1 Timothy 4:8 and our word is GENUINE. This year we will have a prayer box, so if you need prayer, our FCA Leadership Team is here to support you. We encourage you to allow Jesus to guide you on a path where you will use him as guidance throughout your sport season. Jesus has given our athletes such great gifts and we cannot wait to see how He works in your life. FCA FAM FOREVER! JOIN US
INTSA: @FCATROY
REMIND PASSCODE: godisgood5!', '', 'approved', NULL, '800018940@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (29, 'Troy Car Club (TCC)', 'STEM', NULL, NULL, 0, 'biweekly', 'lunch', '', '301', NULL, 1, 0, '', 'Troy Car Club is a place for students who are interested in cars to learn and share. We talk about topics like car history, basic maintenance, and how different parts or modifications affect a car. The club is open to anyone curious about cars, whether you’re new to them or already know a lot.
Instagram: @troyhighcarclub
Google Classroom Code: snfc2pzi', '', 'approved', NULL, '800026367@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (30, 'Empowering Education Foundation', 'Humanities', NULL, NULL, 1, 'weekly', 'lunch', '', 'Room 904', 'https://www.empoweredufoundation.org/', 1, 0, '', 'Google Classroom Code: chbix6l
Instagram: @empoweringeducationfoundation
Discord: https://discord.gg/vcD946nksc
The Empowering Education Foundation is a non-profit that hopes to bridge the education gap through tutoring led initiatives. It is a national organization founded by the endeavors of high school students striving for a better world with opportunity for all. 
Responsibilities: Teaching 45 minute classes once a week in a designated subject of your choice through online meeting in underprivileged countries.
Events: As a partner with Equity Learning, we will host monthly seminars with schools around our area and expand opportunities for younger students.
Member Benefits: Community Service Hours, Leadership Opportunities', '', 'approved', NULL, '800026059@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (31, 'Mock Trial', 'Other', NULL, NULL, 0, 'event', 'after_school', 'Afterschool, 3:45 - 5:30', '333', NULL, 0, 1, 'Tryouts Required', 'Mock Trial is an academic competition that simulates a criminal trial. Team members develop public and persuasive speech skills, writing ability, and teamwork. Tryouts and more information are located on our google classroom (mce7gkww) and instagram (@ths_mocktrial)', '', 'approved', NULL, '800025405@fjuhsd.org, 800024405@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (32, 'Pokémon Club', 'Other', NULL, NULL, 0, 'biweekly', 'lunch', '', '508', NULL, 1, 0, '', 'Google Class Code: wsnscxwg
Pokémon Club is a fun club that incorporates different aspects of the Pokémon world. We will have various different Pokémon related activities throughout this year. Our club will help foster a community of like minded individuals, allow students to connect, build friendships, share a common interest, and will help provide a relaxing and calming experience during lunch. Our club is open to everyone especially to those who love Pokémon or want to learn more about it.

Thank you and please consider joining.', '', 'approved', NULL, '800019193@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (33, 'Pickleball Club', 'Sports & Wellness', NULL, NULL, 0, 'biweekly', 'lunch', '', 'Outside the Tennis Courts', NULL, 1, 0, '', 'Pickleball Club is a club that will help improve the participants pickleball skills and create an inclusive community for both beginners and seasoned pros. Our club will also create a tournament between participants. Thus, improving physical and mental well being.

Thank you and please consider joining.', '', 'approved', NULL, '800019193@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (34, 'Troy Cubing Club', 'Other', NULL, NULL, 0, 'weekly', 'lunch', '', '910', NULL, 1, 0, '', '', '', 'approved', NULL, '800026407@fjuhsd.org, troycubing@gmail.com');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (35, 'Senior Sync', 'Social Impact / Service', NULL, NULL, 1, 'biweekly', 'lunch', '', '304', 'https://linktr.ee/seniorsync.ths', 1, 0, '', 'Instagram; @seniorsync.ths
GC Code: 4a3qifq
We aim to bridge the digital divide between generations! We recognize that the increase in new technology has caused the generation gap to widen constantly. The goal of the club is to help a large number of seniors understand and be able to connect with technology flawlessly, as well as create a curriculum that will continuously be updated to teach seniors and aid the lack of technology knowledge in our communities. Our club intends to educate and assist seniors with overcoming technological barriers and hardships through a curriculum specifically designed for their understanding. Often, we will go to different locations of senior centers and teach the elderly the basics of technology and the usage of online platforms.', '', 'approved', NULL, '800025004@fjuhsd.org, 800025070@fjuhsd.org, 800018448@fjuhsd.org, seniorsyncths@gmail.com');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (36, 'A LEO CLUB', 'Social Impact / Service', NULL, NULL, 1, 'biweekly', 'lunch', '', '334', NULL, 1, 1, 'Certain tryouts to competitions', 'IG: @troyhighleoclub
GC Code: fwpiiobi

Our Goals:
1) Lions International Marketing Award 
2) LEO International Video Contest
3) Offering limited scholarships to our members:
Foundation Grants - Speech Scholarship Competition - Fullerton District Scholarship for Juniors & Seniors in Lions Club

A LEO Club this year focuses on specific scholarships & competitions limited to what the LCIF (Lions Clubs International Foundation) offers. We will have volunteering service on the background (Individual Events) with occasional group events. We have board positions currently open with more opportunities of leadership throughout the year! This club is nationally recognized which allows students to learn important life skills like teamwork, passion, and commitment to our community as well as prepping for college!', '', 'approved', NULL, '800019019@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (37, 'Game Development Club', 'STEM', NULL, NULL, 0, 'weekly', 'after_school', 'lunch on Tuesday, after school on Thursday', '428', NULL, 1, 0, '', 'We make video games. As a community, we decide which game we should make during the year, and act as a student-led studio to produce a finished product by the end. So far, we have made 3 games, 2 of which were game jam submissions, and one of which has over 28,000 plays.', '', 'approved', NULL, '800024737@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (38, 'Making an Impact Club', 'Social Impact / Service', NULL, NULL, 1, 'biweekly', 'lunch', '', 'Room 330', 'https://makinganimpact.squarespace.com/', 1, 0, '', 'Hello! 
Making an Impact Club is all about helping out our community. We help to clean up at parks on weekends and around the school itself; you may have even seen our posters all around the campus. We meet once every two weeks in room 330, and each meeting will give you one service hour. 

Sign up with this link: https://tinyurl.com/4zszb9nr
Follow us on instagram at: mai_troy_club', '', 'approved', NULL, '800024667@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (39, 'Training for Knowledge and Determination', 'Arts / Culture', NULL, NULL, 0, 'biweekly', 'lunch', '', '506', NULL, 1, 0, '', 'TKD Club will be focused on teaching the history of the sport of taekwondo and the effects it has had on Korean culture throughout millennium. This club is open to anyone and everyone, and no member is required to show up to meetings. You can show up any time. We will be going chronologically in time, and the Google slide presentations for the lectures will be posted on the Google Classroom.', '', 'approved', NULL, '800025539@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (40, 'Alternative Music Appreciation Club', 'Arts / Culture', NULL, NULL, 0, 'weekly', 'lunch', '', 'Room 319', NULL, 1, 0, '', 'The Alternative Music Appreciation Club gathers weekly to discuss different alternative music genres,their backgrounds,etc.
Google classroom code: k7evuqqe', '', 'approved', NULL, '800018971@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (41, 'Need 2 Feed', 'Social Impact / Service', NULL, NULL, 1, 'biweekly', 'lunch', '', 'Room 306', NULL, 1, 0, '', 'Follow our Instagram!: @ths_n2f
Join our Google Classroom!: iat2pbzt', '', 'approved', NULL, '300024125@fjuhsd.org, 800025897@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (42, 'Alzheimer\'s Association Club', 'STEM', NULL, NULL, 1, 'biweekly', 'lunch', '', 'Room 904', NULL, 1, 0, '', 'Our club helps spread awareness about Alzheimers, educates students about this disease, and provides volunteering opportunities for a nationally recognized organization.', '', 'approved', NULL, '800024831@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (43, 'Rocketry and Aerospace Club', 'STEM', NULL, NULL, 0, 'weekly', 'lunch', '', '322', NULL, 1, 0, '', '', '', 'approved', NULL, '800025413@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (44, 'Troy Humanities Club', 'Humanities', NULL, NULL, 0, 'weekly', 'lunch', '', 'Room 517', NULL, 1, 0, '', 'The Troy Humanities Club seeks to learn about and discuss the humanities, giving a platform for those unfamiliar to discuss their passions. More than that, the Club also seeks to provide a resources of learn about the humanities and what makes us human.', '', 'approved', NULL, '800019154@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (45, 'Legislation Literacy Club', 'Humanities', NULL, NULL, 0, 'weekly', 'lunch', '', 'Room 420', NULL, 1, 0, '', 'Leg. Lit. Club is part of a student led organization: Legislation Literacy! 
Our goal is to help club members gain and spread their own knowledge of legislation, this includes certain laws/acts that specifically impact teenagers. We are trying to break the stigma that legislation only impacts adults by providing accessible information. Our club will participate in group discussions and non-partisan presentations. 
We will host club projects (that may be voted by club members or created by the organization) that can vary from service hours, raising awareness, and also fundraising! 
These projects will incorporate what the club learns throughout meetings which are every Wednesday at room 420 (Mr. McNamara) during lunch.
Club members are also highly encouraged to attend all meetings. If you are unable to attend a meeting, we ask that you notify a cabinet member. CABINET POSITION APPLICATIONS ARE ALSO OPEN RIGHT NOW!!! Look in our insta bio for the application link :)
Google Classroom code: 44max3a2
Instagram: troy_leglit', '', 'approved', NULL, '800026953@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (46, 'Frame by Frame Club', 'Arts / Culture', NULL, NULL, 1, 'biweekly', 'lunch', '', '1003', NULL, 1, 0, '', 'Google Classroom Code: mgn7za6g
Insta: @framebyframe.ths

Meeting every other Thursday in Mr. Falletta\'s Room 1003! (if you\'re interested in board positions, make sure to show up to meetings!)

Learn about stop motion basics, create, volunteer, and participate in competitions!

Volunteering opportunities - teach kids in underserved areas simple stop motion, create stop motion for educational and marketing purposes, produce short stop motion clips for social media of an organization (TAG) to promote cleaning up local parks, and more!

If you\'re interested in film, crafts, animation, or keen on learning about stop motion, join Frame by Frame Club :)

o(*^＠^*)o                  (✿◕‿◕✿)', '', 'approved', NULL, '800025200@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (47, 'Catholic Guidance Club', 'Faith / Identity / Other', NULL, NULL, 1, 'biweekly', 'lunch', '', '306', NULL, 1, 0, '', 'Google classroom: btpcdi72
@ths_cgc
-Many volunteering opportunities
-Faith guidance
Catholic guidance club is a community-oriented group that fosters spiritual growth and personal development based on Catholic teachings. It provides guidance on living out one\'s faith through prayer, service, and engaging with relevant topics, all while building strong, supportive friendships.', '', 'approved', NULL, '800025357@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (48, 'Troy Philosophy Club', 'Humanities', NULL, NULL, 0, 'biweekly', 'lunch', '', 'Room 323', NULL, 1, 0, '', 'Our club welcomes students to learn and engage with philosophy, providing short lecture and hosting discussion on various philosophy topic. Meetings are very chill and no prior knowledge required! We are also introducing a philosophy journal this year open to everyone for submission. For more details, attend our meetings or contact us.

Google Classroom code: c6dxi4e
Discord server link: https://discord.gg/w8hY5MPg
Instagram: https://www.instagram.com/ths_philosophy', '', 'approved', NULL, '800019186@fjuhsd.org');
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (51, 'A Friend in Me', 'Arts / Culture', NULL, NULL, 0, 'monthly', 'lunch', '', '526', NULL, 0, 0, '', 'Automatically imported from official directory. A Friend in Me is dedicated to providing high school experiences for teen cancer patients through spirit weeks, dances, and more!', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (52, 'American Computer Science League (ACSL)', 'STEM', NULL, NULL, 0, 'event', 'lunch', '', '405', NULL, 0, 0, '', 'Automatically imported from official directory. We are a computer science club that competes in the American Computer Science League classroom and programing divisions. Last year the majority of our members qualified for ACSL nationals.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (53, 'American Conservation Coalition (ACC)', 'STEM', NULL, NULL, 0, 'event', 'lunch', '', '1007', NULL, 0, 0, '', 'Automatically imported from official directory. ACC Environmental Club is a student-led group dedicated to promoting sustainability and environmental awareness. Members lead projects and events that support conservation and positive change in the community.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (54, 'Anatomy Club', 'STEM', NULL, NULL, 0, 'biweekly', 'lunch', '', '904', NULL, 0, 0, '', 'Automatically imported from official directory. Anatomy Club is dedicated to equipping students who are interested in medicine or healthcare with the tools they need through dissections, lab work, and meetings with acclaimed medical professionals.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (55, 'Art 4 Healing', 'Arts / Culture', NULL, NULL, 0, 'biweekly', 'lunch', '', '333', NULL, 0, 0, '', 'Automatically imported from official directory. Art 4 Healing raises awareness and supports emotional healing through art and creative expression for chronically ill pediatric patients living in pain, grief, or stress. Our goal is to share art as a tool for self-expression and methods to support healing of patients in hospitals and clinics.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (56, 'Autism Youth Ambassadors (AYA)', 'STEM', NULL, NULL, 0, 'event', 'lunch', '', '422', NULL, 0, 0, '', 'Automatically imported from official directory. We are a team dedicated to volunteering with and for children with autism and raising awareness about the condition in the effort to reduce stigma on autism. Our initiative can also offer relief to parents of children with autism as well as giving members real-life experiences with volunteering and better preparing them for life beyond high-school.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (57, 'Best Buddies', 'Other', NULL, NULL, 0, 'biweekly', 'lunch', '', '326/329', NULL, 0, 0, '', 'Automatically imported from official directory. Making one-to-one friendships between people with and without intellectual and developmental disabilities (IDD) to promote social inclusion, leadership, and employment opportunities.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (58, 'BioOly Club', 'Other', NULL, NULL, 0, 'event', 'lunch', '', '906', NULL, 0, 0, '', 'Automatically imported from official directory. we prepare students to take the USABO exam.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (59, 'Botany Club', 'Other', NULL, NULL, 0, 'event', 'lunch', '', '906/ outdoor classroom', NULL, 0, 0, '', 'Automatically imported from official directory. We talk about how to care for plants and gardens during lunch meetings and we clean and beautify the outdoor classroom.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (60, 'Cancer Kids First', 'Social Impact / Service', NULL, NULL, 0, 'biweekly', 'lunch', '', '905', NULL, 0, 0, '', 'Automatically imported from official directory. Our club helps to positively impact the lives of children with cancer through our various programs like creating cards.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (61, 'Cards for a Cause', 'Social Impact / Service', NULL, NULL, 0, 'monthly', 'lunch', '', '526', NULL, 0, 0, '', 'Automatically imported from official directory. In Cards for a Cause, we make cards for different organizations and causes in order to uplift spirits of many people!', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (62, 'Care Mission', 'STEM', NULL, NULL, 0, 'biweekly', 'lunch', '', '505', NULL, 0, 0, '', 'Automatically imported from official directory. We are a volunteer service-oriented club dedicated to providing aid to those in need in the San Bernardino and LA areas. We distribute food to the community and host fundraisers to purchase necessities for the homeless.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (63, 'Chess Club', 'Social Impact / Service', NULL, NULL, 0, 'event', 'lunch', '', '312', NULL, 0, 0, '', 'Automatically imported from official directory. Chess Club helps students learn new chess strategies that they can implement on their own time, but we also sometimes host tournaments (within the school and outside) for them to test their skills.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (64, 'Crack the Code', 'STEM', NULL, NULL, 0, 'biweekly', 'lunch', '', '407', NULL, 0, 0, '', 'Automatically imported from official directory. Crack the Code, or CTC, is a 501(c)(3) non-profit organization that aims to bring the defensive side of cybersecurity to high schoolers through hackathons. Rather than the usual offensive cybersecurity competitions (ex. pen test/CTFs), CTC is a platform for high schoolers to showcase their coding skills and ingenuity through hosting hackathons of their own!', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (65, 'Creatives for Social Change (CSC)', 'Arts / Culture', NULL, NULL, 0, 'event', 'lunch', '', '326', NULL, 0, 0, '', 'Automatically imported from official directory. Creatives for Social Change Club (CSC) is dedicated to promoting awareness and education around menstrual health while advocating for accessibility to menstrual products. Through creative initiatives and community projects, the club empowers students to engage in meaningful conversations and drive positive change.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (66, 'Dermatology Club', 'STEM', NULL, NULL, 0, 'biweekly', 'lunch', '', '415', NULL, 0, 0, '', 'Automatically imported from official directory. The Dermatology Club educates youth about skincare and dermatology to promote lifelong skin health. We host presentations, giveaways, and fundraisers while raising awareness about skin cancer in a welcoming community.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (67, 'Drama Club', 'Arts / Culture', NULL, NULL, 0, 'event', 'lunch', '', '203', NULL, 0, 0, '', 'Automatically imported from official directory. Our club teaches members to think on their feet, as well as working as a team with improv games.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (68, 'Drones4Kids', 'STEM', NULL, NULL, 0, 'biweekly', 'lunch', '', '401', NULL, 0, 0, '', 'Automatically imported from official directory. Drones4Kids hosts a variety of STEM events at libraries and fairs, including a complete drone obstacle course, flight simulators, and drone license opportunities. We emphasize a fun connection with drones and STEM while also maintaining safety as a priority.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (69, 'Engineering 2 the Future', 'STEM', NULL, NULL, 0, 'biweekly', 'lunch', '', '312', NULL, 0, 0, '', 'Automatically imported from official directory. E2TF is an engineering club focused on making engineering more accessible to people of all backgrounds and skill levels.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (70, 'Future Business Leaders of America (FBLA)', 'STEM', NULL, NULL, 0, 'biweekly', 'lunch', '', 'Lecture Hall', NULL, 0, 0, '', 'Automatically imported from official directory. Troy Future Business Leaders of America offers the opportunity for students to compete and gain recognition up to the national level in over 180+ competitive events. We pride ourselves in our professional career development opportunities, leadership opportunities, and service opportunities. We are the biggest club community here on campus and everyone is welcome to join and find their intersection with their interests.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (71, 'Future Women in Business', 'Arts / Culture', NULL, NULL, 0, 'biweekly', 'lunch', '', '331', NULL, 0, 0, '', 'Automatically imported from official directory. Future Women in Business works to empower students interested in business, economics, and entrepreneurship. Our clubs assists with workshops, potential internships, and advocacy for women in the business field. The clubs main focus: To master the art of business.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (72, 'Geoguessr Club', 'STEM', NULL, NULL, 0, 'biweekly', 'lunch', '', '322', NULL, 0, 0, '', 'Automatically imported from official directory. Geoguessr Club aims to provide students interested in geography or geocaching a place to learn and strengthen their understanding of the perspective of the world, it also provides a place for student to demonstrate their knowledge through competitions and awards.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (73, 'Hope 4 Athletes', 'Social Impact / Service', NULL, NULL, 0, 'biweekly', 'lunch', '', '520', NULL, 0, 0, '', 'Automatically imported from official directory. Hope 4 Athletes is a club that promotes inclusion and support for students with disabilities through sports and mentorship. Members lead activities and events that build safe community and confidence through teamwork.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (74, 'iExplore', 'Arts / Culture', NULL, NULL, 0, 'biweekly', 'lunch', '', '328', NULL, 0, 0, '', 'Automatically imported from official directory. This club gives academic support to underprivileged kids worldwide using online classes taught by Troy students, covering a wide variety subjects and helping Troy students learn teaching and public speaking skills. Additionally, it offers Troy students opportunities to gain music performance experience by organizing monthly recitals at senior centers to benefit both the community and student growth.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (75, 'Inspiring New Knowledge Club (INK)', 'STEM', NULL, NULL, 0, 'event', 'lunch', '', '318', NULL, 0, 0, '', 'Automatically imported from official directory. We create picture books for kids based on their unique interests and hobbies! Illustrators and writers collaborate to create fun, colorful, detailed stories.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (76, 'International Teen Association (ITA)', 'Humanities', NULL, NULL, 0, 'event', 'lunch', '', '1002', NULL, 0, 0, '', 'Automatically imported from official directory. Our mission is to shape future leaders while cultivating a sense of community, service, and social responsibility. We offer members various opportunities while being a subchapter of the internationally recognized Miss Teen Inc, a non-profit organization. Our students have been honored with awards from the federal government.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (77, 'Key Club', 'STEM', NULL, NULL, 0, 'biweekly', 'lunch', '', '904', NULL, 0, 0, '', 'Automatically imported from official directory. Key Club is a non-profit student led organization that raises funds through community service that raises funds for multiple charities on top of leadership and spirit building events.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (78, 'Korean Culture Club', 'Arts / Culture', NULL, NULL, 0, 'event', 'lunch', '', '322', NULL, 0, 0, '', 'Automatically imported from official directory. The Korean Culture Club creates a fun and engaging environment where members can learn about and experience Korean culture together. Our goal is to give everyone the opportunity to contribute, interact, and explore different aspects of Korean traditions, language, and entertainment.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (79, 'Legal Underground', 'Arts / Culture', NULL, NULL, 0, 'event', 'after_school', 'TBD', '527', NULL, 0, 0, '', 'Automatically imported from official directory. Provides members the opportunity explore and further their knowledge of different legal fields and participate in meetings with guest speakers.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (80, 'National Honor Society', 'Social Impact / Service', NULL, NULL, 0, 'event', 'lunch', '', 'North Gym', NULL, 0, 0, '', 'Automatically imported from official directory. NHS is the nation’s premier organization established to recognize high school students for their accomplishments and challenge them through active involvement in school activities and community service.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (81, 'Operation Smile', 'Social Impact / Service', NULL, NULL, 0, 'biweekly', 'lunch', '', '1004', NULL, 0, 0, '', 'Automatically imported from official directory. Operation smile is a club that offers students the opportuinity to educate themselves about children around the world born with cleft palates. members will get the chance to immerse themselves in service projects and activities, consisting of tasks such as making care packages, making blankets, bracelets, or cards, shaping them into more well rounded and charitable individuals.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (82, 'Orphan Assistance Fund', 'STEM', NULL, NULL, 0, 'event', 'lunch', '', '422', NULL, 0, 0, '', 'Automatically imported from official directory. The OAF helps children in SoCal including: foster children, children in social services, children with mental disorders. The club holds occasional fundraisers and monthly volunteering events.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (83, 'Peer Tutoring Club', 'STEM', NULL, NULL, 0, 'monthly', 'lunch', '', '318', NULL, 0, 0, '', 'Automatically imported from official directory. PTC aims to provide personalized, one-on-one academic support to all TRHS students on campus according to individual need and availability.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (84, 'Photography Club', 'Arts / Culture', NULL, NULL, 0, 'biweekly', 'lunch', '', '403', NULL, 0, 0, '', 'Automatically imported from official directory. Photography Club is dedicated to promoting the art of photography. The Photography Club will provide opportunities for its members to learn both basic and advanced photography techniques, learn how to build a portfolio to share their work, and participate in collaborative projects.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (85, 'Pilipinos Sharing Smiles Together (PSST)', 'Arts / Culture', NULL, NULL, 0, 'event', 'lunch', '', '417', NULL, 0, 0, '', 'Automatically imported from official directory. PSST strives to promote inclusivity for people of all backgrounds and beliefs and broaden the awareness of the Filipino culture. We celebrate and embrace our culture through cultural performances, acting, singing, and overall being a welcoming community!', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (86, 'Red Cross Club', 'STEM', NULL, NULL, 0, 'event', 'lunch', '', '904', NULL, 0, 0, '', 'Automatically imported from official directory. This club contributes to Troy High School by serving as the first step in students’ medical journeys and allowing them to become more deeply involved and make a meaningful impact in their communities.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (87, 'Sending Sunshine', 'Social Impact / Service', NULL, NULL, 0, 'event', 'lunch', '', '910', NULL, 0, 0, '', 'Automatically imported from official directory. Sending Sunshine makes cards for senior citizens to combat loneliness as well as makes bracelets for hospital patients -- all of which are eligible for community service hours.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (88, 'South Asian Student Association (SASA)', 'Arts / Culture', NULL, NULL, 0, 'event', 'lunch', '', '1001', NULL, 0, 0, '', 'Automatically imported from official directory. SASA builds a community for students to connect with South Asian culture, food, and various art forms, while promoting awareness at Troy High and across Orange County.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (89, 'Speech and Debate', 'Humanities', NULL, NULL, 0, 'biweekly', 'lunch', '', 'Lecture/Theater Hall', NULL, 0, 0, '', 'Automatically imported from official directory. We prepare students to take on Speech & Debate tournaments at the local, county, state, and national level. We\'ll teach you everything you need to know about public speaking, debating, and competition!', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (90, 'STEAM for All', 'Arts / Culture', NULL, NULL, 0, 'event', 'lunch', '', '1007', NULL, 0, 0, '', 'Automatically imported from official directory. STEAM for All’s mission is to inspire elementary and middle school students to pursue a lifelong passion in STEAM. Troy Chapter STEAM for All aims to help show students the interdisciplinary nature of science through events that integrate music with writing, coding with biology, and even art with math — all while enabling Troy High students to volunteer in an organization that reflects their passions (hours eligible for service awards).', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (91, 'STEMup4Youth', 'STEM', NULL, NULL, 0, 'event', 'lunch', '', '411/412', NULL, 0, 0, '', 'Automatically imported from official directory. We are a nonprofit volunteer organization dedicated to bringing fun, hands-on STEM activities to children in underserved communities. We go to various Boys and Girls Clubs, libraries and more on a weekly basis where volunteers can earn hours, learn leadership and communication skills, and make new friends!', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (92, 'Teaching International English (TIE)', 'Other', NULL, NULL, 0, 'event', 'lunch', '', '908', NULL, 0, 0, '', 'Automatically imported from official directory. Teaching English to students in South Korea and China online. Our mission: To increase the intercultural competence of Troy and address the growing worldwide need for English teachers by forging international bonds between our student body and those of foreign countries through the teaching of English.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (93, 'The 17 Goals', 'STEM', NULL, NULL, 0, 'biweekly', 'lunch', '', '315', NULL, 0, 0, '', 'Automatically imported from official directory. 17 Goals focuses on educating and improving on the UN’s 17 Goals, like no hunger and clean water. Service hours available!', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (94, 'The Japanese Culture Club', 'Arts / Culture', NULL, NULL, 0, 'event', 'lunch', '', '507', NULL, 0, 0, '', 'Automatically imported from official directory. Our club is a lively community where we explore Japan’s rich traditions, language, and history through fun and interactive activities while creating a safe environment for students. Whether you’re into anime, the Japanese food, calligraphy, or just curious about the culture, there’s something here for everyone!', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (95, 'The Middle Eastern Cultural Club', 'Arts / Culture', NULL, NULL, 0, 'biweekly', 'lunch', '', '1007', NULL, 0, 0, '', 'Automatically imported from official directory. We foster a community for the collaboration and representation of all peoples of the diverse region of the Middle East! We hold potlucks, and participate in events to raise awareness for the cultures of our underrepresented diverse demographic. Anyone including non-Middle Eastern ethnicities can join and engage with our community!', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (96, 'The Nutrition Club (aka. The Nut Club)', 'Social Impact / Service', NULL, NULL, 0, 'biweekly', 'lunch', '', '908', NULL, 0, 0, '', 'Automatically imported from official directory. Troy\'s Nutrition Club is a student led club that promotes wellbeing, offers unconditional support, and puts health before all (mental health, physical health). Nutrition Club\'s goal is to push students to live with intention (health challenges/goals), and our core value is for all of our members to take care of themselves.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (97, 'The Poétique', 'Other', NULL, NULL, 0, 'event', 'after_school', 'TBD', 'TBD', NULL, 0, 0, '', 'Automatically imported from official directory.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (98, 'The Well Christian Club', 'Faith / Identity / Other', NULL, NULL, 0, 'event', 'lunch', '', '308', NULL, 0, 0, '', 'Automatically imported from official directory. This club contributes to Troy High School by providing a community where brothers and sisters in Christ can come from all walks of life to pursue a deeper relationship with God. We help Christians and also Troy students in general to pursue intimacy with Jesus by getting to know Him more and also by making Him more known.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (99, 'Troy Finance & Economics Club', 'Other', NULL, NULL, 0, 'event', 'lunch', '', '313', NULL, 0, 0, '', 'Automatically imported from official directory. Troy Finance & Economics Club develops students with financial literacy, investing skills, and economic knowledge through lectures, simulations, and competitions, fostering leadership, critical thinking, and career readiness for success in college, careers, and lifelong financial decision-making.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (100, 'Troy High Book Club', 'Social Impact / Service', NULL, NULL, 0, 'biweekly', 'lunch', '', '412/ Wellness Center', NULL, 0, 0, '', 'Automatically imported from official directory. Troy High Book Club is a welcoming community for those interested in reading books and discussing them with peers. Each month we vote on a book to read and we discuss it at each meeting.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (101, 'Troy High Chinese Cultural Appreciation Club', 'Arts / Culture', NULL, NULL, 0, 'biweekly', 'lunch', '', '324', NULL, 0, 0, '', 'Automatically imported from official directory. The Chinese Cultural Appreciation Club educates students on the various intricacies behind Chinese culture and tradition through engaging PowerPoints, games, hands-on activities, and etc. It teaches the value of cultural acceptance and sensitivity and provides opportunities for club members to make a difference in their community by volunteering.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (102, 'Troy Media and Pop Culture Club', 'Arts / Culture', NULL, NULL, 0, 'biweekly', 'lunch', '', '1003', NULL, 0, 0, '', 'Automatically imported from official directory. The club centered around analyzing and discussing different forms of media, primarily movies and films, to discover their impacts on pop culture and society as it is today.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (103, 'Troy Model United Nations (MUN)', 'Other', NULL, NULL, 0, 'event', 'lunch', '', '512', NULL, 0, 0, '', 'Automatically imported from official directory. MUN allows its members to compete in conferences that simulate how attending a real UN meeting would be like. Through this club members will be able to win awards, better their communication, collaborative and speaking skills.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (104, 'Troy Preparedness Club', 'Arts / Culture', NULL, NULL, 0, 'event', 'lunch', '', '401', NULL, 0, 0, '', 'Automatically imported from official directory. TPC is dedicated to promoting preparedness among students, offering certificated training and resources (Fullerton CERT/Fire Department) to equip students with essential skills and knowledge, such as first aid, fire safety, and disaster preparedness to prepare them to effectively protect themselves and assist others in real-life emergency situations.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (105, 'Troy Robotics', 'STEM', NULL, NULL, 0, 'event', 'lunch', '', '408/425', NULL, 0, 0, '', 'Automatically imported from official directory. We design build and program robots for the annual FIRST Robotics competition.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (106, 'United Nations International Children\'s Emergency Fund (UNICEF)', 'STEM', NULL, NULL, 0, 'event', 'after_school', 'TBD', '304', NULL, 0, 0, '', 'Automatically imported from official directory. UNICEF is a club committed to advocating for the rights of children globally suffering from poverty through fundraising and other activities.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (107, 'Vietnamese Student Association (VSA)', 'Arts / Culture', NULL, NULL, 0, 'biweekly', 'lunch', '', '411/412', NULL, 0, 0, '', 'Automatically imported from official directory. Troy\'s VSA promotes Vietnamese cultural identity on campus; we show pride, create dances (fan, lion), host potlucks and meetings, offer community service and leadership opportunities, and strive to uplift our heritage. Troy\'s VSA collaborates with other schools VSA chapters in Southern California to encourage the celebration of Vietnamese students, people, and identity.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (108, 'WarZone', 'Social Impact / Service', NULL, NULL, 0, 'event', 'lunch', '', '526', NULL, 0, 0, '', 'Automatically imported from official directory. WarZone is Troy\'s school spirit club, we support our athletes and assist in crowd leading positions.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (109, 'Young Composers\' Society', 'Arts / Culture', NULL, NULL, 0, 'event', 'lunch', '', '323', NULL, 0, 0, '', 'Automatically imported from official directory. The Young Composers\' Society works towards equipping every Troy student interested in musical composition and arrangement with the knowledge and environment to write and share their music.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (110, 'Legion Club', 'STEM', NULL, NULL, 0, 'event', 'lunch', '', '528', NULL, 0, 0, '', 'Automatically imported from official directory. The Troy High School Legion Club will define, explain, and expand upon the ideas of strategical, tactical, logical, and logistical thinking via Powerpoint presentations and simulations. Some examples include: situation awareness, how to build and lead a team, campaigning, risk taking, evaluating, and much more.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (111, 'Troy CASC Club', 'Social Impact / Service', NULL, NULL, 0, 'biweekly', 'lunch', '', '401', NULL, 0, 0, '', 'Automatically imported from official directory. Troy High’s CASC Club teaches students about CASC, builds leadership skills, and creates opportunities to make a positive impact.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (112, 'Surfrider Foundation Club', 'Social Impact / Service', NULL, NULL, 0, 'monthly', 'lunch', '', '904', NULL, 0, 0, '', 'Automatically imported from official directory. The Surfrider club spreads awareness about ocean protection, advocates for a reduction of single-use plastics, and takes action in local coastal conservation.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (113, 'Team Korea', 'Arts / Culture', NULL, NULL, 0, 'biweekly', 'lunch', '', '308', NULL, 0, 0, '', 'Automatically imported from official directory. We are a cultural club aiming to promote Korean culture to individuals and communities through interactive cultural activities such as food, music, dance, and traditional celebrations.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (114, 'Biotech Youth Literacy Directive (BYLD)', 'STEM', NULL, NULL, 0, 'biweekly', 'lunch', '', '311', NULL, 0, 0, '', 'Automatically imported from official directory. BYLD or the Biotech Youth Literacy Directive is an education-oriented organization focused on directing biotechnology research through competition and lecture pathways to assist all passionate Bioengineers.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (115, 'American Cancer Society', 'STEM', NULL, NULL, 0, 'event', 'lunch', '', '320', NULL, 0, 0, '', 'Automatically imported from official directory. Through advocacy, fundraising, and policy, we elevate patient and caregiver stories to support people with cancer. This nationally recognized organization provides high schoolers with opportunities to engage with their research, education, and patient services.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (116, 'Silver PAGE (Preparing Authors for Growth & Exploration)', 'Social Impact / Service', NULL, NULL, 0, 'biweekly', 'lunch', '', '333', NULL, 0, 0, '', 'Automatically imported from official directory. Silver PAGE strives to assist younger children on developing concrete writing skills, while also supporting our members in publicist their works.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (117, 'Troy Esports Club', 'Sports & Wellness', NULL, NULL, 0, 'biweekly', 'lunch', '', '428', NULL, 0, 0, '', 'Automatically imported from official directory. The Troy Esports club will create an environment where people come together and express their interests in video games, and can be given the opportunity to play competitively.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (118, 'Care4Hair', 'STEM', NULL, NULL, 0, 'biweekly', 'lunch', '', '1002', NULL, 0, 0, '', 'Automatically imported from official directory. Educating our community on Alopecia Areata and stress-related hair loss, and leading fundraisers to help less fortunate families buy wigs for their children. Please join us in workshops, donations, and educational activities to support those with alopecia.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (119, 'Quantum Computing Club', 'STEM', NULL, NULL, 0, 'biweekly', 'lunch', '', '411', NULL, 0, 0, '', 'Automatically imported from official directory. The Quantum Computing Club explores the fundamentals and applications of quantum computing through lessons, workshops, guest speakers, and fun projects; it is open to all students with an interest!', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (120, 'Observing the Future 4Kidz', 'Arts / Culture', NULL, NULL, 0, 'biweekly', 'lunch', '', '319', NULL, 0, 0, '', 'Automatically imported from official directory. In partnership with the Fullerton Observer newspaper, we are a chapter part of a bigger club dedicated to showcasing the amazing youth of Fullerton, one story at a time. Express yourself in art and journalism while writing various articles spotlighting the activities in and around the community.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (121, 'Chroni Kids', 'Other', NULL, NULL, 0, 'biweekly', 'lunch', '', '403', NULL, 0, 0, '', 'Automatically imported from official directory.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (122, 'Learning League', 'Other', NULL, NULL, 0, 'event', 'lunch', '', '527', NULL, 0, 0, '', 'Automatically imported from official directory.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (123, 'Help a Paw (HAP)', 'Social Impact / Service', NULL, NULL, 0, 'event', 'lunch', '', '407', NULL, 0, 0, '', 'Automatically imported from official directory.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (124, 'Little Investors', 'Other', NULL, NULL, 0, 'biweekly', 'lunch', '', '1001', NULL, 0, 0, '', 'Automatically imported from official directory.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (125, 'Act of Kindness', 'Other', NULL, NULL, 0, 'event', 'lunch', '', '905', NULL, 0, 0, '', 'Automatically imported from official directory. We work to show kindness throughout the world, from hospitals to homeless shelters, and even on campus, coming from gift baskets, notes of affirmation, flowers, etc.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (126, 'The IntelStrike Research Club of Troy (IRCT)', 'Arts / Culture', NULL, NULL, 0, 'event', 'lunch', '', '420/514', NULL, 0, 0, '', 'Automatically imported from official directory. The IntelStrike Research Club aims to empower academically inclined students to engage in high-level research competitions across regional, national, and international platforms. Through rigorous preparation, mentorship, and collaboration, the club cultivates a culture of inquiry, innovation, and scholarly excellence and enable for participants to receive scholarships, internship opportunities, and national honors.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (127, 'Anime Club', 'Arts / Culture', NULL, NULL, 0, 'event', 'lunch', '', '910', NULL, 0, 0, '', 'Automatically imported from official directory. Anime club is a club dedicated to encouraging interest in all parts of the Anime industry, which we accomplish by watching and analyzing Anime during club discussions, presentations, and games.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (128, 'Dear Asian Youth', 'Faith / Identity / Other', NULL, NULL, 0, 'event', 'after_school', 'TBD', 'TBD', NULL, 0, 0, '', 'Automatically imported from official directory.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (129, 'Graduation Lei and Fundraising Club', 'STEM', NULL, NULL, 0, 'event', 'after_school', 'TBD', 'TBD', NULL, 0, 0, '', 'Automatically imported from official directory.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (130, 'INSPIRE Club', 'Arts / Culture', NULL, NULL, 0, 'event', 'lunch', '', '313', NULL, 0, 0, '', 'Automatically imported from official directory. Helping students run initiatives related to, but not limited to, social/tech startups for education. This club will be under ORIA Foundations, a larger organization dedicated to promoting youth-entrepreneurship.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (131, 'Language & Logic Club', 'Other', NULL, NULL, 0, 'event', 'after_school', 'TBD', 'TBD', NULL, 0, 0, '', 'Automatically imported from official directory.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (132, 'Orthodox Club', 'Faith / Identity / Other', NULL, NULL, 0, 'event', 'lunch', '', '506', NULL, 0, 0, '', 'Automatically imported from official directory. Our club provides a community for all the Orthodox Christians, but also introduces those that are unfamiliar with the faith on what it is about. We meet to socialize, teach about the faith, and have volunteer opportunities to volunteer at other church\'s festivals.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (133, 'Psychology Club', 'Humanities', NULL, NULL, 0, 'event', 'after_school', 'TBD', 'TBD', NULL, 0, 0, '', 'Automatically imported from official directory.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (134, 'Rotary Interact Club', 'Other', NULL, NULL, 0, 'event', 'after_school', 'TBD', 'TBD', NULL, 0, 0, '', 'Automatically imported from official directory.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (135, 'The Jazz Corner', 'STEM', NULL, NULL, 0, 'event', 'lunch', '', '416', NULL, 0, 0, '', 'Automatically imported from official directory. The Jazz Corner aim to build a community where students can explore, appreciate, and keep the spirit of jazz alive through learning, listening, and sharing together.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (136, 'THS Outreach Club', 'Other', NULL, NULL, 0, 'event', 'after_school', 'TBD', 'TBD', NULL, 0, 0, '', 'Automatically imported from official directory.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (137, 'Troy Coyotes Club', 'STEM', NULL, NULL, 0, 'biweekly', 'lunch', '', '416', NULL, 0, 0, '', 'Automatically imported from official directory. We bring environmental awareness to Troy through club lectures on local trail conservancy efforts. Additionally, our volunteering events, such as trail cleanups and group runs, promote physical use of the trails in conjunction with physical health.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (138, 'Troy High Cricket Club', 'Sports & Wellness', NULL, NULL, 0, 'biweekly', 'lunch', '', '313', NULL, 0, 0, '', 'Automatically imported from official directory. THS Cricket introduces the sport of cricket to Troy through engaging educational meetings. We explore every aspect of the game in a way that is accessible and enjoyable for everyone.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (139, 'Troy Machine Learning Club', 'STEM', NULL, NULL, 0, 'event', 'lunch', '', '312', NULL, 0, 0, '', 'Automatically imported from official directory. Our purpose is to inspire and educate in machine learning, a rapidly expanding field. We’ll learn how to use AI/ML models to create personal projects and compete in competitions.', '', 'approved', NULL, NULL);
INSERT INTO `clubs` (`id`, `name`, `subject`, `club_type`, `primary_mode`, `volunteer_hours`, `meeting_frequency`, `meeting_time_type`, `meeting_time_range`, `meeting_room`, `website_url`, `open_to_all`, `prereq_required`, `prerequisites`, `description`, `president_code`, `status`, `president_id`, `president_contact`) VALUES (142, 'Film Club', 'Arts / Culture', NULL, NULL, 0, 'event', 'after_school', 'TBD', 'TBD', NULL, 0, 0, '', 'Automatically imported from official directory.', '', 'approved', NULL, NULL);

DROP TABLE IF EXISTS `meeting_days`;
CREATE TABLE `meeting_days` (
  `id` int NOT NULL,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `meeting_days` (`id`, `name`) VALUES (5, 'Friday');
INSERT INTO `meeting_days` (`id`, `name`) VALUES (1, 'Monday');
INSERT INTO `meeting_days` (`id`, `name`) VALUES (6, 'Saturday');
INSERT INTO `meeting_days` (`id`, `name`) VALUES (7, 'Sunday');
INSERT INTO `meeting_days` (`id`, `name`) VALUES (4, 'Thursday');
INSERT INTO `meeting_days` (`id`, `name`) VALUES (2, 'Tuesday');
INSERT INTO `meeting_days` (`id`, `name`) VALUES (3, 'Wednesday');

DROP TABLE IF EXISTS `subfields`;
CREATE TABLE `subfields` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `label` (`label`)
) ENGINE=InnoDB AUTO_INCREMENT=308 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `subfields` (`id`, `label`) VALUES (7, 'Biology');
INSERT INTO `subfields` (`id`, `label`) VALUES (8, 'Chemistry');
INSERT INTO `subfields` (`id`, `label`) VALUES (1, 'Computer Science / Tech');
INSERT INTO `subfields` (`id`, `label`) VALUES (4, 'Math / Data');
INSERT INTO `subfields` (`id`, `label`) VALUES (12, 'Medicine & Health');
INSERT INTO `subfields` (`id`, `label`) VALUES (9, 'Physics / Engineering');

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
