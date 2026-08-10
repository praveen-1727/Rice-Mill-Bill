import type { Bill, Customer, BusinessProfile, BillItem } from '../types/billing';
import { generateNextBillNo, getISTDateString } from './dateUtils';

const STORAGE_KEYS = {
  BILLS: 'telugu_rice_mill_bills_v3',
  CUSTOMERS: 'telugu_rice_mill_customers_v3',
  PROFILE: 'telugu_rice_mill_profile_v3',
};

export const DEFAULT_PROFILE: BusinessProfile = {
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

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'రామయ్య గారు (రైతు)',
    phone: '9849123456',
    village: 'నల్లగొండ',
    address: 'ఇంటి నం. 4-12, మెయిన్ రోడ్డు',
    createdAt: '2026-07-01T10:00:00.000Z'
  }
];

export const REFERENCE_SECTION1_ITEMS: BillItem[] = [
  {
    id: 'item-1',
    name: 'బియ్యం',
    section: 'section1',
    bags: 25,
    multiplier: 6,
    extraKg: 9,
    quantity: 159,
    rate: 0,
    amount: 0,
    calculationText: '25 kg × 6 kg + 9 kg = 159 kg'
  },
  {
    id: 'item-2',
    name: 'నూకలు',
    section: 'section1',
    quantity: 30,
    rate: 0,
    amount: 0,
    calculationText: '30 kg'
  },
  {
    id: 'item-3',
    name: 'మిల్లింగ్',
    section: 'section1',
    quantity: 189,
    rate: 2,
    amount: 378,
    calculationText: '189 kg × 2 = 378'
  },
  {
    id: 'item-4',
    name: 'కవర్',
    section: 'section1',
    quantity: 10,
    rate: 12,
    amount: 120,
    calculationText: '10 × 12 = 120'
  },
  {
    id: 'item-5',
    name: 'పౌడర్',
    section: 'section1',
    quantity: 2,
    rate: 50,
    amount: 100,
    calculationText: '2 × 50 = 100'
  }
];

export const REFERENCE_SECTION2_ITEMS: BillItem[] = [
  {
    id: 'item-6',
    name: 'నూకలు',
    section: 'section2',
    quantity: 30,
    rate: 20,
    amount: 600,
    calculationText: '30 × 20 = 600'
  },
  {
    id: 'item-7',
    name: 'తవుడు',
    section: 'section2',
    quantity: 30,
    rate: 22,
    amount: 660,
    calculationText: '30 × 22 = 660'
  }
];

export const INITIAL_BILLS: Bill[] = [
  {
    id: 'bill-1',
    billNo: 'RM-1',
    date: getISTDateString(),
    customerId: 'cust-1',
    customerName: 'రామయ్య గారు (రైతు)',
    customerPhone: '9849123456',
    customerVillage: 'నల్లగొండ',
    section1Items: REFERENCE_SECTION1_ITEMS,
    section2Items: REFERENCE_SECTION2_ITEMS,
    section1Total: 598,
    section2Total: 1260,
    finalBalance: 662,
    notes: 'హ్యాండ్‌రైటెన్ బిల్లు ఫార్మాట్ బిల్లు సృష్టి',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export function getProfile(): BusinessProfile {
  const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
    return DEFAULT_PROFILE;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: BusinessProfile): void {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function getCustomers(): Customer[] {
  const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    return INITIAL_CUSTOMERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_CUSTOMERS;
  }
}

export function saveCustomer(customer: Omit<Customer, 'id' | 'createdAt'> & { id?: string }): Customer {
  const customers = getCustomers();
  const now = new Date().toISOString();
  
  if (customer.id) {
    const index = customers.findIndex(c => c.id === customer.id);
    if (index !== -1) {
      const updated: Customer = {
        ...customers[index],
        ...customer,
        id: customer.id,
        updatedAt: now
      };
      customers[index] = updated;
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
      return updated;
    }
  }

  const newCustomer: Customer = {
    id: `cust-${Date.now()}`,
    name: customer.name,
    phone: customer.phone,
    village: customer.village,
    address: customer.address || '',
    createdAt: now
  };
  customers.unshift(newCustomer);
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  return newCustomer;
}

export function deleteCustomer(id: string): void {
  const customers = getCustomers().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
}

export function getBills(): Bill[] {
  const data = localStorage.getItem(STORAGE_KEYS.BILLS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(INITIAL_BILLS));
    return INITIAL_BILLS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_BILLS;
  }
}

export function saveBill(bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Bill {
  const bills = getBills();
  const now = new Date().toISOString();

  if (bill.id) {
    const index = bills.findIndex(b => b.id === bill.id);
    if (index !== -1) {
      const updated: Bill = {
        ...bills[index],
        ...bill,
        id: bill.id,
        updatedAt: now
      };
      bills[index] = updated;
      localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
      return updated;
    }
  }

  let billNo = bill.billNo;
  if (!billNo) {
    billNo = generateNextBillNo(bills);
  }

  const newBill: Bill = {
    ...bill,
    id: `bill-${Date.now()}`,
    billNo,
    createdAt: now,
    updatedAt: now
  };

  bills.unshift(newBill);
  localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
  return newBill;
}

export function deleteBill(id: string): void {
  const bills = getBills().filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
}

export function resetDemoData(): void {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
  localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(INITIAL_BILLS));
}

export function exportBackupData(): string {
  const data = {
    profile: getProfile(),
    customers: getCustomers(),
    bills: getBills(),
    exportedAt: new Date().toISOString()
  };
  return JSON.stringify(data, null, 2);
}

export function importBackupData(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.profile) localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(parsed.profile));
    if (parsed.customers) localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(parsed.customers));
    if (parsed.bills) localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(parsed.bills));
    return true;
  } catch (e) {
    console.error('Failed to import backup data:', e);
    return false;
  }
}
