import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamDateManagementComponent } from './exam-date-management.component';

describe('ExamDateManagementComponent', () => {
  let component: ExamDateManagementComponent;
  let fixture: ComponentFixture<ExamDateManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamDateManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamDateManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
