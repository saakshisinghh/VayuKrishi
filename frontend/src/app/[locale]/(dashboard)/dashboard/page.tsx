import { DashboardGrid } from '@/features/dashboard/components/dashboard-grid'
import { DashboardHeader } from '@/features/dashboard/components/dashboard-header'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] overflow-x-hidden">
      <div className="w-full px-10 py-8 space-y-6">
        <DashboardHeader />
        <DashboardGrid />
      </div>
    </div>
  )
}