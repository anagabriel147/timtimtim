'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EVENT_TYPES } from '../../data/wizard-data'
import { PublishedScreen } from './published-screen'
import { StepOne } from './step-one'
import { StepThree } from './step-three'
import { StepTwo } from './step-two'
import { WizardFooter } from './wizard-footer'
import { WizardHeader } from './wizard-header'

export function EventWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [published, setPublished] = useState(false)

  // Step 1 — O Grande Dia
  const [eventType, setEventType] = useState('casamento')
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [guests, setGuests] = useState(100)
  const [notes, setNotes] = useState('')

  // Step 2 — Localização
  const [country, setCountry] = useState('Portugal')
  const [district, setDistrict] = useState('Lisboa')
  const [city, setCity] = useState('Lisboa')
  const [venueName, setVenueName] = useState('')
  const [address, setAddress] = useState('')
  const [venueStatus, setVenueStatus] = useState('confirmado')

  // Step 3 — Serviços
  const [services, setServices] = useState<string[]>([])
  const [observations, setObservations] = useState('')

  const eventLabel = EVENT_TYPES.find((t) => t.id === eventType)?.label ?? 'Casamento'
  const displayName = name.trim() || `${eventLabel} da Ana & Pedro`
  const locationLabel = `${city || district}, ${country}`

  function toggleService(id: string) {
    setServices((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  function cancel() {
    router.push('/cliente')
  }

  if (published) {
    return <PublishedScreen displayName={displayName} onBack={() => router.push('/cliente')} />
  }

  return (
    <div className="flex min-h-svh flex-col">
      <WizardHeader currentStep={step} />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        {step === 1 && (
          <StepOne
            eventType={eventType}
            setEventType={setEventType}
            name={name}
            setName={setName}
            date={date}
            setDate={setDate}
            guests={guests}
            setGuests={setGuests}
            notes={notes}
            setNotes={setNotes}
            onCancel={cancel}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepTwo
            eventName={displayName}
            country={country}
            setCountry={setCountry}
            district={district}
            setDistrict={setDistrict}
            city={city}
            setCity={setCity}
            venueName={venueName}
            setVenueName={setVenueName}
            address={address}
            setAddress={setAddress}
            venueStatus={venueStatus}
            setVenueStatus={setVenueStatus}
            onBack={() => setStep(1)}
            onCancel={cancel}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <StepThree
            eventName={displayName}
            location={locationLabel}
            eventLabel={eventLabel}
            services={services}
            toggleService={toggleService}
            observations={observations}
            setObservations={setObservations}
            onCancel={cancel}
            onPublish={() => setPublished(true)}
          />
        )}
      </main>

      <WizardFooter />
    </div>
  )
}
