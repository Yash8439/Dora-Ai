import { ArrowRight, Bot, Sparkles, X, Zap, LayoutTemplate, Globe, Code2, Rocket, ChevronDown, Mail } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useState, useRef, useEffect } from "react"
import { signInWithPopup } from "firebase/auth"
import { auth, provider, githubProvider } from "../firebase"
import axios from "axios"
import { setUserData } from "../redux/userSlice"

// ── Matrix Canvas ──────────────────────────────────────────────────
const MatrixInit = () => {
    useEffect(() => {
        const canvas = document.getElementById('matrixCanvas')
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        const chars = '01アイウエオ{}</>[]()=+*&#@!'
        const fontSize = 12
        const cols = Math.floor(canvas.width / fontSize)
        const drops = Array(cols).fill(1)
        const draw = () => {
            ctx.fillStyle = 'rgba(0,0,0,0.05)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.font = `${fontSize}px monospace`
            drops.forEach((y, i) => {
                const char = chars[Math.floor(Math.random() * chars.length)]
                ctx.fillStyle = Math.random() > 0.95 ? '#fff' : 'rgba(99,102,241,0.4)'
                ctx.fillText(char, i * fontSize, y * fontSize)
                if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
                drops[i]++
            })
        }
        const interval = setInterval(draw, 60)
        return () => clearInterval(interval)
    }, [])
    return null
}

// ── Scroll Progress ────────────────────────────────────────────────
const ScrollProgress = () => {
    const [progress, setProgress] = useState(0)
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight
            const scrolled = (window.scrollY / totalHeight) * 100
            setProgress(scrolled)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <div className="fixed top-0 left-0 z-[9999] h-[3px] transition-all duration-150"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)' }} />
    )
}
// ── Custom Cursor ──────────────────────────────────────────────────
const CursorGlow = () => {
    const [pos, setPos] = useState({ x: -100, y: -100 })
    const [isPointer, setIsPointer] = useState(false)
    useEffect(() => {
        const move = (e) => {
            setPos({ x: e.clientX, y: e.clientY })
            const el = document.elementFromPoint(e.clientX, e.clientY)
            setIsPointer(el && (el.tagName === 'BUTTON' || el.tagName === 'A' || el.closest('button') || el.closest('a')))
        }
        window.addEventListener('mousemove', move)
        return () => window.removeEventListener('mousemove', move)
    }, [])
    return (
        <>
            <div className="cursor-dot" style={{ left: pos.x, top: pos.y, width: isPointer ? '50px' : '30px', height: isPointer ? '50px' : '30px', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)' }} />
            <div className="cursor-dot" style={{ left: pos.x, top: pos.y, width: isPointer ? '8px' : '5px', height: isPointer ? '8px' : '5px', background: isPointer ? '#a78bfa' : '#6366f1', boxShadow: `0 0 10px ${isPointer ? '#a78bfa' : '#6366f1'}`, transition: 'width 0.1s, height 0.1s, background 0.1s' }} />
        </>
    )
}

// ── BUILD IDEAS ────────────────────────────────────────────────────
const BUILD_IDEAS = [
    { emoji: "🎨", text: "Create a stunning portfolio for a UI/UX designer with dark theme", tag: "Portfolio" },
    { emoji: "🚀", text: "Build a SaaS landing page with pricing, features and testimonials", tag: "SaaS" },
    { emoji: "🍽️", text: "Design a restaurant website with menu, gallery and reservations", tag: "Restaurant" },
    { emoji: "💪", text: "Make a fitness coaching website with workout plans and pricing", tag: "Fitness" },
    { emoji: "🛍️", text: "Create an e-commerce store with product grid and cart", tag: "E-Commerce" },
    { emoji: "📸", text: "Build a photography portfolio with lightbox gallery", tag: "Photography" },
    { emoji: "🏢", text: "Design a digital agency website with services and case studies", tag: "Agency" },
    { emoji: "🎓", text: "Create an online course landing page with curriculum and instructor bio", tag: "Education" },
]

const BuildIdeas = ({ navigate }) => {
    const [activeIdea, setActiveIdea] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => setActiveIdea(i => (i + 1) % BUILD_IDEAS.length), 3000)
        return () => clearInterval(interval)
    }, [])
    return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mt-20 mb-16">
            <div className="text-center mb-8">
                <p className="text-xs text-orange-400 uppercase tracking-widest font-semibold mb-2">🔥 Build Ideas</p>
                <h2 className="text-2xl font-black text-white mb-2">Not sure what to build?</h2>
                <p className="text-zinc-600 text-sm">Click any idea to start building instantly</p>
            </div>
            <div className="max-w-2xl mx-auto mb-6">
                <AnimatePresence mode="wait">
                    <motion.div key={activeIdea} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}
                        onClick={() => navigate('/generate')} className="cursor-pointer group relative p-6 rounded-2xl border border-white/10 hover:border-indigo-500/40 transition-all duration-300" style={{ background: 'rgba(99,102,241,0.05)' }}>
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.15), transparent 70%)' }} />
                        <div className="flex items-center gap-4 relative z-10">
                            <span className="text-4xl">{BUILD_IDEAS[activeIdea].emoji}</span>
                            <div className="flex-1">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 mb-2 inline-block">{BUILD_IDEAS[activeIdea].tag}</span>
                                <p className="text-white text-sm font-medium leading-relaxed">{BUILD_IDEAS[activeIdea].text}</p>
                            </div>
                            <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                                <Zap size={16} className="text-white" />
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {BUILD_IDEAS.map((idea, i) => (
                    <motion.button key={i} onClick={() => navigate('/generate')} whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        className={`p-4 rounded-xl border text-left transition-all duration-200 ${i === activeIdea ? 'border-indigo-500/40' : 'border-white/8 hover:border-white/20'}`}
                        style={{ background: i === activeIdea ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)' }}>
                        <span className="text-xl mb-2 block">{idea.emoji}</span>
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/5 text-zinc-500 mb-1 inline-block">{idea.tag}</span>
                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{idea.text}</p>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    )
}

// ── COMMUNITY STATS ────────────────────────────────────────────────
const COMMUNITY_STATS = [
    { icon: "🌐", label: "Websites Generated", value: 2847, suffix: "+", color: "#6366f1" },
    { icon: "⚡", label: "Deployed Today", value: 847, suffix: "", color: "#fbbf24" },
    { icon: "👥", label: "Active Users", value: 1200, suffix: "+", color: "#34d399" },
    { icon: "⭐", label: "Avg Rating", value: 4.9, suffix: "", color: "#f472b6" },
]

const CountUp = ({ target }) => {
    const [count, setCount] = useState(0)
    useEffect(() => {
        let start = 0
        const step = target / 120
        const timer = setInterval(() => {
            start += step
            if (start >= target) { setCount(target); clearInterval(timer) }
            else setCount(Math.floor(start * 10) / 10)
        }, 16)
        return () => clearInterval(timer)
    }, [target])
    return <span>{count}</span>
}

const CommunityStats = () => {
    const [started, setStarted] = useState(false)
    return (
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onViewportEnter={() => setStarted(true)} className="mb-16">
            <div className="text-center mb-8">
                <p className="text-xs text-green-400 uppercase tracking-widest font-semibold mb-2">📊 Community</p>
                <h2 className="text-2xl font-black text-white">Growing every day</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {COMMUNITY_STATS.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.05 }}
                        className="p-5 rounded-2xl border border-white/8 text-center relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 50% 0%, ${stat.color}, transparent)` }} />
                        <p className="text-2xl mb-2">{stat.icon}</p>
                        <p className="text-2xl font-black mb-1" style={{ color: stat.color }}>{started ? <CountUp target={stat.value} /> : '0'}{stat.suffix}</p>
                        <p className="text-xs text-zinc-500">{stat.label}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}

// ── TIPS CAROUSEL ──────────────────────────────────────────────────
const TIPS = [
    { icon: "💡", tip: "Be specific in your prompts", desc: "Instead of 'make a website', say 'create a dark-themed portfolio for a photographer with project gallery and contact form'." },
    { icon: "🎨", tip: "Mention colors and style", desc: "Include design preferences like 'minimalist', 'dark theme', 'gradient background', or 'glassmorphism cards'." },
    { icon: "💬", tip: "Use AI Chat to refine", desc: "After generation, use the chat to say 'make the hero section taller' or 'add animations to the cards'." },
    { icon: "📦", tip: "Export ZIP for customization", desc: "Download clean HTML, CSS & JS to customize further in VS Code or any editor you prefer." },
    { icon: "🚀", tip: "Deploy to Netlify", desc: "Click Deploy to Netlify for an instant live URL. Share it with clients or add it to your portfolio!" },
    { icon: "🎤", tip: "Use Voice Input", desc: "Click the microphone icon on the Generate page to describe your website hands-free." },
]

const TipsCarousel = () => {
    const [activeTip, setActiveTip] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => setActiveTip(i => (i + 1) % TIPS.length), 4000)
        return () => clearInterval(interval)
    }, [])
    return (
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <div className="text-center mb-8">
                <p className="text-xs text-yellow-400 uppercase tracking-widest font-semibold mb-2">💡 Pro Tips</p>
                <h2 className="text-2xl font-black text-white">Get better results</h2>
            </div>
            <div className="max-w-2xl mx-auto">
                <div className="relative p-6 rounded-2xl border border-yellow-500/20 overflow-hidden" style={{ background: 'rgba(234,179,8,0.05)' }}>
                    <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)' }} />
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTip} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                            <div className="flex items-start gap-4">
                                <span className="text-3xl shrink-0">{TIPS[activeTip].icon}</span>
                                <div>
                                    <h3 className="font-bold text-white mb-1">{TIPS[activeTip].tip}</h3>
                                    <p className="text-zinc-400 text-sm leading-relaxed">{TIPS[activeTip].desc}</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                    <div className="flex justify-center gap-2 mt-4">
                        {TIPS.map((_, i) => <button key={i} onClick={() => setActiveTip(i)} className={`rounded-full transition-all duration-300 ${i === activeTip ? 'bg-yellow-400 w-5 h-1.5' : 'bg-white/20 w-1.5 h-1.5'}`} />)}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// ── WHAT'S NEW ─────────────────────────────────────────────────────
