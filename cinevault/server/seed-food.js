require('dotenv').config();
const { sequelize } = require('./config/db');
const { Theatre, FoodItem } = require('./models');

const baseMenu = [
  { name: 'Classic Popcorn (Salted)', description: 'Freshly popped salted popcorn', price: 180, availableQuantity: 120 },
  { name: 'Caramel Popcorn', description: 'Sweet caramel-coated popcorn', price: 220, availableQuantity: 80 },
  { name: 'Nachos + Cheese Dip', description: 'Crispy nachos with cheese dip', price: 250, availableQuantity: 60 },
  { name: 'Soft Drink (Coke)', description: '500ml chilled soft drink', price: 120, availableQuantity: 150 },
  { name: 'Water Bottle', description: '500ml mineral water', price: 60, availableQuantity: 200 },
];

async function seedFoodOnly() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to MySQL');

    // Ensure tables exist (no force)
    await sequelize.sync();

    const theatres = await Theatre.findAll();
    if (!theatres.length) {
      console.log('⚠️ No theatres found. Run the full seed first if needed: npm run seed');
      process.exit(0);
    }

    let created = 0;
    for (const theatre of theatres) {
      for (const m of baseMenu) {
        const [row, wasCreated] = await FoodItem.findOrCreate({
          where: { theatreId: theatre.id, name: m.name },
          defaults: {
            theatreId: theatre.id,
            name: m.name,
            description: m.description,
            price: m.price,
            availableQuantity: m.availableQuantity,
            isActive: true,
          },
        });

        if (wasCreated) created++;
      }
    }

    console.log(`🍿 Food items created: ${created}`);
    console.log('✅ Food-only seeding complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Food-only seed failed:', error);
    process.exit(1);
  }
}

seedFoodOnly();
