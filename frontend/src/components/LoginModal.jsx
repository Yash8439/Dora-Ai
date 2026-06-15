import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Sparkles, X, Mail, Eye, EyeOff } from 'lucide-react'
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, provider, githubProvider } from '../firebase'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const LoginModal = ({ open, onClose }) => {
    const dispatch = useDispatch()
    const [showEmail, setShowEmail] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSocialAuth = async (authProvider) => {
        try {
            setLoading(true)
            setError('')
            const result = await signInWithPopup(auth, authProvider)
            const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/google`, {
                name: result.user.displayName,
                email: result.user.email,
                avatar: result.user.photoURL
            }, { withCredentials: true })
            dispatch(setUserData(data))
            onClose()
        } catch (error) {
            setError(error.message || "Login failed")
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleEmailAuth = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            let result
            if (isSignUp) {
                result = await createUserWithEmailAndPassword(auth, email, password)
            } else {
                result = await signInWithEmailAndPassword(auth, email, password)
            }
            const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/google`, {
                name: name || result.user.displayName || email.split('@')[0],
                email: result.user.email,
                avatar: result.user.photoURL || `https://ui-avatars.com/api/?name=${name || email}`
            }, { withCredentials: true })
            dispatch(setUserData(data))
            onClose()
        } catch (error) {
            if (error.code === 'auth/user-not-found') setError('No account found. Please sign up.')
            else if (error.code === 'auth/wrong-password') setError('Incorrect password.')
            else if (error.code === 'auth/email-already-in-use') setError('Email already in use.')
            else if (error.code === 'auth/weak-password') setError('Password must be at least 6 characters.')
            else setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    if (!open) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 flex z-[100] items-center justify-center bg-black/80 backdrop-blur-xl px-4'
        >
            <motion.div
                initial={{ scale: 0.88, opacity: 0, y: 60 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className='relative w-full max-w-md p-px rounded-3xl bg-gradient-to-br from-purple-500/40 via-blue-500/30 to-transparent'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='relative rounded-3xl bg-[#0b0b0b] border border-white/10 shadow-2xl overflow-hidden'>

                    {/* Glows */}
                    <div className='absolute -top-32 -left-32 w-80 h-80 bg-purple-500/20 blur-[140px] pointer-events-none' />
                    <div className='absolute -bottom-32 -right-32 w-80 h-80 bg-blue-500/15 blur-[140px] pointer-events-none' />

                    {/* Close */}
                    <button onClick={onClose} className='absolute top-5 right-5 z-20 text-zinc-400 hover:text-white transition'>
                        <X size={20} />
                    </button>

                    <div className='relative px-8 pt-10 pb-8'>

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-white/10 rounded-full bg-white/5">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-gray-300">AI Website Builder</span>
                        </div>

                        {/* Title */}
                        <h2 className='text-2xl font-bold leading-tight mb-1'>
                            <span className='text-white'>Welcome to </span>
                            <span className='bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent'>Dora AI</span>
                        </h2>
                        <p className='text-zinc-500 text-sm mb-6'>Sign in to start building websites with AI</p>

                        {/* Error */}
                        {error && (
                            <div className='mb-4 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400'>
                                {error}
                            </div>
                        )}

                        {!showEmail ? (
                            <>
                                {/* Google */}
                                <motion.button
                                    onClick={() => handleSocialAuth(provider)}
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    className='w-full h-12 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-3 mb-3 hover:bg-zinc-100 transition disabled:opacity-50'
                                >
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png" className='h-5 w-5' />
                                    Continue with Google
                                </motion.button>

                                {/* GitHub */}
                                <motion.button
                                    onClick={() => handleSocialAuth(githubProvider)}
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    className='w-full h-12 rounded-xl bg-zinc-800 text-white font-semibold flex items-center justify-center gap-3 mb-3 hover:bg-zinc-700 border border-white/10 transition disabled:opacity-50'
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                                    </svg>
                                    Continue with GitHub
                                </motion.button>

                                {/* Email */}
                                <motion.button
                                    onClick={() => setShowEmail(true)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    className='w-full h-12 rounded-xl bg-white/5 text-white font-semibold flex items-center justify-center gap-3 border border-white/10 hover:bg-white/10 transition'
                                >
                                    <Mail size={18} />
                                    Continue with Email
                                </motion.button>
                            </>
                        ) : (
                            // Email Form
                            <form onSubmit={handleEmailAuth} className='space-y-3'>
                                {isSignUp && (
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                        className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 text-white placeholder-zinc-600 transition'
                                    />
                                )}
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500/50 text-white placeholder-zinc-600 transition'
                                />
                                <div className='relative'>
                                    <input
                                        type={showPass ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm outline-none focus:border-purple-500/50 text-white placeholder-zinc-600 transition'
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition'>
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>

                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    className='w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold transition disabled:opacity-50'
                                >
                                    {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
                                </motion.button>

                                <div className='flex items-center justify-between text-xs text-zinc-500'>
                                    <button type="button" onClick={() => setShowEmail(false)} className='hover:text-white transition'>
                                        ← Back
                                    </button>
                                    <button type="button" onClick={() => setIsSignUp(!isSignUp)} className='hover:text-white transition'>
                                        {isSignUp ? "Already have account? Sign in" : "No account? Sign up"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Divider */}
                        {!showEmail && (
                            <div className='flex items-center gap-4 my-5'>
                                <div className='h-px flex-1 bg-white/10' />
                                <span className='text-xs text-zinc-600'>Secure Login</span>
                                <div className='h-px flex-1 bg-white/10' />
                            </div>
                        )}

                        {/* Terms */}
                        <p className='text-xs text-zinc-600 text-center mt-4'>
                            By continuing you agree to our{" "}
                            <span className='underline cursor-pointer hover:text-zinc-300'>Terms</span>{" "}
                            and{" "}
                            <span className='underline cursor-pointer hover:text-zinc-300'>Privacy Policy</span>
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default LoginModal