import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspendOrRemovesuspendComponent } from './suspend-or-removesuspend.component';

describe('SuspendOrRemovesuspendComponent', () => {
  let component: SuspendOrRemovesuspendComponent;
  let fixture: ComponentFixture<SuspendOrRemovesuspendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuspendOrRemovesuspendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuspendOrRemovesuspendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
