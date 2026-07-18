import { WalletClient } from '@/features/fornecedor'
import { AdvisorSupplierShell } from '@/features/assessor'

export default function Page() {
  return (
    <AdvisorSupplierShell>
      <WalletClient />
    </AdvisorSupplierShell>
  )
}
