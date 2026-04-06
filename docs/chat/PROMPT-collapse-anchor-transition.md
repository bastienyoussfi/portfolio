# Task: Implement "Collapse & Anchor" Hero-to-Chat Transition

## Context
This is a portfolio site (Vite + React + TypeScript + Tailwind) with a hero section and an AI chat powered by Claude API via a Hono backend on Cloudflare Workers. The chat agent is named "Bounty" and is represented by a pixel cat mascot.

Currently, the hero and chat are static — the hero stays in place and the chat sits below it with no transition between states. The goal is to make the hero **morph smoothly into a compact header** when the user sends their first message, creating a seamless hero→chat transition.

## What to implement: "Collapse & Anchor" transition

This is a single smooth animation where the hero content **stays in place** and transforms — nothing teleports, jumps, or gets swapped. Everything is interpolated frame-by-frame using `requestAnimationFrame`.

### Phase system

Add a `phase` state with 3 values: `"hero"` | `"transitioning"` | `"chat"`.

- **`hero`**: Default state. Full hero visible — large title, subtitle, CTA button, mascot, suggestion chips, input bar.
- **`transitioning`**: Triggered on first message send. Lasts ~850ms. An `easeOutCubic` progress value animates from 0→1 via `requestAnimationFrame`.
- **`chat`**: Final state. Compact header, messages visible, input bar at bottom.

### Animation progress hook

Create a `useAnimatedProgress(phase, duration)` hook that:
- On `phase === "transitioning"`, runs a `requestAnimationFrame` loop for `duration` ms
- Applies `easeOutCubic` easing: `1 - Math.pow(1 - p, 3)`
- Returns a `progress` float from 0 to 1
- Sets progress to 0 when phase is "hero", 1 when phase is "chat"

### What morphs (all driven by the progress value, NOT CSS transitions)

| Property | Hero state (progress=0) | Chat state (progress=1) | Formula |
|---|---|---|---|
| Title font size | 42px | 18px | `42 - progress * 24` |
| Title alignment | left | center | Switch at `progress > 0.5` |
| Header padding-top | 48px | 14px | `48 - progress * 34` |
| Header padding-bottom | 12px | 8px | `12 - progress * 4` |
| Subtitle opacity | 1 | 0 | `Math.max(0, 1 - progress * 2)` — fades out FAST (done by 50%) |
| CTA button opacity | 1 | 0 | `Math.max(0, 1 - progress * 2.5)` — fades even faster |
| Chips container | visible, full height | collapsed, 0 height | `maxHeight` + `opacity` driven by `Math.max(0, 1 - progress * 2.5)` |
| Mascot | 48px, centered above chips | hidden (appears inline in messages) | Fades with chips |
| Header bottom border | transparent | `1px solid #eee` | Appears when `progress > 0.6` |
| Chat messages area | `opacity: 0`, `translateY(20px)` | `opacity: 1`, `translateY(0)` | CSS transition with 150ms delay, triggered by `isActive` |

### Layout structure (CRITICAL — use flex, NOT position:absolute)

```
<div> {/* height: 100vh, flex column */}
  
  {/* Nav — always visible, flexShrink: 0 */}
  <nav>...</nav>
  
  {/* Hero header — flexShrink: 0, padding driven by progress */}
  <div>
    <h1> {/* fontSize driven by progress */}
      Hi, I'm <strong>Bastien Youssfi.</strong>
    </h1>
    <p> {/* subtitle — opacity + maxHeight driven by progress */}
      Software Engineer & AI Builder.
    </p>
    <div> {/* CTA row — opacity + maxHeight driven by progress */}
      <button>Get in Touch</button>
      <span>Feel free to explore...</span>
    </div>
  </div>
  
  {/* Mascot + Chips — overflow:hidden, maxHeight + opacity driven by progress */}
  <div>
    <PixelCatMascot size={48} />  {/* Use existing mascot component */}
    <SuggestionChips />
  </div>
  
  {/* Messages — flex:1, opacity/transform transition with delay */}
  <div>
    <ChatMessages />
  </div>
  
  {/* Input bar — flexShrink:0, always at bottom, always interactive */}
  <div>
    <InputBar />
  </div>

</div>
```

