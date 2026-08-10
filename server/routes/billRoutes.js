import express from 'express';
import mongoose from 'mongoose';
import { BillModel } from '../models/Bill.js';

const router = express.Router();

let memoryBills = [];

async function getNextRMNo() {
  let count = 0;
  if (mongoose.connection.readyState === 1) {
    const bills = await BillModel.find().lean();
    let max = 0;
    for (const b of bills) {
      if (b.billNo) {
        const match = b.billNo.match(/RM-(\d+)/i) || b.billNo.match(/(\d+)/);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (num > max) max = num;
        }
      }
    }
    return `RM-${max + 1}`;
  } else {
    let max = 0;
    for (const b of memoryBills) {
      if (b.billNo) {
        const match = b.billNo.match(/RM-(\d+)/i) || b.billNo.match(/(\d+)/);
        if (match && match[1]) {
          const num = parseInt(match[1], 10);
          if (num > max) max = num;
        }
      }
    }
    return `RM-${max + 1}`;
  }
}

// GET all bills
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const bills = await BillModel.find().sort({ createdAt: -1 }).lean();
      return res.json(bills);
    }
    res.json(memoryBills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET bill by ID
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const bill = await BillModel.findOne({ id: req.params.id }).lean();
      if (!bill) return res.status(404).json({ message: 'Bill not found' });
      return res.json(bill);
    }
    const found = memoryBills.find((b) => b.id === req.params.id);
    if (!found) return res.status(404).json({ message: 'Bill not found' });
    res.json(found);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create or update bill
router.post('/', async (req, res) => {
  try {
    const billData = req.body;
    const now = new Date().toISOString();

    if (!billData.id) {
      billData.id = `bill-${Date.now()}`;
    }
    if (!billData.billNo) {
      billData.billNo = await getNextRMNo();
    }

    if (mongoose.connection.readyState === 1) {
      const updated = await BillModel.findOneAndUpdate(
        { id: billData.id },
        { ...billData, updatedAt: now },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean();
      return res.status(201).json(updated);
    }

    const index = memoryBills.findIndex((b) => b.id === billData.id);
    if (index !== -1) {
      memoryBills[index] = { ...memoryBills[index], ...billData, updatedAt: now };
      return res.json(memoryBills[index]);
    }

    const newBill = { ...billData, createdAt: now, updatedAt: now };
    memoryBills.unshift(newBill);
    res.status(201).json(newBill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE bill
router.delete('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await BillModel.deleteOne({ id: req.params.id });
      return res.json({ success: true, message: 'Bill deleted from MongoDB' });
    }
    memoryBills = memoryBills.filter((b) => b.id !== req.params.id);
    res.json({ success: true, message: 'Bill deleted from memory' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
