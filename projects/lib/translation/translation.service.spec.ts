import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;
  let httpMock: HttpTestingController;
  let translateService: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        TranslationService,
        provideTranslateService(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    service = TestBed.inject(TranslationService);
    httpMock = TestBed.inject(HttpTestingController);
    translateService = TestBed.inject(TranslateService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch translations and load them into the translate store', (done) => {
    const mockTranslations = { welcome: 'Bonjour', goodbye: 'Au revoir' };

    service.loadTranslations('frx', 'fr').subscribe((translations) => {
      expect(translations).toEqual(mockTranslations);

      translateService.use('frx_fr').subscribe(() => {
        expect(translateService.instant('welcome')).toBe('Bonjour');
        expect(translateService.instant('goodbye')).toBe('Au revoir');
        done();
      });
    });

    const req = httpMock.expectOne('assets/i18n/frx_fr.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockTranslations);
  });

  it('should build correct URL from banner and language', (done) => {
    service.loadTranslations('gyw', 'de').subscribe(() => done());

    const req = httpMock.expectOne('assets/i18n/gyw_de.json');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should allow banner and language to differ', (done) => {
    service.loadTranslations('cnd', 'en').subscribe(() => done());

    const req = httpMock.expectOne('assets/i18n/cnd_en.json');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should propagate HTTP errors', (done) => {
    service.loadTranslations('xx', 'xx').subscribe({
      error: (err) => {
        expect(err.status).toBe(404);
        done();
      },
    });

    const req = httpMock.expectOne('assets/i18n/xx_xx.json');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('should share the same HTTP request across multiple subscribers via shareReplay', () => {
    const mockTranslations = { title: 'Hello' };
    let firstResult: Record<string, string> | undefined;
    let secondResult: Record<string, string> | undefined;

    const translation$ = service.loadTranslations('cnd', 'en');

    translation$.subscribe((t) => (firstResult = t));
    translation$.subscribe((t) => (secondResult = t));

    const req = httpMock.expectOne('assets/i18n/cnd_en.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockTranslations);

    expect(firstResult).toEqual(mockTranslations);
    expect(secondResult).toEqual(mockTranslations);

    httpMock.verify();
  });

  it('should merge translations with existing ones in the store', (done) => {
    const initialTranslations = { title: 'Existing' };
    const newTranslations = { subtitle: 'New' };

    translateService.setTranslation('cnd_en', initialTranslations);

    service.loadTranslations('cnd', 'en').subscribe(() => {
      translateService.use('cnd_en').subscribe(() => {
        expect(translateService.instant('title')).toBe('Existing');
        expect(translateService.instant('subtitle')).toBe('New');
        done();
      });
    });

    const req = httpMock.expectOne('assets/i18n/cnd_en.json');
    req.flush(newTranslations);
  });
});
