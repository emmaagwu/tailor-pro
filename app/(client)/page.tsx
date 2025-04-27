// import React from 'react'
// import HeroSection from '../components/client/hero-section'
// import AgbadaSection from '../components/client/agbada-section'
// import KaftanSection from '../components/client/kaftan-section'
// import SuitSection from '../components/client/suit-section'
// import ShirtSection from '../components/client/shirt-section'

// const Home = () => {
//   return (
//     <div className='mt-13'>
//       <HeroSection
//         imageUrl='https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161'
//         altText='Elegant tailored clothing collection'
//       />
//       <AgbadaSection />
//       <KaftanSection />
//       <SuitSection />
//       <ShirtSection />
//     </div>
//   )
// }

// export default Home



import HeroSection from '../components/client/hero-section'
import ProductSection from '../components/client/product-section/product-section'
import WearDisplay from '../components/client/product-section/wear-display'

// Sample product data
const kaftanProducts = [
  { id: 1, code: "KF001", price: 129.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: 2, code: "KF002", price: 149.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: 3, code: "KF003", price: 139.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: 4, code: "KF003", price: 139.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
]

const agbadaProducts = [
  { id: 1, code: "AG001", price: 199.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: 2, code: "AG002", price: 219.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: 3, code: "AG003", price: 189.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: 4, code: "AG003", price: 189.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
]

const suitProducts = [
  { id: 1, code: "ST001", price: 299.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: 2, code: "ST002", price: 349.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: 3, code: "ST003", price: 329.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: 4, code: "ST003", price: 329.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
]
const shirtProducts = [
  { id: 1, code: "SH001", price: 299.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: 2, code: "SH002", price: 349.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: 3, code: "SH003", price: 329.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
  { id: 4, code: "SH003", price: 329.99, imageUrl: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161" },
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
            imageUrl={product.imageUrl}
            code={product.code}
            price={product.price}
            altText={`Shirt ${product.code}`}
          />
        ))}
      </ProductSection>
    </main>
  )
}
