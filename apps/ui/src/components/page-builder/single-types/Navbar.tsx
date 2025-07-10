import Image from 'next/image'
import { Schema } from '@repo/strapi'

import { AppLocale } from '@/types/general'

import { removeThisWhenYouNeedMe } from '@/lib/general-helpers'
import Strapi from '@/lib/strapi'

async function fetchData(locale: string) {
  try {
    return await Strapi.fetchOne(
      'api::navbar.navbar',
      undefined,
      {
        locale,
        populate: ['logoImage', 'links'],
        pLevel: 5,
      },
      undefined,
      { omitAuthorization: true }
    )
  } catch (e: any) {
    console.error(`Data for "api::navbar.navbar" content type wasn't fetched: `, e?.message)
    return undefined
  }
}

export async function PageBuilderNavbar({
  locale,
  pageSpecificNavbar,
}: {
  readonly locale: AppLocale
  readonly pageSpecificNavbar?: Schema.Attribute.ComponentValue<'layout.navbar', false> | null
}) {
  removeThisWhenYouNeedMe('PageBuilderNavbar')

  const response = await fetchData(locale)
  const component = response?.data

  const navbar = pageSpecificNavbar ?? component

  if (navbar == null) {
    return null
  }

  // Data is fetched but currently not used in this static implementation

  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html:
            '@media (min-width: 1200px) {\n#div-1 {\nposition: unset !important;\n}\n#nav-1 {\noverflow-x: unset !important; overflow-y: unset !important;\n}\n#div-2 {\nposition: unset !important;\n}\n#div-3 {\nposition: unset !important;\n}\n#aside-1 {\nposition: unset !important;\n}\n}\n',
        }}
      />

      <div
        className="grid h-16 w-full grid-cols-[auto_1fr_auto] grid-rows-[70px_min-content_min-content] overflow-y-hidden bg-slate-900 px-4 text-lg min-[600px]:h-16 min-[600px]:grid-rows-[72px_min-content_min-content] min-[600px]:px-10 min-[1200px]:flex min-[1200px]:max-w-full min-[1200px]:items-center min-[1200px]:justify-between min-[1200px]:overflow-y-visible min-[1200px]:px-24 min-[1400px]:max-w-[76.00rem] min-[1400px]:px-0"
        style={{
          gridTemplateAreas:
            '"logo empty search aside" "nav nav nav nav" "buttons buttons buttons buttons"',
          textEmphasisPosition: 'auto',
        }}
      >
        <div
          className="sticky z-[2] flex items-center text-blue-700 min-[1200px]:top-[unset] min-[1200px]:w-auto"
          id="div-1"
          style={{
            gridColumnEnd: 'empty',
            gridColumnStart: 'logo',
          }}
        >
          <a className="flex items-center underline" href="https://www.tidio.com/">
            <svg
              className="h-9 w-24 cursor-pointer"
              fill="none"
              height="34"
              viewBox="0 0 100 34"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M44.9166 25.3749V11.2466H40.0437V8.80029H52.7256V11.2466H47.8221V25.3852H44.9166V25.3749Z"
                fill="rgb(255, 255, 255)"
              />
              <path
                d="M60.6672 25.3749V8.80029H66.3048C69.2408 8.80029 71.5141 9.53625 73.0535 10.9771C74.5928 12.4179 75.3574 14.4288 75.3574 17.0098C75.3574 19.5909 74.603 21.6329 73.0841 23.1359C71.5651 24.6389 69.2306 25.3852 66.0703 25.3852L60.6672 25.3749ZM63.593 22.8664H66.4883C68.364 22.8664 69.8117 22.3688 70.8719 21.3945C71.9219 20.4201 72.4214 18.9482 72.4214 17.1031C72.4214 15.258 71.8913 13.8172 70.8719 12.7807C69.8524 11.7441 68.2723 11.2777 66.1926 11.2777H63.593V22.8664Z"
                fill="rgb(255, 255, 255)"
              />
              <path
                d="M91.4341 25.5511C89.1607 25.6133 86.9587 24.7114 85.3378 23.1048C82.045 19.7256 82.045 14.294 85.3378 10.9149C86.9485 9.30821 89.1607 8.4064 91.4341 8.46859C93.7074 8.4375 95.9094 9.30821 97.5303 10.9149C100.823 14.294 100.823 19.7256 97.5303 23.1048C95.9094 24.7114 93.7074 25.5822 91.4341 25.5511ZM91.4341 10.8734C89.9151 10.8423 88.4369 11.5057 87.448 12.677C86.398 13.8483 85.7965 15.3928 85.8373 16.9995C85.8067 18.575 86.3674 20.1195 87.448 21.2908C89.4257 23.5401 92.8205 23.706 95.0225 21.6951C95.155 21.5603 95.2875 21.4256 95.4201 21.2908C97.5609 18.8445 97.5609 15.1233 95.4201 12.6874C94.4312 11.5161 92.953 10.8423 91.4341 10.8734Z"
                fill="rgb(255, 255, 255)"
              />
              <path
                d="M54.5098 12.2522C54.5098 10.5419 55.7331 9.10109 57.3744 8.87305H57.405V21.9648C57.405 23.6751 56.1817 25.1159 54.5403 25.344H54.5098V12.2522Z"
                fill="rgb(255, 255, 255)"
              />
              <path
                d="M77.6919 12.2522C77.6919 10.5419 78.9152 9.10109 80.5565 8.87305H80.5871V21.9648C80.5871 23.6751 79.3638 25.1159 77.7225 25.344H77.6919V12.2522Z"
                fill="rgb(255, 255, 255)"
              />
              <path
                d="M21.1331 0C18.3602 0 15.6383 0.974364 13.4873 2.73651C11.3974 4.44683 9.90901 6.83092 9.28715 9.4845C3.80253 10.8528 0 15.7868 0 21.5604V33.9784H12.213C17.7485 33.9784 22.5399 30.2468 23.9774 24.867L33.3563 24.8359V12.3765C33.3053 5.55595 27.8309 0 21.1331 0ZM21.1637 24.8256H21.4593C20.0627 28.8267 16.4131 31.4803 12.2028 31.4803H2.40589V21.5189C2.40589 17.2898 5.07684 13.5063 8.96092 12.1174C8.96092 12.2314 8.96092 12.335 8.96092 12.4491C8.99151 19.28 14.4659 24.8256 21.1637 24.8256ZM12.213 9.11134H12.1824C12.0702 9.11134 11.9683 9.11134 11.8561 9.11134C13.2222 5.16206 16.9534 2.44628 21.1025 2.44628C26.4954 2.44628 30.8994 6.90348 30.93 12.3765V22.3793H24.3749C24.3953 22.0787 24.4157 21.7781 24.4157 21.4982C24.4157 14.6673 18.9413 9.11134 12.213 9.11134ZM11.377 11.6094C11.6625 11.5887 11.9377 11.568 12.213 11.568H12.2435C17.616 11.568 22.0098 16.0252 22.0404 21.4982C22.0404 21.7884 22.02 22.089 21.9996 22.3793H21.1637C15.7708 22.3793 11.3668 17.9221 11.3362 12.4491C11.3362 12.1692 11.3566 11.8893 11.377 11.6094Z"
                fill="rgb(255, 255, 255)"
              />
            </svg>
          </a>
        </div>
        <nav
          className="mt-6 flex w-full flex-col items-center justify-center pb-48 min-[1200px]:mt-[unset] min-[1200px]:w-auto min-[1200px]:flex-row min-[1200px]:pb-[unset]"
          id="nav-1"
          style={{
            gridColumn: 'nav',
            gridRow: 'nav',
          }}
        >
          <div
            className="mb-1 w-full overflow-hidden py-3 min-[1200px]:mb-0 min-[1200px]:w-[unset] min-[1200px]:p-[unset]"
            id="div-2"
          >
            <div className="flex items-center min-[1200px]:px-0 min-[1200px]:py-3">
              <div className="flex w-full items-center justify-between min-[1200px]:w-[unset]">
                <span className="w-full text-2xl text-white">Product</span>
                <Image
                  className="size-6 min-[1200px]:ml-2"
                  src="https://www.tidio.com/images/icons/icon-chevron-down-white.svg"
                  alt=""
                  width={24}
                  height={24}
                />
              </div>
            </div>
          </div>
          <div className="mb-1 w-full overflow-hidden py-3 text-2xl text-white min-[1200px]:relative min-[1200px]:mb-0 min-[1200px]:w-[unset] min-[1200px]:p-[unset]">
            <div className="flex items-center min-[1200px]:px-0 min-[1200px]:py-3">
              <a className="w-full" href="https://www.tidio.com/pricing/">
                Pricing
              </a>
            </div>
          </div>
          <div className="mb-1 w-full overflow-hidden py-3 text-2xl text-white min-[1200px]:relative min-[1200px]:mb-0 min-[1200px]:w-[unset] min-[1200px]:p-[unset]">
            <div className="flex items-center min-[1200px]:px-0 min-[1200px]:py-3">
              <a className="w-full" href="https://www.tidio.com/industry/ecommerce/">
                Ecommerce
              </a>
            </div>
          </div>
          <div
            className="mb-1 w-full overflow-hidden py-3 min-[1200px]:mb-0 min-[1200px]:w-[unset] min-[1200px]:p-[unset]"
            id="div-3"
          >
            <div className="flex items-center min-[1200px]:px-0 min-[1200px]:py-3">
              <div className="flex w-full items-center justify-between min-[1200px]:w-[unset]">
                <span className="w-full text-2xl text-white">Resources</span>
                <Image
                  className="size-6 min-[1200px]:ml-2"
                  src="https://www.tidio.com/images/icons/icon-chevron-down-white.svg"
                  alt=""
                  width={24}
                  height={24}
                />
              </div>
            </div>
          </div>
          <div className="mb-1 w-full overflow-hidden py-3 min-[1200px]:relative min-[1200px]:mb-0 min-[1200px]:w-[unset] min-[1200px]:p-[unset]">
            <div className="flex items-center min-[1200px]:px-0 min-[1200px]:py-3">
              <div className="flex w-full items-center justify-between min-[1200px]:w-[unset]">
                <span className="w-full text-2xl text-white">Partners</span>
                <Image
                  className="size-6 min-[1200px]:ml-2"
                  src="https://www.tidio.com/images/icons/icon-chevron-down-white.svg"
                  alt=""
                  width={24}
                  height={24}
                />
              </div>
            </div>
          </div>
          <div className="mb-1 w-full overflow-hidden py-3 min-[1200px]:relative min-[1200px]:mb-0 min-[1200px]:hidden min-[1200px]:w-[unset] min-[1200px]:p-[unset]">
            <div className="flex items-center min-[1200px]:px-0 min-[1200px]:py-3">
              <div className="flex w-full items-center justify-between min-[1200px]:w-[unset]">
                <span className="w-full text-2xl text-white">Contact</span>
                <Image
                  className="size-6 min-[1200px]:ml-2"
                  src="https://www.tidio.com/images/icons/icon-chevron-down-white.svg"
                  alt=""
                  width={24}
                  height={24}
                />
              </div>
            </div>
          </div>
        </nav>
        <div className="contents min-[1200px]:inline-flex min-[1200px]:w-auto">
          <aside
            className="sticky flex items-center justify-center"
            id="aside-1"
            style={{
              gridColumn: 'aside',
              gridRow: 'aside',
            }}
          >
            <div className="flex min-[1200px]:hidden">
              <div className="cursor-pointer p-1.5">
                <span className="mx-auto my-1 h-1 w-6 bg-white" />
                <span className="mx-auto my-1 h-1 w-6 bg-white" />
                <span className="mx-auto my-1 h-1 w-6 bg-white" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
