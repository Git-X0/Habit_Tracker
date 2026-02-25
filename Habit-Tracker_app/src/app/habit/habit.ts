import { Component, Input } from '@angular/core';

import { Habit } from '../habit.model';

@Component({
  selector: 'app-habit',
  imports: [],
  templateUrl: './habit.html',
  styleUrl: './habit.scss',
})
export class HabitComponent {
  @Input() habit: Habit | null = null;
}
