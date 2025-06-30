import React from 'react'
import { Schema } from '@repo/strapi'

export const StatisticsGrid = ({
  component,
}: {
  readonly component: Schema.Attribute.ComponentValue<'sections.statistics-grid', false>
}) => {
  const { items, isVisible } = component

  if (!isVisible || !items || items.length === 0) return null

  return (
    <section className="isolate">
      <div className="bg-background-alt py-32">
        <div className="m-auto w-full max-w-[calc(1136px)] px-6">
          <div className="grid grid-cols-[repeat(6,minmax(0px,1fr))] gap-10 md:gap-16">
            {items.map((item, index) => {
              const { title, subTitle, link } = item

              return (
                <div key={index} className="col-[span_6] md:col-[span_3]" id={`div-${index + 1}`}>
                  <div className="flex min-h-full flex-col text-slate-900">
                    <div className="flex flex-col justify-between">
                      <div className="flex flex-col">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center text-4xl font-bold">
                            <h3>{title}</h3>
                          </div>
                          <p className="text-slate-600">
                            {subTitle}{' '}
                            {link?.href && (
                              <a
                                className="text-blue-600 underline"
                                href={link.href}
                                target={link.newTab ? '_blank' : '_self'}
                                rel={link.newTab ? 'noopener noreferrer' : undefined}
                              >
                                {link.label || 'Learn more'}
                              </a>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
