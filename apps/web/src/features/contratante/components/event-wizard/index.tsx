'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { createEvent, listCategories, type ServiceCategory } from '@/lib/api'

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
  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [categories, setCategories] = useState<ServiceCategory[]>([])

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

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
    router.push('/contratante')
  }

  async function publish() {
    setPublishing(true)
    setPublishError(null)
    try {
      const categoryIds = categories.filter((c) => services.includes(c.slug)).map((c) => c.id)

      await createEvent({
        type: eventType,
        name: displayName,
        event_date: date || null,
        guests_count: guests,
        notes: notes || null,
        country,
        district,
        city,
        venue_name: venueName || null,
        address: address || null,
        venue_status: venueStatus,
        service_category_ids: categoryIds,
      })
      setPublished(true)
    } catch {
      setPublishError('Não foi possível publicar o evento. Tente novamente.')
    } finally {
      setPublishing(false)
    }
  }

  if (published) {
    return <PublishedScreen displayName={displayName} onBack={() => router.push('/contratante')} />
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
            onPublish={publish}
            publishing={publishing}
            publishError={publishError}
          />
        )}
      </main>

      <WizardFooter />
    </div>
  )
}
