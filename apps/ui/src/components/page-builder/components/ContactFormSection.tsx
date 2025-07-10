import { Schema } from '@repo/strapi'

import { ContactForm } from '@/components/elementary/forms/ContactForm'

export function ContactFormSection({
  component,
}: {
  readonly component: Schema.Attribute.ComponentValue<'sections.contact-form', false>
}) {
  return (
    // <div className="bg-white" id="form-section">
    //   <Container className="flex flex-col gap-10 lg:flex-row lg:gap-40">
    //     <div className="flex flex-1">
    //       <div className="flex max-w-[400px] flex-col gap-10">
    //         {component.title && <p>{component.title}</p>}
    //         {component.description && <p>{component.description}</p>}
    //       </div>
    //     </div>
    //     <div className="flex flex-1">
    //       <ContactForm
    //         gdpr={{
    //           href: component.gdpr?.href ?? undefined,
    //           label: component.gdpr?.label ?? undefined,
    //           newTab: component.gdpr?.newTab ?? false,
    //         }}
    //       />
    //     </div>
    //   </Container>
    // </div>
    <div className="relative isolate bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
            <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-gray-100 ring-1 ring-gray-900/10 lg:w-1/2">
              <svg
                className="absolute inset-0 size-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
                    width={200}
                    height={200}
                    x="100%"
                    y={-1}
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M130 200V.5M.5 .5H200" fill="none" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" strokeWidth={0} fill="white" />
                <svg x="100%" y={-1} className="overflow-visible fill-gray-50">
                  <path d="M-470.5 0h201v201h-201Z" strokeWidth={0} />
                </svg>
                <rect
                  width="100%"
                  height="100%"
                  strokeWidth={0}
                  fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Get in touch</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Proin volutpat consequat porttitor cras nullam gravida at. Orci molestie a eu arcu.
              Sed ut tincidunt integer elementum id sem. Arcu sed malesuada et magna.
            </p>
          </div>
        </div>
        <div className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48">
          <ContactForm
            gdpr={{
              href: component.gdpr?.href ?? undefined,
              label: component.gdpr?.label ?? undefined,
              newTab: component.gdpr?.newTab ?? false,
            }}
          />
        </div>
      </div>
    </div>
  )
}
