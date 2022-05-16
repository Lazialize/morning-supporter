/* eslint-disable */

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface BaseWeather {
  dt: number;
  sunrise: number;
  sunset: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  uvi: number;
  clouds: number;
  weather: Weather[];
}

interface CurrentWeather extends BaseWeather {
  temp: number;
  feels_like: number;
  visibility: number;
  rain: {
    '1h': number;
  };
}

interface DayWether extends BaseWeather {
  moonrise: number;
  moonset: number;
  moon_phase: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pop: number;
  rain: number;
}

export interface WeatherInfo {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: CurrentWeather;
  daily: DayWether[];
}
