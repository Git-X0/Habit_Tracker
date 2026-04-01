import {
  Component,
  inject,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../data.service';
import { Habit } from '../habit.model';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-import-stepper',
  standalone: true,
  imports: [
    MatStepperModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './import-stepper.html',
  styleUrl: './import-stepper.scss',
})
export class ImportStepperComponent {
  @Output() stepperClosed = new EventEmitter<void>();
  dataService = inject(DataService);

  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  selectedOption = 'merge';
  parsedHabits: Habit[] = [];
  currentHabits: Habit[] = [];
  newHabitsCount = 0;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse((e.target as FileReader).result as string);
        this.parsedHabits = (json as any[]).map((raw) => ({
          ...raw,
          history: (raw.history || [])
            .map((s: string) => new Date(s))
            .filter((d: Date) => !isNaN(d.getTime())),
          id: raw.id || Math.random().toString(36).substring(2),
        })) as Habit[];
        this.currentHabits = this.dataService.getCurrentHabits();
        this.updateCount();
        this.stepper.next();
      } catch {
        alert('Chybný JSON');
        this.stepper.reset();
      }
    };
    reader.readAsText(file);
  }

  onOptionChange() {
    this.updateCount();
  }

  private updateCount() {
    if (this.selectedOption === 'merge') {
      this.newHabitsCount = this.parsedHabits.filter(
        (h) =>
          !this.currentHabits.some(
            (c) => c.name.toLowerCase() === h.name.toLowerCase(),
          ),
      ).length;
    } else {
      this.newHabitsCount = this.parsedHabits.length;
    }
  }

  finishImport() {
    let updated: Habit[];
    if (this.selectedOption === 'merge') {
      const newOnes = this.parsedHabits.filter(
        (h) =>
          !this.currentHabits.some(
            (c) => c.name.toLowerCase() === h.name.toLowerCase(),
          ),
      );
      updated = [...this.currentHabits, ...newOnes];
    } else {
      updated = this.parsedHabits;
    }
    this.dataService.updateAllHabits(updated);
    this.stepperClosed.emit();
    this.stepper.reset();
  }
}
