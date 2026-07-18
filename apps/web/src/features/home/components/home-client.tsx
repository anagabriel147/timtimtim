'use client'

import { useState } from 'react'

import { CtaSection } from './cta-section'
import { FeaturedVendors } from './featured-vendors'
import { HeroSection } from './hero-section'
import { HomeFooter } from './home-footer'
import { HowItWorks } from './how-it-works'
import { QuickAccessModal } from './quick-access-modal'
import { SiteNav } from './site-nav'
import { Testimonials } from './testimonials'

export function HomeClient() {
  const [modalOpen, setModalOpen] = useState(false)

  const openModal = () => setModalOpen(true)
  const closeModal = () => setModalOpen(false)

  return (
    <div id="top" className="flex min-h-svh flex-col">
      <SiteNav onLogin={openModal} onCreateEvent={openModal} />

      <main className="flex-1">
        <HeroSection onSearch={openModal} />
        <FeaturedVendors />
        <HowItWorks />
        <Testimonials />
        <CtaSection onCreateEvent={openModal} onExplore={closeModal} />
      </main>

      <HomeFooter />

      <QuickAccessModal open={modalOpen} onClose={closeModal} />
    </div>
  )
}
