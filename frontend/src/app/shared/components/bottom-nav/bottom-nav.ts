import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bottom-nav" aria-label="ناوبری اصلی">
      <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
        <span class="icon" aria-hidden="true">⌂</span>
        <span>خانه</span>
      </a>
      <a routerLink="/people" routerLinkActive="active" class="nav-item">
        <span class="icon" aria-hidden="true">♡</span>
        <span>افراد</span>
      </a>
      <a routerLink="/people/new" class="nav-item cta" aria-label="افزودن فرد">
        <span class="plus">+</span>
      </a>
      <a routerLink="/settings" routerLinkActive="active" class="nav-item">
        <span class="icon" aria-hidden="true">⚙</span>
        <span>تنظیمات</span>
      </a>
    </nav>
  `,
  styles: `
    .bottom-nav {
      position: fixed;
      inset-inline: 0;
      bottom: 0;
      z-index: 40;
      display: grid;
      grid-template-columns: 1fr 1fr auto 1fr;
      gap: 0.25rem;
      align-items: end;
      padding: 0.5rem 1rem calc(0.5rem + env(safe-area-inset-bottom));
      background: color-mix(in srgb, var(--paper) 92%, transparent);
      backdrop-filter: blur(10px);
      border-top: 1px solid color-mix(in srgb, var(--ink) 8%, transparent);
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.15rem;
      padding: 0.35rem;
      color: color-mix(in srgb, var(--ink) 55%, transparent);
      text-decoration: none;
      font-size: 0.75rem;
      transition: color 160ms ease, transform 160ms ease;
    }
    .nav-item.active {
      color: var(--rose);
      font-weight: 600;
    }
    .nav-item .icon {
      font-size: 1.15rem;
      line-height: 1;
    }
    .cta {
      width: 3.25rem;
      height: 3.25rem;
      border-radius: 50%;
      background: linear-gradient(145deg, var(--rose), var(--apricot));
      color: white;
      justify-content: center;
      box-shadow: 0 8px 20px color-mix(in srgb, var(--rose) 35%, transparent);
      transform: translateY(-0.55rem);
    }
    .cta:active {
      transform: translateY(-0.55rem) scale(0.96);
    }
    .plus {
      font-size: 1.75rem;
      line-height: 1;
      font-weight: 300;
    }
  `,
})
export class BottomNavComponent {}
