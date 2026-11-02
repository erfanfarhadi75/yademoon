import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PeopleApiService } from '../../../core/api/people.service';
import { PersonDto, RELATION_LABELS, RelationType } from '../../../shared/models/person';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state';
import { LoadingComponent } from '../../../shared/components/loading/loading';
import { JalaliDateService } from '../../../shared/services/jalali-date.service';

@Component({
  selector: 'app-people-list',
  imports: [RouterLink, FormsModule, EmptyStateComponent, LoadingComponent],
  template: `
    <section class="scene scene--people page">
      <div class="page-panel fade-up">
        <header>
          <h1>افراد</h1>
          <p class="lead">جستجو، فیلتر و مرتب‌سازی تولدها</p>
        </header>

        <div class="filters">
          <input
            type="search"
            placeholder="جستجوی نام…"
            [(ngModel)]="search"
            (ngModelChange)="reload()"
          />
          <select [(ngModel)]="relation" (ngModelChange)="reload()">
            <option [ngValue]="null">همه روابط</option>
            @for (r of relations; track r) {
              <option [ngValue]="r">{{ labels[r] }}</option>
            }
          </select>
          <select [(ngModel)]="sort" (ngModelChange)="reload()">
            <option value="days">نزدیک‌ترین تولد</option>
            <option value="name">نام</option>
            <option value="relation">رابطه</option>
          </select>
        </div>

        @if (loading()) {
          <app-loading />
        } @else if (error()) {
          <p class="error">{{ error() }}</p>
        } @else if (!people().length) {
          <app-empty-state
            title="کسی پیدا نشد"
            hint="فرد جدیدی اضافه کن یا فیلتر را عوض کن."
            ctaLabel="افزودن"
          />
        } @else {
          <ul class="list">
            @for (p of people(); track p.id) {
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
      padding: 1.15rem 1rem 6.25rem;
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
    .filters {
      display: grid;
      gap: 0.5rem;
      margin-bottom: 0.85rem;
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
export class PeopleListPage implements OnInit {
  private readonly api = inject(PeopleApiService);
  readonly jalali = inject(JalaliDateService);
  readonly labels = RELATION_LABELS;
  readonly relations = Object.values(RelationType).filter((v) => typeof v === 'number') as RelationType[];
  readonly people = signal<PersonDto[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  search = '';
  relation: RelationType | null = null;
  sort = 'days';

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.api.list(this.search || undefined, this.relation, this.sort).subscribe({
      next: (list) => {
        this.people.set(list);
        this.loading.set(false);
        this.error.set('');
      },
      error: () => {
        this.error.set('بارگذاری افراد ناموفق بود.');
        this.loading.set(false);
      },
    });
  }
}
