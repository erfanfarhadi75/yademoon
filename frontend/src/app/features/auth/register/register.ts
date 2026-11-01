import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth-shell fade-up">
      <p class="brand">{{ productName }}</p>
      <h1>ساخت حساب</h1>
      <p class="lead">چند لحظه تا یادآوری گرم برای آدم‌های مهم زندگی‌ات.</p>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>
          نام نمایشی
          <input type="text" formControlName="displayName" autocomplete="name" />
        </label>
        <label>
          ایمیل
          <input type="email" formControlName="email" autocomplete="email" />
        </label>
        <label>
          رمز عبور
          <input type="password" formControlName="password" autocomplete="new-password" />
        </label>
        @if (error()) {
          <p class="error">{{ error() }}</p>
        }
        <button class="btn primary block" type="submit" [disabled]="form.invalid || busy()">
          ثبت‌نام
        </button>
      </form>
      <p class="switch">
        حساب داری؟
        <a routerLink="/login">ورود</a>
      </p>
    </section>
  `,
  styles: `
    .auth-shell {
      max-width: 26rem;
      margin: 0 auto;
      padding: 3.5rem 1.25rem 2rem;
    }
    .brand {
      font-family: var(--font-display);
      font-size: clamp(2.4rem, 8vw, 3.2rem);
      color: var(--rose);
      margin: 0 0 0.75rem;
    }
    h1 {
      margin: 0 0 0.4rem;
      font-size: 1.35rem;
    }
    .lead {
      margin: 0 0 1.75rem;
      color: color-mix(in srgb, var(--ink) 70%, transparent);
      line-height: 1.7;
    }
    form {
      display: grid;
      gap: 0.9rem;
    }
    .switch {
      margin-top: 1.25rem;
      text-align: center;
    }
  `,
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly productName = environment.productName;
  readonly busy = signal(false);
  readonly error = signal('');

  readonly form = this.fb.nonNullable.group({
    displayName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.busy.set(true);
    this.error.set('');
    try {
      const v = this.form.getRawValue();
      await this.auth.register(v.displayName, v.email, v.password);
      await this.router.navigateByUrl('/dashboard');
    } catch {
      this.error.set('ثبت‌نام انجام نشد. ایمیل را بررسی کن.');
    } finally {
      this.busy.set(false);
    }
  }
}
