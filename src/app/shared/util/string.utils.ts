export class StringUtils {
  public static getUrlPath(url: string) {
    return url.split('#')[0].split('?')[0];
  }
}
