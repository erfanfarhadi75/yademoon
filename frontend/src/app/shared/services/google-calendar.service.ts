import { Injectable, inject } from '@angular/core';
import { PersonDto, RELATION_LABELS } from '../models/person';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GoogleCalendarService {
  /** Builds a Google Calendar template URL for the person's next birthday (all-day). */
  buildBirthdayUrl(person: PersonDto): string {
    const start = person.nextBirthday.replaceAll('-', '');
    const endDate = this.addDaysIso(person.nextBirthday, 1).replaceAll('-', '');
    const title = `تولد ${person.name}`;
    const details = [
      `یادآوری تولد ${person.name}`,
      `رابطه: ${RELATION_LABELS[person.relation]}`,
      person.notes ? `یادداشت: ${person.notes}` : null,
      `از ${environment.productName}`,
    ]
      .filter(Boolean)
      .join('\n');

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${start}/${endDate}`,
      details,
      sf: 'true',
      output: 'xml',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  openBirthday(person: PersonDto): void {
    const url = this.buildBirthdayUrl(person);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  private addDaysIso(iso: string, days: number): string {
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(Date.UTC(y!, m! - 1, d!));
    dt.setUTCDate(dt.getUTCDate() + days);
    const yy = dt.getUTCFullYear();
    const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(dt.getUTCDate()).padStart(2, '0');
    return `${yy}-${mm}-${dd}`;
  }
}
