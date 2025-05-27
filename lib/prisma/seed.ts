import { prisma } from "./db"
import { hashPassword } from "@/utils/hash"


// Define known categories as a union type
type CategoryName = "kaftan" | "agbada" | "suit" | "shirt"

// Strongly type the map to avoid 'any' and TS errors
type CategoryMap = Record<CategoryName, string>



async function main() {
  console.log("Starting seed...");
  const hashedPassword = await hashPassword("admin123")

  // Create Admin if it doesn't exist
  const adminExists = await prisma.admin.findFirst({
    where: { email: "admin@example.com" }
  });

  if (!adminExists) {
    await prisma.admin.create({
      data: {
        email: "admin@example.com",
        password: hashedPassword,
        name: "Super Admin",
      },
    });
    console.log("Admin created")
  }

   // Create categories
   const categories = [
    { name: "kaftan", description: "Traditional kaftan attire for various occasions" },
    { name: "agbada", description: "Elegant agbada ensembles for formal events" },
    { name: "suit", description: "Modern and classic suits for professional settings" },
    { name: "shirt", description: "High-quality shirts for all occasions" },
  ];

  // Check if categories exist before creating them
  for (const category of categories) {
    const existingCategory = await prisma.category.findFirst({
      where: { name: category.name },
    });

    if (!existingCategory) {
      await prisma.category.create({
        data: category,
      });
      console.log(`Created category: ${category.name}`);
    }
  }

  // Get created categories
  const createdCategories = await prisma.category.findMany();
  const categoryMap = createdCategories.reduce((acc, cat) => {
    acc[cat.name as CategoryName] = cat.id;
    return acc;
  }, {} as CategoryMap);

  // Generate products for each category
  await generateKaftanProducts(categoryMap.kaftan);
  await generateAgbadaProducts(categoryMap.agbada);
  await generateSuitProducts(categoryMap.suit);
  await generateShirtProducts(categoryMap.shirt);

  console.log("Seeding completed!");
}

async function generateKaftanProducts(categoryId: string) {
  const colors = ["Blue", "White", "Green", "Black", "Red", "Navy", "Gray", "Brown", "Cream", "Gold"];
  const styles = ["Premium", "Classic", "Modern", "Royal", "Traditional", "Elegant", "Luxury", "Designer"];
  const materials = [
    "100% Cotton with premium embroidery",
    "Premium cotton blend with gold thread embroidery",
    "Breathable linen blend",
    "Premium cotton with silver thread work",
    "Soft cotton with detailed embroidery",
    "Premium brocade with copper accents",
    "Lightweight cotton with intricate patterns",
    "Silk blend with traditional motifs"
  ];
  const baseFeatures = [
    "Hand-stitched embroidery",
    "Breathable fabric",
    "Traditional design with modern styling",
    "Comfortable fit",
    "Gold thread detailing",
    "Lightweight and comfortable",
    "Formal design",
    "Custom fit available",
    "Subtle pattern work",
    "Cooling fabric",
    "Versatile design",
    "Side pockets",
    "Intricate embroidery",
    "Premium finish",
    "Perfect for ceremonies"
  ];

  for (let i = 1; i <= 20; i++) {
    const code = `KF${i.toString().padStart(3, '0')}`;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const style = styles[Math.floor(Math.random() * styles.length)];
    const name = `GT-Kaf 24/${i.toString().padStart(3, '0')}`;
    const price = parseFloat((99.99 + Math.random() * 100).toFixed(2));
    const description = `A ${color.toLowerCase()} ${style.toLowerCase()} kaftan with ${Math.random() > 0.5 ? "embroidered" : "traditional"} patterns. Perfect for ${Math.random() > 0.5 ? "special occasions" : "formal events"}.`;
    const material = materials[Math.floor(Math.random() * materials.length)];
    const rating = Math.floor(Math.random() * 2) + 4; // Rating between 4-5

    // Select 4-6 random features
    const shuffledFeatures = [...baseFeatures].sort(() => 0.5 - Math.random());
    const selectedFeatures = shuffledFeatures.slice(0, 4 + Math.floor(Math.random() * 3));

    const product = await prisma.product.create({
      data: {
        name,
        code,
        price,
        description,
        material,
        rating,
        categoryId,
        features: {
          create: selectedFeatures.map(text => ({ text }))
        },
        images: {
          create: [
            {
              url: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161",
              isMain: true
            },
            {
              url: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161",
              isMain: false
            },
            {
              url: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161",
              isMain: false
            }
          ]
        }
      }
    });

    console.log(`Created kaftan product: ${product.name}`);
  }
}

