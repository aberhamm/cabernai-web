import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

import { PageProps } from '@/types/next'

import { routing } from '@/lib/navigation'
import { getMetadataFromStrapi } from '@/lib/next-helpers'
import Strapi from '@/lib/strapi'
import { ComponentsRenderer } from '@/components/page-builder/ComponentsRenderer'
import { Footer } from '@/components/page-builder/single-types/Footer'

export async function generateStaticParams() {
  const promises = routing.locales.map((locale) =>
    Strapi.fetchAll('api::page.page', { locale }, undefined, {
      omitAuthorization: true,
    })
  )

  const results = await Promise.allSettled(promises)

  const params = results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value.data)
    .flat()
    .map((page) => ({
      locale: page.locale,
      rest: [page.slug],
    }))

  return params
}

async function fetchData(pageUrl: string, locale: string) {
  try {
    return Strapi.fetchOneBySlug(
      'api::page.page',
      pageUrl,
      {
        populate: ['content'],
        pLevel: 10,
        locale,
      },
      undefined,
      { omitAuthorization: true }
    )
  } catch (e: any) {
    console.error(`"api::page.page" wasn't fetched: `, e?.message)
    return undefined
  }
}

type Props = PageProps<{
  rest: string[]
}>

export async function generateMetadata({ params }: Props) {
  return getMetadataFromStrapi({ pageUrl: '/', locale: params.locale })
}

export default async function StrapiPage({ params }: Props) {
  setRequestLocale(params.locale)

  const response = await fetchData('/', params.locale)

  const page = response?.data

  if (page?.content == null) {
    notFound()
  }

  const pageComponents = page.content.filter((x) => {
    return (
      x.__component !== 'layout.navbar' &&
      ('isVisible' in x ? x.isVisible : true)
    )
  })

  return (
    <>
      <main className="w-full overflow-x-hidden">
        <ComponentsRenderer pageComponents={pageComponents} />
      </main>
    </>
  )
}
