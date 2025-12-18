import { useState } from "react"
import { motion } from "framer-motion"
import { useKV } from "@github/spark/hooks"
import { User, Pencil, Building, EnvelopeSimple, Phone, MapPin, SignOut, Image as ImageIcon, ArrowLeft } from "@phosphor-icons/react"
import BubbleIcon from "@/components/school/BubbleIcon"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "sonner"
import type { AdminUser } from "@/types/admin"

interface AdminProfilePageProps {
  adminId: string
  onLogout: () => void
  onBack?: () => void
}

export default function AdminProfilePage({ adminId, onLogout, onBack }: AdminProfilePageProps) {
  const [adminUser, setAdminUser] = useKV<AdminUser>("admin-user-profile", {
    id: adminId,
    name: "Admin User",
    email: "admin@coaching.com",
    coachingName: "Excellence Coaching Center",
    address: "123, Education Street, City - 400001",
    contactNumber: "+91 98765 43210"
  })
  
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [formData, setFormData] = useState(adminUser || {
    id: adminId,
    name: "",
    email: "",
    coachingName: "",
    address: "",
    contactNumber: ""
  })

  const handleSave = () => {
    setAdminUser(() => formData)
    setIsEditOpen(false)
    toast.success("Profile updated successfully")
  }

  const handleLogout = () => {
    toast.success("Logged out successfully")
    onLogout()
  }

  return (
    <div className="pb-24 px-4 pt-16 space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-2"
      >
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="hover:bg-white/10 p-2"
          >
            <ArrowLeft size={24} weight="bold" className="text-white" />
          </Button>
        )}
        <BubbleIcon size="md" variant="purple">
          <User size={28} weight="fill" />
        </BubbleIcon>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Admin Profile</h1>
          <p className="text-sm text-gray-300">Manage your profile settings</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 rounded-2xl card-shadow">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center mb-4 shadow-lg relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-secondary to-accent opacity-30 blur-xl" />
              <User size={40} weight="fill" className="text-white relative z-10" />
            </div>
            <h2 className="text-xl font-bold text-heading text-foreground">{adminUser?.name}</h2>
            <p className="text-sm text-muted-foreground">{adminUser?.coachingName}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <EnvelopeSimple size={20} className="text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{adminUser?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <Phone size={20} className="text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Contact</p>
                <p className="text-sm font-medium">{adminUser?.contactNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <Building size={20} className="text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Coaching Name</p>
                <p className="text-sm font-medium">{adminUser?.coachingName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <MapPin size={20} className="text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm font-medium">{adminUser?.address}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => {
                setFormData(adminUser || {
                  id: adminId,
                  name: "",
                  email: "",
                  coachingName: "",
                  address: "",
                  contactNumber: ""
                })
                setIsEditOpen(true)
              }}
              className="flex-1 gap-2"
            >
              <Pencil size={18} />
              Edit Profile
            </Button>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-4 rounded-2xl card-shadow bg-destructive/5 border-destructive/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-heading text-foreground">Logout</h3>
              <p className="text-xs text-muted-foreground">Sign out of admin panel</p>
            </div>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="gap-2"
            >
              <SignOut size={18} />
              Logout
            </Button>
          </div>
        </Card>
      </motion.div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coachingName">Coaching Center Name</Label>
              <Input
                id="coachingName"
                value={formData.coachingName}
                onChange={(e) => setFormData(prev => ({ ...prev, coachingName: e.target.value }))}
                placeholder="Excellence Coaching Center"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Full address"
              />
            </div>

            <div className="space-y-2">
              <Label>Logo Upload</Label>
              <div className="p-4 rounded-xl border-2 border-dashed border-border flex items-center justify-center gap-2 text-muted-foreground hover:border-primary transition-colors cursor-pointer">
                <ImageIcon size={20} />
                <span className="text-sm">Click to upload logo</span>
              </div>
              <p className="text-xs text-muted-foreground">
                TODO: Implement file upload with image storage
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
