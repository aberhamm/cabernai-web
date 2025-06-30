import type { Schema, Struct } from '@strapi/strapi'

export interface ElementsFeature extends Struct.ComponentSchema {
  collectionName: 'components_elements_features'
  info: {
    displayName: 'Feature'
    icon: 'traffic-light'
  }
  attributes: {
    name: Schema.Attribute.String
  }
}

export interface ElementsPlan extends Struct.ComponentSchema {
  collectionName: 'components_elements_plans'
  info: {
    description: ''
    displayName: 'Plan'
    icon: 'search-dollar'
  }
  attributes: {
    description: Schema.Attribute.Text
    features: Schema.Attribute.Component<'elements.feature', true>
    isRecommended: Schema.Attribute.Boolean
    monthPrice: Schema.Attribute.Decimal
    name: Schema.Attribute.String
    yearPrice: Schema.Attribute.Decimal
  }
}

export interface LayoutNavbar extends Struct.ComponentSchema {
  collectionName: 'components_layout_navbars'
  info: {
    description: ''
    displayName: 'Navbar'
  }
  attributes: {
    links: Schema.Attribute.Component<'shared.link', true>
    logoImage: Schema.Attribute.Component<'shared.image-with-link', false>
  }
}

export interface SectionsAnimatedLogoRow extends Struct.ComponentSchema {
  collectionName: 'components_sections_animated_logo_rows'
  info: {
    description: ''
    displayName: 'AnimatedLogoRow'
  }
  attributes: {
    isVisible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    logos: Schema.Attribute.Component<'shared.basic-image', true>
    text: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsBenefitsCtaGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_benefits_cta_grids'
  info: {
    description: ''
    displayName: 'BenefitsCTAGrid'
  }
  attributes: {
    benefits: Schema.Attribute.Component<'shared.card-item', true>
    bgImage: Schema.Attribute.Media<'images' | 'files' | 'videos'>
    isVisible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    links: Schema.Attribute.Component<'shared.link', true>
    subTitle: Schema.Attribute.String
    title: Schema.Attribute.String
  }
}

export interface SectionsCarousel extends Struct.ComponentSchema {
  collectionName: 'components_sections_carousels'
  info: {
    description: ''
    displayName: 'Carousel'
  }
  attributes: {
    images: Schema.Attribute.Component<'shared.image-with-link', true>
    isVisible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>
    radius: Schema.Attribute.Enumeration<['sm', 'md', 'lg', 'xl', 'full']>
  }
}

export interface SectionsContactForm extends Struct.ComponentSchema {
  collectionName: 'components_sections_contact_forms'
  info: {
    displayName: 'ContactForm'
  }
  attributes: {
    description: Schema.Attribute.Text
    gdpr: Schema.Attribute.Component<'shared.link', false>
    title: Schema.Attribute.String
  }
}

export interface SectionsCtaBanner extends Struct.ComponentSchema {
  collectionName: 'components_sections_cta_banner'
  info: {
    description: ''
    displayName: 'CTABanner'
  }
  attributes: {
    bgColor: Schema.Attribute.Enumeration<
      [
        'none',
        'color-primary',
        'color-primary-foreground',
        'color-primary-gradient',
        'color-secondary',
        'color-secondary-foreground',
        'color-secondary-gradient',
        'color-tertiary',
        'color-tertiary-foreground',
        'color-tertiary-gradient',
        'color-muted',
        'color-muted-foreground',
      ]
    >
    footnote: Schema.Attribute.String
    image: Schema.Attribute.Component<'shared.basic-image', false>
    isVisible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    link: Schema.Attribute.Component<'shared.link', false>
    subText: Schema.Attribute.String
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsCtaBannerCentered extends Struct.ComponentSchema {
  collectionName: 'components_sections_cta_banner_centered'
  info: {
    description: ''
    displayName: 'CTABannerCentered'
  }
  attributes: {
    bgColor: Schema.Attribute.String
    footnote: Schema.Attribute.String
    image: Schema.Attribute.Component<'shared.basic-image', false>
    isVisible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    link: Schema.Attribute.Component<'shared.link', false>
    subText: Schema.Attribute.String
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsFaq extends Struct.ComponentSchema {
  collectionName: 'components_sections_faqs'
  info: {
    description: ''
    displayName: 'Faq'
  }
  attributes: {
    faqs: Schema.Attribute.Component<'shared.faq-item', true> & Schema.Attribute.Required
    isVisible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    subTitle: Schema.Attribute.String
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsFeatureCtaGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_feature_cta_grids'
  info: {
    displayName: 'FeatureCTAGrid'
  }
  attributes: {
    features: Schema.Attribute.Component<'shared.card-item', true>
    isVisible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    link: Schema.Attribute.Component<'shared.link', false>
    subTitle: Schema.Attribute.String
    title: Schema.Attribute.String
  }
}

export interface SectionsFeatureGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_feature_grids'
  info: {
    description: ''
    displayName: 'LegacyFeatureGrid'
  }
  attributes: {
    gridCol: Schema.Attribute.Component<'shared.grid-column', false>
    imageRadius: Schema.Attribute.Enumeration<['sm', 'md', 'lg', 'xl', 'full']>
    imageSize: Schema.Attribute.Integer & Schema.Attribute.Required
    isVisible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>
    items: Schema.Attribute.Component<'shared.feature-grid-item', true>
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsHeadingWithCtaButton extends Struct.ComponentSchema {
  collectionName: 'components_sections_heading_with_cta_buttons'
  info: {
    description: ''
    displayName: 'HeadingWithCTAButton'
  }
  attributes: {
    cta: Schema.Attribute.Component<'shared.link', false>
    isVisible: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<true>
    subText: Schema.Attribute.String
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes'
  info: {
    description: ''
    displayName: 'Hero'
  }
  attributes: {
    bgColor: Schema.Attribute.String & Schema.Attribute.CustomField<'plugin::color-picker.color'>
    image: Schema.Attribute.Component<'shared.basic-image', false>
    isVisible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    links: Schema.Attribute.Component<'shared.link', true>
    subTitle: Schema.Attribute.String
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsHorizontalImages extends Struct.ComponentSchema {
  collectionName: 'components_sections_horizontal_images'
  info: {
    description: ''
    displayName: 'HorizontalImages'
  }
  attributes: {
    fixedImageHeight: Schema.Attribute.Integer
    fixedImageWidth: Schema.Attribute.Integer
    imageRadius: Schema.Attribute.Enumeration<['sm', 'md', 'lg', 'xl', 'full']>
    images: Schema.Attribute.Component<'shared.image-with-link', true>
    isVisible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    spacing: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 20
          min: 0
        },
        number
      >
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsImageWithCtaButton extends Struct.ComponentSchema {
  collectionName: 'components_sections_image_with_cta_buttons'
  info: {
    description: ''
    displayName: 'ImageWithCTAButton'
  }
  attributes: {
    image: Schema.Attribute.Component<'shared.basic-image', false>
    isVisible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    link: Schema.Attribute.Component<'shared.link', false>
    subText: Schema.Attribute.String
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsNewsletter extends Struct.ComponentSchema {
  collectionName: 'components_sections_newsletters'
  info: {
    displayName: 'Newsletter'
  }
  attributes: {
    description: Schema.Attribute.String
    gdpr: Schema.Attribute.Component<'shared.link', false>
    title: Schema.Attribute.String
  }
}

export interface SectionsPricing extends Struct.ComponentSchema {
  collectionName: 'components_sections_pricings'
  info: {
    description: ''
    displayName: 'Pricing'
    icon: 'dollar-sign'
  }
  attributes: {
    plans: Schema.Attribute.Component<'elements.plan', true>
    subTitle: Schema.Attribute.String
    title: Schema.Attribute.String
  }
}

export interface SectionsStatisticsGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_statistics_grids'
  info: {
    description: 'A grid layout for displaying statistics'
    displayName: 'StatisticsGrid'
  }
  attributes: {
    isVisible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    items: Schema.Attribute.Component<'shared.card-item', true>
  }
}

export interface SectionsTabbedBanner extends Struct.ComponentSchema {
  collectionName: 'components_sections_tabbed_banners'
  info: {
    description: ''
    displayName: 'TabbedBanner'
  }
  attributes: {
    subTitle: Schema.Attribute.String
    tabs: Schema.Attribute.Component<'shared.card-item', true> & Schema.Attribute.Required
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SectionsWelcomeHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_welcome_heroes'
  info: {
    description: ''
    displayName: 'WelcomeHero'
    icon: 'chartBubble'
  }
  attributes: {
    bgColor: Schema.Attribute.Enumeration<
      ['none', 'primary', 'secondary', 'foreground', 'background']
    >
    bgImage: Schema.Attribute.Component<'shared.basic-image', false>
    image: Schema.Attribute.Media<'images'>
    isVisible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>
    links: Schema.Attribute.Component<'shared.button', true> &
      Schema.Attribute.SetMinMax<
        {
          max: 4
        },
        number
      >
    subTitle: Schema.Attribute.Text
    title: Schema.Attribute.String
  }
}

export interface SharedAccordions extends Struct.ComponentSchema {
  collectionName: 'components_shared_accordions'
  info: {
    description: ''
    displayName: 'Accordions'
  }
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required
    question: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SharedBasicImage extends Struct.ComponentSchema {
  collectionName: 'components_shared_basic_images'
  info: {
    description: ''
    displayName: 'BasicImage'
  }
  attributes: {
    alt: Schema.Attribute.String
    fallbackSrc: Schema.Attribute.String
    height: Schema.Attribute.Integer
    media: Schema.Attribute.Media<'images' | 'videos'> & Schema.Attribute.Required
    opacity: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 1
        },
        number
      >
    width: Schema.Attribute.Integer
  }
}

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons'
  info: {
    displayName: 'button'
    icon: 'cursor'
  }
  attributes: {
    href: Schema.Attribute.String
    label: Schema.Attribute.String
    target: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'_blank'>
  }
}

export interface SharedCardItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_card_items'
  info: {
    description: 'A single card with optional link'
    displayName: 'CardItem'
  }
  attributes: {
    image: Schema.Attribute.Component<'shared.basic-image', false>
    link: Schema.Attribute.Component<'shared.link', false>
    subTitle: Schema.Attribute.String & Schema.Attribute.Required
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_items'
  info: {
    displayName: 'FaqItem'
  }
  attributes: {
    answer: Schema.Attribute.String & Schema.Attribute.Required
    question: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SharedFeatureGridItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_feature_grid_items'
  info: {
    description: ''
    displayName: 'FeatureGridItem'
  }
  attributes: {
    image: Schema.Attribute.Component<'shared.basic-image', false>
    subTitle: Schema.Attribute.String
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SharedFooterItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_items'
  info: {
    description: ''
    displayName: 'FooterItem'
  }
  attributes: {
    links: Schema.Attribute.Component<'shared.link', true>
    title: Schema.Attribute.String & Schema.Attribute.Required
  }
}

export interface SharedGridColumn extends Struct.ComponentSchema {
  collectionName: 'components_shared_grid_columns'
  info: {
    displayName: 'GridColumn'
  }
  attributes: {
    desktop: Schema.Attribute.Integer & Schema.Attribute.Required
    mobile: Schema.Attribute.Integer & Schema.Attribute.Required
    tablet: Schema.Attribute.Integer & Schema.Attribute.Required
  }
}

export interface SharedImageWithLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_image_with_links'
  info: {
    description: ''
    displayName: 'ImageWithLink'
  }
  attributes: {
    image: Schema.Attribute.Component<'shared.basic-image', false>
    link: Schema.Attribute.Component<'shared.link', false>
  }
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links'
  info: {
    description: ''
    displayName: 'Link'
  }
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required
    label: Schema.Attribute.String
    newTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>
  }
}

export interface SharedMetaSocial extends Struct.ComponentSchema {
  collectionName: 'components_shared_meta_socials'
  info: {
    displayName: 'metaSocial'
    icon: 'project-diagram'
  }
  attributes: {
    description: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 65
      }>
    image: Schema.Attribute.Media<'images' | 'files' | 'videos'>
    socialNetwork: Schema.Attribute.Enumeration<['Facebook', 'Twitter']> & Schema.Attribute.Required
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60
      }>
  }
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos'
  info: {
    displayName: 'seo'
    icon: 'search'
  }
  attributes: {
    applicationName: Schema.Attribute.String
    email: Schema.Attribute.String
    keywords: Schema.Attribute.Text
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160
      }>
    metaImage: Schema.Attribute.Media<'images'>
    metaRobots: Schema.Attribute.String
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60
      }>
    siteName: Schema.Attribute.String
    twitter: Schema.Attribute.Component<'shared.seo-twitter', false>
  }
}

export interface SharedSeoTwitter extends Struct.ComponentSchema {
  collectionName: 'components_shared_seo_twitters'
  info: {
    displayName: 'SeoTwitter'
    icon: 'oneToMany'
  }
  attributes: {
    card: Schema.Attribute.String
    creator: Schema.Attribute.String
    creatorId: Schema.Attribute.String
    description: Schema.Attribute.String
    images: Schema.Attribute.Media<'images', true>
    siteId: Schema.Attribute.String
    title: Schema.Attribute.String
  }
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'elements.feature': ElementsFeature
      'elements.plan': ElementsPlan
      'layout.navbar': LayoutNavbar
      'sections.animated-logo-row': SectionsAnimatedLogoRow
      'sections.benefits-cta-grid': SectionsBenefitsCtaGrid
      'sections.carousel': SectionsCarousel
      'sections.contact-form': SectionsContactForm
      'sections.cta-banner': SectionsCtaBanner
      'sections.cta-banner-centered': SectionsCtaBannerCentered
      'sections.faq': SectionsFaq
      'sections.feature-cta-grid': SectionsFeatureCtaGrid
      'sections.feature-grid': SectionsFeatureGrid
      'sections.heading-with-cta-button': SectionsHeadingWithCtaButton
      'sections.hero': SectionsHero
      'sections.horizontal-images': SectionsHorizontalImages
      'sections.image-with-cta-button': SectionsImageWithCtaButton
      'sections.newsletter': SectionsNewsletter
      'sections.pricing': SectionsPricing
      'sections.statistics-grid': SectionsStatisticsGrid
      'sections.tabbed-banner': SectionsTabbedBanner
      'sections.welcome-hero': SectionsWelcomeHero
      'shared.accordions': SharedAccordions
      'shared.basic-image': SharedBasicImage
      'shared.button': SharedButton
      'shared.card-item': SharedCardItem
      'shared.faq-item': SharedFaqItem
      'shared.feature-grid-item': SharedFeatureGridItem
      'shared.footer-item': SharedFooterItem
      'shared.grid-column': SharedGridColumn
      'shared.image-with-link': SharedImageWithLink
      'shared.link': SharedLink
      'shared.meta-social': SharedMetaSocial
      'shared.seo': SharedSeo
      'shared.seo-twitter': SharedSeoTwitter
    }
  }
}