const WHATS_NEW = [
    { icon: "🚀", version: "v2.1", title: "Deploy to Netlify", desc: "One-click deployment with instant live URL", color: "#6366f1", isNew: true },
    { icon: "🎤", version: "v2.0", title: "Voice Input", desc: "Describe websites by speaking out loud", color: "#8b5cf6", isNew: true },
    { icon: "🤖", version: "v1.9", title: "AI Guide", desc: "Section-wise website explanation with voice", color: "#a78bfa", isNew: false },
    { icon: "📦", version: "v1.8", title: "Export ZIP", desc: "Download clean HTML, CSS & JS separately", color: "#34d399", isNew: false },
]

const WhatsNew = ({ navigate }) => (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
        <div className="text-center mb-8">
            <p className="text-xs text-purple-400 uppercase tracking-widest font-semibold mb-2">🆕 What's New</p>
            <h2 className="text-2xl font-black text-white">Latest features</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WHATS_NEW.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -3 }}
                    className="p-5 rounded-2xl border border-white/8 flex items-start gap-4 relative overflow-hidden group transition-all duration-300 hover:border-white/20" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `radial-gradient(circle at 0% 50%, ${item.color}20, transparent 60%)` }} />
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div className="flex-1 relative z-10">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-white text-sm">{item.title}</h3>
                            {item.isNew && <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/20">New</span>}
                            <span className="text-xs text-zinc-600 ml-auto">{item.version}</span>
                        </div>
                        <p className="text-xs text-zinc-500">{item.desc}</p>
                    </div>
                </motion.div>
            ))}
        </div>
        <div className="text-center mt-6">
            <motion.button onClick={() => navigate('/generate')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-2xl font-bold text-sm transition" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
                Try All Features →
            </motion.button>
        </div>
    </motion.div>
)
const Testimonials = () => (
  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
    <div className="text-center mb-8">
      <p className="text-xs text-purple-400 uppercase tracking-widest font-semibold mb-2">⭐ Testimonials</p>
      <h2 className="text-2xl font-black text-white mb-2">Trusted by creators</h2>
      <p className="text-zinc-500 text-sm">Real feedback from people building with Dora AI</p>
      <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24' }}>
        ★ 4.9/5 average rating
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {TESTIMONIALS.map((t, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }}
          className="p-5 rounded-2xl border border-white/8 flex flex-col gap-4 hover:border-white/20 transition-all duration-300" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, s) => (
              <span key={s} style={{ color: s < t.stars ? '#fbbf24' : '#3f3f46', fontSize: '14px' }}>★</span>
            ))}
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed flex-1">"{t.text}"</p>
          <div className="flex items-center gap-3 pt-3 border-t border-white/5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: t.bg, color: t.color }}>
              {t.initials}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{t.name}</p>
              <p className="text-zinc-500 text-xs">{t.role}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
)
// ── DATA ───────────────────────────────────────────────────────────
const SAMPLE_WEBSITES = [
    { title: "Portfolio – UI Designer", tag: "Portfolio", preview: `<div style="font-family:system-ui;background:linear-gradient(135deg,#1e1b4b,#312e81);min-height:100%;color:white;padding:20px"><nav style="display:flex;justify-content:space-between;align-items:center;margin-bottom:40px"><span style="font-weight:800;font-size:18px;color:#a78bfa">Alex.dev</span></nav><div style="text-align:center;padding:20px 0"><div style="width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#a78bfa,#6366f1);margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:24px">👨‍💻</div><h1 style="font-size:28px;font-weight:900;margin:0 0 8px">UI/UX Designer</h1></div></div>` },
    { title: "SaaS Landing Page", tag: "Startup", preview: `<div style="font-family:system-ui;background:linear-gradient(135deg,#0c1445,#0f172a);min-height:100%;color:white;padding:20px"><nav style="display:flex;justify-content:space-between;align-items:center;margin-bottom:32px"><span style="font-weight:800;font-size:16px;color:#38bdf8">⚡ FlowAI</span></nav><div style="text-align:center"><h1 style="font-size:24px;font-weight:900;color:#38bdf8">Automate Your Workflow</h1></div></div>` },
    { title: "Restaurant Website", tag: "Restaurant", preview: `<div style="font-family:system-ui;background:linear-gradient(135deg,#1c0a00,#2d1200);min-height:100%;color:white;padding:20px"><nav style="display:flex;justify-content:space-between;align-items:center;margin-bottom:28px"><span style="font-weight:800;font-size:16px;color:#fb923c">🍽️ Bella Roma</span></nav><div style="text-align:center"><h1 style="font-size:26px;font-weight:900">A Taste of Italy</h1><button style="background:#fb923c;border:none;color:white;border-radius:8px;padding:8px 20px;font-size:11px;font-weight:700;margin-top:12px">Book Now</button></div></div>` },
    { title: "Fitness Coach", tag: "Health", preview: `<div style="font-family:system-ui;background:linear-gradient(135deg,#052e16,#064e3b);min-height:100%;color:white;padding:20px"><div style="text-align:center;padding-top:20px"><div style="font-size:48px">🏋️</div><h1 style="font-size:22px;font-weight:900;color:#4ade80">Transform Your Body</h1></div></div>` },
    { title: "E-Commerce Store", tag: "Shop", preview: `<div style="font-family:system-ui;background:#0f0f0f;min-height:100%;color:white;padding:20px"><nav style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px"><span style="font-weight:800;font-size:16px;color:#f59e0b">🛍️ ShopAI</span></nav><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div style="background:#1a1a1a;border-radius:10px;padding:12px"><div style="font-size:24px">👟</div><div style="font-size:11px;color:#f59e0b;font-weight:700">$129</div></div><div style="background:#1a1a1a;border-radius:10px;padding:12px"><div style="font-size:24px">⌚</div><div style="font-size:11px;color:#f59e0b;font-weight:700">$199</div></div></div></div>` },
    { title: "Travel Blog", tag: "Blog", preview: `<div style="font-family:system-ui;background:linear-gradient(135deg,#1c1400,#2d1f00);min-height:100%;color:white;padding:20px"><h1 style="font-size:20px;font-weight:900;color:#fbbf24;margin-top:20px">🌍 48 Hours in Santorini</h1><p style="opacity:0.5;font-size:11px;margin-top:8px">A journey through white walls and blue domes...</p></div>` },
]
const TESTIMONIALS = [
  { name: "Rahul K.", role: "Frontend Developer", initials: "RK", color: "#6366f1", bg: "rgba(99,102,241,0.15)", stars: 5, text: "Built my entire portfolio in under 10 minutes. The AI understood exactly what I wanted — dark theme, minimal, with project cards. Absolutely insane." },
  { name: "Priya S.", role: "Startup Founder", initials: "PS", color: "#34d399", bg: "rgba(52,211,153,0.15)", stars: 5, text: "I needed a landing page for my startup pitch. Dora AI gave me something better than what I had in mind. Deployed to Netlify in one click — mind blown." },
  { name: "Aarav M.", role: "UI/UX Designer", initials: "AM", color: "#fbbf24", bg: "rgba(251,191,36,0.15)", stars: 5, text: "As a designer who can't code, this is a dream. I describe the vibe and Dora just gets it. The AI chat editor for tweaks is chef's kiss." },
  { name: "Neha K.", role: "Freelance Developer", initials: "NK", color: "#f472b6", bg: "rgba(244,114,182,0.15)", stars: 4, text: "Used it to build a restaurant website for a client. Saved me 2 days of work easily. The generated code is clean and editable too." },
  { name: "Vikram T.", role: "CS Student", initials: "VT", color: "#38bdf8", bg: "rgba(56,189,248,0.15)", stars: 5, text: "Showed this to my professor and he couldn't believe a student built it. Dora AI made my project look 10x more professional instantly." },
  { name: "Sanya R.", role: "Digital Agency Owner", initials: "SR", color: "#a3e635", bg: "rgba(163,230,53,0.15)", stars: 5, text: "The voice input feature is next level. I literally described my agency site while walking and it built exactly what I said. The future is here." },
]


