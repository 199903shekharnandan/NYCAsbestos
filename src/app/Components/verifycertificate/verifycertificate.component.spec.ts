import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifycertificateComponent } from './verifycertificate.component';

describe('VerifycertificateComponent', () => {
  let component: VerifycertificateComponent;
  let fixture: ComponentFixture<VerifycertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifycertificateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifycertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
