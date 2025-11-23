const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");
require("dotenv").config();

const categoriesData = [
  {
    name: "Clothes",
    slug: "clothes",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=300&fit=crop",
  },
  {
    name: "Electronics",
    slug: "electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=300&fit=crop",
  },
  {
    name: "Furniture",
    slug: "furniture",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=300&fit=crop",
  },
  {
    name: "Shoes",
    slug: "shoes",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=300&fit=crop",
  },
  {
    name: "Others",
    slug: "others",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=300&fit=crop",
  },
];

const productsData = [
  // =========================
  // Clothes (10 Products)
  // =========================
  {
    title: "Classic Cotton T-Shirt",
    price: 250,
    description:
      "High-quality cotton T-shirt with breathable fabric and durable stitching.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&h=500&fit=crop",
    ],
    category: "clothes",
    inStock: true,
    rating: { rate: 4.5, count: 140 },
  },
  {
    title: "Men's Casual Hoodie",
    price: 480,
    description:
      "Soft fleece hoodie designed for daily comfort and modern casual style.",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5b?w=500&h=500&fit=crop",
    ],
    category: "clothes",
    inStock: true,
    rating: { rate: 4.7, count: 190 },
  },
  {
    title: "Slim Fit Jeans",
    price: 350,
    description:
      "Durable slim-fit jeans with flexible denim for maximum comfort.",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=500&h=500&fit=crop",
    ],
    category: "clothes",
    inStock: true,
    rating: { rate: 4.4, count: 100 },
  },
  {
    title: "Women's Summer Dress",
    price: 620,
    description: "Lightweight floral dress perfect for summer outings.",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&h=500&fit=crop",
    ],
    category: "clothes",
    inStock: false,
    rating: { rate: 4.6, count: 210 },
  },
  {
    title: "Sports Training Jacket",
    price: 780,
    description:
      "Breathable and water-resistant jacket ideal for outdoor training.",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1506459225024-1428097a7e18?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500&h=500&fit=crop",
    ],
    category: "clothes",
    inStock: true,
    rating: { rate: 4.3, count: 90 },
  },
  {
    title: "Winter Wool Sweater",
    price: 560,
    description:
      "Premium wool sweater engineered for warmth and comfort during winter.",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1574180045827-681f8a1a9622?w=500&h=500&fit=crop",
    ],
    category: "clothes",
    inStock: true,
    rating: { rate: 4.8, count: 260 },
  },
  {
    title: "Women's Leather Jacket",
    price: 1450,
    description:
      "Premium leather jacket with tailored fit and durable exterior.",
    images: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1556906781-2a6a68106d4a?w=500&h=500&fit=crop",
    ],
    category: "clothes",
    inStock: false,
    rating: { rate: 4.9, count: 300 },
  },
  {
    title: "Casual Polo Shirt",
    price: 320,
    description: "Comfortable cotton polo, suitable for work or casual wear.",
    images: [
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=500&fit=crop",
    ],
    category: "clothes",
    inStock: true,
    rating: { rate: 4.2, count: 110 },
  },
  {
    title: "Women's Knit Cardigan",
    price: 540,
    description: "Soft knit cardigan perfect for all-season layering.",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1574180045827-681f8a1a9622?w=500&h=500&fit=crop",
    ],
    category: "clothes",
    inStock: true,
    rating: { rate: 4.7, count: 170 },
  },
  {
    title: "Men's Formal Shirt",
    price: 410,
    description:
      "Elegant cotton shirt suitable for business and formal events.",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=500&fit=crop",
    ],
    category: "clothes",
    inStock: true,
    rating: { rate: 4.3, count: 95 },
  },

  // =========================
  // Electronics (10 Products)
  // =========================
  {
    title: "Smart Bluetooth Speaker",
    price: 1150,
    description:
      "Portable smart speaker with deep bass, voice assistant, and 360° sound.",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
    ],
    category: "electronics",
    inStock: true,
    rating: { rate: 4.8, count: 310 },
  },
  {
    title: "Wireless Noise Cancelling Headphones",
    price: 2200,
    description:
      "Over-ear headphones with industry-leading noise cancelling technology.",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop",
    ],
    category: "electronics",
    inStock: false,
    rating: { rate: 4.9, count: 540 },
  },
  {
    title: "4K Ultra HD Smart TV",
    price: 5600,
    description:
      "55-inch smart TV with HDR10, vivid colors, and built-in streaming apps.",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=500&h=500&fit=crop",
    ],
    category: "electronics",
    inStock: true,
    rating: { rate: 4.6, count: 215 },
  },
  {
    title: "Gaming Mechanical Keyboard",
    price: 780,
    description:
      "RGB gaming keyboard with mechanical switches and aluminum frame.",
    images: [
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop",
    ],
    category: "electronics",
    inStock: true,
    rating: { rate: 4.7, count: 270 },
  },
  {
    title: "Wireless Gaming Mouse",
    price: 450,
    description:
      "Lightweight gaming mouse with ultra-fast response and ergonomic grip.",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
    ],
    category: "electronics",
    inStock: true,
    rating: { rate: 4.5, count: 190 },
  },
  {
    title: "Professional DSLR Camera",
    price: 8400,
    description:
      "DSLR camera with 24MP sensor, 4K video recording, and fast autofocus.",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop",
    ],
    category: "electronics",
    inStock: false,
    rating: { rate: 4.8, count: 380 },
  },
  {
    title: "Smart Fitness Watch",
    price: 950,
    description:
      "Fitness smartwatch with heart rate monitor, GPS, and sleep tracking.",
    images: [
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1434493652605-8c23e35e3e0a?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500&h=500&fit=crop",
    ],
    category: "electronics",
    inStock: true,
    rating: { rate: 4.4, count: 200 },
  },
  {
    title: "Portable Power Bank 20000mAh",
    price: 340,
    description:
      "High capacity power bank with fast charging and dual USB ports.",
    images: [
      "https://images.unsplash.com/photo-1609592810793-abeb6c64b5c6?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1609592810793-abeb6c64b5c6?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1609592810793-abeb6c64b5c6?w=500&h=500&fit=crop",
    ],
    category: "electronics",
    inStock: true,
    rating: { rate: 4.6, count: 160 },
  },
  {
    title: "Bluetooth Earbuds",
    price: 430,
    description:
      "Lightweight earbuds with noise-isolating design and long battery life.",
    images: [
      "https://images.unsplash.com/photo-1590658165737-15a047b8b5e8?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1590658165737-15a047b8b5e8?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1590658165737-15a047b8b5e8?w=500&h=500&fit=crop",
    ],
    category: "electronics",
    inStock: true,
    rating: { rate: 4.3, count: 230 },
  },
  {
    title: "Professional Studio Microphone",
    price: 1250,
    description:
      "High-quality condenser microphone for recording and streaming.",
    images: [
      "https://images.unsplash.com/photo-1598440947619-2d35e9ac6c5e?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1598440947619-2d35e9ac6c5e?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1598440947619-2d35e9ac6c5e?w=500&h=500&fit=crop",
    ],
    category: "electronics",
    inStock: true,
    rating: { rate: 4.8, count: 300 },
  },

  // =========================
  // Furniture (10 Products)
  // =========================
  {
    title: "Modern Wooden Dining Table",
    price: 2500,
    description:
      "Elegant wooden dining table with minimalist design and durable finish.",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
    ],
    category: "furniture",
    inStock: true,
    rating: { rate: 4.7, count: 180 },
  },
  {
    title: "Ergonomic Office Chair",
    price: 1200,
    description:
      "Comfortable office chair with lumbar support and adjustable height.",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
    ],
    category: "furniture",
    inStock: true,
    rating: { rate: 4.5, count: 220 },
  },
  {
    title: "King Size Bed Frame",
    price: 3800,
    description:
      "Sturdy king size bed frame with built-in storage and modern design.",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=500&fit=crop",
    ],
    category: "furniture",
    inStock: false,
    rating: { rate: 4.8, count: 150 },
  },
  {
    title: "Leather Sofa Set",
    price: 5200,
    description: "Luxurious 3-seater leather sofa with matching armchairs.",
    images: [
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=500&h=500&fit=crop",
    ],
    category: "furniture",
    inStock: true,
    rating: { rate: 4.6, count: 190 },
  },
  {
    title: "Bookshelf with Glass Doors",
    price: 850,
    description: "Modern bookshelf with glass doors and adjustable shelves.",
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500&h=500&fit=crop",
    ],
    category: "furniture",
    inStock: true,
    rating: { rate: 4.4, count: 120 },
  },
  {
    title: "Coffee Table with Storage",
    price: 680,
    description: "Functional coffee table with hidden storage compartment.",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop",
    ],
    category: "furniture",
    inStock: true,
    rating: { rate: 4.3, count: 95 },
  },
  {
    title: "Wardrobe with Mirror",
    price: 2100,
    description:
      "Spacious wardrobe with full-length mirror and multiple compartments.",
    images: [
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=500&h=500&fit=crop",
    ],
    category: "furniture",
    inStock: true,
    rating: { rate: 4.7, count: 140 },
  },
  {
    title: "Study Desk with Drawers",
    price: 750,
    description:
      "Compact study desk with built-in drawers and cable management.",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop",
    ],
    category: "furniture",
    inStock: true,
    rating: { rate: 4.5, count: 110 },
  },
  {
    title: "Outdoor Patio Set",
    price: 3200,
    description: "Weather-resistant patio set with table and 4 chairs.",
    images: [
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&h=500&fit=crop",
    ],
    category: "furniture",
    inStock: false,
    rating: { rate: 4.6, count: 85 },
  },
  {
    title: "TV Stand with Fireplace",
    price: 1450,
    description: "Modern TV stand with electric fireplace and LED lighting.",
    images: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500&h=500&fit=crop",
    ],
    category: "furniture",
    inStock: true,
    rating: { rate: 4.8, count: 200 },
  },

  // =========================
  // Shoes (10 Products)
  // =========================
  {
    title: "Running Sports Shoes",
    price: 650,
    description:
      "Lightweight running shoes with cushioned sole and breathable mesh.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop",
    ],
    category: "shoes",
    inStock: true,
    rating: { rate: 4.7, count: 320 },
  },
  {
    title: "Classic Leather Boots",
    price: 1100,
    description: "Premium leather boots with durable sole and comfortable fit.",
    images: [
      "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=500&h=500&fit=crop",
    ],
    category: "shoes",
    inStock: true,
    rating: { rate: 4.5, count: 180 },
  },
  {
    title: "Casual Canvas Sneakers",
    price: 280,
    description: "Comfortable canvas sneakers perfect for everyday wear.",
    images: [
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&h=500&fit=crop",
    ],
    category: "shoes",
    inStock: true,
    rating: { rate: 4.3, count: 250 },
  },
  {
    title: "Basketball High-Tops",
    price: 890,
    description: "High-top basketball shoes with ankle support and grip sole.",
    images: [
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&h=500&fit=crop",
    ],
    category: "shoes",
    inStock: false,
    rating: { rate: 4.6, count: 150 },
  },
  {
    title: "Formal Oxford Shoes",
    price: 950,
    description: "Elegant oxford shoes for business and formal occasions.",
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500&h=500&fit=crop",
    ],
    category: "shoes",
    inStock: true,
    rating: { rate: 4.4, count: 120 },
  },
  {
    title: "Hiking Trail Shoes",
    price: 780,
    description: "Waterproof hiking shoes with rugged sole and ankle support.",
    images: [
      "https://www.legendfootwear.co.uk/cdn/shop/articles/trail_vs_hiking_shoes_ac961a00-04e8-47fb-b3af-8bb5325a0cda.jpg?v=1743510045",
      "https://www.switchbacktravel.com/sites/default/files/image_fields/Best%20Of%20Gear%20Articles/Hiking%20and%20Backpacking/Hiking%20Shoes/Hiking%20shoes%20%28closeup%20of%20La%20Sportiva%20TX4%20Evo%29.jpg",
      "https://i0.wp.com/trailtopeak.com/wp-content/uploads/2018/03/DSC01327.jpg?resize=840%2C560&ssl=1",
    ],
    category: "shoes",
    inStock: true,
    rating: { rate: 4.8, count: 210 },
  },
  {
    title: "Women's High Heels",
    price: 620,
    description:
      "Elegant high heels with comfortable padding and stylish design.",
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop",
    ],
    category: "shoes",
    inStock: true,
    rating: { rate: 4.2, count: 190 },
  },
  {
    title: "Slip-On Loafers",
    price: 420,
    description: "Comfortable slip-on loafers with memory foam insole.",
    images: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop",
    ],
    category: "shoes",
    inStock: true,
    rating: { rate: 4.5, count: 170 },
  },
  {
    title: "Sandals for Beach",
    price: 190,
    description: "Lightweight sandals perfect for beach and summer wear.",
    images: [
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&h=500&fit=crop",
    ],
    category: "shoes",
    inStock: true,
    rating: { rate: 4.1, count: 140 },
  },
  {
    title: "Skateboarding Shoes",
    price: 550,
    description: "Durable skate shoes with reinforced toe and grippy sole.",
    images: [
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=500&h=500&fit=crop",
    ],
    category: "shoes",
    inStock: true,
    rating: { rate: 4.7, count: 160 },
  },
];

