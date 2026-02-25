import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HabitComponent } from './habit/habit';
import { Habit } from './habit.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HabitComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'Habit-Tracker';

  mockHabit: Habit = {
    id: 0,
    name: 'Read a book',
    type: 'positive',
    color: '#00ff00',
    history: [],
    streak: 0,
  };
}
