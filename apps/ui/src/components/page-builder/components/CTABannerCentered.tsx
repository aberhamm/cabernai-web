import React from 'react'
import { Schema } from '@repo/strapi'

import { Container } from '@/components/elementary/Container'
import InlineSVG from '@/components/page-builder/InlineSVG'

import { BasicImage } from './BasicImage'
import { LinkStrapi } from './LinkStrapi'

export const CTABannerCentered = ({
  component,
}: {
  readonly component: Schema.Attribute.ComponentValue<'sections.cta-banner-centered', false>
}) => {
  // Destructure the component attributes
  const { title, subText, image, link, isVisible, bgColor, footnote } = component

  if (!isVisible) return null // Render nothing if isVisible is false

  return (
    <section className="relative isolate">
      <div className="px-0 py-32">
        <div className="mx-auto my-0 w-full max-w-[calc(1136px)] px-6 py-0">
          <div className="grid-cols-[repeat(1,minmax(0px,1fr)) grid h-full gap-6 md:gap-8">
            <div
              className="relative h-full overflow-hidden rounded-2xl bg-primary-gradient px-4 pb-0 pt-6 text-center text-primary-foreground md:px-6 md:pb-20 md:pt-16"
              style={{
                backgroundColor: bgColor || '',
              }}
            >
              <div className="my-0; relative z-[1] mx-auto flex max-w-[416px] flex-col gap-10">
                <div className="flex flex-col gap-2">
                  {/* Title */}
                  {title && (
                    <h2 className="m-0 text-[28px] font-bold leading-9 tracking-normal md:text-4xl md:leading-[48px] md:tracking-[-1px]">
                      {title}
                    </h2>
                  )}

                  {/* Subtitle */}
                  {subText && (
                    <p className="m-0 text-base font-normal leading-6 tracking-normal">{subText}</p>
                  )}
                </div>

                {/* Link */}
                {link?.href && (
                  <a
                    className="inline-block rounded-3xl bg-secondary px-6 py-2 font-semibold text-secondary-foreground"
                    href={link.href}
                    target={link.newTab ? '_blank' : '_self'}
                    rel={link.newTab ? 'noopener noreferrer' : undefined}
                  >
                    {link.label}
                  </a>
                )}
              </div>

              {/* Image */}
              {/* {image?.media?.url && (
                <div className="-m-4 md:absolute md:bottom-0 md:left-0 md:right-0 md:top-0 md:m-0">
                  <img
                    className="h-auto w-full max-w-full object-cover md:absolute md:h-full"
                    src={image.media.url}
                    alt={image.alt || ''}
                    style={{
                      aspectRatio: 'auto 1088 / 328',
                    }}
                  />
                </div>
              )} */}
            </div>
            {footnote && <p className="text-center text-xs text-slate-600">{footnote}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
