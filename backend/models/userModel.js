import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    isPrimeMember: {
      type: Boolean,
      default: false,
    },

    primeSubscription: {
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
      },
      plan: {
        type: String,
        enum: ['monthly', 'quarterly', 'annual'],
      },
      price: {
        type: Number,
      }
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
