import { AdvisorSupplierShell } from '@/features/assessor'
import { WalletClient } from '@/features/fornecedor'

export default function Page() {
  return (
    <AdvisorSupplierShell>
      <WalletClient />
    </AdvisorSupplierShell>
  )
}
