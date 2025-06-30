import { Fragment } from 'react'

import { AppLocale } from '@/types/general'

import { removeThisWhenYouNeedMe } from '@/lib/general-helpers'
import Strapi from '@/lib/strapi'
import { cn } from '@/lib/styles'
import { Container } from '@/components/elementary/Container'

import { ImageWithLink } from '../components/ImageWithLink'
import { LinkStrapi } from '../components/LinkStrapi'

const footerContent = {
  sections: [
    {
      title: 'Company',
      links: [
        { href: 'https://www.digitalocean.com/about', label: 'About' },
        {
          href: 'https://investors.digitalocean.com/governance/executive-management/default.aspx',
          label: 'Leadership',
        },
      ],
    },
    {
      title: 'Products',
      links: [
        { href: 'https://www.digitalocean.com/products', label: 'Overview' },
        {
          href: 'https://www.digitalocean.com/products/droplets',
          label: 'Droplets',
        },
        {
          href: 'https://www.digitalocean.com/products/kubernetes',
          label: 'Kubernetes',
        },
        {
          href: 'https://www.digitalocean.com/products/functions',
          label: 'Functions',
        },
        {
          href: 'https://www.digitalocean.com/products/app-platform',
          label: 'App Platform',
        },
      ],
    },
    {
      title: 'Resources',
      links: [
        {
          href: 'https://www.digitalocean.com/community/tutorials',
          label: 'Community Tutorials',
        },
        {
          href: 'https://www.digitalocean.com/community/questions',
          label: 'Community Q&A',
        },
        { href: 'https://css-tricks.com/', label: 'CSS-Tricks' },
      ],
    },
    {
      title: 'Solutions',
      links: [
        {
          href: 'https://www.digitalocean.com/solutions/website-hosting',
          label: 'Website Hosting',
        },
        {
          href: 'https://www.digitalocean.com/solutions/vps-hosting',
          label: 'VPS Hosting',
        },
      ],
    },
    {
      title: 'Contact',
      links: [
        { href: 'https://www.digitalocean.com/support', label: 'Support' },
        {
          href: 'https://www.digitalocean.com/company/contact/sales?referrer=footer',
          label: 'Sales',
        },
        {
          href: 'https://www.digitalocean.com/company/contact/abuse',
          label: 'Report Abuse',
        },
        { href: 'https://status.digitalocean.com/', label: 'System Status' },
        { href: 'https://ideas.digitalocean.com/', label: 'Share your ideas' },
      ],
    },
  ],
  copyRight: '© 2024 DigitalOcean, LLC.',
  sitemap: 'Sitemap.',
}

async function fetchData(locale: string) {
  try {
    return await Strapi.fetchOne(
      'api::footer.footer',
      undefined,
      {
        locale,
        populate: ['sections', 'logoImage', 'links'],
        pLevel: 5,
      },
      undefined,
      { omitAuthorization: true }
    )
  } catch (e: any) {
    console.error(`Data for "api::footer.footer" content type wasn't fetched: `, e?.message)
    return undefined
  }
}

export async function Footer({ locale }: { readonly locale: AppLocale }) {
  const response = await fetchData(locale)
  const component = response?.data

  if (component == null) {
    return null
  }

  const { sections, links, copyRight } = component

  return (
    <div className="relative isolate">
      <div className="bg-slate-50 py-32">
        <div className="m-auto w-full max-w-[calc(1136px)] px-6">
          <footer className="w-full grid-cols-[repeat(auto-fill,_minmax(192px,_1fr))] gap-[32px] md:grid">
            {sections?.map((section, index) => (
              <div key={index}>
                <h6 className="m-0 text-[16px] font-bold leading-[24px] tracking-[0px] text-[rgb(0,_12,_42)]">
                  {section.title}
                </h6>
                <ul className="mx-0 mb-0 mt-[16px] flex flex-col gap-[8px] p-0 [list-style:none]">
                  {section.links?.map((link, linkIndex) => (
                    <li className="list-item" key={linkIndex}>
                      <LinkStrapi
                        key={String(link.id) + linkIndex}
                        component={link}
                        className="m-0 text-[14px] font-normal leading-[20px] tracking-[0px] text-[rgb(77,_91,_124)] no-underline"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </footer>
          <div className="mx-0 mb-0 mt-[80px] flex flex-col items-center justify-between gap-[32px] text-sm font-normal leading-[20px] tracking-[0px] text-slate-600 md:flex-row">
            <div className="flex w-full flex-col-reverse items-center justify-between sm:flex-row">
              <div className="mt-2 sm:mt-0">
                {component.copyRight && (
                  <span>
                    {component.copyRight.replace('{YEAR}', new Date().getFullYear().toString())}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-4 md:justify-end">
                {component.links?.map((link, i) => (
                  <LinkStrapi
                    key={String(link.id) + i}
                    component={link}
                    className="m-0 hover:underline"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
