import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleRescheduleComponent } from './schedule-reschedule.component';

describe('ScheduleRescheduleComponent', () => {
  let component: ScheduleRescheduleComponent;
  let fixture: ComponentFixture<ScheduleRescheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleRescheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleRescheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
