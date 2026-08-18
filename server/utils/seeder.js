const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('../models/Product');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cloudcart';

const products = [
  {
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Experience premium high-fidelity sound and elite active noise cancellation. Features up to 40 hours of battery life and plush memory foam earcups.',
    price: 199.99,
    category: 'Audio',
    stock: 50,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    imageKey: 'local-seeder-headphones',
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'Tactile mechanical blue switches, fully customizable per-key RGB backlighting, and a durable aircraft-grade aluminum frame. Ideal for gaming and typing.',
    price: 89.99,
    category: 'Gaming',
    stock: 35,
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80',
    imageKey: 'local-seeder-keyboard',
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Track your daily steps, continuous heart rate, sleep quality, and workouts with this sleek, waterproof wearable. Exquisite AMOLED touch display.',
    price: 149.99,
    category: 'Wearables',
    stock: 40,
    rating: 4.2,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    imageKey: 'local-seeder-smartwatch',
  },
  {
    name: 'Ergonomic Wireless Mouse',
    description: 'Designed for ultimate palm comfort. Features multi-device Bluetooth connectivity, adjustable DPI (up to 4000), and ultra-silent clicks.',
    price: 49.99,
    category: 'Accessories',
    stock: 80,
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
    imageKey: 'local-seeder-mouse',
  },
  {
    name: 'Classic Bomber Jacket',
    description: 'A stylish, windbreaker-grade fashion jacket with ribbed collar, metal zip closure, and interior safety pockets. Perfect for spring and autumn.',
    price: 129.99,
    category: 'Fashion',
    stock: 15,
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
    imageKey: 'local-seeder-jacket',
  },
  {
    name: '4K Ultra HD IPS Monitor',
    description: 'Stunning 27-inch 4K IPS display featuring true-to-life colors, ultra-thin bezels, and versatile HDMI/DisplayPort inputs for work or entertainment.',
    price: 349.99,
    category: 'Electronics',
    stock: 20,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    imageKey: 'local-seeder-monitor',
  },
  {
    name: 'Pro USB Condenser Microphone',
    description: 'Studio-quality recording microphone featuring cardioid pickup pattern, zero-latency headphone monitoring, and a plug-and-play USB connection.',
    price: 79.99,
    category: 'Audio',
    stock: 25,
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
    imageKey: 'local-seeder-microphone',
  },
  {
    name: 'Minimalist Slim Leather Wallet',
    description: 'Crafted from full-grain leather, featuring 6 card slots, a money clip, and integrated RFID-blocking technology to protect your digital assets.',
    price: 29.99,
    category: 'Accessories',
    stock: 100,
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1627124118304-727ad4e073c6?auto=format&fit=crop&w=600&q=80',
    imageKey: 'local-seeder-wallet',
  },
];

const seedDB = async () => {
  console.log(`Connecting to database at ${mongoUri}...`);

  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    // 1. Clear existing data
    console.log('Cleaning up existing collections...');
    await Promise.all([
      Product.deleteMany({}),
      User.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log('Collections cleared.');

    // 2. Create users
    console.log('Creating admin and customer accounts...');

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@cloudcart.com',
      password: 'Admin123!',
      role: 'admin',
    });

    const customerUser = await User.create({
      name: 'John Customer',
      email: 'customer@cloudcart.com',
      password: 'Customer123!',
      role: 'consumer',
    });

    // 3. Create carts for both users
    await Cart.create({ user: adminUser._id, items: [] });
    await Cart.create({ user: customerUser._id, items: [] });

    console.log('Users created:');
    console.log('  Admin:    admin@cloudcart.com    (password: Admin123!)');
    console.log('  Customer: customer@cloudcart.com (password: Customer123!)');

    // 4. Create products
    console.log('Creating premium e-commerce products...');
    await Product.insertMany(products);
    console.log(`Successfully seeded ${products.length} products into the database.`);

    console.log('\n🎉 Seeding complete! You can now login with:');
    console.log('   Admin:    admin@cloudcart.com / Admin123!');
    console.log('   Customer: customer@cloudcart.com / Customer123!');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
