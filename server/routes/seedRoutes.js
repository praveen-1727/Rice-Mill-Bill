import express from 'express';
import mongoose from 'mongoose';
import { CustomerModel } from '../models/Customer.js';
import { BillModel } from '../models/Bill.js';
import { BusinessProfileModel } from '../models/BusinessProfile.js';

const router = express.Router();

const INITIAL_CUSTOMERS = [
  {
    id: 'cust-1',
    name: 'రామయ్య గారు (రైతు)',
    phone: '9849123456',
    village: 'నల్లగొండ',
    address: 'ఇంటి నం. 4-12, మెయిన్ రోడ్డు',
    createdAt: '2026-07-01T10:00:00.000Z'
  },
  {
    id: 'cust-2',
    name: 'వెంకటేశ్వరులు (ధాన్యం వ్యాపారి)',
    phone: '9866112233',
    village: 'హనుమకొండ',
    address: 'షాప్ #14, మార్కెట్ యార్డ్',
    createdAt: '2026-07-05T11:30:00.000Z'
  }
];

const INITIAL_BILLS = [
  {
    id: 'bill-1001',
    billNo: 'RMB-101',
    date: '2026-07-22',
    customerId: 'cust-1',
    customerName: 'రామయ్య గారు (రైతు)',
    customerPhone: '9849123456',
    customerVillage: 'నల్లగొండ',
    section1Items: [
      { id: 'item-1', name: 'బియ్యం', section: 'section1', bags: 25, multiplier: 6, extraKg: 9, quantity: 159, rate: 0, amount: 0, calculationText: '25 kg × 6 kg + 9 kg = 159 kg' },
      { id: 'item-2', name: 'నూకలు', section: 'section1', quantity: 30, rate: 0, amount: 0, calculationText: '30 kg' },
      { id: 'item-3', name: 'మిల్లింగ్', section: 'section1', quantity: 189, rate: 2, amount: 378, calculationText: '189 kg × 2 = 378' },
      { id: 'item-4', name: 'కవర్', section: 'section1', quantity: 10, rate: 12, amount: 120, calculationText: '10 × 12 = 120' },
      { id: 'item-5', name: 'పౌడర్', section: 'section1', quantity: 2, rate: 50, amount: 100, calculationText: '2 × 50 = 100' }
    ],
    section2Items: [
      { id: 'item-6', name: 'నూకలు', section: 'section2', quantity: 30, rate: 20, amount: 600, calculationText: '30 × 20 = 600' },
      { id: 'item-7', name: 'తవుడు', section: 'section2', quantity: 30, rate: 22, amount: 660, calculationText: '30 × 22 = 660' }
    ],
    section1Total: 598,
    section2Total: 1260,
    finalBalance: 662,
    notes: 'హ్యాండ్‌రైటెన్ బిల్లు ఫార్మాట్ బిల్లు సృష్టి',
    createdAt: '2026-07-22T09:30:00.000Z',
    updatedAt: '2026-07-22T09:30:00.000Z'
  }
];

const DEFAULT_PROFILE = {
  name: 'sri lakshmi modern ricemill',
  tagline: 'నాణ్యమైన వరి మిల్లింగ్ & హోల్‌సేల్ ధాన్యం వ్యాపారం',
  address: 'మెయిన్ రోడ్డు, మార్కెట్ యార్డ్ దగ్గర',
  city: 'మిర్యాలగూడ',
  state: 'తెలంగాణ',
  phone: '9848012345',
  bankName: 'స్టేట్ బ్యాంక్ ఆఫ్ ఇండియా',
  accountNo: '3894002910293',
  ifscCode: 'SBIN0001234',
  terms: [
    'బిల్లు రశీదు వెంటనే సరిచూసుకోవలెను.',
    'ఏవైనా తప్పులు ఉంటే 7 రోజులలోపు తెలియజేయగలరు.'
  ]
};

// POST seed initial demo data into MongoDB
router.post('/demo', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'MongoDB is not connected.' });
    }

    await CustomerModel.deleteMany({});
    await BillModel.deleteMany({});
    await BusinessProfileModel.deleteMany({});

    await CustomerModel.insertMany(INITIAL_CUSTOMERS);
    await BillModel.insertMany(INITIAL_BILLS);
    await BusinessProfileModel.create(DEFAULT_PROFILE);

    res.json({ message: 'Demo data seeded into MongoDB successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST sync custom data payload from client into MongoDB
router.post('/sync', async (req, res) => {
  try {
    const { bills, customers, profile } = req.body;
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'MongoDB is not connected.' });
    }

    if (Array.isArray(customers) && customers.length > 0) {
      for (const c of customers) {
        await CustomerModel.findOneAndUpdate({ id: c.id }, c, { upsert: true });
      }
    }

    if (Array.isArray(bills) && bills.length > 0) {
      for (const b of bills) {
        await BillModel.findOneAndUpdate({ id: b.id }, b, { upsert: true });
      }
    }

    if (profile) {
      await BusinessProfileModel.deleteMany({});
      await BusinessProfileModel.create(profile);
    }

    res.json({ message: 'Client data synced to MongoDB successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
