import { motion } from "framer-motion"
import FeatureBubble from "./FeatureBubble"
import { 
  Brain, 
  UsersFour, 
  ChartLineUp, 
  ShieldCheck, 
  CreditCard, 
  ClipboardText 
} from "@phosphor-icons/react"

export default function FeaturesSection() {
  const features = [
    {
      icon: <Brain weight="fill" />,
      title: "Smart Learning",
      description: "AI-powered personalized learning paths tailored to each student's pace and style",
      variant: "blue" as const
    },
    {
      icon: <UsersFour weight="fill" />,
      title: "Teacher Monitoring",
      description: "Multiple expert teachers collaborate to ensure comprehensive subject coverage",
      variant: "purple" as const
    },
    {
      icon: <ChartLineUp weight="fill" />,
      title: "Weekly Tests",
      description: "Regular assessments to track progress and identify areas for improvement",
      variant: "cyan" as const
    },
    {
      icon: <ShieldCheck weight="fill" />,
      title: "Secure Login",
      description: "Protected student and admin portals with advanced security features",
      variant: "blue" as const
    },
    {
      icon: <CreditCard weight="fill" />,
      title: "Easy Payments",
      description: "Flexible payment options with secure online transaction processing",
      variant: "purple" as const
    },
    {
      icon: <ClipboardText weight="fill" />,
      title: "Progress Tracking",
      description: "Detailed analytics and reports on student performance and achievements",
      variant: "cyan" as const
    }
  ]

  return (
    <section className="relative py-20 md:py-28 px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-gradient-blue-purple">
            Why Choose Us
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of education with our innovative approach to learning
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureBubble
              key={feature.title}
              title={feature.title}
              description={feature.description}
              variant={feature.variant}
              delay={index * 0.1}
            >
              {feature.icon}
            </FeatureBubble>
          ))}
        </div>
      </div>
    </section>
  )
}
