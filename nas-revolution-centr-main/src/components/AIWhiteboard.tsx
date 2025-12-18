import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  Pencil, 
  Eraser, 
  Trash, 
  Download, 
  Circle,
  PaintBrush,
  FloppyDisk
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface AIWhiteboardProps {
  isOpen: boolean
  onClose: () => void
  autoDrawCommand?: {
    type: 'equation' | 'graph' | 'tree' | 'flowchart' | 'circuit' | 'diagram' | 'table' | 'handwriting'
    data: string
  } | null
}

interface Point {
  x: number
  y: number
}

interface Stroke {
  points: Point[]
  color: string
  width: number
}

const FloatingParticle = ({ delay }: { delay: number }) => {
  const randomX = Math.random() * 100
  const randomY = Math.random() * 100
  const randomDuration = 20 + Math.random() * 15

  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full"
      style={{
        left: `${randomX}%`,
        top: `${randomY}%`,
        background: "radial-gradient(circle, #00E4FF, transparent)",
        boxShadow: "0 0 4px 1px rgba(0, 228, 255, 0.3)",
      }}
      animate={{
        y: [0, -20, 0],
        x: [0, 10, -10, 0],
        opacity: [0.2, 0.5, 0.2],
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

export default function AIWhiteboard({ isOpen, onClose, autoDrawCommand }: AIWhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const [color, setColor] = useState('#00E4FF')
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [currentStroke, setCurrentStroke] = useState<Point[]>([])
  const [isAIDrawing, setIsAIDrawing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      redrawCanvas()
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  useEffect(() => {
    redrawCanvas()
  }, [strokes])

  useEffect(() => {
    if (autoDrawCommand && isOpen) {
      handleAutoDrawCommand(autoDrawCommand)
    }
  }, [autoDrawCommand, isOpen])

  const redrawCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    strokes.forEach(stroke => {
      if (stroke.points.length < 2) return

      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.beginPath()
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)

      for (let i = 1; i < stroke.points.length; i++) {
        const prev = stroke.points[i - 1]
        const curr = stroke.points[i]
        const midX = (prev.x + curr.x) / 2
        const midY = (prev.y + curr.y) / 2
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY)
      }

      const lastPoint = stroke.points[stroke.points.length - 1]
      ctx.lineTo(lastPoint.x, lastPoint.y)
      ctx.stroke()
    })
  }

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    
    let clientX: number, clientY: number
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isAIDrawing) return
    setIsDrawing(true)
    const point = getCanvasPoint(e)
    setCurrentStroke([point])
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isAIDrawing) return

    const point = getCanvasPoint(e)
    setCurrentStroke(prev => [...prev, point])

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    if (currentStroke.length > 0) {
      const prevPoint = currentStroke[currentStroke.length - 1]
      
      ctx.strokeStyle = tool === 'eraser' ? '#09111F' : color
      ctx.lineWidth = tool === 'eraser' ? 20 : 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.beginPath()
      ctx.moveTo(prevPoint.x, prevPoint.y)
      ctx.lineTo(point.x, point.y)
      ctx.stroke()
    }
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)

    if (currentStroke.length > 1) {
      const newStroke: Stroke = {
        points: currentStroke,
        color: tool === 'eraser' ? '#09111F' : color,
        width: tool === 'eraser' ? 20 : 3
      }
      setStrokes(prev => [...prev, newStroke])
    }
    setCurrentStroke([])
  }

  const clearCanvas = () => {
    setStrokes([])
    setCurrentStroke([])
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    toast.success('Canvas cleared')
  }

  const exportCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `nas-whiteboard-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
    toast.success('Whiteboard exported!')
  }

  const drawAnimatedStroke = async (points: Point[], color: string, delay: number = 10) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return

    for (let i = 1; i < points.length; i++) {
      await new Promise(resolve => setTimeout(resolve, delay))
      
      const prev = points[i - 1]
      const curr = points[i]

      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      ctx.beginPath()
      ctx.moveTo(prev.x, prev.y)
      ctx.lineTo(curr.x, curr.y)
      ctx.stroke()
    }

    const newStroke: Stroke = { points, color, width: 3 }
    setStrokes(prev => [...prev, newStroke])
  }

  const drawEquationSteps = async (equation: string) => {
    setIsAIDrawing(true)
    clearCanvas()
    toast.info('Drawing equation...')

    const canvas = canvasRef.current
    if (!canvas) return

    const width = canvas.getBoundingClientRect().width
    const height = canvas.getBoundingClientRect().height

    try {
      const promptText = `You are an AI that creates step-by-step handwritten equation solutions. 
