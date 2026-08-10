import React, { useState, useEffect } from 'react';
import type { Bill, BillItem } from '../types/billing';
import { numberToIndianWords } from '../utils/numberToWords';
import { generateNextBillNo, getISTDateString } from '../utils/dateUtils';
import { 
  Plus, 
  Trash2, 
  Calculator, 
  Save, 
  Eye, 
  Printer, 
  Download, 
  Share2, 
  Wheat, 
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BillingScreenProps {
  bills: Bill[];
  editingBill?: Bill | null;
  onSaveBill: (bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  onPreviewBill: (bill: Bill) => void;
  onPrintBill: (bill: Bill) => void;
  onDownloadPDF: (bill: Bill) => void;
  onShareBill: (bill: Bill) => void;
}

export const BillingScreen: React.FC<BillingScreenProps> = ({
  bills,
  editingBill,
  onSaveBill,
  onPreviewBill,
  onPrintBill,
  onDownloadPDF,
  onShareBill
}) => {
  // Form Header State
  const [billId, setBillId] = useState<string | undefined>(undefined);
  const [billNo, setBillNo] = useState<string>('');
  const [date, setDate] = useState<string>(getISTDateString());
  
  const [customCustomerName, setCustomCustomerName] = useState<string>('');
  const [customCustomerPhone, setCustomCustomerPhone] = useState<string>('');
  const [customCustomerVillage, setCustomCustomerVillage] = useState<string>('');

  // Section 1 Items (మొదటి భాగం: సరుకు & మిల్లింగ్ చార్జీలు)
  const [section1Items, setSection1Items] = useState<BillItem[]>([
    {
      id: 'sec1-1',
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
      id: 'sec1-2',
      name: 'నూకలు',
      section: 'section1',
      quantity: 30,
      rate: 0,
      amount: 0,
      calculationText: '30 kg'
    },
    {
      id: 'sec1-3',
      name: 'మిల్లింగ్',
      section: 'section1',
      quantity: 189,
      rate: 2,
      amount: 378,
      calculationText: '189 kg × 2 = 378'
    },
    {
      id: 'sec1-4',
      name: 'కవర్',
      section: 'section1',
      quantity: 10,
      rate: 12,
      amount: 120,
      calculationText: '10 × 12 = 120'
    },
    {
      id: 'sec1-5',
      name: 'పౌడర్',
      section: 'section1',
      quantity: 2,
      rate: 50,
      amount: 100,
      calculationText: '2 × 50 = 100'
    }
  ]);

  // Section 2 Items (రెండవ భాగం: అమ్మకాలు / చెల్లింపులు)
  const [section2Items, setSection2Items] = useState<BillItem[]>([
    {
      id: 'sec2-1',
      name: 'నూకలు',
      section: 'section2',
      quantity: 30,
      rate: 20,
      amount: 600,
      calculationText: '30 × 20 = 600'
    },
    {
      id: 'sec2-2',
      name: 'తవుడు',
      section: 'section2',
      quantity: 30,
      rate: 22,
      amount: 660,
      calculationText: '30 × 22 = 660'
    }
  ]);

  const [notes, setNotes] = useState<string>('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Initialize form when editing
  useEffect(() => {
    if (editingBill) {
      setBillId(editingBill.id);
      setBillNo(editingBill.billNo);
      setDate(editingBill.date || getISTDateString());
      setCustomCustomerName(editingBill.customerName);
      setCustomCustomerPhone(editingBill.customerPhone || '');
      setCustomCustomerVillage(editingBill.customerVillage || '');
      setSection1Items(editingBill.section1Items);
      setSection2Items(editingBill.section2Items);
      setNotes(editingBill.notes || '');
    } else {
      resetForm();
    }
  }, [editingBill, bills]);

  const resetForm = () => {
    setBillId(undefined);
    setBillNo(generateNextBillNo(bills));
    setDate(getISTDateString());
    setCustomCustomerName('');
    setCustomCustomerPhone('');
    setCustomCustomerVillage('');
    setSection1Items([
      {
        id: 'sec1-1',
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
        id: 'sec1-2',
        name: 'నూకలు',
        section: 'section1',
        quantity: 30,
        rate: 0,
        amount: 0,
        calculationText: '30 kg'
      },
      {
        id: 'sec1-3',
        name: 'మిల్లింగ్',
        section: 'section1',
        quantity: 189,
        rate: 2,
        amount: 378,
        calculationText: '189 kg × 2 = 378'
      },
      {
        id: 'sec1-4',
        name: 'కవర్',
        section: 'section1',
        quantity: 10,
        rate: 12,
        amount: 120,
        calculationText: '10 × 12 = 120'
      },
      {
        id: 'sec1-5',
        name: 'పౌడర్',
        section: 'section1',
        quantity: 2,
        rate: 50,
        amount: 100,
        calculationText: '2 × 50 = 100'
      }
    ]);
    setSection2Items([
      {
        id: 'sec2-1',
        name: 'నూకలు',
        section: 'section2',
        quantity: 30,
        rate: 20,
        amount: 600,
        calculationText: '30 × 20 = 600'
      },
      {
        id: 'sec2-2',
        name: 'తవుడు',
        section: 'section2',
        quantity: 30,
        rate: 22,
        amount: 660,
        calculationText: '30 × 22 = 660'
      }
    ]);
    setNotes('');
    setNotification(null);
  };

  // Section 1 Row Calculation Logic
  const handleSection1ItemChange = (id: string, field: keyof BillItem, value: any) => {
    setSection1Items(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };

        // Special rice calculation formula: Bags * Multiplier + ExtraKg
        if (item.name === 'బియ్యం') {
          const bags = field === 'bags' ? Number(value) : (updated.bags || 0);
          const mult = field === 'multiplier' ? Number(value) : (updated.multiplier || 0);
          const extra = field === 'extraKg' ? Number(value) : (updated.extraKg || 0);

          updated.quantity = (bags * mult) + extra;
          updated.amount = updated.rate > 0 ? updated.quantity * updated.rate : 0;
          updated.calculationText = `${bags} kg × ${mult} kg + ${extra} kg = ${updated.quantity} kg`;
        } else {
          const qty = field === 'quantity' ? Number(value) : updated.quantity;
          const rate = field === 'rate' ? Number(value) : updated.rate;
          updated.amount = Math.round(qty * rate);

          if (rate > 0) {
            updated.calculationText = `${qty} × ${rate} = ${updated.amount}`;
          } else {
            updated.calculationText = `${qty} kg`;
          }
        }

        return updated;
      });

      // Automatically recalculate Milling (మిల్లింగ్) quantity = బియ్యం quantity + నూకలు quantity
      const riceItem = updatedItems.find(item => item.name === 'బియ్యం');
      const nookaluItem = updatedItems.find(item => item.name === 'నూకలు' && item.section === 'section1');
      const millingItem = updatedItems.find(item => item.name === 'మిల్లింగ్');

      if (riceItem && nookaluItem && millingItem) {
        const changedItem = updatedItems.find(item => item.id === id);
        if (changedItem && (changedItem.name === 'బియ్యం' || (changedItem.name === 'నూకలు' && changedItem.section === 'section1') || changedItem.name === 'మిల్లింగ్')) {
          millingItem.quantity = (riceItem.quantity || 0) + (nookaluItem.quantity || 0);
          millingItem.amount = Math.round(millingItem.quantity * millingItem.rate);
          millingItem.calculationText = `${millingItem.quantity} kg × ${millingItem.rate} = ${millingItem.amount}`;
        }
      }

      return updatedItems;
    });
  };

  // Section 2 Row Calculation Logic
  const handleSection2ItemChange = (id: string, field: keyof BillItem, value: any) => {
    setSection2Items(section2Items.map(item => {
      if (item.id !== id) return item;

      const updated = { ...item, [field]: value };
      const qty = field === 'quantity' ? Number(value) : updated.quantity;
      const rate = field === 'rate' ? Number(value) : updated.rate;
      
      updated.amount = Math.round(qty * rate);
      updated.calculationText = `${qty} × ${rate} = ${updated.amount}`;

      return updated;
    }));
  };

  // Add / Remove Row Handlers
  const handleAddSection1Item = () => {
    const newItem: BillItem = {
      id: 'sec1-' + Date.now(),
      name: 'ఇతర చార్జ్',
      section: 'section1',
      quantity: 1,
      rate: 0,
      amount: 0,
      calculationText: ''
    };
    setSection1Items([...section1Items, newItem]);
  };

  const handleRemoveSection1Item = (id: string) => {
    setSection1Items(section1Items.filter(i => i.id !== id));
  };

  const handleAddSection2Item = () => {
    const newItem: BillItem = {
      id: 'sec2-' + Date.now(),
      name: 'ఇతర అమ్మకం',
      section: 'section2',
      quantity: 1,
      rate: 0,
      amount: 0,
      calculationText: ''
    };
    setSection2Items([...section2Items, newItem]);
  };

  const handleRemoveSection2Item = (id: string) => {
    setSection2Items(section2Items.filter(i => i.id !== id));
  };

  // Totals
  const section1Total = section1Items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const section2Total = section2Items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const finalBalance = section2Total - section1Total;

  const getActiveBillObject = (): Bill => {
    return {
      id: billId || `bill-${Date.now()}`,
      billNo: billNo || generateNextBillNo(bills),
      date,
      customerId: 'guest',
      customerName: customCustomerName.trim() || 'రైతు / ఖాతాదారు',
      customerPhone: customCustomerPhone,
      customerVillage: customCustomerVillage,
      section1Items,
      section2Items,
      section1Total,
      section2Total,
      finalBalance,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  };

  const handleCalculate = () => {
    setNotification({ type: 'success', message: 'బిల్లు లెక్కలు స్వయంచాలకంగా నవీకరించబడ్డాయి!' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSave = () => {
    let finalCustomerName = customCustomerName.trim();
    if (!finalCustomerName) {
      finalCustomerName = 'రైతు / ఖాతాదారు';
    }

    const currentBill = {
      ...getActiveBillObject(),
      customerName: finalCustomerName
    };
    onSaveBill(currentBill);

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 }
    });

    setNotification({ type: 'success', message: `బిల్లు #${currentBill.billNo} విజయవంతంగా సేవ్ చేయబడింది!` });
  };

  return (
    <div className="space-y-6 pb-28 md:pb-12">
      {/* Alert Banner */}
      {notification && (
        <div className={`p-4 rounded-2xl flex items-center justify-between shadow-sm border transition-all ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-rose-600" />}
            <span className="font-bold text-sm">{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs font-bold underline">ముగించు</button>
        </div>
      )}

      {/* Header Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full mb-1">
              <Wheat className="h-3.5 w-3.5" /> వరి మిల్లింగ్ రశీదు నమోదు
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">
              {editingBill ? `బిల్లు సవరణ #${editingBill.billNo}` : `కొత్త బిల్లు సృష్టి (${billNo || 'RM-1'})`}
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold px-5 py-2.5 rounded-2xl shadow-md transition-all text-sm"
            >
              <Save className="h-4 w-4" />
              <span>సేవ్ చేయి</span>
            </button>
            <button
              onClick={() => onPreviewBill(getActiveBillObject())}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-extrabold px-5 py-2.5 rounded-2xl shadow-md transition-all text-sm"
            >
              <Eye className="h-4 w-4" />
              <span>ప్రింట్ ప్రివ్యూ</span>
            </button>
          </div>
        </div>

        {/* Info Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1">
              బిల్లు నంబరు (Bill No)
            </label>
            <input
              type="text"
              value={billNo}
              onChange={(e) => setBillNo(e.target.value)}
              className="w-full bg-amber-50/50 border border-amber-200 rounded-2xl px-3.5 py-2.5 text-sm font-black text-amber-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1">
              తేదీ (IST Date)
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1">
              రైతు / ఖాతాదారు పేరు
            </label>
            <div className="relative">
              <User className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="రైతు పేరు (రామయ్య గారు)"
                value={customCustomerName}
                onChange={(e) => setCustomCustomerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-9 pr-3.5 py-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1">
              ఫోన్ నంబరు
            </label>
            <div className="relative">
              <Phone className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="9849123456"
                value={customCustomerPhone}
                onChange={(e) => setCustomCustomerPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-9 pr-3.5 py-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1">
              గ్రామం / ఊరు
            </label>
            <div className="relative">
              <MapPin className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="గ్రామం పేరు"
                value={customCustomerVillage}
                onChange={(e) => setCustomCustomerVillage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-9 pr-3.5 py-2.5 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: మొదటి భాగం (సరుకు & మిల్లింగ్ వివరాలు) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-slate-950 text-base sm:text-lg flex items-center gap-2">
              <Wheat className="h-5 w-5 text-amber-600" />
              మొదటి భాగం: మిల్లు నుండి వచ్చిన బియ్యం & చార్జీలు
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              బియ్యం (25 kg × 6 kg + 9 kg = 159 kg), మిల్లింగ్, కవర్, పౌడర్ లెక్కలు
            </p>
          </div>
          <button
            onClick={handleAddSection1Item}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-2 rounded-2xl shadow-xs text-xs"
          >
            <Plus className="h-4 w-4" />
            <span>వరుస జోడించు</span>
          </button>
        </div>

        {/* Section 1 Items List */}
        <div className="space-y-3">
          {section1Items.map((item) => (
            <div key={item.id} className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              {/* Item Name & Delete Button */}
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleSection1ItemChange(item.id, 'name', e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-black text-slate-950 text-sm flex-1 min-w-0 focus:bg-white"
                />
                <button
                  onClick={() => handleRemoveSection1Item(item.id)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-xl transition-colors shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Formula & Charge Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/80">
                {/* Formula inputs */}
                <div className="text-xs font-bold text-slate-700">
                  {item.name === 'బియ్యం' ? (
                    <div className="flex items-center gap-1 flex-wrap">
                      <input
                        type="number"
                        value={item.bags || ''}
                        onChange={(e) => handleSection1ItemChange(item.id, 'bags', parseFloat(e.target.value) || 0)}
                        className="w-12 bg-white border border-slate-300 rounded-lg p-1 text-center font-black text-xs"
                        placeholder="25"
                      />
                      <span className="text-[11px]">kg ×</span>
                      <input
                        type="number"
                        value={item.multiplier || ''}
                        onChange={(e) => handleSection1ItemChange(item.id, 'multiplier', parseFloat(e.target.value) || 0)}
                        className="w-12 bg-white border border-slate-300 rounded-lg p-1 text-center font-black text-xs"
                        placeholder="6"
                      />
                      <span className="text-[11px]">kg +</span>
                      <input
                        type="number"
                        value={item.extraKg || ''}
                        onChange={(e) => handleSection1ItemChange(item.id, 'extraKg', parseFloat(e.target.value) || 0)}
                        className="w-12 bg-white border border-slate-300 rounded-lg p-1 text-center font-black text-xs"
                        placeholder="9"
                      />
                      <span className="text-[11px]">kg =</span>
                      <span className="font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-lg text-xs border border-amber-300">
                        {item.quantity} kg
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 flex-wrap text-xs">
                      <span>పరిమాణం:</span>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleSection1ItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-14 bg-white border border-slate-300 rounded-lg p-1 text-center font-black text-xs"
                      />
                      <span>రేటు: ₹</span>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleSection1ItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-14 bg-white border border-slate-300 rounded-lg p-1 text-center font-black text-xs"
                      />
                      <span className="text-slate-500 text-[10px]">({item.calculationText})</span>
                    </div>
                  )}
                </div>

                {/* Charge Input */}
                <div className="flex items-center justify-end gap-1.5 self-end sm:self-auto pt-1 sm:pt-0">
                  <span className="text-xs font-black text-slate-600">చార్జ్: ₹</span>
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => handleSection1ItemChange(item.id, 'amount', parseFloat(e.target.value) || 0)}
                    className="w-20 bg-white border border-slate-300 rounded-xl p-1.5 text-right font-black text-slate-950 text-sm focus:bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section 1 Total */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-200 bg-amber-500/10 p-4 rounded-2xl border border-amber-200">
          <span className="font-extrabold text-amber-950 text-xs sm:text-base">మొదటి భాగం మొత్తం (Section 1 Total):</span>
          <span className="text-xl sm:text-2xl font-black text-amber-900">₹{section1Total}</span>
        </div>
      </div>

      {/* SECTION 2: రెండవ భాగం (అమ్మకాలు / క్రెడిట్లు) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-slate-950 text-base sm:text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5 text-emerald-600" />
              రెండవ భాగం: తవుడు & నూకల అమ్మకాల వివరాలు
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              నూకలు (30 × 20 = 600), తవుడు (30 × 22 = 660) లెక్కలు
            </p>
          </div>
          <button
            onClick={handleAddSection2Item}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-3.5 py-2 rounded-2xl shadow-xs text-xs"
          >
            <Plus className="h-4 w-4" />
            <span>వరుస జోడించు</span>
          </button>
        </div>

        {/* Section 2 Items List */}
        <div className="space-y-3">
          {section2Items.map((item) => (
            <div key={item.id} className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
              {/* Item Name & Delete Button */}
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleSection2ItemChange(item.id, 'name', e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-black text-slate-950 text-sm flex-1 min-w-0 focus:bg-white"
                />
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl text-sm border border-emerald-300">
                    ₹{item.amount}
                  </span>
                  <button
                    onClick={() => handleRemoveSection2Item(item.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Quantity & Rate Row */}
              <div className="flex items-center justify-between gap-1.5 text-xs font-bold text-slate-700 pt-2 border-t border-slate-200/80 flex-wrap">
                <div className="flex items-center gap-1">
                  <span>పరిమాణం:</span>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleSection2ItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-14 bg-white border border-slate-300 rounded-lg p-1 text-center font-black text-xs"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span>× రేటు: ₹</span>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleSection2ItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-14 bg-white border border-slate-300 rounded-lg p-1 text-center font-black text-xs"
                  />
                </div>
                <div className="font-extrabold text-emerald-700 text-xs">
                  = ₹{item.amount}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section 2 Total */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-200 bg-emerald-500/10 p-4 rounded-2xl border border-emerald-200">
          <span className="font-extrabold text-emerald-950 text-sm sm:text-base">రెండవ భాగం మొత్తం (Section 2 Total):</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-900">₹{section2Total}</span>
        </div>
      </div>

      {/* FINAL CALCULATION SUMMARY CARD */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-black text-amber-400 text-xl flex items-center gap-2">
            <Calculator className="h-6 w-6" /> చివరి లెక్క (Final Calculation Balance)
          </h3>
          <button
            onClick={handleCalculate}
            className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl transition-colors"
          >
            స్వయంచాలక లెక్క
          </button>
        </div>

        {/* Step Breakdown matching Handwritten Bill */}
        <div className="space-y-4 max-w-lg mx-auto bg-slate-900/90 p-5 rounded-2xl border border-slate-800 font-mono">
          <div className="flex justify-between items-center text-lg">
            <span className="text-slate-400 font-sans font-semibold">రెండవ భాగం మొత్తం (అమ్మకాలు):</span>
            <span className="font-bold text-emerald-400">₹{section2Total}</span>
          </div>

          <div className="flex justify-between items-center text-lg border-b border-slate-800 pb-3">
            <span className="text-slate-400 font-sans font-semibold">తీసివేయవలసిన మొదటి భాగం (చార్జీలు):</span>
            <span className="font-bold text-rose-400">- ₹{section1Total}</span>
          </div>

          <div className="flex justify-between items-center text-2xl font-black pt-1">
            <span className="text-amber-400 font-sans">చివరి నికర చెల్లింపు మొత్తం (Net Payment):</span>
            <span className={`px-3.5 py-1 rounded-2xl tracking-tight ${finalBalance >= 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-rose-950 text-rose-300 border border-rose-700'}`}>
              ₹{Math.abs(finalBalance)}
            </span>
          </div>

          <div className="text-xs font-sans font-semibold text-slate-300 italic text-center pt-2 border-t border-slate-800/80">
            {numberToIndianWords(Math.abs(finalBalance))}
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black py-3 px-4 rounded-2xl shadow-md transition-all text-xs"
          >
            <Save className="h-4 w-4" />
            <span>సేవ్ చేయండి</span>
          </button>

          <button
            onClick={() => onPreviewBill(getActiveBillObject())}
            className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black py-3 px-4 rounded-2xl shadow-md transition-all text-xs"
          >
            <Eye className="h-4 w-4" />
            <span>ప్రివ్యూ</span>
          </button>

          <button
            onClick={() => onPrintBill(getActiveBillObject())}
            className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-4 rounded-2xl transition-all text-xs"
          >
            <Printer className="h-4 w-4 text-amber-400" />
            <span>ప్రింట్</span>
          </button>

          <button
            onClick={() => onDownloadPDF(getActiveBillObject())}
            className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 px-4 rounded-2xl transition-all text-xs"
          >
            <Download className="h-4 w-4 text-blue-400" />
            <span>PDF</span>
          </button>

          <button
            onClick={() => onShareBill(getActiveBillObject())}
            className="flex items-center justify-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 font-bold py-3 px-4 rounded-2xl transition-all text-xs col-span-2 sm:col-span-1"
          >
            <Share2 className="h-4 w-4" />
            <span>వాట్సాప్</span>
          </button>
        </div>
      </div>

      {/* STICKY BOTTOM ACTION BAR FOR MOBILE POS USAGE */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md p-3 border-t border-slate-800 z-40 shadow-2xl flex items-center justify-between gap-2 no-print">
        <div className="flex-1">
          <div className="text-[10px] text-slate-400 font-semibold uppercase">చివరి చెల్లింపు (Net Amount)</div>
          <div className="text-base font-black text-amber-400">₹{Math.abs(finalBalance)}</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 bg-emerald-600 active:bg-emerald-500 text-white font-extrabold px-3 py-2.5 rounded-xl text-xs shadow-md"
          >
            <Save className="h-4 w-4" />
            <span>సేవ్</span>
          </button>

          <button
            onClick={() => onPreviewBill(getActiveBillObject())}
            className="flex items-center gap-1 bg-amber-500 active:bg-amber-400 text-slate-950 font-extrabold px-3 py-2.5 rounded-xl text-xs shadow-md"
          >
            <Printer className="h-4 w-4" />
            <span>ప్రింట్</span>
          </button>
        </div>
      </div>
    </div>
  );
};
