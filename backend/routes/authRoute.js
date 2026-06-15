import express from 'express'
import { googleAuth, logoutUser } from '../controllers/authController.js'
import { isAuthenticated } from '../middlewares/isAuthenticated.js'
import { User } from '../models/userModel.js'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

// Configure cloudinary directly here
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

router.post('/google', googleAuth)
router.get('/logout', logoutUser)

router.get('/me', isAuthenticated, (req, res) => {
    return res.status(200).json(req.user)
})

// Update display name
router.patch('/update-profile', isAuthenticated, async (req, res) => {
    try {
        const { name } = req.body
        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Name is required" })
        }
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name: name.trim() },
            { new: true }
        )
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

// Upload profile picture
router.post('/upload-avatar', isAuthenticated, upload.single('avatar'), async (req, res) => {
    try {
        console.log("File received:", req.file?.originalname)
        console.log("Cloudinary cloud:", process.env.CLOUDINARY_CLOUD_NAME)

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }

        // Convert buffer to base64
        const base64 = req.file.buffer.toString('base64')
        const dataUri = `data:${req.file.mimetype};base64,${base64}`

        // Upload to Cloudinary using base64
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: 'dora-ai/avatars',
            transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }]
        })

        console.log("Cloudinary upload success:", result.secure_url)

        // Update user avatar in DB
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { avatar: result.secure_url },
            { new: true }
        )

        return res.status(200).json({ avatar: result.secure_url, user })

    } catch (error) {
        console.log("Upload error:", error.message)
        return res.status(500).json({ message: error.message })
    }
})

export default router