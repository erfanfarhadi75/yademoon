import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `<div class="loading" role="status" aria-live="polite">در حال بارگذاری…</div>`,
  styles: `
    .loading {
      text-align: center;
      padding: 2rem;
      color: color-mix(in srgb, var(--ink) 60%, transparent);
      animation: pulse 1.2s ease-in-out infinite;
    }
    @keyframes pulse {
      0%,
      100% {
        opacity: 0.55;
      }
      50% {
        opacity: 1;
      }
    }
  `,
})
export class LoadingComponent {}
