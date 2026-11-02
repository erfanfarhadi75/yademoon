import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { IconComponent } from '../../../shared/components/icon/icon';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, IconComponent],
  template: `
    <section class="scene scene--auth auth-page">
      <div class="auth-shell page-panel fade-up">
        <p class="brand">{{ productName }}</p>
        <h1>خوش اومدی</h1>
        <p class="lead">وارد شو تا تولد عزیزانت رو از دست ندی.</p>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <label>
            ایمیل
            <input type="email" formControlName="email" autocomplete="email" />
          </label>
          <label>
            رمز عبور
            <input type="password" formControlName="password" autocomplete="current-password" />
          </label>
          @if (error()) {
            <p class="error">{{ error() }}</p>
          }
          <button class="btn primary block" type="submit" [disabled]="form.invalid || busy()">
            <app-icon name="login" [size]="18" />
            ورود
          </button>
        </form>
        <p class="switch">
          حساب نداری؟
          <a routerLink="/register">ثبت‌نام</a>
        </p>
      </div>
    </section>
  `,
  styles: `
    .auth-page {
      display: grid;
      place-items: center;
      padding: 1.5rem 1.1rem 2rem;
    }
    .auth-shell {
      width: min(100%, 24.5rem);
    }
    .brand {
      font-family: var(--font-display);
      font-size: clamp(2.35rem, 8vw, 3rem);
      color: var(--rose);
      margin: 0 0 0.55rem;
      letter-spacing: -0.02em;
    }
    h1 {
      margin: 0 0 0.35rem;
      font-size: 1.25rem;
      font-weight: 600;
    }
    .lead {
      margin: 0 0 1.25rem;
      color: color-mix(in srgb, var(--ink) 70%, transparent);
      line-height: 1.65;
      font-size: 0.95rem;
    }
    form {
      display: grid;
      gap: 0.8rem;
    }
    .switch {
      margin-top: 1rem;
      text-align: center;
      font-size: 0.95rem;
    }
  `,
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly productName = environment.productName;
  readonly busy = signal(false);
  readonly error = signal('');

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.busy.set(true);
    this.error.set('');
    try {
      const { email, password } = this.form.getRawValue();
      await this.auth.login(email, password);
      await this.router.navigateByUrl('/dashboard');
    } catch {
      this.error.set('ایمیل یا رمز عبور اشتباه است.');
    } finally {
      this.busy.set(false);
    }
  }
}
