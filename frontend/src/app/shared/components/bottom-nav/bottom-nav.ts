import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  template: `
    <nav class="bottom-nav" aria-label="ناوبری اصلی">
      <div class="side">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <app-icon name="home" [size]="20" />
          <span>خانه</span>
        </a>
        <a routerLink="/people" routerLinkActive="active" class="nav-item">
          <app-icon name="heart" [size]="20" />
          <span>افراد</span>
        </a>
      </div>

      <a routerLink="/people/new" class="cta" aria-label="افزودن فرد">
        <app-icon name="plus" [size]="26" />
      </a>

      <div class="side">
        <a routerLink="/upcoming" routerLinkActive="active" class="nav-item">
          <app-icon name="target" [size]="20" />
          <span>نزدیک</span>
        </a>
        <a routerLink="/settings" routerLinkActive="active" class="nav-item">
          <app-icon name="settings" [size]="20" />
          <span>تنظیمات</span>
        </a>
      </div>
    </nav>
  `,
  styles: `
    .bottom-nav {
      position: fixed;
      inset-inline: 0;
      bottom: 0;
      z-index: 40;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      column-gap: 0.25rem;
      min-height: 4rem;
      padding: 0.35rem 0.35rem calc(0.35rem + env(safe-area-inset-bottom));
      background: var(--nav-bg);
      backdrop-filter: blur(14px);
      border-top: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
    }
    .side {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      min-width: 0;
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.2rem;
      min-height: 2.75rem;
      padding: 0.25rem;
      color: var(--ink-muted);
      text-decoration: none;
      font-size: 0.75rem;
      transition: color 160ms ease, transform 160ms ease;
    }
    .nav-item.active {
      color: var(--rose);
      font-weight: 600;
    }
    .cta {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3.25rem;
      height: 3.25rem;
      margin-top: -1.25rem;
      border-radius: 50%;
      background: linear-gradient(145deg, var(--rose), var(--apricot));
      color: white;
      text-decoration: none;
      box-shadow: 0 8px 20px color-mix(in srgb, var(--rose) 35%, transparent);
      transition: transform 140ms ease;
    }
    .cta:active {
      transform: scale(0.96);
    }
  `,
})
export class BottomNavComponent {}
