import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Habit } from '../habit.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HabitCalendar } from '../habit-calendar/habit-calendar';
import { HabitGraph } from '../habit-graph/habit-graph';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-habit',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    HabitCalendar,
    HabitGraph,
  ],
  templateUrl: './habit.html',
  styleUrl: './habit.scss',
})
export class HabitComponent {
  @Input({ required: true }) habit!: Habit;
  @Output() delete = new EventEmitter<void>();
  @Output() update = new EventEmitter<Habit>();

  showHistory = false;

  onDelete() {
    this.delete.emit();
  }

  toggleHistory() {
    this.showHistory = !this.showHistory;
  }

  markAsDone() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isAlreadyDoneToday = this.habit.history.some(
      (d) => new Date(d).setHours(0, 0, 0, 0) === today.getTime(),
    );

    if (isAlreadyDoneToday) {
      return; // Already done today, do nothing
    }

    const updatedHistory = [...this.habit.history, today];
    const newStreak = this.calculateStreak(updatedHistory);

    const updatedHabit: Habit = {
      ...this.habit,
      history: updatedHistory,
      streak: newStreak,
    };
    this.update.emit(updatedHabit);
  }

  private calculateStreak(dates: Date[]): number {
    if (dates.length === 0) {
      return 0;
    }

    const dateSet = new Set(
      dates.map((d) => new Date(d).toISOString().split('T')[0]),
    );

    const sortedDates = Array.from(dateSet).sort().reverse();

    const todayString = new Date().toISOString().split('T')[0];
    if (sortedDates[0] !== todayString) {
      // This case should mean a new streak starts today.
      // Since markAsDone just added today, the streak is 1.
      return 1;
    }

    let streak = 0;
    let expectedDate = new Date();

    for (const dateStr of sortedDates) {
      const expectedDateStr = expectedDate.toISOString().split('T')[0];
      if (dateStr === expectedDateStr) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break; // Found a gap
      }
    }
    return streak;
  }
}
