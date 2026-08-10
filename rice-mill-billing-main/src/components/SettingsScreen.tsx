import React, { useState } from 'react';
import type { BusinessProfile } from '../types/billing';
import { exportBackupData, importBackupData, resetDemoData } from '../utils/storage';
import { syncLocalStorageToMongo, seedMongoDemoData } from '../services/api';
import { Settings, Save, RefreshCw, Download, Upload, Wheat, CheckCircle2, Database, Send } from 'lucide-react';

interface SettingsScreenProps {
  profile: BusinessProfile;
  onSaveProfile: (profile: BusinessProfile) => void;
  onRefreshAllData: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  profile,
  onSaveProfile,
  onRefreshAllData
}) => {
  const [formData, setFormData] = useState<BusinessProfile>(profile);
  const [termsText, setTermsText] = useState(profile.terms ? profile.terms.join('\n') : '');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProfile: BusinessProfile = {
      ...formData,
      terms: termsText.split('\n').filter((t) => t.trim().length > 0)
    };
    onSaveProfile(updatedProfile);
    setStatusMsg('రైస్ మిల్లు ప్రొఫైల్ సవరణలు సేవ్ చేయబడ్డాయి!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleExportJSON = () => {
    const jsonStr = exportBackupData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rice_Mill_Telugu_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && importBackupData(content)) {
        onRefreshAllData();
        alert('బ్యాకప్ సమాచారం విజయవంతంగా ఇంపోర్ట్ చేయబడింది!');
      } else {
        alert('ఇంపోర్ట్ విఫలమైంది. సరైన JSON ఫైల్ ఎంచుకోండి.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (window.confirm('రైస్ మిల్లు డెమో సమాచారాన్ని (Demo Data) రీసెట్ చేయాలా?')) {
      resetDemoData();
      onRefreshAllData();
      alert('డెమో బిల్లుల సమాచారం పునరుద్ధరించబడింది!');
    }
  };

  const handleSyncToMongo = async () => {
    const ok = await syncLocalStorageToMongo();
    if (ok) {
      alert('స్థానిక బిల్లులు & వివరాలు MongoDB డేటాబేస్‌కు విజయవంతంగా సింక్ చేయబడ్డాయి!');
      onRefreshAllData();
    } else {
      alert('MongoDB సింక్ విఫలమైంది. దయచేసి Express / MongoDB సర్వర్ రన్ అవుతుందో లేదో సరిచూసుకోండి.');
    }
  };

  const handleSeedMongoDemo = async () => {
    if (window.confirm('MongoDB డేటాబేస్‌లో డెమో బిల్లులను రీసెట్ చేయాలా?')) {
      const ok = await seedMongoDemoData();
      if (ok) {
        alert('MongoDB డెమో డేటా రీసెట్ చేయబడింది!');
        onRefreshAllData();
      } else {
        alert('MongoDB రీసెట్ విఫలమైంది. సర్వర్ కనెక్షన్ తనిఖీ చేయండి.');
      }
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="h-6 w-6 text-amber-600" />
            రైస్ మిల్లు ప్రొఫైల్ & సెట్టింగ్‌లు (Settings)
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            బిల్లుపై వచ్చే మీ మిల్లు పేరు, చిరునామా, ఫోన్ నంబర్లు మరియు MERN / MongoDB డేటాబేస్ సెట్టింగ్‌లు.
          </p>
        </div>
      </div>

      {statusMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2 text-sm font-bold">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* MongoDB Database Control Box */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-amber-400 text-base flex items-center gap-2">
            <Database className="h-5 w-5" /> MERN / MongoDB డేటాబేస్ నిర్వాహకం
          </h3>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2.5 py-1 rounded-full border border-emerald-500/30">
            Node.js + Express API
          </span>
        </div>
        <p className="text-xs text-slate-300">
          మీ కంప్యూటర్‌లో నడుస్తున్న MongoDB లేదా MongoDB Atlas క్లౌడ్‌కి స్థానిక బిల్లుల సమాచారాన్ని సమకాలీకరించండి.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleSyncToMongo}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm transition-all"
          >
            <Send className="h-4 w-4" />
            <span>మొత్తం డేటాను MongoDBకి సింక్ చేయి</span>
          </button>

          <button
            onClick={handleSeedMongoDemo}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded-xl text-xs transition-all border border-slate-700"
          >
            <RefreshCw className="h-4 w-4 text-amber-400" />
            <span>MongoDB డెమో రీసెట్</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-2 flex items-center gap-2">
            <Wheat className="h-4 w-4 text-amber-600" /> రైస్ మిల్లు పేరు & చిరునామా
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">రైస్ మిల్లు పేరు *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-extrabold text-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">టాగ్ లైన్ (వివరణ)</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">ఫోన్ నంబరు *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">గ్రామం / ఊరు</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">స్ట్రీట్ చిరునామా</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700">
            బిల్లుపై నిబంధనలు (ఒక్కో లైనుకు ఒకటి)
          </label>
          <textarea
            rows={3}
            value={termsText}
            onChange={(e) => setTermsText(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:bg-white"
          />
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="submit"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all text-sm"
          >
            <Save className="h-4 w-4" />
            <span>సేవ్ సెట్టింగ్‌లు</span>
          </button>
        </div>
      </form>

      {/* Backup Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-2">
          డేటా భద్రత & బ్యాకప్ (Data Backup)
        </h3>
        <p className="text-xs text-slate-500">
          మీ బిల్లుల డేటాను JSON ఫైల్ రూపంలో మీ ఫోన్ లేదా కంప్యూటర్‌లో దాచుకోవచ్చు.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs"
          >
            <Download className="h-4 w-4 text-amber-400" />
            <span>బ్యాకప్ డౌన్‌లోడ్ (JSON)</span>
          </button>

          <label className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer">
            <Upload className="h-4 w-4 text-blue-600" />
            <span>బ్యాకప్ అప్‌లోడ్</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          <button
            onClick={handleResetData}
            className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold px-4 py-2.5 rounded-xl text-xs ml-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>డెమో రీసెట్</span>
          </button>
        </div>
      </div>
    </div>
  );
};