const FAQS = [
    { q: "What is Dora AI and how does it work?", a: "Dora AI is an AI-powered website builder. Simply describe your website in plain English, and our AI generates a fully responsive, production-ready website with HTML, CSS & JavaScript in minutes." },
    { q: "What kind of websites can I build with Dora AI?", a: "You can build portfolios, SaaS landing pages, restaurant websites, e-commerce stores, blogs, agency websites, and much more. If you can describe it, Dora AI can build it." },
    { q: "Do I need coding experience to use Dora AI?", a: "No coding experience required! Dora AI handles all the technical work. Just describe what you want in plain language and get a production-ready website." },
    { q: "Can I edit the generated website?", a: "Yes! After generation, you can chat with AI to make changes, use the built-in code editor, or export the clean HTML/CSS/JS files to edit yourself." },
    { q: "How does deployment work?", a: "You can deploy your website to Netlify with one click and get a live URL instantly. You can also export the code as a ZIP file to host anywhere you want." },
]

const GUIDE_STEPS = [
    { emoji: "👋", text: "Hey! I'm Dora AI — your smart website builder assistant!" },
    { emoji: "✍️", text: "Just describe what kind of website you want — like a portfolio for a photographer." },
    { emoji: "⚡", text: "Our AI instantly generates a fully responsive website with HTML, CSS and JS." },
    { emoji: "🎨", text: "Edit, regenerate sections, or chat with AI to tweak the design." },
    { emoji: "🚀", text: "Deploy live with one click or export the source code as a ZIP!" },
    { emoji: "🎉", text: "Ready to build something amazing? Click Start Building!" }
]

