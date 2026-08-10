import React, { useState } from 'react';
import type { Bill } from '../types/billing';
import { 
  Search, 
  Eye, 
  Edit3, 
  Trash2, 
  Printer, 
  Download, 
  Share2, 
  FileText
} from 'lucide-react';

interface BillHistoryProps {
  bills: Bill[];
  onViewBill: (bill: Bill) => void;
  onEditBill: (bill: Bill) => void;
  onDeleteBill: (billId: string) => void;
  onPrintBill: (bill: Bill) => void;
  onDownloadPDF: (bill: Bill) => void;
  onShareBill: (bill: Bill) => void;
  onNewBill: () => void;
  initialSearchTerm?: string;
  onClearSearch?: () => void;
}

export const BillHistory: React.FC<BillHistoryProps> = ({
  bills,
  onViewBill,
  onEditBill,
  onDeleteBill,
  onPrintBill,
  onDownloadPDF,
  onShareBill,
  onNewBill,
  initialSearchTerm = '',
  onClearSearch
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  React.useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  const filteredBills = bills.filter((bill) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      !term ||
      bill.billNo.toLowerCase().includes(term) ||
      bill.customerName.toLowerCase().includes(term) ||
      (bill.customerPhone && bill.customerPhone.includes(term)) ||
      (bill.customerVillage && bill.customerVillage.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-amber-600" />
            గత బిల్లుల చరిత్ర (Bill History)
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            గతంలో జారీ చేసిన రైస్ మిల్లు బిల్లులను వెతకండి, సవరించండి, ప్రింట్ చేయండి లేదా PDF డౌన్‌లోడ్ చేసుకోండి.
          </p>
        </div>
        <button
          onClick={onNewBill}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all text-sm flex items-center gap-2"
        >
          + కొత్త బిల్లు సృష్టించు
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value === '' && onClearSearch) {
                onClearSearch();
              }
            }}
            placeholder="రైతు పేరు, గ్రామం, ఫోన్ లేదా బిల్లు నంబరుతో వెతకండి..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Bills Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredBills.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-3">
            <FileText className="h-12 w-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">బిల్లులు ఏవీ లభించలేదు</h3>
            <p className="text-xs text-slate-500">
              శోధన పదాలను మార్చి మళ్లీ ప్రయత్నించండి.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">బిల్లు నంబరు & తేదీ</th>
                  <th className="py-3 px-4">రైతు / ఖాతాదారు</th>
                  <th className="py-3 px-4 text-right">మొదటి భాగం</th>
                  <th className="py-3 px-4 text-right">రెండవ భాగం</th>
                  <th className="py-3 px-4 text-right">మొత్తం చెల్లింపు (Net Amount)</th>
                  <th className="py-3 px-4 text-right">చర్యలు</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Bill No & Date */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-950 text-sm">{bill.billNo}</div>
                      <div className="text-xs text-slate-500 font-medium">{bill.date}</div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{bill.customerName}</div>
                      <div className="text-xs text-slate-500">
                        {bill.customerVillage ? `${bill.customerVillage} • ` : ''}{bill.customerPhone || ''}
                      </div>
                    </td>

                    {/* Section 1 Total */}
                    <td className="py-3.5 px-4 text-right font-semibold text-rose-700">
                      ₹{bill.section1Total}
                    </td>

                    {/* Section 2 Total */}
                    <td className="py-3.5 px-4 text-right font-semibold text-emerald-700">
                      ₹{bill.section2Total}
                    </td>

                    {/* Final Balance */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-black text-slate-950 text-base">
                        ₹{bill.finalBalance}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewBill(bill)}
                          className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg"
                          title="ప్రివ్యూ"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => onEditBill(bill)}
                          className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg"
                          title="సవరించు"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => onPrintBill(bill)}
                          className="p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg"
                          title="ప్రింట్"
                        >
                          <Printer className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => onDownloadPDF(bill)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                          title="PDF డౌన్‌లోడ్"
                        >
                          <Download className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => onShareBill(bill)}
                          className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg"
                          title="వాట్సాప్ షేర్"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`బిల్లు #${bill.billNo} ను ఖచ్చితంగా తొలగించాలా?`)) {
                              onDeleteBill(bill.id);
                            }
                          }}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                          title="తొలగించు"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
