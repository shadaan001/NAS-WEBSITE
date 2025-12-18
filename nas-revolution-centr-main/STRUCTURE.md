# NAS REVOLUTION CENTRE - Project Structure

## 🎨 Global Theme Setup Complete

Futuristic dark theme with neon blue + purple highlights, glassmorphism effects, and smooth animations.

---

## 📁 Project Structure

```
/src
├── /components          # Reusable UI components
│   ├── AnimatedBackground.tsx    # Canvas-based particle system + gradient
│   ├── BubbleIcon.tsx            # Circular icon containers with glass effect
│   ├── Footer.tsx                # Site footer with contact info
│   ├── GlassCard.tsx             # Glassmorphic card component
│   ├── Header.tsx                # Navigation header with mobile menu
│   ├── MainLayout.tsx            # Page layout wrapper
│   └── NeonButton.tsx            # Neon glow button variants
│
├── /pages               # Page components (currently minimal)
│   └── HomePage.tsx              # Landing page placeholder
│
├── /data                # Static data and configuration
│   └── siteConfig.ts             # Site metadata and navigation
│
├── /utils               # Utility functions
│   └── animations.ts             # Framer Motion animation variants
│
├── /styles              # Global styles
│   └── theme.css                 # Theme variables (managed via main.css)
│
├── /hooks               # Custom React hooks
│   └── use-mobile.ts             # Mobile breakpoint detection
│
├── index.css            # 🎨 GLOBAL THEME & ANIMATIONS
├── App.tsx              # Root application component
└── main.tsx             # Application entry point
```

---

## 🎨 Global Theme Features

### Color Palette (oklch values)
- **Deep Space Background**: `oklch(0.12 0.02 260)` - Rich dark base
- **Neon Blue (Primary)**: `oklch(0.65 0.25 240)` - Main brand color
- **Neon Purple (Secondary)**: `oklch(0.60 0.28 300)` - Supporting accent
- **Electric Cyan (Accent)**: `oklch(0.75 0.20 200)` - High-energy highlights

### Typography
- **Headings**: Space Grotesk (Bold, 700) - Futuristic geometric sans
- **Body**: Inter (Regular, 400-600) - Readable modern sans
- **Hierarchy**: 48px/36px/24px/16px/14px with consistent spacing

### Background System
- ✅ Animated gradient (blue → deep space → purple)
- ✅ Semi-transparent grid mesh overlay
- ✅ Floating particle canvas (30-50 particles)
- ✅ Smooth 60fps animations
- ✅ Mobile-optimized (reduced particles)

### Glassmorphism
- ✅ `.glass` - Standard glass effect with backdrop blur
- ✅ `.glass-strong` - Enhanced glass for headers/footers
- ✅ Neon border glow on hover
- ✅ Smooth transitions

### Animations
- ✅ `animate-float` - Floating motion (6s loop)
- ✅ `animate-gradient` - Background gradient shift (8s loop)
- ✅ `animate-pulse-glow` - Pulsing neon glow (2s loop)
- ✅ `animate-fade-in-up` - Component mount animation
- ✅ `animate-scale-in` - Scale entrance effect
- ✅ Respects `prefers-reduced-motion`

### Utility Classes
- ✅ `.neon-glow-blue` / `.neon-glow-purple` / `.neon-glow-cyan`
- ✅ `.neon-border-blue` / `.neon-border-purple`
- ✅ `.neon-text-blue` / `.neon-text-purple` / `.neon-text-cyan`
- ✅ `.text-gradient-blue-purple` / `.text-gradient-cyan-blue`

---

## 🧩 Reusable Components

### `<AnimatedBackground />`
Layered background system with:
- Animated gradient base
- Grid mesh pattern
- Canvas-based floating particles
- Auto-responsive to window size

**Usage:**
```tsx
<AnimatedBackground />
```

---

### `<GlassCard />`
Glassmorphic card with optional neon glow and animations.

**Props:**
- `children` - Card content
- `className` - Additional Tailwind classes
- `hover` - Enable hover scale effect (default: true)
- `glow` - Glow color: "blue" | "purple" | "cyan" | "none"
- `animate` - Enable scroll animation (default: true)

