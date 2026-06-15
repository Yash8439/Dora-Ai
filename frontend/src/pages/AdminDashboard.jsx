import { useEffect, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Users, Globe, CreditCard, TrendingUp, Trash2, Ban, CheckCircle, Edit2, X, Check, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const SERVER = import.meta.env.VITE_SERVER_URL

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4"
    >
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-zinc-400 text-xs mb-1">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {sub && <p className="text-xs text-zinc-500 mt-0.5">{sub}</p>}
        </div>
    </motion.div>
)

const TABS = ["Overview", "Users", "Websites", "Payments"]

export default function AdminDashboard() {
    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)

    const [activeTab, setActiveTab] = useState("Overview")
    const [stats, setStats] = useState(null)
    const [users, setUsers] = useState([])
    const [websites, setWebsites] = useState([])
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(false)
    const [editCredits, setEditCredits] = useState({}) // { userId: newCredits }

    // Redirect if not admin
    useEffect(() => {
    if (userData === null) return // Loading hai abhi
    if (userData.role !== "admin") {
        navigate("/")
    }
}, [userData])

    // Fetch stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${SERVER}/api/admin/stats`, { withCredentials: true })
                setStats(res.data)
            } catch (err) { console.log(err) }
        }
        fetchStats()
    }, [])

    // Fetch based on tab
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                if (activeTab === "Users") {
                    const res = await axios.get(`${SERVER}/api/admin/users`, { withCredentials: true })
                    setUsers(res.data)
                } else if (activeTab === "Websites") {
                    const res = await axios.get(`${SERVER}/api/admin/websites`, { withCredentials: true })
                    setWebsites(res.data)
                } else if (activeTab === "Payments") {
                    const res = await axios.get(`${SERVER}/api/admin/payments`, { withCredentials: true })
                    setPayments(res.data)
                }
            } catch (err) { console.log(err) }
            finally { setLoading(false) }
        }
        fetchData()
    }, [activeTab])

    const handleUpdateCredits = async (userId) => {
        try {
            await axios.patch(`${SERVER}/api/admin/users/${userId}/credits`,
                { credits: Number(editCredits[userId]) },
                { withCredentials: true }
            )
            setUsers(u => u.map(user => user._id === userId ? { ...user, credits: Number(editCredits[userId]) } : user))
            setEditCredits(prev => { const c = { ...prev }; delete c[userId]; return c })
        } catch (err) { console.log(err) }
    }

    const handleBanUser = async (userId) => {
        try {
            const res = await axios.patch(`${SERVER}/api/admin/users/${userId}/ban`, {}, { withCredentials: true })
            setUsers(u => u.map(user => user._id === userId ? { ...user, role: res.data.user.role } : user))
        } catch (err) { console.log(err) }
    }

    const handleDeleteUser = async (userId) => {
        if (!confirm("Are you sure you want to delete this user?")) return
        try {
            await axios.delete(`${SERVER}/api/admin/users/${userId}`, { withCredentials: true })
            setUsers(u => u.filter(user => user._id !== userId))
        } catch (err) { console.log(err) }
    }

    const handleDeleteWebsite = async (websiteId) => {
        if (!confirm("Are you sure you want to delete this website?")) return
        try {
            await axios.delete(`${SERVER}/api/admin/websites/${websiteId}`, { withCredentials: true })
            setWebsites(w => w.filter(site => site._id !== websiteId))
        } catch (err) { console.log(err) }
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white">

            {/* Header */}
            <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/60 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-white/10 transition">
                            <ArrowLeft size={16} />
                        </button>
                        <h1 className="text-lg font-bold">Admin Dashboard</h1>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                            {userData?.name}
                        </span>
                    </div>
                    {/* Tabs */}
                    <div className="flex gap-1">
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
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* ── Overview Tab ── */}
                {activeTab === "Overview" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Overview</h2>
                        {stats ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                                <StatCard icon={Users} label="Total Users" value={stats.totalUsers} sub={`+${stats.newUsers} this week`} color="bg-indigo-500" />
                                <StatCard icon={Globe} label="Total Websites" value={stats.totalWebsites} sub={`+${stats.newWebsites} this week`} color="bg-purple-500" />
                                <StatCard icon={CreditCard} label="Total Payments" value={stats.totalPayments} color="bg-green-600" />
                                <StatCard icon={TrendingUp} label="Total Revenue" value={`₹${stats.totalRevenue}`} color="bg-orange-500" />
                            </div>
                        ) : (
                            <p className="text-zinc-500">Loading stats...</p>
                        )}
                    </div>
                )}

                {/* ── Users Tab ── */}
                {activeTab === "Users" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Users ({users.length})</h2>
                        {loading ? <p className="text-zinc-500">Loading...</p> : (
                            <div className="rounded-2xl border border-white/10 overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-white/5 text-zinc-400 text-xs uppercase">
                                        <tr>
                                            <th className="px-4 py-3 text-left">User</th>
                                            <th className="px-4 py-3 text-left">Plan</th>
                                            <th className="px-4 py-3 text-left">Credits</th>
                                            <th className="px-4 py-3 text-left">Role</th>
                                            <th className="px-4 py-3 text-left">Joined</th>
                                            <th className="px-4 py-3 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user, i) => (
                                            <motion.tr
                                                key={user._id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.03 }}
                                                className="border-t border-white/5 hover:bg-white/5 transition"
                                            >
                                                {/* User Info */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <img src={user.avatar} className="w-8 h-8 rounded-full" alt="" />
                                                        <div>
                                                            <p className="font-medium text-white">{user.name}</p>
                                                            <p className="text-zinc-500 text-xs">{user.email}</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Plan */}
                                                <td className="px-4 py-3">
                                                    <span className={`text-xs px-2 py-1 rounded-full border ${user.plan === "pro"
                                                        ? "bg-indigo-500/20 border-indigo-500/30 text-indigo-300"
                                                        : user.plan === "enterprise"
                                                            ? "bg-purple-500/20 border-purple-500/30 text-purple-300"
                                                            : "bg-white/5 border-white/10 text-zinc-400"
                                                        }`}>
                                                        {user.plan}
                                                    </span>
                                                </td>

                                                {/* Credits Edit */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        {editCredits[user._id] !== undefined ? (
                                                            <>
                                                                <input
                                                                    type="number"
                                                                    value={editCredits[user._id]}
                                                                    onChange={e => setEditCredits(prev => ({ ...prev, [user._id]: e.target.value }))}
                                                                    className="w-20 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-sm outline-none"
                                                                />
                                                                <button onClick={() => handleUpdateCredits(user._id)} className="text-green-400 hover:text-green-300">
                                                                    <Check size={14} />
                                                                </button>
                                                                <button onClick={() => setEditCredits(prev => { const c = { ...prev }; delete c[user._id]; return c })} className="text-zinc-500 hover:text-white">
                                                                    <X size={14} />
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="text-yellow-400 font-medium">{user.credits}</span>
                                                                <button onClick={() => setEditCredits(prev => ({ ...prev, [user._id]: user.credits }))} className="text-zinc-500 hover:text-white">
                                                                    <Edit2 size={12} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Role */}
                                                <td className="px-4 py-3">
                                                    <span className={`text-xs px-2 py-1 rounded-full border ${user.role === "admin"
                                                        ? "bg-orange-500/20 border-orange-500/30 text-orange-300"
                                                        : user.role === "banned"
                                                            ? "bg-red-500/20 border-red-500/30 text-red-300"
                                                            : "bg-white/5 border-white/10 text-zinc-400"
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>

                                                {/* Joined */}
                                                <td className="px-4 py-3 text-zinc-500 text-xs">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        {user.role !== "admin" && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleBanUser(user._id)}
                                                                    title={user.role === "banned" ? "Unban" : "Ban"}
                                                                    className={`p-1.5 rounded-lg transition ${user.role === "banned"
                                                                        ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                                                        : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"}`}
                                                                >
                                                                    {user.role === "banned" ? <CheckCircle size={14} /> : <Ban size={14} />}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteUser(user._id)}
                                                                    className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Websites Tab ── */}
                {activeTab === "Websites" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Websites ({websites.length})</h2>
                        {loading ? <p className="text-zinc-500">Loading...</p> : (
                            <div className="rounded-2xl border border-white/10 overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-white/5 text-zinc-400 text-xs uppercase">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Title</th>
                                            <th className="px-4 py-3 text-left">Owner</th>
                                            <th className="px-4 py-3 text-left">Deployed</th>
                                            <th className="px-4 py-3 text-left">Created</th>
                                            <th className="px-4 py-3 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {websites.map((site, i) => (
                                            <motion.tr
                                                key={site._id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.03 }}
                                                className="border-t border-white/5 hover:bg-white/5 transition"
                                            >
                                                <td className="px-4 py-3 font-medium text-white max-w-xs truncate">{site.title}</td>
                                                <td className="px-4 py-3">
                                                    {site.user ? (
                                                        <div className="flex items-center gap-2">
                                                            <img src={site.user.avatar} className="w-6 h-6 rounded-full" alt="" />
                                                            <span className="text-zinc-400 text-xs">{site.user.name}</span>
                                                        </div>
                                                    ) : <span className="text-zinc-600">—</span>}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {site.deployed ? (
                                                        <a href={site.netlifyUrl || site.deployUrl} target="_blank" rel="noreferrer"
                                                            className="text-xs text-teal-400 hover:underline">
                                                            Live ↗
                                                        </a>
                                                    ) : <span className="text-zinc-600 text-xs">Not deployed</span>}
                                                </td>
                                                <td className="px-4 py-3 text-zinc-500 text-xs">
                                                    {new Date(site.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => handleDeleteWebsite(site._id)}
                                                        className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Payments Tab ── */}
                {activeTab === "Payments" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Payments ({payments.length})</h2>
                        {loading ? <p className="text-zinc-500">Loading...</p> : (
                            <div className="rounded-2xl border border-white/10 overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-white/5 text-zinc-400 text-xs uppercase">
                                        <tr>
                                            <th className="px-4 py-3 text-left">User</th>
                                            <th className="px-4 py-3 text-left">Plan</th>
                                            <th className="px-4 py-3 text-left">Amount</th>
                                            <th className="px-4 py-3 text-left">Credits</th>
                                            <th className="px-4 py-3 text-left">Status</th>
                                            <th className="px-4 py-3 text-left">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map((payment, i) => (
                                            <motion.tr
                                                key={payment._id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.03 }}
                                                className="border-t border-white/5 hover:bg-white/5 transition"
                                            >
                                                <td className="px-4 py-3">
                                                    {payment.userId ? (
                                                        <div className="flex items-center gap-2">
                                                            <img src={payment.userId.avatar} className="w-6 h-6 rounded-full" alt="" />
                                                            <span className="text-zinc-400 text-xs">{payment.userId.name}</span>
                                                        </div>
                                                    ) : <span className="text-zinc-600">—</span>}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                                                        {payment.planId}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-green-400 font-medium">₹{payment.amount}</td>
                                                <td className="px-4 py-3 text-yellow-400">{payment.credits}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-xs px-2 py-1 rounded-full border ${payment.status === "paid"
                                                        ? "bg-green-500/20 border-green-500/30 text-green-300"
                                                        : payment.status === "failed"
                                                            ? "bg-red-500/20 border-red-500/30 text-red-300"
                                                            : "bg-yellow-500/20 border-yellow-500/30 text-yellow-300"
                                                        }`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-zinc-500 text-xs">
                                                    {new Date(payment.createdAt).toLocaleDateString()}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}