import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed dos planos...');

  // Limpar dados existentes (opcional - remova se não quiser limpar)
  await prisma.planPrice.deleteMany();
  await prisma.plan.deleteMany();
  
  console.log('📋 Criando planos...');

  // 2️⃣ Plano Premium
  const premiumPlan = await prisma.plan.create({
    data: {
      name: 'premium',
      description: 'Comece a organizar suas finanças',
      isActive: true,
      prices: {
        create: [
          {
            billingCycle: 'MONTHLY',
            priceCents: 1990, // R$ 19,90
            isActive: true,
          },
          {
            billingCycle: 'ANNUAL',
            priceCents: 21492, // R$ 214,92 (10% desconto)
            isActive: true,
          },
        ],
      },
    },
    include: { prices: true },
  });

  // 3️⃣ Plano Pro
  const proPlan = await prisma.plan.create({
    data: {
      name: 'Pro',
      description: 'Gestão financeira avançada e colaborativa',
      isActive: true,
      prices: {
        create: [
          {
            billingCycle: 'MONTHLY',
            priceCents: 3490, // R$ 34,90
            isActive: true,
          },
          {
            billingCycle: 'ANNUAL',
            priceCents: 33504, // R$ 335,04 (20% desconto)
            isActive: true,
          },
        ],
      },
    },
    include: { prices: true },
  });

  console.log('✅ Planos criados com sucesso!');
  console.log('📊 Resumo:')
  console.log('Premium:', premiumPlan.name, '- Preços:', premiumPlan.prices.length);
  console.log('Pro:', proPlan.name, '- Preços:', proPlan.prices.length);

  // Opcional: Criar algumas categorias padrão
  console.log('🏷️ Criando categorias padrão...');
  
  const categories = [
    { name: 'Alimentação', emoji: '🍽️' },
    { name: 'Transporte', emoji: '🚗' },
    { name: 'Hospedagem', emoji: '🏨' },
    { name: 'Entretenimento', emoji: '🎬' },
    { name: 'Compras', emoji: '🛍️' },
    { name: 'Saúde', emoji: '💊' },
    { name: 'Educação', emoji: '📚' },
    { name: 'Serviços', emoji: '⚙️' },
    { name: 'Outros', emoji: '📝' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('✅ Categorias criadas com sucesso!');
  console.log('🎉 Seed concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 