**Usage:**
```tsx
<GlassCard glow="blue" className="max-w-md">
  <h2>Card Title</h2>
  <p>Card content...</p>
</GlassCard>
```

---

### `<NeonButton />`
Button with neon glow effects and multiple variants.

**Props:**
- `variant` - "primary" | "secondary" | "accent" | "outline"
- `size` - "sm" | "md" | "lg"
- `glow` - Enable glow effect (default: true)

**Usage:**
```tsx
<NeonButton variant="primary" size="lg">
  Click Me
</NeonButton>
```

---

### `<BubbleIcon />`
Circular icon container with glass effect and animations.

**Props:**
- `children` - Icon component (Phosphor Icons recommended)
- `size` - "sm" | "md" | "lg"
- `variant` - "blue" | "purple" | "cyan" | "glass"
- `float` - Enable floating animation (default: false)

**Usage:**
```tsx
<BubbleIcon size="md" variant="blue" float>
  <Rocket weight="fill" />
</BubbleIcon>
```

---

### `<Header />`
Site header with:
- Logo + site name
- Desktop navigation menu
- Mobile hamburger menu (Sheet)
- Sticky positioning with glass effect

**Features:**
- Smooth mount animations
- Responsive breakpoints
- Active link underline effects
- Mobile menu with slide animation

---

### `<Footer />`
Site footer with:
- Site description
- Social media links (bubble icons)
- Quick links navigation
- Course listings
- Contact information
- Copyright notice

---

### `<MainLayout />`
Page wrapper that includes:
- AnimatedBackground
- Header
- Main content area
- Footer

**Usage:**
```tsx
<MainLayout>
  <YourPageContent />
</MainLayout>
```

---

## 🚀 Next Steps - Future Integration

### 🔴 TODO: Backend API Integration
**Location:** Create `/src/services/api.ts`

```typescript
// TODO: API service for backend integration
// - Course data fetching
// - Student registration
// - Contact form submissions
// - Results/testimonials data

// Example structure:
export const api = {
  getCourses: async () => { /* TODO: Implement */ },
  submitContact: async (data) => { /* TODO: Implement */ },
  registerStudent: async (data) => { /* TODO: Implement */ }
}
```

**Required:**
- Define API endpoints
- Set up axios/fetch wrapper
- Error handling
- Loading states
- Response types

---

### 🔴 TODO: SMS OTP Authentication
**Location:** Create `/src/components/OTPModal.tsx` and `/src/services/otp.ts`

```typescript
// TODO: OTP verification system
// - Phone number input with validation
// - SMS sending via backend API
// - 6-digit OTP input field
// - Resend OTP functionality
// - Verification flow

// Example integration:
// 1. User enters phone number
// 2. Backend sends OTP via SMS gateway (Twilio, MSG91, etc.)
// 3. User enters OTP
// 4. Backend verifies and creates session
```

**Required:**
- SMS gateway integration (backend)
- OTP input component with auto-focus
- Countdown timer for resend
- Error handling for invalid OTP
- Success callback for authenticated state

---

### 🔴 TODO: Payment Gateway Integration
**Location:** Create `/src/components/PaymentModal.tsx` and `/src/services/payment.ts`

```typescript
// TODO: Payment processing
// - Razorpay/Stripe integration
// - Course fee calculation
// - Payment form component
// - Success/failure handling
// - Receipt generation

// Example flow:
// 1. User selects course
// 2. Shows fee breakdown
// 3. Initiates payment gateway
// 4. Handles callback
// 5. Updates enrollment status
```

**Required:**
- Payment gateway SDK (Razorpay recommended for India)
- Secure payment form
- Transaction status tracking
- Email/SMS confirmation
- Invoice generation

---

### 🔴 TODO: Database Integration
**Location:** Backend service (Node.js/Express recommended)

