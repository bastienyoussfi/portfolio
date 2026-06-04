import { Fragment } from 'react'

/**
 * Render an array of "rich" text fragments into React nodes.
 *
 * A fragment is either a plain string, or an object `{ text, ...flags }` where
 * each truthy flag is looked up in `classMap` to apply a CSS-module class
 * (wrapped in a <span>). This keeps inline emphasis in the data layer instead
 * of hardcoding markup in components.
 *
 * @param {string|Array} content
 * @param {Object<string,string>} [classMap] - flag name -> module class
 */
export function renderRich(content, classMap = {}) {
  const fragments = Array.isArray(content) ? content : [content]

  return fragments.map((fragment, index) => {
    if (typeof fragment === 'string') {
      return <Fragment key={index}>{fragment}</Fragment>
    }

    const classes = Object.keys(classMap)
      .filter((flag) => fragment[flag])
      .map((flag) => classMap[flag])
      .join(' ')

    return (
      <span key={index} className={classes || undefined}>
        {fragment.text}
      </span>
    )
  })
}
