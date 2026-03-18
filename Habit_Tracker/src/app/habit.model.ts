export type HabitType = 'positive' | 'negative';

export interface Habit {
  id: string;
  name: string;
  type: HabitType;
  description: string;
  history: Array<Date>;
  streak: number;
}
