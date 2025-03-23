import { DonationRequestForm } from "@/components/donation-request-form"
import { SiteLayout } from "@/components/site-layout"

export default function CreatePage() {
  return (
    <SiteLayout>
      <section className="py-12 md:py-24 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5"></div>
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-web3-gradient bg-clip-text text-transparent animate-glow">
                Create a Donation Request
              </h1>
              <p className="mx-auto max-w-[700px] text-foreground/80 md:text-xl">
                Share your public good project and receive funding through quadratic funding
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container px-4 md:px-6">
          <DonationRequestForm />
        </div>
      </section>
    </SiteLayout>
  )
}

