import { User } from "../models/userModel.js"
import { Website } from "../models/websiteModel.js"
import { Payment } from "../models/paymentModel.js"

// ─── Dashboard Stats ───────────────────────────────────────────────
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments()
        const totalWebsites = await Website.countDocuments()
        const totalPayments = await Payment.countDocuments({ status: "paid" })
        const totalRevenue = await Payment.aggregate([
            { $match: { status: "paid" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])

        // Last 7 days new users
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        const newUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } })
        const newWebsites = await Website.countDocuments({ createdAt: { $gte: sevenDaysAgo } })

        return res.status(200).json({
            totalUsers,
            totalWebsites,
            totalPayments,
            totalRevenue: totalRevenue[0]?.total || 0,
            newUsers,
            newWebsites
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// ─── Get All Users ─────────────────────────────────────────────────
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-__v').sort({ createdAt: -1 })
        return res.status(200).json(users)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// ─── Update User Credits ───────────────────────────────────────────
export const updateUserCredits = async (req, res) => {
    try {
        const { credits } = req.body
        if (credits === undefined || credits < 0) {
            return res.status(400).json({ message: "Invalid credits value" })
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { credits },
            { new: true }
        )
        if (!user) return res.status(404).json({ message: "User not found" })
        return res.status(200).json({ message: "Credits updated", user })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// ─── Ban / Unban User ──────────────────────────────────────────────
export const toggleBanUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ message: "User not found" })
        if (user.role === "admin") {
            return res.status(400).json({ message: "Cannot ban an admin" })
        }

        user.role = user.role === "banned" ? "user" : "banned"
        await user.save()

        return res.status(200).json({
            message: user.role === "banned" ? "User banned" : "User unbanned",
            user
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// ─── Delete User ───────────────────────────────────────────────────
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).json({ message: "User not found" })
        if (user.role === "admin") {
            return res.status(400).json({ message: "Cannot delete an admin" })
        }
        await User.findByIdAndDelete(req.params.id)
        await Website.deleteMany({ user: req.params.id })
        return res.status(200).json({ message: "User deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// ─── Get All Websites ──────────────────────────────────────────────
export const getAllWebsites = async (req, res) => {
    try {
        const websites = await Website.find()
            .populate('user', 'name email avatar')
            .select('-latestCode -conversation')
            .sort({ createdAt: -1 })
        return res.status(200).json(websites)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// ─── Delete Website ────────────────────────────────────────────────
export const deleteWebsite = async (req, res) => {
    try {
        const website = await Website.findByIdAndDelete(req.params.id)
        if (!website) return res.status(404).json({ message: "Website not found" })
        return res.status(200).json({ message: "Website deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// ─── Get All Payments ──────────────────────────────────────────────
export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('userId', 'name email avatar')
            .sort({ createdAt: -1 })
        return res.status(200).json(payments)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}