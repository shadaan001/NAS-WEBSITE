// Student Login - redirects to OTP Login by default
// This component exists for consistency with the routing structure

import OTPLogin from "./OTPLogin"

export default function StudentLogin({ onLogin, onBackToHome }) {
  return <OTPLogin onLogin={onLogin} onBackToHome={onBackToHome} />
}

// Note: Students use OTP-based authentication exclusively
// For fallback (offline/demo), name + mobile is available in OTPLogin
