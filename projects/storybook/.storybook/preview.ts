import { HttpClient, provideHttpClient } from '@angular/common/http';
import { ENVIRONMENT_INITIALIZER, inject } from '@angular/core';
import {
  provideTranslateService,
  TranslateLoader,
  TranslateService,
} from '@ngx-translate/core';
import { applicationConfig, type Preview } from '@storybook/angular';
import { BehaviorSubject, distinctUntilChanged, skip } from 'rxjs';

const LOCALES = [
  { value: 'frx_fr', title: 'FRX - Français' },
  { value: 'cnd_en', title: 'CND - English' },
  { value: 'cnd_fr', title: 'CND - Français' },
  { value: 'gyw_de', title: 'GYW - Deutsch' },
] as const;

const locale$ = new BehaviorSubject<string>('frx_fr');

const preview: Preview = {
  globalTypes: {
    locale: {
      name: 'Locale',
      description: 'Translation locale',
      defaultValue: 'frx_fr',
      toolbar: {
        icon: 'globe',
        items: LOCALES.map((l) => ({ value: l.value, title: l.title })),
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    applicationConfig({
      providers: [
        provideHttpClient(),
        provideTranslateService({
          lang: 'frx_fr',
          loader: {
            provide: TranslateLoader,
            useFactory: (http: HttpClient) => ({
              getTranslation: (lang: string) =>
                http.get<Record<string, string>>(`assets/i18n/${lang}.json`),
            }),
            deps: [HttpClient],
          },
        }),
        {
          provide: ENVIRONMENT_INITIALIZER,
          multi: true,
          useFactory: () => {
            const translateService = inject(TranslateService);
            return () => {
              locale$
                .pipe(distinctUntilChanged(), skip(1))
                .subscribe((lang) => {
                  translateService.use(lang).subscribe({
                    error: () => {},
                  });
                });
            };
          },
        },
      ],
    }),
    (story, context) => {
      locale$.next(context.globals['locale'] as string);
      return story();
    },
  ],
};

export default preview;