async function generateAgbadaProducts(categoryId: string) {
  const colors = ["Green", "Blue", "Cream", "Black", "White", "Gold", "Purple", "Red", "Navy", "Burgundy"];
  const styles = ["Luxurious", "Royal", "Traditional", "Premium", "Ceremonial", "Classic", "Regal", "Elegant"];
  const materials = [
    "Premium brocade with gold thread work",
    "Premium damask with detailed embroidery",
    "Lightweight cotton blend with embroidery",
    "Premium brocade with metallic thread work",
    "Rich jacquard with traditional patterns",
    "Soft damask with silver accents",
    "Custom brocade with decorative elements",
    "Premium cotton with intricate stitch work"
  ];
  const baseFeatures = [
    "Three-piece ensemble",
    "Rich embroidery",
    "Traditional design",
    "Comfortable for all-day wear",
    "Elaborate embroidery patterns",
    "Complete three-piece set",
    "Regal design",
    "Premium finish",
    "Subtle embroidery details",
    "Lightweight fabric",
    "Comfortable fit",
    "Luxurious embroidery",
    "Statement piece",
    "Finest craftsmanship",
    "Custom sizing available"
  ];

  for (let i = 1; i <= 20; i++) {
    const code = `AG${i.toString().padStart(3, '0')}`;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const style = styles[Math.floor(Math.random() * styles.length)];
    const name = `GT-Agb 24/${i.toString().padStart(3, '0')}`;
    const price = parseFloat((179.99 + Math.random() * 100).toFixed(2));
    const description = `A ${style.toLowerCase()} ${color.toLowerCase()} agbada with ${Math.random() > 0.5 ? "gold" : "intricate"} embroidery. ${Math.random() > 0.5 ? "Perfect for traditional ceremonies" : "Ideal for important celebrations"}.`;
    const material = materials[Math.floor(Math.random() * materials.length)];
    const rating = Math.floor(Math.random() * 2) + 4; // Rating between 4-5

    // Select 4-6 random features
    const shuffledFeatures = [...baseFeatures].sort(() => 0.5 - Math.random());
    const selectedFeatures = shuffledFeatures.slice(0, 4 + Math.floor(Math.random() * 3));

    const product = await prisma.product.create({
      data: {
        name,
        code,
        price,
        description,
        material,
        rating,
        categoryId,
        features: {
          create: selectedFeatures.map(text => ({ text }))
        },
        images: {
          create: [
            {
              url: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161",
              isMain: true
            },
            {
              url: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161",
              isMain: false
            },
            {
              url: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161",
              isMain: false
            }
          ]
        }
      }
    });

    console.log(`Created agbada product: ${product.name}`);
  }
}

