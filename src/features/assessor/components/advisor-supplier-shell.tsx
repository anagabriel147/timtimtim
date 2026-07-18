'use client'

import type { ReactNode } from 'react'

import { SupplierChromeProvider } from '@/features/fornecedor'
import { AdvisorSupplierFooter, AdvisorSupplierTopbar } from './advisor-supplier-chrome'

/**
 * Wraps any supplier feature component so it renders with the advisor's
 * navigation chrome instead of the default supplier chrome. No supplier
 * component is modified — the swap happens through SupplierChromeProvider.
 * The active tab is taken from whatever the supplier component declares.
 */
export function AdvisorSupplierShell({ children }: { children: ReactNode }) {
  return (
    <SupplierChromeProvider
      chrome={{
        renderTopbar: ({ active, onUnavailable }) => (
          <AdvisorSupplierTopbar active={active} onUnavailable={onUnavailable} />
        ),
        renderFooter: () => <AdvisorSupplierFooter />,
      }}
    >
      {children}
    </SupplierChromeProvider>
  )
}
