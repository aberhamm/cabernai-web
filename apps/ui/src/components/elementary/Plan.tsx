import { Schema } from '@repo/strapi'

import { cn } from '@/lib/styles'
import { Button } from '@/components/ui/button'

function CheckIcon({ className, ...props }: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      aria-hidden="true"
      className={cn('size-6 flex-none fill-current stroke-current', className)}
      {...props}
    >
      <path
        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
        strokeWidth={0}
      />
      <circle
        cx={12}
        cy={12}
        r={8.25}
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Plan({
  component,
}: {
  readonly component: Schema.Attribute.ComponentValue<'elements.plan', false>
}) {
  const { name, monthPrice, yearPrice, description, features, isRecommended } = component
  const href = '#'

  return (
    <section
      className={cn(
        'flex flex-col rounded-3xl px-6 sm:px-8',
        isRecommended
          ? 'order-first bg-secondary py-8 text-secondary-foreground lg:order-none'
          : 'lg:py-8'
      )}
    >
      <h3 className={cn('font-display mt-5 text-lg font-bold')}>{name}</h3>
      <p className={cn('mt-2 text-base')}>{description}</p>
      <p className={cn('font-display order-first text-5xl font-light tracking-tight')}>
        ${monthPrice}
        <span className="text-4xl"> / month</span>
      </p>
      {features && (
        <ul className={cn('order-last mt-10 flex flex-col gap-y-3 text-sm')}>
          {features.map((feature, i) => (
            <li key={i} className="flex">
              <CheckIcon className={isRecommended ? 'text-primary' : 'text-primary-foreground'} />
              <span className="ml-4">{feature.name}</span>
            </li>
          ))}
        </ul>
      )}
      <Button variant={isRecommended ? 'primary' : 'secondary'} className="mt-8" asChild>
        <a href={href} aria-label={`Get started with the ${name} plan for ${monthPrice} per month`}>
          Get started
        </a>
      </Button>
    </section>
  )
}
