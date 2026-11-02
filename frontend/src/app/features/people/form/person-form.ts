import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PeopleApiService } from '../../../core/api/people.service';
import { RELATION_LABELS, RelationType } from '../../../shared/models/person';
import { JalaliDateService } from '../../../shared/services/jalali-date.service';
import { LoadingComponent } from '../../../shared/components/loading/loading';

@Component({
  selector: 'app-person-form',
  imports: [ReactiveFormsModule, RouterLink, LoadingComponent],
  template: `
    <section class="scene scene--form page">
      <div class="page-panel fade-up">
        <a routerLink="/people" class="back">بازگشت</a>
        <h1>{{ isEdit() ? 'ویرایش' : 'افزودن فرد' }}</h1>

        @if (loading()) {
          <app-loading />
        } @else {
          <form [formGroup]="form" (ngSubmit)="submit()">
            <label>
              نام
              <input type="text" formControlName="name" />
            </label>
            <label>
              رابطه
              <select formControlName="relation">
                @for (r of relations; track r) {
                  <option [ngValue]="r">{{ labels[r] }}</option>
                }
              </select>
            </label>

            <fieldset>
              <legend>تاریخ تولد (شمسی)</legend>
              <div class="jalali-row">
                <label>
                  روز
                  <select formControlName="jd">
                    @for (d of days(); track d) {
                      <option [ngValue]="d">{{ jalali.toFaDigits(d) }}</option>
                    }
                  </select>
                </label>
                <label>
                  ماه
                  <select formControlName="jm">
                    @for (m of months; track m.v) {
                      <option [ngValue]="m.v">{{ m.n }}</option>
                    }
                  </select>
                </label>
                <label>
                  سال
                  <select formControlName="jy">
                    @for (y of years; track y) {
                      <option [ngValue]="y">{{ jalali.toFaDigits(y) }}</option>
                    }
                  </select>
                </label>
              </div>
            </fieldset>

            <label>
              یادداشت (اختیاری)
              <textarea rows="3" formControlName="notes"></textarea>
            </label>

            @if (error()) {
              <p class="error">{{ error() }}</p>
            }

            <button class="btn primary block" type="submit" [disabled]="form.invalid || saving()">
              ذخیره
            </button>
          </form>
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
    .back {
      display: inline-block;
      margin-bottom: 0.55rem;
      color: color-mix(in srgb, var(--ink) 65%, transparent);
      text-decoration: none;
      font-size: 0.92rem;
    }
    h1 {
      margin: 0 0 0.95rem;
      font-family: var(--font-display);
      font-size: 1.85rem;
      color: var(--rose);
    }
    form {
      display: grid;
      gap: 0.8rem;
    }
    fieldset {
      border: 1px solid color-mix(in srgb, var(--ink) 12%, transparent);
      border-radius: 14px;
      padding: 0.75rem;
      background: color-mix(in srgb, white 35%, transparent);
    }
    legend {
      padding: 0 0.35rem;
      color: color-mix(in srgb, var(--ink) 70%, transparent);
    }
    .jalali-row {
      display: grid;
      grid-template-columns: 1fr 1.4fr 1fr;
      gap: 0.5rem;
    }
  `,
})
export class PersonFormPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(PeopleApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly jalali = inject(JalaliDateService);
  readonly labels = RELATION_LABELS;
  readonly relations = Object.values(RelationType).filter((v) => typeof v === 'number') as RelationType[];
  readonly isEdit = signal(false);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly days = signal<number[]>([]);
  private personId: string | null = null;

  readonly months = Array.from({ length: 12 }, (_, i) => ({
    v: i + 1,
    n: this.jalali.monthName(i + 1),
  }));

  readonly years: number[] = (() => {
    const now = this.jalali.todayJalali().jy;
    return Array.from({ length: 90 }, (_, i) => now - i);
  })();

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    relation: [RelationType.Friend as RelationType, Validators.required],
    jy: [1370, Validators.required],
    jm: [1, Validators.required],
    jd: [1, Validators.required],
    notes: [''],
  });

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => this.refreshDays());
    this.refreshDays();

    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.personId = id;
      this.isEdit.set(true);
      this.loading.set(true);
      this.api.get(id).subscribe({
        next: (p) => {
          const j = this.jalali.toJalali(p.birthDate);
          this.form.patchValue({
            name: p.name,
            relation: p.relation,
            jy: j.jy,
            jm: j.jm,
            jd: j.jd,
            notes: p.notes ?? '',
          });
          this.refreshDays();
          this.loading.set(false);
        },
        error: () => {
          this.error.set('فرد پیدا نشد.');
          this.loading.set(false);
        },
      });
    }
  }

  private refreshDays(): void {
    const { jy, jm, jd } = this.form.getRawValue();
    const count = this.jalali.daysInMonth(jy, jm);
    this.days.set(Array.from({ length: count }, (_, i) => i + 1));
    if (jd > count) this.form.patchValue({ jd: count }, { emitEvent: false });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.saving.set(true);
    this.error.set('');
    const v = this.form.getRawValue();
    const birthDate = this.jalali.toGregorianIso(v.jy, v.jm, v.jd);
    const body = {
      name: v.name,
      relation: v.relation,
      birthDate,
      notes: v.notes || null,
    };

    const req = this.personId
      ? this.api.update(this.personId, body)
      : this.api.create(body);

    req.subscribe({
      next: (p) => {
        this.saving.set(false);
        void this.router.navigate(['/people', p.id]);
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error?.message ?? 'ذخیره ناموفق بود.');
      },
    });
  }
}
