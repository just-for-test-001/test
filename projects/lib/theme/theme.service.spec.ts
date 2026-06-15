import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        ThemeService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    service = TestBed.inject(ThemeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Clean up any CSS variables left on :root by tests
    const root = document.documentElement;
    const propertiesToRemove: string[] = [];
    for (let i = 0; i < root.style.length; i++) {
      const prop = root.style[i];
      if (prop.startsWith('--')) {
        propertiesToRemove.push(prop);
      }
    }
    for (const prop of propertiesToRemove) {
      root.style.removeProperty(prop);
    }

    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a theme and apply CSS variables to :root', (done) => {
    const mockTheme = { primary: '#4527a0', secondary: '#283593' };

    const setPropertySpy = jest.spyOn(
      document.documentElement.style,
      'setProperty',
    );

    service.loadTheme('cnd').subscribe((theme) => {
      expect(theme).toEqual(mockTheme);

      expect(setPropertySpy).toHaveBeenCalledWith('--primary', '#4527a0');
      expect(setPropertySpy).toHaveBeenCalledWith('--secondary', '#283593');
      expect(setPropertySpy).toHaveBeenCalledTimes(2);

      setPropertySpy.mockRestore();
      done();
    });

    const req = httpMock.expectOne('assets/themes/cnd.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockTheme);
  });

  it('should remove previous theme variables when loading a new theme', (done) => {
    const firstTheme = { primary: '#ff0000', accent: '#00ff00' };
    const secondTheme = { primary: '#0000ff' };

    const removePropertySpy = jest.spyOn(
      document.documentElement.style,
      'removeProperty',
    );

    service.loadTheme('frx').subscribe(() => {
      service.loadTheme('gyw').subscribe(() => {
        // Should have removed --primary and --accent from first theme
        expect(removePropertySpy).toHaveBeenCalledWith('--primary');
        expect(removePropertySpy).toHaveBeenCalledWith('--accent');
        removePropertySpy.mockRestore();
        done();
      });

      const req2 = httpMock.expectOne('assets/themes/gyw.json');
      req2.flush(secondTheme);
    });

    const req1 = httpMock.expectOne('assets/themes/frx.json');
    req1.flush(firstTheme);
  });

  it('should build correct URL from banner', (done) => {
    service.loadTheme('frx').subscribe(() => done());

    const req = httpMock.expectOne('assets/themes/frx.json');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should build correct URL for gyw banner', (done) => {
    service.loadTheme('gyw').subscribe(() => done());

    const req = httpMock.expectOne('assets/themes/gyw.json');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('should not remove properties on first load', (done) => {
    const removePropertySpy = jest.spyOn(
      document.documentElement.style,
      'removeProperty',
    );

    service.loadTheme('cnd').subscribe(() => {
      expect(removePropertySpy).not.toHaveBeenCalled();
      removePropertySpy.mockRestore();
      done();
    });

    const req = httpMock.expectOne('assets/themes/cnd.json');
    req.flush({ primary: '#4527a0' });
  });

  it('should propagate HTTP errors', (done) => {
    service.loadTheme('xx').subscribe({
      error: (err) => {
        expect(err.status).toBe(404);
        done();
      },
    });

    const req = httpMock.expectOne('assets/themes/xx.json');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('should share the same HTTP request across multiple subscribers via shareReplay', () => {
    const mockTheme = { primary: '#e65100' };
    let firstResult: Record<string, string> | undefined;
    let secondResult: Record<string, string> | undefined;

    const theme$ = service.loadTheme('frx');

    theme$.subscribe((t) => (firstResult = t));
    theme$.subscribe((t) => (secondResult = t));

    const req = httpMock.expectOne('assets/themes/frx.json');
    req.flush(mockTheme);

    expect(firstResult).toEqual(mockTheme);
    expect(secondResult).toEqual(mockTheme);

    httpMock.verify();
  });

  it('should apply all theme properties as CSS variables', (done) => {
    const fullTheme = {
      primary: '#00695c',
      primaryLight: '#26a69a',
      primaryDark: '#004d40',
      secondary: '#00838f',
      accent: '#00acc1',
      background: '#f0faf8',
      surface: '#ffffff',
      error: '#c62828',
      onPrimary: '#ffffff',
      onSecondary: '#ffffff',
      onBackground: '#1b3530',
      onSurface: '#1b3530',
      border: '#80cbc4',
      textPrimary: '#1b3530',
      textSecondary: '#607d8b',
    };

    const setPropertySpy = jest.spyOn(
      document.documentElement.style,
      'setProperty',
    );

    service.loadTheme('gyw').subscribe(() => {
      expect(setPropertySpy).toHaveBeenCalledTimes(
        Object.keys(fullTheme).length,
      );

      for (const [key, value] of Object.entries(fullTheme)) {
        expect(setPropertySpy).toHaveBeenCalledWith(`--${key}`, value);
      }

      setPropertySpy.mockRestore();
      done();
    });

    const req = httpMock.expectOne('assets/themes/gyw.json');
    req.flush(fullTheme);
  });
});
