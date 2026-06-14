import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly http = inject(HttpClient);

  loadTranslation(
    banner: string,
    language: string,
  ): Observable<Record<string, string>> {
    return this.http
      .get<Record<string, string>>(
        `assets/i18n/${banner}_${language}.json`,
      )
      .pipe(shareReplay(1));
  }
}
