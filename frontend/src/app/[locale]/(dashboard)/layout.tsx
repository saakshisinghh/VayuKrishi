import { DashboardGrid } from '@/features/dashboard/components/dashboard-grid'
import { DashboardHeader } from '@/features/dashboard/components/dashboard-header'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 lg:px-14 py-8 space-y-6">
        <DashboardHeader />
        <DashboardGrid />
      </div>
    </div>
  )
}