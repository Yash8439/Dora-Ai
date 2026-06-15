import { ArrowLeft, Mic, MicOff, Sparkles, Zap, Code2, Layers, ShoppingBag, User, Coffee, Building2 } from 'lucide-react'
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'

// ── Terminal log lines ─────────────────────────────────────────────
const TERMINAL_LINES = [
    { delay: 0,    text: '> Initializing Dora AI engine...',           color: 'text-green-400' },
    { delay: 800,  text: '> Parsing user prompt...',                    color: 'text-blue-400' },
    { delay: 1800, text: '> Loading design system tokens...',           color: 'text-yellow-400' },
    { delay: 2800, text: '> Generating layout architecture...',         color: 'text-purple-400' },
    { delay: 4000, text: '> Writing semantic HTML structure...',        color: 'text-green-400' },
    { delay: 5200, text: '> Crafting responsive CSS grid...',           color: 'text-blue-400' },
    { delay: 6400, text: '> Adding micro-animations & transitions...',  color: 'text-pink-400' },
    { delay: 7600, text: '> Injecting JavaScript interactions...',      color: 'text-yellow-400' },
    { delay: 8800, text: '> Running quality checks...',                 color: 'text-orange-400' },
    { delay: 10000,text: '> Optimizing for mobile & desktop...',        color: 'text-green-400' },
    { delay: 11200,text: '> Finalizing output...',                      color: 'text-blue-400' },
    { delay: 12400,text: '> Almost ready! Hang tight...',               color: 'text-white' },
]

// ── Prompt suggestion chips ────────────────────────────────────────
const SUGGESTIONS = [
    { icon: User,        label: "Portfolio",      prompt: "Create a stunning portfolio website for a UI/UX designer with project gallery and contact form" },
    { icon: Building2,   label: "SaaS Landing",   prompt: "Build a modern SaaS landing page with hero section, features, pricing plans and testimonials" },
    { icon: Coffee,      label: "Restaurant",      prompt: "Design a premium restaurant website with menu, reservations, gallery and location" },
    { icon: ShoppingBag, label: "E-Commerce",     prompt: "Create an e-commerce store homepage with product grid, categories, cart and featured deals" },
    { icon: Layers,      label: "Agency",          prompt: "Build a creative digital agency website with services, team, portfolio and contact" },
    { icon: Code2,       label: "Developer",       prompt: "Create a personal developer portfolio with skills, projects, GitHub stats and blog section" },
]

// ── Matrix Canvas Background ───────────────────────────────────────
const MatrixBackground = () => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ{}</>[]()=+*&#@!'
        const fontSize = 13
        const cols = Math.floor(canvas.width / fontSize)
        const drops = Array(cols).fill(1)

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.font = `${fontSize}px monospace`

            drops.forEach((y, i) => {
                const char = chars[Math.floor(Math.random() * chars.length)]
                const x = i * fontSize

                // Color based on position — green tones
                const brightness = Math.random()
                if (brightness > 0.98) {
                    ctx.fillStyle = '#ffffff'
                } else if (brightness > 0.9) {
                    ctx.fillStyle = '#00ff88'
                } else {
                    ctx.fillStyle = 'rgba(0, 200, 100, 0.3)'
                }

                ctx.fillText(char, x, y * fontSize)

                if (y * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0
                }
                drops[i]++
            })
        }

        const interval = setInterval(draw, 50)
        return () => {
            clearInterval(interval)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 opacity-15 pointer-events-none"
            style={{ zIndex: 0 }}
        />
    )
}

