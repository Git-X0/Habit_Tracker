import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitsTabComponent } from './habits-tab';

describe('HabitsTabComponent', () => {
  let component: HabitsTabComponent;
  let fixture: ComponentFixture<HabitsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabitsTabComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HabitsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
