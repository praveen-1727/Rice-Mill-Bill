// @ts-ignore
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min.js';
import type { Bill, BusinessProfile } from '../types/billing';
import { numberToIndianWords } from './numberToWords';

export function downloadBillPDF(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    alert('PDF కి బిల్లు ఎలిమెంట్ లభించలేదు.');
    return Promise.reject('Element not found');
  }

  const marginTuple: [number, number, number, number] = [10, 10, 10, 10];

  const opt = {
    margin: marginTuple,
    filename: filename || 'Rice_Mill_Bill.pdf',
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
  };

  try {
    let exporter = html2pdf;
    if (exporter && (exporter as any).default) {
      exporter = (exporter as any).default;
    }

    if (typeof exporter !== 'function') {
      console.error('html2pdf is not a function:', exporter);
      alert('PDF లైబ్రరీ లోడింగ్ సమస్య. బదులుగా ప్రింట్ ఆప్షన్ వాడండి.');
      return Promise.reject('html2pdf is not a function');
    }

    return exporter().set(opt).from(element).save();
  } catch (err: any) {
    console.error('Failed to export PDF:', err);
    alert(`PDF డౌన్‌లోడ్ విఫలమైంది: ${err.message || err}`);
    return Promise.reject(err);
  }
}

export function shareBillViaWhatsApp(bill: Bill, profile: BusinessProfile): void {
  const sec1Text = bill.section1Items
    .map((item, idx) => `${idx + 1}. *${item.name}*: ${item.calculationText || `₹${item.amount}`}`)
    .join('\n');

  const sec2Text = bill.section2Items
    .map((item, idx) => `${idx + 1}. *${item.name}*: ${item.calculationText || `₹${item.amount}`}`)
    .join('\n');

  const message = `*${profile.name}*
🌾 *రైస్ మిల్లు ఖాతా బిల్లు*
--------------------------------
*బిల్లు నంబరు:* ${bill.billNo}
*తేదీ:* ${bill.date}
*రైతు/ఖాతాదారు:* ${bill.customerName} (${bill.customerVillage || ''})
--------------------------------
*మొదటి భాగం (చార్జీలు/సరుకు):*
${sec1Text}
*మొత్తం 1 = ₹${bill.section1Total}*
--------------------------------
*రెండవ భాగం (అమ్మకాలు/క్రెడిట్):*
${sec2Text}
*మొత్తం 2 = ₹${bill.section2Total}*
--------------------------------
*చివరి నికర చెల్లింపు మొత్తం (Net Paid Amount):*
₹${bill.section2Total} - ₹${bill.section1Total} = *₹${Math.abs(bill.finalBalance)}*
(${numberToIndianWords(Math.abs(bill.finalBalance))})
--------------------------------
ధన్యవాదాలు! 
ఫోన్: ${profile.phone}`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${bill.customerPhone ? '91' + bill.customerPhone : ''}&text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}
