import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { ModalOneComponent } from './modal-one.component';

describe('ModalOneComponent', () => {
  let component: ModalOneComponent;
  let fixture: ComponentFixture<ModalOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalOneComponent],
      providers: [provideTranslateService(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
