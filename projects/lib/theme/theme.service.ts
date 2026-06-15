import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly http = inject(HttpClient);

  private appliedKeys: string[] = [];

  /**
   * Fetches a theme JSON file and injects its color values as CSS custom
   * properties on `:root`. Each key in the JSON becomes `--{key}`.
   * Previous theme variables are removed before applying the new theme.
   * Returns a shared Observable so multiple subscribers reuse the same
   * HTTP request.
   */
  loadTheme(banner: string): Observable<Record<string, string>> {
    return this.http
      .get<Record<string, string>>(`assets/themes/${banner}.json`)
      .pipe(
        tap((theme) => this.applyTheme(theme)),
        shareReplay(1),
      );
  }

  private applyTheme(theme: Record<string, string>): void {
    const root = document.documentElement;

    // Remove previously applied CSS variables
    for (const key of this.appliedKeys) {
      root.style.removeProperty(`--${key}`);
    }

    // Apply new CSS variables
    const keys = Object.keys(theme);
    for (const key of keys) {
      root.style.setProperty(`--${key}`, theme[key]);
    }

    this.appliedKeys = keys;
  }
}
