import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  imports: [RouterLink],
  template: `
    <div class="empty fade-up">
      @if (imageSrc()) {
        <img class="illus" [src]="imageSrc()" [alt]="imageAlt()" width="120" height="120" />
      }
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
      padding: 1.25rem 0.5rem 1.5rem;
    }
    .illus {
      width: 7rem;
      height: 7rem;
      margin: 0 auto 0.75rem;
      display: block;
      border-radius: 18px;
      object-fit: cover;
      box-shadow: 0 10px 24px color-mix(in srgb, var(--rose) 14%, transparent);
    }
    .title {
      font-family: var(--font-display);
      font-size: 1.25rem;
      margin: 0 0 0.4rem;
      color: var(--ink);
    }
    .hint {
      margin: 0 0 1rem;
      color: color-mix(in srgb, var(--ink) 65%, transparent);
      line-height: 1.7;
      font-size: 0.95rem;
    }
  `,
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly hint = input.required<string>();
  readonly ctaLabel = input<string>('');
  readonly ctaLink = input<string>('/people/new');
  readonly imageSrc = input<string>('/images/yademoon-empty-hearts.jpg');
  readonly imageAlt = input<string>('');
}
