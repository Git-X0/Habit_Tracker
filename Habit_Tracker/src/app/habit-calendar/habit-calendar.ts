import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitType } from '../habit.model';

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
}

@Component({
  selector: 'app-habit-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './habit-calendar.html',
  styleUrl: './habit-calendar.scss',
})
export class HabitCalendar implements OnInit {
  @Input() history: Date[] = [];
  @Input() habitType: HabitType = 'positive';

  currentDate = new Date();
  weeks: CalendarDay[][] = [];
  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  ngOnInit() {
    this.generateCalendar(this.currentDate);
  }

  generateCalendar(date: Date) {
    this.weeks = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const numDaysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay();

    let currentDay = 1;
    for (let i = 0; i < 6; i++) {
      // Max 6 weeks in a month
      const week: CalendarDay[] = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startDayOfWeek) {
          // Previous month's days
          const prevMonthLastDay = new Date(year, month, 0).getDate();
          const prevMonthDay = prevMonthLastDay - startDayOfWeek + j + 1;
          week.push({
            date: new Date(year, month - 1, prevMonthDay),
            day: prevMonthDay,
            isCurrentMonth: false,
          });
        } else if (currentDay > numDaysInMonth) {
          // Next month's days
          const nextMonthDay = currentDay - numDaysInMonth;
          week.push({
            date: new Date(year, month + 1, nextMonthDay),
            day: nextMonthDay,
            isCurrentMonth: false,
          });
          currentDay++;
        } else {
          // Current month's days
          const dayDate = new Date(year, month, currentDay);
          week.push({ date: dayDate, day: currentDay, isCurrentMonth: true });
          currentDay++;
        }
      }
      this.weeks.push(week);
      if (currentDay > numDaysInMonth) {
        break; // Stop if we've covered all days of the month
      }
    }
  }

  isDateInHistory(date: Date): boolean {
    return this.history.some(
      (historyDate) =>
        new Date(historyDate).getFullYear() === date.getFullYear() &&
        new Date(historyDate).getMonth() === date.getMonth() &&
        new Date(historyDate).getDate() === date.getDate(),
    );
  }

  previousMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1,
    );
    this.generateCalendar(this.currentDate);
  }

  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1,
    );
    this.generateCalendar(this.currentDate);
  }
}
