import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import { JWT_EXPIRATION } from '../constants.js';

const authProviderSchema = new mongoose.Schema(
  {
    auth_provider: {
      type: String,
      enum: ['GOOGLE', 'LINKEDIN'],
      required: true,
    },
    provider_id: {
      type: String,
      required: true,
    },
    linked_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },

    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // not returned by default
    },

    email_verified: {
      type: Boolean,
      default: false,
    },

    auth_service: {
      type: [authProviderSchema],
      default: [],
    },

    resume_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResumesCollection',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  try {
    if (!this.isModified('password')) return ;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    next(error);
  }
});

userSchema.pre('findOneAndUpdate', async function () {
  try {
    const update = this.getUpdate();

    if (!update.password) return ;

    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  } catch (error) {
    next(error);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    if (!this.password) {
      throw new ApiError(400, 'Invalid email or password');
    }
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Invalid email or password');
  }
};

// Generate JWT Token
userSchema.methods.generateToken = function () {
  try {
    if (!process.env.JWT_SECRET_KEY) {
      throw new Error('JWT secret key is not defined');
    }

    return jwt.sign(
      {
        id: this._id,
        email: this.email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: Math.floor(JWT_EXPIRATION / 1000) }
    );
  } catch (error) {
    throw new Error('Token generation failed');
  }
};

// Add OAuth Provider
userSchema.methods.addAuthProvider = function (provider, providerId) {
  try {
    const exists = this.auth_service.find((p) => p.auth_provider === provider);

    if (exists) {
      throw new Error(`${provider} already linked`);
    }

    this.auth_service.push({
      auth_provider: provider,
      provider_id: providerId,
      linked_at: new Date(),
    });

    return this.save();
  } catch (error) {
    throw error;
  }
};

// Find user by email with password
userSchema.statics.findByEmailWithPassword = function (email) {
  return this.findOne({ email }).select('+password');
};

const User = mongoose.model('User', userSchema);
export default User;
