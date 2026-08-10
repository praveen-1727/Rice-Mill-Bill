import express from 'express';
import mongoose from 'mongoose';
import { CustomerModel } from '../models/Customer.js';

const router = express.Router();

let memoryCustomers = [];

// GET all customers
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const customers = await CustomerModel.find().sort({ createdAt: -1 }).lean();
      return res.json(customers);
    }
    res.json(memoryCustomers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create or update customer
router.post('/', async (req, res) => {
  try {
    const custData = req.body;
    const now = new Date().toISOString();

    if (!custData.id) {
      custData.id = `cust-${Date.now()}`;
    }

    if (mongoose.connection.readyState === 1) {
      const updated = await CustomerModel.findOneAndUpdate(
        { id: custData.id },
        { ...custData, updatedAt: now },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean();
      return res.status(201).json(updated);
    }

    const index = memoryCustomers.findIndex((c) => c.id === custData.id);
    if (index !== -1) {
      memoryCustomers[index] = { ...memoryCustomers[index], ...custData, updatedAt: now };
      return res.json(memoryCustomers[index]);
    }

    const newCust = { ...custData, createdAt: now };
    memoryCustomers.unshift(newCust);
    res.status(201).json(newCust);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE customer
router.delete('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await CustomerModel.deleteOne({ id: req.params.id });
      return res.json({ success: true, message: 'Customer deleted' });
    }
    memoryCustomers = memoryCustomers.filter((c) => c.id !== req.params.id);
    res.json({ success: true, message: 'Customer deleted from memory' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
