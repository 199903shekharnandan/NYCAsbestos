import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalFormComponent } from './renewal-form.component';

describe('RenewalFormComponent', () => {
  let component: RenewalFormComponent;
  let fixture: ComponentFixture<RenewalFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewalFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenewalFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
