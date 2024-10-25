import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, CalendarIcon, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-16 pb-32">
        <div className="absolute inset-0 bg-grid-slate-50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-900/50"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold tracking-tight text-primary-900 sm:text-5xl xl:text-6xl">
                Bangun Karir Impianmu
                <span className="text-secondary-500"> Bersama Kami</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
                Temukan jalan menuju kesuksesan karirmu dengan bimbingan dari mentor profesional
                dan program pengembangan yang dirancang khusus untukmu.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white" asChild>
                  <Link href="/register">Mulai Sekarang</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/about">Pelajari Lebih Lanjut</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <Image
                src="/images/hero-image.png"
                alt="Career Development"
                width={600}
                height={600}
                className="rounded-2xl shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-primary-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-900 sm:text-4xl">
              Mengapa Memilih Kami?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Kami menyediakan layanan terbaik untuk pengembangan karirmu
            </p>
          </div>

          <div className="mt-20 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary-100 p-4">
                <GraduationCap className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-primary-900">
                Mentor Berkualitas
              </h3>
              <p className="mt-2 text-center text-muted-foreground">
                Mentor profesional dengan pengalaman industri yang luas
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary-100 p-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-primary-900">
                Komunitas Aktif
              </h3>
              <p className="mt-2 text-center text-muted-foreground">
                Bergabung dengan komunitas pembelajar yang aktif dan supportif
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-primary-100 p-4">
                <Building2 className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-primary-900">
                Koneksi Industri
              </h3>
              <p className="mt-2 text-center text-muted-foreground">
                Akses ke jaringan perusahaan dan kesempatan karir
              </p>
            </div>
          </div>
        </div>
      </section>

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
            <Button
              size="lg"
              className="mt-8 bg-white text-secondary-600 hover:bg-white/90"
              asChild
            >
              <Link href="/register" className="group">
                Daftar Sekarang
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-primary-900">
                Event Mendatang
              </h2>
              <p className="mt-2 text-lg text-muted-foreground">
                Jangan lewatkan event-event menarik dari kami
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/events" className="group">
                Lihat Semua Event
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Event Card 1 */}
            <div className="group relative rounded-2xl border bg-card overflow-hidden transition-shadow hover:shadow-lg">
              <div className="aspect-[16/9] overflow-hidden">
                <Image
                  src="/images/event-1.png"
                  alt="Career Workshop"
                  width={600}
                  height={400}
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>24 Oktober 2024</span>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-primary-900">
                  Workshop: Future of Work
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Pelajari keterampilan yang dibutuhkan untuk karir masa depan
                </p>
              </div>
            </div>

            {/* Event Card 2 */}
            <div className="group relative rounded-2xl border bg-card overflow-hidden transition-shadow hover:shadow-lg">
              <div className="aspect-[16/9] overflow-hidden">
                <Image
                  src="/images/event-2.png"
                  alt="Tech Talk"
                  width={600}
                  height={400}
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>28 Oktober 2024</span>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-primary-900">
                  Tech Talk: AI & Karir
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Dampak AI terhadap perkembangan karir di era digital
                </p>
              </div>
            </div>

            {/* Event Card 3 */}
            <div className="group relative rounded-2xl border bg-card overflow-hidden transition-shadow hover:shadow-lg">
              <div className="aspect-[16/9] overflow-hidden">
                <Image
                  src="/images/event-3.png"
                  alt="Networking Event"
                  width={600}
                  height={400}
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>1 November 2024</span>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-primary-900">
                  Networking: Industry Connect
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Bangun koneksi dengan profesional dari berbagai industri
                </p>
              </div>
            </div>
          </div>
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