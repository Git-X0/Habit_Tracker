import { Component, Input } from '@angular/core';
import { Habit } from '../habit.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-habit',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './habit.html',
  styleUrl: './habit.scss',
})
export class HabitComponent {
  @Input({ required: true }) habit!: Habit;
}
