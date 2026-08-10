import express from 'express';
import mongoose from 'mongoose';
import { BusinessProfileModel } from '../models/BusinessProfile.js';

const router = express.Router();

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

let memoryProfile = { ...DEFAULT_PROFILE };

// GET profile
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let profile = await BusinessProfileModel.findOne().lean();
      if (!profile) {
        profile = await BusinessProfileModel.create(DEFAULT_PROFILE);
      }
      return res.json(profile);
    }
    res.json(memoryProfile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST / PUT profile
router.post('/', async (req, res) => {
  try {
    const profileData = req.body;
    if (mongoose.connection.readyState === 1) {
      let profile = await BusinessProfileModel.findOne();
      if (profile) {
        Object.assign(profile, profileData);
        await profile.save();
      } else {
        profile = await BusinessProfileModel.create(profileData);
      }
      return res.json(profile);
    }
    memoryProfile = { ...memoryProfile, ...profileData };
    res.json(memoryProfile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
