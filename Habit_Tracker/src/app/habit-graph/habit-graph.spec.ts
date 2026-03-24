import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitGraph } from './habit-graph';

describe('HabitGraph', () => {
  let component: HabitGraph;
  let fixture: ComponentFixture<HabitGraph>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitGraph]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitGraph);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
