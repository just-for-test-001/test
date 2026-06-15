import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, tap } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly http = inject(HttpClient);
  private readonly translateService = inject(TranslateService);

  /**
   * Fetches translation JSON and loads it into the ngx-translate store.
   * The locale key is formed as `${banner}_${language}` (e.g. "frx_fr").
   * Translations are merged with any existing translations for that locale.
   * Returns a shared Observable so multiple subscribers reuse the same HTTP request.
   */
  loadTranslations(
    banner: string,
    language: string,
  ): Observable<Record<string, string>> {
    const langKey = `${banner}_${language}`;
    return this.http
      .get<Record<string, string>>(`assets/i18n/${langKey}.json`)
      .pipe(
        tap((translations) => {
          this.translateService.setTranslation(langKey, translations, true);
        }),
        shareReplay(1),
      );
  }
}