async function generateSuitProducts(categoryId: string) {
  const colors = ["Navy Blue", "Charcoal Grey", "Black", "Light Beige", "Dark Blue", "Light Grey", "Pinstripe", "Burgundy"];
  const styles = ["Classic", "Modern Slim", "Business", "Formal", "Premium", "Designer", "Executive", "Professional"];
  const materials = [
    "Premium wool blend with slight stretch",
    "100% wool with check pattern",
    "Premium wool with satin details",
    "Lightweight linen blend",
    "Italian wool with modern cut",
    "Premium cotton blend for tropical climates",
    "Super 120s wool with fine finish",
    "Cashmere blend for luxury feel"
  ];
  const baseFeatures = [
    "Two-piece suit",
    "Modern slim fit",
    "Fully lined",
    "Interior pockets",
    "Classic fit",
    "Check pattern",
    "Handcrafted details",
    "Tuxedo style",
    "Satin lapels",
    "Matching trousers",
    "Formal design",
    "Summer weight",
    "Breathable fabric",
    "Unlined for comfort",
    "Relaxed fit"
  ];

  for (let i = 1; i <= 20; i++) {
    const code = `ST${i.toString().padStart(3, '0')}`;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const style = styles[Math.floor(Math.random() * styles.length)];
    const name = `GT-Suit 24/${i.toString().padStart(3, '0')}`;
    const price = parseFloat((249.99 + Math.random() * 150).toFixed(2));
    const description = `A ${style.toLowerCase()} ${color.toLowerCase()} suit with exceptional tailoring. ${Math.random() > 0.5 ? "Perfect for business meetings" : "Ideal for formal occasions"}.`;
    const material = materials[Math.floor(Math.random() * materials.length)];
    const rating = Math.floor(Math.random() * 2) + 4; // Rating between 4-5

    // Select 4-6 random features
    const shuffledFeatures = [...baseFeatures].sort(() => 0.5 - Math.random());
    const selectedFeatures = shuffledFeatures.slice(0, 4 + Math.floor(Math.random() * 3));

    const product = await prisma.product.create({
      data: {
        name,
        code,
        price,
        description,
        material,
        rating,
        categoryId,
        features: {
          create: selectedFeatures.map(text => ({ text }))
        },
        images: {
          create: [
            {
              url: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161",
              isMain: true
            },
            {
              url: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161",
              isMain: false
            },
            {
              url: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161",
              isMain: false
            }
          ]
        }
      }
    });

    console.log(`Created suit product: ${product.name}`);
  }
}

async function generateShirtProducts(categoryId: string) {
  const colors = ["White", "Light Blue", "Black", "Checkered", "Striped", "Pink", "Lavender", "Sky Blue"];
  const styles = ["Dress", "Business", "Casual", "Formal", "Premium", "Classic", "Modern", "Designer"];
  const materials = [
    "100% Egyptian cotton",
    "Premium cotton with textured weave",
    "Premium cotton with pleated front",
    "Soft cotton with check pattern",
    "Italian cotton with fine finish",
    "Premium Oxford cloth",
    "Lightweight cotton-linen blend",
    "Premium twill weave cotton"
  ];
  const baseFeatures = [
    "French cuffs",
    "Mother of pearl buttons",
    "Spread collar",
    "Tailored fit",
    "Regular cuffs",
    "Semi-spread collar",
    "Slim fit",
    "Non-iron finish",
    "Pleated front",
    "Wing collar",
    "Formal design",
    "Button-down collar",
    "Single pocket",
    "Regular fit",
    "Versatile design"
  ];

  for (let i = 1; i <= 20; i++) {
    const code = `SH${i.toString().padStart(3, '0')}`;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const style = styles[Math.floor(Math.random() * styles.length)];
    const name = `GT-Shirt 24/${i.toString().padStart(3, '0')}`;
    const price = parseFloat((59.99 + Math.random() * 50).toFixed(2));
    const description = `A ${style.toLowerCase()} ${color.toLowerCase()} shirt with premium finishing. ${Math.random() > 0.5 ? "Essential for formal occasions" : "Perfect for business wear"}.`;
    const material = materials[Math.floor(Math.random() * materials.length)];
    const rating = Math.floor(Math.random() * 2) + 4; // Rating between 4-5

    // Select 4-6 random features
    const shuffledFeatures = [...baseFeatures].sort(() => 0.5 - Math.random());
    const selectedFeatures = shuffledFeatures.slice(0, 4 + Math.floor(Math.random() * 3));

    const product = await prisma.product.create({
      data: {
        name,
        code,
        price,
        description,
        material,
        rating,
        categoryId,
        features: {
          create: selectedFeatures.map(text => ({ text }))
        },
        images: {
          create: [
            {
              url: `/images/shirt${(i % 4) + 1}.jpg`,
              isMain: true
            },
            {
              url: "https://ik.imagekit.io/n34nw5zbn/tailor-hero.jpg?updatedAt=1745710802161",
              isMain: false
            }
          ]
        }
      }
    });

    console.log(`Created shirt product: ${product.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
