import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() deleteHabit = new EventEmitter<string>();
  @Output() updateHabit = new EventEmitter<Habit>();

  onDeleteHabit(id: string) {
    this.deleteHabit.emit(id);
  }

  onUpdateHabit(habit: Habit) {
    this.updateHabit.emit(habit);
  }
}
