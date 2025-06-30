import { Schema, UID } from '@repo/strapi'

import { removeThisWhenYouNeedMe } from '@/lib/general-helpers'

import { ErrorBoundary } from '../elementary/ErrorBoundary'
import { AnimatedLogoRow } from './components/AnimatedLogoRow'
import { BenefitsCTAGrid } from './components/BenefitsCTAGrid'
import { CarouselGrid } from './components/CarouselGrid'
import { ContactFormSection } from './components/ContactFormSection'
import { CTABanner } from './components/CTABanner'
import { CTABannerCentered } from './components/CTABannerCentered'
import { Faq } from './components/Faq'
import { FeatureCTAGrid } from './components/FeatureCTAGrid'
import { FeatureGrid } from './components/FeatureGrid'
import { HeadingWithCTAButton } from './components/HeadingWithCTAButton'
import { Hero } from './components/Hero'
import { HorizontalImages } from './components/HorizontalImagesSlider'
import { ImageWithCTAButton } from './components/ImageWithCTAButton'
import { Newsletter } from './components/Newsletter'
import { Pricing } from './components/Pricing'
import { StatisticsGrid } from './components/StatisticsGrid'
import { TabbedBanner } from './components/TabbedBanner'
import { WelcomeHero } from './components/WelcomeHero'

// Define page-level components supported by this switch
const printableComps: {
  // eslint-disable-next-line no-unused-vars
  [K in UID.Component]?: React.ComponentType<any>
} = {
  'sections.animated-logo-row': AnimatedLogoRow,
  'sections.carousel': CarouselGrid,
  'sections.contact-form': ContactFormSection,
  'sections.faq': Faq,
  'sections.feature-grid': FeatureGrid,
  'sections.hero': Hero,
  'sections.heading-with-cta-button': HeadingWithCTAButton,
  'sections.horizontal-images': HorizontalImages,
  'sections.image-with-cta-button': ImageWithCTAButton,
  'sections.newsletter': Newsletter,
  'sections.welcome-hero': WelcomeHero,
  'sections.cta-banner': CTABanner,
  'sections.cta-banner-centered': CTABannerCentered,
  'sections.statistics-grid': StatisticsGrid,
  'sections.feature-cta-grid': FeatureCTAGrid,
  'sections.benefits-cta-grid': BenefitsCTAGrid,
  'sections.tabbed-banner': TabbedBanner,
  'sections.pricing': Pricing,
  // Add more components here
}

export function ComponentsRenderer({
  pageComponents,
}: {
  readonly pageComponents: Schema.Attribute.GetDynamicZoneValue<
    Schema.Attribute.DynamicZone<UID.Component[]>
  >
}) {
  return (
    <div>
      {pageComponents
        .filter((comp) => comp != null)
        .map((comp) => {
          const name = comp.__component
          const id = comp.id
          const key = `${name}-${id}`
          const Component = printableComps[name]

          if (Component == null) {
            console.warn(`Unknown component "${name}" with id "${id}".`)

            return (
              <div key={key} className="font-medium text-red-500">
                Component &quot;{key}&quot; is not implemented on the frontend.
              </div>
            )
          }

          return (
            <ErrorBoundary key={key}>
              <Component component={comp} />
            </ErrorBoundary>
          )
        })}
    </div>
  )
}
