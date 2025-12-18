import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Envelope, Phone, MapPin, ArrowLeft } from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success("Message sent successfully!", {
      description: "We'll get back to you within 24 hours."
    })
    setFormData({ name: "", email: "", phone: "", message: "" })
  }

  const handleBackToHome = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#0f1423] to-[#1a1f3a] -z-10" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl" />
      </div>
      
      <button
        onClick={handleBackToHome}
        className="fixed top-6 left-6 z-50 flex items-center gap-2 text-white hover:text-blue-400 transition-colors group bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Home</span>
      </button>

      <div className="container mx-auto px-6 md:px-12 lg:px-16 py-24 md:py-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="glass backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
            <h2 className="font-semibold text-2xl mb-6 text-white">Send Message</h2>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Full Name</Label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Enter your name"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your.email@example.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="+91 XXXXXXXXXX"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-white">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20 resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                />
              </div>

              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 h-12 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300" type="submit">
                Send Message
              </Button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <MapPin size={24} weight="fill" className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-white">Visit Us</h3>
                  <p className="text-gray-300">
                    2B/H/17 Dr.M.N Chatterjee Sarani<br />
                    (Inside Churi Gali) Raja Bazar<br />
                    Kolkata - 700009
                  </p>
                </div>
              </div>
            </div>

            <div className="glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Phone size={24} weight="fill" className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-white">Call Us</h3>
                  <p className="text-gray-300">+91 9073040650</p>
                  <p className="text-gray-400 text-sm mt-1">Mon-Sat: 9AM - 6PM</p>
                </div>
              </div>
            </div>

            <div className="glass backdrop-blur-xl rounded-3xl p-6 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Envelope size={24} weight="fill" className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-white">Email Us</h3>
                  <p className="text-gray-300">info@nasrevolution.com</p>
                  <p className="text-gray-400 text-sm mt-1">We'll respond within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
