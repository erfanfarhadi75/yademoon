import { describe, expect, it } from 'vitest';
import { JalaliDateService } from './jalali-date.service';
import { NextBirthdayService } from './next-birthday.service';

describe('JalaliDateService', () => {
  const jalali = new JalaliDateService();

  it('converts Jalali to Gregorian ISO without timezone shift', () => {
    expect(jalali.toGregorianIso(1403, 1, 1)).toBe('2024-03-20');
    expect(jalali.toJalali('2024-03-20')).toEqual({ jy: 1403, jm: 1, jd: 1 });
  });

  it('clamps 30 Esfand in non-leap year to 29', () => {
    expect(jalali.isLeap(1400)).toBe(false);
    expect(jalali.daysInMonth(1400, 12)).toBe(29);
    // requesting day 30 clamps via toGregorianIso
    const iso = jalali.toGregorianIso(1400, 12, 30);
    const back = jalali.toJalali(iso);
    expect(back.jd).toBe(29);
  });
});

describe('NextBirthdayService', () => {
  const svc = new NextBirthdayService();

  it('returns 0 days when birthday is today (Jalali)', () => {
    // 1403-03-20 Jalali
    const birth = '1991-06-10'; // approximate; compute via service chain
    const jalali = new JalaliDateService();
    const iso = jalali.toGregorianIso(1370, 3, 20);
    const todayParts = jalali.toGregorianIso(1403, 3, 20).split('-').map(Number);
    const today = new Date(todayParts[0]!, todayParts[1]! - 1, todayParts[2]!);
    expect(svc.daysUntil(iso, today)).toBe(0);
    expect(svc.daysUntil(birth.length ? iso : iso, today)).toBe(0);
  });

  it('year-wraps past Farvardin birthday', () => {
    const jalali = new JalaliDateService();
    const birth = jalali.toGregorianIso(1370, 1, 15);
    const todayParts = jalali.toGregorianIso(1403, 2, 1).split('-').map(Number);
    const today = new Date(todayParts[0]!, todayParts[1]! - 1, todayParts[2]!);
    const next = svc.getNextBirthdayIso(birth, today);
    expect(jalali.toJalali(next)).toEqual({ jy: 1404, jm: 1, jd: 15 });
  });
});