// ── MAIN COMPONENT ─────────────────────────────────────────────────
const Home = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)

    const [activeCard, setActiveCard] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => setActiveCard(i => (i + 1) % SAMPLE_WEBSITES.length), 3000)
        return () => clearInterval(interval)
    }, [])

    const [loginLoading, setLoginLoading] = useState(null)
    const [loginError, setLoginError] = useState('')
    const [showEmail, setShowEmail] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [openFaq, setOpenFaq] = useState(null)
    const [guideOpen, setGuideOpen] = useState(false)
    const [stepIndex, setStepIndex] = useState(0)
    const [displayedText, setDisplayedText] = useState("")
    const [isTypingGuide, setIsTypingGuide] = useState(false)
    const guideRef = useRef(null)
    const autoNextRef = useRef(null)

    const handleSocialLogin = async (authProvider, type) => {
        setLoginLoading(type)
        setLoginError('')
        try {
            const result = await signInWithPopup(auth, authProvider)
            const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/google`, {
                name: result.user.displayName, email: result.user.email, avatar: result.user.photoURL
            }, { withCredentials: true })
            dispatch(setUserData(data))
            navigate('/dashboard')
        } catch (err) {
            setLoginError(err.message || "Login failed")
        } finally {
            setLoginLoading(null)
        }
    }

    const typewriterEffect = (text, onDone) => {
        clearInterval(guideRef.current)
        clearTimeout(autoNextRef.current)
        setDisplayedText("")
        setIsTypingGuide(true)
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel()
            const utterance = new SpeechSynthesisUtterance(text)
            utterance.lang = 'en-US'; utterance.rate = 0.9; utterance.pitch = 1.1; utterance.volume = 0.8
            window.speechSynthesis.speak(utterance)
        }
        let i = 0
        guideRef.current = setInterval(() => {
            if (i < text.length) { setDisplayedText(text.slice(0, i + 1)); i++ }
            else {
                clearInterval(guideRef.current)
                setIsTypingGuide(false)
                if (onDone) autoNextRef.current = setTimeout(onDone, 2500)
            }
        }, 20)
    }

    const handleAutoNext = (nextIndex) => {
        if (nextIndex < GUIDE_STEPS.length) {
            setStepIndex(nextIndex)
            typewriterEffect(GUIDE_STEPS[nextIndex].text, () => handleAutoNext(nextIndex + 1))
        }
    }

    const handleOpenGuide = () => { setGuideOpen(true); setStepIndex(0); typewriterEffect(GUIDE_STEPS[0].text, () => handleAutoNext(1)) }
    const handleCloseGuide = () => {
        setGuideOpen(false); clearInterval(guideRef.current); clearTimeout(autoNextRef.current)
        setDisplayedText(""); setStepIndex(0)
        if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
    const handlePrev = () => {
        clearTimeout(autoNextRef.current); clearInterval(guideRef.current)
        if ('speechSynthesis' in window) window.speechSynthesis.cancel()
        const p = stepIndex - 1
        if (p >= 0) { setStepIndex(p); typewriterEffect(GUIDE_STEPS[p].text, () => handleAutoNext(p + 1)) }
    }

    // ── LOGGED IN VIEW ──────────────────────────────────────────────
    if (userData) {
        return (
            <div className="min-h-screen bg-[#020208] text-white" style={{ cursor: 'none' }}>
                <ScrollProgress />
                <style>{`
                    * { cursor: none !important; }
                    .cursor-dot { pointer-events: none; position: fixed; z-index: 9999; border-radius: 50%; transform: translate(-50%,-50%); transition: width 0.2s, height 0.2s; }
                    @keyframes orbRotate { from { transform: rotateZ(0deg) rotateX(60deg); } to { transform: rotateZ(360deg) rotateX(60deg); } }
                    @keyframes orbRotate2 { from { transform: rotateZ(0deg) rotateX(45deg); } to { transform: rotateZ(-360deg) rotateX(45deg); } }
                    @keyframes orbRotate3 { from { transform: rotateZ(120deg) rotateX(75deg); } to { transform: rotateZ(480deg) rotateX(75deg); } }
                    @keyframes pulse3d { 0%,100% { box-shadow: 0 0 40px 10px rgba(99,102,241,0.5), 0 0 80px 20px rgba(139,92,246,0.3); } 50% { box-shadow: 0 0 60px 20px rgba(99,102,241,0.8), 0 0 120px 40px rgba(139,92,246,0.5); } }
                    @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
                    @keyframes ripple { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.5); opacity: 0; } }
                    .orb-ring-1 { animation: orbRotate 4s linear infinite; }
                    .orb-ring-2 { animation: orbRotate2 6s linear infinite; }
                    .orb-ring-3 { animation: orbRotate3 8s linear infinite; }
                    .orb-core { animation: pulse3d 3s ease-in-out infinite; }
                    .robot-float { animation: float 4s ease-in-out infinite; }
                    .ripple-ring { animation: ripple 2s ease-out infinite; }
                    .ripple-ring-2 { animation: ripple 2s ease-out infinite 0.5s; }
                    .ripple-ring-3 { animation: ripple 2s ease-out infinite 1s; }
                `}</style>

                <CursorGlow />

                {/* Stars Background */}
                <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                    {[...Array(80)].map((_, i) => (
                        <motion.div key={i} className="absolute rounded-full bg-white"
                            style={{ width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, opacity: Math.random() * 0.6 + 0.1 }}
                            animate={{ opacity: [0.1, 0.8, 0.1] }} transition={{ duration: 2 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 4 }} />
                    ))}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
                    <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                </div>

                {/* Navbar */}
                <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5" style={{ background: 'rgba(2,2,8,0.8)', zIndex: 10 }}>
                    <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}><Sparkles size={16} className="text-white" /></div>
                            <span className="font-black text-lg" style={{ background: 'linear-gradient(90deg,#a78bfa,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dora AI</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="hidden md:flex items-center gap-1.5 text-xs text-zinc-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                                <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />
                                {userData.credits} credits
                            </span>
                            <button onClick={() => navigate('/dashboard')} className="px-3 py-2 text-sm text-zinc-400 hover:text-white transition rounded-lg hover:bg-white/5">Dashboard</button>
                            <button onClick={() => navigate('/generate')} className="px-4 py-2 rounded-xl text-sm font-bold transition" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>+ Generate</button>
                            <img referrerPolicy="no-referrer" src={userData?.avatar || `https://ui-avatars.com/api/?name=${userData?.name}`} className="w-8 h-8 rounded-full border-2 border-indigo-500/40 cursor-pointer" onClick={() => navigate('/dashboard')} />
                            <button onClick={async () => { await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/logout`, { withCredentials: true }); dispatch(setUserData(null)) }}
                                className="px-3 py-2 text-sm text-red-400 hover:text-red-300 transition rounded-lg">Logout</button>
                        </div>
                    </div>
                </nav>

                <div className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto" style={{ zIndex: 2 }}>

                    {/* Announcement */}
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs" style={{ background: 'rgba(99,102,241,0.1)', borderColor: 'rgba(99,102,241,0.3)', color: '#a78bfa' }}>
                            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                            🚀 New: Deploy to Netlify in one click!
                            <button onClick={() => navigate('/generate')} className="underline hover:text-white transition">Try now →</button>
                        </div>
                    </motion.div>

                    {/* 3D Orb Hero */}
                    <div className="text-center mb-8">
                        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "easeOut" }} className="relative inline-block mb-8">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="ripple-ring absolute w-48 h-48 rounded-full border border-indigo-500/20" />
                                <div className="ripple-ring-2 absolute w-48 h-48 rounded-full border border-purple-500/20" />
                                <div className="ripple-ring-3 absolute w-48 h-48 rounded-full border border-indigo-400/15" />
                            </div>
                            <div className="robot-float relative" style={{ width: '200px', height: '200px', perspective: '800px', margin: '0 auto' }}>
                                <div className="orb-ring-1 absolute inset-0 rounded-full" style={{ border: '2px solid rgba(99,102,241,0.6)', boxShadow: '0 0 15px rgba(99,102,241,0.4)', transformStyle: 'preserve-3d' }}>
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-indigo-400" style={{ boxShadow: '0 0 10px rgba(99,102,241,1)' }} />
                                </div>
                                <div className="orb-ring-2 absolute" style={{ inset: '15px', borderRadius: '50%', border: '2px solid rgba(139,92,246,0.5)', boxShadow: '0 0 12px rgba(139,92,246,0.3)', transformStyle: 'preserve-3d' }}>
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-purple-400" style={{ boxShadow: '0 0 8px rgba(139,92,246,1)' }} />
                                </div>
                                <div className="orb-ring-3 absolute" style={{ inset: '30px', borderRadius: '50%', border: '1px solid rgba(167,139,250,0.4)', boxShadow: '0 0 10px rgba(167,139,250,0.2)', transformStyle: 'preserve-3d' }}>
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-violet-300" style={{ boxShadow: '0 0 6px rgba(167,139,250,1)' }} />
                                </div>
                                <div className="orb-core absolute rounded-full flex items-center justify-center" style={{ inset: '50px', background: 'radial-gradient(circle at 35% 35%, rgba(139,92,246,0.9), rgba(99,102,241,0.7), rgba(15,15,40,0.9))', border: '2px solid rgba(139,92,246,0.6)' }}>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex gap-2">
                                            <motion.div animate={{ opacity: [1, 0.2, 1], scaleY: [1, 0.1, 1] }} transition={{ repeat: Infinity, duration: 3, times: [0, 0.5, 1] }} className="w-2 h-2 rounded-full bg-white" style={{ boxShadow: '0 0 6px white' }} />
                                            <motion.div animate={{ opacity: [1, 0.2, 1], scaleY: [1, 0.1, 1] }} transition={{ repeat: Infinity, duration: 3, delay: 0.15, times: [0, 0.5, 1] }} className="w-2 h-2 rounded-full bg-white" style={{ boxShadow: '0 0 6px white' }} />
                                        </div>
                                        <motion.div animate={{ scaleX: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-4 h-0.5 rounded-full bg-white/60" />
                                    </div>
                                    <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-white/30 blur-sm" />
                                </div>
                                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                                    <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full"
                                        style={{ background: i % 2 === 0 ? '#6366f1' : '#8b5cf6', boxShadow: `0 0 6px ${i % 2 === 0 ? '#6366f1' : '#8b5cf6'}`, top: '50%', left: '50%' }}
                                        animate={{ x: [Math.cos(deg * Math.PI / 180) * 85, Math.cos((deg + 360) * Math.PI / 180) * 85], y: [Math.sin(deg * Math.PI / 180) * 85, Math.sin((deg + 360) * Math.PI / 180) * 85] }}
                                        transition={{ duration: 4 + i * 0.3, repeat: Infinity, ease: "linear" }} />
                                ))}
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex items-center justify-center gap-3 mb-4">
                            <img referrerPolicy="no-referrer" src={userData?.avatar || `https://ui-avatars.com/api/?name=${userData?.name}`} className="w-8 h-8 rounded-full border border-indigo-500/40" />
                            <span className="text-zinc-400 text-sm">Welcome back, <span className="text-white font-semibold">{userData.name}</span></span>
                        </motion.div>

                        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-4">
                            <span className="text-white">Where ideas</span><br />
                            <span style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>become reality</span>
                        </motion.h1>

                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-zinc-600 text-sm mb-8 max-w-md mx-auto font-mono">
                            // Build fully functional websites through simple conversations with AI
                        </motion.p>

                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="max-w-2xl mx-auto mb-12">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 rounded-3xl opacity-0 group-focus-within:opacity-100 transition duration-500" style={{ background: 'linear-gradient(90deg,rgba(99,102,241,0.3),rgba(139,92,246,0.3))', filter: 'blur(8px)' }} />
                                <div className="relative flex items-center gap-3 px-5 py-4 rounded-3xl border border-white/10 group-focus-within:border-indigo-500/30 transition" style={{ background: 'rgba(10,10,20,0.8)' }}>
                                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shrink-0" />
                                    <input type="text" placeholder="Describe your website... e.g. 'Build a SaaS landing page'"
                                        className="flex-1 bg-transparent outline-none text-sm text-zinc-300 placeholder-zinc-700 font-mono"
                                        onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value) navigate('/generate') }} />
                                    <motion.button onClick={() => navigate('/generate')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold shrink-0"
                                        style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
                                        <Zap size={14} /> Generate
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Action Cards */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { icon: "⚡", title: "Generate Website", desc: "Build with AI", gradient: "from-indigo-500/15 to-purple-500/15", border: "border-indigo-500/20 hover:border-indigo-500/50", path: "/generate", glow: "rgba(99,102,241,0.3)" },
                            { icon: "📁", title: "My Projects", desc: `${userData.credits} credits left`, gradient: "from-purple-500/15 to-pink-500/15", border: "border-purple-500/20 hover:border-purple-500/50", path: "/dashboard", glow: "rgba(139,92,246,0.3)" },
                            { icon: "💳", title: "Buy Credits", desc: "Upgrade your plan", gradient: "from-yellow-500/15 to-orange-500/15", border: "border-yellow-500/20 hover:border-yellow-500/50", path: "/pricing", glow: "rgba(234,179,8,0.3)" },
                            { icon: "👤", title: "My Profile", desc: "Settings & account", gradient: "from-green-500/15 to-cyan-500/15", border: "border-green-500/20 hover:border-green-500/50", path: "/dashboard", glow: "rgba(34,197,94,0.3)" },
                        ].map((card, i) => (
                            <motion.button key={i} onClick={() => navigate(card.path)} whileHover={{ y: -6, scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                className={`p-5 rounded-2xl bg-gradient-to-br border text-left transition-all duration-300 group relative overflow-hidden ${card.gradient} ${card.border}`}>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" style={{ background: `radial-gradient(circle at 50% 0%, ${card.glow}, transparent 70%)` }} />
                                <span className="text-2xl mb-3 block relative z-10">{card.icon}</span>
                                <p className="font-bold text-white text-sm mb-1 relative z-10">{card.title}</p>
                                <p className="text-xs text-zinc-500 relative z-10">{card.desc}</p>
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Stats */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-4">
                        {[
                            { label: "Credits", value: userData.credits, icon: "⚡", color: "#fbbf24" },
                            { label: "Plan", value: userData.plan || "Free", icon: "💎", color: "#a78bfa" },
                            { label: "Since", value: new Date(userData.createdAt).toLocaleDateString('en', { month: 'short', year: '2-digit' }), icon: "📅", color: "#34d399" },
                        ].map((stat, i) => (
                            <motion.div key={i} whileHover={{ scale: 1.05 }} className="rounded-2xl p-4 text-center border border-white/5 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at 50% 0%, ${stat.color}, transparent)` }} />
                                <p className="text-lg mb-1">{stat.icon}</p>
                                <p className="text-lg font-black" style={{ color: stat.color }}>{stat.value}</p>
                                <p className="text-xs text-zinc-600">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* ── New Sections ── */}
                    <BuildIdeas navigate={navigate} />
                    <CommunityStats />
                    <TipsCarousel />
                    <WhatsNew navigate={navigate} />
<Testimonials />
</div>

                {/* AI Guide */}
                <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
                    <AnimatePresence>
                        {guideOpen && (
                            <motion.div initial={{ opacity: 0, y: 16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.95 }}
                                className="w-80 border border-white/10 rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'rgba(10,10,20,0.95)' }}>
                                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10" style={{ background: 'rgba(99,102,241,0.15)' }}>
                                    <div className="flex items-center gap-2"><Bot size={16} className="text-indigo-400" /><span className="text-sm font-semibold">Dora AI Guide</span></div>
                                    <button onClick={handleCloseGuide}><X size={16} className="text-zinc-400" /></button>
                                </div>
                                <div className="flex gap-1.5 px-4 pt-3">{GUIDE_STEPS.map((_, i) => <div key={i} className={`h-1 flex-1 rounded-full ${i <= stepIndex ? 'bg-indigo-500' : 'bg-white/10'}`} />)}</div>
                                <div className="px-4 py-4 min-h-28 flex items-start gap-3">
                                    <span className="text-2xl">{GUIDE_STEPS[stepIndex].emoji}</span>
                                    <p className="text-sm text-zinc-300">{displayedText}{isTypingGuide && <span className="animate-pulse text-indigo-400">|</span>}</p>
                                </div>
                                <div className="flex items-center justify-between px-4 pb-4">
                                    <span className="text-xs text-zinc-500">{stepIndex + 1}/{GUIDE_STEPS.length}</span>
                                    <div className="flex gap-2">
                                        <button onClick={handlePrev} disabled={stepIndex === 0} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30">← Back</button>
                                        {stepIndex + 1 < GUIDE_STEPS.length
                                            ? <span className="text-xs text-zinc-500 italic">Auto advancing...</span>
                                            : <button onClick={() => navigate('/generate')} className="text-xs px-3 py-1.5 rounded-lg bg-green-500">Build 🚀</button>}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <motion.button onClick={guideOpen ? handleCloseGuide : handleOpenGuide} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                        className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center"
                        style={{ background: guideOpen ? 'white' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 0 20px rgba(99,102,241,0.4)', color: guideOpen ? 'black' : 'white' }}>
                        {guideOpen ? <X size={22} /> : <Bot size={22} />}
                    </motion.button>
                </div>
            </div>
        )
    }

    // ── NOT LOGGED IN VIEW ──────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <ScrollProgress />
            <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

                {/* LEFT — Login */}
                <div className="flex flex-col justify-center px-8 md:px-16 py-16 relative">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]" />
                    </div>
                    <div className="relative max-w-md mx-auto w-full">
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-12">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"><Sparkles size={20} className="text-white" /></div>
                            <span className="font-black text-2xl bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent tracking-tight">Dora AI</span>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3">
                                Build Stunning Websites<br />
                                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">with AI in Minutes</span>
                            </h1>
                            <p className="text-zinc-500 text-sm leading-relaxed">Describe your vision. AI generates production-ready HTML, CSS & JS. No coding required.</p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
                            {loginError && <div className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">{loginError}</div>}

                            <motion.button onClick={() => handleSocialLogin(provider, 'google')} disabled={!!loginLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                className="w-full h-13 rounded-2xl bg-white text-black font-semibold flex items-center justify-center gap-3 hover:bg-zinc-100 transition disabled:opacity-60 shadow-lg">
                                {loginLoading === 'google' ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png" className="h-5 w-5" />}
                                Continue with Google
                            </motion.button>

                            <motion.button onClick={() => handleSocialLogin(githubProvider, 'github')} disabled={!!loginLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                className="w-full h-13 rounded-2xl bg-[#1a1a1a] text-white font-semibold flex items-center justify-center gap-3 border border-white/10 hover:bg-[#222] transition disabled:opacity-60">
                                {loginLoading === 'github' ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> :
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>}
                                Continue with GitHub
                            </motion.button>

                            {!showEmail ? (
                                <motion.button onClick={() => setShowEmail(true)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                    className="w-full h-13 rounded-2xl bg-white/5 text-white font-semibold flex items-center justify-center gap-3 border border-white/10 hover:bg-white/10 transition">
                                    <Mail size={18} /> Continue with Email
                                </motion.button>
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5">
                                    {isSignUp && <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white placeholder-zinc-600 transition" />}
                                    <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white placeholder-zinc-600 transition" />
                                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 text-white placeholder-zinc-600 transition" />
                                    <button className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:opacity-90 transition">{isSignUp ? "Create Account" : "Sign In"}</button>
                                    <div className="flex justify-between text-xs text-zinc-500">
                                        <button onClick={() => setShowEmail(false)} className="hover:text-white transition">← Back</button>
                                        <button onClick={() => setIsSignUp(!isSignUp)} className="hover:text-white transition">{isSignUp ? "Already have account?" : "No account? Sign up"}</button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>

                        <div className="flex items-center gap-4 my-6"><div className="h-px flex-1 bg-white/10" /><span className="text-xs text-zinc-600">OR</span><div className="h-px flex-1 bg-white/10" /></div>

                        <motion.button onClick={() => navigate('/generate')} whileHover={{ scale: 1.02 }}
                            className="w-full h-12 rounded-2xl border border-indigo-500/30 text-indigo-400 font-semibold flex items-center justify-center gap-2 hover:bg-indigo-500/10 transition text-sm">
                            Try without account <ArrowRight size={14} />
                        </motion.button>

                        <p className="text-xs text-zinc-700 text-center mt-4">
                            By continuing you agree to our <span className="underline cursor-pointer hover:text-zinc-400">Terms</span> & <span className="underline cursor-pointer hover:text-zinc-400">Privacy Policy</span>
                        </p>
                    </div>
                </div>

                {/* RIGHT — Carousel */}
                <div className="hidden lg:flex flex-col justify-center items-center bg-[#050505] border-l border-white/5 relative overflow-hidden px-8">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/4 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px]" />
                        <div className="absolute bottom-1/4 left-0 w-60 h-60 bg-indigo-600/10 rounded-full blur-[100px]" />
                        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(to right, #fff2 1px, transparent 1px), linear-gradient(to bottom, #fff2 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
                    </div>
                    <div className="relative w-full max-w-lg">
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl">
                                <div><p className="text-2xl font-black text-white">500+</p><p className="text-xs text-zinc-500">Websites Generated</p></div>
                                <div className="w-px h-8 bg-white/10" />
                                <div><p className="text-2xl font-black text-white">2 min</p><p className="text-xs text-zinc-500">Average Build Time</p></div>
                                <div className="w-px h-8 bg-white/10" />
                                <div><p className="text-2xl font-black text-white">100%</p><p className="text-xs text-zinc-500">Responsive</p></div>
                            </div>
                        </motion.div>
                        <div className="relative">
                            <AnimatePresence mode="wait">
                                <motion.div key={activeCard} initial={{ opacity: 0, x: 40, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -40, scale: 0.95 }} transition={{ duration: 0.4, ease: "easeOut" }} className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
                                    <div className="bg-zinc-900 px-4 py-2.5 flex items-center gap-3 border-b border-white/10">
                                        <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/70" /><div className="w-3 h-3 rounded-full bg-yellow-500/70" /><div className="w-3 h-3 rounded-full bg-green-500/70" /></div>
                                        <div className="flex-1 bg-white/5 rounded-md px-3 py-1 text-xs text-zinc-500">dora.ai/{SAMPLE_WEBSITES[activeCard].title.toLowerCase().replace(/\s+/g, '-')}</div>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">{SAMPLE_WEBSITES[activeCard].tag}</span>
                                    </div>
                                    <div className="h-72 bg-zinc-950 overflow-hidden"><iframe srcDoc={SAMPLE_WEBSITES[activeCard].preview} className="w-full h-full border-0 pointer-events-none" /></div>
                                    <div className="bg-zinc-900/80 px-4 py-3 flex items-center justify-between border-t border-white/5">
                                        <span className="text-sm font-semibold text-white">{SAMPLE_WEBSITES[activeCard].title}</span>
                                        <div className="flex items-center gap-1.5 text-xs text-green-400"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />Built by AI</div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                            <div className="flex justify-center gap-2 mt-4">
                                {SAMPLE_WEBSITES.map((_, i) => <button key={i} onClick={() => setActiveCard(i)} className={`rounded-full transition-all duration-300 ${i === activeCard ? 'bg-indigo-500 w-6 h-2' : 'bg-white/20 w-2 h-2'}`} />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features */}
        <section className="py-24 px-6 bg-[#050505] border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <p className="text-xs text-indigo-400 uppercase tracking-widest font-semibold mb-3">FEATURES</p>
                        <h2 className="text-3xl md:text-4xl font-black mb-4">What can Dora AI do for you?</h2>
                        <p className="text-zinc-500 max-w-xl mx-auto">From concept to deployment, Dora AI handles every aspect of website creation so you can focus on what matters most — your vision.</p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", title: "Instant Generation", desc: "Describe your website in plain English and get a fully responsive, production-ready website in minutes." },
                            { icon: LayoutTemplate, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20", title: "Responsive Design", desc: "Every website is built mobile-first and looks perfect on all screen sizes." },
                            { icon: Code2, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20", title: "Clean Code Export", desc: "Export clean, readable HTML, CSS & JS files as a ZIP. Own your code completely." },
                            { icon: Bot, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", title: "AI Chat Editor", desc: "Chat with AI to make changes after generation. Say make the hero darker and it's done." },
                            { icon: Rocket, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20", title: "One-Click Deploy", desc: "Deploy your website to Netlify instantly and get a live URL to share with the world." },
                            { icon: Globe, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20", title: "AI Guide & Explain", desc: "AI walks you through each section of your generated website and explains what it does." },
                        ].map((f, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl bg-white/3 border border-white/8 hover:border-white/15 transition">
                                <div className={`inline-flex p-3 rounded-xl border mb-4 ${f.bg}`}><f.icon size={20} className={f.color} /></div>
                                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 px-6 bg-[#030303] border-t border-white/5">
                <div className="max-w-3xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                        <p className="text-xs text-indigo-400 uppercase tracking-widest font-semibold mb-3">FAQ</p>
                        <h2 className="text-3xl md:text-4xl font-black mb-4">Curious about Dora AI?</h2>
                        <p className="text-zinc-500">We got you covered.</p>
                    </motion.div>
                    <div className="space-y-3">
                        {FAQS.map((faq, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="border border-white/8 rounded-2xl overflow-hidden">
                                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/3 transition">
                                    <span className="font-semibold text-sm md:text-base">{faq.q}</span>
                                    <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown size={18} className="text-zinc-400 shrink-0 ml-4" /></motion.div>
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
                                            <p className="px-6 pb-5 text-zinc-400 text-sm leading-relaxed border-t border-white/5 pt-4">{faq.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-[#030303] pt-16 pb-8 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                        <div className="lg:col-span-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><Sparkles size={18} className="text-white" /></div>
                                <span className="font-black text-xl bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Dora AI</span>
                            </div>
                            <p className="text-zinc-500 text-sm leading-relaxed mb-6">Build production-ready websites through AI. Describe your vision, deploy in minutes.</p>
                            <div className="flex gap-3">
                                <a href="https://github.com/Yash8439" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                                </a>
                                <a href="https://www.linkedin.com/in/yash-rastogi-80a84b28b/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 transition">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                </a>
                                <a href="mailto:rastogiyash303@gmail.com" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition"><Mail size={16} /></a>
                            </div>
                        </div>
                        <div>
    <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
    <ul className="space-y-3">
        {[
          { label: "Features", path: "/#features" },
          { label: "Pricing", path: "/pricing" },
          { label: "How it Works", path: "/#how-it-works" }
        ].map(link => (
            <li key={link.label}>
              <button onClick={() => navigate(link.path)} 
                className="text-sm text-zinc-500 hover:text-white transition">
                {link.label}
              </button>
            </li>
        ))}
    </ul>
</div>
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
                            <ul className="space-y-3">
                                <li><a href="https://github.com/Yash8439" target="_blank" rel="noreferrer" className="text-sm text-zinc-500 hover:text-white transition">GitHub</a></li>
                                <li><a href="https://www.linkedin.com/in/yash-rastogi-80a84b28b/" target="_blank" rel="noreferrer" className="text-sm text-zinc-500 hover:text-white transition">LinkedIn</a></li>
                                <li><a href="mailto:rastogiyash303@gmail.com" className="text-sm text-zinc-500 hover:text-white transition">Email Us</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white mb-4">Contact Us</h4>
                            <p className="text-zinc-500 text-sm mb-4 leading-relaxed">Have questions or feedback? We would love to hear from you.</p>
                            <a href="mailto:rastogiyash303@gmail.com" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-zinc-300 hover:bg-white/10 hover:text-white transition">
                                <Mail size={14} /> rastogiyash303@gmail.com
                            </a>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-zinc-600">© 2026 Dora AI. All rights reserved.</p>
                        <p className="text-xs text-zinc-600 flex items-center gap-1.5">
                            Designed & Built by{" "}
                            <a href="https://www.linkedin.com/in/yash-rastogi-80a84b28b/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 transition font-medium">Yash Rastogi</a> ❤️
                        </p>
                        <div className="flex gap-4 text-xs text-zinc-600">
                            <span className="cursor-pointer hover:text-zinc-400 transition">Terms of Service</span>
                            <span className="cursor-pointer hover:text-zinc-400 transition">Privacy Policy</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating AI Guide */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
                <AnimatePresence>
                    {guideOpen && (
                        <motion.div initial={{ opacity: 0, y: 16, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.95 }} className="w-80 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-indigo-600/20">
                                <div className="flex items-center gap-2"><Bot size={16} className="text-indigo-400" /><span className="text-sm font-semibold">Dora AI Guide</span></div>
                                <button onClick={handleCloseGuide}><X size={16} className="text-zinc-400" /></button>
                            </div>
                            <div className="flex gap-1.5 px-4 pt-3">{GUIDE_STEPS.map((_, i) => <div key={i} className={`h-1 flex-1 rounded-full ${i <= stepIndex ? 'bg-indigo-500' : 'bg-white/10'}`} />)}</div>
                            <div className="px-4 py-4 min-h-28 flex items-start gap-3">
                                <span className="text-2xl">{GUIDE_STEPS[stepIndex].emoji}</span>
                                <p className="text-sm text-zinc-300">{displayedText}{isTypingGuide && <span className="animate-pulse text-indigo-400">|</span>}</p>
                            </div>
                            <div className="flex items-center justify-between px-4 pb-4">
                                <span className="text-xs text-zinc-500">{stepIndex + 1}/{GUIDE_STEPS.length}</span>
                                <div className="flex gap-2">
                                    <button onClick={handlePrev} disabled={stepIndex === 0} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 disabled:opacity-30">← Back</button>
                                    {stepIndex + 1 < GUIDE_STEPS.length
                                        ? <span className="text-xs text-zinc-500 italic">Auto advancing...</span>
                                        : <button onClick={() => navigate('/generate')} className="text-xs px-3 py-1.5 rounded-lg bg-green-500">Build 🚀</button>}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.button onClick={guideOpen ? handleCloseGuide : handleOpenGuide} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center ${guideOpen ? 'bg-white text-black' : 'bg-indigo-500 text-white'}`}
                    style={{ boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
                    {guideOpen ? <X size={22} /> : <Bot size={22} />}
                </motion.button>
            </div>
        </div>
    )
}

export default Home