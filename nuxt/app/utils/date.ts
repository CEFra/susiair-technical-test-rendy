export const APP_REFERENCE_DATE = '2026-05-15';
export const APP_REFERENCE_YEAR = 2026;
export const APP_REFERENCE_MONTH = 5;
export const APP_REFERENCE_DAY = 15;

export const isReferenceDate = (year: number, month: number, day: number) => {
  return year === APP_REFERENCE_YEAR && month === APP_REFERENCE_MONTH && day === APP_REFERENCE_DAY;
};

export const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const getCurrentHour = () => {
  return 9;
};

export const getMonthName = (year: number, month: number) => {
  const d = new Date(year, month - 1, 1);
  return d.toLocaleString('default', { month: 'long' });
};

export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month - 1, 1).getDay();
};
