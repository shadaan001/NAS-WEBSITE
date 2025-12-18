import { User, Phone, EnvelopeSimple, MapPin, IdentificationCard, GearSix, Bell, SignOut, CurrencyDollar, ChartBar } from "@phosphor-icons/react"
import BubbleIcon from "@/components/school/BubbleIcon"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { studentData, feesData, resultsData, notificationsData } from "@/data/mockData"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface ProfilePageProps {
  onLogout: () => void
}

export default function ProfilePage({ onLogout }: ProfilePageProps) {
  const unreadNotifications = notificationsData.filter((n) => !n.read).length
  const latestResult = resultsData[0]

  const handleLogoutClick = () => {
    toast.success("Logged out successfully")
    onLogout()
  }

  return (
    <div className="pb-20 px-4 pt-16 space-y-5 animate-fade-in">
      <Card className="p-5 rounded-2xl card-shadow text-center animate-slide-up">
        <Avatar className="w-24 h-24 mx-auto mb-3 border-4 border-primary/20">
          <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold text-heading">
            {studentData.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold text-heading text-foreground mb-1">{studentData.name}</h1>
        <p className="text-sm text-muted-foreground mb-2">{studentData.class} • Roll No. {studentData.rollNumber}</p>
        <p className="text-xs text-muted-foreground">Admission No: {studentData.admissionNumber}</p>
      </Card>

      <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
        <h2 className="text-base font-bold text-heading text-foreground mb-3">Student Information</h2>
        <Card className="p-4 rounded-2xl card-shadow space-y-3">
          <div className="flex items-center gap-3">
            <BubbleIcon size="sm" variant="blue">
              <IdentificationCard size={20} weight="fill" />
            </BubbleIcon>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Date of Birth</p>
              <p className="text-sm font-semibold text-foreground">
                {new Date(studentData.dateOfBirth).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <BubbleIcon size="sm" variant="green">
              <User size={20} weight="fill" />
            </BubbleIcon>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Blood Group</p>
              <p className="text-sm font-semibold text-foreground">{studentData.bloodGroup}</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <BubbleIcon size="sm" variant="purple">
              <MapPin size={20} weight="fill" />
            </BubbleIcon>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Address</p>
              <p className="text-sm font-semibold text-foreground">{studentData.address}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-base font-bold text-heading text-foreground mb-3">Parent/Guardian Information</h2>
        <Card className="p-4 rounded-2xl card-shadow space-y-3">
          <div className="flex items-center gap-3">
            <BubbleIcon size="sm" variant="blue">
              <User size={20} weight="fill" />
            </BubbleIcon>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Parent Name</p>
              <p className="text-sm font-semibold text-foreground">{studentData.parentName}</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <BubbleIcon size="sm" variant="green">
              <Phone size={20} weight="fill" />
            </BubbleIcon>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Contact Number</p>
              <p className="text-sm font-semibold text-foreground">{studentData.parentContact}</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <BubbleIcon size="sm" variant="orange">
              <EnvelopeSimple size={20} weight="fill" />
            </BubbleIcon>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-semibold text-foreground break-all">{studentData.parentEmail}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <h2 className="text-base font-bold text-heading text-foreground mb-3">Quick Actions</h2>
        <div className="space-y-2">
          <Card className="p-4 rounded-xl card-shadow flex items-center gap-3 cursor-pointer active:scale-98 transition-all">
            <BubbleIcon size="sm" variant="purple">
              <ChartBar size={20} weight="fill" />
            </BubbleIcon>
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground text-heading">View Results</p>
              <p className="text-xs text-muted-foreground">Latest: {latestResult.percentage}% in {latestResult.examName}</p>
            </div>
          </Card>

          <Card className="p-4 rounded-xl card-shadow flex items-center gap-3 cursor-pointer active:scale-98 transition-all">
            <BubbleIcon size="sm" variant="orange">
              <CurrencyDollar size={20} weight="fill" />
            </BubbleIcon>
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground text-heading">Fee Details</p>
              <p className="text-xs text-muted-foreground">Pending: ₹{feesData.pendingAmount.toLocaleString()}</p>
            </div>
          </Card>

          <Card className="p-4 rounded-xl card-shadow flex items-center gap-3 cursor-pointer active:scale-98 transition-all">
            <BubbleIcon size="sm" variant="blue">
              <Bell size={20} weight="fill" />
            </BubbleIcon>
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground text-heading">Notifications</p>
              <p className="text-xs text-muted-foreground">{unreadNotifications} unread messages</p>
            </div>
            {unreadNotifications > 0 && (
              <Badge className="bg-accent text-accent-foreground">{unreadNotifications}</Badge>
            )}
          </Card>

          <Card className="p-4 rounded-xl card-shadow flex items-center gap-3 cursor-pointer active:scale-98 transition-all">
            <BubbleIcon size="sm" variant="green">
              <GearSix size={20} weight="fill" />
            </BubbleIcon>
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground text-heading">Settings</p>
              <p className="text-xs text-muted-foreground">App preferences & notifications</p>
            </div>
          </Card>
        </div>
      </div>

      <Card 
        onClick={handleLogoutClick}
        className="p-4 rounded-xl card-shadow flex items-center gap-3 cursor-pointer active:scale-95 transition-all bg-destructive/5 border-destructive/20 animate-slide-up" 
        style={{ animationDelay: "0.4s" }}
      >
        <BubbleIcon size="sm" variant="orange">
          <SignOut size={20} weight="fill" />
        </BubbleIcon>
        <div className="flex-1">
          <p className="font-semibold text-sm text-destructive text-heading">Logout</p>
          <p className="text-xs text-muted-foreground">Sign out of your account</p>
        </div>
      </Card>
    </div>
  )
}
