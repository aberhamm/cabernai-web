import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'

import { AppLocale } from '@/types/general'
import { PageProps } from '@/types/next'

import { removeThisWhenYouNeedMe } from '@/lib/general-helpers'
import { Link, routing } from '@/lib/navigation'
import { getMetadataFromStrapi } from '@/lib/next-helpers'
import Strapi from '@/lib/strapi'
import { WelcomeHero } from '@/components/page-builder/components/WelcomeHero'
import { ComponentsRenderer } from '@/components/page-builder/ComponentsRenderer'
import { Footer } from '@/components/page-builder/single-types/Footer'
import { Header } from '@/components/page-builder/single-types/Header'

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

export default async function DigitalOceanPage({ params }: PageProps) {
  setRequestLocale(params.locale)

  const response = await fetchData('digital-ocean', params.locale)
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
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html:
            '@media (max-width: 767px) {\n/* DivMagic Note: Tailwind does not support max-width. We will fix this soon. */\n\n#div-1 {\ngrid-template-columns: 1fr [content] 12fr 1fr !important;\n}\n#div-2 {\npadding-left: 0px !important; padding-right: 0px !important;\n}\n#div-5 {\nmargin-top: 1.25rem !important;\n}\n#div-7 {\ndisplay: flex !important;\n}\n#div-8 {\ndisplay: flex !important;\n}\n#div-9 {\ndisplay: flex !important;\n}\n#div-10 {\ndisplay: flex !important;\n}\n#div-11 {\ndisplay: flex !important;\n}\n#div-12 {\npadding-left: 20px !important; padding-right: 20px !important;\n}\n#div-17 {\nwidth: 100% !important;\n}\n#div-18 {\nwidth: 100% !important;\n}\n#div-19 {\nwidth: 100% !important;\n}\n#div-20 {\nwidth: 100% !important;\n}\n#div-21 {\nwidth: 100% !important;\n}\n#div-22 {\nwidth: 100% !important;\n}\n#div-23 {\nwidth: 100% !important;\n}\n#div-24 {\nwidth: 100% !important;\n}\n#div-25 {\nwidth: 100% !important;\n}\n#div-26 {\nwidth: 100% !important;\n}\n#div-27 {\nmargin-bottom: auto !important;\n}\n#div-28 {\nwidth: 100% !important;\n}\n#div-29 {\nwidth: 100% !important;\n}\n#div-30 {\nwidth: 100% !important;\n}\n#div-31 {\nwidth: 100% !important;\n}\n#div-32 {\nwidth: 100% !important;\n}\n}\n@media (min-width: 768px) {\n#div-3 {\ngrid-column-start: content !important; grid-column-end: content !important;\n}\n#div-4 {\ngrid-column-end: span 5 !important;\n}\n#div-6 {\ngrid-column-end: span 6 !important;\n}\n#ul-1 {\ngrid-column-start: content !important; grid-column-end: content !important;\n}\n#li-1 {\ngrid-column-start: span 2 !important;\n}\n#li-2 {\ngrid-column-start: span 2 !important;\n}\n#li-3 {\ngrid-column-end: span 2 !important;\n}\n#div-13 {\ngrid-row-start: copy !important; grid-row-end: copy !important; grid-column-start: copy !important; grid-column-end: copy !important;\n}\n#div-14 {\ngrid-row-start: copy !important; grid-row-end: copy !important; grid-column-start: copy !important; grid-column-end: copy !important;\n}\n#div-15 {\ngrid-row-start: copy !important; grid-row-end: copy !important; grid-column-start: copy !important; grid-column-end: copy !important;\n}\n#div-16 {\ngrid-row-start: copy !important; grid-row-end: copy !important; grid-column-start: copy !important; grid-column-end: copy !important;\n}\n#li-4 {\ngrid-column-start: span 2 !important;\n}\n#li-5 {\ngrid-column-start: span 2 !important;\n}\n#li-6 {\ngrid-column-start: span 2 !important;\n}\n#li-7 {\ngrid-column-start: span 2 !important;\n}\n#li-8 {\ngrid-column-start: span 2 !important;\n}\n#li-9 {\ngrid-column-start: span 2 !important;\n}\n#li-10 {\ngrid-column-start: span 2 !important;\n}\n#li-11 {\ngrid-column-start: span 2 !important;\n}\n#li-12 {\ngrid-column-start: span 2 !important;\n}\n#li-13 {\ngrid-column-start: span 2 !important;\n}\n#li-14 {\ngrid-column-start: span 2 !important;\n}\n#li-15 {\ngrid-column-start: span 2 !important;\n}\n#li-16 {\ngrid-column-start: span 2 !important;\n}\n#li-17 {\ngrid-column-start: span 2 !important;\n}\n#li-18 {\ngrid-column-start: span 2 !important;\n}\n}\n@media (min-width: 990px) {\n#li-3 {\ngrid-column-start: span 2 !important;\n}\n}\n@media (min-width: 1024px) {\n#li-11 {\ngrid-column-end: -2 !important;\n}\n}\n',
        }}
      />

      <main
        className="overflow-hidden text-slate-900 md:pt-0"
        style={{
          textEmphasisPosition: 'auto',
        }}
      >
        <div
          className="grid grid-rows-[17.38rem] py-14 text-center text-2xl font-bold text-slate-900 min-[760px]:pt-24 md:grid-cols-[2fr_[content]_10fr_2fr] md:pb-20 md:pl-0 md:pr-0 md:pt-20 min-[990px]:grid-cols-[2.5fr_[content]_9fr_2.5fr] min-[990px]:pb-6 min-[990px]:pl-0 min-[990px]:pr-0 min-[990px]:pt-6 lg:grid-cols-[2.8fr_[content]_8.4fr_2.8fr] lg:pb-24 lg:pl-0 lg:pr-0 lg:pt-24 min-[1200px]:pt-36 min-[1440px]:pb-24 min-[1440px]:pt-24 min-[1512px]:pt-40 min-[1920px]:pt-48"
          id="div-1"
        >
          <article
            className="min-[990px]:pb-6 min-[990px]:pl-0 min-[990px]:pr-0 min-[990px]:pt-6"
            style={{
              gridColumn: 'content',
            }}
          >
            <h1 className="min-[990px]:pb-6 min-[990px]:pl-0 min-[990px]:pr-0 min-[990px]:pt-6">
              <span className="text-[3.63rem] leading-none">
                The complete automated and human customer service solution
              </span>
            </h1>
          </article>
        </div>
        <div
          className="grid grid-cols-[repeat(14,_1fr)] grid-rows-[43.88rem] py-14 text-slate-900 md:grid-cols-[[left-gutter]_1fr_[content]_12fr_[right-gutter]_1fr] md:pb-20 md:pl-0 md:pr-0 md:pt-20 min-[990px]:pb-20 min-[990px]:pt-20 lg:pb-24 lg:pt-24 min-[1440px]:pb-24 min-[1440px]:pt-24"
          id="div-2"
        >
          <div
            className="col-start-1 grid w-full grid-cols-[repeat(14,_1fr)] grid-rows-[43.88rem] items-center md:relative md:mb-0 md:ml-auto md:mr-auto md:mt-0 md:max-w-[80.63rem] md:grid-cols-[repeat(12,_1fr)] md:pl-0 md:pr-0"
            id="div-3"
            style={{
              gridColumnEnd: 'span 14',
            }}
          >
            <div
              className="col-start-2 row-start-1 row-end-auto grid self-center md:col-start-1 md:row-start-1 md:row-end-auto md:block"
              id="div-4"
              style={{
                gridColumnEnd: 'span 12',
              }}
            >
              <h2
                className="text-2xl font-bold"
                style={{
                  wordBreak: 'break-word',
                }}
              >
                <span className="text-[2.38rem] leading-none">Our company</span>
              </h2>
              <div
                className="mt-5 text-[1.75rem] leading-8 md:mb-0 md:ml-0 md:mr-0 md:mt-6"
                id="div-5"
              >
                <span>
                  <div>
                    <p className="mb-4">
                      Strong customer relationships are more important than
                      ever. But the scale and nature of online business,
                      combined with rising customer expectations, makes it
                      difficult to build—and keep—those connections.
                    </p>
                    That's why we're here. Customer service and support teams at
                    more than 25,000 businesses use Intercom's complete customer
                    service solution every day to drive faster growth through
                    better relationships.
                  </div>
                </span>
              </div>
            </div>
            <div
              className="col-start-2 row-start-2 row-end-auto mt-10 grid-cols-[31.88rem] grid-rows-[31.88rem] overflow-hidden rounded-3xl md:col-start-7 md:row-start-1 md:row-end-auto md:mt-0 md:grid md:items-center"
              id="div-6"
              style={{
                gridColumnEnd: 'span 12',
              }}
            >
              <div className="overflow-hidden rounded-3xl">
                <picture
                  className="max-h-full max-w-full"
                  style={{
                    display: 'inherit',
                  }}
                >
                  <source
                    className="bg-black/[0]"
                    srcSet="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/dOgWLwoLavnj19QHz20eH/dfbeff09b6243ec191ed48fe58d992ff/BRP_CareersHero.jpg?w=1200&h=1200&r=25&fm=webp"
                    type="image/webp"
                  />
                  <img
                    className="h-auto max-h-[inherit] w-auto max-w-[inherit] md:mt-0"
                    src="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/dOgWLwoLavnj19QHz20eH/dfbeff09b6243ec191ed48fe58d992ff/BRP_CareersHero.jpg?w=1200&h=1200&r=25"
                    style={{
                      aspectRatio: 'auto 1200 / 1200',
                    }}
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>
        <div className="relative grid-rows-[12.50rem] bg-blue-200 py-14 text-slate-900 md:grid md:grid-cols-[1fr_[content]_12fr_1fr] md:pb-20 md:pt-20 min-[990px]:pb-20 min-[990px]:pt-20 lg:pb-24 lg:pt-24 min-[1440px]:pb-24 min-[1440px]:pt-24">
          <span
            className="absolute bottom-[25.13rem] left-0 right-[74.38rem] top-0 -m-0 h-0 w-0 overflow-hidden text-[3.63rem] font-bold leading-none"
            style={{
              clipPath: 'inset(50%)',
            }}
          >
            <span> Heading is Required</span>
          </span>
          <ul
            className="grid list-none grid-rows-[12.50rem] justify-items-center gap-x-4 gap-y-16 md:mb-0 md:ml-auto md:mr-auto md:mt-0 md:grid-cols-[repeat(4,_minmax(auto,_8.75rem))] min-[990px]:grid-cols-[repeat(6,_minmax(auto,_8.75rem))]"
            id="ul-1"
          >
            <li
              className="list-item justify-self-end md:col-end-auto min-[990px]:max-w-none"
              id="li-1"
            >
              <div className="flex flex-col content-center justify-center px-7 py-5 text-center min-[990px]:min-h-[12.50rem] min-[990px]:p-7">
                <div className="flex justify-center text-7xl font-bold">
                  <div>
                    25
                    <span className="text-[2.50rem] leading-none">k+</span>
                  </div>
                </div>
                <div className="-mt-1 flex flex-col">
                  <div className="inline-block">paying customers</div>
                </div>
              </div>
            </li>
            <li
              className="list-item justify-self-center md:col-end-auto min-[990px]:max-w-none"
              id="li-2"
            >
              <div className="flex flex-col content-center justify-center px-7 py-5 text-center min-[990px]:min-h-[12.50rem] min-[990px]:p-7">
                <div className="flex justify-center text-7xl font-bold">
                  2011
                </div>
                <div className="-mt-1 flex flex-col">
                  <div className="inline-block">Founded</div>
                </div>
              </div>
            </li>
            <li
              className="list-item md:col-start-2 min-[990px]:col-end-auto min-[990px]:max-w-none"
              id="li-3"
            >
              <div className="flex flex-col content-center justify-center px-7 py-5 text-center min-[990px]:min-h-[12.50rem] min-[990px]:p-7">
                <div className="flex justify-center text-7xl font-bold">
                  <div>
                    8<span className="text-[2.50rem] leading-none">x</span>
                  </div>
                </div>
                <div className="-mt-1 flex flex-col">
                  <div className="inline-block">Forbes Cloud 100 Honoree</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="px-5 py-14 text-slate-900 md:pb-20 md:pl-8 md:pr-8 md:pt-20 min-[990px]:pb-20 min-[990px]:pt-20 lg:pb-24 lg:pl-10 lg:pr-10 lg:pt-24 min-[1440px]:pb-24 min-[1440px]:pt-24">
          <div className="relative m-auto grid max-w-[80.63rem] grid-cols-[repeat(6,_1fr)] grid-rows-[63.8px_676.033px] gap-x-8 md:grid-cols-[repeat(12,_1fr)]">
            <header
              className="col-start-1 m-auto max-w-full text-2xl font-bold"
              style={{
                gridColumnEnd: '-1',
              }}
            >
              <h2 className="text-center">
                <span className="text-[3.63rem] leading-none">Our offices</span>
              </h2>
            </header>
            <ol
              className="col-start-1 mt-16 flex max-w-full list-decimal flex-wrap justify-center gap-7"
              style={{
                gridColumnEnd: '-1',
              }}
            >
              <li className="list-item w-full basis-[calc(33.33%_-_18.6667px)]">
                <div
                  className="flex h-full flex-col rounded-lg bg-zinc-100 p-9"
                  id="div-7"
                >
                  <div className="inline-block w-16">
                    <span className="relative inline-block">
                      <img
                        className="h-16 w-16"
                        src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27140%27%20height=%27140%27/%3e"
                      />
                      <img
                        className="absolute bottom-0 left-0 top-0 h-16 w-16"
                        src="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/7gCER8IzV7GbQd7EysJwUE/8d12554a394f6c3571e9dfc6594ed13d/SanFrancisco_Icon_2x.png"
                        srcSet="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/7gCER8IzV7GbQd7EysJwUE/8d12554a394f6c3571e9dfc6594ed13d/SanFrancisco_Icon_2x.png 1x, //images.ctfassets.net/xny2w179f4ki/7gCER8IzV7GbQd7EysJwUE/8d12554a394f6c3571e9dfc6594ed13d/SanFrancisco_Icon_2x.png 2x"
                      />
                    </span>
                  </div>
                  <h4 className="mt-5 text-[1.75rem] font-bold leading-8">
                    <span>San Francisco</span>
                  </h4>
                  <div className="mt-5">
                    <p>
                      55 2nd Street, 4th Floor,
                      <br /> San Francisco, CA 94105
                    </p>
                  </div>
                </div>
              </li>
              <li className="list-item w-full basis-[calc(33.33%_-_18.6667px)]">
                <div
                  className="flex h-full flex-col rounded-lg bg-zinc-100 p-9"
                  id="div-8"
                >
                  <div className="inline-block w-16">
                    <span className="relative inline-block">
                      <img
                        className="h-16 w-16"
                        src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27140%27%20height=%27140%27/%3e"
                      />
                      <img
                        className="absolute bottom-0 left-0 top-0 h-16 w-16"
                        src="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/gCjVPq2HLkb6agNXWk2lM/0f37bf2f332f1b86d496e17bdd305ab6/London_Icon_2x.png"
                        srcSet="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/gCjVPq2HLkb6agNXWk2lM/0f37bf2f332f1b86d496e17bdd305ab6/London_Icon_2x.png 1x, //images.ctfassets.net/xny2w179f4ki/gCjVPq2HLkb6agNXWk2lM/0f37bf2f332f1b86d496e17bdd305ab6/London_Icon_2x.png 2x"
                      />
                    </span>
                  </div>
                  <h4 className="mt-5 text-[1.75rem] font-bold leading-8">
                    <span>London</span>
                  </h4>
                  <div className="mt-5">
                    9th Floor, The Warehouse, 211 Old St, London EC1V 9NR,
                    United Kingdom
                  </div>
                </div>
              </li>
              <li className="list-item w-full basis-[calc(33.33%_-_18.6667px)]">
                <div
                  className="flex h-full flex-col rounded-lg bg-zinc-100 p-9"
                  id="div-9"
                >
                  <div className="inline-block w-16">
                    <span className="relative inline-block">
                      <img
                        className="h-16 w-16"
                        src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27140%27%20height=%27140%27/%3e"
                      />
                      <img
                        className="absolute bottom-0 left-0 top-0 h-16 w-16"
                        src="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/pAc489mMvG5k2zmYEPtRL/b66bad118dd5f682c423c447a3c0f6e0/Chicago_Icon_2x.png"
                        srcSet="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/pAc489mMvG5k2zmYEPtRL/b66bad118dd5f682c423c447a3c0f6e0/Chicago_Icon_2x.png 1x, //images.ctfassets.net/xny2w179f4ki/pAc489mMvG5k2zmYEPtRL/b66bad118dd5f682c423c447a3c0f6e0/Chicago_Icon_2x.png 2x"
                      />
                    </span>
                  </div>
                  <h4 className="mt-5 text-[1.75rem] font-bold leading-8">
                    <span>Chicago</span>
                  </h4>
                  <div className="mt-5">
                    <p>
                      1330 W. Fulton Market, Suite 750,
                      <br /> Chicago, IL 60607
                    </p>
                  </div>
                </div>
              </li>
              <li className="list-item w-full basis-[calc(33.33%_-_18.6667px)]">
                <div
                  className="flex h-full flex-col rounded-lg bg-zinc-100 p-9"
                  id="div-10"
                >
                  <div className="inline-block w-16">
                    <span className="relative inline-block">
                      <img
                        className="h-16 w-16"
                        src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27140%27%20height=%27140%27/%3e"
                      />
                      <img
                        className="absolute bottom-0 left-0 top-0 h-16 w-16"
                        src="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/5Uo0oJGN6aQzJvksm9qgDz/d3c6f3aa226eedf7d1f1b4289e22cffa/Dublin_Icon_2x.png"
                        srcSet="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/5Uo0oJGN6aQzJvksm9qgDz/d3c6f3aa226eedf7d1f1b4289e22cffa/Dublin_Icon_2x.png 1x, //images.ctfassets.net/xny2w179f4ki/5Uo0oJGN6aQzJvksm9qgDz/d3c6f3aa226eedf7d1f1b4289e22cffa/Dublin_Icon_2x.png 2x"
                      />
                    </span>
                  </div>
                  <h4 className="mt-5 text-[1.75rem] font-bold leading-8">
                    <span>Dublin</span>
                  </h4>
                  <div className="mt-5">
                    124 St Stephen's Green, Dublin 2, D02 C628
                  </div>
                </div>
              </li>
              <li className="list-item w-full basis-[calc(33.33%_-_18.6667px)]">
                <div
                  className="flex h-full flex-col rounded-lg bg-zinc-100 p-9"
                  id="div-11"
                >
                  <div className="inline-block w-16">
                    <span className="relative inline-block">
                      <img
                        className="h-16 w-16"
                        src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27140%27%20height=%27140%27/%3e"
                      />
                      <img
                        className="absolute bottom-0 left-0 top-0 h-16 w-16"
                        src="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/73H5hcM0aiZlH60938yVon/7a40cf9dfbe3718a7403190c4f2c9338/Sydney_Icon_2x.png"
                        srcSet="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/73H5hcM0aiZlH60938yVon/7a40cf9dfbe3718a7403190c4f2c9338/Sydney_Icon_2x.png 1x, //images.ctfassets.net/xny2w179f4ki/73H5hcM0aiZlH60938yVon/7a40cf9dfbe3718a7403190c4f2c9338/Sydney_Icon_2x.png 2x"
                      />
                    </span>
                  </div>
                  <h4 className="mt-5 text-[1.75rem] font-bold leading-8">
                    <span>Sydney</span>
                  </h4>
                  <div className="mt-5">
                    <p>
                      285A Crown St. Surry Hills NSW 2010, Australia, 1st Floor{' '}
                      <br />
                      Sydney
                    </p>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </div>
        <div
          className="block grid-cols-[1fr] md:block md:grid-cols-[1fr_[content]_10fr_1fr]"
          id="div-12"
        >
          <div
            className="py-14 md:mb-0 md:ml-auto md:mr-auto md:mt-0 md:max-w-[62.50rem] md:pb-20 md:pt-20 min-[990px]:pb-20 min-[990px]:pt-20 lg:pb-24 lg:pt-24 min-[1440px]:pb-24 min-[1440px]:pt-24"
            style={{
              gridColumn: 'content',
              gridRow: 'content',
            }}
          >
            <h2 className="mb-10 text-center text-2xl font-bold md:mb-16 md:ml-auto md:mr-auto md:mt-5 md:max-w-[31.25rem]">
              <span className="text-[3.63rem] leading-none">
                Press Highlights
              </span>
            </h2>
            <ul className="list-none text-[0.50rem]">
              <li className="mb-10 grid-cols-[0px_1000px] grid-rows-[0px_125.167px] md:mb-14 md:grid md:items-center md:justify-start lg:mb-16">
                <div className="md:ml-28 md:pl-8 md:pr-8 lg:ml-24" id="div-13">
                  <h3 className="mb-4 text-[0.63rem] font-bold md:mb-3 md:mt-0 lg:mb-4">
                    <span className="text-[2.38rem] leading-none">
                      Restarting the start-up: Why Eoghan McCabe returned to
                      lead Intercom
                    </span>
                  </h3>
                  <a
                    className="inline-flex items-center justify-center gap-2 text-slate-900"
                    href="https://thecurrency.news/articles/130098/restarting-the-start-up-why-eoghan-mccabe-returned-to-lead-intercom/"
                  >
                    <span className="cursor-pointer text-base font-bold">
                      Read the article
                    </span>
                    <svg
                      className="h-2.5 w-3 cursor-pointer"
                      fill="none"
                      height="10"
                      viewBox="0 0 13 10"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 5L6 1"
                        fill="none"
                        stroke="#081d34"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1 5L11 5"
                        fill="none"
                        stroke="#081d34"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </li>
              <li className="mb-10 grid-cols-[0px_959.383px] grid-rows-[0px_80.3333px] md:mb-14 md:grid md:items-center md:justify-start lg:mb-16">
                <div className="md:ml-28 md:pl-8 md:pr-8 lg:ml-24" id="div-14">
                  <h3 className="mb-4 text-[0.63rem] font-bold md:mb-3 md:mt-0 lg:mb-4">
                    <span className="text-[2.38rem] leading-none">
                      The 6 next big things in enterprise technology{' '}
                    </span>
                  </h3>
                  <a
                    className="inline-flex items-center justify-center gap-2 text-slate-900"
                    href="https://www.forbes.com/lists/cloud100/?sh=3932925c7d9c"
                  >
                    <span className="cursor-pointer text-base font-bold">
                      Read the article
                    </span>
                    <svg
                      className="h-2.5 w-3 cursor-pointer"
                      fill="none"
                      height="10"
                      viewBox="0 0 13 10"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 5L6 1"
                        fill="none"
                        stroke="#081d34"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1 5L11 5"
                        fill="none"
                        stroke="#081d34"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </li>
              <li className="mb-10 grid-cols-[0px_565.45px] grid-rows-[0px_80.3333px] md:mb-14 md:grid md:items-center md:justify-start lg:mb-16">
                <div className="md:ml-28 md:pl-8 md:pr-8 lg:ml-24" id="div-15">
                  <h3 className="mb-4 text-[0.63rem] font-bold md:mb-3 md:mt-0 lg:mb-4">
                    <span className="text-[2.38rem] leading-none">
                      Intercom’s AI Evolution
                    </span>
                  </h3>
                  <a
                    className="inline-flex items-center justify-center gap-2 text-slate-900"
                    href="https://thegeneralist.substack.com/p/intercom-des-traynor?utm_medium=email&utm_source=substack"
                  >
                    <span className="cursor-pointer text-base font-bold">
                      Read the article
                    </span>
                    <svg
                      className="h-2.5 w-3 cursor-pointer"
                      fill="none"
                      height="10"
                      viewBox="0 0 13 10"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 5L6 1"
                        fill="none"
                        stroke="#081d34"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1 5L11 5"
                        fill="none"
                        stroke="#081d34"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </li>
              <li className="mb-10 grid-cols-[0px_1000px] grid-rows-[0px_125.167px] md:mb-14 md:grid md:items-center md:justify-start lg:mb-16">
                <div className="md:ml-28 md:pl-8 md:pr-8 lg:ml-24" id="div-16">
                  <h3 className="mb-4 text-[0.63rem] font-bold md:mb-3 md:mt-0 lg:mb-4">
                    <span className="text-[2.38rem] leading-none">
                      Cutting through the noise to get to the reality of
                      customer service AI
                    </span>
                  </h3>
                  <a
                    className="inline-flex items-center justify-center gap-2 text-slate-900"
                    href="https://www.forbes.com/sites/adrianswinscoe/2024/10/12/cutting-through-the-noise-to-get-to-the-reality-of-customer-service-ai/"
                  >
                    <span className="cursor-pointer text-base font-bold">
                      Read the article
                    </span>
                    <svg
                      className="h-2.5 w-3 cursor-pointer"
                      fill="none"
                      height="10"
                      viewBox="0 0 13 10"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 5L6 1"
                        fill="none"
                        stroke="#081d34"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1 5L11 5"
                        fill="none"
                        stroke="#081d34"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="m-auto grid grid-cols-[1fr_[content]_12fr_1fr] grid-rows-[7.75rem] py-14 md:pb-20 md:pt-20 min-[990px]:pb-20 min-[990px]:pt-20 lg:pb-24 lg:pt-24 min-[1440px]:pb-24 min-[1440px]:pt-24">
          <ul
            className="row-start-1 m-auto flex max-w-[80.63rem] list-none flex-wrap justify-center gap-x-20 gap-y-10"
            style={{
              gridColumn: 'content',
            }}
          >
            <li className="list-item">
              <picture
                className="max-h-full max-w-full"
                style={{
                  display: 'inherit',
                }}
              >
                <source
                  className="bg-black/[0]"
                  srcSet="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/4OilwPgA5BkrmY2wojx4e/31bdda00795e99ccf68332871a77bdfc/G2_-_Top_100.png?w=221&h=250&fm=webp"
                  type="image/webp"
                />
                <img
                  className="h-auto max-h-[inherit] w-auto max-w-[inherit]"
                  src="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/4OilwPgA5BkrmY2wojx4e/31bdda00795e99ccf68332871a77bdfc/G2_-_Top_100.png?w=221&h=250"
                  style={{
                    aspectRatio: 'auto 221 / 250',
                  }}
                />
              </picture>
            </li>
            <li className="list-item">
              <picture
                className="max-h-full max-w-full"
                style={{
                  display: 'inherit',
                }}
              >
                <source
                  className="bg-black/[0]"
                  srcSet="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/2B7mTHbEb2V5Ycmqyu0c5G/e047b0ec4d8bb30653c7ae5cfddf092c/G2_-_Summer_Leader.png?w=224&h=250&fm=webp"
                  type="image/webp"
                />
                <img
                  className="h-auto max-h-[inherit] w-auto max-w-[inherit]"
                  src="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/2B7mTHbEb2V5Ycmqyu0c5G/e047b0ec4d8bb30653c7ae5cfddf092c/G2_-_Summer_Leader.png?w=224&h=250"
                  style={{
                    aspectRatio: 'auto 224 / 250',
                  }}
                />
              </picture>
            </li>
            <li className="list-item">
              <picture
                className="max-h-full max-w-full"
                style={{
                  display: 'inherit',
                }}
              >
                <source
                  className="bg-black/[0]"
                  srcSet="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/1MNEXMUnLQF8SFltNmMqkd/1c0c745880c97688011c33547ce81163/Users_Love_Us.png?w=232&h=250&fm=webp"
                  type="image/webp"
                />
                <img
                  className="h-auto max-h-[inherit] w-auto max-w-[inherit]"
                  src="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/1MNEXMUnLQF8SFltNmMqkd/1c0c745880c97688011c33547ce81163/Users_Love_Us.png?w=232&h=250"
                  style={{
                    aspectRatio: 'auto 232 / 250',
                  }}
                />
              </picture>
            </li>
            <li className="list-item">
              <picture
                className="max-h-full max-w-full"
                style={{
                  display: 'inherit',
                }}
              >
                <source
                  className="bg-black/[0]"
                  srcSet="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/1fnraDtt5JAqoZrYgJyi7K/8a9fa1285036288fd85ccb93aafe9ef7/TrustRadius_-_Most_Loved.png?w=218&h=250&fm=webp"
                  type="image/webp"
                />
                <img
                  className="h-auto max-h-[inherit] w-auto max-w-[inherit]"
                  src="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/1fnraDtt5JAqoZrYgJyi7K/8a9fa1285036288fd85ccb93aafe9ef7/TrustRadius_-_Most_Loved.png?w=218&h=250"
                  style={{
                    aspectRatio: 'auto 218 / 250',
                  }}
                />
              </picture>
            </li>
            <li className="list-item">
              <picture
                className="max-h-full max-w-full"
                style={{
                  display: 'inherit',
                }}
              >
                <source
                  className="bg-black/[0]"
                  srcSet="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/420V68F20qmSYQE96by9cf/bd8274c3a130dfcb506af0089181845e/TrustRadius_-_Top_Rated.png?w=217&h=250&fm=webp"
                  type="image/webp"
                />
                <img
                  className="h-auto max-h-[inherit] w-auto max-w-[inherit]"
                  src="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/420V68F20qmSYQE96by9cf/bd8274c3a130dfcb506af0089181845e/TrustRadius_-_Top_Rated.png?w=217&h=250"
                  style={{
                    aspectRatio: 'auto 217 / 250',
                  }}
                />
              </picture>
            </li>
          </ul>
        </div>
        <div className="m-auto grid grid-cols-[1fr_[content]_12fr_1fr] grid-rows-[63.8px_1657.95px] py-14 text-slate-900 md:pb-20 md:pt-20 min-[990px]:pb-20 min-[990px]:pt-20 lg:pb-24 lg:pt-24 min-[1440px]:pb-24 min-[1440px]:pt-24">
          <div
            className="row-start-1 m-auto max-w-[64.25rem] text-center text-2xl font-bold"
            style={{
              gridColumn: 'content',
            }}
          >
            <h2>
              <span className="text-[3.63rem] leading-none">
                Our leadership
              </span>
            </h2>
          </div>
          <div
            className="row-start-1 mx-auto mt-10 grid max-w-[80.63rem] grid-rows-[513.45px_539.85px_460.65px] gap-10 text-black md:mt-16 md:grid-cols-[repeat(4,_1fr)] lg:grid-cols-[repeat(6,_1fr)]"
            style={{
              gridColumn: 'content',
            }}
          >
            <li className="list-item md:col-end-auto" id="li-4">
              <a
                className="flex h-full w-full justify-center"
                href="https://www.intercom.com/about/eoghan-mccabe"
              />
              <div
                className="flex h-full w-full cursor-pointer flex-col"
                id="div-17"
              >
                <a
                  className="flex h-full w-full justify-center"
                  href="https://www.intercom.com/about/eoghan-mccabe"
                >
                  <div className="relative w-full overflow-hidden rounded-2xl">
                    <span className="relative">
                      <img
                        className="absolute bottom-0 left-0 top-0 h-48 w-80"
                        src="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2CUv8e6mBN2tDMgnssyVat%2F0f40d0b735ef8403868a49b4a00a5be0%2FEoghan.jpg&w=1440&q=100"
                        srcSet="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2CUv8e6mBN2tDMgnssyVat%2F0f40d0b735ef8403868a49b4a00a5be0%2FEoghan.jpg&w=256&q=100 256w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2CUv8e6mBN2tDMgnssyVat%2F0f40d0b735ef8403868a49b4a00a5be0%2FEoghan.jpg&w=384&q=100 384w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2CUv8e6mBN2tDMgnssyVat%2F0f40d0b735ef8403868a49b4a00a5be0%2FEoghan.jpg&w=512&q=100 512w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2CUv8e6mBN2tDMgnssyVat%2F0f40d0b735ef8403868a49b4a00a5be0%2FEoghan.jpg&w=768&q=100 768w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2CUv8e6mBN2tDMgnssyVat%2F0f40d0b735ef8403868a49b4a00a5be0%2FEoghan.jpg&w=990&q=100 990w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2CUv8e6mBN2tDMgnssyVat%2F0f40d0b735ef8403868a49b4a00a5be0%2FEoghan.jpg&w=1024&q=100 1024w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2CUv8e6mBN2tDMgnssyVat%2F0f40d0b735ef8403868a49b4a00a5be0%2FEoghan.jpg&w=1440&q=100 1440w"
                      />
                    </span>
                  </div>
                </a>
                <div className="mt-8 flex flex-grow flex-col">
                  <a
                    className="flex h-full w-full justify-center"
                    href="https://www.intercom.com/about/eoghan-mccabe"
                  >
                    <div
                      className="text-xl font-bold"
                      style={{
                        wordBreak: 'break-word',
                      }}
                    >
                      <span>Eoghan McCabe, CEO and Chairman of the Board</span>
                    </div>
                    <div className="mb-auto mt-3 md:mt-5">
                      Eoghan is CEO, co-founder and Chairman of the Board at
                      Intercom. Before Intercom he founded Contrast, a software
                      design consultancy, and Exceptional, a developer tool
                      company acquired by Rackspace.
                    </div>
                  </a>
                  <div className="mt-6 inline-block text-slate-900 md:mt-7">
                    <a
                      className="flex h-full w-full justify-center"
                      href="https://www.intercom.com/about/eoghan-mccabe"
                    />
                    <a
                      className="inline-flex items-center justify-center gap-2"
                      href="https://www.intercom.com/about/eoghan-mccabe"
                    >
                      <span className="text-base font-bold">
                        Read Eoghan's full bio
                      </span>
                      <svg
                        className="h-2.5 w-3"
                        fill="none"
                        height="10"
                        viewBox="0 0 13 10"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 5L6 1"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 5L11 5"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-item md:col-end-auto" id="li-5">
              <a
                className="flex h-full w-full justify-center"
                href="https://www.intercom.com/about/des-traynor"
              />
              <div
                className="flex h-full w-full cursor-pointer flex-col"
                id="div-18"
              >
                <a
                  className="flex h-full w-full justify-center"
                  href="https://www.intercom.com/about/des-traynor"
                >
                  <div className="relative w-full overflow-hidden rounded-2xl">
                    <span className="relative">
                      <img
                        className="absolute bottom-0 left-0 top-0 h-48 w-80"
                        src="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F55YP1JzqJJ1TM80seJcSS%2F099c452e75a028a3ba0a0b7f92d6b94d%2FDes.jpeg&w=1440&q=100"
                        srcSet="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F55YP1JzqJJ1TM80seJcSS%2F099c452e75a028a3ba0a0b7f92d6b94d%2FDes.jpeg&w=256&q=100 256w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F55YP1JzqJJ1TM80seJcSS%2F099c452e75a028a3ba0a0b7f92d6b94d%2FDes.jpeg&w=384&q=100 384w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F55YP1JzqJJ1TM80seJcSS%2F099c452e75a028a3ba0a0b7f92d6b94d%2FDes.jpeg&w=512&q=100 512w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F55YP1JzqJJ1TM80seJcSS%2F099c452e75a028a3ba0a0b7f92d6b94d%2FDes.jpeg&w=768&q=100 768w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F55YP1JzqJJ1TM80seJcSS%2F099c452e75a028a3ba0a0b7f92d6b94d%2FDes.jpeg&w=990&q=100 990w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F55YP1JzqJJ1TM80seJcSS%2F099c452e75a028a3ba0a0b7f92d6b94d%2FDes.jpeg&w=1024&q=100 1024w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F55YP1JzqJJ1TM80seJcSS%2F099c452e75a028a3ba0a0b7f92d6b94d%2FDes.jpeg&w=1440&q=100 1440w"
                      />
                    </span>
                  </div>
                </a>
                <div className="mt-8 flex flex-grow flex-col">
                  <a
                    className="flex h-full w-full justify-center"
                    href="https://www.intercom.com/about/des-traynor"
                  >
                    <div
                      className="text-xl font-bold"
                      style={{
                        wordBreak: 'break-word',
                      }}
                    >
                      <span>
                        <b className="font-black">
                          Des Traynor, Chief Strategy Officer & Co-founder
                        </b>
                      </span>
                    </div>
                    <div className="mb-auto mt-3 md:mt-5">
                      Des leads R&D, including Product, Engineering, and Design.
                      Previously, he co-founded Exceptional, and was a UX
                      designer for web apps.
                    </div>
                  </a>
                  <div className="mt-6 inline-block text-slate-900 md:mt-7">
                    <a
                      className="flex h-full w-full justify-center"
                      href="https://www.intercom.com/about/des-traynor"
                    />
                    <a
                      className="inline-flex items-center justify-center gap-2"
                      href="https://www.intercom.com/about/des-traynor"
                    >
                      <span className="text-base font-bold">
                        Read Des's full bio{' '}
                      </span>
                      <svg
                        className="h-2.5 w-3"
                        fill="none"
                        height="10"
                        viewBox="0 0 13 10"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 5L6 1"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 5L11 5"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-item md:col-end-auto" id="li-6">
              <a
                className="flex h-full w-full justify-center"
                href="https://www.intercom.com/about/paul-adams"
              />
              <div
                className="flex h-full w-full cursor-pointer flex-col"
                id="div-19"
              >
                <a
                  className="flex h-full w-full justify-center"
                  href="https://www.intercom.com/about/paul-adams"
                >
                  <div className="relative w-full overflow-hidden rounded-2xl">
                    <span className="relative">
                      <img
                        className="absolute bottom-0 left-0 top-0 h-48 w-80"
                        src="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F40Syzx8MUbLz77gxZ2Lqs7%2Fbf19f9bca1be663476c92beee2196a87%2FPaul.jpg&w=1440&q=100"
                        srcSet="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F40Syzx8MUbLz77gxZ2Lqs7%2Fbf19f9bca1be663476c92beee2196a87%2FPaul.jpg&w=256&q=100 256w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F40Syzx8MUbLz77gxZ2Lqs7%2Fbf19f9bca1be663476c92beee2196a87%2FPaul.jpg&w=384&q=100 384w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F40Syzx8MUbLz77gxZ2Lqs7%2Fbf19f9bca1be663476c92beee2196a87%2FPaul.jpg&w=512&q=100 512w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F40Syzx8MUbLz77gxZ2Lqs7%2Fbf19f9bca1be663476c92beee2196a87%2FPaul.jpg&w=768&q=100 768w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F40Syzx8MUbLz77gxZ2Lqs7%2Fbf19f9bca1be663476c92beee2196a87%2FPaul.jpg&w=990&q=100 990w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F40Syzx8MUbLz77gxZ2Lqs7%2Fbf19f9bca1be663476c92beee2196a87%2FPaul.jpg&w=1024&q=100 1024w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F40Syzx8MUbLz77gxZ2Lqs7%2Fbf19f9bca1be663476c92beee2196a87%2FPaul.jpg&w=1440&q=100 1440w"
                      />
                    </span>
                  </div>
                </a>
                <div className="mt-8 flex flex-grow flex-col">
                  <a
                    className="flex h-full w-full justify-center"
                    href="https://www.intercom.com/about/paul-adams"
                  >
                    <div
                      className="text-xl font-bold"
                      style={{
                        wordBreak: 'break-word',
                      }}
                    >
                      <span>
                        <b className="font-black">
                          Paul Adams, Chief Product Officer
                        </b>
                      </span>
                    </div>
                    <div className="mb-auto mt-3 md:mt-5">
                      Paul is Intercom’s Chief Product Officer, leading the
                      Product Management, Product Design, Data Science, and
                      Research teams. He previously held leadership, product and
                      design roles at Facebook, Google and Dyson.
                    </div>
                  </a>
                  <div className="mt-6 inline-block text-slate-900 md:mt-7">
                    <a
                      className="flex h-full w-full justify-center"
                      href="https://www.intercom.com/about/paul-adams"
                    />
                    <a
                      className="inline-flex items-center justify-center gap-2"
                      href="https://www.intercom.com/about/paul-adams"
                    >
                      <span className="text-base font-bold">
                        Read Paul's full bio
                      </span>
                      <svg
                        className="h-2.5 w-3"
                        fill="none"
                        height="10"
                        viewBox="0 0 13 10"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 5L6 1"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 5L11 5"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-item md:col-end-auto" id="li-7">
              <a
                className="flex h-full w-full justify-center"
                href="https://www.intercom.com/about/archana-agrawal"
              />
              <div
                className="flex h-full w-full cursor-pointer flex-col"
                id="div-20"
              >
                <a
                  className="flex h-full w-full justify-center"
                  href="https://www.intercom.com/about/archana-agrawal"
                >
                  <div className="relative w-full overflow-hidden rounded-2xl">
                    <span className="relative">
                      <img
                        className="absolute bottom-0 left-0 top-0 h-48 w-80"
                        src="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7wlPYB13yCUBHfLKPwhLS2%2Fe0d966eb84243d422226b4f5b654f6fb%2FArchana__1_.jpg&w=1440&q=100"
                        srcSet="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7wlPYB13yCUBHfLKPwhLS2%2Fe0d966eb84243d422226b4f5b654f6fb%2FArchana__1_.jpg&w=256&q=100 256w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7wlPYB13yCUBHfLKPwhLS2%2Fe0d966eb84243d422226b4f5b654f6fb%2FArchana__1_.jpg&w=384&q=100 384w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7wlPYB13yCUBHfLKPwhLS2%2Fe0d966eb84243d422226b4f5b654f6fb%2FArchana__1_.jpg&w=512&q=100 512w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7wlPYB13yCUBHfLKPwhLS2%2Fe0d966eb84243d422226b4f5b654f6fb%2FArchana__1_.jpg&w=768&q=100 768w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7wlPYB13yCUBHfLKPwhLS2%2Fe0d966eb84243d422226b4f5b654f6fb%2FArchana__1_.jpg&w=990&q=100 990w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7wlPYB13yCUBHfLKPwhLS2%2Fe0d966eb84243d422226b4f5b654f6fb%2FArchana__1_.jpg&w=1024&q=100 1024w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7wlPYB13yCUBHfLKPwhLS2%2Fe0d966eb84243d422226b4f5b654f6fb%2FArchana__1_.jpg&w=1440&q=100 1440w"
                      />
                    </span>
                  </div>
                </a>
                <div className="mt-8 flex flex-grow flex-col">
                  <a
                    className="flex h-full w-full justify-center"
                    href="https://www.intercom.com/about/archana-agrawal"
                  >
                    <div
                      className="text-xl font-bold"
                      style={{
                        wordBreak: 'break-word',
                      }}
                    >
                      <span>
                        <b className="font-black">Archana Agrawal, President</b>
                      </span>
                    </div>
                    <div className="mb-auto mt-3 md:mt-5">
                      Archana leads Intercom’s go-to-market teams, including
                      Sales, Marketing, Success, and Support. She previously
                      held marketing leadership roles at Airtable and Atlassian,
                      most recently as CMO at Airtable.
                    </div>
                  </a>
                  <div className="mt-6 inline-block text-slate-900 md:mt-7">
                    <a
                      className="flex h-full w-full justify-center"
                      href="https://www.intercom.com/about/archana-agrawal"
                    />
                    <a
                      className="inline-flex items-center justify-center gap-2"
                      href="https://www.intercom.com/about/archana-agrawal"
                    >
                      <span className="text-base font-bold">
                        Read Archana's full bio
                      </span>
                      <svg
                        className="h-2.5 w-3"
                        fill="none"
                        height="10"
                        viewBox="0 0 13 10"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 5L6 1"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 5L11 5"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-item md:col-end-auto" id="li-8">
              <a
                className="flex h-full w-full justify-center"
                href="https://www.intercom.com/about/lauren-cullen"
              />
              <div
                className="flex h-full w-full cursor-pointer flex-col"
                id="div-21"
              >
                <a
                  className="flex h-full w-full justify-center"
                  href="https://www.intercom.com/about/lauren-cullen"
                >
                  <div className="relative w-full overflow-hidden rounded-2xl">
                    <span className="relative">
                      <img
                        className="absolute bottom-0 left-0 top-0 h-48 w-80"
                        src="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7Jzy79yx4YfvOVAyKQWoNL%2F3e6777d4b44dfb52bf10eb513c606395%2F3J6A9198.jpg&w=1440&q=100"
                        srcSet="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7Jzy79yx4YfvOVAyKQWoNL%2F3e6777d4b44dfb52bf10eb513c606395%2F3J6A9198.jpg&w=256&q=100 256w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7Jzy79yx4YfvOVAyKQWoNL%2F3e6777d4b44dfb52bf10eb513c606395%2F3J6A9198.jpg&w=384&q=100 384w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7Jzy79yx4YfvOVAyKQWoNL%2F3e6777d4b44dfb52bf10eb513c606395%2F3J6A9198.jpg&w=512&q=100 512w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7Jzy79yx4YfvOVAyKQWoNL%2F3e6777d4b44dfb52bf10eb513c606395%2F3J6A9198.jpg&w=768&q=100 768w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7Jzy79yx4YfvOVAyKQWoNL%2F3e6777d4b44dfb52bf10eb513c606395%2F3J6A9198.jpg&w=990&q=100 990w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7Jzy79yx4YfvOVAyKQWoNL%2F3e6777d4b44dfb52bf10eb513c606395%2F3J6A9198.jpg&w=1024&q=100 1024w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7Jzy79yx4YfvOVAyKQWoNL%2F3e6777d4b44dfb52bf10eb513c606395%2F3J6A9198.jpg&w=1440&q=100 1440w"
                      />
                    </span>
                  </div>
                </a>
                <div className="mt-8 flex flex-grow flex-col">
                  <a
                    className="flex h-full w-full justify-center"
                    href="https://www.intercom.com/about/lauren-cullen"
                  >
                    <div
                      className="text-xl font-bold"
                      style={{
                        wordBreak: 'break-word',
                      }}
                    >
                      <span>
                        <b className="font-black">
                          Lauren Cullen, Global VP of People
                        </b>
                      </span>
                    </div>
                    <div className="mb-auto mt-3 md:mt-5">
                      Lauren is the Global VP of People at Intercom, leading the
                      People Operations, Total Rewards, People Programs,
                      Business Partners, Recruitment, and Real Estate and
                      Workplace teams. She previously held HR roles at Twitter
                      and Google.{' '}
                    </div>
                  </a>
                  <div className="mt-6 inline-block text-slate-900 md:mt-7">
                    <a
                      className="flex h-full w-full justify-center"
                      href="https://www.intercom.com/about/lauren-cullen"
                    />
                    <a
                      className="inline-flex items-center justify-center gap-2"
                      href="https://www.intercom.com/about/lauren-cullen"
                    >
                      <span className="text-base font-bold">
                        Read Lauren's full bio
                      </span>
                      <svg
                        className="h-2.5 w-3"
                        fill="none"
                        height="10"
                        viewBox="0 0 13 10"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 5L6 1"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 5L11 5"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-item md:col-end-auto" id="li-9">
              <a
                className="flex h-full w-full justify-center"
                href="https://www.intercom.com/about/darragh-curran"
              />
              <div
                className="flex h-full w-full cursor-pointer flex-col"
                id="div-22"
              >
                <a
                  className="flex h-full w-full justify-center"
                  href="https://www.intercom.com/about/darragh-curran"
                >
                  <div className="relative w-full overflow-hidden rounded-2xl">
                    <span className="relative">
                      <img
                        className="absolute bottom-0 left-0 top-0 h-48 w-80"
                        src="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6rNUbKHYEDWJs994gONZlY%2F3a716f026c285e634eea6d9a86d9abab%2FDarragh.jpg&w=1440&q=100"
                        srcSet="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6rNUbKHYEDWJs994gONZlY%2F3a716f026c285e634eea6d9a86d9abab%2FDarragh.jpg&w=256&q=100 256w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6rNUbKHYEDWJs994gONZlY%2F3a716f026c285e634eea6d9a86d9abab%2FDarragh.jpg&w=384&q=100 384w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6rNUbKHYEDWJs994gONZlY%2F3a716f026c285e634eea6d9a86d9abab%2FDarragh.jpg&w=512&q=100 512w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6rNUbKHYEDWJs994gONZlY%2F3a716f026c285e634eea6d9a86d9abab%2FDarragh.jpg&w=768&q=100 768w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6rNUbKHYEDWJs994gONZlY%2F3a716f026c285e634eea6d9a86d9abab%2FDarragh.jpg&w=990&q=100 990w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6rNUbKHYEDWJs994gONZlY%2F3a716f026c285e634eea6d9a86d9abab%2FDarragh.jpg&w=1024&q=100 1024w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6rNUbKHYEDWJs994gONZlY%2F3a716f026c285e634eea6d9a86d9abab%2FDarragh.jpg&w=1440&q=100 1440w"
                      />
                    </span>
                  </div>
                </a>
                <div className="mt-8 flex flex-grow flex-col">
                  <a
                    className="flex h-full w-full justify-center"
                    href="https://www.intercom.com/about/darragh-curran"
                  >
                    <div
                      className="text-xl font-bold"
                      style={{
                        wordBreak: 'break-word',
                      }}
                    >
                      <span>
                        <b className="font-black">
                          Darragh Curran, Chief Technology Officer
                          <br />
                        </b>
                      </span>
                    </div>
                    <div className="mb-auto mt-3 md:mt-5">
                      Darragh leads Intercom’s engineering team. Previously, he
                      worked at Amazon and software design consultancy Contrast.
                    </div>
                  </a>
                  <div className="mt-6 inline-block text-slate-900 md:mt-7">
                    <a
                      className="flex h-full w-full justify-center"
                      href="https://www.intercom.com/about/darragh-curran"
                    />
                    <a
                      className="inline-flex items-center justify-center gap-2"
                      href="https://www.intercom.com/about/darragh-curran"
                    >
                      <span className="text-base font-bold">
                        Read Darragh's full bio
                      </span>
                      <svg
                        className="h-2.5 w-3"
                        fill="none"
                        height="10"
                        viewBox="0 0 13 10"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 5L6 1"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 5L11 5"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-item md:col-end-auto lg:col-end-4" id="li-10">
              <a
                className="flex h-full w-full justify-center"
                href="https://www.intercom.com/about/dan-griggs"
              />
              <div
                className="flex h-full w-full cursor-pointer flex-col"
                id="div-23"
              >
                <a
                  className="flex h-full w-full justify-center"
                  href="https://www.intercom.com/about/dan-griggs"
                >
                  <div className="relative w-full overflow-hidden rounded-2xl">
                    <span className="relative">
                      <img
                        className="absolute bottom-0 left-0 top-0 h-48 w-80"
                        src="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6hplH1zzZhW7lR2RzPTlpk%2F3d51ef3e4283e806d1b9a3e0d5af04ab%2FDan.jpg&w=1440&q=100"
                        srcSet="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6hplH1zzZhW7lR2RzPTlpk%2F3d51ef3e4283e806d1b9a3e0d5af04ab%2FDan.jpg&w=256&q=100 256w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6hplH1zzZhW7lR2RzPTlpk%2F3d51ef3e4283e806d1b9a3e0d5af04ab%2FDan.jpg&w=384&q=100 384w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6hplH1zzZhW7lR2RzPTlpk%2F3d51ef3e4283e806d1b9a3e0d5af04ab%2FDan.jpg&w=512&q=100 512w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6hplH1zzZhW7lR2RzPTlpk%2F3d51ef3e4283e806d1b9a3e0d5af04ab%2FDan.jpg&w=768&q=100 768w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6hplH1zzZhW7lR2RzPTlpk%2F3d51ef3e4283e806d1b9a3e0d5af04ab%2FDan.jpg&w=990&q=100 990w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6hplH1zzZhW7lR2RzPTlpk%2F3d51ef3e4283e806d1b9a3e0d5af04ab%2FDan.jpg&w=1024&q=100 1024w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6hplH1zzZhW7lR2RzPTlpk%2F3d51ef3e4283e806d1b9a3e0d5af04ab%2FDan.jpg&w=1440&q=100 1440w"
                      />
                    </span>
                  </div>
                </a>
                <div className="mt-8 flex flex-grow flex-col">
                  <a
                    className="flex h-full w-full justify-center"
                    href="https://www.intercom.com/about/dan-griggs"
                  >
                    <div
                      className="text-xl font-bold"
                      style={{
                        wordBreak: 'break-word',
                      }}
                    >
                      <span>
                        <b className="font-black">
                          Dan Griggs, Chief Financial Officer
                        </b>
                      </span>
                    </div>
                    <div className="mb-auto mt-3 md:mt-5">
                      Dan leads Intercom’s Finance, Accounting, Business Ops,
                      and Analytics teams to optimize Intercom’s growth. He was
                      previously CFO of Sitecore.
                    </div>
                  </a>
                  <div className="mt-6 inline-block text-slate-900 md:mt-7">
                    <a
                      className="flex h-full w-full justify-center"
                      href="https://www.intercom.com/about/dan-griggs"
                    />
                    <a
                      className="inline-flex items-center justify-center gap-2"
                      href="https://www.intercom.com/about/dan-griggs"
                    >
                      <span className="text-base font-bold">
                        Read Dan's full bio
                      </span>
                      <svg
                        className="h-2.5 w-3"
                        fill="none"
                        height="10"
                        viewBox="0 0 13 10"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 5L6 1"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 5L11 5"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-item md:col-end-auto" id="li-11">
              <a
                className="flex h-full w-full justify-center"
                href="https://www.intercom.com/about/ciaran-lee"
              />
              <div
                className="flex h-full w-full cursor-pointer flex-col"
                id="div-24"
              >
                <a
                  className="flex h-full w-full justify-center"
                  href="https://www.intercom.com/about/ciaran-lee"
                >
                  <div className="relative w-full overflow-hidden rounded-2xl">
                    <span className="relative">
                      <img
                        className="absolute bottom-0 left-0 top-0 h-48 w-80"
                        src="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2EKiO34GdLZfVfl8Wt9Y7X%2Fa31608ce463baf8d24f509f67aef3062%2F3J6A8892-V1.jpg&w=1440&q=100"
                        srcSet="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2EKiO34GdLZfVfl8Wt9Y7X%2Fa31608ce463baf8d24f509f67aef3062%2F3J6A8892-V1.jpg&w=256&q=100 256w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2EKiO34GdLZfVfl8Wt9Y7X%2Fa31608ce463baf8d24f509f67aef3062%2F3J6A8892-V1.jpg&w=384&q=100 384w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2EKiO34GdLZfVfl8Wt9Y7X%2Fa31608ce463baf8d24f509f67aef3062%2F3J6A8892-V1.jpg&w=512&q=100 512w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2EKiO34GdLZfVfl8Wt9Y7X%2Fa31608ce463baf8d24f509f67aef3062%2F3J6A8892-V1.jpg&w=768&q=100 768w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2EKiO34GdLZfVfl8Wt9Y7X%2Fa31608ce463baf8d24f509f67aef3062%2F3J6A8892-V1.jpg&w=990&q=100 990w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2EKiO34GdLZfVfl8Wt9Y7X%2Fa31608ce463baf8d24f509f67aef3062%2F3J6A8892-V1.jpg&w=1024&q=100 1024w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2EKiO34GdLZfVfl8Wt9Y7X%2Fa31608ce463baf8d24f509f67aef3062%2F3J6A8892-V1.jpg&w=1440&q=100 1440w"
                      />
                    </span>
                  </div>
                </a>
                <div className="mt-8 flex flex-grow flex-col">
                  <a
                    className="flex h-full w-full justify-center"
                    href="https://www.intercom.com/about/ciaran-lee"
                  >
                    <div
                      className="text-xl font-bold"
                      style={{
                        wordBreak: 'break-word',
                      }}
                    >
                      <span>
                        <p className="font-black">
                          <b>Ciaran Lee, </b>
                          <b>Chief Engineer and Co-founder</b>
                        </p>
                      </span>
                    </div>
                    <div className="mb-auto mt-3 md:mt-5">
                      Ciaran served as CTO from founding in 2011 until 2021,
                      when he left to pursue other interests. He returned in
                      2023 as Chief Engineer.
                    </div>
                  </a>
                  <div className="mt-6 inline-block text-slate-900 md:mt-7">
                    <a
                      className="flex h-full w-full justify-center"
                      href="https://www.intercom.com/about/ciaran-lee"
                    />
                    <a
                      className="inline-flex items-center justify-center gap-2"
                      href="https://www.intercom.com/about/ciaran-lee"
                    >
                      <span className="text-base font-bold">
                        Read Ciaran's full bio
                      </span>
                      <svg
                        className="h-2.5 w-3"
                        fill="none"
                        height="10"
                        viewBox="0 0 13 10"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 5L6 1"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 5L11 5"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </div>
        </div>
        <div className="m-auto grid grid-cols-[1fr_[content]_12fr_1fr] grid-rows-[63.8px_1577.75px] py-14 text-slate-900 md:pb-20 md:pt-20 min-[990px]:pb-20 min-[990px]:pt-20 lg:pb-24 lg:pt-24 min-[1440px]:pb-24 min-[1440px]:pt-24">
          <div
            className="row-start-1 m-auto max-w-[64.25rem] text-center text-2xl font-bold"
            style={{
              gridColumn: 'content',
            }}
          >
            <h2>
              <span className="text-[3.63rem] leading-none">
                Our board of directors
              </span>
            </h2>
          </div>
          <div
            className="row-start-1 mx-auto mt-10 grid max-w-[80.63rem] grid-rows-[486.55px_486.8px_460.4px] gap-10 md:mt-16 md:grid-cols-[repeat(4,_1fr)] lg:grid-cols-[repeat(6,_1fr)]"
            style={{
              gridColumn: 'content',
            }}
          >
            <li className="list-item text-black md:col-end-auto" id="li-12">
              <a
                className="flex h-full w-full justify-center"
                href="https://www.intercom.com/about/eoghan-mccabe"
              />
              <div
                className="flex h-full w-full cursor-pointer flex-col"
                id="div-25"
              >
                <a
                  className="flex h-full w-full justify-center"
                  href="https://www.intercom.com/about/eoghan-mccabe"
                >
                  <div className="relative w-full overflow-hidden rounded-2xl">
                    <span className="relative">
                      <img
                        className="absolute bottom-0 left-0 top-0 h-48 w-80"
                        src="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2CUv8e6mBN2tDMgnssyVat%2F0f40d0b735ef8403868a49b4a00a5be0%2FEoghan.jpg&w=1440&q=100"
                        srcSet="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2CUv8e6mBN2tDMgnssyVat%2F0f40d0b735ef8403868a49b4a00a5be0%2FEoghan.jpg&w=256&q=100 256w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2CUv8e6mBN2tDMgnssyVat%2F0f40d0b735ef8403868a49b4a00a5be0%2FEoghan.jpg&w=384&q=100 384w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2CUv8e6mBN2tDMgnssyVat%2F0f40d0b735ef8403868a49b4a00a5be0%2FEoghan.jpg&w=512&q=100 512w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2CUv8e6mBN2tDMgnssyVat%2F0f40d0b735ef8403868a49b4a00a5be0%2FEoghan.jpg&w=768&q=100 768w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2CUv8e6mBN2tDMgnssyVat%2F0f40d0b735ef8403868a49b4a00a5be0%2FEoghan.jpg&w=990&q=100 990w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2CUv8e6mBN2tDMgnssyVat%2F0f40d0b735ef8403868a49b4a00a5be0%2FEoghan.jpg&w=1024&q=100 1024w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F2CUv8e6mBN2tDMgnssyVat%2F0f40d0b735ef8403868a49b4a00a5be0%2FEoghan.jpg&w=1440&q=100 1440w"
                      />
                    </span>
                  </div>
                </a>
                <div className="mt-8 flex flex-grow flex-col">
                  <a
                    className="flex h-full w-full justify-center"
                    href="https://www.intercom.com/about/eoghan-mccabe"
                  >
                    <div
                      className="text-xl font-bold"
                      style={{
                        wordBreak: 'break-word',
                      }}
                    >
                      <span>Eoghan McCabe, Chairman</span>
                    </div>
                    <div className="mb-auto mt-3 md:mt-5">
                      Eoghan is CEO, co-founder and Chairman of the Board at
                      Intercom. Before Intercom he founded Contrast, a software
                      design consultancy, and Exceptional, a developer tool
                      company acquired by Rackspace.
                    </div>
                  </a>
                  <div className="mt-6 inline-block text-slate-900 md:mt-7">
                    <a
                      className="flex h-full w-full justify-center"
                      href="https://www.intercom.com/about/eoghan-mccabe"
                    />
                    <a
                      className="inline-flex items-center justify-center gap-2"
                      href="https://www.intercom.com/about/eoghan-mccabe"
                    >
                      <span className="text-base font-bold">
                        Read Eoghan's full bio
                      </span>
                      <svg
                        className="h-2.5 w-3"
                        fill="none"
                        height="10"
                        viewBox="0 0 13 10"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 5L6 1"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 5L11 5"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-item md:col-end-auto" id="li-13">
              <div className="flex h-full w-full flex-col" id="div-26">
                <div className="relative w-full overflow-hidden rounded-2xl">
                  <span className="relative">
                    <img
                      className="absolute bottom-0 left-0 top-0 h-48 w-80"
                      src="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F55YP1JzqJJ1TM80seJcSS%2F099c452e75a028a3ba0a0b7f92d6b94d%2FDes.jpeg&w=1440&q=100"
                      srcSet="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F55YP1JzqJJ1TM80seJcSS%2F099c452e75a028a3ba0a0b7f92d6b94d%2FDes.jpeg&w=256&q=100 256w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F55YP1JzqJJ1TM80seJcSS%2F099c452e75a028a3ba0a0b7f92d6b94d%2FDes.jpeg&w=384&q=100 384w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F55YP1JzqJJ1TM80seJcSS%2F099c452e75a028a3ba0a0b7f92d6b94d%2FDes.jpeg&w=512&q=100 512w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F55YP1JzqJJ1TM80seJcSS%2F099c452e75a028a3ba0a0b7f92d6b94d%2FDes.jpeg&w=768&q=100 768w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F55YP1JzqJJ1TM80seJcSS%2F099c452e75a028a3ba0a0b7f92d6b94d%2FDes.jpeg&w=990&q=100 990w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F55YP1JzqJJ1TM80seJcSS%2F099c452e75a028a3ba0a0b7f92d6b94d%2FDes.jpeg&w=1024&q=100 1024w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F55YP1JzqJJ1TM80seJcSS%2F099c452e75a028a3ba0a0b7f92d6b94d%2FDes.jpeg&w=1440&q=100 1440w"
                    />
                  </span>
                </div>
                <div className="mt-8 flex flex-grow flex-col">
                  <div
                    className="text-xl font-bold"
                    id="div-27"
                    style={{
                      wordBreak: 'break-word',
                    }}
                  >
                    <span>
                      <b className="font-black">Des Traynor</b>
                    </span>
                  </div>
                  <div className="mb-auto mt-3 md:mt-5">
                    Des co-founded Intercom and leads the R&D team, including
                    Product, Engineering, and Design. Previously, he co-founded
                    Exceptional, and was a UX designer for web apps.
                  </div>
                </div>
              </div>
            </li>
            <li className="list-item text-black md:col-end-auto" id="li-14">
              <a
                className="flex h-full w-full justify-center"
                href="https://www.intercom.com/about/cameron-deatsch"
              />
              <div
                className="flex h-full w-full cursor-pointer flex-col"
                id="div-28"
              >
                <a
                  className="flex h-full w-full justify-center"
                  href="https://www.intercom.com/about/cameron-deatsch"
                >
                  <div className="relative w-full overflow-hidden rounded-2xl">
                    <span className="relative">
                      <img
                        className="absolute bottom-0 left-0 top-0 h-48 w-80"
                        src="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F4YEzSvTWa9iLNP1zr5GvBW%2F899f4c0919fcbfc6d4fd490d4f1199ce%2FCameron.jpg&w=1440&q=100"
                        srcSet="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F4YEzSvTWa9iLNP1zr5GvBW%2F899f4c0919fcbfc6d4fd490d4f1199ce%2FCameron.jpg&w=256&q=100 256w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F4YEzSvTWa9iLNP1zr5GvBW%2F899f4c0919fcbfc6d4fd490d4f1199ce%2FCameron.jpg&w=384&q=100 384w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F4YEzSvTWa9iLNP1zr5GvBW%2F899f4c0919fcbfc6d4fd490d4f1199ce%2FCameron.jpg&w=512&q=100 512w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F4YEzSvTWa9iLNP1zr5GvBW%2F899f4c0919fcbfc6d4fd490d4f1199ce%2FCameron.jpg&w=768&q=100 768w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F4YEzSvTWa9iLNP1zr5GvBW%2F899f4c0919fcbfc6d4fd490d4f1199ce%2FCameron.jpg&w=990&q=100 990w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F4YEzSvTWa9iLNP1zr5GvBW%2F899f4c0919fcbfc6d4fd490d4f1199ce%2FCameron.jpg&w=1024&q=100 1024w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F4YEzSvTWa9iLNP1zr5GvBW%2F899f4c0919fcbfc6d4fd490d4f1199ce%2FCameron.jpg&w=1440&q=100 1440w"
                      />
                    </span>
                  </div>
                </a>
                <div className="mt-8 flex flex-grow flex-col">
                  <a
                    className="flex h-full w-full justify-center"
                    href="https://www.intercom.com/about/cameron-deatsch"
                  >
                    <div
                      className="text-xl font-bold"
                      style={{
                        wordBreak: 'break-word',
                      }}
                    >
                      <span>
                        <b className="font-black">Cameron Deatsch </b>
                      </span>
                    </div>
                    <div className="mb-auto mt-3 md:mt-5">
                      Cameron was the Chief Revenue Officer at Atlassian from
                      2020 to 2023, where he ran the marketing, sales, and
                      support organizations.
                    </div>
                  </a>
                  <div className="mt-6 inline-block text-slate-900 md:mt-7">
                    <a
                      className="flex h-full w-full justify-center"
                      href="https://www.intercom.com/about/cameron-deatsch"
                    />
                    <a
                      className="inline-flex items-center justify-center gap-2"
                      href="https://www.intercom.com/about/cameron-deatsch"
                    >
                      <span className="text-base font-bold">
                        Read Cameron's full bio
                      </span>
                      <svg
                        className="h-2.5 w-3"
                        fill="none"
                        height="10"
                        viewBox="0 0 13 10"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 5L6 1"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 5L11 5"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-item text-black md:col-end-auto" id="li-15">
              <a
                className="flex h-full w-full justify-center"
                href="https://www.intercom.com/about/abhijeet-dwivedi"
              />
              <div
                className="flex h-full w-full cursor-pointer flex-col"
                id="div-29"
              >
                <a
                  className="flex h-full w-full justify-center"
                  href="https://www.intercom.com/about/abhijeet-dwivedi"
                >
                  <div className="relative w-full overflow-hidden rounded-2xl">
                    <span className="relative">
                      <img
                        className="absolute bottom-0 left-0 top-0 h-48 w-80"
                        src="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F4Z6OEOrrTEtL73uVzq2UVY%2F1f4afdd934994ac1544d307400f60d8e%2FAbhijeet.jpg&w=1440&q=100"
                        srcSet="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F4Z6OEOrrTEtL73uVzq2UVY%2F1f4afdd934994ac1544d307400f60d8e%2FAbhijeet.jpg&w=256&q=100 256w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F4Z6OEOrrTEtL73uVzq2UVY%2F1f4afdd934994ac1544d307400f60d8e%2FAbhijeet.jpg&w=384&q=100 384w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F4Z6OEOrrTEtL73uVzq2UVY%2F1f4afdd934994ac1544d307400f60d8e%2FAbhijeet.jpg&w=512&q=100 512w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F4Z6OEOrrTEtL73uVzq2UVY%2F1f4afdd934994ac1544d307400f60d8e%2FAbhijeet.jpg&w=768&q=100 768w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F4Z6OEOrrTEtL73uVzq2UVY%2F1f4afdd934994ac1544d307400f60d8e%2FAbhijeet.jpg&w=990&q=100 990w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F4Z6OEOrrTEtL73uVzq2UVY%2F1f4afdd934994ac1544d307400f60d8e%2FAbhijeet.jpg&w=1024&q=100 1024w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F4Z6OEOrrTEtL73uVzq2UVY%2F1f4afdd934994ac1544d307400f60d8e%2FAbhijeet.jpg&w=1440&q=100 1440w"
                      />
                    </span>
                  </div>
                </a>
                <div className="mt-8 flex flex-grow flex-col">
                  <a
                    className="flex h-full w-full justify-center"
                    href="https://www.intercom.com/about/abhijeet-dwivedi"
                  >
                    <div
                      className="text-xl font-bold"
                      style={{
                        wordBreak: 'break-word',
                      }}
                    >
                      <span>
                        <b className="font-black">Abhijeet Dwivedi</b>
                      </span>
                    </div>
                    <div className="mb-auto mt-3 md:mt-5">
                      Abhijeet is the co-founder and CEO of ZeroDown.
                      Previously, he was the COO and CSO at Zenefits and was
                      with McKinsey & Company for seven years.
                    </div>
                  </a>
                  <div className="mt-6 inline-block text-slate-900 md:mt-7">
                    <a
                      className="flex h-full w-full justify-center"
                      href="https://www.intercom.com/about/abhijeet-dwivedi"
                    />
                    <a
                      className="inline-flex items-center justify-center gap-2"
                      href="https://www.intercom.com/about/abhijeet-dwivedi"
                    >
                      <span className="text-base font-bold">
                        Read Abhijeet's full bio
                      </span>
                      <svg
                        className="h-2.5 w-3"
                        fill="none"
                        height="10"
                        viewBox="0 0 13 10"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 5L6 1"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 5L11 5"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-item text-black md:col-end-auto" id="li-16">
              <a
                className="flex h-full w-full justify-center"
                href="https://www.intercom.com/about/ethan-kurzweil"
              />
              <div
                className="flex h-full w-full cursor-pointer flex-col"
                id="div-30"
              >
                <a
                  className="flex h-full w-full justify-center"
                  href="https://www.intercom.com/about/ethan-kurzweil"
                >
                  <div className="relative w-full overflow-hidden rounded-2xl">
                    <span className="relative">
                      <img
                        className="absolute bottom-0 left-0 top-0 h-48 w-80"
                        src="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F5dUbXga0CxoIMsc4EiiEJF%2F55eee16920e52aa042a0696f7f9c9b9a%2FEthan.jpeg&w=1440&q=100"
                        srcSet="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F5dUbXga0CxoIMsc4EiiEJF%2F55eee16920e52aa042a0696f7f9c9b9a%2FEthan.jpeg&w=256&q=100 256w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F5dUbXga0CxoIMsc4EiiEJF%2F55eee16920e52aa042a0696f7f9c9b9a%2FEthan.jpeg&w=384&q=100 384w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F5dUbXga0CxoIMsc4EiiEJF%2F55eee16920e52aa042a0696f7f9c9b9a%2FEthan.jpeg&w=512&q=100 512w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F5dUbXga0CxoIMsc4EiiEJF%2F55eee16920e52aa042a0696f7f9c9b9a%2FEthan.jpeg&w=768&q=100 768w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F5dUbXga0CxoIMsc4EiiEJF%2F55eee16920e52aa042a0696f7f9c9b9a%2FEthan.jpeg&w=990&q=100 990w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F5dUbXga0CxoIMsc4EiiEJF%2F55eee16920e52aa042a0696f7f9c9b9a%2FEthan.jpeg&w=1024&q=100 1024w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F5dUbXga0CxoIMsc4EiiEJF%2F55eee16920e52aa042a0696f7f9c9b9a%2FEthan.jpeg&w=1440&q=100 1440w"
                      />
                    </span>
                  </div>
                </a>
                <div className="mt-8 flex flex-grow flex-col">
                  <a
                    className="flex h-full w-full justify-center"
                    href="https://www.intercom.com/about/ethan-kurzweil"
                  >
                    <div
                      className="text-xl font-bold"
                      style={{
                        wordBreak: 'break-word',
                      }}
                    >
                      <span>
                        <b className="font-black">Ethan Kurzweil</b>
                      </span>
                    </div>
                    <div className="mb-auto mt-3 md:mt-5">
                      Ethan is a partner in the Bessemer Venture Partners' San
                      Francisco office and a leading investor in developer
                      platforms and digital consumer tech. He has worked for Dow
                      Jones & Co. and Linden Lab. He joined Bessemer in 2008.
                    </div>
                  </a>
                  <div className="mt-6 inline-block text-slate-900 md:mt-7">
                    <a
                      className="flex h-full w-full justify-center"
                      href="https://www.intercom.com/about/ethan-kurzweil"
                    />
                    <a
                      className="inline-flex items-center justify-center gap-2"
                      href="https://www.intercom.com/about/ethan-kurzweil"
                    >
                      <span className="text-base font-bold">
                        Read Ethan's full bio
                      </span>
                      <svg
                        className="h-2.5 w-3"
                        fill="none"
                        height="10"
                        viewBox="0 0 13 10"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 5L6 1"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 5L11 5"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li className="list-item text-black md:col-end-auto" id="li-17">
              <a
                className="flex h-full w-full justify-center"
                href="https://www.intercom.com/about/eileen-naughton"
              />
              <div
                className="flex h-full w-full cursor-pointer flex-col"
                id="div-31"
              >
                <a
                  className="flex h-full w-full justify-center"
                  href="https://www.intercom.com/about/eileen-naughton"
                >
                  <div className="relative w-full overflow-hidden rounded-2xl">
                    <span className="relative">
                      <img
                        className="absolute bottom-0 left-0 top-0 h-48 w-80"
                        src="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7m4ESa80POvtBrffo4Za2i%2Fb4a26e49ff3a35624c8701f551e89651%2FEileen.jpg&w=1440&q=100"
                        srcSet="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7m4ESa80POvtBrffo4Za2i%2Fb4a26e49ff3a35624c8701f551e89651%2FEileen.jpg&w=256&q=100 256w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7m4ESa80POvtBrffo4Za2i%2Fb4a26e49ff3a35624c8701f551e89651%2FEileen.jpg&w=384&q=100 384w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7m4ESa80POvtBrffo4Za2i%2Fb4a26e49ff3a35624c8701f551e89651%2FEileen.jpg&w=512&q=100 512w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7m4ESa80POvtBrffo4Za2i%2Fb4a26e49ff3a35624c8701f551e89651%2FEileen.jpg&w=768&q=100 768w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7m4ESa80POvtBrffo4Za2i%2Fb4a26e49ff3a35624c8701f551e89651%2FEileen.jpg&w=990&q=100 990w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7m4ESa80POvtBrffo4Za2i%2Fb4a26e49ff3a35624c8701f551e89651%2FEileen.jpg&w=1024&q=100 1024w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F7m4ESa80POvtBrffo4Za2i%2Fb4a26e49ff3a35624c8701f551e89651%2FEileen.jpg&w=1440&q=100 1440w"
                      />
                    </span>
                  </div>
                </a>
                <div className="mt-8 flex flex-grow flex-col">
                  <a
                    className="flex h-full w-full justify-center"
                    href="https://www.intercom.com/about/eileen-naughton"
                  >
                    <div
                      className="text-xl font-bold"
                      style={{
                        wordBreak: 'break-word',
                      }}
                    >
                      <span>
                        <b className="font-black">Eileen Naughton</b>
                      </span>
                    </div>
                    <div className="mb-auto mt-3 md:mt-5">
                      Eileen serves as an advisor and board member. She retired
                      from Google in June 2021 as Chief People Officer and a
                      member of Google’s executive leadership team.{' '}
                    </div>
                  </a>
                  <div className="mt-6 inline-block text-slate-900 md:mt-7">
                    <a
                      className="flex h-full w-full justify-center"
                      href="https://www.intercom.com/about/eileen-naughton"
                    />
                    <a
                      className="inline-flex items-center justify-center gap-2"
                      href="https://www.intercom.com/about/eileen-naughton"
                    >
                      <span className="text-base font-bold">
                        Read Eileen's full bio
                      </span>
                      <svg
                        className="h-2.5 w-3"
                        fill="none"
                        height="10"
                        viewBox="0 0 13 10"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 5L6 1"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 5L11 5"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              className="list-item text-black md:col-end-4 md:col-end-auto lg:col-end-5"
              id="li-18"
            >
              <a
                className="flex h-full w-full justify-center"
                href="https://www.intercom.com/about/bobby-pinero"
              />
              <div
                className="flex h-full w-full cursor-pointer flex-col"
                id="div-32"
              >
                <a
                  className="flex h-full w-full justify-center"
                  href="https://www.intercom.com/about/bobby-pinero"
                >
                  <div className="relative w-full overflow-hidden rounded-2xl">
                    <span className="relative">
                      <img
                        className="absolute bottom-0 left-0 top-0 h-48 w-80"
                        src="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6AvV7ZpUQZKpCTICR929zG%2F4103cc2e20dfdea00eadc405a87d5b97%2FBobby.jpg&w=1440&q=100"
                        srcSet="/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6AvV7ZpUQZKpCTICR929zG%2F4103cc2e20dfdea00eadc405a87d5b97%2FBobby.jpg&w=256&q=100 256w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6AvV7ZpUQZKpCTICR929zG%2F4103cc2e20dfdea00eadc405a87d5b97%2FBobby.jpg&w=384&q=100 384w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6AvV7ZpUQZKpCTICR929zG%2F4103cc2e20dfdea00eadc405a87d5b97%2FBobby.jpg&w=512&q=100 512w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6AvV7ZpUQZKpCTICR929zG%2F4103cc2e20dfdea00eadc405a87d5b97%2FBobby.jpg&w=768&q=100 768w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6AvV7ZpUQZKpCTICR929zG%2F4103cc2e20dfdea00eadc405a87d5b97%2FBobby.jpg&w=990&q=100 990w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6AvV7ZpUQZKpCTICR929zG%2F4103cc2e20dfdea00eadc405a87d5b97%2FBobby.jpg&w=1024&q=100 1024w, /_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2Fxny2w179f4ki%2F6AvV7ZpUQZKpCTICR929zG%2F4103cc2e20dfdea00eadc405a87d5b97%2FBobby.jpg&w=1440&q=100 1440w"
                      />
                    </span>
                  </div>
                </a>
                <div className="mt-8 flex flex-grow flex-col">
                  <a
                    className="flex h-full w-full justify-center"
                    href="https://www.intercom.com/about/bobby-pinero"
                  >
                    <div
                      className="text-xl font-bold"
                      style={{
                        wordBreak: 'break-word',
                      }}
                    >
                      <span>
                        <b className="font-black">Bobby Pinero</b>
                      </span>
                    </div>
                    <div className="mb-auto mt-3 md:mt-5">
                      Bobby Pinero is the CEO and Co-Founder of Equals. Bobby
                      was previously the Senior Director of Finance & Analytics
                      at Intercom from October 2013 to March 2021.
                    </div>
                  </a>
                  <div className="mt-6 inline-block text-slate-900 md:mt-7">
                    <a
                      className="flex h-full w-full justify-center"
                      href="https://www.intercom.com/about/bobby-pinero"
                    />
                    <a
                      className="inline-flex items-center justify-center gap-2"
                      href="https://www.intercom.com/about/bobby-pinero"
                    >
                      <span className="text-base font-bold">
                        Read Bobby's full bio
                      </span>
                      <svg
                        className="h-2.5 w-3"
                        fill="none"
                        height="10"
                        viewBox="0 0 13 10"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 9L12 5L6 1"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1 5L11 5"
                          fill="none"
                          stroke="#081d34"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </div>
        </div>
        <div className="grid grid-cols-[[left-gutter]_1fr_[content]_12fr_[right-gutter]_1fr] grid-rows-[0px_221.8px] gap-x-6 bg-blue-200 py-14 text-center text-slate-900 md:grid-cols-[[left-gutter]_1fr_[content]_12fr_[right-gutter]_1fr] md:pb-20 md:pt-20 min-[990px]:pb-20 min-[990px]:pt-20 lg:pb-24 lg:pt-24 min-[1440px]:pb-24 min-[1440px]:pt-24">
          <div
            className="m-auto max-w-[80.63rem]"
            style={{
              gridColumn: 'content',
              gridRow: 'content',
            }}
          >
            <div className="mx-auto mb-9 max-w-[51.25rem] text-[3.63rem] font-bold leading-none">
              <span className="mb-8">
                <span>Our investors</span>
              </span>
            </div>
            <ol className="flex list-decimal flex-wrap items-center justify-center md:justify-center">
              <li className="mx-4 my-2 list-item max-h-8 max-w-[7.50rem] md:mb-3 md:ml-6 md:mr-6 md:mt-3 md:max-h-[3.13rem] md:max-w-[10.00rem]">
                <img
                  className="h-auto max-h-8 w-auto max-w-[7.50rem] object-contain md:max-h-[3.13rem] md:max-w-[10.00rem]"
                  src="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/53eXd7h2QA0RxtOP3NsXzL/02faf244bd1b5007bad7b7462ca469a6/Bessemer_Primary_Lockup_Black__1_.png"
                  style={{
                    aspectRatio: 'auto 1590 / 684',
                  }}
                />
              </li>
              <li className="mx-4 my-2 list-item max-h-8 max-w-[7.50rem] md:mb-3 md:ml-6 md:mr-6 md:mt-3 md:max-h-[3.13rem] md:max-w-[10.00rem]">
                <img
                  className="h-auto max-h-8 w-auto max-w-[7.50rem] object-contain md:max-h-[3.13rem] md:max-w-[10.00rem]"
                  src="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/4ThcWfthDIQ9jC6WTF80WW/cd654fea945afc0554aaad6519a3207f/iconiq-logo.png"
                  style={{
                    aspectRatio: 'auto 181 / 59',
                  }}
                />
              </li>
              <li className="mx-4 my-2 list-item max-h-8 max-w-[7.50rem] md:mb-3 md:ml-6 md:mr-6 md:mt-3 md:max-h-[3.13rem] md:max-w-[10.00rem]">
                <img
                  className="h-auto max-h-8 w-auto max-w-[7.50rem] object-contain md:max-h-[3.13rem] md:max-w-[10.00rem]"
                  src="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/1nZAXSaENP9okmgsSAiigB/ffb17de9aecc4ef36b3eecd71262325f/IndexVentures_2x.png"
                  style={{
                    aspectRatio: 'auto 354 / 84',
                  }}
                />
              </li>
              <li className="mx-4 my-2 list-item max-h-8 max-w-[7.50rem] md:mb-3 md:ml-6 md:mr-6 md:mt-3 md:max-h-[3.13rem] md:max-w-[10.00rem]">
                <img
                  className="h-auto max-h-8 w-auto max-w-[7.50rem] object-contain md:max-h-[3.13rem] md:max-w-[10.00rem]"
                  src="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/PN60AfcpvnZdZTfXmwTUr/f4e8bdea150e99189d3239753f86188f/SocialCapital_2x.png"
                  style={{
                    aspectRatio: 'auto 628 / 60',
                  }}
                />
              </li>
              <li className="mx-4 my-2 list-item max-h-8 max-w-[7.50rem] md:mb-3 md:ml-6 md:mr-6 md:mt-3 md:max-h-[3.13rem] md:max-w-[10.00rem]">
                <img
                  className="h-auto max-h-8 w-auto max-w-[7.50rem] object-contain md:max-h-[3.13rem] md:max-w-[10.00rem]"
                  src="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/18Q8jQ3OdVI0rFUcDmpJ0q/a9c2a32da19cc36811216f8a39f256e3/GV_2x.png"
                  style={{
                    aspectRatio: 'auto 170 / 84',
                  }}
                />
              </li>
              <li className="mx-4 my-2 list-item max-h-8 max-w-[7.50rem] md:mb-3 md:ml-6 md:mr-6 md:mt-3 md:max-h-[3.13rem] md:max-w-[10.00rem]">
                <img
                  className="h-auto max-h-8 w-auto max-w-[7.50rem] object-contain md:max-h-[3.13rem] md:max-w-[10.00rem]"
                  src="https://www.intercom.com//images.ctfassets.net/xny2w179f4ki/3xcwalbOQbdcojMj4eDxyP/dcbc1b166a3bd298b7f3316a96dd3481/KleinerPerkins_2x.png"
                  style={{
                    aspectRatio: 'auto 800 / 84',
                  }}
                />
              </li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  )
}