```typescript
// TODO: Database models and schemas
// - Students collection
// - Courses collection
// - Enrollments collection
// - Payments collection
// - Contact inquiries collection

// Recommended: MongoDB with Mongoose or PostgreSQL with Prisma

// Example schemas:
// Student: { name, email, phone, courses[], createdAt }
// Course: { title, description, fee, duration, features[] }
// Enrollment: { studentId, courseId, paymentStatus, startDate }
```

**Required:**
- Database setup (MongoDB/PostgreSQL)
- Schema definitions
- CRUD operations
- Data validation
- Indexing for performance

---

### 🔴 TODO: Form Validation
**Location:** `/src/utils/validation.ts`

```typescript
// TODO: Form validation utilities
// - Phone number validation (Indian format)
// - Email validation
// - Required field checks
// - Custom error messages

// Use Zod (already installed) for schema validation
import { z } from "zod"

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  message: z.string().min(10, "Message must be at least 10 characters")
})
```

---

### 🔴 TODO: State Management
**Location:** Create `/src/store/` or use React Query

```typescript
// TODO: Global state management
// - User authentication state
// - Cart/selected courses
// - Form data persistence

// Options:
// 1. Spark KV for persistence (useKV hook)
// 2. React Query for server state (already installed)
// 3. Zustand for client state (need to install)

// Example with useKV:
const [user, setUser] = useKV("authenticated-user", null)
const [cart, setCart] = useKV("course-cart", [])
```

---

## 📋 Component Integration Checklist

When building new pages, use these components:

- [ ] Wrap page in `<MainLayout>`
- [ ] Use `<GlassCard>` for content sections
- [ ] Use `<NeonButton>` for CTAs
- [ ] Use `<BubbleIcon>` for feature icons
- [ ] Add Framer Motion animations from `/src/utils/animations.ts`
- [ ] Ensure mobile responsiveness (test at 768px, 1024px)
- [ ] Maintain color palette consistency
- [ ] Use Space Grotesk for headings, Inter for body
- [ ] Add TODO comments for backend integration points

---

## 🎯 Recommended Page Structure

```tsx
import MainLayout from "@/components/MainLayout"
import GlassCard from "@/components/GlassCard"
import NeonButton from "@/components/NeonButton"
import BubbleIcon from "@/components/BubbleIcon"
import { motion } from "framer-motion"

export default function PageName() {
  return (
    <MainLayout>
      <div className="container mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-20">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <GlassCard glow="blue">
            {/* Content */}
          </GlassCard>
          
          <NeonButton variant="primary" size="lg">
            Call to Action
          </NeonButton>
        </motion.section>
      </div>
    </MainLayout>
  )
}
```

---

## 🔧 Development Notes

### Available Libraries
- ✅ Framer Motion - Advanced animations
- ✅ Phosphor Icons - 6000+ icons
- ✅ Tailwind CSS v4 - Utility-first styling
- ✅ shadcn/ui - Pre-built accessible components
- ✅ React Hook Form - Form handling
- ✅ Zod - Schema validation
- ✅ date-fns - Date utilities
- ✅ Sonner - Toast notifications

### Performance Considerations
- Particle count reduced on mobile (30 vs 50)
- `prefers-reduced-motion` respected
- Lazy loading recommended for future pages
- Canvas animations use `requestAnimationFrame`
- Images should use Next.js Image (if migrating) or lazy loading

### Accessibility
- All interactive elements have 44x44px touch targets
- Color contrast meets WCAG AA standards
- Keyboard navigation supported
- Focus states visible on all interactive elements
- Mobile menu uses semantic HTML

---

## 📞 Support & Configuration

Site configuration is managed in `/src/data/siteConfig.ts`:

```typescript
export const siteConfig = {
  name: "NAS REVOLUTION CENTRE",
  tagline: "Shaping Future Leaders",
  email: "info@nasrevolution.com",
  phone: "+91 XXXXXXXXXX",
  address: "123 Education Street, City, State",
  // Update these values before deployment
}
```

---

**Project Status:** ✅ Global theme and component library complete
**Next Phase:** Build individual pages (Courses, About, Results, Contact) with TODO integration points
