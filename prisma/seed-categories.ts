import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏷️ Iniciando seed das categorias...');

  // Limpar categorias existentes (opcional)
  await prisma.category.deleteMany();
  
  console.log('📋 Criando categorias...');

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
    { name: 'Combustível', emoji: '⛽' },
    { name: 'Comunicação', emoji: '📱' },
    { name: 'Beleza', emoji: '💄' },
    { name: 'Pets', emoji: '🐕' },
    { name: 'Presentes', emoji: '🎁' },
    { name: 'Seguros', emoji: '🛡️' },
    { name: 'Taxas', emoji: '📄' },
    { name: 'Investimentos', emoji: '💰' },
    { name: 'Doações', emoji: '❤️' },
    { name: 'Trabalho', emoji: '💼' },
    { name: 'Casa', emoji: '🏠' },
  ];

  let createdCount = 0;

  for (const category of categories) {
    const result = await prisma.category.upsert({
      where: { name: category.name },
      update: { emoji: category.emoji },
      create: category,
    });

    createdCount++;
    console.log(`✅ ${category.emoji} ${category.name}`);
  }

  console.log('');
  console.log('📊 Resumo:');
  console.log(`📦 Total de categorias: ${categories.length}`);
  console.log('');
  console.log('🎉 Seed de categorias concluído!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed das categorias:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 