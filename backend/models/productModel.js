import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    regularPrice: { type: Number, required: true }, // Original price
    price: { type: Number, required: true }, // Current selling price (may include regular discounts)
    countInStock: { type: Number, required: true, default: 0 },
    primeDiscount: {
      isEligible: { type: Boolean, default: false },
      discountType: { 
        type: String, 
        enum: ['percentage', 'fixed'],
        default: 'percentage'
      },
      discountValue: { 
        type: Number, 
        default: 0,
        validate: {
          validator: function(value) {
            if (this.primeDiscount.discountType === 'percentage') {
              return value >= 0 && value <= 100;
            }
            return value >= 0;
          },
          message: 'Percentage discount must be between 0 and 100'
        }
      },
      discountedPrice: { type: Number },
      savings: { type: Number }
    },
  },
  { timestamps: true }
);

// Calculate discounted price and savings before saving
productSchema.pre('save', function(next) {
  if (this.primeDiscount.isEligible && this.primeDiscount.discountValue > 0) {
    if (this.primeDiscount.discountType === 'percentage') {
      this.primeDiscount.discountedPrice = this.regularPrice * (1 - this.primeDiscount.discountValue / 100);
    } else {
      // Fixed amount discount
      this.primeDiscount.discountedPrice = Math.max(0, this.regularPrice - this.primeDiscount.discountValue);
    }
    this.primeDiscount.savings = this.regularPrice - this.primeDiscount.discountedPrice;
  } else {
    this.primeDiscount.discountedPrice = this.regularPrice;
    this.primeDiscount.savings = 0;
  }
  
  // Round to 2 decimal places
  if (this.primeDiscount.discountedPrice) {
    this.primeDiscount.discountedPrice = Math.round(this.primeDiscount.discountedPrice * 100) / 100;
  }
  if (this.primeDiscount.savings) {
    this.primeDiscount.savings = Math.round(this.primeDiscount.savings * 100) / 100;
  }
  
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
