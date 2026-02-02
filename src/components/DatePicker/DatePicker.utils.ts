export function formatDateDDMMYYYY(date: Date): string {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
}

export function formatDigitsAsDate(digits: string): string {
  const d = digits.slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

export function parseDateInput(input: string): Date | null {
  const normalized = input.replace(/\D/g, '');
  if (normalized.length !== 8) return null;
  const day = parseInt(normalized.slice(0, 2), 10);
  const month = parseInt(normalized.slice(2, 4), 10) - 1;
  const year = parseInt(normalized.slice(4, 8), 10);
  const date = new Date(year, month, day);
  if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return null;
  return date;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function getCalendarDays(
  year: number,
  month: number
): { date: Date; isCurrentMonth: boolean }[] {
  const first = new Date(year, month, 1);
  const dayOfWeek = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - dayOfWeek);
  const days: { date: Date; isCurrentMonth: boolean }[] = [];
  for (let i = 0; i < 42; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push({
      date: d,
      isCurrentMonth: d.getMonth() === month,
    });
  }
  return days;
}
