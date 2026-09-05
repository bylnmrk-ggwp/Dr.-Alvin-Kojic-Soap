import { PageMeta } from '@/components/common/PageMeta'
import { site } from '@/config/site'
import { Hero } from '@/features/marketing/Hero'
import { RegimenStrip } from '@/features/marketing/RegimenStrip'
import { FeaturedProducts } from '@/features/marketing/FeaturedProducts'
import { IngredientIndex } from '@/features/marketing/IngredientIndex'
import { TrustSection } from '@/features/marketing/TrustSection'
import { Testimonials } from '@/features/marketing/Testimonials'
import { DistributorCta } from '@/features/marketing/DistributorCta'

export default function HomePage() {
  return (
    <>
      <PageMeta title={site.tagline} description={site.description} />
      <Hero />
      <RegimenStrip />
      <FeaturedProducts />
      <IngredientIndex />
      <Testimonials />
      <TrustSection />
      <DistributorCta />
    </>
  )
}
