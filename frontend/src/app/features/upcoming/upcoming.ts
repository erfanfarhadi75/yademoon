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
    <section class="page">
      <header class="fade-up">
        <h1>نزدیک‌ها</h1>
        <p class="lead">تولدهای ۳۰ روز آینده، به‌ترتیب نزدیک‌ترین</p>
        <figure class="mood">
          <img
            src="/images/yademoon-upcoming-banner.jpg"
            alt="تقویم و یادداشت‌های نرم برای تولدهای نزدیک"
            width="800"
            height="450"
          />
        </figure>
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
          imageSrc="/images/yademoon-empty-hearts.jpg"
        />
      } @else {
        <ul class="list fade-up">
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
    </section>
  `,
  styles: `
    .page {
      padding: 1.5rem 1.25rem 6.5rem;
      max-width: 40rem;
      margin: 0 auto;
    }
    h1 {
      margin: 0;
      font-family: var(--font-display);
      font-size: 2rem;
      color: var(--rose);
    }
    .lead {
      margin: 0.35rem 0 0.9rem;
      color: color-mix(in srgb, var(--ink) 65%, transparent);
    }
    .mood {
      margin: 0 0 1.25rem;
      border-radius: 18px;
      overflow: hidden;
      aspect-ratio: 16 / 9;
      max-height: 180px;
    }
    .mood img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
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
      padding: 0.9rem 0;
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
