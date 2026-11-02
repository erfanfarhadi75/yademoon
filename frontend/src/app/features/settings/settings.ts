import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { ColorPalette, ThemeService } from '../../core/theme/theme.service';
import { IconComponent } from '../../shared/components/icon/icon';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-settings',
  imports: [IconComponent],
  template: `
    <section class="scene scene--settings page">
      <div class="page-panel fade-up">
        <h1>تنظیمات</h1>
        <p class="lead">حساب، ظاهر و پالت رنگ</p>

        <button class="theme-toggle" type="button" (click)="theme.toggle()">
          <span class="theme-label">
            <app-icon [name]="theme.mode() === 'dark' ? 'moon' : 'sun'" [size]="18" />
            تم {{ theme.mode() === 'dark' ? 'تیره' : 'روشن' }}
          </span>
          <span class="hint">برای تغییر ضربه بزن</span>
        </button>

        <p class="section-title">پالت رنگ</p>
        <div class="palette-grid" role="listbox" aria-label="انتخاب پالت رنگ">
          @for (p of theme.palettes; track p.id) {
            <button
              type="button"
              class="palette-card"
              role="option"
              [class.active]="theme.palette() === p.id"
              [attr.aria-selected]="theme.palette() === p.id"
              (click)="pick(p.id)"
            >
              <span class="swatches" aria-hidden="true">
                <i [style.background]="p.swatch"></i>
                <i [style.background]="p.secondary"></i>
              </span>
              <span class="name">{{ p.label }}</span>
            </button>
          }
        </div>

        <dl>
          <div>
            <dt>نام نمایشی</dt>
            <dd>{{ auth.user()?.displayName }}</dd>
          </div>
          <div>
            <dt>ایمیل</dt>
            <dd>{{ auth.user()?.email }}</dd>
          </div>
          <div>
            <dt>نام محصول</dt>
            <dd>{{ productName }}</dd>
          </div>
          <div>
            <dt>نسخه</dt>
            <dd>{{ version }}</dd>
          </div>
        </dl>

        <button class="btn ghost block" type="button" (click)="logout()">
          <app-icon name="logout" [size]="18" />
          خروج از حساب
        </button>
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
      transition: color 180ms ease;
    }
    .lead {
      margin: 0.3rem 0 0.85rem;
      color: var(--ink-muted);
      font-size: 0.95rem;
    }
    .theme-label {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      font-weight: 600;
    }
    .hint {
      font-size: 0.8rem;
      color: var(--ink-muted);
    }
    .section-title {
      margin: 1rem 0 0.15rem;
      font-size: 0.85rem;
      font-weight: 600;
    }
    dl div {
      padding: 0.65rem 0;
      border-bottom: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
    }
    dt {
      font-size: 0.78rem;
      color: var(--ink-muted);
    }
    dd {
      margin: 0.2rem 0 0;
    }
    .btn.block {
      margin-top: 1.15rem;
    }
  `,
})
export class SettingsPage {
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  readonly productName = environment.productName;
  readonly version = environment.appVersion;

  pick(id: ColorPalette): void {
    this.theme.setPalette(id);
  }

  logout(): void {
    void this.auth.logout();
  }
}
