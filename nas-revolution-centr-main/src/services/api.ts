import type { Course, ContactForm, Student, Enrollment, PaymentDetails } from "@/types"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"

export const api = {
  courses: {
    getAll: async (): Promise<Course[]> => {
      try {
        const response = await fetch(`${API_BASE_URL}/courses`)
        if (!response.ok) throw new Error("Failed to fetch courses")
        return await response.json()
      } catch (error) {
        console.error("Error fetching courses:", error)
        throw error
      }
    },

    getById: async (id: string): Promise<Course> => {
      try {
        const response = await fetch(`${API_BASE_URL}/courses/${id}`)
        if (!response.ok) throw new Error("Failed to fetch course")
        return await response.json()
      } catch (error) {
        console.error("Error fetching course:", error)
        throw error
      }
    },

    getByCategory: async (category: string): Promise<Course[]> => {
      try {
        const response = await fetch(`${API_BASE_URL}/courses?category=${category}`)
        if (!response.ok) throw new Error("Failed to fetch courses by category")
        return await response.json()
      } catch (error) {
        console.error("Error fetching courses by category:", error)
        throw error
      }
    }
  },

  contact: {
    submit: async (data: ContactForm): Promise<{ success: boolean; message: string }> => {
      try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error("Failed to submit contact form")
        return await response.json()
      } catch (error) {
        console.error("Error submitting contact form:", error)
        throw error
      }
    }
  },

  students: {
    register: async (data: Omit<Student, "id" | "createdAt">): Promise<Student> => {
      try {
        const response = await fetch(`${API_BASE_URL}/students/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error("Failed to register student")
        return await response.json()
      } catch (error) {
        console.error("Error registering student:", error)
        throw error
      }
    },

    getById: async (id: string): Promise<Student> => {
      try {
        const response = await fetch(`${API_BASE_URL}/students/${id}`)
        if (!response.ok) throw new Error("Failed to fetch student")
        return await response.json()
      } catch (error) {
        console.error("Error fetching student:", error)
        throw error
      }
    }
  },

  enrollment: {
    create: async (data: Omit<Enrollment, "id" | "enrollmentDate">): Promise<Enrollment> => {
      try {
        const response = await fetch(`${API_BASE_URL}/enrollments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })
        if (!response.ok) throw new Error("Failed to create enrollment")
        return await response.json()
      } catch (error) {
        console.error("Error creating enrollment:", error)
        throw error
      }
    },

    getByStudentId: async (studentId: string): Promise<Enrollment[]> => {
      try {
        const response = await fetch(`${API_BASE_URL}/enrollments/student/${studentId}`)
        if (!response.ok) throw new Error("Failed to fetch enrollments")
        return await response.json()
      } catch (error) {
        console.error("Error fetching enrollments:", error)
        throw error
      }
    }
  }
}
