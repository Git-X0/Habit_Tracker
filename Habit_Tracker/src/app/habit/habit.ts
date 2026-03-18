import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Habit } from '../habit.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-habit',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './habit.html',
  styleUrl: './habit.scss',
})
export class HabitComponent {
  @Input({ required: true }) habit!: Habit;
  @Output() delete = new EventEmitter<void>();

  onDelete() {
    this.delete.emit();
  }
}
