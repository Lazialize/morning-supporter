export interface IWeatherCondition {
  weatherIds: number[];
}

export interface IDayOfWeekWithOrdinal {
  ordinal: number;
  dayOfWeek: number;
}

export interface IDayOfWeekCondition {
  isOrdinal: boolean;
  ordinalDayOfWeek?: IDayOfWeekWithOrdinal;
  dayOfWeeks?: number[];
}

export interface ICondition {
  conditionType: 'weather' | 'dayOfWeek';
  weatherCondition?: IWeatherCondition;
  dayOfWeekCondition?: IDayOfWeekCondition;
}
