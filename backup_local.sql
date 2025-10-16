-- MySQL dump 10.13  Distrib 9.4.0, for macos15.4 (arm64)
--
-- Host: localhost    Database: lastdiscover_local
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `img` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'🐠 Vida Marina','Descubre las criaturas fascinantes que habitan los océanos, desde corales y medusas hasta tiburones y ballenas.','https://res.cloudinary.com/dkm0ahny1/image/upload/v1760082986/marine-life_plsxer.png'),(2,'🌊 Ecosistemas Oceánicos','Explora los ecosistemas marinos: arrecifes, abismos, costas y sus delicados equilibrios naturales.','https://res.cloudinary.com/dkm0ahny1/image/upload/v1760082986/ocean-ecosystems_gcdz5g.png'),(3,'🔬 Ciencia y Exploración','Acompaña a los científicos en sus investigaciones y descubre cómo se estudia la vida en las profundidades.','https://res.cloudinary.com/dkm0ahny1/image/upload/v1760082985/science-exploration_avjfbv.png'),(4,'⚠️ Problemas y Amenazas','Conoce los peligros que enfrentan los mares: contaminación, cambio climático y sobrepesca.','https://res.cloudinary.com/dkm0ahny1/image/upload/v1760082985/problems-threats_muxnh2.png'),(5,'🌍 Regiones y Océanos del Mundo','Explora los océanos del planeta: Atlántico, Pacífico, Índico, Ártico y Antártico.','https://res.cloudinary.com/dkm0ahny1/image/upload/v1760082989/world-regions_lr5pbp.png');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `userId` int unsigned NOT NULL,
  `postId` int unsigned NOT NULL,
  PRIMARY KEY (`userId`,`postId`),
  KEY `postId` (`postId`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (1,1),(2,1),(2,2),(1,3),(2,3),(1,4),(2,4),(2,5),(1,15),(2,15),(2,16),(1,19),(2,19),(1,22),(2,24);
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_categories`
--

DROP TABLE IF EXISTS `post_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_categories` (
  `postId` int unsigned NOT NULL,
  `categoryId` int unsigned NOT NULL,
  PRIMARY KEY (`postId`,`categoryId`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `post_categories_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `post_categories_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_categories`
--

LOCK TABLES `post_categories` WRITE;
/*!40000 ALTER TABLE `post_categories` DISABLE KEYS */;
INSERT INTO `post_categories` VALUES (1,1),(2,1),(3,1),(4,1),(5,1),(6,2),(7,2),(8,2),(9,2),(10,2),(11,3),(12,3),(13,3),(14,3),(15,3),(16,4),(17,4),(18,4),(19,4),(20,4),(21,5),(22,5),(23,5),(24,5),(25,5);
/*!40000 ALTER TABLE `post_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_images`
--

DROP TABLE IF EXISTS `post_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_images` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `postId` int unsigned NOT NULL,
  `url` varchar(500) NOT NULL,
  `caption` varchar(500) DEFAULT NULL,
  `credit` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `postId` (`postId`),
  CONSTRAINT `post_images_ibfk_1` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_images`
--

LOCK TABLES `post_images` WRITE;
/*!40000 ALTER TABLE `post_images` DISABLE KEYS */;
INSERT INTO `post_images` VALUES (1,1,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760511058/IN2022V09New-speciesPorcelain-crab-Porcellanella-brevidentataCSIROCindy-Bessey_mvfyax.jpg',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(2,2,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760510623/2-Guitar-Shark_Rhinobatos-sp.-The-Nippon-Foundation-Nekton-Ocean-Census-_-Sergey-Bogorodsky-_-2025_pychlz.jpg',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(3,3,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760511175/glass-squid_oxevif.webp',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(4,4,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760511265/Bathylepeta_wadatsumi_2_ilwnhw.jpg',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(5,5,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760511358/FKt250712-S0812-20250726T182941Z-340-scicam-PatrickStar-scaled_vy5hkq.jpg',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(6,6,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760512005/Screenshot_2025-10-15_at_08.59.12_uc2eqk.png',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(7,7,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760521864/9993DD0F-0E04-4C00-A56C6FFCCBC763DD_source_q77gxv.webp',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(8,8,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760512113/Life-Thrives-In-The-Deepest-Ocean_t2mfmh.jpg',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(9,9,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760512205/Screenshot_2025-10-15_at_09.09.26_b2umkl.png',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(10,10,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760512433/RV_Polarstern_during_CONTRASTS_kvx1io.jpg',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(11,11,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760512624/life-found-flourishing_rl55nz.jpg',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(12,12,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760513224/an-upgraded-alvin-puts_i5ykku.jpg',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(13,13,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760513298/FKt231218_Seamount_4_2681m_hi_res-1-scaled_fg8frw.jpg',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(14,14,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760514272/493_hrdjv2.avif',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(15,15,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760521771/Hesperides1_uksfrm.jpg',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(16,16,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760514636/1674_rycsy2.avif',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(17,17,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760514686/3446_y7ug8w.avif',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(18,18,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760514743/4_29a_DSCN6050.JPG_igpb27.webp',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(19,19,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760521941/767716_imagen2_-voluntario-recogiendo-microplaisticos-en-playa-1.png_yvf9k4.png',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(20,20,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760514821/R89eWC7KM9bXRF3XYNK9C4-1200-80.jpg_ekuahz.webp',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(21,22,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760515052/1668_lntrrb.avif',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(22,23,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760515127/Screenshot_2025-10-15_at_09.58.37_uqmvjn.png',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(23,24,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760515187/c40c293_sirius-fs-upload-1-jgrvomnoahmx-1746626561770-sipa-00836626-000004_yipluc.avif',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40'),(24,25,'https://res.cloudinary.com/dkm0ahny1/image/upload/v1760515245/Philippine_reef_dn9u2e.jpg',NULL,NULL,'2025-10-16 11:33:40','2025-10-16 11:33:40');
/*!40000 ALTER TABLE `post_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userId` int unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `credits` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,1,'Nuevo tiburón linterna y cangrejo porcelana descubiertos en el mar profundo frente a Australia','En una expedición liderada por el CSIRO en 2022, se identificaron dos especies nuevas: un tiburón linterna de Australia Occidental (Etmopterus westraliensis) y un cangrejo porcelana (Porcellanella brevidentata). El tiburón fue hallado a unos 610 m de profundidad y el cangrejo vive en simbiosis con corales blandos.','https://www.csiro.au/en/news/All/Articles/2025/October/New-species-of-shark-and-crab','2025-10-16 11:33:40','2025-10-16 11:33:40'),(2,1,'Más de 800 nuevas especies marinas descubiertas por el Ocean Census','El proyecto global Ocean Census anunció el descubrimiento de 866 nuevas especies marinas, incluidos tiburones, corales, esponjas, crustáceos y más, en profundidades que van de 1 a 4.990 metros.','https://oceancensus.org/press-release-the-ocean-census-discovers-over-800-new-marine-species/','2025-10-16 11:33:40','2025-10-16 11:33:40'),(3,1,'Extrañas formas de vida descubiertas en el cañón Mar del Plata: langostas rosadas y calamares translúcidos','En el cañón submarino frente a Argentina, exploraciones ROV revelaron decenas de posibles especies nuevas, entre las cuales se observan langostas de color pastel, calamares de apariencia inusual y otras criaturas abisales.','https://www.scientificamerican.com/article/strange-deep-sea-animals-discovered-in-underwater-argentine-canyon/','2025-10-16 11:33:40','2025-10-16 11:33:40'),(4,1,'La limática más profunda descrita hasta ahora: Bathylepeta wadatsumi','Se descubrió una nueva especie de limática (molusco) viviendo a 5.922 metros de profundidad en el Pacífico noroeste. Este hallazgo marca el récord de la limática verdadera que más profundo se ha registrado hasta la fecha.','https://en.wikipedia.org/wiki/Bathylepeta_wadatsumi','2025-10-16 11:33:40','2025-10-16 11:33:40'),(5,1,'Esponjas, corales y decenas de especies nuevas descubiertas en Mar del Plata con tecnología de punta','En una investigación con tecnología avanzada en el cañón de Mar del Plata, científicos sospechan haber encontrado más de 40 especies nuevas — incluyendo coral rojo del género Anthomastus, esponjas, equinodermos y otros organismos de aguas profundas.','https://schmidtocean.org/first-high-tech-exploration-of-argentinas-mar-del-plata-canyon-inspires-millions/','2025-10-16 11:33:40','2025-10-16 11:33:40'),(6,1,'Oasis quimiosintéticos hallados en lo profundo del Pacífico','En las fosas de Kuril-Kamchatka y Aleutianas, un equipo científico ha descubierto ecosistemas vivos basados en quimiosíntesis hasta los 9.533 metros de profundidad. Estas comunidades, que incluyen gusanos tubícolas, almejas blancas y otros organismos, se alimentan de químicos como sulfuros e hidrocarburos, en ausencia total de luz.','https://www.reuters.com/business/environment/vibrant-oasis-chemical-eating-creatures-found-deep-pacific-2025-07-30/','2025-10-16 11:33:40','2025-10-16 11:33:40'),(7,1,'Conexiones evolutivas globales entre ecosistemas marinos profundos mediante “autopistas” del fondo oceánico','Un estudio que analizó estrellas frágiles (“brittle stars”) recolectadas en todo el mundo —desde latitudes tropicales a polares, y desde aguas poco profundas hasta más de 3.500 metros de profundidad— detectó que especies muy distantes tienen parentescos cercanos. Esto sugiere que hay corrientes oceánicas profundas que actúan como vías de dispersión evolutiva que conectan ecosistemas marinos globales.','https://www.theguardian.com/environment/2025/jul/24/ancient-alien-brittle-stars-linked-to-relatives-across-the-globe-by-a-deep-sea-evolutionary-superhighway','2025-10-16 11:33:40','2025-10-16 11:33:40'),(8,1,'Zona hadal de la Fosa de las Marianas: diversidad microbiológica extraordinaria','Proyecto MEER revela que en la zona hadal (más de 6.000 metros de profundidad) de la Fosa de las Marianas existe una biodiversidad microbiana enorme e inexplorada. Se identificaron miles de genomas nuevos, en su mayoría desconocidos hasta ahora, con adaptaciones genéticas para resistir presiones extremas, temperaturas bajas y escasez de nutrientes.','https://astrobiology.com/2025/03/life-thrives-in-the-deepest-ocean-new-discoveries-from-the-mariana-trench.html','2025-10-16 11:33:40','2025-10-16 11:33:40'),(9,1,'El calentamiento de los océanos de Nueva Zelanda va 34 % más rápido que la media global','Un informe del Ministerio de Medio Ambiente de Nueva Zelanda muestra que las aguas oceánicas en esa región se están calentando a un ritmo un 34 % superior al promedio global. Esto provoca cambios en corrientes oceánicas, ecosistemas costeros y marinos, y supone riesgos para hábitats, especies, industrias pesqueras y comunidades costeras.','https://www.theguardian.com/world/2025/oct/08/new-zealand-oceans-warming-34-per-cent-faster-than-global-average?utm_source=chatgpt.com','2025-10-16 11:33:40','2025-10-16 11:33:40'),(10,1,'Expedición CONTRASTS: nuevos datos sobre derretimiento del hielo en el Ártico y efectos sobre ecosistemas marinos','La expedición Contrasts (julio-septiembre 2025) estudió hielos marinos de diferentes tipos (nuevo, multianual) en el Ártico Central para entender mejor cómo responden estos hielos al cambio climático, y cómo ese cambio afecta los ecosistemas marinos que dependen de ellos, incluyendo especies adaptadas al hielo, corrientes, nutrientes y redes tróficas.','https://en.wikipedia.org/wiki/CONTRASTS_Expedition','2025-10-16 11:33:40','2025-10-16 11:33:40'),(11,1,'Miles de especies microbianas halladas en la región más profunda del océano (Fosa de las Marianas)','En una serie de 33 inmersiones realizadas por el sumergible Fendouzhe, investigadores recolectaron muestras de sedimentos y agua en profundidades entre 6.000 y 10.900 metros en la Fosa de las Marianas. Identificaron unas 7.564 especies microbianas, de las cuales ~89,4 % no habían sido reportadas previamente, incluyendo virus y procariontes con adaptaciones genéticas para resistir alta presión, temperaturas bajísimas y escasez de nutrientes.','https://phys.org/news/2025-03-mariana-trench-lifeforms-flourishing-deep.html','2025-10-16 11:33:40','2025-10-16 11:33:40'),(12,1,'Submarino Alvin mejora para alcanzar profundidades nunca antes exploradas por él (~6.500 metros)','El ya legendario vehículo habitado Alvin ha sido sometido a una mejora significativa que le permite ahora alcanzar los 6.500 metros de profundidad, superando su límite anterior de aproximadamente 4.500 metros. Esto aumenta enormemente el rango del fondo oceánico que puede ser observado directamente por seres humanos, lo que abre nuevas oportunidades para explorar hábitats, geología y biología profunda que antes estaban fuera de alcance.','https://phys.org/news/2025-02-alvin-ocean-depths.html','2025-10-16 11:33:40','2025-10-16 11:33:40'),(13,1,'Cuatro nuevos montes submarinos descubiertos en aguas internacionales entre Costa Rica y Chile','Durante un tránsito de mapeo realizado por el buque Falkor (too) del Schmidt Ocean Institute, se identificaron cuatro montes submarinos en aguas internacionales, con alturas que varían entre los ~1.591 metros hasta ~2.681 metros, siendo el más grande de ellos de 2.681 metros de altura, y localizado a ~1.150 metros bajo la superficie del mar.','https://schmidtocean.org/four-new-seamounts-discovered-in-the-high-seas/','2025-10-16 11:33:40','2025-10-16 11:33:40'),(14,1,'Mapeo de cientos de cañones submarinos antárticos para entender el cambio climático','Científicos de la Universidad de Barcelona y del University College Cork han cartografiado 332 redes de cañones submarinos en la Antártida usando datos de batimetría de alta resolución. Algunos de estos cañones tienen profundidades mayores a 4.000 metros. Estos vallones tienen impacto sobre la circulación oceánica, el transporte de sedimentos, el comportamiento de las plataformas de hielo, y por tanto sobre dinámicas de cambio climático y elevación del nivel del mar.','https://www.theguardian.com/environment/2025/jul/31/scientists-map-antarctic-seafloor-canyons-to-help-predict-climate-change','2025-10-16 11:33:40','2025-10-16 11:33:40'),(15,1,'Red de interacciones microbianas del océano revelada más allá de la superficie','Un estudio liderado por el Institut de Ciències del Mar (CSIC, Barcelona) mostró que las interacciones entre microorganismos oceánicos (bacterias, archaea, picoeucariotas) cambian mucho según la profundidad y la región geográfica. Se encontró que mientras algunas asociaciones microbianas son globales a ciertas profundidades, un alto porcentaje son específicas de regiones y profundidades, siendo las zonas profundas (como la bathipelágica) donde hay menos asociaciones globales y más particularidad regional.','https://www.sciencedaily.com/releases/2024/01/240113143637.htm','2025-10-16 11:33:40','2025-10-16 11:33:40'),(16,1,'Ondas de calor marinas cada vez más frecuentes en costas de Reino Unido e Irlanda','Un estudio reciente indica que las olas de calor marinas (episodios donde la temperatura del mar se eleva mucho sobre lo normal) se han vuelto mucho más probables en las costas británicas e irlandesas. Por ejemplo, en el Mar de Irlanda (Celtic Sea) la probabilidad de tales eventos pasó de ~3,8 % en 1993 a ~13,8 %. Estos eventos afectan ecosistemas marinos, reproducción de especies, salud de algas, coral, etc.','https://www.theguardian.com/environment/2025/oct/07/marine-heatwaves-more-frequent-uk-irish-coasts-experts-say','2025-10-16 11:33:40','2025-10-16 11:33:40'),(17,1,'Acidez oceánica ha cruzado umbral crítico global para la vida marina','Informe del Potsdam Institute for Climate Impact Research muestra que los océanos del mundo han superado un umbral crítico de acidez. Desde la era preindustrial, el pH del océano superficial ha bajado (~0,1 unidades), lo que implica ~30-40 % más acidez. Esto debilita organismos que necesitan carbonato de calcio (corales, conchas, esqueletos), y amenaza cadenas alimenticias marinas y ecosistemas costeros.','https://www.theguardian.com/environment/2025/sep/24/worlds-oceans-fail-key-health-check-as-acidity-crosses-critical-threshold-for-marine-life','2025-10-16 11:33:40','2025-10-16 11:33:40'),(18,1,'Microplásticos presentes en todas las profundidades del océano','Estudio apoyado por la National Science Foundation muestra que microplásticos (fragmentos de plástico muy pequeños) no solo flotan en la superficie, sino que están presentes hasta en zonas abisales, incluso en la Fosa de las Marianas. Esto supone que la contaminación plástica se infiltra toda la cadena alimentaria marina, y podría tener impactos en especies, salud humana y economía pesquera.','https://www.nsf.gov/news/researchers-discover-microplastics-all-ocean-depths','2025-10-16 11:33:40','2025-10-16 11:33:40'),(19,2,'Riesgos para la salud humana vinculados a microplásticos costeros','Investigaciones indican que personas que viven cerca de costas con niveles muy altos de microplásticos tienen mayores tasas de enfermedades metabólicas como diabetes tipo 2, enfermedades coronarias y accidentes cerebrovasculares, en comparación con quienes viven cerca de aguas menos contaminadas. Esto sugiere que la contaminación plástica no es solo ambiental, también un problema de salud pública.','https://newsroom.heart.org/news/living-near-an-ocean-polluted-by-microplastics-may-increase-cardiometabolic-disease-risk','2025-10-16 11:33:40','2025-10-16 11:33:40'),(20,1,'Temperaturas oceánicas globales afectan al 96 % de los mares con olas de calor extremas en 2023','Un estudio publicado en Science encontró que durante 2023 el 96 % de los océanos experimentaron olas de calor extremas, más intensas y prolongadas que el promedio histórico. Estas condiciones alteran el ecosistema: coral, fauna marina, productividad primaria, etc.','https://www.livescience.com/planet-earth/rivers-oceans/96-percent-of-oceans-worldwide-experienced-extreme-heatwaves-in-2023-new-study-finds','2025-10-16 11:33:40','2025-10-16 11:33:40'),(21,1,'Los océanos de Nueva Zelanda se calientan un 34 % más rápido que el promedio mundial','Según un informe del gobierno de Nueva Zelanda, las aguas marinas del país están aumentando su temperatura a una tasa un 34 % superior al promedio global. Esto está provocando olas marinas de calor más frecuentes, acidificación, impacto en ecosistemas costeros, y consecuencias económicas y para la infraestructura.','https://www.theguardian.com/world/2025/oct/08/new-zealand-oceans-warming-34-per-cent-faster-than-global-average?utm_source=chatgpt.com','2025-10-16 11:33:40','2025-10-16 11:33:40'),(22,1,'Olas de calor marinas gigantes en el sudeste asiático y el Pacífico','En 2024, una ola de calor marino afectó ~40 millones de km² de océano en el Sudeste Asiático y Pacífico, un área cinco veces mayor que Australia. La anomalía térmica, junto con otros factores como acidificación y niveles elevados del mar, dañó ecosistemas como arrecifes de coral, y afectó tanto a la biodiversidad como a comunidades humanas costeras.','https://www.theguardian.com/environment/2025/jun/05/marine-heatwave-found-to-have-engulfed-area-of-ocean-five-times-the-size-of-australia','2025-10-16 11:33:40','2025-10-16 11:33:40'),(23,1,'Desplazamiento de poblaciones de atún en el Pacífico: impacto en Tuvalu y otras islas','El calentamiento de los océanos está empujando las poblaciones de atún lejos de las aguas tradicionales de Tuvalu y otras naciones isleñas del Pacífico. Esto está reduciendo los capturas locales y afectando ingresos que dependen de las licencias de pesca, con proyecciones de pérdidas de hasta el 25 % de la pesca de atún para 2050 si continúa la tendencia.','https://www.washingtonpost.com/world/interactive/2025/pacific-tuna-climate-change-tuvalu/','2025-10-16 11:33:40','2025-10-16 11:33:40'),(24,1,'Partes del Ártico y Antártida alteradas por derretimiento de hielo y cambio de color del océano','En regiones polares, el derretimiento del hielo marino está modificando la cantidad y tipo de luz que penetra en el océano. Con menos hielo reflejando la luz, más luz azul alcanza el agua, lo que está cambiando la comunidad de algas y fitoplancton. Esto puede afectar a toda la cadena alimenticia oceánica, así como al ciclo del carbono.','https://www.lemonde.fr/en/environment/article/2025/05/08/melting-sea-ice-alters-color-of-arctic-and-antarctic-oceans_6741053_114.html','2025-10-16 11:33:40','2025-10-16 11:33:40'),(25,2,'Los arrecifes de coral del Sudeste Asiático muy amenazados por pesca destructiva y contaminación costera','En el Sudeste Asiático, más del 50 % de los arrecifes de coral están bajo amenaza alta o muy alta. Las causas principales incluyen sobrepesca, pesca destructiva (como con explosivos o cianuro), sedimentación por deforestación o actividades agrícolas y contaminación desde la tierra.','https://en.wikipedia.org/wiki/Southeast_Asian_coral_reefs','2025-10-16 11:33:40','2025-10-16 11:33:40');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('001-create-users.js'),('002-create-posts.js'),('003-create-categories.js'),('004-create-post-categories.js'),('005-create-post-image.js'),('006-create-likes.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `img` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','Admin','User','admin@example.com','$2b$10$aRI3FCLjkXY9ZYrVW1dtQei5pT3QyGuOCJqBJ8ZdvPngGQnaGHMBG','admin','https://res.cloudinary.com/dkm0ahny1/image/upload/v1760485034/bo0ny7dwp79n8xaweysr.png','2025-10-16 11:33:40','2025-10-16 11:33:40'),(2,'irina','Irina','Tiron','irinatiron16@gmail.com','$2b$10$aRI3FCLjkXY9ZYrVW1dtQei5pT3QyGuOCJqBJ8ZdvPngGQnaGHMBG','admin','https://res.cloudinary.com/dkm0ahny1/image/upload/v1760090090/irina_fvp1m3.png','2025-10-16 11:33:40','2025-10-16 11:33:40');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-16 22:10:22
