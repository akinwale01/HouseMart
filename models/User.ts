import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  phone: String,
  password: String, // hashed password

  // Type of user (customer or agent/landlord)
  userType: {
    type: String,
    enum: ["customer", "landlord", "agent"],
    default: "customer",
  },

  // Landlord sub-type (optional)
  landlordType: {
    type: String,
    enum: ["individual", "agency"],
  },

  // Agent-specific fields
  agencyName: String,
  licenseNumber: String,

  // Profile setup additions
  username: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  profilePicture: String,
  address: String,
  bio: String,
  website: String,
  propertyCount: Number,

  // Flags & metadata
  isEmailVerified: { type: Boolean, default: false },
  profileCompleted: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
