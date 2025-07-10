import Image from 'next/image'
import { Schema } from '@repo/strapi'

import { cn } from '@/lib/styles'

export const BenefitsCTAGrid = ({
  component,
}: {
  readonly component: Schema.Attribute.ComponentValue<'sections.benefits-cta-grid', false>
}) => {
  const { title, subTitle, benefits, isVisible, bgImage } = component

  if (!isVisible) return null

  const bgImageUrl = bgImage?.url

  return (
    <div className="isolate">
      <div
        className={cn('bg-secondary bg-cover px-0 py-[80px]')}
        style={{ backgroundImage: bgImage ? `url(${bgImageUrl})` : '' }}
      >
        <div className="m-auto w-full max-w-[calc(1136px)] px-6">
          <div className="m-auto w-full max-w-[54.00rem]">
            <div className="flex flex-col pb-16 text-center md:pb-20">
              <div className="flex flex-col gap-2">
                <h2 className="m-0 text-4xl font-bold leading-9 tracking-normal text-slate-900 md:text-4xl md:leading-[48px] md:tracking-[-1px]">
                  {title}
                </h2>
                <div className="m-auto max-w-[40.00rem] text-slate-600">
                  <p className="m-0 text-base font-normal leading-6 tracking-normal text-[rgb(77,91,124)]">
                    {subTitle}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[repeat(6,minmax(0px,1fr))] gap-6 text-slate-900 md:auto-rows-[1fr] md:gap-8">
            {benefits &&
              benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="col-span-6 col-end-auto md:col-span-3 md:col-end-auto lg:col-span-2 lg:col-end-auto"
                >
                  <div className="relative flex min-h-full flex-col overflow-hidden rounded-2xl bg-card text-card-foreground after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl after:border-2 after:border-solid after:border-[rgba(17,25,46,0.1)] after:content-['']">
                    <div className="flex grow flex-col justify-between px-8 pb-10 pt-8">
                      <div className="flex flex-col gap-4">
                        {benefit.image && (
                          <div className="size-20">
                            <Image
                              className="size-full max-w-full object-contain"
                              src={benefit.image?.media?.url || ''}
                              alt={benefit.image?.alt || ''}
                              width={80}
                              height={80}
                            />
                          </div>
                        )}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center text-2xl font-bold">
                            <h3>{benefit.title}</h3>
                          </div>
                          <p className="text-slate-600">{benefit.subTitle}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
