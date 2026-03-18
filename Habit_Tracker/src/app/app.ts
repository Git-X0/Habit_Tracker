import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HabitsTabComponent } from './habits-tab/habits-tab';
import { HabitFormComponent } from './habit-form/habit-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatTabsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    HabitsTabComponent,
    HabitFormComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  title = 'Habit Tracker';
  showAddHabitForm = false;

  toggleHabitForm(show: boolean) {
    this.showAddHabitForm = show;
  }
}
