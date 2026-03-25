import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { Habit, HabitType } from './habit.model';
import { RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from './data.service';
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
  private dataService = inject(DataService);
  @ViewChild('csvInput') csvInput!: ElementRef<HTMLInputElement>;

  toggleHabitForm(show: boolean) {
    this.showAddHabitForm = show;
  }

  loadDemoHabits() {
    this.dataService.resetToDemo();
  }

  triggerFileInput() {
    this.csvInput?.nativeElement.click();
  }

  exportAllToCsv() {
    this.dataService
      .getHabits()
      .pipe(take(1))
      .subscribe((habits: Habit[]) => {
        const header = 'Name,Type,Description,Streak,History\\n';
        const rows = habits
          .map((habit) => {
            const historyCsv = habit.history
              .map((d) => d.toISOString().split('T')[0])
              .join(',');
            return `"${habit.name.replace(/"/g, '""')}","${habit.type}","${habit.description.replace(/"/g, '""')}",${habit.streak},"${historyCsv}"`;
          })
          .join('\\n');
        const csvContent = header + rows;
        const blob = new Blob([csvContent], {
          type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = 'habit-tracker-all-habits.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
  }

  importFromCsv(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = (e.target?.result as string) || '';
      const lines = csv
        .split(/\\r?\\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length === 0 || !lines[0].includes('Name,Type')) {
        alert('Invalid CSV header!');
        return;
      }
      const currentHabits = this.dataService.getCurrentHabits();
      const importedHabits: Habit[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;
        // Simple CSV parse assuming quoted fields, no embedded commas
        const cols = line.split('","');
        if (cols.length !== 5) continue;
        let name = cols[0].replace(/^"/, '').replace(/"$/, '');
        const type = cols[1].replace(/^"/, '').replace(/"$/, '') as HabitType;
        let description = cols[2].replace(/^"/, '').replace(/"$/, '');
        const streakStr = cols[3].replace(/^"/, '').replace(/"$/, '');
        let historyStr = cols[4].replace(/^"/, '').replace(/"$/, '');
        name = name.replace(/""/g, '"');
        description = description.replace(/""/g, '"');
        historyStr = historyStr.replace(/""/g, '"');
        const streak = parseInt(streakStr, 10) || 0;
        const history = historyStr
          .split(',')
          .map((dateStr) => {
            const trimmed = dateStr.trim();
            if (!trimmed) return new Date(0); // Invalid
            const date = new Date(trimmed);
            return isNaN(date.getTime()) ? new Date(0) : date;
          })
          .filter((date) => date.getTime() > 0);
        const newHabit: Habit = {
          id: Math.random().toString(36).substring(2, 15),
          name,
          type,
          description,
          streak,
          history,
        };
        if (
          !currentHabits.some(
            (existing: Habit) =>
              existing.name.toLowerCase() === newHabit.name.toLowerCase(),
          )
        ) {
          importedHabits.push(newHabit);
        }
      }
      if (importedHabits.length > 0) {
        const updatedHabits = [...currentHabits, ...importedHabits];
        this.dataService.updateAllHabits(updatedHabits);
        localStorage.setItem('habits', JSON.stringify(updatedHabits));
        alert(`Successfully merged ${importedHabits.length} new habits!`);
      } else {
        alert('No new habits found (all names already exist).');
      }
      input.value = '';
    };
    reader.readAsText(file, 'UTF-8');
  }
}
