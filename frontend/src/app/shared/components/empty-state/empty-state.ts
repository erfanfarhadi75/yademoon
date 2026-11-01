import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  imports: [RouterLink],
  template: `
    <div class="empty fade-up">
      <p class="title">{{ title() }}</p>
      <p class="hint">{{ hint() }}</p>
      @if (ctaLabel()) {
        <a class="btn primary" [routerLink]="ctaLink()">{{ ctaLabel() }}</a>
      }
    </div>
  `,
  styles: `
    .empty {
      text-align: center;
      padding: 2.5rem 1.25rem;
    }
    .title {
      font-family: var(--font-display);
      font-size: 1.35rem;
      margin: 0 0 0.5rem;
      color: var(--ink);
    }
    .hint {
      margin: 0 0 1.25rem;
      color: color-mix(in srgb, var(--ink) 65%, transparent);
      line-height: 1.7;
    }
  `,
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly hint = input.required<string>();
  readonly ctaLabel = input<string>('');
  readonly ctaLink = input<string>('/people/new');
}
