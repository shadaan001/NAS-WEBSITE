import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlass, ArrowsDownUp, X, Check, BookOpen, GraduationCap } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'

const DEFAULT_COURSES = [
  { id: 1, className: 'Class 1', price: 1000, desc: 'Math + English + EVS + Hindi + Drawing' },
  { id: 2, className: 'Class 2', price: 1000, desc: 'Math + English + EVS + Hindi + Drawing' },
  { id: 3, className: 'Class 3', price: 1000, desc: 'Math + Science + English + Hindi + Social Studies' },
  { id: 4, className: 'Class 4', price: 1000, desc: 'Math + Science + English + Hindi + Social Studies' },
  { id: 5, className: 'Class 5', price: 1000, desc: 'Math + Science + English + Hindi + Bengali + Social Studies' },
  { id: 6, className: 'Class 6', price: 1200, desc: 'Math + Science + English + Hindi + Bengali + Social Studies + Computer' },
  { id: 7, className: 'Class 7', price: 1200, desc: 'Math + Science + English + Hindi + Bengali + Social Studies + Computer' },
  { id: 8, className: 'Class 8', price: 1200, desc: 'Math + Science + English + Hindi + Bengali + Social Studies + Computer' },
  { id: 9, className: 'Class 9', price: 1600, desc: 'Math + Science + English + Hindi + Social Studies + Computer' },
  { id: 10, className: 'Class 10', price: 1600, desc: 'Math + Science + English + Hindi + Social Studies + Computer' },
  { id: 11, className: 'Class 11 (Math+Physics)', price: 1500, desc: 'Mathematics + Physics (Science stream)' },
  { id: 12, className: 'Class 12 (Math+Physics)', price: 1500, desc: 'Mathematics + Physics (Science stream)' }
]

const CoursesComponentClass610 = () => {
  const [courses, setCourses] = useKV('nas_courses_v1', DEFAULT_COURSES)
  const [receipts, setReceipts] = useKV('nas_receipts_v1', [])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('low-to-high')
  const [enrollModalOpen, setEnrollModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [formErrors, setFormErrors] = useState({ name: '', phone: '' })

  useEffect(() => {
    filterAndSortCourses()
  }, [courses, searchQuery, sortOrder])

  const filterAndSortCourses = () => {
    let result = [...courses]

    if (searchQuery) {
      result = result.filter(course =>
        course.className.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    result.sort((a, b) => {
      if (sortOrder === 'low-to-high') {
        if (a.price === b.price) {
          return a.id - b.id
        }
        return a.price - b.price
      } else {
        if (a.price === b.price) {
          return a.id - b.id
        }
        return b.price - a.price
      }
    })

    setFilteredCourses(result)
  }

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'low-to-high' ? 'high-to-low' : 'low-to-high')
  }

  const handleEnrollClick = (course) => {
    setSelectedCourse(course)
    setEnrollModalOpen(true)
    setFormData({ name: '', phone: '' })
    setFormErrors({ name: '', phone: '' })
  }

  const handleDetailsClick = (course) => {
    setSelectedCourse(course)
    setDetailsModalOpen(true)
  }

  const validateForm = () => {
    const errors = { name: '', phone: '' }
    let isValid = true

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
      isValid = false
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required'
      isValid = false
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      errors.phone = 'Phone must be exactly 10 digits'
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleEnrollSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const receipt = {
      id: Date.now(),
      courseName: selectedCourse.className,
      coursePrice: selectedCourse.price,
      studentName: formData.name,
      studentPhone: formData.phone,
      enrolledAt: new Date().toISOString(),
      status: 'Enrolled'
    }

    setReceipts((currentReceipts) => [...currentReceipts, receipt])

    toast.success(`Successfully enrolled in ${selectedCourse.className}!`, {
      description: `Welcome, ${formData.name}! We'll contact you soon.`
    })

    setEnrollModalOpen(false)
    setFormData({ name: '', phone: '' })
    setSelectedCourse(null)
  }

  return (
    <div className="min-h-screen relative overflow-hidden pt-20">
      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Our Courses
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Comprehensive learning programs for Classes 1-12 with expert guidance
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto"
        >
          <div className="flex-1 relative">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20 h-12 backdrop-blur-sm"
            />
          </div>

          <Button
            onClick={toggleSortOrder}
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white h-12 backdrop-blur-sm min-w-[160px]"
          >
            <ArrowsDownUp className="mr-2" size={20} />
            {sortOrder === 'low-to-high' ? 'Low → High' : 'High → Low'}
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col shadow-2xl group-hover:border-blue-400/50 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <GraduationCap size={28} weight="duotone" className="text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">₹{course.price}</div>
                      <div className="text-xs text-gray-400">per month</div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{course.className}</h3>
                  <p className="text-gray-300 text-sm mb-6 flex-1">{course.desc}</p>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleEnrollClick(course)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 h-11 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
                    >
                      Enroll Now
                    </Button>
                    <Button
                      onClick={() => handleDetailsClick(course)}
                      variant="outline"
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white h-11 backdrop-blur-sm"
                    >
                      <BookOpen size={20} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlass size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-400 text-lg">No courses found matching your search</p>
          </motion.div>
        )}
      </div>

      <Dialog open={enrollModalOpen} onOpenChange={setEnrollModalOpen}>
        <DialogContent className="bg-[#1a1f3a] border-white/10 text-white max-w-md backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Enroll in {selectedCourse?.className}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Fill in your details to complete enrollment. We'll contact you soon!
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEnrollSubmit} className="space-y-6 mt-4">
            <div>
              <Label htmlFor="name" className="text-white mb-2 block">
                Full Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20 h-11"
              />
              {formErrors.name && (
                <p className="text-red-400 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="text-white mb-2 block">
                Phone Number *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                placeholder="10-digit mobile number"
                maxLength={10}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20 h-11"
              />
              {formErrors.phone && (
                <p className="text-red-400 text-sm mt-1">{formErrors.phone}</p>
              )}
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Course Fee:</span>
                <span className="text-2xl font-bold text-white">₹{selectedCourse?.price}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEnrollModalOpen(false)}
                className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white h-11"
              >
                <X className="mr-2" size={18} />
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 h-11 font-semibold shadow-lg shadow-blue-500/30"
              >
                <Check className="mr-2" size={18} />
                Confirm
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="bg-[#1a1f3a] border-white/10 text-white max-w-md backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {selectedCourse?.className} Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="font-semibold text-white mb-2">Course Fee</h4>
              <p className="text-3xl font-bold text-blue-400">₹{selectedCourse?.price}/month</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="font-semibold text-white mb-2">What's Included</h4>
              <p className="text-gray-300">{selectedCourse?.desc}</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="font-semibold text-white mb-3">Key Features</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 text-green-400 flex-shrink-0" size={16} />
                  <span>Expert teachers for each subject</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 text-green-400 flex-shrink-0" size={16} />
                  <span>Weekly tests and assessments</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 text-green-400 flex-shrink-0" size={16} />
                  <span>Homework tracking and support</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 mt-0.5 text-green-400 flex-shrink-0" size={16} />
                  <span>Progress monitoring and reports</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => {
                setDetailsModalOpen(false)
                handleEnrollClick(selectedCourse)
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 h-11 font-semibold shadow-lg shadow-blue-500/30"
            >
              Enroll Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CoursesComponentClass610
