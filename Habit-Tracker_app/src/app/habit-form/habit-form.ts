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

  habitForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    type: new FormControl<HabitType>('positive', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  constructor(private dataService: DataService) {}

  onSubmit() {
    if (this.habitForm.valid) {
      const { name, description, type } = this.habitForm.getRawValue();
      this.dataService.addHabit({
        name: name!,
        description: description ?? '',
        type: type,
      });
      this.habitForm.reset({ name: '', description: '', type: 'positive' });
      this.close();
    }
  }

  close() {
    this.formClosed.emit();
  }
}
