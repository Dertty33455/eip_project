import { PrismaClient, UserRole, BookCondition, BookStatus, PostType, SubscriptionPlan } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Catégories de livres
  const categories = [
    { name: 'Roman', slug: 'roman', description: 'Romans et fiction', icon: '📖' },
    { name: 'Littérature Africaine', slug: 'litterature-africaine', description: 'Œuvres d\'auteurs africains', icon: '🌍' },
    { name: 'Business & Entrepreneuriat', slug: 'business', description: 'Livres sur les affaires et l\'entrepreneuriat', icon: '💼' },
    { name: 'Développement Personnel', slug: 'developpement-personnel', description: 'Croissance personnelle et motivation', icon: '🧠' },
    { name: 'Histoire & Culture', slug: 'histoire-culture', description: 'Histoire et patrimoine culturel', icon: '🏛️' },
    { name: 'Sciences & Technologie', slug: 'sciences-technologie', description: 'Sciences, tech et innovation', icon: '🔬' },
    { name: 'Éducation & Académique', slug: 'education-academique', description: 'Manuels et ressources éducatives', icon: '🎓' },
    { name: 'Jeunesse & BD', slug: 'jeunesse-bd', description: 'Livres jeunesse et bandes dessinées', icon: '🦸' },
    { name: 'Religion & Spiritualité', slug: 'religion-spiritualite', description: 'Ouvrages religieux et spirituels', icon: '🕊️' },
    { name: 'Art & Photographie', slug: 'art-photographie', description: 'Beaux-arts et photographie', icon: '🎨' },
    { name: 'Cuisine Africaine', slug: 'cuisine-africaine', description: 'Recettes et gastronomie africaine', icon: '🍲' },
    { name: 'Santé & Bien-être', slug: 'sante-bien-etre', description: 'Santé, médecine et bien-être', icon: '💚' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('✅ Categories created')

  // Tarifs d'abonnement
  const subscriptionPrices = [
    { plan: SubscriptionPlan.MONTHLY, price: 2500, duration: 30 },
    { plan: SubscriptionPlan.QUARTERLY, price: 6000, duration: 90 },
    { plan: SubscriptionPlan.YEARLY, price: 20000, duration: 365 },
  ]

  for (const sub of subscriptionPrices) {
    await prisma.subscriptionPricing.upsert({
      where: { plan: sub.plan },
      update: { price: sub.price, duration: sub.duration },
      create: sub,
    })
  }
  console.log('✅ Subscription pricing created')

  // Paramètres plateforme
  const settings = [
    { key: 'commission_rate', value: '0.05', type: 'number' },
    { key: 'free_chapters', value: '1', type: 'number' },
    { key: 'platform_name', value: 'AfriBook', type: 'string' },
    { key: 'currency', value: 'XOF', type: 'string' },
    { key: 'min_withdrawal', value: '1000', type: 'number' },
    { key: 'max_withdrawal', value: '500000', type: 'number' },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, type: setting.type },
      create: setting,
    })
  }
  console.log('✅ Settings created')

  // Admin user
  const adminPassword = await bcrypt.hash('Admin@123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@afribook.com' },
    update: {},
    create: {
      email: 'admin@afribook.com',
      phone: '+22500000000',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'AfriBook',
      username: 'admin',
      role: UserRole.ADMIN,
      status: 'ACTIVE',
      isEmailVerified: true,
      isPhoneVerified: true,
      bio: 'Administrateur de la plateforme AfriBook',
      location: 'Abidjan, Côte d\'Ivoire',
      country: 'Côte d\'Ivoire',
    },
  })

  // Create admin wallet
  await prisma.wallet.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      balance: 0,
      currency: 'XOF',
    },
  })
  console.log('✅ Admin user created')

  // Demo users
  const demoPassword = await bcrypt.hash('Demo@123', 12)
  
  const demoUsers = [
    {
      email: 'kofi@example.com',
      phone: '+22501234567',
      firstName: 'Kofi',
      lastName: 'Mensah',
      username: 'kofi_mensah',
      bio: 'Passionné de littérature africaine et de développement personnel. 📚',
      location: 'Accra, Ghana',
      country: 'Ghana',
      role: UserRole.SELLER,
      isVerifiedSeller: true,
    },
    {
      email: 'aminata@example.com',
      phone: '+22507654321',
      firstName: 'Aminata',
      lastName: 'Diallo',
      username: 'aminata_d',
      bio: 'Lectrice avide, j\'aime partager mes découvertes littéraires. ✨',
      location: 'Dakar, Sénégal',
      country: 'Sénégal',
      role: UserRole.USER,
    },
    {
      email: 'chidi@example.com',
      phone: '+22509876543',
      firstName: 'Chidi',
      lastName: 'Okonkwo',
      username: 'chidi_books',
      bio: 'Libraire passionné, je vends des livres rares et d\'occasion.',
      location: 'Lagos, Nigeria',
      country: 'Nigeria',
      role: UserRole.SELLER,
      isVerifiedSeller: true,
    },
  ]

  for (const userData of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: demoPassword,
        status: 'ACTIVE',
        isEmailVerified: true,
        isPhoneVerified: true,
      },
    })

    await prisma.wallet.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        balance: Math.floor(Math.random() * 50000) + 5000,
        currency: 'XOF',
      },
    })
  }
  console.log('✅ Demo users created')

  // Get users and categories for books
  const sellers = await prisma.user.findMany({
    where: { role: { in: [UserRole.SELLER, UserRole.ADMIN] } },
  })
  
  const allCategories = await prisma.category.findMany()
  const catMap = Object.fromEntries(allCategories.map(c => [c.slug, c.id]))

  // Demo books
  const demoBooks = [
    {
      title: 'Une Si Longue Lettre',
      author: 'Mariama Bâ',
      description: 'Un classique de la littérature africaine. Roman épistolaire qui explore la condition féminine au Sénégal.',
      price: 5500,
      condition: BookCondition.VERY_GOOD,
      categoryId: catMap['litterature-africaine'],
      location: 'Dakar',
      city: 'Dakar',
      country: 'Sénégal',
      language: 'Français',
      publishedYear: 1979,
      pages: 165,
      images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'],
    },
    {
      title: 'Les Soleils des Indépendances',
      author: 'Ahmadou Kourouma',
      description: 'Chef-d\'œuvre de la littérature africaine francophone, ce roman raconte la déchéance d\'un prince malinké.',
      price: 6000,
      condition: BookCondition.GOOD,
      categoryId: catMap['litterature-africaine'],
      location: 'Abidjan',
      city: 'Abidjan',
      country: 'Côte d\'Ivoire',
      language: 'Français',
      publishedYear: 1968,
      pages: 196,
      images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'],
    },
    {
      title: 'L\'Enfant Noir',
      author: 'Camara Laye',
      description: 'Autobiographie poétique d\'un enfant guinéen, un récit initiatique touchant.',
      price: 4500,
      condition: BookCondition.LIKE_NEW,
      categoryId: catMap['litterature-africaine'],
      location: 'Conakry',
      city: 'Conakry',
      country: 'Guinée',
      language: 'Français',
      publishedYear: 1953,
      pages: 224,
      images: ['https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400'],
    },
    {
      title: 'Père Riche, Père Pauvre',
      author: 'Robert Kiyosaki',
      description: 'Le livre qui a changé la vision de millions de personnes sur l\'argent et l\'investissement.',
      price: 8000,
      condition: BookCondition.NEW,
      categoryId: catMap['business'],
      location: 'Lagos',
      city: 'Lagos',
      country: 'Nigeria',
      language: 'Français',
      publishedYear: 1997,
      pages: 336,
      images: ['https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400'],
    },
    {
      title: 'L\'Alchimiste',
      author: 'Paulo Coelho',
      description: 'Le voyage initiatique d\'un jeune berger andalou à la recherche d\'un trésor.',
      price: 5000,
      condition: BookCondition.VERY_GOOD,
      categoryId: catMap['developpement-personnel'],
      location: 'Accra',
      city: 'Accra',
      country: 'Ghana',
      language: 'Français',
      publishedYear: 1988,
      pages: 192,
      images: ['https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400'],
    },
  ]

  for (let i = 0; i < demoBooks.length; i++) {
    const seller = sellers[i % sellers.length]
    await prisma.book.create({
      data: {
        ...demoBooks[i],
        sellerId: seller.id,
        status: BookStatus.ACTIVE,
        coverImage: demoBooks[i].images[0],
      },
    })
  }
  console.log('✅ Demo books created')

  // Demo audiobooks
  const demoAudiobooks = [
    {
      title: 'Contes et Légendes d\'Afrique',
      author: 'Tradition Orale',
      narrator: 'Mamadou Konaté',
      description: 'Une collection de contes traditionnels africains, racontés avec passion.',
      coverImage: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=400',
      totalDuration: 7200,
      language: 'Français',
      isPopular: true,
      isFeatured: true,
      categoryId: catMap['histoire-culture'],
      status: 'PUBLISHED',
    },
    {
      title: 'Les Secrets du Leadership Africain',
      author: 'Dr. Kwame Asante',
      narrator: 'Issa Touré',
      description: 'Découvrez les principes de leadership inspirés des grandes figures africaines.',
      coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      totalDuration: 10800,
      language: 'Français',
      isPopular: true,
      categoryId: catMap['business'],
      status: 'PUBLISHED',
    },
    {
      title: 'Méditation et Sagesse Ubuntu',
      author: 'Nadia Mbeki',
      narrator: 'Nadia Mbeki',
      description: 'Un guide audio pour la méditation basée sur la philosophie Ubuntu.',
      coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
      totalDuration: 5400,
      language: 'Français',
      isFeatured: true,
      categoryId: catMap['developpement-personnel'],
      status: 'PUBLISHED',
    },
  ]

  for (const audiobook of demoAudiobooks) {
    const created = await prisma.audiobook.create({
      data: audiobook as any,
    })

    // Add chapters
    const chaptersCount = Math.floor(Math.random() * 5) + 3
    for (let i = 1; i <= chaptersCount; i++) {
      await prisma.audioChapter.create({
        data: {
          audiobookId: created.id,
          title: `Chapitre ${i}`,
          chapterNumber: i,
          duration: Math.floor(Math.random() * 1200) + 600,
          audioUrl: `/audio/sample-chapter-${i}.mp3`,
          isFree: i === 1,
        },
      })
    }
  }
  console.log('✅ Demo audiobooks created')

  // Demo posts
  const users = await prisma.user.findMany({ take: 3 })
  
  const demoPosts = [
    {
      type: PostType.REVIEW,
      content: '📚 Je viens de terminer "Une Si Longue Lettre" de Mariama Bâ et je suis bouleversée! Ce roman explore avec tant de profondeur la condition féminine en Afrique. Un chef-d\'œuvre intemporel que tout le monde devrait lire. ⭐⭐⭐⭐⭐',
      bookTitle: 'Une Si Longue Lettre',
      bookAuthor: 'Mariama Bâ',
      rating: 5,
    },
    {
      type: PostType.RECOMMENDATION,
      content: '🌟 Recommandation du jour: Si vous cherchez de l\'inspiration entrepreneuriale, lisez "L\'Afrique a-t-elle besoin d\'un programme d\'ajustement culturel?" de Daniel Etounga-Manguelle. Un livre qui change les perspectives!',
      bookTitle: 'L\'Afrique a-t-elle besoin...',
      bookAuthor: 'Daniel Etounga-Manguelle',
    },
    {
      type: PostType.TEXT,
      content: '💡 Question à la communauté: Quels sont vos auteurs africains préférés? Je cherche à découvrir de nouvelles voix littéraires du continent. Partagez vos suggestions! 🌍📖',
    },
  ]

  for (let i = 0; i < demoPosts.length; i++) {
    await prisma.post.create({
      data: {
        ...demoPosts[i],
        authorId: users[i % users.length].id,
        images: [],
      },
    })
  }
  console.log('✅ Demo posts created')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
