'use client'

import { Schema } from '@repo/strapi'
import { CldImage } from 'next-cloudinary'

import { cn } from '@/lib/styles'

export function WelcomeHero({
  component,
}: {
  readonly component: Schema.Attribute.ComponentValue<'sections.welcome-hero', false>
}) {
  const { title, subTitle, image, links, bgColor, bgImage } = component
  return (
    <section
      className={cn(
        'welcome-hero',
        `relative mb-[30vw] bg-cover pb-0 pt-8 md:px-0 md:pt-32 lg:mb-[15vw]`,
        `bg-${bgColor}`
      )}
      style={{
        backgroundClip: 'border-box, border-box',
        backgroundPositionX: '50%, 50%',
        backgroundPositionY: '0%, 0%',
        backgroundImage: `url(${bgImage?.media?.url})`,
      }}
    >
      <h1
        className="absolute bottom-[53.75rem] left-0 right-[94.63rem] top-[6.88rem] -m-0 size-0 overflow-hidden"
        style={{
          clipPath: 'inset(50%)',
        }}
      >
        {title}
      </h1>
      <p
        className="absolute bottom-[53.75rem] left-0 right-[94.63rem] top-[6.88rem] -m-0 size-0 overflow-hidden"
        style={{
          clipPath: 'inset(50%)',
        }}
      >
        {subTitle}
      </p>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 hidden h-[30.50rem] w-full md:block"
      >
        <svg
          className="h-auto w-[inherit] max-w-full opacity-[0.765004]"
          fill="none"
          height="488"
          style={{
            position: 'inherit',
          }}
          viewBox="0 0 1440 488"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="opacity-35"
            d="M793.028 0L241 488H819.828L1167.5 0H793.028Z"
            fill='url("#paint0_linear_1020_1373")'
            opacity="0.35"
          />
          <defs>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              x1="1020.25"
              x2="711.545"
              y1="-42.8599"
              y2="406.177"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          className="h-auto w-[inherit] max-w-full opacity-[0.208353]"
          fill="none"
          height="488"
          style={{
            position: 'inherit',
          }}
          viewBox="0 0 1440 488"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="opacity-[0.24]"
            d="M1027.2 0L516 488H600.695L1062 0H1027.2Z"
            fill='url("#paint0_linear_1020_1364")'
            opacity="0.24"
          />
          <defs>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              x1="1046.1"
              x2="821.178"
              y1="2.67301e-06"
              y2="512.939"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          className="h-auto w-[inherit] max-w-full opacity-[0.49509]"
          fill="none"
          height="488"
          style={{
            position: 'inherit',
          }}
          viewBox="0 0 1440 488"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="opacity-[0.24]"
            d="M811 0L284.507 488H208L784.658 0H811Z"
            fill='url("#paint0_linear_1020_1369")'
            opacity="0.24"
          />
          <defs>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              x1="811.228"
              x2="553.043"
              y1="-12.6692"
              y2="412.268"
            >
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <svg
          className="h-auto w-[inherit] max-w-full opacity-[0.333605]"
          fill="none"
          height="488"
          style={{
            position: 'inherit',
          }}
          viewBox="0 0 1440 488"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="opacity-[0.24]"
            d="M898.869 0L375 488H555.26L1044 0H898.869Z"
            fill='url("#paint0_linear_1020_1352")'
            opacity="0.24"
          />
          <defs>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              x1="1010.76"
              x2="629.046"
              y1="-9.85197"
              y2="646.382"
            >
              <stop stopColor="white" />
              <stop offset="0.825556" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="mx-auto my-0 flex w-full max-w-[1136px] flex-col gap-16 px-6 py-0 md:gap-20">
        <div className="m-auto w-full max-w-[864px] text-white">
          <div className="grid grid-cols-[repeat(1,_minmax(0px,_1fr))]">
            <div
              className="flex flex-col"
              style={{
                gridColumnStart: 'span 1',
              }}
            >
              <div className="flex flex-col gap-10 text-center">
                <div className="flex flex-col items-center gap-2">
                  {title && (
                    <h1 className="text-5xl font-bold leading-[56px] tracking-[-1.5px] md:mx-auto md:my-0 md:min-h-[2lh] md:max-w-screen-md">
                      {title}
                    </h1>
                  )}
                  {subTitle && (
                    <div className="mt-2 flex max-w-screen-sm flex-col">
                      <p className="m-0 text-lg font-normal leading-[26px] tracking-normal text-primary-foreground">
                        {subTitle}
                      </p>
                    </div>
                  )}
                </div>
                {links?.length && (
                  <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
                    {links.map((link, i) => (
                      <a
                        key={i}
                        className="inline-block w-full rounded-3xl bg-background px-6 py-2 font-semibold text-foreground md:w-auto"
                        href={link.href || ''}
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className="mb-[-30vw] aspect-video h-auto overflow-hidden rounded-md shadow-[rgba(0,12,42,0.2)_0px_9px_24px] lg:mb-[-15vw] lg:rounded-2xl"
          style={{
            aspectRatio: '16 / 9',
          }}
        >
          <CldImage
            width={image.width}
            height={image.height}
            src={image.provider_metadata.public_id}
            alt={image.alternativeText || ''}
            aria-hidden={!image.alternativeText}
            quality={100}
            format="webp"
            unoptimized
          />
        </div>
      </div>
    </section>
  )
}
