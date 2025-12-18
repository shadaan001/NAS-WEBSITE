import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, BookOpen, Trophy, TrendUp, Funnel } from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StudentProgressCharts } from "@/components/StudentProgressCharts"
import { useLocalDB } from "@/lib/useLocalDB"
import { cn } from "@/lib/utils"

interface ProgressPageProps {
  studentId: string
}

export default function StudentProgress({ studentId }: ProgressPageProps) {
  const [testResults, setTestResults] = useState<any[]>([])
  const [progressData, setProgressData] = useState<any>(null)
  const [selectedSubject, setSelectedSubject] = useState("All Subjects")
  const [filteredResults, setFilteredResults] = useState<any[]>([])
  const [subjects, setSubjects] = useState<string[]>([])

  useEffect(() => {
    loadProgressData()
  }, [studentId])

  useEffect(() => {
    filterResults()
  }, [testResults, selectedSubject])

  const loadProgressData = () => {
    const results = useLocalDB.getStudentTestResults(studentId)
    const progress = useLocalDB.getStudentProgress(studentId)
    
    setTestResults(results)
    setProgressData(progress)

    const uniqueSubjects = Array.from(new Set(results.map((r: any) => r.subject)))
    setSubjects(["All Subjects", ...uniqueSubjects])
  }

  const filterResults = () => {
    let filtered = [...testResults]

    if (selectedSubject !== "All Subjects") {
      filtered = filtered.filter(r => r.subject === selectedSubject)
    }

    filtered.sort((a, b) => b.date.localeCompare(a.date))
    setFilteredResults(filtered)
  }

  const getGradeColor = (grade: string) => {
    if (grade === "A+" || grade === "A") return "text-primary"
    if (grade === "B+" || grade === "B") return "text-secondary"
    if (grade === "C") return "text-accent"
    return "text-muted-foreground"
  }

  const getGradeBg = (grade: string) => {
    if (grade === "A+" || grade === "A") return "bg-primary/10 border-primary/30"
    if (grade === "B+" || grade === "B") return "bg-secondary/10 border-secondary/30"
    if (grade === "C") return "bg-accent/10 border-accent/30"
    return "bg-muted/10 border-border/30"
  }

  if (!progressData) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <p className="text-muted-foreground">Loading progress data...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 pb-24">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-heading text-4xl font-bold text-primary mb-2">My Progress</h1>
          <p className="text-muted-foreground">Track your academic performance and growth</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="p-6 border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/20">
                <Trophy size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Average</p>
                <p className="text-3xl font-bold text-heading text-primary">
                  {progressData.overall.average}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 border-secondary/30 bg-gradient-to-br from-secondary/10 to-transparent">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-secondary/20">
                <BookOpen size={24} className="text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tests</p>
                <p className="text-3xl font-bold text-heading text-secondary">
                  {progressData.overall.totalTests}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 border-accent/30 bg-gradient-to-br from-accent/10 to-transparent">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/20">
                <TrendUp size={24} className="text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Best Subject</p>
                <p className="text-lg font-bold text-heading text-accent">
                  {progressData.bySubject.length > 0
                    ? progressData.bySubject[0].subject.substring(0, 10)
                    : "N/A"}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 border-border/30 bg-gradient-to-br from-muted/20 to-transparent">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-muted/40">
                <Calendar size={24} className="text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Test</p>
                <p className="text-sm font-semibold text-foreground">
                  {progressData.recentTests.length > 0
                    ? new Date(progressData.recentTests[0].date).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StudentProgressCharts tests={testResults} compareClassAvg={true} studentId={studentId} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-heading text-2xl font-bold text-foreground">Test History</h2>
            
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48">
                <Funnel size={16} className="mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredResults.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">No tests found for the selected filters</p>
                </Card>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {filteredResults.map((test, index) => (
                  <motion.div
                    key={test.testId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-5 border-2 border-border/40 bg-card/80 backdrop-blur-sm hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-heading font-semibold text-lg text-foreground">
                              {test.title}
                            </h3>
                            <Badge className={cn("font-semibold", getGradeBg(test.grade))}>
                              <span className={getGradeColor(test.grade)}>{test.grade}</span>
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground text-xs">Subject</p>
                              <p className="font-medium text-foreground">{test.subject}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Date</p>
                              <p className="font-medium text-foreground">
                                {new Date(test.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Marks</p>
                              <p className="font-medium text-foreground">
                                {test.marksObtained} / {test.maxMarks}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Percentage</p>
                              <p className="font-bold text-primary">{test.percentage}%</p>
                            </div>
                          </div>

                          {test.comments && (
                            <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                              <p className="text-xs text-muted-foreground mb-1">Teacher's Feedback</p>
                              <p className="text-sm text-foreground italic">{test.comments}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
