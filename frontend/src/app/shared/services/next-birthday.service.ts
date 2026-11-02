import { Injectable } from '@angular/core';
import { JalaliDateService } from './jalali-date.service';

@Injectable({ providedIn: 'root' })
export class NextBirthdayService {
  private readonly jalali = new JalaliDateService();

  /**
   * Next birthday from Gregorian ISO date using Jalali month/day.
   * ۳۰ اسفند in non-leap years observes on ۲۹ اسفند.
   */
  getNextBirthdayIso(birthGregorianIso: string, today = new Date()): string {
    const birth = this.jalali.toJalali(birthGregorianIso);
    const t = this.jalali.toJalali(
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
    );

    for (let year = t.jy; year <= t.jy + 1; year++) {
      const iso = this.jalali.toGregorianIso(year, birth.jm, birth.jd);
      const [gy, gm, gd] = iso.split('-').map(Number);
      const occ = new Date(gy!, gm! - 1, gd!);
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (occ >= start) return iso;
    }
    return this.jalali.toGregorianIso(t.jy + 2, birth.jm, birth.jd);
  }

  daysUntil(birthGregorianIso: string, today = new Date()): number {
    const next = this.getNextBirthdayIso(birthGregorianIso, today);
    const [gy, gm, gd] = next.split('-').map(Number);
    const occ = new Date(gy!, gm! - 1, gd!);
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return Math.round((occ.getTime() - start.getTime()) / 86_400_000);
  }
}
