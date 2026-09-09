import mongoose, { Schema } from 'mongoose';
import { USER_ROLES } from './user.types';
const userSchema = new Schema(
  {
    fullName: { type: String, required: [true, 'Full name is required'], trim: true, maxlength: 120 },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: USER_ROLES, default: 'CITIZEN', index: true },
    avatar: { type: String },
    address: { type: String, trim: true },
    province: { type: String, trim: true },
    district: { type: String, trim: true, index: true },
    municipality: { type: String, trim: true },
    ward: { type: Number, min: 1, max: 35 },
    language: { type: String, enum: ['en', 'ne'], default: 'en' },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    refreshTokens: { type: [String], select: false, default: [] },
  },
  { timestamps: true, versionKey: false },
);

userSchema.methods.toJSON = function (this: mongoose.Document & Record<string, unknown>) {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshTokens;
  return obj;
};

export const User = mongoose.model('User', userSchema);
