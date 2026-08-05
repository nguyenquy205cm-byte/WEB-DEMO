import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Brands
  const brandsData = [
    { name: "Nike", slug: "nike" },
    { name: "Adidas", slug: "adidas" },
    { name: "Puma", slug: "puma" },
    { name: "New Balance", slug: "new-balance" },
    { name: "Reebok", slug: "reebok" },
  ];

  const brands = [] as any[];
  for (const b of brandsData) {
    const brand = await prisma.brand.create({ data: b });
    brands.push(brand);
  }

  // Categories
  const categoriesData = [
    { name: "Running", slug: "running" },
    { name: "Basketball", slug: "basketball" },
    { name: "Casual", slug: "casual" },
    { name: "Training", slug: "training" },
  ];

  const categories = [] as any[];
  for (const c of categoriesData) {
    const category = await prisma.category.create({ data: c });
    categories.push(category);
  }

  // Users (1 admin + 5 users)
  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: "adminpass",
      name: "Admin",
      role: "ADMIN",
    },
  });

  const users = [] as any[];
  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        password: `password${i}`,
        name: `User ${i}`,
      },
    });
    users.push(user);
  }

  // Create an empty cart for admin and users
  await prisma.cart.create({ data: { userId: admin.id } });
  for (const u of users) {
    await prisma.cart.create({ data: { userId: u.id } });
  }

  // Products (20)
  const products = [] as any[];
  for (let i = 1; i <= 20; i++) {
    const brand = brands[i % brands.length];
    const name = `${brand.name} Shoe Model ${i}`;
    const product = await prisma.product.create({
      data: {
        name,
        slug: `${brand.slug}-model-${i}`,
        description: `Comfortable ${brand.name} shoe, model ${i}`,
        price: new Prisma.Decimal((50 + (i % 10) * 10).toFixed(2)),
        sku: `SKU-${brand.slug.toUpperCase()}-${i}`,
        brandId: brand.id,
      },
    });
    products.push(product);

    // Add 2 images per product
    await prisma.productImage.createMany({
      data: [
        {
          productId: product.id,
          url: `https://example.com/images/${product.slug}-1.jpg`,
          alt: `${product.name} main`,
          isMain: true,
        },
        {
          productId: product.id,
          url: `https://example.com/images/${product.slug}-2.jpg`,
          alt: `${product.name} secondary`,
          isMain: false,
        },
      ],
    });

    // Attach 1-2 categories
    const catCount = i % 2 === 0 ? 2 : 1;
    for (let k = 0; k < catCount; k++) {
      const category = categories[(i + k) % categories.length];
      await prisma.productCategory.create({
        data: {
          productId: product.id,
          categoryId: category.id,
        },
      });
    }
  }

  console.log(`Seed finished: ${brands.length} brands, ${categories.length} categories, ${products.length} products, ${users.length + 1} users`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
