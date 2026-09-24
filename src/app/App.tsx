import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { SkipLink } from '@/components/layout/SkipLink'
import { BreakdownSection } from '@/components/sections/BreakdownSection'
import { ExamplesSection } from '@/components/sections/ExamplesSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { MonthlySection } from '@/components/sections/MonthlySection'
import { TransparencySection } from '@/components/sections/TransparencySection'
import { WhySection } from '@/components/sections/WhySection'
import { AppProviders } from './providers/AppProviders'
import { MAIN_CONTENT_ID } from './routes'

export function App() {
  return (
    <AppProviders>
      <SkipLink />
      <Navbar />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="focus:outline-none">
        <HeroSection />
        <BreakdownSection />
        <ExamplesSection />
        <WhySection />
        <MonthlySection />
        <TransparencySection />
      </main>
      <Footer />
    </AppProviders>
  )
}
