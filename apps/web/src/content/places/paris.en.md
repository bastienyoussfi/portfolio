---
title: Paris
date: 2026-08-11
coords: [48.8566, 2.3522]
country: France
---

Example — replace this with a real place. The file documents the format;
duplicate it for each place, then delete this one.

A place is two files, one per language:
`src/content/places/my-slug.fr.md` and `src/content/places/my-slug.en.md`.
The slug becomes the URL — `/places/my-slug`.

## Frontmatter

`title`, `date` and `coords` are required. Coordinates are decimal degrees,
latitude first: `coords: [48.8566, 2.3522]`. That is what puts the dot on the
map — right-click a spot in Google Maps to copy them.

`country` and `image` are optional. `image` is the 64×40 thumbnail in the list;
the photos for the story go in the body instead.

## Photos

Drop images in `public/places/` and reference them normally:

![A caption, which doubles as the alt text](/places/example.jpg)

They run the full width of the column with the same rounded corners as the rest
of the site. One image per paragraph breathes better than a tight grid.

## The story

Write it however you like: `##` headings feed the table of contents on the
left, and the rest of the markdown works exactly as it does on the blog.
