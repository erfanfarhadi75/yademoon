import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PeopleApiService } from '../../core/api/people.service';
import { DashboardDto, RELATION_LABELS, PersonDto } from '../../shared/models/person';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { LoadingComponent } from '../../shared/components/loading/loading';
import { JalaliDateService } from '../../shared/services/jalali-date.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, EmptyStateComponent, LoadingComponent],
  template: `
    <section class="page">
      <header class="hero fade-up">
        <p class="brand">{{ productName }}</p>
        <h1>سلام {{ data()?.greetingName || '' }}</h1>
        <p class="lead">روزهای قشنگ رو با هم از دست ندیم.</p>
      </header>

      @if (loading()) {
        <app-loading />
      } @else if (error()) {
        <p class="error">{{ error() }}</p>
      } @else if ((data()?.totalPeople ?? 0) === 0) {
        <app-empty-state
          title="هنوز کسی ثبت نشده"
          hint="اولین نفر از آدم‌های مهم زندگی‌ات را اضافه کن."
          ctaLabel="افزودن اولین نفر"
        />
      } @else {
        <div class="counts fade-up" style="animation-delay: 80ms">
          <div>
            <strong>{{ fa(data()!.totalPeople) }}</strong>
            <span>نفر</span>
          </div>
          <div>
            <strong>{{ fa(data()!.todayCount) }}</strong>
            <span>امروز</span>
          </div>
          <div>
            <strong>{{ fa(data()!.upcomingCount) }}</strong>
            <span>نزدیک</span>
          </div>
          <div>
            <strong>{{ fa(data()!.thisMonthCount) }}</strong>
            <span>این ماه</span>
          </div>
        </div>

        @if (data()?.nearest; as nearest) {
          <article class="nearest fade-up" style="animation-delay: 140ms">
            <p class="eyebrow">نزدیک‌ترین تولد</p>
            <h2>{{ nearest.name }}</h2>
            <p>
              {{ relation(nearest) }} ·
              @if (nearest.daysUntil === 0) {
                امروز 🎉
              } @else {
                {{ fa(nearest.daysUntil) }} روز مانده
              }
            </p>
            <p class="date">{{ jalali.formatJalali(nearest.nextBirthday) }}</p>
          </article>
        }

        @if (data()!.today.length) {
          <section class="block fade-up" style="animation-delay: 180ms">
            <h3>امروز</h3>
            @for (p of data()!.today; track p.id) {
              <a class="row" [routerLink]="['/people', p.id]">{{ p.name }}</a>
            }
          </section>
        }

        @if (data()!.upcoming.length) {
          <section class="block fade-up" style="animation-delay: 220ms">
            <h3>نزدیک (۳۰ روز)</h3>
            @for (p of data()!.upcoming; track p.id) {
              <a class="row" [routerLink]="['/people', p.id]">
                <span>{{ p.name }}</span>
                <span class="muted">{{ fa(p.daysUntil) }} روز</span>
              </a>
            }
          </section>
        }

        <a class="btn primary block fade-up" style="animation-delay: 260ms" routerLink="/people/new">
          افزودن نفر جدید
        </a>
      }
    </section>
  `,
  styles: `
    .page {
      padding: 1.5rem 1.25rem 6.5rem;
      max-width: 40rem;
      margin: 0 auto;
    }
    .brand {
      font-family: var(--font-display);
      font-size: clamp(2.2rem, 7vw, 3rem);
      color: var(--rose);
      margin: 0 0 0.5rem;
    }
    h1 {
      margin: 0 0 0.35rem;
      font-size: 1.4rem;
    }
    .lead {
      margin: 0;
      color: color-mix(in srgb, var(--ink) 68%, transparent);
    }
    .counts {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
      margin: 1.75rem 0 1.25rem;
      text-align: center;
    }
    .counts strong {
      display: block;
      font-size: 1.35rem;
      color: var(--rose);
    }
    .counts span {
      font-size: 0.75rem;
      color: color-mix(in srgb, var(--ink) 60%, transparent);
    }
    .nearest {
      padding: 1.25rem 0;
      border-top: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
      border-bottom: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
      margin-bottom: 1.25rem;
    }
    .eyebrow {
      margin: 0;
      font-size: 0.8rem;
      color: var(--apricot-deep);
    }
    .nearest h2 {
      margin: 0.25rem 0;
      font-family: var(--font-display);
      font-size: 1.8rem;
    }
    .date {
      margin: 0.35rem 0 0;
      color: color-mix(in srgb, var(--ink) 65%, transparent);
    }
    .block h3 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
    }
    .row {
      display: flex;
      justify-content: space-between;
      padding: 0.7rem 0;
      text-decoration: none;
      color: var(--ink);
      border-bottom: 1px solid color-mix(in srgb, var(--ink) 6%, transparent);
    }
    .muted {
      color: color-mix(in srgb, var(--ink) 55%, transparent);
      font-size: 0.9rem;
    }
    .btn.block {
      margin-top: 1.5rem;
    }
  `,
})
export class DashboardPage implements OnInit {
  private readonly api = inject(PeopleApiService);
  readonly jalali = inject(JalaliDateService);
  readonly productName = environment.productName;
  readonly data = signal<DashboardDto | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.api.dashboard().subscribe({
      next: (d) => {
        this.data.set(d);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('بارگذاری داشبورد ناموفق بود.');
        this.loading.set(false);
      },
    });
  }

  fa(n: number): string {
    return this.jalali.toFaDigits(n);
  }

  relation(p: PersonDto): string {
    return RELATION_LABELS[p.relation];
  }
}
