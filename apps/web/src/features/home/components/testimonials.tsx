import Image from 'next/image'

import { Star, StarHalf } from 'lucide-react'

import { TESTIMONIALS, type Testimonial } from '../data/home-data'

export function Testimonials() {
  return (
    <section id="inspiracao" className="border-border/40 border-t px-6 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <span className="border-primary/40 bg-primary/10 text-primary inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-widest">
          TESTEMUNHOS
        </span>
        <h2 className="font-display text-foreground mt-4 text-3xl font-bold tracking-tight">
          O que dizem os nossos clientes
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrelas`}>
      {Array.from({ length: full }).map((_, i) => (
        <Star key={i} className="fill-primary text-primary size-4" />
      ))}
      {half && <StarHalf className="fill-primary text-primary size-4" />}
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="border-border bg-card/60 flex flex-col rounded-2xl border p-6">
      <Stars rating={testimonial.rating} />
      <p className="text-muted-foreground mt-4 flex-1 text-sm leading-relaxed">
        {`"${testimonial.quote}"`}
      </p>
      <div className="border-border/60 mt-6 flex items-center gap-3 border-t pt-5">
        <Image
          src={testimonial.avatar || '/placeholder-user.jpg'}
          alt={testimonial.name}
          width={40}
          height={40}
          className="ring-border size-10 rounded-full object-cover ring-2"
        />
        <div>
          <p className="text-foreground text-sm font-semibold">{testimonial.name}</p>
          <p className="text-muted-foreground text-xs">{testimonial.meta}</p>
        </div>
      </div>
    </article>
  )
}
