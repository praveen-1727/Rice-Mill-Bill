import React, { useState } from 'react';
import type { Bill, BusinessProfile, BillItem } from '../types/billing';
import { numberToIndianWords } from '../utils/numberToWords';
import { Printer, Download, Share2, X, Wheat, Smartphone } from 'lucide-react';

interface BillPreviewProps {
  bill: Bill;
  profile: BusinessProfile;
  onClose: () => void;
  onPrint: () => void;
  onDownloadPDF: () => void;
  onShareWhatsApp: () => void;
}

const getRowLayout = (item: BillItem) => {
  let left = `${item.name}:- `;
  let right = '';
  
  const text = item.calculationText || '';
  if (item.amount > 0) {
    if (text.includes('=')) {
      const parts = text.split('=');
      left += parts[0].trim() + ' =';
      right = parts[1].trim();
    } else {
      if (item.rate > 0) {
        left += `${item.quantity} × ${item.rate} =`;
      } else {
        left += `${item.quantity} =`;
      }
      right = `${item.amount}`;
    }
  } else {
    left = `${item.name}:- ${text || `${item.quantity} kg`}`;
    right = '';
  }
  
  // Clean up double spaces
  left = left.replace(/\s+/g, ' ');
  
  return { left, right };
};

export const BillPreview: React.FC<BillPreviewProps> = ({
  bill,
  profile,
  onClose,
  onPrint,
  onDownloadPDF,
  onShareWhatsApp
}) => {
  const [paperWidth, setPaperWidth] = useState<'80mm' | '58mm'>('80mm');

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-100 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col my-4 max-h-[92vh]">
        {/* Top Controls Header - Touch Friendly */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 no-print border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wheat className="h-5 w-5 text-amber-400" />
              <span className="font-bold text-sm sm:text-base">రశీదు ప్రివ్యూ ({bill.billNo})</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-lg sm:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Thermal Roll Selector */}
          <div className="flex items-center justify-between gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1 text-[11px] text-slate-400 pl-1">
              <Smartphone className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-semibold">థర్మల్ సైజ్:</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setPaperWidth('80mm')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  paperWidth === '80mm' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                80mm (3")
              </button>
              <button
                type="button"
                onClick={() => setPaperWidth('58mm')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                  paperWidth === '58mm' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                58mm (2")
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hidden sm:block"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* PRINTABLE THERMAL BILL CANVAS CONTAINER */}
        <div className="p-3 sm:p-6 bg-slate-200 overflow-y-auto flex flex-col items-center justify-start flex-1">
          <div 
            id="printable-bill-canvas" 
            className={`p-4 sm:p-5 bg-white text-slate-950 font-mono leading-tight border border-slate-300 shadow-md space-y-3 transition-all ${
              paperWidth === '58mm' ? 'paper-58mm w-[56mm] text-[10px]' : 'paper-80mm w-[80mm] text-[11px]'
            }`}
          >
            {/* Business Header */}
            <div className="text-center space-y-1">
              <h1 className="text-xs sm:text-sm font-black uppercase tracking-tight text-slate-950 leading-snug">
                {profile.name}
              </h1>
              <p className="text-[10px] font-bold text-slate-700">{profile.tagline}</p>
              <p className="text-[9px] text-slate-600">{profile.address}, {profile.city}</p>
              <p className="text-[9px] text-slate-600 font-semibold">ఫోన్: {profile.phone}</p>
              <div className="border-t border-b border-dashed border-slate-900 py-1 my-1.5 flex justify-between text-[10px] font-extrabold">
                <div>బిల్లు: {bill.billNo}</div>
                <div>తేదీ: {bill.date}</div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="text-[10px] space-y-0.5 font-bold">
              <div><span className="text-slate-600">రైతు:</span> <span className="font-extrabold text-slate-950">{bill.customerName}</span></div>
              {bill.customerVillage && <div><span className="text-slate-600">గ్రామం:</span> <span>{bill.customerVillage}</span></div>}
              {bill.customerPhone && <div><span className="text-slate-600">ఫోన్:</span> <span>{bill.customerPhone}</span></div>}
            </div>

            <div className="border-t border-dashed border-slate-900 my-1"></div>

            {/* Calculation flow matching handwritten receipt */}
            <div className="space-y-1.5 font-bold text-slate-950 font-mono">
              {/* Section 1 Items */}
              {bill.section1Items.map((item, idx) => {
                const { left, right } = getRowLayout(item);
                let displayName = left;
                if (item.name === 'కవర్') {
                  displayName = displayName.replace('కవర్:-', 'కవర్లు:-');
                }
                return (
                  <div key={item.id || idx}>
                    <div className="flex justify-between items-end gap-1">
                      <span className="whitespace-pre-wrap flex-1 break-words">{displayName}</span>
                      <span className="text-right whitespace-nowrap pl-1 font-extrabold">{right}</span>
                    </div>
                    {item.name === 'మిల్లింగ్' && (
                      <div className="text-[9px] text-slate-600 font-sans pl-3 leading-tight font-medium">
                        (బియ్యం + నూకలు)
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Section 1 Total Divider */}
              <div className="border-t border-slate-900 my-1"></div>
              <div className="flex justify-end">
                <span className="border-b-4 border-double border-slate-900 pb-0.5 px-1 min-w-[50px] text-right font-extrabold text-xs">
                  {bill.section1Total}
                </span>
              </div>

              {/* Spacer */}
              <div className="h-1"></div>

              {/* Section 2 Items */}
              {bill.section2Items.map((item, idx) => {
                const { left, right } = getRowLayout(item);
                return (
                  <div key={item.id || idx} className="flex justify-between items-end gap-1">
                    <span className="whitespace-pre-wrap flex-1 break-words">{left}</span>
                    <span className="text-right whitespace-nowrap pl-1 font-extrabold">{right}</span>
                  </div>
                );
              })}

              {/* Final Subtraction block */}
              <div className="border-t border-slate-900 my-1"></div>
              
              <div className="flex flex-col items-end space-y-1 pr-1 font-mono">
                <div className="w-[80px] text-right font-extrabold">{bill.section2Total}</div>
                <div className="w-[80px] text-right border-b border-slate-900 pb-1 flex justify-between font-extrabold">
                  <span>-</span>
                  <span>{bill.section1Total}</span>
                </div>
                <div className="w-[80px] text-right pt-0.5">
                  <span className="border-b-4 border-double border-slate-900 pb-0.5 px-1 min-w-[50px] inline-block font-black text-sm">
                    {Math.abs(bill.finalBalance)}
                  </span>
                </div>
              </div>

              {/* In Words */}
              <div className="text-[9px] text-slate-800 italic text-center pt-2.5 border-t border-dashed border-slate-400 font-sans font-semibold">
                {numberToIndianWords(Math.abs(bill.finalBalance))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 text-center text-[9px] text-slate-700 space-y-0.5 border-t border-dashed border-slate-900">
              <p className="italic">ధన్యవాదాలు! మిల్లు రశీదు పత్రము</p>
              <p className="font-extrabold text-slate-950">For {profile.name}</p>
            </div>
          </div>
        </div>

        {/* Bottom Mobile Action Buttons */}
        <div className="bg-slate-900 p-3 no-print border-t border-slate-800 grid grid-cols-3 gap-2">
          <button
            onClick={onPrint}
            className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black py-3 px-2 rounded-xl text-xs shadow-md transition-all"
          >
            <Printer className="h-4 w-4" />
            <span>ప్రింట్ (Print)</span>
          </button>
          <button
            onClick={onDownloadPDF}
            className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold py-3 px-2 rounded-xl text-xs transition-all"
          >
            <Download className="h-4 w-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={onShareWhatsApp}
            className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold py-3 px-2 rounded-xl text-xs transition-all"
          >
            <Share2 className="h-4 w-4" />
            <span>వాట్సాప్</span>
          </button>
        </div>
      </div>
    </div>
  );
};
