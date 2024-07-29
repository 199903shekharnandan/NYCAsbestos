import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsbetosCertificateComponent } from './asbetos-certificate.component';

describe('AsbetosCertificateComponent', () => {
  let component: AsbetosCertificateComponent;
  let fixture: ComponentFixture<AsbetosCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsbetosCertificateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsbetosCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
