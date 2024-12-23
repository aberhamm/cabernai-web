'use client'

import { Schema } from '@repo/strapi'
import { motion } from 'framer-motion'

import InlineSVG from '@/components/page-builder/InlineSVG'

export const FeatureCTAGrid = ({
  component,
}: {
  readonly component: Schema.Attribute.ComponentValue<
    'sections.feature-cta-grid',
    false
  >
}) => {
  const { title, subTitle, link, features, isVisible } = component

  if (!isVisible) return null

  return (
    <section className="relative isolate">
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0,
          duration: 0.8,
          ease: 'easeInOut',
        }}
      >
        <div className="py-32">
          <div className="m-auto w-full max-w-[calc(1136px)] px-6">
            {/* Heading Section */}
            <div className="m-auto w-full max-w-[54.00rem]">
              <div className="flex flex-col gap-6 pb-16 text-center md:pb-20">
                <div className="flex flex-col gap-2">
                  <h2 className="text-4xl font-bold text-foreground">
                    {title}
                  </h2>
                  <div className="m-auto max-w-[40.00rem] text-slate-600">
                    <p>{subTitle}</p>
                  </div>
                </div>
                {link?.href && (
                  <p className="font-semibold text-foreground">
                    <a
                      className="inline-flex items-center"
                      href={link.href}
                      target={link.newTab ? '_blank' : '_self'}
                      rel={link.newTab ? 'noopener noreferrer' : undefined}
                    >
                      {link.label}
                      <svg
                        className="h-3 w-5 max-w-full cursor-pointer"
                        fill="none"
                        viewBox="0 0 18 12"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.6033 1.27344L16.6033 5.77344L12.6033 10.2734"
                          fill="none"
                          stroke="#000c2a"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1.60327 5.77344H16.6033"
                          fill="none"
                          stroke="#000c2a"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-[repeat(1,minmax(0px,1fr))] gap-6 md:gap-8">
              <div className="grid grid-cols-[repeat(6,minmax(0px,1fr))] gap-6 md:auto-rows-[1fr] md:gap-8">
                {features &&
                  features.map((feature, index) => (
                    <div
                      key={index}
                      className="col-span-6 col-end-auto md:col-span-3 md:col-end-auto lg:col-span-2 lg:col-end-auto"
                    >
                      <div
                        className="flex h-full flex-col items-start gap-6 rounded-2xl bg-card px-8 pb-10 pt-8 text-card-foreground shadow-[rgba(17,25,46,0.1)_0px_0px_0px_2px_inset]"
                        style={{
                          containerName: 'product-card',
                          containerType: 'inline-size',
                        }}
                      >
                        <div className="flex h-full flex-col items-start gap-6 self-stretch">
                          <div className="w-full flex-col gap-6">
                            <div className="flex flex-[1_0_0px] items-start gap-4 self-stretch">
                              {feature.image && (
                                <div className="flex-[0_0_auto] text-primary">
                                  <InlineSVG
                                    url={feature?.image?.media?.url}
                                    className="size-12 max-w-full fill-primary"
                                  />
                                </div>
                              )}
                              <div className="flex flex-col items-start self-center text-xl font-bold text-foreground">
                                <h3>{feature.title}</h3>
                              </div>
                            </div>
                          </div>
                          <svg
                            fill="rgb(0, 0, 0)"
                            preserveAspectRatio="none"
                            viewBox="0 0 1 0.002"
                          >
                            <path
                              d="M0 0 l12 0"
                              fill="rgb(0, 0, 0)"
                              stroke="#a9b3ca"
                              strokeWidth={1}
                              strokeDasharray="4 8"
                              strokeLinecap="round"
                              vectorEffect="non-scaling-stroke"
                            />
                          </svg>
                          <div className="flex flex-grow items-start text-slate-600">
                            <ul
                              className="w-full list-none columns-1 gap-x-6"
                              style={{
                                breakInside: 'avoid',
                              }}
                            >
                              <li className="flex items-center">
                                <p className="m-0 text-base font-normal leading-6 tracking-normal text-[rgb(77,91,124)]">
                                  <span>{feature.subTitle}</span>
                                </p>
                              </li>
                            </ul>
                          </div>
                          <p className="font-semibold text-foreground">
                            <a
                              className="relative inline-flex items-center gap-2"
                              href={feature.link?.href || ''}
                            >
                              <span className="cursor-pointer">
                                {feature.link?.label || 'Learn more'}
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
                                  stroke="#000c2a"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M1.60327 5.77344H16.6033"
                                  fill="none"
                                  stroke="#000c2a"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
