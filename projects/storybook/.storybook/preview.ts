import { inject, provideAppInitializer } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  provideTranslateService,
  TranslateService,
} from '@ngx-translate/core';
import { applicationConfig, type Preview } from '@storybook/angular';
import { BehaviorSubject } from 'rxjs';

import { TranslationService } from '../../lib/translation/public-api';
import { ThemeService } from '../../lib/theme/public-api';

const locale$ = new BehaviorSubject<string>('frx_fr');

const preview: Preview = {
  globalTypes: {
    locale: {
      name: 'Locale',
      description: 'Translation locale',
      defaultValue: 'frx_fr',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'frx_fr', title: 'FRX - Français' },
          { value: 'cnd_en', title: 'CND - English' },
          { value: 'cnd_fr', title: 'CND - Français' },
          { value: 'gyw_de', title: 'GYW - Deutsch' },
        ],
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
        provideTranslateService(),
        provideAppInitializer(() => {
          const translationService = inject(TranslationService);
          const translateService = inject(TranslateService);
          const themeService = inject(ThemeService);
          locale$.subscribe((lang) => {
            const parts = lang.split('_');
            const banner = parts[0];
            const language = parts.slice(1).join('_');
            translationService
              .loadTranslations(banner, language)
              .subscribe({
                next: () => translateService.use(lang),
                error: () => {},
              });
            themeService.loadTheme(banner).subscribe({
              error: () => {},
            });
          });
        }),
      ],
    }),
    (story: any, context: any) => {
      locale$.next(context.globals['locale'] as string);
      return story();
    },
  ],
};

export default preview;
