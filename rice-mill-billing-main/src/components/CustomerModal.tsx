import React, { useState, useEffect } from 'react';
import type { Customer } from '../types/billing';
import { X, UserPlus, Save } from 'lucide-react';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCustomer: (customer: Omit<Customer, 'id' | 'createdAt'> & { id?: string }) => void;
  editingCustomer?: Customer | null;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onSaveCustomer,
  editingCustomer
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (editingCustomer) {
      setName(editingCustomer.name);
      setPhone(editingCustomer.phone);
      setVillage(editingCustomer.village);
      setAddress(editingCustomer.address || '');
    } else {
      setName('');
      setPhone('');
      setVillage('');
      setAddress('');
    }
  }, [editingCustomer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('దయచేసి రైతు / ఖాతాదారుని పేరు నమోదు చేయండి.');
      return;
    }

    onSaveCustomer({
      id: editingCustomer?.id,
      name: name.trim(),
      phone: phone.trim(),
      village: village.trim(),
      address: address.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-base">
            <UserPlus className="h-5 w-5 text-amber-400" />
            <span>{editingCustomer ? 'రైతు వివరాల సవరణ' : 'కొత్త రైతు / ఖాతాదారుని నమోదు'}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">రైతు / ఖాతాదారుని పేరు *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ఉదా: రామయ్య గారు"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">ఫోన్ నంబరు</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="ఉదా: 9848012345"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">గ్రామం / ఊరు</label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="ఉదా: మిర్యాలగూడ"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">చిరునామా (ఇంటి వివరాలు)</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="ఉదా: ఇ.నం 4-12, మార్కెట్ వీధి"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              రద్దు చేయి
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs shadow-sm transition-all"
            >
              <Save className="h-4 w-4" />
              <span>సేవ్ చేయి</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
