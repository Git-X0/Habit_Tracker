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
import { ImportStepperComponent } from './import-stepper/import-stepper';

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
    ImportStepperComponent,
  ],

  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  title = 'Habit Tracker';

  showAddHabitForm = false;
  showImportStepper = false;
  private dataService = inject(DataService);

  @ViewChild('jsonInput') jsonInput!: ElementRef<HTMLInputElement>;

  toggleHabitForm(show: boolean) {
    this.showAddHabitForm = show;
  }

  toggleImportStepper(show: boolean) {
    this.showImportStepper = show;
  }

  loadDemoHabits() {
    this.dataService.resetToDemo();
  }

  triggerFileInput() {
    this.jsonInput?.nativeElement.click();
  }

  exportAllToJson() {
    const habits = this.dataService.getCurrentHabits();
    const jsonStr = JSON.stringify(habits, null, 2);
    const blob = new Blob([jsonStr], {
      type: 'application/json;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'habit-tracker-all-habits.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  importFromJson(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonHabits = JSON.parse(e.target?.result as string);
        if (!Array.isArray(jsonHabits)) {
          alert('Neplatný JSON - musí být pole návyku');
          return;
        }
        const currentHabits = this.dataService.getCurrentHabits();
        const importedHabits: Habit[] = [];
        for (const rawHabit of jsonHabits) {
          const habit: Habit = {
            ...rawHabit,
            history: rawHabit.history
              .map((dStr: string) => new Date(dStr))
              .filter((d: Date) => !isNaN(d.getTime())),
          };
          if (
            !currentHabits.some(
              (h) => h.name.toLowerCase() === habit.name.toLowerCase(),
            )
          ) {
            habit.id = Math.random().toString(36).substring(2, 15);
            importedHabits.push(habit);
          }
        }
        if (importedHabits.length > 0) {
          const updatedHabits = [...currentHabits, ...importedHabits];
          this.dataService.updateAllHabits(updatedHabits);
          alert(`Naimportováno ${importedHabits.length} nových návyku!`);
        } else {
          alert('Žádné nové návyky k přidání (jména duplicitní).');
        }
      } catch {
        alert('Chybný JSON soubor.');
      }
      input.value = '';
    };
    reader.readAsText(file);
  }
}
