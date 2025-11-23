const Product = require('../models/Product');
const Category = require('../models/Category');

exports.getAllProducts = async (req, res) => {
  try {
    const {
      title,
      price,
      price_min,
      price_max,
      categoryId,
      categorySlug,
      limit = 20,
      offset = 0
    } = req.query;

    // Build filter object
    const filter = {};

    // Text search
    if (title) {
      filter.$text = { $search: title };
    }

    // Price filters
    if (price) {
      filter.price = Number(price);
    } else {
      const priceFilter = {};
      if (price_min) priceFilter.$gte = Number(price_min);
      if (price_max) priceFilter.$lte = Number(price_max);
      if (Object.keys(priceFilter).length > 0) {
        filter.price = priceFilter;
      }
    }

    // Category filters
    if (categoryId) {
      filter.category = categoryId;
    } else if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      if (category) {
        filter.category = category._id;
      } else {
        // If category not found, return empty array
        return res.status(200).json([]);
      }
    }

    // Execute query with pagination
    const products = await Product.find(filter)
      .populate('category', 'name slug image')
      .limit(Number(limit))
      .skip(Number(offset))
      .sort({ createdAt: -1 });

    // Get total count for pagination info
    const total = await Product.countDocuments(filter);

    res.status(200).json(products);

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug image');

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }

    res.status(200).json(product);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found'
      });
    }
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};