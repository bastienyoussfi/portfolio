import { GRID } from '../data/land-dots.js'

export const LON_RANGE = GRID.lonMax - GRID.lonMin
export const LAT_RANGE = GRID.latMax - GRID.latMin

/** Places closer together than this many screen pixels merge into one marker. */
export const CLUSTER_PX = 15

export const MAX_LABELS = 5

/** [lat, lon] -> percentage position inside the map box. */
export function project([lat, lon]) {
  return {
    x: ((lon - GRID.lonMin) / LON_RANGE) * 100,
    y: ((GRID.latMax - lat) / LAT_RANGE) * 100,
  }
}

/**
 * At world scale a pixel is roughly 250km, so nearby places cannot be separate
 * dots — they collapse into one marker whose label lists them. Recomputed on
 * every resize because the threshold is in screen pixels, not degrees.
 */
export function clusterPlaces(places, width, height) {
  const clusters = []

  for (const place of places) {
    const { x, y } = project(place.coords)
    const px = (x / 100) * width
    const py = (y / 100) * height

    const near = clusters.find(
      (cluster) => Math.hypot(cluster.px - px, cluster.py - py) < CLUSTER_PX,
    )

    if (near) {
      near.members.push(place)
      near.sumX += px
      near.sumY += py
      near.px = near.sumX / near.members.length
      near.py = near.sumY / near.members.length
    } else {
      clusters.push({ px, py, sumX: px, sumY: py, members: [place] })
    }
  }

  return clusters.map((cluster) => ({
    key: cluster.members.map((m) => m.slug).join('|'),
    members: cluster.members,
    x: width ? (cluster.px / width) * 100 : 0,
    y: height ? (cluster.py / height) * 100 : 0,
  }))
}
