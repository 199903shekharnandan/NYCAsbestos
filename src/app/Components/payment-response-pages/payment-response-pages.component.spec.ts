import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentResponsePagesComponent } from './payment-response-pages.component';

describe('PaymentResponsePagesComponent', () => {
  let component: PaymentResponsePagesComponent;
  let fixture: ComponentFixture<PaymentResponsePagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentResponsePagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentResponsePagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
