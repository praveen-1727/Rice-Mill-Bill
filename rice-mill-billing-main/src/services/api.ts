import type { Bill, Customer, BusinessProfile } from '../types/billing';
import * as localStorageUtil from '../utils/storage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface ServerStatus {
  online: boolean;
  dbConnected: boolean;
  message: string;
}

export async function checkServerHealth(): Promise<ServerStatus> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(id);

    if (res.ok) {
      const data = await res.json();
      return {
        online: true,
        dbConnected: data.database.includes('connected') && !data.database.includes('disconnected'),
        message: data.database,
      };
    }
  } catch (err) {
    // Offline or server not running
  }
  return { online: false, dbConnected: false, message: 'Local Mode (Offline)' };
}

// ---------------- BILLS API ----------------
export async function fetchBills(): Promise<Bill[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/bills`);
    if (res.ok) {
      const bills = await res.json();
      if (Array.isArray(bills) && bills.length > 0) {
        return bills;
      }
    }
  } catch (err) {
    console.warn('[API] Could not fetch bills from MERN server, falling back to LocalStorage');
  }
  return localStorageUtil.getBills();
}

export async function saveBillApi(billData: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Bill> {
  try {
    const res = await fetch(`${API_BASE_URL}/bills`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(billData),
    });
    if (res.ok) {
      const savedBill = await res.json();
      localStorageUtil.saveBill(savedBill); // mirror locally
      return savedBill;
    }
  } catch (err) {
    console.warn('[API] Error saving bill to MERN server, saving to LocalStorage');
  }
  return localStorageUtil.saveBill(billData);
}

export async function deleteBillApi(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/bills/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('[API] Error deleting bill from MERN server');
  }
  localStorageUtil.deleteBill(id);
}

// ---------------- CUSTOMERS API ----------------
export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/customers`);
    if (res.ok) {
      const customers = await res.json();
      if (Array.isArray(customers) && customers.length > 0) {
        return customers;
      }
    }
  } catch (err) {
    console.warn('[API] Could not fetch customers from MERN server, falling back to LocalStorage');
  }
  return localStorageUtil.getCustomers();
}

export async function saveCustomerApi(customerData: Omit<Customer, 'id' | 'createdAt'> & { id?: string }): Promise<Customer> {
  try {
    const res = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData),
    });
    if (res.ok) {
      const savedCust = await res.json();
      localStorageUtil.saveCustomer(savedCust); // mirror locally
      return savedCust;
    }
  } catch (err) {
    console.warn('[API] Error saving customer to MERN server');
  }
  return localStorageUtil.saveCustomer(customerData);
}

export async function deleteCustomerApi(id: string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/customers/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('[API] Error deleting customer from MERN server');
  }
  localStorageUtil.deleteCustomer(id);
}

// ---------------- BUSINESS PROFILE API ----------------
export async function fetchProfile(): Promise<BusinessProfile> {
  try {
    const res = await fetch(`${API_BASE_URL}/profile`);
    if (res.ok) {
      const profile = await res.json();
      if (profile && profile.name) {
        return profile;
      }
    }
  } catch (err) {
    console.warn('[API] Could not fetch profile from MERN server, falling back to LocalStorage');
  }
  return localStorageUtil.getProfile();
}

export async function saveProfileApi(profile: BusinessProfile): Promise<BusinessProfile> {
  try {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (res.ok) {
      const updated = await res.json();
      localStorageUtil.saveProfile(updated); // mirror locally
      return updated;
    }
  } catch (err) {
    console.warn('[API] Error saving profile to MERN server');
  }
  localStorageUtil.saveProfile(profile);
  return profile;
}

// ---------------- DATABASE SEED / SYNC API ----------------
export async function seedMongoDemoData(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/seed/demo`, { method: 'POST' });
    return res.ok;
  } catch (err) {
    return false;
  }
}

export async function syncLocalStorageToMongo(): Promise<boolean> {
  try {
    const payload = {
      bills: localStorageUtil.getBills(),
      customers: localStorageUtil.getCustomers(),
      profile: localStorageUtil.getProfile(),
    };
    const res = await fetch(`${API_BASE_URL}/seed/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    return false;
  }
}
