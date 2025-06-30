'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import AppLink from '@/components/elementary/AppLink'
import { AppField } from '@/components/forms/AppField'
import { AppForm } from '@/components/forms/AppForm'
import { AppTextArea } from '@/components/forms/AppTextArea'
import { Button } from '@/components/ui/button'

export function ContactForm({
  gdpr,
}: Readonly<{
  gdpr?: { href?: string; label?: string; newTab?: boolean }
}>) {
  const t = useTranslations('contactForm')

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<z.infer<FormSchemaType>>({
    resolver: zodResolver(ContactFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onSubmit',
    defaultValues: { name: '', email: '', message: '' },
  })

  const onSubmit = (values: z.infer<FormSchemaType>) => {
    // TODO: Add submit logic
    // eslint-disable-next-line no-console
    console.log('values', values)
    setErrorMessage(null)
  }

  return (
    <AppForm form={form} onSubmit={onSubmit} id={contactFormName} className="w-full">
      <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              First name
            </label>
            <div className="mt-2.5">
              <AppField
                name="first-name"
                type="text"
                required
                label={t('name')}
                placeholder={t('namePlaceholder')}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="last-name"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Last name
            </label>
            <div className="mt-2.5">
              <AppField
                name="lest-name"
                type="text"
                required
                label={t('name')}
                placeholder={t('namePlaceholder')}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
              Email
            </label>
            <div className="mt-2.5">
              <AppField
                name="email"
                type="text"
                autoComplete="email"
                required
                label={t('email')}
                placeholder={t('emailPlaceholder')}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="phone-number"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Phone number
            </label>
            <div className="mt-2.5">
              <input
                type="tel"
                name="phone-number"
                id="phone-number"
                autoComplete="tel"
                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block text-sm font-semibold leading-6 text-gray-900"
            >
              Message
            </label>
            <div className="mt-2.5">
              <AppTextArea
                name="message"
                type="text"
                label={t('message')}
                aria-label="contact-message"
              />
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          {gdpr?.href && (
            <div className="mt-5 flex flex-col items-center sm:flex-row">
              <p>{t('gdpr')}</p>
              <AppLink
                openExternalInNewTab={gdpr.newTab}
                className="p-0 pl-1 font-medium"
                href={gdpr?.href}
              >
                {gdpr.label || t('gdprLink')}
              </AppLink>
            </div>
          )}
          <Button type="submit" className="md:w-fit" size="lg" form={contactFormName}>
            {t('submit')}
          </Button>
        </div>
        {errorMessage && (
          <div className="text-center text-red-500">
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </AppForm>
  )
}

const ContactFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  message: z.string().optional(),
})

type FormSchemaType = typeof ContactFormSchema

export const contactFormName = 'contactForm'
