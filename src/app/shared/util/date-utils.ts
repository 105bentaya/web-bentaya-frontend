export class DateUtils {
  public static dateTruncatedToDay(date: Date | string, hours = 0, minutes = 0, seconds = 0, millis = 0) {
    const result = DateUtils.dateTruncatedToHours(date, minutes, seconds, millis);
    result.setHours(hours);
    return result;
  }

  public static dateTruncatedToHours(date: Date | string, minutes = 0, seconds = 0, millis = 0) {
    const result = DateUtils.dateTruncatedToMinutes(date, seconds, millis);
    result.setMinutes(minutes);
    return result;
  }

  public static shiftDateToUTC(date: Date) {
    date = new Date(date);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  }

  public static dateTruncatedToMinutes(date: Date | string, seconds = 0, millis = 0) {
    const result = new Date(date);
    result.setSeconds(seconds);
    result.setMilliseconds(millis);
    return result;
  }

  public static dateAtLastSecondOfDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    newDate.setSeconds(newDate.getSeconds() - 1);
    return newDate;
  }

  public static dateSorter(a: Date, b: Date): number {
    return new Date(a).toISOString().localeCompare(new Date(b).toISOString());
  }

  public static toLocalDate(date: Date) {
    date = new Date(date);
    return `${this.getYear(date)}-${this.getMonth(date)}-${this.getDay(date)}`;
  }

  public static toLocalUTCDate(date: Date) {
    date = new Date(date);
    return `${date.getUTCFullYear().toString().padStart(4, "0")}-${this.pad2(date.getUTCMonth() + 1)}-${this.pad2(date.getUTCDate())}`;
  }

  public static toLocalTime(date: Date) {
    return `${this.pad2(date.getHours())}:${this.pad2(date.getMinutes())}:${this.pad2(date.getSeconds())}`;
  }

  public static toLocalDateTime(date: Date) {
    return `${this.toLocalDate(date)}T${this.toLocalTime(date)}`;
  }

  private static getDay(date: Date) {
    return `${this.pad2(date.getDate())}`;
  }

  private static getMonth(date: Date) {
    return `${this.pad2(date.getMonth() + 1)}`;
  }

  private static getYear(date: Date) {
    return `${date.getFullYear().toString().padStart(4, "0")}`;
  }

  private static pad2(n: number) {
    return n.toString().padStart(2, "0");
  }

  static tomorrow() {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  }

  static plusDays(date: Date, days: number): Date {
    date = new Date(date);
    date.setDate(date.getDate() + days);
    return date;
  }
}
