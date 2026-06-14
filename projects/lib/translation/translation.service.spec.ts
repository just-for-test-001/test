import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        TranslationService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    service = TestBed.inject(TranslationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch translation via loadTranslation', (done) => {
    const mockTranslations = { welcome: 'Bonjour', goodbye: 'Au revoir' };

    service.loadTranslation('frx', 'fr').subscribe((translations) => {
      expect(translations).toEqual(mockTranslations);
      done();
    });

    const req = httpMock.expectOne('assets/i18n/frx_fr.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockTranslations);
  });

  it('should build correct URL from banner and language', (done) => {
    service.loadTranslation('gyw', 'de').subscribe(() => done());

    const req = httpMock.expectOne('assets/i18n/gyw_de.json');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should allow banner and language to differ', (done) => {
    service.loadTranslation('cnd', 'en').subscribe(() => done());

    const req = httpMock.expectOne('assets/i18n/cnd_en.json');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should propagate HTTP errors', (done) => {
    service.loadTranslation('xx', 'xx').subscribe({
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

    // Single call to loadTranslation, but subscribed to twice
    const translation$ = service.loadTranslation('cnd', 'en');

    translation$.subscribe((t) => (firstResult = t));
    translation$.subscribe((t) => (secondResult = t));

    // Only ONE HTTP request should be made
    const req = httpMock.expectOne('assets/i18n/cnd_en.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockTranslations);

    // Both subscribers get the same result
    expect(firstResult).toEqual(mockTranslations);
    expect(secondResult).toEqual(mockTranslations);

    httpMock.verify();
  });
});
