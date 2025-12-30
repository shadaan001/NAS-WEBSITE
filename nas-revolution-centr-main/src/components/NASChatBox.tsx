import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, PaperPlaneRight, Cube, Headphones, Play, Pause, Heart } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { marked } from "marked"
import { GoogleGenerativeAI } from "@google/generative-ai"
import "./NASChatMarkdown.css"
import { supabase, VITE_GOOGLE_API_KEY } from "@/lib/supabase"

// Initialize Gemini API (Free tier)
const genAI = new GoogleGenerativeAI(VITE_GOOGLE_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

interface NASChatBoxProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

const FloatingParticle = ({ delay }: { delay: number }) => {
  const randomX = Math.random() * 100
  const randomY = Math.random() * 100
  const randomDuration = 20 + Math.random() * 15

  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full"
      style={{
        left: `${randomX}%`,
        top: `${randomY}%`,
        background: "radial-gradient(circle, #00E4FF, transparent)",
        boxShadow: "0 0 6px 1px rgba(0, 228, 255, 0.4)",
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, -15, 0],
        opacity: [0.2, 0.6, 0.2],
      }}
      transition={{
        duration: randomDuration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

export default function NASChatBox({ isOpen, onClose }: NASChatBoxProps) {
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Audio explanation feature states
  const [showAudioModal, setShowAudioModal] = useState(false)
  const [audioTopic, setAudioTopic] = useState("")
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioExplanationText, setAudioExplanationText] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const [emotionalSupportMode, setEmotionalSupportMode] = useState(false)
  const [emotionalSupportStep, setEmotionalSupportStep] = useState<"initial" | "listening" | "motivating">("initial")
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    })
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen])

  const renderMarkdown = (content: string) => {
    if (!content || typeof content !== 'string') {
      return ''
    }
    try {
      const html = marked(content) as string
      return html
    } catch (error) {
      console.error('Markdown rendering error:', error)
      return content
    }
  }

  const detectEmotionalKeywords = (text: string): boolean => {
    const emotionalPatterns = [
      /\b(motivate|motivation|low|depressed|sad|pressure|stressed|tension|worried|upset|help me|feel bad|not good)\b/i,
      /\b(man nahi lag raha|padhai nhi ho rahi|pareshaan|dukhi|udaas|dar lag raha|ghabrahat)\b/i,
      /\b(can't study|unable to focus|losing hope|feel like giving up|demotivated)\b/i,
    ]
    
    return emotionalPatterns.some(pattern => pattern.test(text))
  }

  const handleAskNAS = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question")
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: question,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentQuestion = question
    setQuestion("")

    if (emotionalSupportMode && emotionalSupportStep === "listening") {
      await handleMotivationMode(currentQuestion)
      return
    }

    if (detectEmotionalKeywords(currentQuestion)) {
      await handleMotivationMode(currentQuestion)
      return
    }

    setIsLoading(true)

    try {
      const systemPrompt = "You are NAS Tutor — a friendly, step-by-step education assistant. Answer in simple English/Hinglish. Give short direct answer first, then 3–5 steps explanation. Keep answers exam-oriented and helpful for students."
      const fullPrompt = `${systemPrompt}\n\nStudent Question: ${currentQuestion}`

      const result = await model.generateContent(fullPrompt)
      const response = result.response.text()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error calling NAS API:", error)
      toast.error("Failed to get answer. Please try again.")
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Sorry, I couldn't process your question right now. Please try again later.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleAskNAS()
    }
  }

  // Detect if input is Hinglish/Roman Hindi
  const detectHinglish = (text: string): boolean => {
    const hinglishPatterns = [
      /\b(hai|hain|ho|nahi|nahin|kya|kaise|kyun|kyunki|aur|ya|toh|to|ke|ki|ka|mein|me|main|mai|se|pe|par|ko|ka|ki|kya|matlab|yaar|bhai|dost|achha|accha|thik|theek|bahut|bohot|kuch|koi|sab|sabhi|kab|kahaan|kahan|yahan|wahan|aisa|waisa|jaisa|kaisa)\b/i,
      /\b(hota|hoti|hote|tha|thi|the|hua|hui|hue|gaya|gayi|gaye|kar|karo|karna|karte|karega|karenge|ho|hoon|hun|hoga|hogi|honge)\b/i,
      /\b(abhi|ab|phir|fir|aaj|kal|jab|tab|jaise|waise|isliye|kyunki|lekin|par|magar|aur|ya|kya|kaise|kab|kahaan|kyun)\b/i,
    ]
    
    return hinglishPatterns.some(pattern => pattern.test(text))
  }

  // Handle audio generation for topic explanation
  const handleExplainTopic = async () => {
    if (!audioTopic.trim()) {
      toast.error("Please enter a topic to explain")
      return
    }

    setIsGeneratingAudio(true)
    setAudioUrl(null)
    setIsPlaying(false)
    setAudioExplanationText("")

    try {
      const isHinglish = detectHinglish(audioTopic)
      
      const explanationPromptText = isHinglish
        ? `You are an expert educator. Create a clear, engaging 2-minute spoken explanation in Roman Hindi/Hinglish (mix of Hindi and English written in English script) about: ${audioTopic}. 
        
Make it conversational, friendly and easy to understand for Indian students. Use common Hinglish words and phrases that students naturally use. Structure it as:
1. Brief introduction (10 seconds)
2. Main explanation with key points (90 seconds)
3. Quick summary (20 seconds)

Keep sentences short and natural for speech. Mix Hindi and English naturally like students speak daily. Use words like "hai", "hota hai", "matlab", "toh", "aur", etc.`
        : `You are an expert educator. Create a clear, engaging 2-minute spoken explanation in simple English about: ${audioTopic}. 
        
Make it conversational and easy to understand for students. Structure it as:
1. Brief introduction (10 seconds)
2. Main explanation with key points (90 seconds)
3. Quick summary (20 seconds)

Keep sentences short and natural for speech. Use simple language that students can easily understand.`

      const result = await model.generateContent(explanationPromptText)
      const explanationText = result.response.text()
      
      setAudioExplanationText(explanationText)

      const audioContent = isHinglish 
        ? `Namaste! Aaj main aapko ${audioTopic} ke baare mein bataunga.

${explanationText}

Toh yeh tha ${audioTopic} ka explanation. Umeed hai aapko samajh aa gaya!`
        : `Hello! Let me explain ${audioTopic} to you.

${explanationText}

That's the explanation of ${audioTopic}. I hope this helps you understand better!`

      const utterance = new SpeechSynthesisUtterance(audioContent)
      
      const voices = window.speechSynthesis.getVoices()
      
      if (isHinglish) {
        const hindiVoice = voices.find(voice => 
          voice.lang.includes('hi') || 
          voice.lang.includes('HI') ||
          voice.name.toLowerCase().includes('hindi')
        )
        if (hindiVoice) {
          utterance.voice = hindiVoice
          utterance.lang = 'hi-IN'
        }
      } else {
        const englishVoice = voices.find(voice => 
          voice.lang.includes('en-US') || 
          voice.lang.includes('en-GB')
        )
        if (englishVoice) {
          utterance.voice = englishVoice
          utterance.lang = 'en-US'
        }
      }
      
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 1.0
      
      toast.success("Audio explanation generated!")
      
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)
      setIsPlaying(true)

      utterance.onend = () => {
        setIsPlaying(false)
      }

      utterance.onerror = () => {
        setIsPlaying(false)
        toast.error("Failed to play audio")
      }

      audioRef.current = { utterance } as any

    } catch (error) {
      console.error("Error generating audio explanation:", error)
      toast.error("Failed to generate audio explanation. Please try again.")
    } finally {
      setIsGeneratingAudio(false)
    }
  }

  const toggleAudioPlayback = () => {
    if (isPlaying) {
      window.speechSynthesis.pause()
      setIsPlaying(false)
    } else {
      window.speechSynthesis.resume()
      setIsPlaying(true)
    }
  }

  const stopAudio = () => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
  }

  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices()
    }
    
    loadVoices()
    
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
    
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  const speakText = (text: string, lang: "hi" | "en" = "hi") => {
    window.speechSynthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    const voices = window.speechSynthesis.getVoices()
    
    if (lang === "hi") {
      const hindiVoice = voices.find(voice => 
        voice.lang.includes('hi') || 
        voice.lang.includes('HI') ||
        voice.name.toLowerCase().includes('hindi')
      )
      if (hindiVoice) {
        utterance.voice = hindiVoice
        utterance.lang = 'hi-IN'
      }
    } else {
      const englishVoice = voices.find(voice => 
        voice.lang.includes('en-US') || 
        voice.lang.includes('en-GB')
      )
      if (englishVoice) {
        utterance.voice = englishVoice
        utterance.lang = 'en-US'
      }
    }
    
    utterance.rate = 0.85
    utterance.pitch = 1.0
    utterance.volume = 1.0
    
    setIsSpeaking(true)
    
    utterance.onend = () => {
      setIsSpeaking(false)
    }
    
    utterance.onerror = () => {
      setIsSpeaking(false)
    }
    
    window.speechSynthesis.speak(utterance)
  }

  const handleFeelLowClick = async () => {
    setEmotionalSupportMode(true)
    setEmotionalSupportStep("initial")
    
    const initialMessage = "Kya hua aapko? Aap pareshaan lag rahe ho. Agar aap chahein toh bata sakte ho, main yahin hoon."
    
    const assistantMessage: Message = {
      id: Date.now().toString(),
      type: "assistant",
      content: initialMessage,
      timestamp: new Date(),
    }
    
    setMessages((prev) => [...prev, assistantMessage])
    
    speakText(initialMessage, "hi")
    
    setEmotionalSupportStep("listening")
  }

  const speakTextWithPauses = async (text: string, lang: "hi" | "en" = "hi") => {
    return new Promise<void>((resolve) => {
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      const voices = window.speechSynthesis.getVoices()
      
      if (lang === "hi") {
        const hindiVoice = voices.find(voice => 
          voice.lang.includes('hi') || 
          voice.lang.includes('HI') ||
          voice.name.toLowerCase().includes('hindi')
        )
        if (hindiVoice) {
          utterance.voice = hindiVoice
          utterance.lang = 'hi-IN'
        }
      } else {
        const englishVoice = voices.find(voice => 
          voice.lang.includes('en-US') || 
          voice.lang.includes('en-GB')
        )
        if (englishVoice) {
          utterance.voice = englishVoice
          utterance.lang = 'en-US'
        }
      }
      
      utterance.rate = 0.85
      utterance.pitch = 1.0
      utterance.volume = 1.0
      
      setIsSpeaking(true)
      
      utterance.onend = () => {
        setIsSpeaking(false)
        resolve()
      }
      
      utterance.onerror = () => {
        setIsSpeaking(false)
        resolve()
      }
      
      window.speechSynthesis.speak(utterance)
    })
  }

  const handleMotivationMode = async (userConcern: string) => {
    setEmotionalSupportStep("motivating")
    setIsLoading(true)
    
    try {
      const promptText = `You are a caring, supportive mentor like a well-wisher. A student has shared their concern: "${userConcern}". 

Create a motivational response following this EXACT structure:

1. First line: ONE powerful English motivational quote (just the quote in quotes, no attribution)

2. Next 3-4 sentences: Explain that quote in simple, emotional Hindi that directly connects to their concern. Use respectful language (aap/aapko, NEVER tu). Make it warm and relatable.

3. Next line: ONE short but powerful Hindi or Hinglish motivational line (something memorable and uplifting)

4. Final 2-3 sentences: Personal, friendly reassurance in Hindi using respectful language (aap). Show empathy and support like a caring friend or mentor.

Make it genuinely supportive, warm, and empathetic. The tone should be calm, friendly, and like a well-wisher who truly cares.

Use natural spacing with double line breaks between sections for better readability.`

      const result = await model.generateContent(promptText)
      const motivationResponse = result.response.text()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: motivationResponse,
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, assistantMessage])
      
      await speakTextWithPauses(motivationResponse, "hi")
      
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const closingMessage = "Kya aap chahein toh hum 5 minute ka ek easy topic dekhein? Ya agar aap bas baat karna chahte hain, main yahin hoon."
      
      const closingAssistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: "assistant",
        content: closingMessage,
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, closingAssistantMessage])
      
      await new Promise(resolve => setTimeout(resolve, 400))
      await speakTextWithPauses(closingMessage, "hi")
      
      setEmotionalSupportMode(false)
      setEmotionalSupportStep("initial")
      
    } catch (error) {
      console.error("Error generating motivation:", error)
      toast.error("Maaf kijiye, kuch galat ho gaya. Kripya dobara koshish karein.")
      
      const fallbackMessage = `"The darkest nights produce the brightest stars."

Yeh quote aapko yaad dilata hai ki mushkil waqt sirf temporary hai. Jab aap struggle kar rahe ho, tab aap actually stronger ban rahe ho. Har challenge aapko behtar bana raha hai.

Yaad rakhiye - aap bohot capable ho!

Main samajhta hoon ki aap abhi tough phase se guzar rahe hain, lekin aap akele nahi hain. Main yahin hoon aapki madad ke liye. Aap zaroor is phase ko paar kar lenge.`
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: fallbackMessage,
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, errorMessage])
      await speakTextWithPauses(fallbackMessage, "hi")
      
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const closingMessage = "Kya aap chahein toh hum 5 minute ka ek easy topic dekhein? Ya agar aap bas baat karna chahte hain, main yahin hoon."
      
      const closingAssistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: "assistant",
        content: closingMessage,
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, closingAssistantMessage])
      
      await new Promise(resolve => setTimeout(resolve, 400))
      await speakTextWithPauses(closingMessage, "hi")
      
      setEmotionalSupportMode(false)
      setEmotionalSupportStep("initial")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-[#0A1224]/95 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92vw] max-w-4xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 25,
              duration: 0.4
            }}
          >
            <motion.div
              className="absolute -inset-[2px] rounded-3xl opacity-70"
              style={{
                background: "linear-gradient(145deg, #00E4FF, #8A2FFF, #00E4FF)",
                backgroundSize: "300% 300%",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <motion.div
              className="absolute -inset-3 rounded-3xl opacity-30 blur-2xl"
              style={{
                background: "linear-gradient(145deg, #00E4FF, #8A2FFF)",
              }}
              animate={{
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #09111F, #101B32)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                border: "1px solid rgba(0, 228, 255, 0.15)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
              }}
            >
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
                {[...Array(15)].map((_, i) => (
                  <FloatingParticle key={i} delay={i * 1.2} />
                ))}
              </div>

              <div className="relative z-10">
                <motion.div
                  className="relative px-8 py-7 border-b"
                  style={{
                    borderColor: "rgba(0, 228, 255, 0.1)",
                    background: "rgba(0, 228, 255, 0.02)",
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
                        style={{
                          background: "linear-gradient(135deg, #00E4FF, #8A2FFF)",
                          boxShadow: "0 0 25px rgba(0, 228, 255, 0.5), 0 0 50px rgba(138, 47, 255, 0.3)",
                        }}
                        animate={{
                          boxShadow: [
                            "0 0 25px rgba(0, 228, 255, 0.5), 0 0 50px rgba(138, 47, 255, 0.3)",
                            "0 0 35px rgba(0, 228, 255, 0.7), 0 0 70px rgba(138, 47, 255, 0.5)",
                            "0 0 25px rgba(0, 228, 255, 0.5), 0 0 50px rgba(138, 47, 255, 0.3)",
                          ],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Cube size={28} weight="duotone" className="text-white" />
                      </motion.div>

                      <div>
                        <motion.h3 
                          className="text-2xl font-bold text-white mb-0.5 tracking-wide"
                          style={{
                            textShadow: "0 0 15px rgba(0, 228, 255, 0.6)",
                          }}
                        >
                          NAS Chat Box
                        </motion.h3>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-[#00E4FF]/70">AI Study Assistant</p>
                          {isSpeaking && (
                            <motion.div
                              className="flex items-center gap-1"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                            >
                              <motion.div
                                className="w-1.5 h-1.5 rounded-full bg-pink-400"
                                animate={{
                                  scale: [1, 1.3, 1],
                                  opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              />
                              <span className="text-xs text-pink-400/80">Speaking...</span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => setShowAudioModal(true)}
                        className="px-4 h-10 rounded-xl flex items-center gap-2 text-white font-medium"
                        style={{
                          background: "linear-gradient(135deg, #00E4FF, #8A2FFF)",
                          border: "1px solid rgba(0, 228, 255, 0.3)",
                          boxShadow: "0 0 15px rgba(0, 228, 255, 0.3)",
                        }}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 0 25px rgba(0, 228, 255, 0.5)",
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Headphones size={18} weight="fill" />
                        <span className="text-sm hidden sm:inline">Audio Chatbox</span>
                        <span className="text-sm sm:hidden">Audio</span>
                      </motion.button>

                      <motion.button
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white/70 hover:text-white transition-colors"
                        style={{
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                        }}
                        whileHover={{
                          background: "rgba(255, 255, 255, 0.08)",
                          scale: 1.05,
                          borderColor: "rgba(0, 228, 255, 0.3)",
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X size={18} weight="bold" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                <div 
                  className="h-[55vh] max-h-[500px] overflow-y-auto px-8 py-6 space-y-5"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#00E4FF20 transparent",
                  }}
                >
                  {messages.length === 0 ? (
                    <motion.div
                      className="h-full flex flex-col items-center justify-center text-center gap-6"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.div
                        className="w-28 h-28 rounded-3xl flex items-center justify-center"
                        style={{
                          background: "linear-gradient(135deg, rgba(0, 228, 255, 0.1), rgba(138, 47, 255, 0.1))",
                          border: "2px solid rgba(0, 228, 255, 0.2)",
                          boxShadow: "0 0 40px rgba(0, 228, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                        }}
                        animate={{
                          y: [0, -8, 0],
                          boxShadow: [
                            "0 0 40px rgba(0, 228, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                            "0 0 60px rgba(0, 228, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                            "0 0 40px rgba(0, 228, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                          ],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Cube size={56} weight="duotone" className="text-[#00E4FF]" />
                      </motion.div>
                      <div className="max-w-lg">
                        <h4 className="text-xl font-semibold text-white mb-3">
                          Hello! I'm NAS Tutor 👋
                        </h4>
                        <p className="text-sm text-white/60 leading-relaxed">
                          Ask me any educational question or doubt. I'll provide step-by-step explanations
                          to help you understand better!
                        </p>
                      </div>
                      
                      <motion.button
                        onClick={handleFeelLowClick}
                        className="px-6 py-3 rounded-2xl font-medium text-white flex items-center gap-2.5 mt-4"
                        style={{
                          background: "linear-gradient(135deg, rgba(138, 47, 255, 0.15), rgba(236, 72, 153, 0.15))",
                          border: "1px solid rgba(236, 72, 153, 0.3)",
                          boxShadow: "0 0 20px rgba(236, 72, 153, 0.2)",
                        }}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 0 30px rgba(236, 72, 153, 0.4)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Heart size={20} weight="fill" className="text-pink-400" />
                        <span className="text-base">I feel low 😔</span>
                      </motion.button>
                    </motion.div>
                  ) : (
                    messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 15, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          delay: index * 0.03, 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 28 
                        }}
                        className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.type === "assistant" && (
                          <motion.div
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                              background: "linear-gradient(135deg, #00E4FF, #8A2FFF)",
                              boxShadow: "0 0 15px rgba(0, 228, 255, 0.4)",
                            }}
                            animate={{
                              boxShadow: [
                                "0 0 15px rgba(0, 228, 255, 0.4)",
                                "0 0 25px rgba(0, 228, 255, 0.6)",
                                "0 0 15px rgba(0, 228, 255, 0.4)",
                              ],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <Cube size={18} weight="duotone" className="text-white" />
                          </motion.div>
                        )}

                        <motion.div
                          className={`max-w-[70%] rounded-2xl px-5 py-4 ${
                            message.type === "user"
                              ? "rounded-tr-md"
                              : "rounded-tl-md"
                          }`}
                          style={
                            message.type === "user"
                              ? {
                                  background: "rgba(255, 255, 255, 0.04)",
                                  border: "1px solid rgba(255, 255, 255, 0.08)",
                                  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                                }
                              : {
                                  background: "linear-gradient(135deg, rgba(0, 228, 255, 0.08), rgba(138, 47, 255, 0.08))",
                                  border: "1px solid rgba(0, 228, 255, 0.25)",
                                  boxShadow: "0 2px 20px rgba(0, 228, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                                }
                          }
                          whileHover={{
                            y: -1,
                            boxShadow: message.type === "user" 
                              ? "0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
                              : "0 4px 24px rgba(0, 228, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          {message.type === "user" ? (
                            <p className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed">
                              {message.content}
                            </p>
                          ) : (
                            <div 
                              className="text-sm text-white/90 leading-relaxed markdown-content"
                              dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
                            />
                          )}
                          <p className="text-xs mt-2.5 text-white/40">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </motion.div>
                      </motion.div>
                    ))
                  )}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex justify-start items-start gap-3"
                    >
                      <motion.div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "linear-gradient(135deg, #00E4FF, #8A2FFF)",
                          boxShadow: "0 0 15px rgba(0, 228, 255, 0.4)",
                        }}
                        animate={{
                          boxShadow: [
                            "0 0 15px rgba(0, 228, 255, 0.4)",
                            "0 0 25px rgba(0, 228, 255, 0.6)",
                            "0 0 15px rgba(0, 228, 255, 0.4)",
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Cube size={18} weight="duotone" className="text-white" />
                      </motion.div>

                      <div
                        className="max-w-[70%] rounded-2xl rounded-tl-md px-5 py-4"
                        style={{
                          background: "linear-gradient(135deg, rgba(0, 228, 255, 0.08), rgba(138, 47, 255, 0.08))",
                          border: "1px solid rgba(0, 228, 255, 0.25)",
                          boxShadow: "0 2px 20px rgba(0, 228, 255, 0.15)",
                        }}
                      >
                        <div className="flex gap-2 items-center">
                          {[0, 0.15, 0.3].map((delay, i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 rounded-full"
                              style={{
                                background: "linear-gradient(135deg, #00E4FF, #8A2FFF)",
                                boxShadow: "0 0 8px rgba(0, 228, 255, 0.6)",
                              }}
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <div 
                  className="px-8 py-6 border-t"
                  style={{
                    borderColor: "rgba(0, 228, 255, 0.1)",
                    background: "rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {!emotionalSupportMode && messages.length > 0 && (
                    <motion.div 
                      className="mb-4 flex justify-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.button
                        onClick={handleFeelLowClick}
                        className="px-5 py-2.5 rounded-xl font-medium text-white text-sm flex items-center gap-2"
                        style={{
                          background: "linear-gradient(135deg, rgba(138, 47, 255, 0.15), rgba(236, 72, 153, 0.15))",
                          border: "1px solid rgba(236, 72, 153, 0.3)",
                          boxShadow: "0 0 15px rgba(236, 72, 153, 0.2)",
                        }}
                        whileHover={{
                          scale: 1.03,
                          boxShadow: "0 0 25px rgba(236, 72, 153, 0.35)",
                        }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Heart size={16} weight="fill" className="text-pink-400" />
                        <span>I feel low 😔</span>
                      </motion.button>
                    </motion.div>
                  )}
                  <div className="flex gap-3 items-end">
                    <div className="flex-1 relative">
                      <Textarea
                        ref={textareaRef}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your doubt here..."
                        className="min-h-[68px] max-h-[140px] resize-none text-white placeholder:text-white/30 rounded-full px-6 py-4 transition-all duration-300 focus:shadow-[0_0_25px_rgba(0,228,255,0.25)] focus:border-[#00E4FF]/40"
                        style={{
                          background: "rgba(255, 255, 255, 0.04)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.4)",
                        }}
                        disabled={isLoading}
                      />
                    </div>

                    <motion.button
                      onClick={handleAskNAS}
                      disabled={isLoading || !question.trim()}
                      className="px-7 py-4 rounded-full font-medium text-white flex items-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(135deg, #00E4FF, #8A2FFF)",
                        boxShadow: "0 0 20px rgba(0, 228, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)",
                      }}
                      whileHover={
                        !isLoading && question.trim()
                          ? {
                              scale: 1.03,
                              boxShadow: "0 0 35px rgba(0, 228, 255, 0.6), 0 6px 16px rgba(0, 0, 0, 0.4)",
                            }
                          : {}
                      }
                      whileTap={
                        !isLoading && question.trim()
                          ? { scale: 0.97 }
                          : {}
                      }
                      transition={{ duration: 0.2 }}
                    >
                      <PaperPlaneRight size={18} weight="fill" />
                      <span>Send</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Audio Chatbox Modal */}
          <AnimatePresence>
            {showAudioModal && (
              <>
                <motion.div
                  className="fixed inset-0 bg-[#0A1224]/95 backdrop-blur-sm z-[60]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setShowAudioModal(false)}
                />

                <motion.div
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-[90vw] max-w-2xl"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 25,
                    duration: 0.4
                  }}
                >
                  <motion.div
                    className="absolute -inset-[2px] rounded-3xl opacity-70"
                    style={{
                      background: "linear-gradient(145deg, #00E4FF, #8A2FFF, #00E4FF)",
                      backgroundSize: "300% 300%",
                    }}
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  <motion.div
                    className="absolute -inset-3 rounded-3xl opacity-30 blur-2xl"
                    style={{
                      background: "linear-gradient(145deg, #00E4FF, #8A2FFF)",
                    }}
                    animate={{
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <div
                    className="relative rounded-3xl overflow-hidden"
                    style={{
                      background: "linear-gradient(145deg, #09111F, #101B32)",
                      backdropFilter: "blur(40px)",
                      WebkitBackdropFilter: "blur(40px)",
                      border: "1px solid rgba(0, 228, 255, 0.15)",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
                      {[...Array(12)].map((_, i) => (
                        <FloatingParticle key={i} delay={i * 1.5} />
                      ))}
                    </div>

                    <div className="relative z-10">
                      <motion.div
                        className="relative px-8 py-7 border-b"
                        style={{
                          borderColor: "rgba(0, 228, 255, 0.1)",
                          background: "rgba(0, 228, 255, 0.02)",
                        }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <motion.div
                              className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
                              style={{
                                background: "linear-gradient(135deg, #00E4FF, #8A2FFF)",
                                boxShadow: "0 0 25px rgba(0, 228, 255, 0.5), 0 0 50px rgba(138, 47, 255, 0.3)",
                              }}
                              animate={{
                                boxShadow: [
                                  "0 0 25px rgba(0, 228, 255, 0.5), 0 0 50px rgba(138, 47, 255, 0.3)",
                                  "0 0 35px rgba(0, 228, 255, 0.7), 0 0 70px rgba(138, 47, 255, 0.5)",
                                  "0 0 25px rgba(0, 228, 255, 0.5), 0 0 50px rgba(138, 47, 255, 0.3)",
                                ],
                              }}
                              transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <Headphones size={28} weight="duotone" className="text-white" />
                            </motion.div>

                            <div>
                              <motion.h3 
                                className="text-2xl font-bold text-white mb-0.5 tracking-wide"
                                style={{
                                  textShadow: "0 0 15px rgba(0, 228, 255, 0.6)",
                                }}
                              >
                                Audio Chatbox
                              </motion.h3>
                              <p className="text-sm text-[#00E4FF]/70">Get spoken explanations for any topic</p>
                            </div>
                          </div>

                          <motion.button
                            onClick={() => setShowAudioModal(false)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white/70 hover:text-white transition-colors"
                            style={{
                              background: "rgba(255, 255, 255, 0.03)",
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                            }}
                            whileHover={{
                              background: "rgba(255, 255, 255, 0.08)",
                              scale: 1.05,
                              borderColor: "rgba(0, 228, 255, 0.3)",
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <X size={18} weight="bold" />
                          </motion.button>
                        </div>
                      </motion.div>

                      <div className="px-8 py-6 space-y-6">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.3 }}
                        >
                          <label className="block text-sm font-medium text-white/80 mb-3">
                            Enter a topic you want to learn about (English or Hinglish)
                          </label>
                          <Input
                            value={audioTopic}
                            onChange={(e) => setAudioTopic(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !isGeneratingAudio) {
                                e.preventDefault()
                                handleExplainTopic()
                              }
                            }}
                            placeholder="e.g., Photosynthesis, Gravity, Cell Division ya Prakash sankleshan..."
                            className="h-14 text-white text-base placeholder:text-white/30 rounded-2xl transition-all duration-300 focus:shadow-[0_0_25px_rgba(0,228,255,0.3)] focus:border-[#00E4FF]/50"
                            style={{
                              background: "rgba(255, 255, 255, 0.04)",
                              border: "1px solid rgba(255, 255, 255, 0.08)",
                              boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.4)",
                            }}
                            disabled={isGeneratingAudio}
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.3 }}
                        >
                          <motion.button
                            onClick={handleExplainTopic}
                            disabled={isGeneratingAudio || !audioTopic.trim()}
                            className="w-full h-14 rounded-2xl font-semibold text-white text-base flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{
                              background: "linear-gradient(135deg, #00E4FF, #8A2FFF)",
                              boxShadow: "0 0 25px rgba(0, 228, 255, 0.4), 0 6px 16px rgba(0, 0, 0, 0.4)",
                            }}
                            whileHover={
                              !isGeneratingAudio && audioTopic.trim()
                                ? {
                                    scale: 1.02,
                                    boxShadow: "0 0 40px rgba(0, 228, 255, 0.6), 0 8px 20px rgba(0, 0, 0, 0.5)",
                                  }
                                : {}
                            }
                            whileTap={
                              !isGeneratingAudio && audioTopic.trim()
                                ? { scale: 0.98 }
                                : {}
                            }
                            transition={{ duration: 0.2 }}
                          >
                            <Headphones size={22} weight="fill" />
                            <span>Explain this topic</span>
                          </motion.button>
                        </motion.div>

                        {isGeneratingAudio && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="rounded-2xl p-6"
                            style={{
                              background: "linear-gradient(135deg, rgba(0, 228, 255, 0.12), rgba(138, 47, 255, 0.12))",
                              border: "1px solid rgba(0, 228, 255, 0.3)",
                              boxShadow: "0 0 25px rgba(0, 228, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                            }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex gap-2.5">
                                {[0, 0.15, 0.3].map((delay, i) => (
                                  <motion.div
                                    key={i}
                                    className="w-2.5 h-14 rounded-full"
                                    style={{
                                      background: "linear-gradient(180deg, #00E4FF, #8A2FFF)",
                                      boxShadow: "0 0 10px rgba(0, 228, 255, 0.5)",
                                    }}
                                    animate={{
                                      scaleY: [1, 1.5, 0.8, 1.5, 1],
                                      opacity: [0.5, 1, 0.7, 1, 0.5],
                                    }}
                                    transition={{
                                      duration: 1.2,
                                      repeat: Infinity,
                                      delay,
                                    }}
                                  />
                                ))}
                              </div>
                              <div>
                                <p className="text-white font-semibold">Generating audio explanation...</p>
                                <p className="text-sm text-white/60 mt-1">This may take a few seconds</p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {isPlaying && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="rounded-2xl p-6"
                            style={{
                              background: "linear-gradient(135deg, rgba(0, 228, 255, 0.12), rgba(138, 47, 255, 0.12))",
                              border: "1px solid rgba(0, 228, 255, 0.35)",
                              boxShadow: "0 0 30px rgba(0, 228, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                            }}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="flex gap-2 items-center">
                                  {[0, 0.1, 0.2, 0.15, 0.25, 0.05, 0.3, 0.08].map((delay, i) => (
                                    <motion.div
                                      key={i}
                                      className="w-2 rounded-full"
                                      style={{
                                        background: "linear-gradient(180deg, #00E4FF, #8A2FFF)",
                                        boxShadow: "0 0 8px rgba(0, 228, 255, 0.5)",
                                        height: `${20 + Math.random() * 16}px`,
                                      }}
                                      animate={{
                                        scaleY: [1, 1.8, 0.6, 1.5, 1],
                                        opacity: [0.6, 1, 0.7, 1, 0.6],
                                      }}
                                      transition={{
                                        duration: 0.8 + Math.random() * 0.4,
                                        repeat: Infinity,
                                        delay,
                                      }}
                                    />
                                  ))}
                                </div>
                                <div>
                                  <p className="text-white font-semibold">Playing explanation</p>
                                </div>
                              </div>

                              <div className="flex gap-2.5">
                                <motion.button
                                  onClick={toggleAudioPlayback}
                                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
                                  style={{
                                    background: "rgba(255, 255, 255, 0.1)",
                                    border: "1px solid rgba(0, 228, 255, 0.3)",
                                    boxShadow: "0 0 15px rgba(0, 228, 255, 0.2)",
                                  }}
                                  whileHover={{
                                    background: "rgba(0, 228, 255, 0.15)",
                                    scale: 1.05,
                                    boxShadow: "0 0 20px rgba(0, 228, 255, 0.3)",
                                  }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {isPlaying ? (
                                    <Pause size={18} weight="fill" />
                                  ) : (
                                    <Play size={18} weight="fill" />
                                  )}
                                </motion.button>

                                <motion.button
                                  onClick={stopAudio}
                                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
                                  style={{
                                    background: "rgba(255, 255, 255, 0.1)",
                                    border: "1px solid rgba(255, 255, 255, 0.2)",
                                  }}
                                  whileHover={{
                                    background: "rgba(255, 87, 51, 0.25)",
                                    scale: 1.05,
                                    borderColor: "rgba(255, 87, 51, 0.5)",
                                  }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <X size={18} weight="bold" />
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {audioExplanationText && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="rounded-2xl p-6"
                            style={{
                              background: "linear-gradient(135deg, rgba(0, 228, 255, 0.08), rgba(138, 47, 255, 0.08))",
                              border: "1px solid rgba(0, 228, 255, 0.25)",
                              boxShadow: "0 2px 20px rgba(0, 228, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                            }}
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <motion.div
                                className="w-9 h-9 rounded-xl flex items-center justify-center"
                                style={{
                                  background: "linear-gradient(135deg, #00E4FF, #8A2FFF)",
                                  boxShadow: "0 0 15px rgba(0, 228, 255, 0.4)",
                                }}
                                animate={{
                                  boxShadow: [
                                    "0 0 15px rgba(0, 228, 255, 0.4)",
                                    "0 0 25px rgba(0, 228, 255, 0.6)",
                                    "0 0 15px rgba(0, 228, 255, 0.4)",
                                  ],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              >
                                <Cube size={18} weight="duotone" className="text-white" />
                              </motion.div>
                              <h4 className="text-base font-semibold text-white" style={{ textShadow: "0 0 10px rgba(0, 228, 255, 0.4)" }}>
                                Explanation Text
                              </h4>
                            </div>
                            <div 
                              className="text-sm text-white/90 leading-relaxed markdown-content"
                              style={{
                                maxHeight: "320px",
                                overflowY: "auto",
                                scrollbarWidth: "thin",
                                scrollbarColor: "#00E4FF20 transparent",
                              }}
                              dangerouslySetInnerHTML={{ __html: renderMarkdown(audioExplanationText) }}
                            />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}
