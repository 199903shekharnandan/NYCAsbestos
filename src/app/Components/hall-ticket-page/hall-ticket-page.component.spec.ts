import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HallTicketPageComponent } from './hall-ticket-page.component';

describe('HallTicketPageComponent', () => {
  let component: HallTicketPageComponent;
  let fixture: ComponentFixture<HallTicketPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HallTicketPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HallTicketPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
