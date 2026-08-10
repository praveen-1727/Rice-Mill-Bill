/**
 * Helper utilities for Indian Standard Time (IST - Asia/Kolkata UTC+5:30)
 */

export function getISTDateString(): string {
  const now = new Date();
  // Returns YYYY-MM-DD in Asia/Kolkata timezone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(now);
}

export function formatISTDisplayDate(dateStr?: string): string {
  if (!dateStr) return getISTDateString();
  try {
    const [year, month, day] = dateStr.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
  } catch (e) {
    // fallback
  }
  return dateStr;
}

/**
 * Generate next Bill Number starting from RM-1, RM-2, RM-3, etc.
 */
export function generateNextBillNo(existingBills: { billNo: string }[]): string {
  if (!existingBills || existingBills.length === 0) {
    return 'RM-1';
  }

  let maxNum = 0;
  for (const b of existingBills) {
    if (b.billNo) {
      const match = b.billNo.match(/RM-(\d+)/i) || b.billNo.match(/RMB-(\d+)/i) || b.billNo.match(/(\d+)/);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  }

  return `RM-${maxNum + 1}`;
}
