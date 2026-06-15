import { ArrowLeft, Check, Rocket, Share2, Globe, Edit2, X, Save, Coins, Calendar, LayoutTemplate, Camera } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { motion } from 'motion/react'
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUserData } from "../redux/userSlice";

const SERVER = import.meta.env.VITE_SERVER_URL

const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4"
    >
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={18} className="text-white" />
        </div>
        <div>
            <p className="text-zinc-400 text-xs mb-0.5">{label}</p>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    </motion.div>
)

const TABS = ["My Websites", "Profile", "Settings"]

function Dashboard() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    const avatarInputRef = useRef(null)

    const [websites, setWebsites] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [copiedId, setCopiedId] = useState(null)
    const [activeTab, setActiveTab] = useState("My Websites")

    // Profile edit states
    const [editingName, setEditingName] = useState(false)
    const [newName, setNewName] = useState(userData?.name || "")
    const [savingName, setSavingName] = useState(false)
    const [uploadingAvatar, setUploadingAvatar] = useState(false)

    const thisMonthCount = websites?.filter(w => {
        const d = new Date(w.createdAt)
        const now = new Date()
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length || 0

    useEffect(() => {
        const fetchWebsites = async () => {
            try {
                setLoading(true)
                const result = await axios.get(`${SERVER}/api/website/getall`, { withCredentials: true })
                setWebsites(result.data)
            } catch (error) {
                setError(error.response?.data?.message || "Something went wrong")
            } finally {
                setLoading(false)
            }
        }
        fetchWebsites()
    }, [])

    const handleDeploy = async (id, e) => {
        e.stopPropagation()
        try {
            const result = await axios.get(`${SERVER}/api/website/deploy/${id}`, { withCredentials: true })
            window.open(`${result.data.url}`, "_blank")
            setWebsites(prev => prev.map(w => w._id === id ? { ...w, deployed: true, deployUrl: result.data.url } : w))
        } catch (error) {
            console.log(error)
        }
    }

    const handleCopy = async (site, e) => {
        e.stopPropagation()
        await navigator.clipboard.writeText(site.deployUrl)
        setCopiedId(site._id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleSaveName = async () => {
        if (!newName.trim()) return
        setSavingName(true)
        try {
            await axios.patch(`${SERVER}/api/auth/update-profile`,
                { name: newName },
                { withCredentials: true }
            )
            dispatch(setUserData({ ...userData, name: newName }))
            setEditingName(false)
        } catch (err) {
            console.log(err)
        } finally {
            setSavingName(false)
        }
    }

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploadingAvatar(true)
        try {
            const formData = new FormData()
            formData.append('avatar', file)

            const res = await axios.post(`${SERVER}/api/auth/upload-avatar`,
                formData,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            )
            dispatch(setUserData({ ...userData, avatar: res.data.avatar }))
        } catch (err) {
            console.log(err)
        } finally {
            setUploadingAvatar(false)
        }
    }

    const ProfileAvatar = ({ size = "lg" }) => (
        <div className="relative inline-block">
            <img
                referrerPolicy="no-referrer"
                src={userData?.avatar || `https://ui-avatars.com/api/?name=${userData?.name}`}
                className={`rounded-full border-2 border-white/20 object-cover ${size === "lg" ? "w-20 h-20" : "w-14 h-14"}`}
            />
            <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute bottom-0 right-0 bg-indigo-500 hover:bg-indigo-600 rounded-full p-1.5 transition disabled:opacity-50"
            >
                {uploadingAvatar
                    ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    : <Camera size={12} />
                }
            </button>
            <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
            />
        </div>
    )

    return (
        <div className="min-h-screen bg-[#050505] text-white">

            {/* Header */}
            <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-white/10 transition">
                            <ArrowLeft size={16} />
                        </button>
                        <h1 className="text-lg font-semibold">Dashboard</h1>
                    </div>
                    <button
                        onClick={() => navigate("/generate")}
                        className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:scale-105 transition"
                    >
                        + New Website
                    </button>
                </div>
            </div>

            <div className="px-6 py-10 max-w-7xl mx-auto">

                {/* Welcome */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-4">
                    <ProfileAvatar size="sm" />
                    <div>
                        <p className="text-sm text-zinc-400">Welcome Back 👋</p>
                        <h1 className="text-2xl font-bold">{userData?.name}</h1>
                        <p className="text-xs text-zinc-500">{userData?.email}</p>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <StatCard icon={LayoutTemplate} label="Total Websites" value={websites?.length || 0} color="bg-indigo-500" />
                    <StatCard icon={Coins} label="Credits Left" value={userData?.credits || 0} color="bg-yellow-500" />
                    <StatCard icon={Globe} label="This Month" value={thisMonthCount} color="bg-purple-500" />
                    <StatCard icon={Calendar} label="Member Since" value={new Date(userData?.createdAt).toLocaleDateString('en', { month: 'short', year: 'numeric' })} color="bg-green-600" />
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b border-white/10 pb-4">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === tab
                                ? "bg-indigo-500 text-white"
                                : "text-zinc-400 hover:text-white hover:bg-white/10"}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* ── My Websites Tab ── */}
                {activeTab === "My Websites" && (
                    <>
                        {loading && <div className="mt-24 text-center text-zinc-400">Loading your websites...</div>}
                        {error && !loading && <div className="mt-24 text-center text-red-400">{error}</div>}
                        {websites?.length === 0 && (
                            <div className="mt-24 text-center">
                                <p className="text-zinc-400 mb-4">You have no websites yet.</p>
                                <button onClick={() => navigate("/generate")} className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-semibold transition">
                                    Create Your First Website
                                </button>
                            </div>
                        )}
                        {websites?.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {websites.map((w, i) => {
                                    const copied = copiedId === w._id
                                    return (
                                        <motion.div
                                            key={w._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            whileHover={{ y: -6 }}
                                            onClick={() => navigate(`/editor/${w._id}`)}
                                            className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 transition flex flex-col cursor-pointer"
                                        >
                                            <div className="relative h-40 bg-black">
                                                <iframe srcDoc={w.latestCode} className="absolute inset-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white" />
                                                <div className="absolute inset-0 bg-black/30" />
                                            </div>
                                            <div className="p-5 flex flex-col gap-4 flex-1">
                                                <h3 className="text-base font-semibold line-clamp-2">{w.title}</h3>
                                                <p className="text-xs text-zinc-400">Last Updated {new Date(w.updatedAt).toLocaleDateString()}</p>
                                                {!w.deployed ? (
                                                    <button onClick={(e) => handleDeploy(w._id, e)} className="mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-linear-to-r from-indigo-500 to-purple-500 hover:scale-105 transition">
                                                        <Rocket size={18} /> Deploy
                                                    </button>
                                                ) : (
                                                    <motion.button
                                                        onClick={(e) => handleCopy(w, e)}
                                                        whileTap={{ scale: 0.95 }}
                                                        className={`mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all 
                                                            ${copied ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/10 hover:bg-white/20 border border-white/10"}`}
                                                    >
                                                        {copied ? <><Check size={14} /> Link Copied</> : <><Share2 size={14} /> Share Link</>}
                                                    </motion.button>
                                                )}
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* ── Profile Tab ── */}
                {activeTab === "Profile" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

                            {/* Avatar Upload */}
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                                <ProfileAvatar size="lg" />
                                <div>
                                    <p className="font-semibold text-white">{userData?.name}</p>
                                    <p className="text-xs text-zinc-500 mt-0.5">{userData?.email}</p>
                                    <button
                                        onClick={() => avatarInputRef.current?.click()}
                                        className="text-xs text-indigo-400 hover:underline mt-1"
                                    >
                                        Change profile picture
                                    </button>
                                </div>
                            </div>

                            {/* Name Edit */}
                            <div className="mb-4">
                                <label className="text-xs text-zinc-400 mb-2 block">Display Name</label>
                                {editingName ? (
                                    <div className="flex gap-2">
                                        <input
                                            value={newName}
                                            onChange={e => setNewName(e.target.value)}
                                            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                                        />
                                        <button onClick={handleSaveName} disabled={savingName} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-sm transition disabled:opacity-50">
                                            {savingName ? "..." : <Save size={16} />}
                                        </button>
                                        <button onClick={() => { setEditingName(false); setNewName(userData?.name) }} className="px-3 py-2 bg-white/10 rounded-xl transition">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                                        <span className="text-sm">{userData?.name}</span>
                                        <button onClick={() => setEditingName(true)} className="text-zinc-400 hover:text-white transition">
                                            <Edit2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Email */}
                            <div className="mb-4">
                                <label className="text-xs text-zinc-400 mb-2 block">Email Address</label>
                                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-400">
                                    {userData?.email}
                                </div>
                            </div>

                            {/* Plan */}
                            <div className="mb-4">
                                <label className="text-xs text-zinc-400 mb-2 block">Current Plan</label>
                                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex items-center justify-between">
                                    <span className={`text-sm capitalize font-medium ${userData?.plan === 'pro' ? 'text-indigo-400' : userData?.plan === 'enterprise' ? 'text-purple-400' : 'text-zinc-300'}`}>
                                        {userData?.plan || "free"}
                                    </span>
                                    <button onClick={() => navigate("/pricing")} className="text-xs text-indigo-400 hover:underline">Upgrade →</button>
                                </div>
                            </div>

                            {/* Credits */}
                            <div>
                                <label className="text-xs text-zinc-400 mb-2 block">Credits Remaining</label>
                                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex items-center gap-2">
                                    <Coins size={14} className="text-yellow-400" />
                                    <span className="text-sm font-semibold text-yellow-400">{userData?.credits}</span>
                                    <button onClick={() => navigate("/pricing")} className="text-indigo-400 hover:underline text-xs ml-auto">Buy more →</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── Settings Tab ── */}
                {activeTab === "Settings" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="font-semibold mb-6">Account Settings</h3>

                            {/* Display Name */}
                            <div className="mb-6">
                                <label className="text-xs text-zinc-400 mb-2 block">Display Name</label>
                                {editingName ? (
                                    <div className="flex gap-2">
                                        <input
                                            value={newName}
                                            onChange={e => setNewName(e.target.value)}
                                            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500"
                                        />
                                        <button onClick={handleSaveName} disabled={savingName} className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-sm transition disabled:opacity-50">
                                            {savingName ? "..." : "Save"}
                                        </button>
                                        <button onClick={() => { setEditingName(false); setNewName(userData?.name) }} className="px-3 py-2 bg-white/10 rounded-xl transition">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                                        <span className="text-sm">{userData?.name}</span>
                                        <button onClick={() => setEditingName(true)} className="text-zinc-400 hover:text-white transition">
                                            <Edit2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Danger Zone */}
                            <div className="border border-red-500/20 rounded-xl p-4 bg-red-500/5">
                                <p className="text-sm font-medium text-red-400 mb-1">Danger Zone</p>
                                <p className="text-xs text-zinc-500 mb-3">These actions are irreversible. Please be careful.</p>
                                <button className="text-xs px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

            </div>
        </div>
    )
}

export default Dashboard