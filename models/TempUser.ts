import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema({
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  password: { type: String, default: "" }, // plain for manual signup; empty for Google signup
  userType: { type: String, enum: ["customer", "agent", "landlord"], default: "customer" },
  landlordType: { type: String, enum: ["individual", "agency"] },
  agencyName: { type: String, trim: true },
  licenseNumber: { type: String, trim: true },
  otp: { type: String, trim: true },
  otpExpiresAt: { type: Date },
  isVerified: { type: Boolean, default: false }, // OTP verified for manual signup
  profileCompleted: { type: Boolean, default: false }, // true when profile setup done
  googleId: { type: String, trim: true }, // Google OAuth ID
  isGoogleUser: { type: Boolean, default: false }, // ✅ flag to skip OTP verification
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook: mark Google users correctly
tempUserSchema.pre("save", function (next) {
  if (this.googleId) {
    this.isGoogleUser = true;
    this.isVerified = true; // Google email is considered verified
  }
  next();
});

export default mongoose.models.TempUser || mongoose.model("TempUser", tempUserSchema);