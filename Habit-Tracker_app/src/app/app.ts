import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Habit } from './habit.model';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatTableModule,
    MatCardModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'Habit-Tracker';
  displayedColumns: string[] = ['habitType', 'habitText'];
  showPositiveHabits: boolean = false;

  habitForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    type: new FormControl('positive'),
  });

  habitsList: Array<Habit> = [
    {
      id: 0,
      name: 'Read a book',
      type: 'positive',
      description: 'Mock... This is a description of a good habit',
      color: '#00ff00',
      history: [],
      streak: 0,
    },
    {
      id: 1,
      name: "Don't eating junk food",
      type: 'negative',
      description: 'Mock... This is a description of a bad habit',
      color: '#9c1f00',
      history: [],
      streak: 0,
    },
  ];
  habitsListPositive: Array<Habit> = this.habitsList.filter(
    (habit) => habit.type === 'positive',
  );
  habitsListNegative: Array<Habit> = this.habitsList.filter(
    (habit) => habit.type === 'negative',
  );

  toggleHabitType() {
    this.showPositiveHabits = !this.showPositiveHabits;
  }

  onSubmit() {
    if (this.habitForm.valid) {
      const newHabit: Habit = {
        id: this.habitsList.length,
        name: this.habitForm.value.name!,
        description: this.habitForm.value.description!,
        type: this.habitForm.value.type!,
        color: this.habitForm.value.type === 'positive' ? '#00ff00' : '#9c1f00',
        history: [],
        streak: 0,
      };
      this.habitsList.push(newHabit);
      this.habitsListPositive = this.habitsList.filter(
        (habit) => habit.type === 'positive',
      );
      this.habitsListNegative = this.habitsList.filter(
        (habit) => habit.type === 'negative',
      );
      this.habitForm.reset({ name: '', description: '', type: 'positive' });
    }
  }
}
