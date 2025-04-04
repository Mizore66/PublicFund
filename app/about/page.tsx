import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteLayout } from "@/components/site-layout";
import Link from "next/link";

export default function AboutPage() {
  return (
    <SiteLayout>
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                About Quadratic Funding
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                A democratic way to fund public goods that amplifies the power of community support.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-12 max-w-3xl space-y-8">
            <div>
              <h2 className="text-2xl font-bold">What is Quadratic Funding?</h2>
              <p className="mt-4 text-muted-foreground">
                Quadratic Funding is a method for allocating matching funds in public goods funding. It optimizes for
                the number of contributors rather than the amount contributed, giving more weight to projects with broad
                community support.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">How Does It Work?</h2>
              <p className="mt-4 text-muted-foreground">
                In a Quadratic Funding system, the amount of matching funds a project receives is proportional to the
                square of the sum of the square roots of contributions. This means that many small contributions can
                have a larger impact than a few large ones.
              </p>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Traditional Funding</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Project A: 1 donor gives $100
                      <br />
                      Project B: 10 donors give $10 each
                      <br />
                      <br />
                      Both projects receive the same amount: $100
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Quadratic Funding</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Project A: 1 donor gives $100 → Matching: $100
                      <br />
                      Project B: 10 donors give $10 each → Matching: $316
                      <br />
                      <br />
                      Project B receives more because it has broader support.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Stake to Donate</h2>
              <p className="mt-4 text-muted-foreground">
                PublicFund introduces a unique feature called <strong>Stake to Donate</strong>. Users can stake their
                SOL tokens to generate $FUND SPL tokens, which serve as the platform's primary donation currency. By
                staking SOL, users not only earn rewards but also contribute to the ecosystem by funding impactful
                projects.
              </p>
              <p className="mt-4 text-muted-foreground">
                Once $FUND tokens are earned, users can explore various projects and donate to the ones they care about
                the most. The quadratic funding formula ensures that projects with broader community support receive
                more matching funds.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">KYC Verification</h2>
              <p className="mt-4 text-muted-foreground">
                To ensure compliance and maintain a secure platform, all users must complete <strong>KYC (Know Your
                Customer)</strong> verification. This process involves verifying your identity by submitting personal
                information and documents. Once verified, users gain full access to all platform features, including
                staking, donating, and participating in the quadratic funding ecosystem.
              </p>
              <p className="mt-4 text-muted-foreground">
                Your information is securely stored and encrypted, ensuring privacy and compliance with regulations.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">The Math Behind It</h2>
              <p className="mt-4 text-muted-foreground">
                The matching amount M for a project is calculated using the formula:
              </p>
              <div className="my-4 flex justify-center">
                <div className="rounded-lg bg-muted p-4">
                  <p className="font-mono">
                    M = (Σ√c<sub>i</sub>)<sup>2</sup> - Σc<sub>i</sub>
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Where c<sub>i</sub> is the contribution amount from each individual donor. This formula ensures that
                many small contributions have a larger impact than a few large ones.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Why Web3?</h2>
              <p className="mt-4 text-muted-foreground">
                Blockchain technology enables transparent, trustless funding mechanisms. Smart contracts ensure that
                funds are distributed according to the quadratic funding formula without the need for a central
                authority. This creates a more democratic and efficient way to fund public goods.
              </p>
            </div>
            <div className="flex justify-center">
              <Link href="/projects">
                <Button size="lg">Explore Projects</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}