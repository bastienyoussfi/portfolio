import SpriteCanvas, { ANIMATIONS } from "./SpriteCanvas";

// Basic usage
<SpriteCanvas animation="idle" />

// Flipped, bigger, with click handler
<SpriteCanvas animation="run" flipped scale={6} onClick={() => console.log("meow!")} />

// Reactive to your app state
<SpriteCanvas 
  animation={isLoading ? "run" : isTyping ? "play" : "idle"} 
  scale={4}
  style={{ position: "fixed", bottom: 16, right: 16 }}
/>

PropTypeDefaultWhat it doesanimationstring"idle"Any key from ANIMATIONSflippedbooleanfalseMirror horizontallyscalenumber4Pixel multiplier (4 = 128×128px)styleobject{}Extra styles on wrapperclassNamestring""For your CSS/TailwindonClickfunction—Click handler