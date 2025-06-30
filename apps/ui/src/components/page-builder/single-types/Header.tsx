import React from 'react'
import Image from 'next/image'

import { AppLocale } from '@/types/general'

import { getAuth } from '@/lib/auth'
import { Link } from '@/lib/navigation'
import Strapi from '@/lib/strapi'
import { cn } from '@/lib/styles'
import InlineSVG from '@/components/page-builder/InlineSVG'

export async function Header({ locale }: { readonly locale: AppLocale }) {
  const data = await fetchData(locale)

  const { logoImage, topBarLinks, primaryNavigationLinks, logoLink, logoIcon, announcements } =
    data?.data ?? {}

  const session = await getAuth()

  const isAuthenticated = session?.user != null

  const topBarLink = announcements?.[0]
  return (
    <div className="sticky isolate z-[1000]">
      {/* Top Bar */}
      <div className="hidden bg-primary py-2 text-sm font-medium md:block">
        <nav className="m-auto flex max-w-[85.00rem] items-center gap-x-4 px-6 md:justify-center">
          <div className="flex min-h-[1.375em] grow flex-col overflow-hidden text-primary-foreground">
            <div className="max-w-full overflow-hidden text-ellipsis">
              <div>
                {topBarLink && (
                  <Link
                    href={topBarLink.href || '#'}
                    target={topBarLink.newTab ? '_blank' : '_self'}
                    className={cn('inline-flex items-center')}
                  >
                    {topBarLink.label}
                    <svg
                      className="h-3 w-5 max-w-full cursor-pointer"
                      fill="none"
                      viewBox="0 0 18 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.6033 1.27344L16.6033 5.77344L12.6033 10.2734"
                        fill="none"
                        stroke="#ffffff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.60327 5.77344H16.6033"
                        fill="none"
                        stroke="#ffffff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <ul className="hidden list-none gap-x-4 text-primary-foreground lg:flex lg:items-center">
            {topBarLinks &&
              topBarLinks.map((link) => (
                <li key={link.label} className="list-item">
                  <a className="text-center" href={link.href || '#'}>
                    {link.label}
                  </a>
                </li>
              ))}
          </ul>
        </nav>
      </div>

      {/* Header Section */}
      <header className="relative bg-background">
        <div className="m-auto flex max-w-[85.00rem] items-center gap-6 px-6 py-4">
          {/* Logo */}
          <div className="mr-auto">
            <Link href={logoLink || ''}>
              <div className="flex">
                {logoIcon?.url && (
                  <InlineSVG
                    url={logoIcon?.url}
                    className="flex items-center fill-primary py-1 text-primary"
                    style={{ '--stroke-width': '10px' } as React.CSSProperties}
                  />
                )}
                <InlineSVG
                  url={logoImage?.url}
                  className="flex items-center fill-primary text-primary"
                />
              </div>
            </Link>
          </div>

          {/* Main Navigation */}
          <nav className="hidden grow text-foreground lg:block">
            <div className="flex flex-col lg:flex-row lg:items-center">
              <ul className="flex grow list-none flex-col lg:flex-row lg:items-center">
                {primaryNavigationLinks &&
                  primaryNavigationLinks.map((link, index) => (
                    <li key={index} className="list-item first:lg:ml-auto">
                      {link.href ? (
                        <Link
                          className="flex w-full items-center justify-between rounded-full pb-3 pt-2 lg:w-auto lg:justify-start lg:px-4 lg:py-2"
                          href={link.href}
                        >
                          <span className="cursor-pointer font-medium">{link.label}</span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className="flex h-10 w-full cursor-pointer items-center justify-between gap-[0.13rem] overflow-visible rounded-full pb-3 pt-2 text-center lg:w-auto lg:justify-start lg:px-4 lg:py-2"
                        >
                          <span className="font-medium">Dropdown Not Implemented</span>
                          <svg
                            className="size-4 max-w-full"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <polyline points="6 9 12 15 18 9" stroke="#4d5b7c" />
                          </svg>
                        </button>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          </nav>

          {/* Auth Links */}
          {/* {!isAuthenticated && (
            <div className="hidden font-medium md:ml-auto md:block">
              <ul className="flex list-none gap-2">
                <li className="list-item text-foreground">
                  <Link className="inline-block rounded-3xl px-4 py-2" href="/auth/signin">
                    Log in
                  </Link>
                </li>
                <li className="list-item text-primary-foreground">
                  <Link
                    className="inline-block rounded-3xl bg-primary px-4 py-2"
                    href="/auth/register"
                  >
                    Sign up
                  </Link>
                </li>
              </ul>
            </div>
          )} */}
        </div>
      </header>
    </div>
  )
}

async function fetchData(locale: string) {
  try {
    return await Strapi.fetchOne(
      'api::header.header',
      undefined,
      {
        locale,
        populate: [
          'logoIcon',
          'logoImage',
          'topBarLinks',
          'primaryNavigationLinks',
          'announcements',
        ],
        pLevel: 5,
      },
      undefined,
      { omitAuthorization: true }
    )
  } catch (e: any) {
    console.error(`Data for "api::header.header" content type wasn't fetched: `, e?.message)
    return undefined
  }
}

export default Header
