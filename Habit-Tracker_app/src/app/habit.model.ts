export interface Habit {
  id: number;
  name: string;
  type: string;
  description: string;
  color: string;
  history: Array<string>;
  streak: number;
}