**Why flex and not absolute**: `position: absolute` with `inset: 0` causes zero-height rendering in many contexts (iframes, artifact renderers, variable-height parents). Flex with `overflow: hidden` + `maxHeight` collapse is rock-solid.

### Collapse mechanics

Elements that disappear (subtitle, CTA, chips, mascot) should collapse using this pattern:
```tsx
<div style={{
  overflow: "hidden",
  maxHeight: opacity > 0 ? 200 : 0,  // some generous max
  opacity: opacity,
  transition: "max-height 0.4s ease, opacity 0.3s ease",
}}>
  {children}
</div>
```

This ensures they don't just fade out but also **collapse their vertical space** so the layout shifts smoothly.

### Chat messages appearance

Messages should NOT be visible in hero state. When `isActive` (phase !== "hero"):
```tsx
opacity: isActive ? 1 : 0,
transform: isActive ? "translateY(0)" : "translateY(20px)",
transition: "opacity 0.5s ease 0.15s, transform 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s",
```
The 150ms delay ensures messages fade in AFTER the hero has started collapsing.

### Message components

#### User messages
- Blue pill (`#2563eb` background, white text)
- `borderRadius: 20px`, right-aligned
- Slide-in animation: `translateY(12px)` → `translateY(0)` over 350ms

#### AI messages (Bounty)
- No container/background — text flows directly on the page
- Dark text (`#1a1a1a`), 14.5px, line-height 1.7
- **Tool-use indicator** above the text: shows the pixel cat mascot (28px), a spinning loader icon that becomes a checkmark after ~800ms, and a label like "Searching projects"
- **Typewriter effect** on the latest AI message: characters appear one by one at ~12ms intervals with a blinking blue cursor (`#2563eb`, 2px wide)

#### Typing indicator
While waiting for AI response, show: pixel cat mascot (28px) + 3 bouncing dots (gray `#ccc`, 6px, staggered animation)

### Input bar
- Pill shape (`borderRadius: 26px`)
- Light background (`#fafaf8`), border `#eae8e4`
- On focus: white background, darker border, subtle shadow (`0 2px 12px rgba(0,0,0,0.06)`)
- Send button: dark circle (`#1a1a1a`) with white up-arrow icon when input has text, gray (`#eae8e4`) when empty
- Placeholder: "Ask Bounty about Bastien.."

### Suggestion chips
- White background, `1.5px solid #e5e0d8` border, `borderRadius: 22px`
- Hover: light cream background (`#f5f3ef`), darker border
- Staggered entrance animation (each chip delayed by 70ms)
- Centered, flex-wrap

## What NOT to change
- Do not touch the backend/API integration — keep the existing chat logic for sending messages to the Hono API
- Do not touch the nav component — keep the existing social icons and hamburger menu
- Do not touch the pixel cat mascot component — just use it at different sizes (48px in hero, 28px inline in messages)
- Do not touch any sections below the hero/chat area
- Keep all existing Tailwind classes where possible, only add new ones as needed

## Technical constraints
- Use `requestAnimationFrame` for the morphing animation, NOT CSS transitions (CSS transitions can't interpolate font-size smoothly and cause layout thrashing)
- The `useAnimatedProgress` hook should clean up properly (cancel rAF on unmount)
- All collapsing elements must use `overflow: hidden` + `maxHeight` to avoid layout jumps
- The input bar must ALWAYS be visible and interactive, even during the transition
- Messages area must use `scrollbarWidth: "none"` and hide webkit scrollbar
- Ensure `minHeight: 0` on flex children that need to scroll (critical for nested flex scrolling)

## Reference
The attached file `portfolio-chat-collapse.jsx` is a working React prototype of this exact behavior. Use it as the definitive reference for animation timings, easing curves, layout structure, and component behavior. Adapt its patterns to the existing codebase rather than copying it verbatim — integrate with the existing Tailwind setup, TypeScript types, and API integration.
