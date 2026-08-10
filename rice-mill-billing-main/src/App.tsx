import { useState, useEffect } from 'react';
import type { Bill, BusinessProfile } from './types/billing';
import { 
  getProfile,
} from './utils/storage';
import {
  fetchBills,
  saveBillApi,
  deleteBillApi,
  fetchProfile,
  saveProfileApi,
  checkServerHealth,
} from './services/api';
import { downloadBillPDF, shareBillViaWhatsApp } from './utils/exportPdf';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { BillingScreen } from './components/BillingScreen';
import { BillPreview } from './components/BillPreview';
import { BillHistory } from './components/BillHistory';
import { SettingsScreen } from './components/SettingsScreen';

export function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'billing' | 'history' | 'settings'>('dashboard');
  const [historySearchTerm, setHistorySearchTerm] = useState('');

  // Core App Data
  const [bills, setBills] = useState<Bill[]>([]);
  const [profile, setProfile] = useState<BusinessProfile>(getProfile());

  // Active Modals & Edits
  const [previewBill, setPreviewBill] = useState<Bill | null>(null);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  // Load state on start
  useEffect(() => {
    refreshAllData();
  }, []);

  const refreshAllData = async () => {
    await checkServerHealth();

    const [bList, pData] = await Promise.all([
      fetchBills(),
      fetchProfile()
    ]);

    setBills(bList);
    setProfile(pData);
  };

  // Bill Actions
  const handleSaveBill = async (billData: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    const saved = await saveBillApi(billData);
    await refreshAllData();
    setEditingBill(null);
    setHistorySearchTerm(saved.billNo);
    setTimeout(() => {
      setActiveTab('history');
    }, 1500);
  };

  const handleDeleteBill = async (billId: string) => {
    await deleteBillApi(billId);
    await refreshAllData();
  };

  const handleEditBill = (bill: Bill) => {
    setEditingBill(bill);
    setActiveTab('billing');
  };

  const handleNewBill = () => {
    setEditingBill(null);
  };

  // Export / Print / Share Handlers
  const handlePrint = (bill?: Bill) => {
    const targetBill = bill || previewBill;
    if (!targetBill) return;
    
    if (!previewBill) {
      setPreviewBill(targetBill);
      setTimeout(() => {
        window.print();
      }, 500);
    } else {
      window.print();
    }
  };

  const handleDownloadPDF = (bill?: Bill) => {
    const targetBill = bill || previewBill;
    if (!targetBill) return;

    if (!previewBill) {
      setPreviewBill(targetBill);
      setTimeout(() => {
        downloadBillPDF('printable-bill-canvas', `${targetBill.billNo}_${targetBill.customerName}.pdf`);
      }, 500);
    } else {
      downloadBillPDF('printable-bill-canvas', `${targetBill.billNo}_${targetBill.customerName}.pdf`);
    }
  };

  const handleShareWhatsApp = (bill?: Bill) => {
    const targetBill = bill || previewBill;
    if (!targetBill) return;
    shareBillViaWhatsApp(targetBill, profile);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 antialiased selection:bg-amber-400 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab !== 'history') setHistorySearchTerm('');
          setActiveTab(tab);
        }}
        onNewBill={handleNewBill}
        businessName={profile.name}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            bills={bills}
            onNavigate={(tab) => {
              if (tab !== 'history') setHistorySearchTerm('');
              setActiveTab(tab);
            }}
            onViewBill={(b) => setPreviewBill(b)}
            onNewBill={() => {
              handleNewBill();
              setActiveTab('billing');
            }}
          />
        )}

        {activeTab === 'billing' && (
          <BillingScreen
            bills={bills}
            editingBill={editingBill}
            onSaveBill={handleSaveBill}
            onPreviewBill={(b) => setPreviewBill(b)}
            onPrintBill={handlePrint}
            onDownloadPDF={handleDownloadPDF}
            onShareBill={handleShareWhatsApp}
          />
        )}

        {activeTab === 'history' && (
          <BillHistory
            bills={bills}
            onViewBill={(b) => setPreviewBill(b)}
            onEditBill={handleEditBill}
            onDeleteBill={handleDeleteBill}
            onPrintBill={handlePrint}
            onDownloadPDF={handleDownloadPDF}
            onShareBill={handleShareWhatsApp}
            onNewBill={() => {
              handleNewBill();
              setActiveTab('billing');
            }}
            initialSearchTerm={historySearchTerm}
            onClearSearch={() => setHistorySearchTerm('')}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            profile={profile}
            onSaveProfile={async (updated) => {
              const saved = await saveProfileApi(updated);
              setProfile(saved);
            }}
            onRefreshAllData={refreshAllData}
          />
        )}
      </main>

      {/* Digital Bill Preview Modal */}
      {previewBill && (
        <BillPreview
          bill={previewBill}
          profile={profile}
          onClose={() => setPreviewBill(null)}
          onPrint={() => handlePrint(previewBill)}
          onDownloadPDF={() => handleDownloadPDF(previewBill)}
          onShareWhatsApp={() => handleShareWhatsApp(previewBill)}
        />
      )}
    </div>
  );
}

export default App;
