import React from 'react';
import type { Bill } from '../types/billing';
import { getISTDateString } from '../utils/dateUtils';
import { 
  DollarSign, 
  FileText, 
  TrendingUp, 
  PlusCircle, 
  Eye, 
  ArrowRight,
  Sparkles,
  Wheat,
  CalendarCheck
} from 'lucide-react';

interface DashboardProps {
  bills: Bill[];
  onNavigate: (tab: 'dashboard' | 'billing' | 'history' | 'settings') => void;
  onViewBill: (bill: Bill) => void;
  onNewBill: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  bills,
  onNavigate,
  onViewBill,
  onNewBill,
}) => {
  const totalBills = bills.length;
  
  // IST Today Date String (Auto resets after 12:00 AM IST)
  const todayISTStr = getISTDateString();
  const todaySales = bills
    .filter(b => b.date === todayISTStr)
    .reduce((sum, b) => sum + b.section2Total, 0);

  const todayBillsCount = bills.filter(b => b.date === todayISTStr).length;

  const totalSales = bills.reduce((sum, b) => sum + b.section2Total, 0);

  const recentBills = [...bills]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 7);

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-extrabold border border-amber-500/30">
            <Sparkles className="h-3.5 w-3.5" /> IST స్మార్ట్ బిల్లింగ్ రశీదుల వ్యవస్థ (IST Midnight Reset)
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            వరి మిల్లింగ్ & ధాన్యం రశీదులు
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-xl">
            థర్మల్ ప్రింటర్ సపోర్ట్, వాట్సాప్ షేరింగ్ మరియు Auto-Increment (RM-1, RM-2) బిల్లుల వ్యవస్థ.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={onNewBill}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black px-6 py-3.5 rounded-2xl shadow-lg transition-all active:scale-95 text-sm tracking-wide"
          >
            <PlusCircle className="h-5 w-5" />
            <span>+ కొత్త బిల్లు సృష్టించు</span>
          </button>
        </div>

        {/* Decorative Watermark */}
        <Wheat className="absolute right-4 bottom-[-20px] h-48 w-48 text-amber-500/5 pointer-events-none" />
      </div>

      {/* Modern Metrics Grid (3 Key Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Sales (IST Auto-Reset after Midnight 12 AM) */}
        <div className="bg-gradient-to-br from-amber-500/10 via-white to-white p-5 rounded-2xl border border-amber-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-800">
              ఈ రోజు అమ్మకాలు (IST)
            </span>
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl shadow-xs">
              <DollarSign className="h-5 w-5 font-black" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950">₹{todaySales}</h3>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-amber-700">
              <CalendarCheck className="h-3.5 w-3.5" />
              <span>తేదీ: {todayISTStr} ({todayBillsCount} బిల్లులు)</span>
            </div>
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-white to-white p-5 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
              మొత్తం అమ్మకాలు
            </span>
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-xs">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950">₹{totalSales}</h3>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">మొత్తం అమ్మకాల మొత్తం</p>
          </div>
        </div>

        {/* Total Bills Count */}
        <div className="bg-gradient-to-br from-blue-500/10 via-white to-white p-5 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-800">
              మొత్తం రశీదులు
            </span>
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950">{totalBills}</h3>
            <p className="text-[11px] font-semibold text-slate-500 mt-1">RM-1 నుండి నమోదైనవి</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bills Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-950 text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-amber-600" />
                ఇటీవలి బిల్లులు (Recent Invoices)
              </h3>
              <p className="text-xs text-slate-500">చివరిగా జారీ చేసిన రశీదులు</p>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-colors"
            >
              <span>అన్నీ చూడండి</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            {recentBills.length === 0 ? (
              <div className="text-center py-10 text-slate-400 space-y-2">
                <Wheat className="h-12 w-12 mx-auto opacity-40" />
                <p className="text-sm font-semibold">బిల్లులు ఏవీ నమోదు కాలేదు.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm min-w-[500px]">
                <thead>
                  <tr className="text-xs font-bold uppercase text-slate-500 border-b border-slate-200 bg-slate-50/60">
                    <th className="py-3 px-3">బిల్లు నంబరు</th>
                    <th className="py-3 px-3">రైతు పేరు</th>
                    <th className="py-3 px-3">తేదీ</th>
                    <th className="py-3 px-3 text-right">మొత్తం 1</th>
                    <th className="py-3 px-3 text-right">మొత్తం 2</th>
                    <th className="py-3 px-3 text-right">నికర నిల్వ</th>
                    <th className="py-3 px-3 text-center">చర్య</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {recentBills.map((bill) => (
                    <tr key={bill.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3 font-black text-amber-700">{bill.billNo}</td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-950">{bill.customerName}</div>
                        {bill.customerVillage && (
                          <div className="text-[11px] text-slate-400 font-normal">{bill.customerVillage}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500 text-xs">{bill.date}</td>
                      <td className="py-3.5 px-3 text-right font-bold text-rose-600">₹{bill.section1Total}</td>
                      <td className="py-3.5 px-3 text-right font-bold text-emerald-600">₹{bill.section2Total}</td>
                      <td className="py-3.5 px-3 text-right font-black text-slate-950">₹{bill.finalBalance}</td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => onViewBill(bill)}
                          className="p-2 bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-amber-900 rounded-xl inline-flex items-center gap-1 text-xs font-bold transition-colors"
                          title="ప్రింట్ / ప్రివ్యూ"
                        >
                          <Eye className="h-3.5 w-3.5 text-amber-600" />
                          <span>చూడు</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Operations Strip */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 text-slate-950 shadow-md space-y-4">
            <div>
              <h4 className="font-black text-xl flex items-center gap-2">
                <Wheat className="h-6 w-6" /> త్వరిత పనులు (Quick Actions)
              </h4>
              <p className="text-xs text-slate-950/80 mt-1 font-medium">
                రైస్ మిల్లు బిల్లును వెంటనే సృష్టించి థర్మల్ ప్రింట్ తీయండి.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={onNewBill}
                className="w-full flex items-center justify-between bg-slate-950 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-md hover:bg-slate-900 transition-all text-sm group"
              >
                <span className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-amber-400" /> కొత్త బిల్లు జారీ చేయండి
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('history')}
                className="w-full flex items-center justify-between bg-white hover:bg-amber-50 text-slate-950 font-extrabold py-3.5 px-4 rounded-2xl shadow-xs transition-all text-sm group"
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-700" /> గత బిల్లుల రికార్డులు
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
