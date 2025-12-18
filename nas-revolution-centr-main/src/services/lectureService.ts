import { Lecture, LectureFilter } from "@/types"

const LECTURES_KEY = "lectures"

export const LectureService = {
  getAllLectures(): Lecture[] {
    try {
      const lectures = localStorage.getItem(LECTURES_KEY)
      return lectures ? JSON.parse(lectures) : []
    } catch (error) {
      console.error("Error loading lectures:", error)
      return []
    }
  },

  getLectureById(id: string): Lecture | undefined {
    const lectures = this.getAllLectures()
    return lectures.find((lecture) => lecture.id === id)
  },

  getLecturesByCourse(courseId: string): Lecture[] {
    const lectures = this.getAllLectures()
    return lectures.filter((lecture) => lecture.courseId === courseId)
  },

  getLecturesBySubject(courseId: string, subject: string): Lecture[] {
    const lectures = this.getAllLectures()
    return lectures.filter(
      (lecture) => lecture.courseId === courseId && lecture.subject === subject
    )
  },

  getLecturesByTeacher(teacherId: string): Lecture[] {
    const lectures = this.getAllLectures()
    return lectures.filter((lecture) => lecture.teacherId === teacherId)
  },

  filterLectures(filters: LectureFilter): Lecture[] {
    let lectures = this.getAllLectures()

    if (filters.courseId) {
      lectures = lectures.filter((lecture) => lecture.courseId === filters.courseId)
    }

    if (filters.subject) {
      lectures = lectures.filter((lecture) => lecture.subject === filters.subject)
    }

    if (filters.teacherId) {
      lectures = lectures.filter((lecture) => lecture.teacherId === filters.teacherId)
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      lectures = lectures.filter(
        (lecture) =>
          lecture.title.toLowerCase().includes(query) ||
          lecture.description.toLowerCase().includes(query) ||
          lecture.subject.toLowerCase().includes(query)
      )
    }

    return lectures
  },

  saveLecture(lecture: Lecture): void {
    try {
      const lectures = this.getAllLectures()
      const existingIndex = lectures.findIndex((l) => l.id === lecture.id)

      if (existingIndex !== -1) {
        lectures[existingIndex] = lecture
      } else {
        lectures.push(lecture)
      }

      localStorage.setItem(LECTURES_KEY, JSON.stringify(lectures))
    } catch (error) {
      console.error("Error saving lecture:", error)
      throw new Error("Failed to save lecture")
    }
  },

  deleteLecture(id: string): void {
    try {
      const lectures = this.getAllLectures()
      const filtered = lectures.filter((lecture) => lecture.id !== id)
      localStorage.setItem(LECTURES_KEY, JSON.stringify(filtered))
    } catch (error) {
      console.error("Error deleting lecture:", error)
      throw new Error("Failed to delete lecture")
    }
  },

  updateLecture(id: string, updates: Partial<Lecture>): void {
    try {
      const lectures = this.getAllLectures()
      const index = lectures.findIndex((lecture) => lecture.id === id)

      if (index === -1) {
        throw new Error("Lecture not found")
      }

      lectures[index] = { ...lectures[index], ...updates }
      localStorage.setItem(LECTURES_KEY, JSON.stringify(lectures))
    } catch (error) {
      console.error("Error updating lecture:", error)
      throw new Error("Failed to update lecture")
    }
  },

  incrementViews(id: string): void {
    try {
      const lecture = this.getLectureById(id)
      if (lecture) {
        this.updateLecture(id, { views: (lecture.views || 0) + 1 })
      }
    } catch (error) {
      console.error("Error incrementing views:", error)
    }
  },

  exportToCSV(): string {
    const lectures = this.getAllLectures()
    const headers = [
      "ID",
      "Course",
      "Subject",
      "Title",
      "Description",
      "Teacher",
      "Upload Date",
      "Views",
    ]
    
    const rows = lectures.map((lecture) => [
      lecture.id,
      lecture.courseName,
      lecture.subject,
      lecture.title,
      lecture.description,
      lecture.teacherName,
      lecture.uploadDate,
      lecture.views || 0,
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n")

    return csvContent
  },
}
