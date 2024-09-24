export default class FormUtils {
  static listToHtmlList(list: string[], keepMargin = false): string {
    return `<ul ${keepMargin ? '' : 'class="mb-0"'}><li>${list.join("</li><li>")}</li></ul>`;
  }
}
