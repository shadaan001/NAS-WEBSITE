import { motion } from "framer-motion"
import { FacebookLogo, InstagramLogo, TwitterLogo, YoutubeLogo, Envelope, Phone, MapPin } from "@phosphor-icons/react"
import { siteConfig } from "@/data/siteConfig"
import BubbleIcon from "./BubbleIcon"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialIcons = [
    { Icon: FacebookLogo, link: siteConfig.socialLinks.facebook },
    { Icon: InstagramLogo, link: siteConfig.socialLinks.instagram },
    { Icon: TwitterLogo, link: siteConfig.socialLinks.twitter },
    { Icon: YoutubeLogo, link: siteConfig.socialLinks.youtube }
  ]

  return (
    <footer className="relative mt-20 glass-strong border-t border-border/50">
      <div className="container mx-auto px-6 md:px-12 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-heading font-bold text-2xl text-gradient-blue-purple mb-4">
              {siteConfig.name}
            </h3>
            <p className="text-muted-foreground mb-6">
              {siteConfig.description}
            </p>
            <div className="flex gap-3">
              {socialIcons.map(({ Icon, link }, index) => (
                <motion.a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <BubbleIcon size="sm" variant="blue">
                    <Icon weight="fill" />
                  </BubbleIcon>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-heading font-semibold text-lg mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Courses", "About Us", "Results", "Gallery", "Contact"].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-heading font-semibold text-lg mb-4 text-foreground">Popular Courses</h4>
            <ul className="space-y-2">
              {["WB BOARDS", "ICSE AND ISC", "WBJEE", "Foundation (1-12)", "Board Exams", "Crash Courses"].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-secondary transition-colors duration-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-heading font-semibold text-lg mb-4 text-foreground">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-accent text-xl mt-1 flex-shrink-0" weight="fill" />
                <p className="text-muted-foreground text-sm">{siteConfig.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-primary text-xl flex-shrink-0" weight="fill" />
                <a 
                  href={`tel:${siteConfig.phone}`}
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  {siteConfig.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Envelope className="text-secondary text-xl flex-shrink-0" weight="fill" />
                <a 
                  href={`mailto:${siteConfig.email}`}
                  className="text-muted-foreground text-sm hover:text-secondary transition-colors"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="mt-12 pt-8 border-t border-border/30 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-muted-foreground text-sm">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Designed with innovation for the future of education
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