const usersData = [
  {
    name: "John Doe",
    email: "john@mail.com",
    password: "changeme",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Maria Garcia",
    email: "maria@mail.com",
    password: "12345",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Ahmed Mohamed",
    email: "ahmed@mail.com",
    password: "password",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Wei Zhang",
    email: "wei@mail.com",
    password: "changeme",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Sophie Wilson",
    email: "sophie@mail.com",
    password: "12345",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce"
    );
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("Cleared existing data");

    // Create categories and store their IDs
    const categories = await Category.insertMany(categoriesData);
    console.log("Created categories");

    // Create a map of category slugs to IDs
    const categoryMap = {};
    categories.forEach((category) => {
      categoryMap[category.slug] = category._id;
    });

    // Assign categories to products based on category field in product data
    const productsWithCategories = productsData.map((product) => {
      return {
        ...product,
        category: categoryMap[product.category], // Use the category slug from product data
        slug: product.title
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, ""),
      };
    });

    // Create products
    await Product.insertMany(productsWithCategories);
    console.log("Created products");

    // Create users
    await User.insertMany(usersData);
    console.log("Created users");

    console.log("Database seeded successfully!");
    console.log(`Created ${categories.length} categories`);
    console.log(`Created ${productsWithCategories.length} products`);
    console.log(`Created ${usersData.length} users`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
