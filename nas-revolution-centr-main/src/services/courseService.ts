import { Course } from "@/types"

const COURSES_KEY = "courses"

export const CourseService = {
  getAllCourses(): Course[] {
    try {
      const courses = localStorage.getItem(COURSES_KEY)
      return courses ? JSON.parse(courses) : []
    } catch (error) {
      console.error("Error loading courses:", error)
      return []
    }
  },

  getCourseById(id: string): Course | undefined {
    const courses = this.getAllCourses()
    return courses.find((course) => course.id === id)
  },

  saveCourse(course: Course): void {
    try {
      const courses = this.getAllCourses()
      const existingIndex = courses.findIndex((c) => c.id === course.id)

      if (existingIndex !== -1) {
        courses[existingIndex] = course
      } else {
        courses.push(course)
      }

      localStorage.setItem(COURSES_KEY, JSON.stringify(courses))
    } catch (error) {
      console.error("Error saving course:", error)
      throw new Error("Failed to save course")
    }
  },

  getActiveCourses(): Course[] {
    return this.getAllCourses().filter((course) => course.isActive)
  },

  getCourseSubjects(courseId: string): string[] {
    const course = this.getCourseById(courseId)
    return course?.subjects || []
  },
}
