declare module "solarlunar" {
  export interface LunarInfo {
    lYear: number;
    lMonth: number;
    lDay: number;
    [key: string]: unknown;
  }

  export function solar2lunar(year: number, month: number, day: number): LunarInfo;
}
