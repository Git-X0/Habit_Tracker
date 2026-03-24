import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitCalendar } from './habit-calendar';

describe('HabitCalendar', () => {
  let component: HabitCalendar;
  let fixture: ComponentFixture<HabitCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
