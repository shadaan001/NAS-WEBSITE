import { useState } from "react"
import { BookOpen, Notebook, Users, CalendarBlank } from "@phosphor-icons/react"
import BubbleIcon from "@/components/school/BubbleIcon"
import StatusBadge from "@/components/school/StatusBadge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { homeworkData, classworkData, activitiesData } from "@/data/mockData"

export default function HomeworkPage() {
  const [selectedHomework, setSelectedHomework] = useState<string | null>(null)
  const [selectedClasswork, setSelectedClasswork] = useState<string | null>(null)

  return (
    <div className="pb-20 px-4 pt-16 space-y-5 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <BubbleIcon size="md" variant="orange">
          <BookOpen size={28} weight="fill" />
        </BubbleIcon>
        <div>
          <h1 className="text-2xl font-bold text-heading text-foreground">Academic Work</h1>
          <p className="text-sm text-muted-foreground">Homework, classwork & activities</p>
        </div>
      </div>

      <Tabs defaultValue="homework" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="homework" className="text-xs">Homework</TabsTrigger>
          <TabsTrigger value="classwork" className="text-xs">Classwork</TabsTrigger>
          <TabsTrigger value="activities" className="text-xs">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="homework" className="space-y-3 mt-0 animate-fade-in">
          {homeworkData.map((hw) => {
            const isSelected = selectedHomework === hw.id
            const daysUntilDue = Math.ceil(
              (new Date(hw.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            )

            return (
              <Card
                key={hw.id}
                className={`p-4 rounded-xl card-shadow transition-all cursor-pointer active:scale-98 ${
                  isSelected ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedHomework(isSelected ? null : hw.id)}
              >
                <div className="flex items-start gap-3">
                  <BubbleIcon
                    size="sm"
                    variant={hw.status === "completed" ? "green" : hw.priority === "high" ? "orange" : "blue"}
                  >
                    <BookOpen size={20} weight="fill" />
                  </BubbleIcon>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-sm text-foreground text-heading">{hw.subject}</h3>
                      <StatusBadge status={hw.status as "pending" | "completed"} />
                    </div>
                    <p className="text-sm text-foreground font-medium mb-1">{hw.title}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        Assigned: {new Date(hw.assignedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                      <span className={daysUntilDue <= 2 && hw.status === "pending" ? "text-accent font-semibold" : ""}>
                        Due: {new Date(hw.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    {hw.priority && (
                      <div className="mt-2">
                        <StatusBadge status={hw.priority as "high" | "medium" | "low"} />
                      </div>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Description:</p>
                    <p className="text-sm text-foreground">{hw.description}</p>
                    {hw.status === "pending" && (
                      <button className="mt-3 w-full py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm active:scale-95 transition-transform">
                        Mark as Completed
                      </button>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="classwork" className="space-y-3 mt-0 animate-fade-in">
          {classworkData.map((cw) => {
            const isSelected = selectedClasswork === cw.id

            return (
              <Card
                key={cw.id}
                className={`p-4 rounded-xl card-shadow transition-all cursor-pointer active:scale-98 ${
                  isSelected ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedClasswork(isSelected ? null : cw.id)}
              >
                <div className="flex items-start gap-3">
                  <BubbleIcon size="sm" variant={cw.status === "completed" ? "green" : "purple"}>
                    <Notebook size={20} weight="fill" />
                  </BubbleIcon>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-sm text-foreground text-heading">{cw.subject}</h3>
                      <StatusBadge status={cw.status as "pending" | "completed"} />
                    </div>
                    <p className="text-sm text-foreground font-medium mb-1">{cw.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(cw.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Description:</p>
                    <p className="text-sm text-foreground">{cw.description}</p>
                  </div>
                )}
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="activities" className="space-y-3 mt-0 animate-fade-in">
          {activitiesData.map((activity) => {
            const activityDate = new Date(activity.date)
            const isPast = activityDate < new Date()

            return (
              <Card key={activity.id} className="p-4 rounded-xl card-shadow">
                <div className="flex items-start gap-3">
                  <BubbleIcon
                    size="sm"
                    variant={activity.type === "sports" ? "green" : activity.type === "academic" ? "blue" : "purple"}
                  >
                    {activity.type === "sports" ? (
                      <Users size={20} weight="fill" />
                    ) : activity.type === "academic" ? (
                      <BookOpen size={20} weight="fill" />
                    ) : (
                      <CalendarBlank size={20} weight="fill" />
                    )}
                  </BubbleIcon>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-foreground text-heading mb-1">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <CalendarBlank size={14} className="text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {activityDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} • {activity.time}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        📍 {activity.venue}
                      </div>
                    </div>
                    {isPast && (
                      <div className="mt-2">
                        <StatusBadge status="completed" label="Completed" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}
