import React from 'react'
import { Schema } from '@repo/strapi'

import { cn } from '@/lib/styles'
import { Container } from '@/components/elementary/Container'
import InlineSVG from '@/components/page-builder/InlineSVG'

import { BasicImage } from './BasicImage'
import { ClientCldImage } from './ClientCldImage'
import { LinkStrapi } from './LinkStrapi'

export const CTABanner = ({
  component,
}: {
  readonly component: Schema.Attribute.ComponentValue<
    'sections.cta-banner',
    false
  >
}) => {
  // Destructure the component attributes
  const { title, subText, image, link, isVisible, bgColor } = component

  if (!isVisible) return null // Render nothing if isVisible is false

  let fontColorClass = 'text-white'
  if (bgColor?.includes('primary')) {
    fontColorClass = 'text-primary-foreground'
  } else if (bgColor?.includes('secondary')) {
    fontColorClass = 'text-secondary-foreground'
  } else if (bgColor?.includes('tertiary')) {
    fontColorClass = 'text-tertiary-foreground'
  }

  return (
    <section className={cn('relative isolate', fontColorClass)}>
      <div className="py-[128px]">
        <div className="m-auto w-full max-w-[calc(1136px)] px-6">
          <div
            className={cn('relative overflow-hidden rounded-2xl')}
            style={{
              background: `var(--${bgColor})` || '',
            }}
          >
            <div className="relative z-[5] flex flex-col gap-6 p-7 lg:max-w-[528px]">
              <div className="flex flex-col gap-2">
                {/* Title */}
                {title && (
                  <h2 className="m-0 text-2xl font-bold leading-8 tracking-normal">
                    {title}
                  </h2>
                )}
                {/* Subtitle */}
                {subText && <p>{subText}</p>}
              </div>

              {/* Link */}
              {link?.href && (
                <p className="font-semibold">
                  <a
                    className="relative inline-flex items-center gap-2"
                    href={link.href}
                    target={link.newTab ? '_blank' : '_self'}
                    rel={link.newTab ? 'noopener noreferrer' : undefined}
                  >
                    {link.label || 'Learn more'}
                    <span
                      className="absolute inset-y-[0.88rem] left-0 right-[7.25rem] -m-0 size-0 cursor-pointer overflow-hidden"
                      style={{
                        clipPath: 'inset(50%)',
                      }}
                    >
                      {link.label || 'Learn more'}
                    </span>
                    <svg
                      className="h-3 w-5 max-w-full cursor-pointer"
                      fill="none"
                      viewBox="0 0 18 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.6033 1.27344L16.6033 5.77344L12.6033 10.2734"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.60327 5.77344H16.6033"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </p>
              )}
            </div>

            {/* Image */}
            {image?.media?.url && (
              <ClientCldImage
                width={image.media.width}
                height={image.media.height}
                src={image.media.provider_metadata.public_id}
                alt={image.media.alternativeText || ''}
                aria-hidden={!image.media.alternativeText}
                quality={100}
                format="webp"
                className="w-full"
                style={{ opacity: image.opacity }}
                unoptimized
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
