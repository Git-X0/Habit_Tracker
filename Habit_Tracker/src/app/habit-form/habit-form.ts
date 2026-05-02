import { Component, Output, EventEmitter } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../data.service';
import { HabitType } from '../habit.model';

@Component({
  selector: 'app-habit-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatButtonModule,
  ],
  templateUrl: './habit-form.html',
  styleUrl: './habit-form.scss',
})
export class HabitFormComponent {
  @Output() formClosed = new EventEmitter<void>();

  duplicateError = '';
  validationError = '';

  habitForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    description: new FormControl('', [Validators.maxLength(25)]),
    type: new FormControl<HabitType>('positive', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  constructor(private dataService: DataService) {}

  checkDuplicate(): boolean {
    const { name, description, type } = this.habitForm.getRawValue();
    const currentHabits = this.dataService.getCurrentHabits();

    const normalizedName = name?.trim().toLowerCase() || '';
    const normalizedDesc = description?.trim().toLowerCase() || '';

    const duplicate = currentHabits.find((habit) => {
      if (habit.type !== type) return false;
      const existingName = habit.name.trim().toLowerCase();
      const existingDesc = habit.description.trim().toLowerCase();
      return existingName === normalizedName || existingDesc === normalizedDesc;
    });

    return !!duplicate;
  }

  onSubmit() {
    this.duplicateError = '';
    this.validationError = '';

    const { name, description } = this.habitForm.getRawValue();

    if (!name?.trim() || !description?.trim()) {
      this.validationError = 'Both name and description are required.';
      return;
    }

    if (this.checkDuplicate()) {
      this.duplicateError = 'You already created a habit like that.';
      return;
    }

    if (this.habitForm.valid) {
      const { type } = this.habitForm.getRawValue();
      this.dataService.addHabit({
        name: name!.trim(),
        description: description?.trim() || '',
        type: type!,
      });
      this.habitForm.reset({ name: '', description: '', type: 'positive' });
      this.close();
    }
  }

  close() {
    this.formClosed.emit();
  }
}
