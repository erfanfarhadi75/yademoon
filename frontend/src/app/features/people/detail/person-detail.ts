import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PeopleApiService } from '../../../core/api/people.service';
import { PersonDto, RELATION_LABELS } from '../../../shared/models/person';
import { JalaliDateService } from '../../../shared/services/jalali-date.service';
import { LoadingComponent } from '../../../shared/components/loading/loading';

@Component({
  selector: 'app-person-detail',
  imports: [RouterLink, LoadingComponent],
  template: `
    <section class="page">
      @if (loading()) {
        <app-loading />
      } @else if (error()) {
        <p class="error">{{ error() }}</p>
      } @else if (person(); as p) {
        <a routerLink="/people" class="back">بازگشت</a>
        <article class="fade-up">
          <figure class="mood">
            <img
              src="/images/yademoon-auth-hero.jpg"
              alt="شمع تولد و حال‌وهوای گرم یادآوری"
              width="800"
              height="450"
            />
          </figure>
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
            <a class="btn primary" [routerLink]="['/people', p.id, 'edit']">ویرایش</a>
            <button class="btn ghost" type="button" (click)="remove(p.id)">حذف</button>
          </div>
        </article>
      }
    </section>
  `,
  styles: `
    .page {
      padding: 1.5rem 1.25rem 6.5rem;
      max-width: 40rem;
      margin: 0 auto;
    }
    .back {
      text-decoration: none;
      color: color-mix(in srgb, var(--ink) 65%, transparent);
    }
    .mood {
      margin: 0.85rem 0 0.35rem;
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
    h1 {
      margin: 0.75rem 0 0.25rem;
      font-family: var(--font-display);
      font-size: 2.2rem;
      color: var(--rose);
    }
    .relation {
      margin: 0;
      color: color-mix(in srgb, var(--ink) 65%, transparent);
    }
    .stat {
      margin: 1rem 0;
      font-size: 1.15rem;
      font-weight: 600;
    }
    dl {
      margin: 0 0 1.5rem;
    }
    dl div {
      padding: 0.7rem 0;
      border-bottom: 1px solid color-mix(in srgb, var(--ink) 8%, transparent);
    }
    dt {
      font-size: 0.8rem;
      color: color-mix(in srgb, var(--ink) 55%, transparent);
    }
    dd {
      margin: 0.2rem 0 0;
    }
    .actions {
      display: flex;
      gap: 0.75rem;
    }
  `,
})
export class PersonDetailPage implements OnInit {
  private readonly api = inject(PeopleApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
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

  remove(id: string): void {
    if (!confirm('این فرد حذف شود؟')) return;
    this.api.remove(id).subscribe({
      next: () => void this.router.navigateByUrl('/people'),
      error: () => this.error.set('حذف ناموفق بود.'),
    });
  }
}
