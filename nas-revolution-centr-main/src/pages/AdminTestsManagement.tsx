import AdminTests from "./Admin/Tests"

interface AdminTestsManagementProps {
  adminId?: string
  onBack?: () => void
}

export default function AdminTestsManagement({ adminId, onBack }: AdminTestsManagementProps) {
  return <AdminTests adminId={adminId || "admin-001"} onBack={onBack} />
}
