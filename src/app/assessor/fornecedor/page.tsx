import { SupplierDashboard } from '@/features/fornecedor'
import { AdvisorSupplierShell } from '@/features/assessor'

export default function Page() {
  return (
    <AdvisorSupplierShell>
      <SupplierDashboard />
    </AdvisorSupplierShell>
  )
}
