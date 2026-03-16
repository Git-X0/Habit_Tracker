import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Habit } from '../habit.model';
import { HabitComponent } from '../habit/habit';

@Component({
  selector: 'app-habits-list',
  standalone: true,
  imports: [CommonModule, HabitComponent],
  templateUrl: './habits-list.html',
  styleUrl: './habits-list.scss',
})
export class HabitsListComponent {
  @Input() habits: Habit[] = [];
}
