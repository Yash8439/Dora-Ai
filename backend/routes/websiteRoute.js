import express from 'express'
import { isAuthenticated } from '../middlewares/isAuthenticated.js'
import { changeWebsite, deployWebsite, deployToNetlify, explainWebsite, generateWebsite, getAllWebsite, getBySlug, getWebsiteById } from '../controllers/websiteController.js'

const router = express.Router()

router.post('/generate', isAuthenticated, generateWebsite)
router.post('/update/:id', isAuthenticated, changeWebsite)
router.get('/getbyid/:id', isAuthenticated, getWebsiteById)
router.get('/getall', isAuthenticated, getAllWebsite)
router.get('/deploy/:id', isAuthenticated, deployWebsite)
router.get('/getbyslug/:slug', isAuthenticated, getBySlug)
router.get('/explain/:id', isAuthenticated, explainWebsite)       // ✅ AI Guide
router.post('/deploy-netlify/:id', isAuthenticated, deployToNetlify) // ✅ Netlify Deploy

export default router
