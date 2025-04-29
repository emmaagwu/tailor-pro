import HeroSection from '../components/client/hero-section'
import ProductSection from '../components/client/product-section/product-section'
import WearDisplay from '../components/client/product-section/wear-display'
import { ShowcaseSection, ShowcaseCard } from "../components/client/showcase-section"
import { LatestWearsSection, LatestWearCard } from "../components/client/latest-wears-section"
import { Footer } from "../components/client/footer"


// Sample product data
const kaftanProducts = [
  { id: "KF001", code: "KF001", price: 129.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: "KF002", code: "KF002", price: 149.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: "KF003", code: "KF003", price: 139.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: "KF004", code: "KF003", price: 139.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
]

const agbadaProducts = [
  { id: "AG001", code: "AG001", price: 199.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: "AG002", code: "AG002", price: 219.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: "AG003", code: "AG003", price: 189.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: "AG004", code: "AG003", price: 189.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
]

const suitProducts = [
  { id: "ST001", code: "ST001", price: 299.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: "ST002", code: "ST002", price: 349.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: "ST003", code: "ST003", price: 329.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: "ST004", code: "ST003", price: 329.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
]
const shirtProducts = [
  { id: "SH001", code: "SH001", price: 299.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: "SH002", code: "SH002", price: 349.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: "SH003", code: "SH003", price: 329.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: "SH004", code: "SH003", price: 329.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
]


const showcaseItems = [
  { id: 1, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161", altText: "Red fabric detail" },
  { id: 2, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161", altText: "Blue fabric detail" },
  { id: 3, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161", altText: "Green fabric detail" },
  { id: 4, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161", altText: "Yellow fabric detail" },
  { id: 5, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161", altText: "Purple fabric detail" },
]


// Latest wears data
const latestWears = [
  {
    id: "white-kaftan-001",
    imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161",
    altText: "White traditional kaftan",
    overlayText: "PREMIUM KAFTAN",
  },
  {
    id: "green-agbada-002",
    imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161",
    altText: "Green traditional agbada",
    overlayText: "LUXURY AGBADA",
  },
]

export default function Home() {
  return (
    <main className='mt-13'>
      <HeroSection
        imageUrl='https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161'
        altText='Elegant tailored clothing collection'
      />

      {/* Kaftan Section */}
      <ProductSection title="Premium Kaftans" seeMoreText="See More Kaftans" seeMoreHref="/category/kaftan">
        {kaftanProducts.map((product) => (
          <WearDisplay
            key={product.id}
            id={product.id}
            imageUrl={product.imageUrl}
            code={product.code}
            price={product.price}
            altText={`Kaftan ${product.code}`}
          />
        ))}
      </ProductSection>

      {/* Agbada Section */}
      <ProductSection
        title="Elegant Agbadas"
        seeMoreText="See More Agbadas"
        seeMoreHref="/category/agbada"
        className="bg-gray-50"
      >
        {agbadaProducts.map((product) => (
          <WearDisplay
            key={product.id}
            id={product.id}
            imageUrl={product.imageUrl}
            code={product.code}
            price={product.price}
            altText={`Agbada ${product.code}`}
          />
        ))}
      </ProductSection>

      {/* Suit Section */}
      <ProductSection title="Tailored Suits" seeMoreText="See More Suits" seeMoreHref="/category/suit">
        {suitProducts.map((product) => (
          <WearDisplay
            key={product.id}
            id={product.id}
            imageUrl={product.imageUrl}
            code={product.code}
            price={product.price}
            altText={`Suit ${product.code}`}
          />
        ))}
      </ProductSection>

      {/* Shirt Section */}
      <ProductSection title="Elegant Shirt" seeMoreText="See More Shirts" seeMoreHref="/category/shirt">
        {shirtProducts.map((product) => (
          <WearDisplay
            key={product.id}
            id={product.id}
            imageUrl={product.imageUrl}
            code={product.code}
            price={product.price}
            altText={`Shirt ${product.code}`}
          />
        ))}
      </ProductSection>

      {/* Latest Wears Section */}
    {/* Latest Wears Section */}
      <LatestWearsSection
        title="Latest Arrivals"
        subtitle="Discover our newest collection of premium tailored clothing"
        minHeight="min-h-[70vh]"
      >
        {latestWears.slice(0, 2).map((item) => (
          <LatestWearCard
            key={item.id}
            imageUrl={item.imageUrl}
            altText={item.altText}
            productId={item.id}
            priority={true}
            overlayText={item.overlayText}
            overlayPosition="bottom"
            overlayTextSize="2xl"
          />
        ))}
      </LatestWearsSection>


      {/* Showcase Section */}
      <ShowcaseSection
        title="Crafting Elegance and style"
        subtitle="We set a high production standard that is constantly focused on our customers' satisfaction."
        speed="normal"
        className="bg-gray-50"
      >
        {showcaseItems.map((item) => (
          <ShowcaseCard key={item.id} imageUrl={item.imageUrl} altText={item.altText} />
        ))}
      </ShowcaseSection>
      {/* Footer */}
      <Footer />
    </main>
  )
}
