import Image from 'next/image'
import { Star, StarHalf } from 'lucide-react'

import { TESTIMONIALS, type Testimonial } from '../data/home-data'

export function Testimonials() {
  return (
    <section id="inspiracao" className="border-t border-border/40 px-6 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold tracking-widest text-primary">
          TESTEMUNHOS
        </span>
        <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground">
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
        <Star key={i} className="size-4 fill-primary text-primary" />
      ))}
      {half && <StarHalf className="size-4 fill-primary text-primary" />}
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card/60 p-6">
      <Stars rating={testimonial.rating} />
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
        {`"${testimonial.quote}"`}
      </p>
      <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-5">
        <Image
          src={testimonial.avatar || '/placeholder-user.jpg'}
          alt={testimonial.name}
          width={40}
          height={40}
          className="size-10 rounded-full object-cover ring-2 ring-border"
        />
        <div>
          <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.meta}</p>
        </div>
      </div>
    </article>
  )
}
