import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Habit } from './habit.model';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatTableModule, MatCardModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'Habit-Tracker';

  mockHabits: Array<Habit> = [
    {
      id: 0,
      name: 'Read a book',
      type: 'positive',
      description: 'This is a description',
      color: '#00ff00',
      history: [],
      streak: 0,
    },
    {
      id: 1,
      name: "Don\'t eating junk food",
      type: 'negative',
      description: 'This is a description',
      color: '#9c1f00',
      history: [],
      streak: 0,
    },
  ];
  dataSourcePositive: Array<Habit> = this.mockHabits.filter(
    (habit) => habit.type === 'positive',
  );
  dataSourceNegative: Array<Habit> = this.mockHabits.filter(
    (habit) => habit.type === 'negative',
  );
  displayedColumns: string[] = ['habitType', 'habitText'];

  //for loop
}
