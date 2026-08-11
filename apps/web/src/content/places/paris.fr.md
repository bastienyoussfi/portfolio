---
title: Paris
date: 2026-08-11
coords: [48.8566, 2.3522]
country: France
---

Exemple — à remplacer par un vrai endroit. Ce fichier documente le format ;
dupliquez-le pour chaque lieu, puis supprimez celui-ci.

Un endroit se compose de deux fichiers, un par langue :
`src/content/places/mon-slug.fr.md` et `src/content/places/mon-slug.en.md`.
Le slug devient l'URL — `/places/mon-slug`.

## L'entête

`title`, `date` et `coords` sont obligatoires. Les coordonnées sont en degrés
décimaux, latitude d'abord : `coords: [48.8566, 2.3522]`. C'est ce qui place le
point sur la carte — récupérez-les d'un clic droit sur Google Maps.

`country` et `image` sont facultatifs. `image` est la vignette 64×40 de la
liste ; les photos de l'histoire, elles, vont dans le corps du texte.

## Les photos

Déposez les images dans `public/places/` et appelez-les normalement :

![Une légende, qui sert aussi de texte alternatif](/places/exemple.jpg)

Elles prennent toute la largeur de la colonne, avec les coins arrondis du reste
du site. Une image par paragraphe respire mieux qu'une grille serrée.

## L'histoire

Écrivez comme vous voulez : les titres `##` alimentent le sommaire à gauche, et
le reste du markdown fonctionne comme sur le blog.
