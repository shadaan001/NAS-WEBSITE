import { ReactNode } from "react"
import Header from "./Header"
import Footer from "./Footer"
import AnimatedBackground from "./AnimatedBackground"

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Header />
      <main className="pt-20">
        {children}
      </main>
      <Footer />
    </div>
  )
}
