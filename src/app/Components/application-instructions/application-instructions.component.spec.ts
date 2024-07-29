import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationInstructionsComponent } from './application-instructions.component';

describe('ApplicationInstructionsComponent', () => {
  let component: ApplicationInstructionsComponent;
  let fixture: ComponentFixture<ApplicationInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationInstructionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
