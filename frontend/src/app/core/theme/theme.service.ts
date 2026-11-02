import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'yademoon.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly doc = inject(DOCUMENT);
  readonly mode = signal<ThemeMode>(this.readInitial());

  constructor() {
    effect(() => {
      const mode = this.mode();
      this.apply(mode);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(STORAGE_KEY, mode);
      }
    });
  }

  toggle(): void {
    this.mode.update((m) => (m === 'light' ? 'dark' : 'light'));
  }

  set(mode: ThemeMode): void {
    this.mode.set(mode);
  }

  private readInitial(): ThemeMode {
    if (!isPlatformBrowser(this.platformId)) return 'light';
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    return mq?.matches ? 'dark' : 'light';
  }

  private apply(mode: ThemeMode): void {
    const root = this.doc.documentElement;
    root.dataset['theme'] = mode;
    root.style.colorScheme = mode;
  }
}
