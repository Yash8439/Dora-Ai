import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated.js'
import { isAdmin } from '../middlewares/isAdmin.js'
import {
    getDashboardStats,
    getAllUsers,
    updateUserCredits,
    toggleBanUser,
    deleteUser,
    getAllWebsites,
    deleteWebsite,
    getAllPayments
} from '../controllers/adminCtrl.js'

const router = express.Router()

// All admin routes require authentication + admin role
router.use(isAuthenticated, isAdmin)

// Dashboard
router.get('/stats', getDashboardStats)

// Users
router.get('/users', getAllUsers)
router.patch('/users/:id/credits', updateUserCredits)
router.patch('/users/:id/ban', toggleBanUser)
router.delete('/users/:id', deleteUser)

// Websites
router.get('/websites', getAllWebsites)
router.delete('/websites/:id', deleteWebsite)

// Payments
router.get('/payments', getAllPayments)

export default router