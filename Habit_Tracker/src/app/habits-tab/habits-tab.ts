import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Habit } from '../habit.model';
import { DataService } from '../data.service';
import { HabitsListComponent } from '../habits-list/habits-list';

@Component({
  selector: 'app-habits-tab',
  standalone: true,
  imports: [CommonModule, HabitsListComponent],
  templateUrl: './habits-tab.html',
  styleUrl: './habits-tab.scss',
})
export class HabitsTabComponent implements OnInit {
  @Input({ required: true }) type!: 'positive' | 'negative';
  habits$!: Observable<Habit[]>;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.habits$ =
      this.type === 'positive'
        ? this.dataService.getPositiveHabits()
        : this.dataService.getNegativeHabits();
  }

  onDeleteHabit(id: string) {
    this.dataService.deleteHabit(id);
  }

  onUpdateHabit(habit: Habit) {
    this.dataService.updateHabit(habit);
  }
}
