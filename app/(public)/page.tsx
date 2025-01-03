import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpcomingEvents } from "@/components/public/UpcomingEvents";
import HeroSection from "@/components/public/HeroSection";
import { AuthDialog } from "@/components/client/AuthDialog";
import { FeaturesSection } from "@/components/public/FeatureSection";

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection/>

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
        <section className="bg-secondary-500 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Siap Memulai Perjalanan Karirmu?
            </h2>
            <p className="mt-4 text-lg text-white/90">
              Bergabunglah sekarang dan temukan potensi terbaikmu
            </p>
            <AuthDialog mode="register">
            <Button
              size="lg"
              className="mt-8 bg-white text-secondary-600 hover:bg-white/90 group"
            >
              Daftar Sekarang
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </AuthDialog>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <UpcomingEvents />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-primary-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-900">
              Apa Kata Mereka?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Kisah sukses dari para pengguna platform kami
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary-100">
                  <Image
                    src="/images/testimonial-1.png"
                    alt="User"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-primary-900">Sarah D.</h4>
                  <p className="text-sm text-muted-foreground">UI/UX Designer</p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                "Platform ini membantu saya menemukan mentor yang tepat dan memberikan
                panduan yang jelas untuk pengembangan karir saya di bidang design."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary-100">
                  <Image
                    src="/images/testimonial-2.png"
                    alt="User"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-primary-900">Alex M.</h4>
                  <p className="text-sm text-muted-foreground">Software Engineer</p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                "Mentoring dan workshop yang disediakan sangat membantu dalam
                meningkatkan skill teknis dan soft skill saya."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary-100">
                  <Image
                    src="/images/testimonial-3.png"
                    alt="User"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  
                </div>
                <div>
                  <h4 className="font-semibold text-primary-900">Linda R.</h4>
                  <p className="text-sm text-muted-foreground">Marketing Manager</p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                "Saya mendapatkan insight berharga dan koneksi yang luas melalui
                program mentoring dan event-event yang diadakan."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}