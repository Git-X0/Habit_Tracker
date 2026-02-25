export interface Habit {
  id: number;
  name: string;
  type: 'positive' | 'negative';
  color: string;
  history: Date[];
  streak: number;
}
