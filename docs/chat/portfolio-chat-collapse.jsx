import { useState, useRef, useEffect, useCallback } from "react";

/* ─── config ─── */
const SUGGESTIONS = [
  "What projects has Bastien worked on?",
  "What's his tech stack?",
  "Tell me about his experience",
  "How can I get in touch?",
];

const FAKE = {
  "What projects has Bastien worked on?": {
    tool: "Searching projects",
    text: "Bastien has built several notable projects — Auditex, a B2B document extraction platform powered by Claude for French professional documents; Grow Online, a cross-platform social media management SaaS; and Voicy, an automated B2B prospecting system using ElevenLabs voice agents. He's also worked on AI product finders, WhatsApp ordering agents, and career positioning platforms.",
  },
  "What's his tech stack?": {
    tool: "Looking up stack",
    text: "His core stack is TypeScript and Python — NestJS and FastAPI for backends, React for frontends, PostgreSQL for data, and Docker for everything. On the AI side he works extensively with Claude, Mistral, and Gemini APIs, plus ElevenLabs for voice. Deployed mostly on Cloudflare and Scaleway.",
  },
  "Tell me about his experience": {
    tool: "Searching experience",
    text: "Bastien has deep hands-on experience integrating LLMs into production systems — from document intelligence with Claude API to voice agents with ElevenLabs, prompt engineering for structured data extraction, hybrid OCR pipelines, and agentic workflows. He holds IBM ML/Deep Learning certifications and completed the Hugging Face AI Agents course.",
  },
  "How can I get in touch?": {
    tool: "Finding contact info",
    text: "Bastien is available for freelance engagements through Malt or direct contact. His rate is around €300/day for AI engineering and full-stack development. You can reach him at bastienyoussfi.dev or connect on LinkedIn. He's especially interested in projects involving LLM integration, document processing, and agentic systems.",
  },
};

const DEFAULT_RESPONSE = {
  tool: "Thinking",
  text: "I'm Bounty, Bastien's portfolio assistant. I can tell you about his projects, tech stack, experience, and how to work with him. What would you like to know?",
};

/* ─── hooks ─── */
function useTypewriter(text, speed = 12, active = false) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) { setDisplayed(text); setDone(true); return; }
    setDisplayed(""); setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++; setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, active]);
  return { displayed, done };
}

function useAnimatedProgress(phase, duration = 850) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (phase === "transitioning") {
      let start = null;
      const animate = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setProgress(eased);
        if (p < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    } else if (phase === "hero") setProgress(0);
    else setProgress(1);
  }, [phase, duration]);
  return progress;
}

/* ─── Pixel Cat Placeholder ─── */
const PixelCat = ({ size = 32 }) => (
  <div style={{
    width: size, height: size, borderRadius: 8,
    background: "#f4f1ec",
    border: "1.5px solid #e5e0d8",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, position: "relative", overflow: "hidden",
  }}>
    {/* Pixel grid placeholder — represents where the cat sprite goes */}
    <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 16 16" fill="none">
      {/* Ears */}
      <rect x="2" y="1" width="2" height="2" fill="#bbb" />
      <rect x="12" y="1" width="2" height="2" fill="#bbb" />
      {/* Head */}
      <rect x="3" y="3" width="10" height="6" rx="1" fill="#ccc" />
      {/* Eyes */}
      <rect x="5" y="5" width="2" height="2" rx="0.5" fill="#333" />
      <rect x="9" y="5" width="2" height="2" rx="0.5" fill="#333" />
      {/* Nose */}
      <rect x="7" y="7" width="2" height="1" rx="0.5" fill="#e8a0a0" />
      {/* Body */}
      <rect x="4" y="9" width="8" height="4" rx="1" fill="#ccc" />
      {/* Tail */}
      <rect x="12" y="10" width="3" height="1.5" rx="0.75" fill="#bbb" />
    </svg>
  </div>
);

/* ─── Social icons ─── */
const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 016.02 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

/* ─── Tool use indicator ─── */
const ToolIndicator = ({ label, done }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 8,
    padding: "6px 0", marginBottom: 8,
  }}>
    <PixelCat size={28} />
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      color: "#888", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={done ? "#22c55e" : "#f59e0b"}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ animation: done ? "none" : "spin 1.5s linear infinite" }}>
        {done
          ? <><path d="M20 6L9 17l-5-5"/></>
          : <><path d="M12 2a10 10 0 0 1 10 10"/></>
        }
      </svg>
      <span>{label}</span>
    </div>
    {done && (
      <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2">
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    )}
  </div>
);

