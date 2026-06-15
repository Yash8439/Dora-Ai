# 🤖 Dora AI — Build Websites with Real AI Power

<div align="center">

![Dora AI Banner](./frontend/public/ai2.png)

**AI-Powered Website Builder | Generate Production-Ready Websites in Minutes**

[![Live Demo](https://img.shields.io/badge/Live-Demo-6366f1?style=for-the-badge)](https://dora-ai.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-Yash8439-black?style=for-the-badge&logo=github)](https://github.com/Yash8439)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Yash%20Rastogi-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/yash-rastogi-80a84b28b/)

</div>

---

## 🚀 About Dora AI

Dora AI is a full-stack AI-powered website builder that generates production-ready HTML, CSS & JavaScript websites from simple text prompts. Just describe your vision — Dora AI handles the rest.

> "Describe your vision. AI generates production-ready HTML, CSS & JS in minutes. No coding required."

---

## ✨ Features

### 🧠 AI Generation
- **Natural Language Prompts** — Describe your website in plain English
- **Quick Start Templates** — Portfolio, SaaS, Restaurant, E-Commerce, Agency, Developer
- **Voice Input** — Describe your website hands-free using microphone
- **Real-time Terminal Loader** — Watch AI build your website step by step

### 🎨 Editor
- **Live Preview** — See your website update in real time
- **Monaco Code Editor** — Full VS Code-like editing experience
- **AI Chat Editor** — Chat to make changes: "Make the hero darker"
- **Copy Code** — One-click copy entire HTML
- **Mobile/Desktop Preview Toggle** — Test responsiveness instantly

### 🚀 Deployment
- **Deploy to Netlify** — One-click deployment with instant live URL
- **Export ZIP** — Download clean HTML, CSS & JS files separately
- **AI Guide** — Section-wise walkthrough with typewriter explanation

### 💳 Payments & Auth
- **Firebase Authentication** — Google & GitHub OAuth login
- **Razorpay Integration** — Secure one-time credit purchases
- **Credit System** — Free (100), Pro (500), Enterprise (1000) credits

### 🏠 Landing Page
- **3D Animated Orb** — Custom CSS 3D animation
- **Matrix Background** — Intensifies during generation
- **Scroll Progress Bar** — Purple gradient indicator
- **Testimonials** — User reviews with star ratings
- **Community Stats** — Live count-up animations
- **Tips Carousel** — Auto-rotating pro tips
- **FAQ Section** — Accordion style

---

## 🛠️ Tech Stack

### Frontend
| Technology | Usage |
|-----------|-------|
| React + Vite | Frontend Framework |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Monaco Editor | Code Editor |
| Firebase Auth | Authentication |
| Redux Toolkit | State Management |
| Axios | API Calls |
| React Router | Navigation |

### Backend
| Technology | Usage |
|-----------|-------|
| Node.js + Express | Server |
| MongoDB + Mongoose | Database |
| OpenRouter API | AI Generation |
| Firebase Admin | Auth Verification |
| Razorpay | Payment Gateway |
| Cloudinary | Media Storage |
| JSZip | ZIP Export |
| Netlify API | One-click Deploy |

---

## 📁 Project Structure

```
DoraAi/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Generate.jsx      # AI generation page
│   │   │   ├── Editor.jsx        # Website editor
│   │   │   ├── Dashboard.jsx     # User dashboard
│   │   │   └── Pricing.jsx       # Pricing page
│   │   ├── redux/
│   │   └── firebase.js
│   └── public/
└── backend/
    ├── routes/
    │   ├── authRoute.js
    │   ├── websiteRoute.js
    │   └── paymentRoute.js
    ├── models/
    │   ├── userModel.js
    │   └── websiteModel.js
    └── server.js
```

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_SERVER_URL=your_backend_url
VITE_RAZORPAY_KEY_ID=your_razorpay_key
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### Backend (`backend/.env`)
```env
MONGODB_URI=your_mongodb_uri
OPENROUTER_API_KEY=your_openrouter_key
FIREBASE_PROJECT_ID=your_firebase_project_id
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NETLIFY_ACCESS_TOKEN=your_netlify_token
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
JWT_SECRET=your_jwt_secret
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Firebase project
- Razorpay account

### Installation

```bash
# Clone the repo
git clone https://github.com/Yash8439/Dora-Ai.git
cd Dora-Ai

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Running Locally

```bash
# Start backend (from backend folder)
npm start

# Start frontend (from frontend folder)
npm run dev
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:3000`

---

## 💰 Pricing Plans

| Plan | Price | Credits | Features |
|------|-------|---------|----------|
| Free | ₹0 | 100 | AI Generation, Responsive HTML, Basic Animations |
| Pro | ₹499 | 500 | Everything in Free + Faster Gen, Edit & Regenerate, Download Source |
| Enterprise | ₹1499 | 1000 | Unlimited Iterations, Highest Priority, Team Collaboration |

---

## 📸 Screenshots

> Landing Page, Generate Page, Editor Page screenshots coming soon

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

MIT License © 2026 [Yash Rastogi](https://github.com/Yash8439)

---

<div align="center">

**Built with ❤️ by [Yash Rastogi](https://www.linkedin.com/in/yash-rastogi-80a84b28b/)**

⭐ Star this repo if you found it helpful!

</div>
