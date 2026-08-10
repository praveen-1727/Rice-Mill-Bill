import React, { useState } from 'react';
import type { Customer, Bill } from '../types/billing';
import { 
  Users, 
  Search, 
  UserPlus, 
  Edit3, 
  Trash2, 
  FileText, 
  Eye, 
  Phone, 
  MapPin, 
  X,
  Wheat
} from 'lucide-react';

interface CustomerManagementProps {
  customers: Customer[];
  bills: Bill[];
  onOpenAddCustomer: () => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
  onViewBill: (bill: Bill) => void;
  onNewBillForCustomer: (customer: Customer) => void;
}

export const CustomerManagement: React.FC<CustomerManagementProps> = ({
  customers,
  bills,
  onOpenAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onViewBill,
  onNewBillForCustomer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLedgerCustomer, setSelectedLedgerCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase().trim();
    return (
      !term ||
      c.name.toLowerCase().includes(term) ||
      c.village.toLowerCase().includes(term) ||
      c.phone.includes(term)
    );
  });

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-amber-600" />
            రైతులు & ఖాతాదారుల పుస్తకం (Party Ledger)
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            రైస్ మిల్లు కస్టమర్లు, ధాన్యం వ్యాపారులు మరియు రైతుల బిల్లుల ఖాతా లెక్కల పుస్తకం.
          </p>
        </div>

        <button
          onClick={onOpenAddCustomer}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all text-sm"
        >
          <UserPlus className="h-4 w-4" />
          <span>+ కొత్త రైతును జోడించు</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="రైతు పేరు, గ్రామం లేదా ఫోన్ నంబరుతో వెతకండి..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200">
            <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold">నమోదైన రైతులు ఎవరూ లేరు.</p>
          </div>
        ) : (
          filteredCustomers.map((cust) => {
            const custBills = bills.filter((b) => b.customerId === cust.id || b.customerName === cust.name);
            const totalSection1 = custBills.reduce((sum, b) => sum + b.section1Total, 0);
            const totalSection2 = custBills.reduce((sum, b) => sum + b.section2Total, 0);
            const netBalance = totalSection2 - totalSection1;

            return (
              <div
                key={cust.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-slate-950 text-base">{cust.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-amber-600" />
                        <span>{cust.village || 'వర్తించదు'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditCustomer(cust)}
                        className="p-1.5 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-lg"
                        title="సవరించు"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`రైతు ${cust.name} ఖాతాను తొలగించాలా?`)) {
                            onDeleteCustomer(cust.id);
                          }
                        }}
                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="తొలగించు"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {cust.phone && (
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{cust.phone}</span>
                    </div>
                  )}

                  {/* Financial Ledger Summary */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">బిల్లులు</span>
                      <span className="font-extrabold text-slate-900">{custBills.length}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">అమ్మకాలు</span>
                      <span className="font-extrabold text-emerald-700">₹{totalSection2}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">నికర నిల్వ</span>
                      <span className="font-black text-slate-950">₹{netBalance}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedLedgerCustomer(cust)}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1"
                  >
                    <FileText className="h-3.5 w-3.5 text-amber-400" />
                    <span>ఖాతా చిట్టా చూడండి ({custBills.length})</span>
                  </button>

                  <button
                    onClick={() => onNewBillForCustomer(cust)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1"
                    title="రైతుకి కొత్త బిల్లు జారీ చేయి"
                  >
                    <span>+ బిల్లు</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CUSTOMER LEDGER MODAL */}
      {selectedLedgerCustomer && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-amber-400 flex items-center gap-2">
                  <Wheat className="h-5 w-5" /> రైతు ఖాతా చిట్టా: {selectedLedgerCustomer.name}
                </h3>
                <p className="text-xs text-slate-400">
                  గ్రామం: {selectedLedgerCustomer.village} | ఫోన్: {selectedLedgerCustomer.phone}
                </p>
              </div>
              <button
                onClick={() => setSelectedLedgerCustomer(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {(() => {
                const custBills = bills.filter(
                  (b) => b.customerId === selectedLedgerCustomer.id || b.customerName === selectedLedgerCustomer.name
                );

                if (custBills.length === 0) {
                  return (
                    <div className="text-center py-8 text-slate-400">
                      ఈ రైతుపై నమోదు చేసిన బిల్లులు ఏవీ లేవు.
                    </div>
                  );
                }

                return (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold uppercase border-b border-slate-200">
                        <th className="p-2.5">తేదీ</th>
                        <th className="p-2.5">బిల్లు నంబరు</th>
                        <th className="p-2.5 text-right">మొదటి భాగం</th>
                        <th className="p-2.5 text-right">రెండవ భాగం</th>
                        <th className="p-2.5 text-right">నికర నిల్వ</th>
                        <th className="p-2.5 text-center">చర్య</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {custBills.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50">
                          <td className="p-2.5 text-slate-600 font-semibold">{b.date}</td>
                          <td className="p-2.5 font-extrabold text-slate-900">{b.billNo}</td>
                          <td className="p-2.5 text-right font-semibold text-rose-700">₹{b.section1Total}</td>
                          <td className="p-2.5 text-right font-semibold text-emerald-700">₹{b.section2Total}</td>
                          <td className="p-2.5 text-right font-black text-slate-950">₹{b.finalBalance}</td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => {
                                setSelectedLedgerCustomer(null);
                                onViewBill(b);
                              }}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-bold text-[11px] inline-flex items-center gap-1"
                            >
                              <Eye className="h-3 w-3" /> చూపు
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
