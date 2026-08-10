import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: '' },
    village: { type: String, default: '' },
    address: { type: String, default: '' },
  },
  { timestamps: true }
);

export const CustomerModel = mongoose.model('Customer', customerSchema);
