'use client'

import React, { useState } from 'react'
import Head from 'next/head'
import { Schema } from '@repo/strapi'

import { ClientCldImage } from './ClientCldImage'

export function TabbedBanner({
  component,
}: {
  readonly component: Schema.Attribute.ComponentValue<'sections.tabbed-banner', false>
}) {
  const { tabs, subTitle, title } = component
  const [activeTab, setActiveTab] = useState(0)
  const content = (tabs || [])[activeTab]

  return (
    <>
      <Head>
        {tabs?.map((tab, index) => (
          <link key={index} rel="preload" href={tab.image?.media.url} as="image" />
        ))}
      </Head>
      <div className="relative isolate">
        <div className="px-0 py-20">
          <div className="m-auto w-full max-w-[calc(1136px)] px-6">
            <div className="m-auto w-full max-w-[54.00rem]">
              <div className="flex flex-col pb-16 text-center md:pb-20">
                <div className="flex flex-col gap-2">
                  <h2 className="text-4xl font-bold">{title}</h2>
                  <div className="m-auto max-w-[40.00rem] text-slate-600">
                    <p>{subTitle}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-16">
              <div className="flex flex-col gap-0 md:gap-6">
                <div className="-mx-6 my-0 flex items-center justify-start gap-2 overflow-auto px-6 py-0 md:justify-center">
                  {tabs?.map((tab, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`block cursor-pointer whitespace-nowrap rounded-3xl border-0 px-4 py-2 text-base font-medium leading-6 ${
                        activeTab === index
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-transparent text-muted hover:bg-primary hover:text-primary-foreground'
                      }`}
                      onClick={() => setActiveTab(index)}
                    >
                      {tab.title}
                    </button>
                  ))}
                </div>
                <svg
                  className="hidden h-px max-w-full md:block"
                  fill="rgb(0, 0, 0)"
                  preserveAspectRatio="none"
                  viewBox="0 0 1 0.002"
                >
                  <path
                    d="M0 0 l12 0"
                    fill="rgb(0, 0, 0)"
                    stroke="#4d5b7c"
                    strokeDasharray="0"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>
              <div className="grid grid-cols-[repeat(2,minmax(0px,1fr))] gap-10 md:gap-8">
                <div className="col-span-2 col-end-auto md:col-span-1 md:col-end-auto">
                  {content?.image && (
                    // <img
                    //   alt=""
                    //   aria-hidden="true"
                    //   className="m-auto h-auto w-full max-w-full rounded-2xl"
                    //   src={content.image.media.url}
                    //   style={{
                    //     aspectRatio: 'auto',
                    //   }}
                    // />
                    <ClientCldImage
                      width={content?.image.media.width}
                      height={content?.image.media.height}
                      src={content?.image.media.provider_metadata.public_id}
                      alt={content?.image.media.alternativeText || ''}
                      aria-hidden={!content?.image.media.alternativeText}
                      // quality={100}
                      format="webp"
                      className="m-auto h-auto w-full max-w-full rounded-2xl"
                      style={{
                        opacity: content?.image.opacity,
                        aspectRatio: 'auto',
                      }}
                      unoptimized
                      priority
                    />
                  )}
                </div>
                <div className="col-span-2 col-end-auto md:col-span-1 md:col-end-auto">
                  <div className="flex flex-col gap-6 text-center md:relative md:top-2/4 md:mx-auto md:my-0 md:max-w-[416px] md:-translate-y-2/4 md:text-left">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-2xl font-bold">{content?.title}</h3>
                      <p className="text-slate-600">{content?.subTitle}</p>
                    </div>
                    {content?.link && (
                      <div className="flex flex-wrap items-center justify-center md:justify-start">
                        <a
                          className="inline-flex items-center gap-2"
                          href={
                            typeof content?.link === 'string'
                              ? content.link
                              : content?.link?.href || '#'
                          }
                        >
                          <span className="cursor-pointer font-semibold text-slate-900">
                            {content?.link?.label}
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
                              stroke="#000000"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M1.60327 5.77344H16.6033"
                              fill="none"
                              stroke="#000000"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
