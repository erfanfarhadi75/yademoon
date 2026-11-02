import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { BottomNavComponent } from './shared/components/bottom-nav/bottom-nav';
import { AuthService } from './core/auth/auth.service';
import { ThemeService } from './core/theme/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BottomNavComponent],
  template: `
    <div class="app-root" [class.with-nav]="showNav()">
      <router-outlet />
      @if (showNav()) {
        <app-bottom-nav />
      }
    </div>
  `,
  styles: `
    .app-root {
      min-height: 100dvh;
    }
  `,
})
export class App {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  /** Eagerly construct theme so data-theme is applied on boot. */
  private readonly theme = inject(ThemeService);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly showNav = computed(() => {
    const u = this.url();
    const authPage = u.startsWith('/login') || u.startsWith('/register');
    return this.auth.isAuthenticated() && !authPage;
  });
}
