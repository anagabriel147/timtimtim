import { AdvisorSupplierShell } from '@/features/assessor'
import { DisputesClient } from '@/features/fornecedor'

export default function Page() {
  return (
    <AdvisorSupplierShell>
      <DisputesClient />
    </AdvisorSupplierShell>
  )
}
