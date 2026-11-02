import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  imports: [RouterLink],
  template: `
    <div class="empty fade-up">
      @if (imageSrc()) {
        <img class="illus" [src]="imageSrc()" [alt]="imageAlt()" width="220" height="220" />
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
      padding: 1.5rem 1.25rem 2.5rem;
    }
    .illus {
      width: min(220px, 70vw);
      height: auto;
      margin: 0 auto 1rem;
      display: block;
      border-radius: 24px;
      object-fit: cover;
      box-shadow: 0 18px 40px color-mix(in srgb, var(--rose) 12%, transparent);
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
  readonly imageSrc = input<string>('/images/yademoon-empty-hearts.jpg');
  readonly imageAlt = input<string>('');
}
