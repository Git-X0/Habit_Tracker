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

  getCurrentHabits(): Habit[] {
    return this.habits$.value;
  }

  updateAllHabits(habits: Habit[]): void {
    this.habits$.next(habits);
    this.updateStorage();
  }
}
