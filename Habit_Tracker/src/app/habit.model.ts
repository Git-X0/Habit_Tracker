export type HabitType = 'positive' | 'negative';

export interface Habit {
  id: number;
  name: string;
  type: HabitType;
  description: string;
  history: Array<Date>;
  streak: number;
}
