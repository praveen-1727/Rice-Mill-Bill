/**
 * Convert numbers to Indian Rupee Words representation
 * e.g. 54200 -> "Rupees Fifty-Four Thousand Two Hundred Only"
 */

const units = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertLessThanThousand(num: number): string {
  if (num === 0) return '';
  
  let result = '';
  if (num >= 100) {
    result += units[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }
  
  if (num >= 20) {
    result += tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + units[num % 10] : '');
  } else if (num > 0) {
    result += units[num];
  }
  
  return result.trim();
}

export function numberToIndianWords(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'Rupees Zero Only';

  const rounded = Math.round(amount * 100) / 100;
  const wholePart = Math.floor(rounded);
  const decimalPart = Math.round((rounded - wholePart) * 100);

  let num = wholePart;
  let words = '';

  if (num >= 10000000) {
    const crore = Math.floor(num / 10000000);
    words += convertLessThanThousand(crore) + ' Crore ';
    num %= 10000000;
  }

  if (num >= 100000) {
    const lakh = Math.floor(num / 100000);
    words += convertLessThanThousand(lakh) + ' Lakh ';
    num %= 100000;
  }

  if (num >= 1000) {
    const thousand = Math.floor(num / 1000);
    words += convertLessThanThousand(thousand) + ' Thousand ';
    num %= 1000;
  }

  if (num > 0) {
    words += convertLessThanThousand(num);
  }

  words = words.trim();
  let result = `Rupees ${words}`;

  if (decimalPart > 0) {
    result += ` and ${convertLessThanThousand(decimalPart)} Paise`;
  }

  return `${result} Only`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount || 0);
}
