import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-settings',
  template: `
    <section class="page fade-up">
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
      margin: 0.35rem 0 1.25rem;
      color: color-mix(in srgb, var(--ink) 65%, transparent);
    }
    dl div {
      padding: 0.85rem 0;
      border-bottom: 1px solid color-mix(in srgb, var(--ink) 8%, transparent);
    }
    dt {
      font-size: 0.8rem;
      color: color-mix(in srgb, var(--ink) 55%, transparent);
    }
    dd {
      margin: 0.25rem 0 0;
    }
    .btn.block {
      margin-top: 1.5rem;
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
