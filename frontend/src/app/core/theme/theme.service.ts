import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

export type ThemeMode = 'light' | 'dark';
export type ColorPalette = 'rose' | 'coral' | 'honey' | 'sage';

export interface PaletteOption {
  id: ColorPalette;
  label: string;
  swatch: string;
  secondary: string;
}

const THEME_KEY = 'yademoon.theme';
const PALETTE_KEY = 'yademoon.palette';

export const PALETTE_OPTIONS: PaletteOption[] = [
  { id: 'rose', label: 'رز و زردآلو', swatch: '#c45c6a', secondary: '#e8a87c' },
  { id: 'coral', label: 'مرجان', swatch: '#d46a5c', secondary: '#f0a07a' },
  { id: 'honey', label: 'عسلی', swatch: '#c48a3a', secondary: '#e8c07a' },
  { id: 'sage', label: 'زیتونی', swatch: '#6f8f6a', secondary: '#c4b48a' },
];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly doc = inject(DOCUMENT);
  readonly mode = signal<ThemeMode>(this.readTheme());
  readonly palette = signal<ColorPalette>(this.readPalette());
  readonly palettes = PALETTE_OPTIONS;

  constructor() {
    effect(() => {
      const mode = this.mode();
      const palette = this.palette();
      this.apply(mode, palette);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(THEME_KEY, mode);
        localStorage.setItem(PALETTE_KEY, palette);
      }
    });
  }

  toggle(): void {
    this.mode.update((m) => (m === 'light' ? 'dark' : 'light'));
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
  }

  setPalette(palette: ColorPalette): void {
    this.palette.set(palette);
  }

  private readTheme(): ThemeMode {
    if (!isPlatformBrowser(this.platformId)) return 'light';
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    return mq?.matches ? 'dark' : 'light';
  }

  private readPalette(): ColorPalette {
    if (!isPlatformBrowser(this.platformId)) return 'rose';
    const stored = localStorage.getItem(PALETTE_KEY);
    if (stored === 'rose' || stored === 'coral' || stored === 'honey' || stored === 'sage') {
      return stored;
    }
    return 'rose';
  }

  private apply(mode: ThemeMode, palette: ColorPalette): void {
    const root = this.doc.documentElement;
    root.dataset['theme'] = mode;
    root.dataset['palette'] = palette;
    root.style.colorScheme = mode;
  }
}
