import { describe, expect, it } from 'vitest';
import { GoogleCalendarService } from './google-calendar.service';
import { RelationType } from '../models/person';

describe('GoogleCalendarService', () => {
  const svc = new GoogleCalendarService();

  it('builds all-day Google Calendar template URL for next birthday', () => {
    const url = svc.buildBirthdayUrl({
      id: '1',
      name: 'ستاره',
      relation: RelationType.Partner,
      birthDate: '1998-12-01',
      notes: 'گل',
      nextBirthday: '2026-12-01',
      daysUntil: 29,
      jalaliBirthMonth: 9,
      jalaliBirthDay: 10,
    });

    expect(url.startsWith('https://calendar.google.com/calendar/render?')).toBe(true);
    expect(url).toContain('action=TEMPLATE');
    expect(url).toContain('dates=20261201%2F20261202');
    const decoded = decodeURIComponent(url.replace(/\+/g, ' '));
    expect(decoded).toContain('تولد ستاره');
    expect(decoded).toContain('عشق و شریک عاطفی');
  });
});
