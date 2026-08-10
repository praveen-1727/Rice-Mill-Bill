import mongoose from 'mongoose';

const businessProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tagline: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    phone: { type: String, default: '' },
    bankName: { type: String, default: '' },
    accountNo: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    terms: [{ type: String }],
  },
  { timestamps: true }
);

export const BusinessProfileModel = mongoose.model('BusinessProfile', businessProfileSchema);
