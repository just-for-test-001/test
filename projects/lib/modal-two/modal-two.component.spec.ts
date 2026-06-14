import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { ModalTwoComponent } from './modal-two.component';

describe('ModalTwoComponent', () => {
  let component: ModalTwoComponent;
  let fixture: ComponentFixture<ModalTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalTwoComponent],
      providers: [provideTranslateService(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
