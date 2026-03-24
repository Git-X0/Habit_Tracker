import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { HabitType } from '../habit.model';

type GraphMode = 'week' | 'month' | 'year' | 'all';

@Component({
  selector: 'app-habit-graph',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './habit-graph.html',
  styleUrl: './habit-graph.scss',
})
export class HabitGraph implements OnInit, OnChanges {
  @Input() history: Date[] = [];
  @Input() habitType: HabitType = 'positive';

  data: any[] = [];
  view: [number, number] = [400, 300];

  periodStartDate = new Date();
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

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Date';
  showYAxisLabel = true;
  yAxisLabel = 'Completions';

  selectedMode: GraphMode = 'week';

  changeSelected(mode: GraphMode) {
    this.selectedMode = mode;
    this.periodStartDate = this.computePeriodStart(mode);
    this.prepareChartData();
  }

  colorScheme: Color = {
    name: 'habitScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454'],
  };

  ngOnInit() {
    this.colorScheme.domain =
      this.habitType === 'positive' ? ['#5AA454'] : ['#A10A28'];
    this.selectedMode = 'week';
    this.periodStartDate = this.computePeriodStart(this.selectedMode);
    this.prepareChartData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['history']) {
      this.colorScheme.domain =
        this.habitType === 'positive' ? ['#5AA454'] : ['#A10A28'];
      this.periodStartDate = this.computePeriodStart(this.selectedMode);
      this.prepareChartData();
    } else if (changes['habitType']) {
      this.colorScheme.domain =
        this.habitType === 'positive' ? ['#5AA454'] : ['#A10A28'];
    }
  }

  computePeriodStart(mode: GraphMode): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    switch (mode) {
      case 'week':
        const monday = new Date(today);
        monday.setDate(today.getDate() - (today.getDay() || 7) + 1);
        return monday;
      case 'month':
        return new Date(today.getFullYear(), today.getMonth(), 1);
      case 'year':
        return new Date(today.getFullYear(), 0, 1);
      case 'all':
        if (this.history.length === 0) return new Date(0);
        const sorted = [...this.history]
          .map((d) => new Date(d))
          .sort((a, b) => a.getTime() - b.getTime());
        return new Date(sorted[0].getFullYear(), sorted[0].getMonth(), 1);
      default:
        return today;
    }
  }

  getPeriodTitle(): string {
    const m = this.monthNames[this.periodStartDate.getMonth()];
    const y = this.periodStartDate.getFullYear();
    switch (this.selectedMode) {
      case 'week':
        return `Week from ${this.periodStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      case 'month':
        return `${m} ${y}`;
      case 'year':
        return `${y}`;
      case 'all':
        return 'All Time';
      default:
        return '';
    }
  }

  prevPeriod() {
    if (this.selectedMode === 'all') return;
    const temp = new Date(this.periodStartDate);
    switch (this.selectedMode) {
      case 'week':
        temp.setDate(temp.getDate() - 7);
        break;
      case 'month':
        temp.setMonth(temp.getMonth() - 1);
        break;
      case 'year':
        temp.setFullYear(temp.getFullYear() - 1);
        break;
    }
    this.periodStartDate = temp;
    this.prepareChartData();
  }

  nextPeriod() {
    if (this.selectedMode === 'all') return;
    const current = this.computePeriodStart(this.selectedMode);
    if (this.periodStartDate.getTime() >= current.getTime()) return;
    const temp = new Date(this.periodStartDate);
    switch (this.selectedMode) {
      case 'week':
        temp.setDate(temp.getDate() + 7);
        break;
      case 'month':
        temp.setMonth(temp.getMonth() + 1);
        break;
      case 'year':
        temp.setFullYear(temp.getFullYear() + 1);
        break;
    }
    this.periodStartDate = temp;
    this.prepareChartData();
  }

  isCurrentPeriod(): boolean {
    if (this.selectedMode === 'all') return true;
    const current = this.computePeriodStart(this.selectedMode);
    return this.periodStartDate.getTime() === current.getTime();
  }

  prepareChartData() {
    const dataMap = new Map<string, number>();
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const DAY_MS = 24 * 60 * 60 * 1000;

    let labelOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };
    let binFunc = (date: Date) => {
      const normDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
      return normDate.toLocaleDateString('en-US', labelOptions);
    };
    let periodEndDate: Date;

    // Use periodStartDate as base, compute end based on mode
    const startDate = new Date(this.periodStartDate);
    startDate.setHours(0, 0, 0, 0);

    switch (this.selectedMode) {
      case 'week':
        labelOptions = { weekday: 'short', day: 'numeric' };
        periodEndDate = new Date(startDate);
        periodEndDate.setDate(startDate.getDate() + 6); // Sunday
        break;
      case 'month':
        periodEndDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          0,
        ); // Last day of month
        break;
      case 'year':
        periodEndDate = new Date(startDate.getFullYear(), 11, 31);
        break;
      case 'all':
        if (this.history.length === 0) {
          this.data = [];
          return;
        }
        const sortedHistory = [...this.history]
          .map((d) => new Date(d))
          .sort((a, b) => a.getTime() - b.getTime());
        startDate.setTime(sortedHistory[0].getTime()); // Start from first history
        periodEndDate = today;
        labelOptions = { year: 'numeric', month: 'short' };
        binFunc = (date: Date) =>
          new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString(
            'en-US',
            labelOptions,
          );
        break;
      default:
        periodEndDate = today;
    }

    // Cap end at today
    if (periodEndDate > today) periodEndDate = today;

    // Generate bins
    const bins: string[] = [];
    let current = new Date(startDate);
    while (current <= periodEndDate) {
      const key = binFunc(current);
      if (!bins.includes(key)) bins.push(key);
      dataMap.set(key, 0);
      current.setDate(current.getDate() + 1);
    }

    // Count history in range
    this.history.forEach((dStr) => {
      const date = new Date(dStr);
      if (date >= startDate && date <= periodEndDate && date <= today) {
        const key = binFunc(date);
        const count = (dataMap.get(key) || 0) + 1;
        dataMap.set(key, count);
      }
    });

    this.data = bins.map((name) => ({ name, value: dataMap.get(name) || 0 }));
    this.xAxisLabel =
      this.selectedMode.charAt(0).toUpperCase() + this.selectedMode.slice(1);
    this.yAxisLabel = 'Completions';
    this.view = [0, 300];
  }
}
