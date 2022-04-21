-- phpMyAdmin SQL Dump
-- version 4.9.3
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le :  jeu. 20 mai 2021 à 11:05
-- Version du serveur :  5.7.26
-- Version de PHP :  7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données :  `3wa_blog`
--

-- --------------------------------------------------------

--
-- Structure de la table `Author`
--

CREATE TABLE `Author` (
  `Id` tinyint(3) UNSIGNED NOT NULL,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `Author`
--

INSERT INTO `Author` (`Id`, `FirstName`, `LastName`) VALUES
(1, 'Lovely', 'Love'),
(2, 'Twa', 'Mwa');

-- --------------------------------------------------------

--
-- Structure de la table `Category`
--

CREATE TABLE `Category` (
  `Id` tinyint(3) UNSIGNED NOT NULL,
  `Name` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `Category`
--

INSERT INTO `Category` (`Id`, `Name`) VALUES
(3, 'Lai Non Binèreuh'),
(2, 'Lé gars'),
(1, 'Lé koupines');

-- --------------------------------------------------------

--
-- Structure de la table `Comment`
--

CREATE TABLE `Comment` (
  `Id` mediumint(8) UNSIGNED NOT NULL,
  `NickName` varchar(30) DEFAULT NULL,
  `Contents` text NOT NULL,
  `CreationTimestamp` datetime NOT NULL,
  `Post_Id` smallint(5) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `Comment`
--

INSERT INTO `Comment` (`Id`, `NickName`, `Contents`, `CreationTimestamp`, `Post_Id`) VALUES
(6, 'Ta besta', 'Oué ta trop rézon c abusé! vi1 on boi de la smirnoff ice et on fume des mentol pour se rebélé !', '2020-05-26 15:17:37', 6),
(7, 'Kévin', 'G un scoot si tu vE moi !', '2020-05-26 15:17:55', 6),
(12, 'Jessica ', 'c pk t tro cheum', '2020-05-28 11:41:01', 7),
(13, 'Lovely Star', 'Tu tcalm tt de suite Jessica, je c où tabit je v te prendr en 1V1 tu va pa comprendr', '2020-05-28 11:45:35', 7),
(15, 'Brian', 'jtle ldiiraiis a 16h park auchan su mSn\' biisOuS\r\n', '2020-05-28 11:50:28', 6),
(16, 'Jessica', 'Vazy rdv mercredi a la récré. T juste dead meuf', '2020-05-28 11:53:22', 7),
(17, 'Kevin', 'Tu la touch jte cass en 4 ok ?', '2020-05-28 11:54:50', 7),
(18, 'Brian', 'Oui en 8 mêm', '2020-05-28 11:56:52', 7),
(19, 'Moh', 'Kev et Briann vous deu jvou peta cbon ?', '2020-05-28 12:00:09', 7),
(20, 'Madame Dubois', 'Les enfants, vous recevrez bientôt une convocation chez le CPE.', '2020-05-28 12:08:00', 7),
(21, 'K-popLover', 'Hey HEy\r\n\r\nQui est fan de K-pop ? <3\r\n\r\n', '2020-05-28 12:54:11', 7),
(22, 'K-popLover', 'Jessica, Lovely Star, vené on fé une dance, genre Genie', '2020-05-28 12:54:46', 7),
(23, 'Ta besta', '<a href=\"https://google.com\"> coucou </a>', '2020-05-28 15:08:33', 7),
(24, 'test', 'test', '2020-10-16 15:05:48', 6),
(25, '', '', '2020-10-16 15:06:16', 6),
(26, 'luc', 'deterrage de topic je ferme', '2020-10-19 12:48:38', 7),
(27, 'Jean', 'WOUAHOU TRO FAUR', '2021-04-07 15:48:55', 6),
(28, 'bobo', 'Je suis un gros bobo parisien!', '2021-04-08 15:09:46', 6),
(29, 'anthony', 'Wai CYCKA BLYAT fraiRo', '2021-05-18 14:05:44', 6);

-- --------------------------------------------------------

--
-- Structure de la table `Post`
--

CREATE TABLE `Post` (
  `Id` smallint(5) UNSIGNED NOT NULL,
  `Title` varchar(100) NOT NULL,
  `Contents` text NOT NULL,
  `CreationTimestamp` datetime NOT NULL,
  `Author_Id` tinyint(3) UNSIGNED DEFAULT NULL,
  `Category_Id` tinyint(3) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `Post`
--

INSERT INTO `Post` (`Id`, `Title`, `Contents`, `CreationTimestamp`, `Author_Id`, `Category_Id`) VALUES
(6, 'ma mR me fé tro chié', 'Aujourd\'hui ma mR a pa voulu m\'acheté un scooter ! Franchement c tro abusé koi !!! En vré je sui tro une adulte mé elle m\'empeche d\'ê independante koi ! Je la deteste starfoula ! L é tro miskine koi ', '2020-05-26 15:16:52', 1, 1),
(7, 'La vi c toujour tro nul', 'Kikou tou le monde !\r\nLa vi c tro de la merde Kévin a choP 7 pouf de Jessica ! G tro le seum !!!!!!!! :( ', '2020-05-28 11:40:37', 1, 2);

-- --------------------------------------------------------

--
-- Structure de la table `User`
--

CREATE TABLE `User` (
  `Id` int(11) NOT NULL,
  `Email` varchar(120) NOT NULL,
  `Password` varchar(120) NOT NULL,
  `Role` varchar(10) NOT NULL,
  `FirstName` varchar(60) NOT NULL,
  `LastName` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `User`
--

INSERT INTO `User` (`Id`, `Email`, `Password`, `Role`, `FirstName`, `LastName`) VALUES
(7, 'gege.riri@gmail.com', '$2b$10$ci5vI.FB2tPsH2hPVrmp5O8PXKqkHMkr1YwYYpRzdSA.EVXT6AyZG', 'admin', 'Gérard', 'Ricard'),
(8, 'jcvd@gmail.com', '$2b$10$xltuZJgD/gFfwNs2pXzy.es2YGCXmXEVTgR8W/cg3r1wiH.2CAGr2', 'user', 'Jean-Claude', 'Vandamme'),
(9, 'blabla@gmail.com', '$2b$10$vzEO5xQNSykwA8oLRygN2ujhiJ8zCvTfp8PqeUjTsPrXrmR.iFkWi', 'admin', 'antoine', 'monesma');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Author`
--
ALTER TABLE `Author`
  ADD PRIMARY KEY (`Id`);

--
-- Index pour la table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Name` (`Name`);

--
-- Index pour la table `Comment`
--
ALTER TABLE `Comment`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `CreationTimestamp` (`CreationTimestamp`),
  ADD KEY `Post_Id` (`Post_Id`);

--
-- Index pour la table `Post`
--
ALTER TABLE `Post`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Title` (`Title`),
  ADD KEY `CreationTimestamp` (`CreationTimestamp`),
  ADD KEY `Author_Id` (`Author_Id`),
  ADD KEY `Category_Id` (`Category_Id`);

--
-- Index pour la table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Author`
--
ALTER TABLE `Author`
  MODIFY `Id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `Category`
--
ALTER TABLE `Category`
  MODIFY `Id` tinyint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `Comment`
--
ALTER TABLE `Comment`
  MODIFY `Id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT pour la table `Post`
--
ALTER TABLE `Post`
  MODIFY `Id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `User`
--
ALTER TABLE `User`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Comment`
--
ALTER TABLE `Comment`
  ADD CONSTRAINT `Comment_ibfk_1` FOREIGN KEY (`Post_Id`) REFERENCES `Post` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `Post`
--
ALTER TABLE `Post`
  ADD CONSTRAINT `Post_ibfk_1` FOREIGN KEY (`Author_Id`) REFERENCES `Author` (`Id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Post_ibfk_2` FOREIGN KEY (`Category_Id`) REFERENCES `Category` (`Id`) ON DELETE SET NULL ON UPDATE CASCADE;
