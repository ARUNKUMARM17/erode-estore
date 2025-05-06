import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price,
      regularPrice,
      category, 
      quantity, 
      brand, 
      image,
      primeDiscount 
    } = req.body;

    // Validation
    switch (true) {
      case !name:
        return res.json({ error: "Name is required" });
      case !brand:
        return res.json({ error: "Brand is required" });
      case !description:
        return res.json({ error: "Description is required" });
      case !price:
        return res.json({ error: "Price is required" });
      case !category:
        return res.json({ error: "Category is required" });
      case !quantity:
        return res.json({ error: "Quantity is required" });
      case !image:
        return res.json({ error: "Image URL is required" });
    }

    // Validate Prime discount if it's enabled
    if (primeDiscount?.isEligible) {
      if (!primeDiscount.discountType) {
        return res.json({ error: "Discount type is required for Prime eligible products" });
      }
      if (primeDiscount.discountValue === undefined || primeDiscount.discountValue === null) {
        return res.json({ error: "Discount value is required for Prime eligible products" });
      }
      if (primeDiscount.discountType === 'percentage' && (primeDiscount.discountValue < 0 || primeDiscount.discountValue > 100)) {
        return res.json({ error: "Percentage discount must be between 0 and 100" });
      }
      if (primeDiscount.discountType === 'fixed' && primeDiscount.discountValue < 0) {
        return res.json({ error: "Fixed discount cannot be negative" });
      }
    }

    const product = new Product({
      name,
      description,
      price,
      regularPrice: regularPrice || price,
      category,
      quantity,
      brand,
      image,
      countInStock: quantity,
      primeDiscount: primeDiscount || {
        isEligible: false,
        discountType: 'percentage',
        discountValue: 0
      }
    });

    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    console.log("Update product request:", req.body);
    const { 
      name, 
      description, 
      price,
      regularPrice,
      category, 
      quantity, 
      brand, 
      image, 
      countInStock,
      primeDiscount 
    } = req.body;

    // Validation
    if (!name || !description || !price || !category || !quantity || !brand || !image) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate Prime discount if it's enabled
    if (primeDiscount?.isEligible) {
      if (!primeDiscount.discountType) {
        return res.json({ error: "Discount type is required for Prime eligible products" });
      }
      if (primeDiscount.discountValue === undefined || primeDiscount.discountValue === null) {
        return res.json({ error: "Discount value is required for Prime eligible products" });
      }
      if (primeDiscount.discountType === 'percentage' && (primeDiscount.discountValue < 0 || primeDiscount.discountValue > 100)) {
        return res.json({ error: "Percentage discount must be between 0 and 100" });
      }
      if (primeDiscount.discountType === 'fixed' && primeDiscount.discountValue < 0) {
        return res.json({ error: "Fixed discount cannot be negative" });
      }
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update fields
    product.name = name;
    product.description = description;
    product.price = price;
    product.regularPrice = regularPrice || price;
    product.category = category;
    product.quantity = quantity;
    product.brand = brand;
    product.image = image;
    product.countInStock = countInStock || quantity;
    product.primeDiscount = primeDiscount || {
      isEligible: false,
      discountType: 'percentage',
      discountValue: 0
    };

    const updatedProduct = await product.save();
    console.log("Updated product:", updatedProduct);
    res.json(updatedProduct);
  } catch (error) {
    console.error("Product update error:", error);
    res.status(400).json({ error: error.message });
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};
