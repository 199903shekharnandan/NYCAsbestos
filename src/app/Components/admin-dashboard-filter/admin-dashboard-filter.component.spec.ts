import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardFilterComponent } from './admin-dashboard-filter.component';

describe('AdminDashboardFilterComponent', () => {
  let component: AdminDashboardFilterComponent;
  let fixture: ComponentFixture<AdminDashboardFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
