import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthUser } from '../../shared/models/person';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly base = `${environment.apiBaseUrl}/api/auth`;

  readonly user = signal<AuthUser | null>(null);
  readonly loading = signal(false);
  readonly ready = signal(false);
  readonly isAuthenticated = computed(() => !!this.user());

  async bootstrap(): Promise<void> {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(
        this.http.get<{ user: AuthUser }>(`${this.base}/me`, { withCredentials: true }),
      );
      this.user.set(res.user);
    } catch {
      this.user.set(null);
    } finally {
      this.loading.set(false);
      this.ready.set(true);
    }
  }

  async register(displayName: string, email: string, password: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<{ user: AuthUser }>(
        `${this.base}/register`,
        { displayName, email, password },
        { withCredentials: true },
      ),
    );
    this.user.set(res.user);
  }

  async login(email: string, password: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<{ user: AuthUser }>(
        `${this.base}/login`,
        { email, password },
        { withCredentials: true },
      ),
    );
    this.user.set(res.user);
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`${this.base}/logout`, {}, { withCredentials: true }));
    } finally {
      this.user.set(null);
      await this.router.navigateByUrl('/login');
    }
  }
}
