import mongoose from 'mongoose';

const billItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  section: { type: String, enum: ['section1', 'section2'], required: true },
  bags: { type: Number, default: 0 },
  multiplier: { type: Number, default: 0 },
  extraKg: { type: Number, default: 0 },
  quantity: { type: Number, required: true, default: 0 },
  rate: { type: Number, required: true, default: 0 },
  amount: { type: Number, required: true, default: 0 },
  calculationText: { type: String, default: '' },
});

const billSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    billNo: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    customerId: { type: String, default: 'guest' },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, default: '' },
    customerVillage: { type: String, default: '' },
    section1Items: [billItemSchema],
    section2Items: [billItemSchema],
    section1Total: { type: Number, required: true, default: 0 },
    section2Total: { type: Number, required: true, default: 0 },
    finalBalance: { type: Number, required: true, default: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const BillModel = mongoose.model('Bill', billSchema);
