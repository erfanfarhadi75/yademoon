import { Injectable } from '@angular/core';
import * as jalaali from 'jalaali-js';

export interface JalaliDate {
  jy: number;
  jm: number;
  jd: number;
}

@Injectable({ providedIn: 'root' })
export class JalaliDateService {
  toJalali(gregorianIso: string): JalaliDate {
    const [y, m, d] = gregorianIso.split('-').map(Number);
    return jalaali.toJalaali(y, m, d);
  }

  toGregorianIso(jy: number, jm: number, jd: number): string {
    const daysInMonth = jalaali.jalaaliMonthLength(jy, jm);
    const day = Math.min(jd, daysInMonth);
    const g = jalaali.toGregorian(jy, jm, day);
    const mm = String(g.gm).padStart(2, '0');
    const dd = String(g.gd).padStart(2, '0');
    return `${g.gy}-${mm}-${dd}`;
  }

  todayJalali(): JalaliDate {
    const now = new Date();
    return jalaali.toJalaali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }

  formatJalali(gregorianIso: string): string {
    const { jy, jm, jd } = this.toJalali(gregorianIso);
    return `${this.toFaDigits(jy)}/${this.toFaDigits(jm.toString().padStart(2, '0'))}/${this.toFaDigits(jd.toString().padStart(2, '0'))}`;
  }

  monthName(jm: number): string {
    const names = [
      '',
      'فروردین',
      'اردیبهشت',
      'خرداد',
      'تیر',
      'مرداد',
      'شهریور',
      'مهر',
      'آبان',
      'آذر',
      'دی',
      'بهمن',
      'اسفند',
    ];
    return names[jm] ?? '';
  }

  daysInMonth(jy: number, jm: number): number {
    return jalaali.jalaaliMonthLength(jy, jm);
  }

  isLeap(jy: number): boolean {
    return jalaali.isLeapJalaaliYear(jy);
  }

  toFaDigits(value: string | number): string {
    return String(value).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]!);
  }
}
