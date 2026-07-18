import { AdvisorSupplierShell } from '@/features/assessor'
import { ProposalsClient } from '@/features/fornecedor'

export default function Page() {
  return (
    <AdvisorSupplierShell>
      <ProposalsClient />
    </AdvisorSupplierShell>
  )
}
