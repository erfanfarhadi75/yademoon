import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PeopleApiService } from '../../../core/api/people.service';
import { PersonDto, RELATION_LABELS } from '../../../shared/models/person';
import { JalaliDateService } from '../../../shared/services/jalali-date.service';
import { GoogleCalendarService } from '../../../shared/services/google-calendar.service';
import { LoadingComponent } from '../../../shared/components/loading/loading';
import { IconComponent } from '../../../shared/components/icon/icon';

@Component({
  selector: 'app-person-detail',
  imports: [RouterLink, LoadingComponent, IconComponent],
  template: `
    <section class="scene scene--form page">
      <div class="page-panel fade-up">
        @if (loading()) {
          <app-loading />
        } @else if (error()) {
          <p class="error">{{ error() }}</p>
        } @else if (person(); as p) {
          <a routerLink="/people" class="back">
            <app-icon name="arrow-right" [size]="16" />
            بازگشت
          </a>
          <h1>{{ p.name }}</h1>
          <p class="relation">{{ labels[p.relation] }}</p>
          <p class="stat">
            @if (p.daysUntil === 0) {
              تولد امروز است
            } @else {
              {{ jalali.toFaDigits(p.daysUntil) }} روز تا تولد
            }
          </p>
          <dl>
            <div>
              <dt>تاریخ تولد</dt>
              <dd>{{ jalali.formatJalali(p.birthDate) }}</dd>
            </div>
            <div>
              <dt>تولد بعدی</dt>
              <dd>{{ jalali.formatJalali(p.nextBirthday) }}</dd>
            </div>
            @if (p.notes) {
              <div>
                <dt>یادداشت</dt>
                <dd>{{ p.notes }}</dd>
              </div>
            }
          </dl>
          <div class="actions">
            <button class="btn primary" type="button" (click)="addToCalendar(p)">
              <app-icon name="calendar" [size]="18" />
              گوگل کلندر
            </button>
            <a class="btn ghost" [routerLink]="['/people', p.id, 'edit']">
              <app-icon name="edit" [size]="18" />
              ویرایش
            </a>
            <button class="btn ghost danger" type="button" (click)="remove(p.id)">
              <app-icon name="trash" [size]="18" />
              حذف
            </button>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .page {
      padding: 0.85rem 0.85rem calc(4.75rem + env(safe-area-inset-bottom));
      max-width: 40rem;
      margin: 0 auto;
    }
    .back {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      text-decoration: none;
      color: var(--ink-muted);
      font-size: 0.92rem;
    }
    h1 {
      margin: 0.55rem 0 0.2rem;
      font-family: var(--font-display);
      font-size: 1.9rem;
      color: var(--rose);
    }
    .relation {
      margin: 0;
      color: var(--ink-muted);
    }
    .stat {
      margin: 0.75rem 0;
      font-size: 1.05rem;
      font-weight: 600;
    }
    dl {
      margin: 0 0 1.15rem;
    }
    dl div {
      padding: 0.55rem 0;
      border-bottom: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
    }
    dt {
      font-size: 0.78rem;
      color: var(--ink-muted);
    }
    dd {
      margin: 0.15rem 0 0;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.55rem;
    }
    .btn.danger {
      color: var(--danger);
      border-color: color-mix(in srgb, var(--danger) 40%, transparent);
    }
  `,
})
export class PersonDetailPage implements OnInit {
  private readonly api = inject(PeopleApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly calendar = inject(GoogleCalendarService);
  readonly jalali = inject(JalaliDateService);
  readonly labels = RELATION_LABELS;
  readonly person = signal<PersonDto | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.get(id).subscribe({
      next: (p) => {
        this.person.set(p);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('فرد پیدا نشد.');
        this.loading.set(false);
      },
    });
  }

  addToCalendar(person: PersonDto): void {
    this.calendar.openBirthday(person);
  }

  remove(id: string): void {
    if (!confirm('این فرد حذف شود؟')) return;
    this.api.remove(id).subscribe({
      next: () => void this.router.navigateByUrl('/people'),
      error: () => this.error.set('حذف ناموفق بود.'),
    });
  }
}
