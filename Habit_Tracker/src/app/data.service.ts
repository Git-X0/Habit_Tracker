import { Injectable } from '@angular/core';
import { Habit } from './habit.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly storageKey = 'habits';
  private habits$!: BehaviorSubject<Habit[]>;

  constructor() {
    const storedHabits = localStorage.getItem(this.storageKey);
    const initialHabits = storedHabits ? JSON.parse(storedHabits) : [];
    this.habits$ = new BehaviorSubject<Habit[]>(initialHabits);
  }

  private updateStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.habits$.value));
  }

  getHabits(): Observable<Habit[]> {
    return this.habits$.asObservable();
  }

  getPositiveHabits(): Observable<Habit[]> {
    return this.habits$.pipe(
      map((habits) => habits.filter((habit) => habit.type === 'positive')),
    );
  }

  getNegativeHabits(): Observable<Habit[]> {
    return this.habits$.pipe(
      map((habits) => habits.filter((habit) => habit.type === 'negative')),
    );
  }

  addHabit(habit: Omit<Habit, 'id' | 'history' | 'streak'>) {
    const newHabit: Habit = {
      id: Math.random().toString(36).substring(2),
      ...habit,
      history: [],
      streak: 0,
    };
    this.habits$.next([...this.habits$.value, newHabit]);
    this.updateStorage();
  }

  deleteHabit(id: string) {
    const updatedHabits = this.habits$.value.filter((habit) => habit.id !== id);
    this.habits$.next(updatedHabits);
    this.updateStorage();
  }

  updateHabit(updatedHabit: Habit) {
    const updatedHabits = this.habits$.value.map((habit) =>
      habit.id === updatedHabit.id ? updatedHabit : habit,
    );
    this.habits$.next(updatedHabits);
    this.updateStorage();
  }

  private generateHistory(streak: number): Date[] {
    const history: Date[] = [];

    // Current streak
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    for (let i = 0; i < streak; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      history.push(date);
    }

    // Past completions for demo
    for (let j = 0; j < 15; j++) {
      const past = new Date(now);
      past.setFullYear(past.getFullYear() - ((Math.random() * 2 + 0.5) | 0));
      past.setMonth((Math.random() * 12) | 0);
      past.setDate((Math.random() * 25 + 1) | 0);
      history.push(past);
    }

    // Unique days
    const unique = history.filter(
      (d, i, self) =>
        self.findIndex(
          (dd) =>
            dd.getFullYear() === d.getFullYear() &&
            dd.getMonth() === d.getMonth() &&
            dd.getDate() === d.getDate(),
        ) === i,
    );

    return unique.sort((a, b) => a.getTime() - b.getTime());
  }

  private generateDemoHabits(): Habit[] {
    const positiveHabits = [
      {
        name: 'Drink 8 glasses water',
        description: 'Stay hydrated daily',
        streak: 12,
      },
      { name: '30min walk daily', description: 'Get fresh air', streak: 5 },
      { name: 'Read 20 pages', description: 'Learn daily', streak: 0 },
      { name: 'Meditate 10min', description: 'Reduce stress', streak: 25 },
      { name: 'Journal daily', description: 'Reflect', streak: 8 },
      { name: 'Sleep 8hrs', description: 'Quality rest', streak: 2 },
      { name: 'Yoga 15min', description: 'Stretch & breathe', streak: 30 },
      { name: 'Floss teeth', description: 'Oral health', streak: 17 },
      { name: 'Cold shower', description: 'Build resilience', streak: 9 },
      { name: 'Gratitude list', description: 'Positive mindset', streak: 22 },
      { name: 'Eat veggies', description: 'Healthy meals', streak: 4 },
    ];

    const negativeHabits = [
      { name: 'No junk food', description: 'Eat clean', streak: 18 },
      { name: 'No soda', description: 'No sugar drinks', streak: 3 },
      { name: 'No smoking', description: 'Lung health', streak: 45 },
      { name: 'Bed before 11pm', description: 'Early sleep', streak: 7 },
      { name: 'No late snacks', description: 'Better digestion', streak: 11 },
      { name: 'No TV >1h', description: 'More productive', streak: 14 },
      { name: 'No doomscroll', description: 'Less screen', streak: 1 },
      { name: 'No complaining', description: 'Positive talk', streak: 28 },
      { name: 'Wake early', description: 'Morning routine', streak: 6 },
      { name: 'No caffeine late', description: 'Better sleep', streak: 19 },
      { name: 'No fast food', description: 'Home cooked', streak: 33 },
    ];

    const allTemplates = [...positiveHabits, ...negativeHabits];
    return allTemplates.map((template) => ({
      id: Math.random().toString(36).substring(2, 15),
      name: template.name,
      type:
        template.name.includes('No') ||
        template.name.includes('Before') ||
        template.name.includes('Wake')
          ? 'negative'
          : 'positive',
      description: template.description,
      streak: template.streak,
      history: this.generateHistory(template.streak),
    }));
  }

  resetToDemo() {
    this.habits$.next(this.generateDemoHabits());
    this.updateStorage();
  }

  getCurrentHabits(): Habit[] {
    return this.habits$.value;
  }

  updateAllHabits(habits: Habit[]): void {
    this.habits$.next(habits);
    this.updateStorage();
  }
}
