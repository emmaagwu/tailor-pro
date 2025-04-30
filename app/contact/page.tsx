import Image from "next/image"
import Navbar from "@/app/components/client/navbar"
import Marquee from "@/app/components/client/marquee"
import { Footer } from "@/app/components/client/footer"
import ContactInfo from "@/app/components/client/contact/contact-info"

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <Marquee
        text="Our Lekki Office is now opened! - Visit us at A5, The Greyheights, Ope-Daniel, Taiwo Street, Ikate, Lekki, Lagos State."
        speed="normal"
      />

      <main className="mx-5 min-h-screen pt-20 md:mb-50 md:mx-70 ">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Store Image - Left Side */}
          <div className="relative h-[300px] md:h-auto">
            <Image
              src="https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161"
              alt="Grandeur Tailors Atelier"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Contact Information - Right Side */}
          <ContactInfo />
        </div>
      </main>

      <Footer />
    </>
  )
}