// ── Terminal Loader ────────────────────────────────────────────────
const TerminalLoader = ({ progress, phase }) => {
    const [visibleLines, setVisibleLines] = useState([])

    useEffect(() => {
        const timers = TERMINAL_LINES.map((line, i) =>
            setTimeout(() => {
                setVisibleLines(prev => [...prev, i])
            }, line.delay)
        )
        return () => timers.forEach(clearTimeout)
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mt-10"
        >
            {/* Terminal Window */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-green-500/5">
                {/* Title Bar */}
                <div className="bg-zinc-900 px-4 py-3 flex items-center gap-3 border-b border-white/10">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-zinc-500 font-mono">dora-ai — website-generator</span>
                    <div className="ml-auto flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-green-400 font-mono">RUNNING</span>
                    </div>
                </div>

                {/* Terminal Body */}
                <div className="bg-black/90 p-5 font-mono text-xs space-y-1.5 min-h-48">
                    {TERMINAL_LINES.map((line, i) => (
                        <AnimatePresence key={i}>
                            {visibleLines.includes(i) && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`${line.color} flex items-center gap-2`}
                                >
                                    <span>{line.text}</span>
                                    {i === Math.max(...visibleLines) && (
                                        <span className="inline-block w-2 h-3.5 bg-current animate-pulse" />
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="bg-zinc-950 px-5 py-4 border-t border-white/5">
                    <div className="flex justify-between text-xs font-mono mb-2">
                        <span className="text-zinc-400">{phase}</span>
                        <span className="text-green-400">{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "easeOut", duration: 0.8 }}
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                        />
                    </div>
                    <p className="text-xs text-zinc-600 font-mono mt-2 text-center">
                        ⏱ Estimated time: <span className="text-zinc-400">~2-3 min</span>
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

// ── Main Component ─────────────────────────────────────────────────
const PHASES = [
    "Analyzing your idea...",
    "Designing layout and structure...",
    "Writing HTML and CSS...",
    "Adding animations & interactions...",
    "Final quality checks..."
]

const Generate = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [phaseIndex, setPhaseIndex] = useState(0)
    const [error, setError] = useState("")
    const [isListening, setIsListening] = useState(false)
    const [charCount, setCharCount] = useState(0)
    const { userData } = useSelector(state => state.user)

    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            setError("Voice input not supported. Please use Chrome!")
            return
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition()
        recognition.lang = 'en-US'
        recognition.interimResults = false
        recognition.continuous = false
        recognition.onstart = () => { setIsListening(true); setError("") }
        recognition.onend = () => setIsListening(false)
        recognition.onerror = (e) => {
            setIsListening(false)
            if (e.error === 'not-allowed') setError("Microphone permission denied.")
        }
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript
            const newPrompt = prompt + (prompt ? ' ' : '') + transcript
            setPrompt(newPrompt)
            setCharCount(newPrompt.length)
        }
        recognition.start()
    }

    const handleGenerateWebsite = async () => {
        try {
            setLoading(true)
            setError("")
            const res = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/website/generate`,
                { prompt },
                { withCredentials: true }
            )
            setProgress(100)
            dispatch(setUserData({ ...userData, credits: res.data.remainingCredits }))
            navigate(`/editor/${res.data.websiteId}`)
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong")
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!loading) { setPhaseIndex(0); setProgress(0); return }
        let value = 0
        const interval = setInterval(() => {
            const increment = value < 20 ? Math.random() * 1.5 : value < 60 ? Math.random() * 1.2 : Math.random() * 0.6
            value = Math.min(value + increment, 93)
            const phase = Math.min(Math.floor((value / 100) * PHASES.length), PHASES.length - 1)
            setProgress(Math.floor(value))
            setPhaseIndex(phase)
        }, 1200)
        return () => clearInterval(interval)
    }, [loading])

    return (
        <div className='relative min-h-screen bg-[#030303] text-white overflow-hidden'>

            {/* Matrix Background */}
            <MatrixBackground />

            {/* Overlay gradient */}
            <div className='fixed inset-0 pointer-events-none' style={{ zIndex: 1 }}>
                <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px]' />
                <div className='absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[120px]' />
                <div className='absolute bottom-0 right-0 w-[400px] h-[400px] bg-green-600/5 rounded-full blur-[120px]' />
            </div>

            {/* Header */}
            <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/60 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-white/10 transition">
                            <ArrowLeft size={16} />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <h1 className="text-lg font-semibold font-mono">Dora AI</h1>
                        </div>
                    </div>
                    {userData && (
                        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                            <Zap size={12} className="text-yellow-400" />
                            <span>{userData.credits} credits</span>
                        </div>
                    )}
                </div>
            </div>

            <div className='max-w-3xl mx-auto px-6 py-16 relative' style={{ zIndex: 2 }}>

                {/* Hero Text */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-center mb-12'
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono mb-6"
                    >
                        <Sparkles size={12} />
                        AI-Powered Website Generator
                    </motion.div>

                    <h1 className='text-4xl md:text-6xl font-black mb-4 leading-none tracking-tight'>
                        <span className="text-white">Build Website with</span>
                        <br />
                        <span className='bg-gradient-to-r from-green-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent'>
                            Real AI Power
                        </span>
                    </h1>

                    <p className='text-zinc-500 max-w-xl mx-auto text-sm font-mono'>
                        Describe your vision — AI handles the rest. Production-ready HTML, CSS & JS.
                    </p>
                </motion.div>

                {!loading ? (
                    <>
                        {/* Suggestion Chips */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-4"
                        >
                            <p className="text-xs text-zinc-600 font-mono mb-3">// quick start templates</p>
                            <div className="flex flex-wrap gap-2">
                                {SUGGESTIONS.map((s, i) => (
                                    <motion.button
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.1 + i * 0.05 }}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => { setPrompt(s.prompt); setCharCount(s.prompt.length) }}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all
                                            ${prompt === s.prompt
                                                ? 'bg-green-500/20 border border-green-500/40 text-green-300'
                                                : 'bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        <s.icon size={11} />
                                        {s.label}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Textarea */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mb-6"
                        >
                            <div className="relative group">
                                {/* Glow border on focus */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />

                                <div className="relative bg-black/80 border border-white/10 rounded-3xl overflow-hidden group-focus-within:border-green-500/30 transition duration-300">
                                    {/* Top bar */}
                                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                        <span className="text-xs text-zinc-600 font-mono">prompt.txt</span>
                                        <span className="ml-auto text-xs text-zinc-700 font-mono">{charCount}/1000</span>
                                    </div>

                                    <textarea
                                        value={prompt}
                                        onChange={(e) => { setPrompt(e.target.value); setCharCount(e.target.value.length) }}
                                        maxLength={1000}
                                        className='w-full h-44 p-5 bg-transparent outline-none resize-none text-sm leading-relaxed text-zinc-200 placeholder-zinc-700 font-mono'
                                        placeholder='// Describe your website here...'
                                    />

                                    {/* Bottom bar */}
                                    <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 bg-white/2">
                                        <div className="flex items-center gap-2">
                                            {isListening && (
                                                <motion.span
                                                    animate={{ opacity: [1, 0.5, 1] }}
                                                    transition={{ repeat: Infinity, duration: 1 }}
                                                    className='text-xs text-red-400 font-mono flex items-center gap-1.5'
                                                >
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                                                    Recording...
                                                </motion.span>
                                            )}
                                        </div>
                                        <button
                                            onClick={handleVoiceInput}
                                            disabled={loading}
                                            title='Click to speak'
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                                                isListening
                                                    ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                                                    : 'bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white'
                                            } disabled:opacity-40`}
                                        >
                                            {isListening ? <MicOff size={12} /> : <Mic size={12} />}
                                            {isListening ? 'Stop' : 'Voice'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className='mt-3 text-xs text-red-400 font-mono'
                                >
                                    ✗ {error}
                                </motion.p>
                            )}
                        </motion.div>

                        {/* Generate Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex justify-center"
                        >
                            <motion.button
                                onClick={handleGenerateWebsite}
                                whileHover={{ scale: prompt.trim() ? 1.03 : 1 }}
                                whileTap={{ scale: prompt.trim() ? 0.97 : 1 }}
                                disabled={!prompt.trim() || loading}
                                className={`relative px-16 py-4 rounded-2xl font-bold text-base font-mono transition-all overflow-hidden
                                    ${prompt.trim()
                                        ? "bg-gradient-to-r from-green-500 to-emerald-400 text-black shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
                                        : "bg-white/5 text-zinc-600 cursor-not-allowed border border-white/10"
                                    }`}
                            >
                                {prompt.trim() && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    />
                                )}
                                <span className="relative flex items-center gap-2">
                                    <Zap size={16} />
                                    Generate Website
                                </span>
                            </motion.button>
                        </motion.div>

                        {/* Bottom hint */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-center text-xs text-zinc-700 font-mono mt-6"
                        >
                            // costs 10 credits · generates in ~2-3 minutes
                        </motion.p>
                    </>
                ) : (
                    <TerminalLoader progress={progress} phase={PHASES[phaseIndex]} />
                )}
            </div>
        </div>
    )
}

export default Generate