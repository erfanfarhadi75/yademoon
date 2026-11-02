import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PeopleApiService } from '../../core/api/people.service';
import { PersonDto, RELATION_LABELS } from '../../shared/models/person';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { LoadingComponent } from '../../shared/components/loading/loading';
import { JalaliDateService } from '../../shared/services/jalali-date.service';

@Component({
  selector: 'app-upcoming',
  imports: [RouterLink, EmptyStateComponent, LoadingComponent],
  template: `
    <section class="scene scene--upcoming page">
      <div class="page-panel fade-up">
        <header>
          <h1>نزدیک‌ها</h1>
          <p class="lead">تولدهای ۳۰ روز آینده، به‌ترتیب نزدیک‌ترین</p>
        </header>

        @if (loading()) {
          <app-loading />
        } @else if (error()) {
          <p class="error">{{ error() }}</p>
        } @else if (!items().length) {
          <app-empty-state
            title="تولد نزدیکی نیست"
            hint="در ۳۰ روز آینده تولدی ثبت نشده. کسی را اضافه کن یا بعداً سر بزن."
            ctaLabel="افزودن نفر"
          />
        } @else {
          <ul class="list">
            @for (p of items(); track p.id) {
              <li>
                <a [routerLink]="['/people', p.id]">
                  <div>
                    <strong>{{ p.name }}</strong>
                    <span>{{ labels[p.relation] }}</span>
                  </div>
                  <div class="meta">
                    <span>{{ jalali.formatJalali(p.nextBirthday) }}</span>
                    <span class="days">
                      @if (p.daysUntil === 0) {
                        امروز
                      } @else {
                        {{ jalali.toFaDigits(p.daysUntil) }} روز
                      }
                    </span>
                  </div>
                </a>
              </li>
            }
          </ul>
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
    h1 {
      margin: 0;
      font-family: var(--font-display);
      font-size: 1.85rem;
      color: var(--rose);
    }
    .lead {
      margin: 0.3rem 0 0.85rem;
      color: color-mix(in srgb, var(--ink) 65%, transparent);
      font-size: 0.95rem;
    }
    .list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .list a {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.7rem 0;
      text-decoration: none;
      color: var(--ink);
      border-bottom: 1px solid color-mix(in srgb, var(--ink) 7%, transparent);
    }
    .list strong {
      display: block;
    }
    .list span {
      font-size: 0.85rem;
      color: color-mix(in srgb, var(--ink) 58%, transparent);
    }
    .meta {
      text-align: left;
    }
    .days {
      display: block;
      color: var(--rose) !important;
      font-weight: 600;
    }
  `,
})
export class UpcomingPage implements OnInit {
  private readonly api = inject(PeopleApiService);
  readonly jalali = inject(JalaliDateService);
  readonly labels = RELATION_LABELS;
  readonly items = signal<PersonDto[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.api.list(undefined, null, 'days').subscribe({
      next: (list) => {
        this.items.set(list.filter((p) => p.daysUntil <= 30));
        this.loading.set(false);
      },
      error: () => {
        this.error.set('بارگذاری نزدیک‌ها ناموفق بود.');
        this.loading.set(false);
      },
    });
  }
}
