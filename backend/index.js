// packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import Stripe from 'stripe';
import cors from 'cors';

// Utiles
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import primeRoutes from "./routes/primeRoutes.js";
import morgan from "morgan";

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: ["https://erode-estore.vercel.app/", "http://localhost:5173/"],
  credentials: true,
}));
app.get('/', (req, res) => {
  res.send('App is running');
});

app.use("/api/users", userRoutes);
app.use("/api/users/prime", primeRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);

// Make sure we have a valid secret key
const secretKey = process.env.STRIPE_SECRET_KEY;
console.log("Initializing Stripe with secret key (first few chars):", 
  secretKey ? secretKey.substring(0, 8) + '...' : 'missing');

if (!secretKey || secretKey === 'undefined' || secretKey.includes('your_')) {
  console.error("⚠️ WARNING: Invalid Stripe secret key detected!");
}

let stripe;
try {
  stripe = new Stripe(secretKey);
} catch (error) {
  console.error("Failed to initialize Stripe:", error.message);
}

app.get("/api/config/stripe", (req, res) => {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey || publishableKey === 'undefined') {
    return res.status(500).json({ error: "Stripe publishable key is not configured" });
  }
  res.send({ publishableKey });
});

app.post("/api/create-payment-intent", async (req, res) => {
  if (!stripe) {
    return res.status(500).json({ error: "Stripe is not properly initialized" });
  }

  try {
    const { amount } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }
    
    console.log("Creating payment intent for amount:", amount);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: 'inr',
      payment_method_types: ['card'],
    });

    if (!paymentIntent.client_secret) {
      return res.status(500).json({ error: "Failed to create payment intent" });
    }

    console.log("Payment intent created successfully");
    
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Payment intent error:", error);
    res.status(500).json({ error: error.message });
  }
});

// const __dirname = path.resolve();
// app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.listen(port, () => console.log(`Server running on port: ${port}`));
