import { seedTeachers } from "@/data/mockSeed"

export async function seedDemoCredentials() {
  console.log("Demo credential seeding disabled")
}

export async function seedDemoStudents() {
  console.log("Demo student seeding disabled")
}

export async function ensureTeacherData() {
  try {
    const teachers = await window.spark.kv.get("admin-teachers-records")
    
    if (!teachers || !Array.isArray(teachers) || teachers.length === 0) {
      await window.spark.kv.set("admin-teachers-records", seedTeachers)
      console.log("Initialized teacher data in KV store")
    }
  } catch (error) {
    console.error("Error ensuring teacher data:", error)
  }
}

export async function seedDemoCourses() {
  try {
    const existingCourses = localStorage.getItem("courses")
    
    if (existingCourses && JSON.parse(existingCourses).length > 0) {
      console.log("Demo courses already exist")
      return
    }

    console.log("Seeding demo courses...")
    
    const demoCourses = [
      {
        id: "course_class6",
        title: "Class 6",
        description: "Foundation course for Class 6 students",
        duration: "1 Year",
        batchSize: 30,
        fee: 15000,
        features: ["Comprehensive curriculum", "Regular assessments", "Doubt clearing sessions"],
        startDate: "2024-04-01",
        category: "Foundation" as const,
        isActive: true,
        subjects: ["Mathematics", "Science", "English", "Hindi", "Social Studies"],
        grade: "6"
      },
      {
        id: "course_class7",
        title: "Class 7",
        description: "Foundation course for Class 7 students",
        duration: "1 Year",
        batchSize: 30,
        fee: 16000,
        features: ["Comprehensive curriculum", "Regular assessments", "Doubt clearing sessions"],
        startDate: "2024-04-01",
        category: "Foundation" as const,
        isActive: true,
        subjects: ["Mathematics", "Science", "English", "Hindi", "Social Studies"],
        grade: "7"
      },
      {
        id: "course_class8",
        title: "Class 8",
        description: "Foundation course for Class 8 students",
        duration: "1 Year",
        batchSize: 30,
        fee: 17000,
        features: ["Comprehensive curriculum", "Regular assessments", "Doubt clearing sessions"],
        startDate: "2024-04-01",
        category: "Foundation" as const,
        isActive: true,
        subjects: ["Mathematics", "Science", "English", "Hindi", "Social Studies", "Geography"],
        grade: "8"
      },
      {
        id: "course_class9",
        title: "Class 9",
        description: "Board preparation course for Class 9",
        duration: "1 Year",
        batchSize: 25,
        fee: 18000,
        features: ["Board exam preparation", "Regular tests", "Study materials"],
        startDate: "2024-04-01",
        category: "Board" as const,
        isActive: true,
        subjects: ["Mathematics", "Science", "English", "Hindi", "Social Studies"],
        grade: "9"
      },
      {
        id: "course_class10",
        title: "Class 10",
        description: "Board exam preparation for Class 10",
        duration: "1 Year",
        batchSize: 25,
        fee: 20000,
        features: ["Board exam focused", "Mock tests", "Personal mentoring"],
        startDate: "2024-04-01",
        category: "Board" as const,
        isActive: true,
        subjects: ["Mathematics", "Science", "English", "Hindi", "Social Studies"],
        grade: "10"
      },
      {
        id: "course_class11_science",
        title: "Class 11 Science",
        description: "Science stream for Class 11 with PCM/PCB",
        duration: "1 Year",
        batchSize: 20,
        fee: 25000,
        features: ["PCM/PCB streams", "JEE/NEET foundation", "Practical sessions"],
        startDate: "2024-06-01",
        category: "Board" as const,
        isActive: true,
        subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "English"],
        grade: "11"
      },
      {
        id: "course_class12_science",
        title: "Class 12 Science",
        description: "Board + competitive exam preparation",
        duration: "1 Year",
        batchSize: 20,
        fee: 30000,
        features: ["Board + JEE/NEET", "Intensive coaching", "Career guidance"],
        startDate: "2024-06-01",
        category: "Board" as const,
        isActive: true,
        subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "English"],
        grade: "12"
      },
      {
        id: "course_jee",
        title: "JEE Batch",
        description: "Specialized coaching for JEE Main & Advanced",
        duration: "2 Years",
        batchSize: 15,
        fee: 50000,
        features: ["Expert faculty", "Mock tests", "Previous year papers", "Doubt sessions"],
        startDate: "2024-06-01",
        category: "JEE" as const,
        isActive: true,
        subjects: ["Physics", "Chemistry", "Mathematics"],
        grade: "JEE"
      },
      {
        id: "course_neet",
        title: "NEET Batch",
        description: "Complete NEET preparation program",
        duration: "2 Years",
        batchSize: 15,
        fee: 50000,
        features: ["Expert faculty", "Regular testing", "Biology focus", "Medical entrance prep"],
        startDate: "2024-06-01",
        category: "NEET" as const,
        isActive: true,
        subjects: ["Physics", "Chemistry", "Biology"],
        grade: "NEET"
      },
      {
        id: "course_spoken_english",
        title: "Spoken English",
        description: "Improve English speaking and communication skills",
        duration: "6 Months",
        batchSize: 20,
        fee: 8000,
        features: ["Conversation practice", "Grammar basics", "Public speaking"],
        startDate: "2024-01-15",
        category: "Other" as const,
        isActive: true,
        subjects: ["Grammar", "Vocabulary", "Pronunciation", "Conversation"],
        grade: "All Ages"
      },
      {
        id: "course_computer",
        title: "Computer Course",
        description: "Basic to advanced computer skills",
        duration: "6 Months",
        batchSize: 15,
        fee: 10000,
        features: ["MS Office", "Internet basics", "Coding introduction"],
        startDate: "2024-01-15",
        category: "Other" as const,
        isActive: true,
        subjects: ["MS Office", "Internet", "Programming Basics", "Typing"],
        grade: "All Ages"
      }
    ]

    localStorage.setItem("courses", JSON.stringify(demoCourses))
    console.log("Demo courses seeded successfully!")
  } catch (error) {
    console.error("Error seeding demo courses:", error)
  }
}