/* ─── Message ─── */
const Message = ({ role, content, tool, isLatest }) => {
  const isUser = role === "user";
  const { displayed, done } = useTypewriter(content, 10, !isUser && isLatest);
  const [toolDone, setToolDone] = useState(!isLatest);

  useEffect(() => {
    if (!isUser && isLatest && tool) {
      const t = setTimeout(() => setToolDone(true), 800);
      return () => clearTimeout(t);
    }
  }, [isUser, isLatest, tool]);

  if (isUser) {
    return (
      <div style={{
        display: "flex", justifyContent: "flex-end",
        animation: "msgSlide 0.35s cubic-bezier(0.16,1,0.3,1) both",
        marginBottom: 16,
      }}>
        <div style={{
          background: "#2563eb", color: "#fff",
          padding: "10px 18px", borderRadius: 20,
          fontSize: 14.5, lineHeight: 1.5, maxWidth: "75%",
          fontFamily: "'DM Sans', sans-serif",
        }}>{content}</div>
      </div>
    );
  }

  return (
    <div style={{
      animation: "msgSlide 0.4s cubic-bezier(0.16,1,0.3,1) both",
      marginBottom: 16,
    }}>
      {tool && <ToolIndicator label={tool} done={toolDone} />}
      <div style={{
        fontSize: 14.5, lineHeight: 1.7, color: "#1a1a1a",
        fontFamily: "'DM Sans', sans-serif",
        paddingLeft: 2,
      }}>
        {displayed}
        {!done && (
          <span style={{
            display: "inline-block", width: 2, height: 16,
            background: "#2563eb", marginLeft: 2, verticalAlign: "text-bottom",
            animation: "blink 0.8s step-end infinite",
          }} />
        )}
      </div>
    </div>
  );
};

