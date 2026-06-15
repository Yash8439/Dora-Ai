import { ArrowLeft, Check, Coins } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'


const plans = [
    {
        id: "free",
        name: "Free",
        price: '₹0',
        credits: 100,
        description: "Perfect to explore Dora ai",
        features: [
            "AI website generation",
            "Responsive html outputs",
            "Basic animations"
        ],
        popular: false,
        button: "Get Started"
    },
    {
        id: "pro",
        name: "Pro",
        price: '₹499',
        credits: 500,
        description: "For serious creators and freelancers",
        features: [
            "Everything in Free",
            "Faster Generations",
            "Edit and regenerate",
            "Download Source code"
        ],
        popular: true,
        button: "Upgrade to Pro"
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: '₹1499',
        credits: 1000,
        description: "For teams and power users",
        features: [
            "Unlimited Iterations",
            "Highest Priority",
            "Team Collaboration",
            "Dedicated Support"
        ],
        popular: false,
        button: "Contact Sales"
    },
]

const Pricing = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handlePayment = async (plan) => {
        if (plan.id === "free") {
            navigate("/dashboard")
            return
        }
        try {  
            const amount = plan.id === "enterprise" ? 1499 : 499
            const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/payment/order`, {
                planId: plan.id,
                amount: amount,
                credits: plan.credits
            }, { withCredentials: true })
           

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: result.data.amount,
                currency: 'INR',
                name: "Dora ai",
                description: `${plan.name} - ${plan.credits} Credits`,
                order_id: result.data.id,

                handler: async function (response) {
                    console.log(response)
                    const verify = await axios.post(
                        `${import.meta.env.VITE_SERVER_URL}/api/payment/verify`,
                        response,
                        { withCredentials: true }
                    )

                    console.log(verify.data)
                    dispatch(setUserData(verify.data.user))

                },
                theme: {
                    color: "#19173d"
                }
            }
            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (error) {
            console.log(error)
            
        }
    }
    return (
        <div className='relative min-h-screen overflow-hidden bg-[#050505] text-white px-6 pt-16 pb-24'>
            <div className='absolute inset-0 pointer-events-none'>
                <div className='absolute -top-40 -left-40 w-125 h-125 bg-indigo-600/20 rounded-full blur-[120px]' />
                <div className='absolute bottom-0 right-0 w-125 h-125 bg-indigo-600/20 rounded-full blur-[120px]' />
            </div>
            <button onClick={() => navigate("/")} className='relative z-10 mb-8 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition'>
                <ArrowLeft size={16} />
                Back
            </button>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className='relative z-10 max-w-4xl mx-auto text-center mb-14'
            >
                <h1 className='text-4xl md:text-5xl font-bold mb-4'>Simple, transparent pricing</h1>
                <p className='text-zinc-400 text-lg'>Buy credit once. Build anytime.</p>
            </motion.div>

            <div className='relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
                {plans.map((p, i) => (
                   <motion.div
    key={i}
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.12 }}
    whileHover={{ y: -14, scale: 1.03 }}
   style={p.popular ? { 
  boxShadow: '0 0 60px rgba(99,102,241,0.6), 0 0 120px rgba(99,102,241,0.3), 0 0 200px rgba(99,102,241,0.15)' 
} : {}}
    className={`relative rounded-3xl p-8 border backdrop-blur-xl transition-all 
        ${p.popular ? "border-indigo-500 bg-gradient-to-b from-indigo-500/20 to-transparent" :
            "border-white/10 bg-white/5 hover:border-indigo-400 hover:bg-white/10"}`}
>
                        {p.popular && <span className='absolute top-5 right-5 px-3 py-1 text-xs rounded-full bg-indigo-500'>Most Popular</span>}
                        <h1 className='text-xl font-semibold mb-2'>{p.name}</h1>
                        <p className='text-zinc-400 text-sm mb-6'>{p.description}</p>
                        <div className='flex items-end gap-1 mb-4'>
                            <span className='text-4xl font-bold'>{p.price}</span>
                            <span className='text-sm text-zinc-400 mb-1'>/one-time</span>
                        </div>
                        <div className='flex items-center gap-2 mb-8'>
                            <Coins size={18} className='text-yellow-400' />
                            <span className='font-semibold'>{p.credits} Credits</span>
                        </div>
                        <ul className='space-y-3 mb-10'>
                            {p.features.map((f) => (
                                <li key={f} className='flex items-center gap-2 text-sm text-zinc-300'>
                                    <Check size={16} className='text-green-400' />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <motion.button
                            onClick={() => handlePayment(p)}
                            whileTap={{ scale: 0.96 }}
                            className={`w-full py-3 rounded-xl font-semibold transition ${p.popular ? "bg-indigo-500 hover:bg-indigo-600" :
                                "bg-white/10 hover:bg-white/20"} disabled:opacity-60`}
                        >
                            {p.button}
                        </motion.button>
                    </motion.div>
                ))}
            </div>
            {/* Trust Badges */}
            <div className="relative z-10 flex flex-wrap justify-center gap-4 mt-12 max-w-3xl mx-auto">
                {[
                    { icon: "🔒", text: "Secure Payment via Razorpay" },
                    { icon: "⚡", text: "Instant Credit Delivery" },
                    { icon: "💯", text: "No Subscription · Pay Once" },
                    { icon: "🔄", text: "Credits Never Expire" },
                ].map((badge, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 text-sm text-zinc-400"
                        style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <span>{badge.icon}</span>
                        <span>{badge.text}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default Pricing
