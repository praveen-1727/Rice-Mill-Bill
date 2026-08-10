export type BillSection = 'section1' | 'section2';

export interface BillItem {
  id: string;
  name: string; // e.g. 'బియ్యం', 'నూకలు', 'మిల్లింగ్', 'కవర్', 'పౌడర్', 'తవుడు'
  section: BillSection;
  bags?: number;        // e.g. 25
  multiplier?: number;  // e.g. 6 or 2 or 12 or 50
  extraKg?: number;     // e.g. 9
  quantity: number;     // e.g. 159, 30, 189, 10, 2
  rate: number;         // e.g. 2, 12, 50, 20, 22
  amount: number;       // Calculated total for row
  calculationText?: string; // e.g. "25 kg × 6 kg + 9 kg = 159 kg"
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  village: string;
  address?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Bill {
  id: string;
  billNo: string;
  date: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  customerVillage?: string;
  section1Items: BillItem[]; // మొదటి భాగం (సరుకులు / మిల్లింగ్ చార్జీలు)
  section2Items: BillItem[]; // రెండవ భాగం (అమ్మకాలు / క్రెడిట్స్)
  section1Total: number;     // మొదటి భాగం మొత్తం (e.g. 598)
  section2Total: number;     // రెండవ భాగం మొత్తం (e.g. 1260)
  finalBalance: number;      // నికర బాకీ/నిల్వ = రెండవ భాగం మొత్తం - మొదటి భాగం మొత్తం (e.g. 662)
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessProfile {
  name: string;
  tagline: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  terms: string[];
}