/* ─── Input bar ─── */
const InputBar = ({ input, setInput, onSend }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: focused ? "#fff" : "#fafaf8",
      border: `1.5px solid ${focused ? "#ddd" : "#eae8e4"}`,
      borderRadius: 26, padding: "4px 6px 4px 18px",
      transition: "all 0.2s ease",
      boxShadow: focused ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
    }}>
      <input value={input} onChange={e => setInput(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder="Ask Bounty about Bastien.."
        style={{
          flex: 1, background: "transparent", border: "none", outline: "none",
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#1a1a1a",
          letterSpacing: "0.01em",
        }} />
      <button onClick={onSend} disabled={!input.trim()} style={{
        width: 34, height: 34, borderRadius: "50%",
        background: input.trim() ? "#1a1a1a" : "#eae8e4",
        border: "none", cursor: input.trim() ? "pointer" : "default",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.2s", flexShrink: 0,
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke={input.trim() ? "#fff" : "#aaa"}
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
};

/* ─── Chips ─── */
const Chips = ({ onSend }) => (
  <div style={{
    display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center",
  }}>
    {SUGGESTIONS.map((s, i) => (
      <button key={i} onClick={() => onSend(s)} style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 13,
        color: "#555", background: "#fff",
        border: "1.5px solid #e5e0d8", borderRadius: 22,
        padding: "8px 16px", cursor: "pointer",
        transition: "all 0.2s ease", whiteSpace: "nowrap",
        animation: `chipIn 0.45s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.07}s both`,
      }}
        onMouseEnter={e => { e.target.style.background = "#f5f3ef"; e.target.style.borderColor = "#ccc"; e.target.style.color = "#1a1a1a"; }}
        onMouseLeave={e => { e.target.style.background = "#fff"; e.target.style.borderColor = "#e5e0d8"; e.target.style.color = "#555"; }}
      >{s}</button>
    ))}
  </div>
);


/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT — Collapse & Anchor on light theme
   ═══════════════════════════════════════════════════════ */
export default function PortfolioChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [phase, setPhase] = useState("hero");
  const scrollRef = useRef(null);

  const progress = useAnimatedProgress(phase, 850);
  const isActive = phase !== "hero";

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = useCallback((text) => {
    const msg = text || input.trim();
    if (!msg) return;
    if (phase === "hero") {
      setPhase("transitioning");
      setTimeout(() => setPhase("chat"), 900);
    }
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setInput("");
    setIsTyping(true);
    const resp = FAKE[msg] || DEFAULT_RESPONSE;
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: "assistant", content: resp.text, tool: resp.tool }]);
    }, 1200 + Math.random() * 600);
  }, [input, phase]);

  /* ─ layout math ─ */
  const titleSize = 42 - progress * 24;          // 42 → 18
  const subtitleOpacity = Math.max(0, 1 - progress * 2);
  const ctaOpacity = Math.max(0, 1 - progress * 2.5);
  const headerPadTop = 48 - progress * 34;       // 48 → 14
  const headerPadBot = 12 - progress * 4;
  const chipsScale = Math.max(0, 1 - progress * 2.5);
  const mascotOpacity = Math.max(0, 1 - progress * 3);

  return (
    <div style={{
      height: "100vh", background: "#fff",
      display: "flex", flexDirection: "column", overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* ─── Top nav ─── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 20, padding: "16px 24px", flexShrink: 0,
      }}>
        {[GitHubIcon, XIcon, LinkedInIcon].map((Icon, i) => (
          <a key={i} href="#" style={{
            color: "#1a1a1a", opacity: 0.55, transition: "opacity 0.2s",
            display: "flex", alignItems: "center",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "1"}
            onMouseLeave={e => e.currentTarget.style.opacity = "0.55"}
          ><Icon /></a>
        ))}
        <button style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "#1a1a1a", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff",
        }}><MenuIcon /></button>
      </nav>

      {/* ─── Hero section — morphs into compact header ─── */}
      <div style={{
        flexShrink: 0,
        paddingTop: headerPadTop,
        paddingBottom: headerPadBot,
        paddingLeft: 24, paddingRight: 24,
        borderBottom: progress > 0.6 ? "1px solid #eee" : "1px solid transparent",
        transition: progress === 1 ? "border-color 0.3s" : "none",
      }}>
        {/* Title block */}
        <div style={{
          maxWidth: 680,
          margin: "0 auto",
          textAlign: progress > 0.5 ? "center" : "left",
        }}>
          <h1 style={{
            fontFamily: "'Newsreader', 'Georgia', serif",
            fontSize: titleSize,
            fontWeight: 400,
            color: "#1a1a1a",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            margin: 0,
          }}>
            <span style={{ fontWeight: 400 }}>Hi, I'm </span>
            <span style={{ fontWeight: 700 }}>Bastien Youssfi.</span>
          </h1>

          {/* Subtitle */}
          <div style={{
            overflow: "hidden",
            maxHeight: subtitleOpacity > 0 ? 50 : 0,
            opacity: subtitleOpacity,
          }}>
            <p style={{
              fontFamily: "'Newsreader', 'Georgia', serif",
              fontSize: 28, fontWeight: 400, color: "#aaa",
              margin: "2px 0 0", lineHeight: 1.3, letterSpacing: "-0.01em",
            }}>Software Engineer & AI Builder.</p>
          </div>

          {/* CTA row */}
          <div style={{
            overflow: "hidden",
            maxHeight: ctaOpacity > 0 ? 70 : 0,
            opacity: ctaOpacity,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 18, marginTop: 20,
            }}>
              <button style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
                color: "#fff", background: "#1a1a1a",
                border: "none", borderRadius: 24,
                padding: "12px 28px", cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 14px rgba(0,0,0,0.15)"; }}
                onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
              >Get in Touch</button>
              <span style={{ fontSize: 14, color: "#888", lineHeight: 1.5 }}>
                Feel free to explore my portfolio and reach<br />out — I'd love to connect!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Mascot + Chips — collapse away ─── */}
      <div style={{
        overflow: "hidden", flexShrink: 0,
        maxHeight: chipsScale > 0 ? 200 : 0,
        opacity: chipsScale,
        transition: "max-height 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease",
      }}>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 16, padding: "32px 24px 16px",
          maxWidth: 680, margin: "0 auto",
        }}>
          {/* Mascot placeholder */}
          <div style={{ opacity: mascotOpacity, transition: "opacity 0.3s" }}>
            <PixelCat size={48} />
          </div>
          <Chips onSend={handleSend} />
        </div>
      </div>

      {/* ─── Messages area ─── */}
      <div style={{
        flex: 1, overflow: "hidden", display: "flex", flexDirection: "column",
        opacity: isActive ? 1 : 0,
        transform: isActive ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.5s ease 0.15s, transform 0.5s cubic-bezier(0.22,1,0.36,1) 0.15s",
        minHeight: 0,
      }}>
        <div ref={scrollRef} style={{
          flex: 1, overflow: "auto", padding: "16px 24px",
          maxWidth: 680, width: "100%", margin: "0 auto",
          scrollbarWidth: "none",
        }}>
          {messages.map((m, i) => (
            <Message key={i} role={m.role} content={m.content}
              tool={m.tool} isLatest={i === messages.length - 1} />
          ))}
          {isTyping && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
              <PixelCat size={28} />
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#ccc",
                    animation: `dotBounce 1s ease-in-out ${i * 0.12}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Input bar — always at bottom ─── */}
      <div style={{
        padding: "10px 24px 20px", flexShrink: 0,
        maxWidth: 728, width: "100%", margin: "0 auto",
      }}>
        <InputBar input={input} setInput={setInput} onSend={() => handleSend()} />
      </div>

      {/* ─── Keyframes ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes msgSlide {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes chipIn {
          from { opacity: 0; transform: translateY(8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dotBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