Given this equation: ${equation}

Generate 5-7 solution steps. For each step, provide:
1. The equation/expression
2. Brief explanation

Return as JSON object with a "steps" property containing an array: {"steps": [{"step": "2x + 5 = 15", "explanation": "Original equation"}]}`
      
      const response = await spark.llm(promptText, 'gpt-4o-mini', true)
      const steps = JSON.parse(response)

      let yOffset = 80

      for (const item of steps.steps || steps) {
        const stepText = `${item.step}`
        const points = generateHandwritingPath(stepText, 60, yOffset, width - 120)
        await drawAnimatedStroke(points, '#00E4FF', 5)
        yOffset += 60
      }

      toast.success('Equation drawn!')
    } catch (error) {
      console.error('Error drawing equation:', error)
      toast.error('Failed to draw equation')
    } finally {
      setIsAIDrawing(false)
    }
  }

  const drawGraph = async (func: string) => {
    setIsAIDrawing(true)
    clearCanvas()
    toast.info('Drawing graph...')

    const canvas = canvasRef.current
    if (!canvas) return

    const width = canvas.getBoundingClientRect().width
    const height = canvas.getBoundingClientRect().height
    const centerX = width / 2
    const centerY = height / 2

    const axisPoints: Point[] = [
      { x: 40, y: centerY },
      { x: width - 40, y: centerY }
    ]
    await drawAnimatedStroke(axisPoints, '#8A2FFF', 2)

    const yAxisPoints: Point[] = [
      { x: centerX, y: 40 },
      { x: centerX, y: height - 40 }
    ]
    await drawAnimatedStroke(yAxisPoints, '#8A2FFF', 2)

    const graphPoints: Point[] = []
    const scale = 30
    
    for (let x = -10; x <= 10; x += 0.1) {
      let y = 0
      
      try {
        if (func.includes('x²') || func.includes('x^2')) {
          y = x * x / 3
        } else if (func.includes('sin')) {
          y = Math.sin(x) * 3
        } else if (func.includes('cos')) {
          y = Math.cos(x) * 3
        } else if (func.includes('log')) {
          y = x > 0 ? Math.log(x) * 2 : 0
        } else {
          y = x
        }

        graphPoints.push({
          x: centerX + x * scale,
          y: centerY - y * scale
        })
      } catch (e) {
        console.error('Graph calculation error:', e)
      }
    }

    await drawAnimatedStroke(graphPoints, '#00E4FF', 1)
    toast.success('Graph drawn!')
    setIsAIDrawing(false)
  }

  const drawBinaryTree = async (data: string) => {
    setIsAIDrawing(true)
    clearCanvas()
    toast.info('Drawing binary tree...')

    const canvas = canvasRef.current
    if (!canvas) return

    const width = canvas.getBoundingClientRect().width
    const height = canvas.getBoundingClientRect().height

    const drawNode = async (x: number, y: number, value: string) => {
      const radius = 25
      const circlePoints: Point[] = []
      
      for (let angle = 0; angle <= 360; angle += 5) {
        const rad = (angle * Math.PI) / 180
        circlePoints.push({
          x: x + radius * Math.cos(rad),
          y: y + radius * Math.sin(rad)
        })
      }
      
      await drawAnimatedStroke(circlePoints, '#00E4FF', 2)
      
      const textPoints = generateHandwritingPath(value, x - 10, y + 5, 20)
      await drawAnimatedStroke(textPoints, '#00E4FF', 3)
    }

    const drawConnection = async (x1: number, y1: number, x2: number, y2: number) => {
      await drawAnimatedStroke([{ x: x1, y: y1 }, { x: x2, y: y2 }], '#8A2FFF', 2)
    }

    const rootX = width / 2
    const rootY = 80
    const levelGap = 80
    const horizontalGap = 100

    await drawNode(rootX, rootY, '10')
    
    await drawConnection(rootX, rootY + 25, rootX - horizontalGap, rootY + levelGap - 25)
    await drawNode(rootX - horizontalGap, rootY + levelGap, '5')
    
    await drawConnection(rootX, rootY + 25, rootX + horizontalGap, rootY + levelGap - 25)
    await drawNode(rootX + horizontalGap, rootY + levelGap, '15')
    
    await drawConnection(rootX - horizontalGap, rootY + levelGap + 25, rootX - horizontalGap - 50, rootY + 2 * levelGap - 25)
    await drawNode(rootX - horizontalGap - 50, rootY + 2 * levelGap, '3')
    
    await drawConnection(rootX - horizontalGap, rootY + levelGap + 25, rootX - horizontalGap + 50, rootY + 2 * levelGap - 25)
    await drawNode(rootX - horizontalGap + 50, rootY + 2 * levelGap, '7')
    
    await drawConnection(rootX + horizontalGap, rootY + levelGap + 25, rootX + horizontalGap + 50, rootY + 2 * levelGap - 25)
    await drawNode(rootX + horizontalGap + 50, rootY + 2 * levelGap, '20')

    toast.success('Binary tree drawn!')
    setIsAIDrawing(false)
  }

  const drawFlowchart = async (data: string) => {
    setIsAIDrawing(true)
    clearCanvas()
    toast.info('Drawing flowchart...')

    const canvas = canvasRef.current
    if (!canvas) return

    const width = canvas.getBoundingClientRect().width
    const centerX = width / 2

    const drawBox = async (x: number, y: number, w: number, h: number, text: string) => {
      const boxPoints: Point[] = [
        { x: x - w/2, y: y - h/2 },
        { x: x + w/2, y: y - h/2 },
        { x: x + w/2, y: y + h/2 },
        { x: x - w/2, y: y + h/2 },
        { x: x - w/2, y: y - h/2 }
      ]
      await drawAnimatedStroke(boxPoints, '#00E4FF', 2)
      
      const textPoints = generateHandwritingPath(text, x - 30, y + 5, 60)
      await drawAnimatedStroke(textPoints, '#00E4FF', 3)
    }

    const drawArrow = async (x1: number, y1: number, x2: number, y2: number) => {
      await drawAnimatedStroke([{ x: x1, y: y1 }, { x: x2, y: y2 }], '#8A2FFF', 2)
      
      const arrowSize = 10
      const angle = Math.atan2(y2 - y1, x2 - x1)
      const arrowPoints: Point[] = [
        { x: x2, y: y2 },
        { 
          x: x2 - arrowSize * Math.cos(angle - Math.PI / 6), 
          y: y2 - arrowSize * Math.sin(angle - Math.PI / 6) 
        },
        { x: x2, y: y2 },
        { 
          x: x2 - arrowSize * Math.cos(angle + Math.PI / 6), 
          y: y2 - arrowSize * Math.sin(angle + Math.PI / 6) 
        }
      ]
      await drawAnimatedStroke(arrowPoints, '#8A2FFF', 2)
    }

    await drawBox(centerX, 80, 120, 50, 'Start')
    await drawArrow(centerX, 105, centerX, 155)
    
    await drawBox(centerX, 180, 140, 50, 'Process')
    await drawArrow(centerX, 205, centerX, 255)
    
    await drawBox(centerX, 280, 120, 50, 'Decision')
    await drawArrow(centerX, 305, centerX, 355)
    
    await drawBox(centerX, 380, 120, 50, 'End')

    toast.success('Flowchart drawn!')
    setIsAIDrawing(false)
  }

  const drawCircuit = async (data: string) => {
    setIsAIDrawing(true)
    clearCanvas()
    toast.info('Drawing circuit...')

    const canvas = canvasRef.current
    if (!canvas) return

    const width = canvas.getBoundingClientRect().width
    const height = canvas.getBoundingClientRect().height
    const centerX = width / 2
    const centerY = height / 2

    const drawResistor = async (x: number, y: number) => {
      const points: Point[] = [
        { x: x - 30, y },
        { x: x - 20, y: y - 15 },
        { x: x - 10, y: y + 15 },
        { x, y: y - 15 },
        { x: x + 10, y: y + 15 },
        { x: x + 20, y: y - 15 },
        { x: x + 30, y }
      ]
      await drawAnimatedStroke(points, '#00E4FF', 2)
    }

    const drawBattery = async (x: number, y: number) => {
      await drawAnimatedStroke([
        { x: x - 5, y: y - 20 },
        { x: x - 5, y: y + 20 }
      ], '#00E4FF', 3)
      
      await drawAnimatedStroke([
        { x: x + 5, y: y - 10 },
        { x: x + 5, y: y + 10 }
      ], '#00E4FF', 3)
    }

    await drawAnimatedStroke([
      { x: centerX - 100, y: centerY - 60 },
      { x: centerX + 100, y: centerY - 60 }
    ], '#8A2FFF', 2)

    await drawResistor(centerX, centerY - 60)

    await drawAnimatedStroke([
      { x: centerX + 100, y: centerY - 60 },
      { x: centerX + 100, y: centerY + 60 }
    ], '#8A2FFF', 2)

    await drawAnimatedStroke([
      { x: centerX + 100, y: centerY + 60 },
      { x: centerX - 100, y: centerY + 60 }
    ], '#8A2FFF', 2)

    await drawBattery(centerX - 100, centerY)

    await drawAnimatedStroke([
      { x: centerX - 100, y: centerY - 60 },
      { x: centerX - 100, y: centerY - 30 }
    ], '#8A2FFF', 2)

    await drawAnimatedStroke([
      { x: centerX - 100, y: centerY + 30 },
      { x: centerX - 100, y: centerY + 60 }
    ], '#8A2FFF', 2)

    toast.success('Circuit drawn!')
    setIsAIDrawing(false)
  }

  const drawHandwriting = async (text: string) => {
    setIsAIDrawing(true)
    clearCanvas()
    toast.info('Writing text...')

    const points = generateHandwritingPath(text, 60, 100, 600)
    await drawAnimatedStroke(points, '#00E4FF', 8)

    toast.success('Text written!')
    setIsAIDrawing(false)
  }

  const generateHandwritingPath = (text: string, startX: number, startY: number, maxWidth: number): Point[] => {
    const points: Point[] = []
    const charWidth = 15
    const charHeight = 20
    
    let x = startX
    let y = startY

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      
      if (char === ' ') {
        x += charWidth * 1.5
        continue
      }

      if (x > startX + maxWidth) {
        x = startX
        y += charHeight * 2
      }

      const variation = Math.random() * 4 - 2
      
      points.push({ x, y: y + variation })
      points.push({ x: x + charWidth * 0.3, y: y - charHeight * 0.5 + variation })
      points.push({ x: x + charWidth * 0.6, y: y + variation })
      points.push({ x: x + charWidth, y: y + charHeight * 0.3 + variation })
      
      x += charWidth * 1.2
    }

    return points
  }

  const handleAutoDrawCommand = async (command: { type: string; data: string }) => {
    switch (command.type) {
      case 'equation':
        await drawEquationSteps(command.data)
        break
      case 'graph':
        await drawGraph(command.data)
        break
      case 'tree':
        await drawBinaryTree(command.data)
        break
      case 'flowchart':
        await drawFlowchart(command.data)
        break
      case 'circuit':
        await drawCircuit(command.data)
        break
      case 'handwriting':
        await drawHandwriting(command.data)
        break
      default:
        await drawHandwriting(command.data)
    }
  }

  const colors = ['#00E4FF', '#8A2FFF', '#FF3B30', '#00E676', '#FFD700', '#FFFFFF']

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-[#0A1224]/95 backdrop-blur-sm z-[70]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-[95vw] max-w-6xl"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ 
              type: "spring", 
              stiffness: 240, 
              damping: 26,
              duration: 0.5
            }}
          >
            <motion.div
              className="absolute -inset-[3px] rounded-3xl"
              style={{
                background: "linear-gradient(145deg, #00E4FF, #8A2FFF, #00E4FF, #8A2FFF)",
                backgroundSize: "400% 400%",
              }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <motion.div
              className="absolute -inset-4 rounded-3xl blur-3xl"
              style={{
                background: "linear-gradient(145deg, #00E4FF, #8A2FFF)",
                opacity: 0.4,
              }}
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
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
                boxShadow: "0 12px 48px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
              }}
            >
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                {[...Array(20)].map((_, i) => (
                  <FloatingParticle key={i} delay={i * 1.5} />
                ))}
              </div>

              <div className="relative z-10">
                <motion.div
                  className="relative px-8 py-6 border-b"
                  style={{
                    borderColor: "rgba(0, 228, 255, 0.15)",
                    background: "rgba(0, 228, 255, 0.03)",
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
                        style={{
                          background: "linear-gradient(135deg, #00E4FF, #8A2FFF)",
                          boxShadow: "0 0 30px rgba(0, 228, 255, 0.6), 0 0 60px rgba(138, 47, 255, 0.4)",
                        }}
                        animate={{
                          boxShadow: [
                            "0 0 30px rgba(0, 228, 255, 0.6), 0 0 60px rgba(138, 47, 255, 0.4)",
                            "0 0 45px rgba(0, 228, 255, 0.8), 0 0 80px rgba(138, 47, 255, 0.6)",
                            "0 0 30px rgba(0, 228, 255, 0.6), 0 0 60px rgba(138, 47, 255, 0.4)",
                          ],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <PaintBrush size={32} weight="duotone" className="text-white" />
                      </motion.div>

                      <div>
                        <motion.h3 
                          className="text-3xl font-bold text-white mb-1 tracking-wide"
                          style={{
                            textShadow: "0 0 20px rgba(0, 228, 255, 0.8), 0 0 40px rgba(138, 47, 255, 0.4)",
                          }}
                        >
                          AI Whiteboard
                        </motion.h3>
                        <p className="text-sm text-[#00E4FF]/80">Holographic Drawing Space</p>
                      </div>
                    </div>

                    <motion.button
                      onClick={onClose}
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white/70 hover:text-white transition-colors"
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      }}
                      whileHover={{
                        background: "rgba(255, 87, 51, 0.15)",
                        scale: 1.05,
                        borderColor: "rgba(255, 87, 51, 0.3)",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X size={20} weight="bold" />
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-3 mt-6 flex-wrap">
                    <motion.button
                      onClick={() => setTool('pen')}
                      className={`px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all ${
                        tool === 'pen' ? 'text-white' : 'text-white/60'
                      }`}
                      style={{
                        background: tool === 'pen' 
                          ? 'linear-gradient(135deg, #00E4FF, #8A2FFF)' 
                          : 'rgba(255, 255, 255, 0.04)',
                        border: `1px solid ${tool === 'pen' ? 'rgba(0, 228, 255, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                        boxShadow: tool === 'pen' ? '0 0 20px rgba(0, 228, 255, 0.3)' : 'none',
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Pencil size={18} weight="fill" />
                      <span className="text-sm">Pen</span>
                    </motion.button>

                    <motion.button
                      onClick={() => setTool('eraser')}
                      className={`px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all ${
                        tool === 'eraser' ? 'text-white' : 'text-white/60'
                      }`}
                      style={{
                        background: tool === 'eraser' 
                          ? 'linear-gradient(135deg, #00E4FF, #8A2FFF)' 
                          : 'rgba(255, 255, 255, 0.04)',
                        border: `1px solid ${tool === 'eraser' ? 'rgba(0, 228, 255, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                        boxShadow: tool === 'eraser' ? '0 0 20px rgba(0, 228, 255, 0.3)' : 'none',
                      }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Eraser size={18} weight="fill" />
                      <span className="text-sm">Eraser</span>
                    </motion.button>

                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      {colors.map((c) => (
                        <motion.button
                          key={c}
                          onClick={() => setColor(c)}
                          className="w-7 h-7 rounded-lg relative"
                          style={{
                            background: c,
                            border: color === c ? '2px solid white' : '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: color === c ? `0 0 15px ${c}` : 'none',
                          }}
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                        />
                      ))}
                    </div>

                    <motion.button
                      onClick={clearCanvas}
                      className="px-5 py-2.5 rounded-xl flex items-center gap-2 text-white/70 hover:text-white font-medium"
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                      whileHover={{
                        background: 'rgba(255, 87, 51, 0.15)',
                        borderColor: 'rgba(255, 87, 51, 0.3)',
                        scale: 1.03
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Trash size={18} weight="fill" />
                      <span className="text-sm">Clear</span>
                    </motion.button>

                    <motion.button
                      onClick={exportCanvas}
                      className="px-5 py-2.5 rounded-xl flex items-center gap-2 text-white font-medium"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0, 228, 255, 0.15), rgba(138, 47, 255, 0.15))',
                        border: '1px solid rgba(0, 228, 255, 0.3)',
                        boxShadow: '0 0 15px rgba(0, 228, 255, 0.2)',
                      }}
                      whileHover={{
                        boxShadow: '0 0 25px rgba(0, 228, 255, 0.4)',
                        scale: 1.03
                      }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Download size={18} weight="fill" />
                      <span className="text-sm">Export</span>
                    </motion.button>
                  </div>
                </motion.div>

                <div className="relative p-6">
                  <motion.div
                    className="relative rounded-2xl overflow-hidden"
                    style={{
                      background: '#09111F',
                      border: '2px solid rgba(0, 228, 255, 0.3)',
                      boxShadow: '0 0 40px rgba(0, 228, 255, 0.2), inset 0 0 60px rgba(0, 228, 255, 0.05)',
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <canvas
                      ref={canvasRef}
                      className="w-full cursor-crosshair"
                      style={{ height: '60vh', maxHeight: '600px' }}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                    
                    {isAIDrawing && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          background: 'rgba(9, 17, 31, 0.7)',
                          backdropFilter: 'blur(4px)',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="text-center">
                          <div className="flex gap-3 mb-4 justify-center">
                            {[0, 0.15, 0.3].map((delay, i) => (
                              <motion.div
                                key={i}
                                className="w-4 h-4 rounded-full"
                                style={{
                                  background: 'linear-gradient(135deg, #00E4FF, #8A2FFF)',
                                  boxShadow: '0 0 15px rgba(0, 228, 255, 0.6)',
                                }}
                                animate={{
                                  scale: [1, 1.5, 1],
                                  opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                  duration: 1.2,
                                  repeat: Infinity,
                                  delay,
                                }}
                              />
                            ))}
                          </div>
                          <p className="text-white font-semibold text-lg">AI is drawing...</p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
