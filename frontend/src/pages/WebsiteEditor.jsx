    import axios from 'axios'
import { Bot, Code2, Download, ExternalLink, MessageSquare, Monitor, Rocket, Send, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Editor from '@monaco-editor/react';
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const SUGGESTIONS = [
    "Explain this project",
    "Improve the design",
    "Make it mobile friendly",
]

const WebsiteEditor = () => {
    const [website, setWebsite] = useState(null)
    const [error, setError] = useState("")
    const [code, setCode] = useState("")
    const [messages, setMessages] = useState([])
    const [prompt, setPrompt] = useState("")
    const { id } = useParams()
    const iframeRef = useRef(null)
    const messagesEndRef = useRef(null)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [thinkingIndex, setThinkingIndex] = useState(0)
    const [showCode, setShowCode] = useState(false)
    const [showFullPreview, setShowFullPreview] = useState(false)
    const [showChat, setShowChat] = useState(false)
    const [exporting, setExporting] = useState(false)
    const [copied, setCopied] = useState(false)

    // Netlify deploy states
    const [netlifyLoading, setNetlifyLoading] = useState(false)
    const [netlifyUrl, setNetlifyUrl] = useState("")
    const [showNetlifyModal, setShowNetlifyModal] = useState(false)

    // AI Guide states
    const [aiGuideOn, setAiGuideOn] = useState(false)
    const [guideLoading, setGuideLoading] = useState(false)
    const [sections, setSections] = useState([])
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
    const [displayedText, setDisplayedText] = useState("")
    const typewriterRef = useRef(null)

    const thinkingSteps = [
        "Understanding your request...",
        "Planning layout changes...",
        "Improving responsiveness...",
        "Applying animations...",
        "Finalizing Update..."
    ]

    // Typewriter effect
    const typewriterEffect = (text) => {
        clearInterval(typewriterRef.current)
        setDisplayedText("")
        let i = 0
        typewriterRef.current = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(text.slice(0, i + 1))
                i++
            } else {
                clearInterval(typewriterRef.current)
            }
        }, 18)
    }

    // AI Guide
    const startAiGuide = async () => {
        if (guideLoading) return
        setGuideLoading(true)
        setDisplayedText("")
        setSections([])
        setCurrentSectionIndex(0)
        try {
            const result = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/website/explain/${id}`,
                { withCredentials: true }
            )
            const fetchedSections = result.data.sections
            setSections(fetchedSections)
            if (fetchedSections.length > 0) {
                typewriterEffect(`📌 ${fetchedSections[0].section}: ${fetchedSections[0].explanation}`)
            }
        } catch (err) {
            console.log(err)
            setDisplayedText("Could not load explanation. Please try again.")
        } finally {
            setGuideLoading(false)
        }
    }

    const handleGuideToggle = () => {
        if (aiGuideOn) {
            setAiGuideOn(false)
            clearInterval(typewriterRef.current)
            setDisplayedText("")
            setSections([])
            setCurrentSectionIndex(0)
        } else {
            setAiGuideOn(true)
            startAiGuide()
        }
    }

    const handleNextSection = () => {
        const nextIndex = currentSectionIndex + 1
        if (nextIndex < sections.length) {
            setCurrentSectionIndex(nextIndex)
            typewriterEffect(`📌 ${sections[nextIndex].section}: ${sections[nextIndex].explanation}`)
        } else {
            typewriterEffect("✅ That's a full walkthrough of your website! Great work building this.")
        }
    }

    const handlePrevSection = () => {
        const prevIndex = currentSectionIndex - 1
        if (prevIndex >= 0) {
            setCurrentSectionIndex(prevIndex)
            typewriterEffect(`📌 ${sections[prevIndex].section}: ${sections[prevIndex].explanation}`)
        }
    }

    // Deploy to Netlify
    const handleNetlifyDeploy = async () => {
        setNetlifyLoading(true)
        try {
            const result = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/website/deploy-netlify/${id}`,
                {},
                { withCredentials: true }
            )
            setNetlifyUrl(result.data.url)
            setShowNetlifyModal(true)
        } catch (err) {
            console.log(err)
            alert("Netlify deploy failed. Please try again.")
        } finally {
            setNetlifyLoading(false)
        }
    }

    const handleDeploy = async () => {
        try {
            const result = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/website/deploy/${website._id}`,
                { withCredentials: true }
            )
            window.open(`${result.data.url}`, "_blank")
        } catch (error) {
            console.log(error)
        }
    }

    const handleExportZip = async () => {
        if (!code) return
        setExporting(true)
        try {
            const parser = new DOMParser()
            const doc = parser.parseFromString(code, 'text/html')

            let cssContent = ""
            const styleTags = doc.querySelectorAll('style')
            styleTags.forEach(tag => { cssContent += tag.innerHTML + "\n"; tag.remove() })

            let jsContent = ""
            const scriptTags = doc.querySelectorAll('script')
            scriptTags.forEach(tag => {
                if (!tag.src) { jsContent += tag.innerHTML + "\n"; tag.remove() }
            })

            const head = doc.querySelector('head')
            if (cssContent) {
                const linkTag = doc.createElement('link')
                linkTag.rel = 'stylesheet'
                linkTag.href = 'style.css'
                head.appendChild(linkTag)
            }

            const body = doc.querySelector('body')
            if (jsContent) {
                const scriptTag = doc.createElement('script')
                scriptTag.src = 'script.js'
                body.appendChild(scriptTag)
            }

            const cleanHtml = `<!DOCTYPE html>\n` + doc.documentElement.outerHTML
            const zip = new JSZip()
            zip.file('index.html', cleanHtml)
            if (cssContent) zip.file('style.css', cssContent)
            if (jsContent) zip.file('script.js', jsContent)
            zip.file('README.md', `# ${website.title}\n\nGenerated by Dora AI\n\n## Files\n- index.html\n- style.css\n- script.js\n`)

            const blob = await zip.generateAsync({ type: 'blob' })
            const filename = website.title
                ? website.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 40)
                : 'dora-website'
            saveAs(blob, `${filename}.zip`)
        } catch (err) {
            console.error("Export failed:", err)
        } finally {
            setExporting(false)
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            setThinkingIndex((i) => (i + 1) % thinkingSteps.length)
        }, 1200)
        return () => clearInterval(intervalId)
    }, [updateLoading])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, updateLoading])

    useEffect(() => {
        return () => clearInterval(typewriterRef.current)
    }, [])

    const handleUpdate = async (customPrompt) => {
        const finalPrompt = customPrompt || prompt
        if (!finalPrompt.trim()) return
        setMessages((m) => [...m, { role: "user", content: finalPrompt }])
        setPrompt("")
        setUpdateLoading(true)
        try {
            const result = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/website/update/${id}`,
                { prompt: finalPrompt },
                { withCredentials: true }
            )
            setMessages((m) => [...m, { role: "ai", content: result.data.message }])
            setCode(result.data.code)
        } catch (error) {
            console.log(error)
        } finally {
            setUpdateLoading(false)
        }
    }

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/api/website/getbyid/${id}`,
                    { withCredentials: true }
                )
                setWebsite(result.data)
                setCode(result.data.latestCode)
                setMessages(result.data.conversation)
                if (result.data.netlifyUrl) setNetlifyUrl(result.data.netlifyUrl)
            } catch (error) {
                setError(error.response.data.message)
                console.log(error)
            }
        }
        handleGetWebsite()
    }, [id])

    useEffect(() => {
        if (!iframeRef.current || !code) return;
        const blob = new Blob([code], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        iframeRef.current.src = url
        return () => URL.revokeObjectURL(url)
    }, [code])

    if (error) return <div className='h-screen flex items-center justify-center bg-black text-red-400'>{error}</div>
    if (!website) return <div className='h-screen flex items-center justify-center bg-black text-white'>Loading...</div>

    const ChatMessages = () => (
        <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>
            {messages.map((m, i) => (
                <div key={i} className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : "mr-auto"}`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed 
                        ${m.role === "user" ? "bg-white text-black" : "bg-white/5 border border-white/10 text-zinc-200"}`}>
                        {m.content}
                    </div>
                </div>
            ))}
            {updateLoading && (
                <div className='max-w-[85%] mr-auto'>
                    <div className='px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic'>
                        {thinkingSteps[thinkingIndex]}
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    )

    const ChatInput = () => (
        <div className='border-t border-white/10'>
            <div className='px-3 pt-3 flex gap-2 flex-wrap'>
                {SUGGESTIONS.map((suggestion) => (
                    <button
                        key={suggestion}
                        onClick={() => handleUpdate(suggestion)}
                        disabled={updateLoading}
                        className='text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition disabled:opacity-40 disabled:cursor-not-allowed'
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
            <div className='p-3 flex gap-2'>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleUpdate()
                        }
                    }}
                    rows={1}
                    placeholder='Describe changes...'
                    className='flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 outline-none text-sm'
                />
                <button
                    disabled={updateLoading || !prompt.trim()}
                    onClick={() => handleUpdate()}
                    className='px-4 py-3 rounded-2xl bg-white text-black disabled:opacity-40 disabled:cursor-not-allowed'
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    )

    return (
        <div className='h-screen w-screen flex bg-black text-white overflow-hidden'>

            {/* Desktop Sidebar */}
            <aside className='hidden lg:flex w-95 flex-col border-r border-white/10 bg-black/80'>
                <Header />
                <ChatMessages />
                <ChatInput />
            </aside>

            {/* Preview */}
            <div className='flex-1 flex flex-col'>
                <div className='h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80'>
                    <span className='text-xs text-zinc-400'>Live Preview</span>
                    <div className='flex gap-2 items-center flex-wrap'>

                        {/* AI Guide Toggle */}
                        <button
                            onClick={handleGuideToggle}
                            disabled={guideLoading}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-40 disabled:cursor-not-allowed
                                ${aiGuideOn ? 'bg-indigo-500 text-white' : 'border border-white/10 bg-white/5 hover:bg-white/10'}`}
                        >
                            <Bot size={14} />
                            {guideLoading ? "Loading..." : aiGuideOn ? "Guide ON" : "AI Guide"}
                        </button>

                        {/* Export ZIP */}
                        <button
                            onClick={handleExportZip}
                            disabled={exporting}
                            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium transition disabled:opacity-40 disabled:cursor-not-allowed'
                        >
                            <Download size={14} />
                            {exporting ? "Exporting..." : "Export ZIP"}
                        </button>

                        {/* Deploy to Netlify */}
                        <button
                            onClick={handleNetlifyDeploy}
                            disabled={netlifyLoading}
                            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed'
                        >
                            <ExternalLink size={14} />
                            {netlifyLoading ? "Deploying..." : "Deploy to Netlify"}
                        </button>

                        <button onClick={() => setShowChat(true)} className='p-2 lg:hidden'><MessageSquare size={18} /></button>
                        <button onClick={() => setShowCode(true)} className='p-2'><Code2 size={18} /></button>
                        <button onClick={() => setShowFullPreview(true)} className='p-2'><Monitor size={18} /></button>
                    </div>
                </div>

                {/* iframe */}
                <div className='flex-1 relative'>
                    <iframe
                        ref={iframeRef}
                        className='w-full h-full bg-white'
                        sandbox='allow-scripts allow-same-origin allow-forms'
                    />

                    {/* AI Guide Overlay */}
                    <AnimatePresence>
                        {aiGuideOn && displayedText && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className='absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl
                                    bg-black/80 backdrop-blur-xl border border-white/10 
                                    rounded-2xl px-5 py-4 shadow-2xl'
                            >
                                {sections.length > 0 && (
                                    <div className='flex items-center gap-2 mb-2'>
                                        {sections.map((_, i) => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= currentSectionIndex ? 'bg-indigo-500' : 'bg-white/10'}`} />
                                        ))}
                                    </div>
                                )}
                                <div className='flex items-start gap-3'>
                                    <Bot size={18} className='text-indigo-400 mt-0.5 shrink-0' />
                                    <p className='text-sm text-zinc-200 leading-relaxed'>
                                        {displayedText}
                                        <span className='animate-pulse'>|</span>
                                    </p>
                                </div>
                                {sections.length > 0 && (
                                    <div className='flex items-center justify-between mt-3'>
                                        <span className='text-xs text-zinc-500'>{currentSectionIndex + 1} / {sections.length}</span>
                                        <div className='flex gap-2'>
                                            <button
                                                onClick={handlePrevSection}
                                                disabled={currentSectionIndex === 0}
                                                className='text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 transition'
                                            >
                                                ← Prev
                                            </button>
                                            <button
                                                onClick={handleNextSection}
                                                className='text-xs px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 transition'
                                            >
                                                {currentSectionIndex + 1 >= sections.length ? "Finish ✓" : "Next →"}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ✅ Netlify Success Modal */}
            <AnimatePresence>
                {showNetlifyModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm'
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className='bg-[#0f0f0f] border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl'
                        >
                            <div className='text-center'>
                                <div className='text-4xl mb-4'>🎉</div>
                                <h2 className='text-xl font-bold mb-2'>Deployed to Netlify!</h2>
                                <p className='text-zinc-400 text-sm mb-6'>Your website is live and accessible to the world.</p>

                                <div className='bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6 flex items-center gap-3'>
                                    <ExternalLink size={16} className='text-teal-400 shrink-0' />
                                    <span className='text-sm text-teal-300 truncate'>{netlifyUrl}</span>
                                </div>

                                <div className='flex gap-3'>
                                    <button
                                        onClick={() => window.open(netlifyUrl, '_blank')}
                                        className='flex-1 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 font-semibold text-sm transition flex items-center justify-center gap-2'
                                    >
                                        <ExternalLink size={16} /> Open Site
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(netlifyUrl)
                                        }}
                                        className='flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold text-sm transition'
                                    >
                                        Copy Link
                                    </button>
                                </div>

                                <button
                                    onClick={() => setShowNetlifyModal(false)}
                                    className='mt-4 text-xs text-zinc-500 hover:text-white transition'
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Chat */}
            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        className='fixed inset-0 z-9999 flex flex-col bg-black'
                    >
                        <Header />
                        <ChatMessages />
                        <ChatInput />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Code Editor */}
            <AnimatePresence>
                {showCode && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        className='fixed inset-y-0 right-0 w-full lg:w-[45%] z-9999 flex flex-col bg-[#1e1e1e]'
                    >
                        <div className='h-12 px-4 flex justify-between items-center border-b border-white/10 bg-[#1e1e1e]'>
    <span className='text-sm font-medium'>index.html</span>
    <div className='flex items-center gap-2'>
        <button
            onClick={() => {
                navigator.clipboard.writeText(code)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
            }}
            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs transition'
        >
            {copied ? '✓ Copied!' : '⎘ Copy Code'}
        </button>
        <button onClick={() => setShowCode(false)}><X size={18} /></button>
    </div>
</div>
                        <Editor theme='vs-dark' value={code} language='html' onChange={(v) => setCode(v)} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Full Preview */}
            <AnimatePresence>
                {showFullPreview && (
                    <motion.div className='fixed inset-0 bg-black z-9999'>
                        <iframe
                            className='w-full h-full bg-white'
                            srcDoc={code}
                            sandbox='allow-scripts allow-same-origin allow-forms'
                        />
                        <button
                            onClick={() => setShowFullPreview(false)}
                            className='absolute top-4 right-4 p-2 bg-black/70 rounded-lg'
                        >
                            <X />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )

    function Header() {
        return (
            <div className='h-14 px-4 flex items-center justify-between border-b border-white/10'>
                <span className='font-semibold truncate'>{website.title}</span>
                <button onClick={() => setShowChat(false)} className='lg:hidden'><X /></button>
            </div>
        )
    }
}

export default WebsiteEditor

    
