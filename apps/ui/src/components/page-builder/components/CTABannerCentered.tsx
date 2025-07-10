import { Schema } from '@repo/strapi'

export const CTABannerCentered = ({
  component,
}: {
  readonly component: Schema.Attribute.ComponentValue<'sections.cta-banner-centered', false>
}) => {
  const { title, subText, link, isVisible, bgColor, footnote } = component

  if (!isVisible) return null

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
            </div>
            {footnote && <p className="text-center text-xs text-slate-600">{footnote}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
