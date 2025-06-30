import { Schema } from '@repo/strapi'

import { Container } from '@/components/elementary/Container'

export function Faq({
  component,
}: {
  readonly component: Schema.Attribute.ComponentValue<'sections.faq', false>
}) {
  const { title, subTitle, faqs } = component

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      {/* <Image
        className="absolute left-1/2 top-0 max-w-none -translate-y-1/4 translate-x-[-30%]"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      /> */}
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            {}
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            If you can&apos;t find what you&apos;re looking for, email our support team and if you&apos;re lucky
            someone will get back to you.
          </p>
        </div>
        <ul className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
          {faqs &&
            faqs.map((faq, faqIndex) => (
              <li key={faqIndex}>
                <h3 className="font-display text-lg leading-7 text-slate-900">
                  {faq.question}
                </h3>
                <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
              </li>
            ))}
        </ul>
      </Container>
    </section>
  )
}
