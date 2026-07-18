import { AdvisorSupplierShell } from '@/features/assessor'
import { SupplierContractsClient } from '@/features/fornecedor'

export default function Page() {
  return (
    <AdvisorSupplierShell>
      <SupplierContractsClient />
    </AdvisorSupplierShell>
  )
}
