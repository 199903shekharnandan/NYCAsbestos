import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateFormComponent } from './duplicate-form.component';

describe('DuplicateFormComponent', () => {
  let component: DuplicateFormComponent;
  let fixture: ComponentFixture<DuplicateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuplicateFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuplicateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
