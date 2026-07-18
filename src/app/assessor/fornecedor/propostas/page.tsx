import { ProposalsClient } from '@/features/fornecedor'
import { AdvisorSupplierShell } from '@/features/assessor'

export default function Page() {
  return (
    <AdvisorSupplierShell>
      <ProposalsClient />
    </AdvisorSupplierShell>
  )
}
