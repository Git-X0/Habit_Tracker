import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitsTab } from './habits-tab';

describe('HabitsTab', () => {
  let component: HabitsTab;
  let fixture: ComponentFixture<HabitsTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitsTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitsTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
