'use client'

import { createContext, useContext, type ReactNode } from 'react'

import type { SupplierNavItem } from '../data/supplier-data'

export type SupplierChrome = {
  // Optional replacements for the shared topbar/footer.
  // When provided (e.g. inside the advisor area), these render instead of the
  // default supplier chrome. When absent, SupplierTopbar/SupplierFooter behave
  // exactly as before.
  renderTopbar?: (args: {
    active: SupplierNavItem
    onUnavailable?: (label: string) => void
  }) => ReactNode
  renderFooter?: () => ReactNode
}

const SupplierChromeContext = createContext<SupplierChrome | null>(null)

export function SupplierChromeProvider({
  chrome,
  children,
}: {
  chrome: SupplierChrome
  children: ReactNode
}) {
  return <SupplierChromeContext.Provider value={chrome}>{children}</SupplierChromeContext.Provider>
}

export function useSupplierChrome() {
  return useContext(SupplierChromeContext)
}
