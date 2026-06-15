import express from 'express'
import 'dotenv/config'
import connectDB from './database/db.js'
import authRoute from './routes/authRoute.js'
import websiteRoute from './routes/websiteRoute.js'
import paymentRoute from './routes/paymentRoute.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import adminRoute from './routes/adminRouter.js'

const app = express()
const PORT = process.env.PORT || 3000

//middleware
app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [
  "http://localhost:5173",
  "https://doraai-1.onrender.com",
  "https://dora-ai-builder.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use('/api/auth', authRoute)
app.use('/api/website', websiteRoute)
app.use('/api/payment', paymentRoute)
app.use('/api/admin', adminRoute) // ✅ Admin route

app.listen(PORT, ()=>{
    connectDB()
    console.log(`Server is listening at port : ${PORT}`)
})