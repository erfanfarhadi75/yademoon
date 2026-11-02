import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-settings',
  template: `
    <section class="scene scene--settings page">
      <div class="page-panel fade-up">
        <h1>تنظیمات</h1>
        <p class="lead">حساب و اطلاعات برنامه</p>

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

        <button class="btn ghost block" type="button" (click)="logout()">خروج از حساب</button>
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
    dl div {
      padding: 0.65rem 0;
      border-bottom: 1px solid color-mix(in srgb, var(--ink) 8%, transparent);
    }
    dt {
      font-size: 0.78rem;
      color: color-mix(in srgb, var(--ink) 55%, transparent);
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
  readonly productName = environment.productName;
  readonly version = environment.appVersion;

  logout(): void {
    void this.auth.logout();
  }
}
