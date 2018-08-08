export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Execution {
  weeksSinceEpoch: number;
  weekNumber: number;
  year: number;
  dayOfWeek: DayOfWeek;
  date: Date;
}