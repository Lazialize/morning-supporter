export enum ConditionType {
  weather = 0,
  dayOfWeek = 1,
}

export interface IWeatherCondition {
  tense: number[];
  weatherId: number[];
}

export interface IDayOfWeekCondition {
  isOrdinal: boolean;
  dayOfWeeks:
    | number[]
    | {
        ordinal: number;
        dayOfWeek: number;
      };
}

export interface ICondition {
  conditionType: ConditionType;
  conditions: IWeatherCondition | IDayOfWeekCondition;
}
